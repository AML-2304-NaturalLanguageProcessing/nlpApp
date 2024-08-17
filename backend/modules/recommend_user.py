import os
import torch
import torch.nn as nn
import numpy as np
import pickle
from flask import Blueprint, request, jsonify
from scipy.sparse import load_npz, csr_matrix
from dotenv import load_dotenv
from supabase import create_client, Client  # Import Supabase client


# Load environment variables from .env file
load_dotenv()

# Initialize Supabase client with error handling and debugging
supabase_url = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

if not supabase_url or not SUPABASE_ANON_KEY:
    error_message = (
        "Supabase URL and Key must be provided as environment variables. "
        "Make sure you have a .env file with SUPABASE_URL and SUPABASE_ANON_KEY defined, "
        "or set these variables in your environment."
    )
    raise ValueError(error_message)

try:
    supabase: Client = create_client(supabase_url, SUPABASE_ANON_KEY)
except Exception as e:
    raise ConnectionError(f"Failed to create Supabase client: {e}")

# Retrieve the paths from environment variables
model_path = os.getenv('MODEL_PATH')
book_id_map_path = os.getenv('BOOK_ID_MAP_PATH')
user_id_map_path = os.getenv('USER_ID_MAP_PATH')
user_book_matrix_path = os.getenv('USER_BOOK_MATRIX_PATH')

# Blueprint setup
recommend_user_bp = Blueprint('recommend_user', __name__)

# Load necessary data
with open(book_id_map_path, 'rb') as f:
    book_id_map = pickle.load(f)

with open(user_id_map_path, 'rb') as f:
    user_id_map = pickle.load(f)

user_book_matrix = load_npz(user_book_matrix_path)
emotion_matrix = load_npz(os.getenv('EMOTION_MATRIX_PATH', 'models/emotion_matrix.npz'))
book_embeddings = load_npz(os.getenv('BOOK_EMBEDDINGS_PATH', 'models/avg_embeddings_matrix.npz'))

@recommend_user_bp.route('/recommend-books', methods=['POST'])
def recommend_books():
    data = request.json
    user_id = data.get('user_id')
    emotion_id = data.get('emotion_id')

    if not user_id or not emotion_id:
        return jsonify({'error': 'user_id and emotion_id are required'}), 400

    # Fetch user_id_be from the users table using Supabase
    try:
        user_response = supabase.table('users').select('user_id_be').eq('id', user_id).single()
        user_details = user_response.get('data', None)
    except Exception as e:
        return jsonify({'error': f'Error fetching user details: {str(e)}'}), 500

    if not user_details:
        return jsonify({'error': 'User not found'}), 404

    user_id_be = user_details['user_id_be']

    # Now use the user_id_be for recommendations
    recommended_books, error = get_book_recommendations(user_id_be, emotion_id)

    if error:
        return jsonify({'error': error}), 404

    return jsonify(recommended_books)

class NCF(nn.Module):
    def __init__(self, num_users, num_items, num_emotions, review_embedding_dim, 
                 embedding_dim=64, mlp_dims=[256, 128, 64], dropout=0.2):
        super(NCF, self).__init__()
        
        # Embedding layers
        self.user_embedding_mf = nn.Embedding(num_users, embedding_dim)
        self.item_embedding_mf = nn.Embedding(num_items, embedding_dim)
        self.user_embedding_mlp = nn.Embedding(num_users, embedding_dim)
        self.item_embedding_mlp = nn.Embedding(num_items, embedding_dim)
        self.emotion_embedding = nn.Embedding(num_emotions, embedding_dim)
        
        # Personalized Emotional Weighting
        self.emotion_weight = nn.Parameter(torch.ones(num_users, 1))
        
        # MF layer
        self.mf_output = embedding_dim
        
        # MLP layers
        self.mlp = nn.ModuleList()
        input_dim = embedding_dim * 3 + review_embedding_dim  # user + item + emotion + review
        mlp_dims = [input_dim] + mlp_dims
        for i in range(len(mlp_dims) - 1):
            self.mlp.append(nn.Linear(mlp_dims[i], mlp_dims[i+1]))
            self.mlp.append(nn.ReLU())
            self.mlp.append(nn.BatchNorm1d(mlp_dims[i+1]))
            self.mlp.append(nn.Dropout(dropout))
        
        # Final prediction layer
        self.final = nn.Linear(self.mf_output + mlp_dims[-1], 1)
        
    def forward(self, user_indices, item_indices, emotion_indices, review_embeddings):
        # MF component
        user_embedding_mf = self.user_embedding_mf(user_indices)
        item_embedding_mf = self.item_embedding_mf(item_indices)
        mf_vector = torch.mul(user_embedding_mf, item_embedding_mf)
        
        # MLP component
        user_embedding_mlp = self.user_embedding_mlp(user_indices)
        item_embedding_mlp = self.item_embedding_mlp(item_indices)
        emotion_embedding = self.emotion_embedding(emotion_indices)
        
        # Personalized Emotional Weighting
        emotion_weight = self.emotion_weight[user_indices]
        weighted_emotion_embedding = emotion_embedding * emotion_weight.unsqueeze(1)
        weighted_emotion_embedding = weighted_emotion_embedding.mean(dim=1)
        
        mlp_vector = torch.cat([user_embedding_mlp, item_embedding_mlp, weighted_emotion_embedding, review_embeddings], dim=-1)
        
        for layer in self.mlp:
            mlp_vector = layer(mlp_vector)
        
        # Combine MF and MLP
        combined = torch.cat([mf_vector, mlp_vector], dim=-1)
        
        # Final prediction
        prediction = self.final(combined)
        
        return prediction.squeeze()

    def loss(self, prediction, target, gamma=2.0):
        loss = nn.MSELoss(reduction='none')(prediction, target)
        pt = torch.exp(-loss)  # Probability of the prediction
        focal_loss = ((1 - pt) ** gamma) * loss
        return focal_loss.mean()

def get_popular_items(user_book_matrix, top_n=100):
    # Sum interactions for each item (column-wise sum)
    item_popularity = np.array(user_book_matrix.sum(axis=0)).flatten()
    # Get the indices of the top N most popular items
    popular_item_indices = np.argsort(item_popularity)[::-1][:top_n]
    return popular_item_indices

def get_recommendations_for_user_emotion(model, user_id, target_emotion, item_ids, review_embeddings, k=10):
    model.eval()
    with torch.no_grad():
        # Prepare input tensors
        user_tensor = torch.full((len(item_ids),), user_id, dtype=torch.long)
        item_tensor = torch.tensor(item_ids, dtype=torch.long)
        emotion_tensor = torch.full((len(item_ids),), target_emotion, dtype=torch.long)

        # Convert sparse matrix to dense format
        if isinstance(review_embeddings, csr_matrix):
            review_embeddings = review_embeddings.toarray()

        review_emb_tensor = torch.tensor(review_embeddings, dtype=torch.float)
        # Move tensors to the same device as the model
        device = next(model.parameters()).device
        user_tensor = user_tensor.to(device)
        item_tensor = item_tensor.to(device)
        emotion_tensor = emotion_tensor.to(device)
        review_emb_tensor = review_emb_tensor.to(device)
        # Generate predictions
        predictions = model(user_tensor, item_tensor, emotion_tensor, review_emb_tensor)
        predictions = predictions.cpu().numpy()
        # Sort items by prediction score
        sorted_indices = np.argsort(predictions)[::-1]
        top_k_items = [item_ids[i] for i in sorted_indices[:k]]
        top_k_scores = predictions[sorted_indices[:k]]
        return list(zip(top_k_items, top_k_scores))

def get_recommendations_with_popularity(model, user_id, target_emotion, item_ids, review_embeddings, user_book_matrix, k=10, top_n_popular=100):
    model.eval()
    
    # Step 1: Get popular items
    popular_item_indices = get_popular_items(user_book_matrix, top_n=top_n_popular)
    
    # Step 2: Filter item_ids to include only popular items
    popular_item_ids = [item_ids[i] for i in popular_item_indices]
    popular_review_embeddings = review_embeddings[popular_item_indices]
    
    # Step 3: Get model-based recommendations for popular items
    recommendations = get_recommendations_for_user_emotion(
        model, user_id, target_emotion, popular_item_ids, popular_review_embeddings, k
    )
    
    return recommendations

# Example usage (ensure this block is inside a function or called appropriately)
def main():
    try:
        user_id = user_id_map['AUZKKA1PDO8OC']  # Replace with the user ID you want to get recommendations for
    except KeyError:
        print("User ID not found")
        return

    target_emotion = 1  # Replace with the emotion index you want to target
    item_ids = user_book_matrix.indices.tolist()
    review_embeddings = book_embeddings[item_ids] 

    # Initialize model, loss, and optimizer
    num_users = 575887
