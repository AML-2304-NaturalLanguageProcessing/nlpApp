import Layout from '../components/Layout';

export default function BookReviewSummary({ book }) {
  return (
    <Layout>
      <div className="container mx-auto px-8 py-4 bg-[#F8FFED]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold">{book.title}</h2>
            <p className="text-xl">{book.author}</p>
            <p className="text-md mb-4">{book.description}</p>
            <div className="flex items-center mb-4">
              <span className="text-lg font-bold">{book.rating}</span>
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.172 3.609a1 1 0 00.95.691h3.907c.969 0 1.371 1.24.588 1.81l-3.157 2.304a1 1 0 00-.363 1.118l1.172 3.609c.3.921-.755 1.688-1.538 1.118l-3.157-2.304a1 1 0 00-1.175 0l-3.157 2.304c-.783.57-1.838-.197-1.538-1.118l1.172-3.609a1 1 0 00-.363-1.118L2.34 9.037c-.783-.57-.38-1.81.588-1.81h3.907a1 1 0 00.95-.691L9.049 2.927z" />
              </svg>
              <span className="text-md ml-2">{book.reviews} Reviews</span>
            </div>
          </div>
          <div className="w-40 h-40 bg-gray-200">
            <img src={book.image_url || '/default-book.png'} alt={book.title} className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
        <div className="bg-gray-200 w-full h-96 mb-4"></div>
        <div className="text-center">
          <p className="mb-4">Get Our Free Apps</p>
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

// This function is used to fetch the book parameter dynamically if using Next.js dynamic routes
BookReviewSummary.getInitialProps = async (context) => {
  const { bookId } = context.query;
  const book = await fetchBookDetails(bookId); // Replace with actual API call to fetch book details
  return { book };
};

async function fetchBookDetails(bookId) {
  // Mock API call, replace with actual data fetching logic
  return {
    title: "Sample Book Title",
    author: "Sample Author",
    description: "This is a sample book description.",
    rating: 4.0,
    reviews: 25,
    image_url: "/images/sample-book.png"
  };
}
