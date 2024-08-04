import Layout from '../components/Layout';
import Link from 'next/link';

export default function UserCollections() {
  return (
      <div className="flex flex-row h-full bg-[#F8FFED]">
        {/* Sidebar */}
        <div className="w-1/5 bg-green-100 p-4">
          <div className="flex flex-col space-y-4">
            <Link href="/all-books" legacyBehavior>
              <a className="bg-white hover:bg-green-200 p-2 rounded-lg block text-center">All Books</a>
            </Link>
            <Link href="/collections" legacyBehavior>
              <a className="bg-green-300 p-2 rounded-lg block text-center">Collections</a>
            </Link>
            <Link href="/all-books" legacyBehavior>
              <a className="bg-white hover:bg-green-200 p-2 rounded-lg block text-center">All Books</a>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-4/5 p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Collections</h2>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              <Link href="/" legacyBehavior>
                <a className="flex items-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </a>
              </Link>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Replace with dynamic content */}
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
            <div className="bg-green-200 p-4 rounded-lg">
              Title<br />Author<br />Tags
            </div>
          </div>
        </div>
      </div>
  );
}
