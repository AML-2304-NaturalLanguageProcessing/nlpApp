import Layout from '../components/Layout';

export default function EmotionBooks({ emotion }) {
  return (
      <div className="container mx-auto px-8 py-4 bg-[#F8FFED]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{emotion} (View All)</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* Replace with dynamic content */}
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
          <div className="bg-green-200 p-4 rounded-lg">Title<br />Author<br />Category</div>
        </div>
      </div>
  );
}

// This function is used to fetch the emotion parameter dynamically if using Next.js dynamic routes
EmotionBooks.getInitialProps = async (context) => {
  const { emotion } = context.query;
  return { emotion };
};
