import torch
import torch.nn as nn
import numpy as np
import torch.nn.functional as F

from scipy.sparse import load_npz, csr_matrix

import pickle

with open('../models/book_id_map.pkl', 'rb') as f:
    book_id_map = pickle.load(f)

with open('../models/user_id_map.pkl', 'rb') as f:
    user_id_map = pickle.load(f)

user_book_matrix = load_npz('../models/user_book_matrix.npz')
emotion_matrix = load_npz('../models/emotion_matrix.npz')
book_embeddings = load_npz('../models/avg_embeddings_matrix.npz')

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
        loss = F.mse_loss(prediction, target, reduction='none')
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

#@TODO: Add error handling for user_id not found
try:
    user_id = user_id_map['AUZKKA1PDO8OC']  # Replace with the user ID you want to get recommendations for
except KeyError:
    print("User ID not found")
    exit()

target_emotion = 3  # Replace with the emotion index you want to target
item_ids = user_book_matrix.indices.tolist()
review_embeddings = book_embeddings[item_ids] 

# Initialize model, loss, and optimizer
num_users = 575887
num_items = 74298
num_emotions = 6
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = NCF(num_users, num_items, num_emotions, 
            embedding_dim=32, 
            review_embedding_dim=100, 
            mlp_dims=[256, 128, 64], 
            dropout=0.2).to(device)

# Load the best model checkpoint
class ModelLoader:
    def __init__(self, model, checkpoint_path, device):
        self.model = model
        self.checkpoint_path = checkpoint_path
        self.device = device

    def load_best_model(self):
        # Load the checkpoint
        checkpoint = torch.load(self.checkpoint_path, map_location=self.device)
        print(checkpoint.keys())
        # Check if the checkpoint contains a 'model_state_dict' key
        if 'model_state_dict' in checkpoint:
            state_dict = checkpoint['model_state_dict']
        else:
            state_dict = checkpoint
        
        # Load the state dictionary into the model
        self.model.load_state_dict(state_dict)
        return self.model


# Example usage
checkpoint_path = '../models/NCF_model_0.3.pth'
model_loader = ModelLoader(model, checkpoint_path, device)
model = model_loader.load_best_model()

recommendations = get_recommendations_with_popularity(
    model, user_id, target_emotion, item_ids, review_embeddings, user_book_matrix, k=10, top_n_popular=100
)

print(f"Top 10 recommendations for user {user_id} with emotion {target_emotion}:")
id_to_isbn = {v: k for k, v in book_id_map.items()}
for book_id, score in recommendations:
    item = id_to_isbn.get(book_id, "Unknown")
    print(f"Item {item}: Score {score:.4f}")