import os
from flask import Flask, request, jsonify  # Ensure jsonify is imported
from flask_cors import CORS
from modules.recommend_user import recommend_user_bp  # Import the blueprint
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create Flask app instance
app = Flask(__name__)

# Define CORS options
cors_options = {
    "origins": ["http://localhost:3000"],  # Assuming your React app runs on port 3000
    "supports_credentials": True,
    "methods": ["GET", "POST", "PUT", "DELETE"]
}

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Book Recommendation API"}), 200

if __name__ == "__main__":
    # Dynamically handle environment variables
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
