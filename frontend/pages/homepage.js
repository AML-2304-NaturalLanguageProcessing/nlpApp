import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchBooksByQuery } from '../utils/googleBooksApi';
import PopularBooks from '../components/PopularBooks';

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  return (
    <Layout>
      <div className="text-center bg-[#fefffb]">
        <h1 className="text-3xl md:text-5xl font-bold my-8">How are you feeling today?</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
          {[{ id: 1, name: 'Sadness' }, { id: 2, name: 'Joy' }, { id: 3, name: 'Love' }, { id: 4, name: 'Anger' }, { id: 5, name: 'Fear' }, { id: 6, name: 'Surprise' }].map((emotion) => (
            <button key={emotion.id} className="bg-green-200 text-green-800 py-2 px-4 rounded">
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
        ) : (
          <PopularBooks />
        )}
        <div className="mt-8">
          <button className="bg-black text-white py-2 px-6 rounded-full">Free Trial For 30 Days</button>
        </div>
      </div>
    </Layout>
  );
}
