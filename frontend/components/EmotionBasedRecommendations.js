import React, { useState, useEffect } from 'react';
import { fetchRecommendationsByEmotion } from '../utils/hybridRecommendationApi';

export default function EmotionBasedRecommendations({ emotions }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      if (emotions.length > 0) {
        const emotionBooks = await fetchRecommendationsByEmotion(emotions);
        console.log("Received books:", emotionBooks); // Debugging log
        if (emotionBooks.error) {
          console.error('No matching books found.');
        } else {
          setBooks(emotionBooks);
        }
      }
    }
    loadBooks();
  }, [emotions]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Books for Your Emotions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div key={index} className="bg-gray-200 text-gray-800 py-2 px-4 rounded flex flex-col items-center">
              <img src={book.thumbnail} alt={book.title} className="mb-2" />
              <h3 className="text-center">{book.title}</h3>
              <p className="text-center">{book.author}</p>
              <p className="text-center">{book.category}</p>
            </div>
          ))
        ) : (
          <p>No books found for the selected emotions.</p>
        )}
      </div>
    </div>
  );
}
