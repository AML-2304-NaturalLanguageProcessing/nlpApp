from flask import Blueprint, request, jsonify
import tensorflow as tf
import joblib
import json

predict_bp = Blueprint('predict', __name__)

# Load your deep learning model
model = tf.keras.models.load_model('path_to_your_model.h5')

# Function to load books data
def load_books_data():
    with open('backend/data/books-data.json', 'r') as file:
        return json.load(file)

@predict_bp.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        query = data.get('query')
        emotion_id = data.get('emotion')
        
        # Load books data
        books_data = load_books_data()

        # Process query and emotion_id with your model
        # This is a placeholder, you should replace it with your actual model prediction logic
        results = model.predict([query, emotion_id])
        
        # Filter or rank books based on the model results
        # This is also a placeholder logic
        filtered_books = [book for book in books_data if book['id'] in results]
        
        return jsonify(filtered_books), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": "An error occurred during prediction."}), 500
