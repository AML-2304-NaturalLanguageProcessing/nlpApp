import React, { useState, useEffect } from 'react';
import PopularBooks from '../components/PopularBooks';
import { fetchBooksByQuery } from '../utils/googleBooksApi';
import axios from 'axios';

export default function Homepage() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [userIdBe, setUserIdBe] = useState(null);

  // Access the API URL from environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    console.log("API URL:", apiUrl); // Verify API URL is correct

    // Retrieve stored emotion and user ID from session storage
    const storedEmotion = sessionStorage.getItem('selectedEmotion');
    const storedUserIdBe = sessionStorage.getItem('user_id_be');

    if (storedUserIdBe) {
      setUserIdBe(storedUserIdBe);
    }

    if (storedEmotion) {
      setSelectedEmotion(parseInt(storedEmotion, 10));
      handleEmotionClick(parseInt(storedEmotion, 10), storedUserIdBe); // Fetch recommendations for stored emotion
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      const books = await fetchBooksByQuery(searchQuery);
      setSearchResults(books);
    }
  };

  const handleEmotionClick = async (emotionId, userIdBe) => {
    setSelectedEmotion(emotionId);
    sessionStorage.setItem('selectedEmotion', emotionId);

    // Ensure userIdBe is set before making the request
    if (!userIdBe) {
      console.error('User ID is not set.');
      return;
    }

    // Create the requestData object here
    const requestData = {
      user_id: userIdBe,
      emotion_id: emotionId
    };

    console.log(`Emotion ${emotionId} selected. Sending request to backend with data:`, requestData);

    try {
      const response = await axios.post(`${apiUrl}/api/recommend-books`, requestData);
      console.log('Received response:', response.data);
      setRecommendedBooks(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };
  useEffect(() => {
    if (searchQuery === '') {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="text-center bg-[#fefffb]">
      <h1 className="text-3xl md:text-5xl font-bold my-8">How are you feeling today?</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
        {[{ id: 1, name: 'Sadness' }, { id: 2, name: 'Joy' }, { id: 3, name: 'Love' }, { id: 4, name: 'Anger' }, { id: 5, name: 'Fear' }, { id: 6, name: 'Surprise' }].map((emotion) => (
          <button
            key={emotion.id}
            className={`bg-green-200 text-green-800 py-2 px-4 rounded ${selectedEmotion === emotion.id ? 'bg-green-600 text-white' : ''}`}
            onClick={() => handleEmotionClick(emotion.id, userIdBe)}
          >
            {emotion.name}
          </button>
        ))}
      </div>

      <p className="text-gray-700 mb-4">
        Enter the title, author, or keyword of a book you recently read and enjoyed, or any book that interests you. The more titles, authors, or keywords you provide, the more accurately we can tailor our recommendations to your preferences.
      </p>

      <form onSubmit={handleSearchSubmit} className="search-container my-8">
        <input
          type="text"
          placeholder="SEARCH BY TITLE, AUTHOR OR KEYWORD"
          className="search-input w-full p-2 border rounded text-black text-center"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>

      <h2 className="text-2xl font-bold my-8">Discover Your Perfect Match Book</h2>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
          {searchResults.map((book, index) => (
            <div key={index} className="bg-white text-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src={book.volumeInfo?.imageLinks?.thumbnail || '/default-book.png'}
                alt={book.volumeInfo?.title || 'No title available'}
                className="mb-4 w-32 h-40 object-cover"
              />
              <h3 className="text-center font-semibold">{book.volumeInfo?.title || 'No title available'}</h3>
              <p className="text-center">{book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
            </div>
          ))}
        </div>
      ) : recommendedBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
          {recommendedBooks.map((book, index) => (
            <div key={index} className="bg-white text-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src={book.volumeInfo?.imageLinks?.thumbnail || '/default-book.png'}
                alt={book.volumeInfo?.title || 'No title available'}
                className="mb-4 w-32 h-40 object-cover"
              />
              <h3 className="text-center font-semibold">{book.volumeInfo?.title || 'No title available'}</h3>
              <p className="text-center">{book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
            </div>
          ))}
        </div>
      ) : (
        <PopularBooks />
      )}

      <div className="mt-8">
        <button className="bg-black text-white py-2 px-6 rounded-full">Free Trial For 30 Days</button>
      </div>
    </div>
  );
}
