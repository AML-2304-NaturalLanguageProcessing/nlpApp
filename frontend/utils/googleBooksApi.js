import axios from 'axios';

// Function to fetch books by query
export async function fetchBooksByQuery(query) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
    );
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching books by query:', error);
    return [];
  }
}

// Function to fetch books by query and emotion
export async function fetchBooksByQueryAndEmotion(query, emotionId) {
  try {
    const response = await axios.post('/api/predict', { query, emotion: emotionId });
    return response.data;
  } catch (error) {
    console.error('Error fetching books by query and emotion:', error);
    return [];
  }
}

// Function to fetch popular books
export async function fetchPopularBooks() {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=subject:popular&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
    );
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching popular books:', error);
    return [];
  }
}

// Function to handle search
export async function handleSearch(query, emotionId = null) {
  if (query.trim() !== '') {
    if (emotionId) {
      return await fetchBooksByQueryAndEmotion(query, emotionId);
    } else {
      return await fetchBooksByQuery(query);
    }
  } else {
    return await fetchPopularBooks();
  }
}
