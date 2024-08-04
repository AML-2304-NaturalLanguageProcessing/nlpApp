import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { supabase } from '../utils/supabaseClient';
import PopularBooks from '../components/PopularBooks';
import { fetchPopularBooks } from '../utils/googleBooksApi';

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [popularBooks, setPopularBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch popular books on initial load
    const loadPopularBooks = async () => {
      const books = await fetchPopularBooks();
      setPopularBooks(books);
    };
    loadPopularBooks();
  }, []);

  const handleEmotionClick = async (emotionId) => {
    const { data: { session } } = await supabase.auth.getSession();

    // Save the selected emotion in localStorage
    localStorage.setItem('selectedEmotion', emotionId);

    if (!session) {
      // User is not logged in, redirect to signup/login page
      router.push('/login'); // Adjust this route to your login/signup page
    } else {
      // User is logged in, redirect to user's homepage
      router.push('/homepage');
    }
  };

  return (
    <Layout>
      <div className="text-center bg-[#fefffb]">
        <h1 className="text-3xl md:text-5xl font-bold my-8">How are you feeling today?</h1>

        {/* Emotion Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
          {[{ id: 1, name: 'Sadness' }, { id: 2, name: 'Joy' }, { id: 3, name: 'Love' }, { id: 4, name: 'Anger' }, { id: 5, name: 'Fear' }, { id: 6, name: 'Surprise' }].map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionClick(emotion.id)}
              className="bg-green-200 text-green-800 py-2 px-4 rounded"
            >
              {emotion.name}
            </button>
          ))}
        </div>

        <p className="text-gray-700 mb-4">
          Enter the title, author, or keyword of a book you recently read and enjoyed, or any book that interests you. The more titles, authors, or keywords you provide, the more accurately we can tailor our recommendations to your preferences.
        </p>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          placeholder="SEARCH BY TITLE, AUTHOR OR KEYWORD"
        />

        {/* Popular Books Section */}
        <section className="my-8">
          <PopularBooks books={popularBooks} />
        </section>

        {/* Free Trial Banner */}
        <div className="free-trial-banner">
          <p className="text-gray-700 mb-4">Free Trial For 30 Days</p>
        </div>

        {/* App Links */}
        <div className="text-center">
          <p className="mb-4">Get Our Free App</p>
          <div className="flex justify-center space-x-4 mb-4">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/google-play-badge.png" alt="Google Play" className="w-32 h-auto" />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src="/images/app-store-badge.png" alt="App Store" className="w-32 h-auto" />
            </a>
          </div>
          <a href="/about-us" className="text-green-700">About us</a>
        </div>
      </div>
    </Layout>
  );
}