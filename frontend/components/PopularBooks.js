import React, { useEffect, useState } from 'react';
import { fetchPopularBooks } from '../utils/googleBooksApi';

export default function PopularBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      const popularBooks = await fetchPopularBooks();
      setBooks(popularBooks);
    }
    loadBooks();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
        {books && books.length > 0 ? (
          books.map((book, index) => (
            <div key={index} className="bg-white text-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src={book.volumeInfo?.imageLinks?.thumbnail || '/default-book.png'}
                alt={book.volumeInfo?.title || 'No title available'}
                className="mb-4 w-32 h-40 object-cover"
              />
              <h3 className="text-center font-semibold">{book.volumeInfo?.title || 'No title available'}</h3>
              <p className="text-center">{book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  );
}
