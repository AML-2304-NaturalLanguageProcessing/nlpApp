import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import PopularBooks from '../components/PopularBooks';
import { fetchBooksByQuery, fetchPopularBooks } from '../utils/googleBooksApi';

export default function Home() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

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

  useEffect(() => {
    if (searchQuery === '') {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Load popular books on initial load
  useEffect(() => {
    async function loadPopularBooks() {
      const books = await fetchPopularBooks();
      setPopularBooks(books);
    }
    loadPopularBooks();
  }, []);

  const handleEmotionClick = async (emotionId) => {
    // Save the selected emotion in sessionStorage
    sessionStorage.setItem('selectedEmotion', emotionId);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // User is not logged in, redirect to login page and remember the selected emotion
      router.push('/login'); // Adjust this route to your login/signup page
    } else {
      // User is logged in, redirect to homepage and fetch recommendations
      router.push('/homepage');
    }
  };

  return (
      <div className="text-center bg-[#fefffb]">
        <h1 className="text-3xl md:text-5xl font-bold my-8">How are you feeling today?</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
          {[{ id: 1, name: 'Sadness' }, { id: 2, name: 'Joy' }, { id: 3, name: 'Love' }, { id: 4, name: 'Anger' }, { id: 5, name: 'Fear' }, { id: 6, name: 'Surprise' }].map((emotion) => (
            <button 
              key={emotion.id} 
              className="bg-green-200 text-green-800 py-2 px-4 rounded"
              onClick={() => handleEmotionClick(emotion.id)}
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
        ) : popularBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
            {popularBooks.map((book, index) => (
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
          <p>No books available</p>
        )}
        <div className="mt-8">
          <button className="bg-black text-white py-2 px-6 rounded-full">Free Trial For 30 Days</button>
        </div>
      </div>
  );
}
