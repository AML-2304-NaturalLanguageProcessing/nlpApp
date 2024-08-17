import React, { useState } from 'react';
import axios from 'axios';

export default function EmotionSelector() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const handleEmotionClick = async (emotionId) => {
    setSelectedEmotion(emotionId);

    try {
      // Send a POST request to the Flask backend to get recommendations
      const response = await axios.post('/recommend-books', { emotion_id: emotionId });
      
      // Update the state with the recommended books
      setRecommendedBooks(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div>
      <h1>How are you feeling today?</h1>
      <div>
        {/* Example emotion buttons */}
        {[{ id: 1, name: 'Sadness' }, { id: 2, name: 'Joy' }, { id: 3, name: 'Love' }].map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => handleEmotionClick(emotion.id)}
            className={selectedEmotion === emotion.id ? 'selected' : ''}
          >
            {emotion.name}
          </button>
        ))}
      </div>

      {/* Display recommended books */}
      <div>
        <h2>Recommended Books</h2>
        <ul>
          {recommendedBooks.map((book, index) => (
            <li key={index}>
              <img src={book.volumeInfo?.imageLinks?.thumbnail} alt={book.volumeInfo?.title} />
              <p>{book.volumeInfo?.title}</p>
              <p>{book.volumeInfo?.authors?.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
