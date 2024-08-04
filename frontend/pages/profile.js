import { useState } from 'react';
import Layout from '../components/Layout';
import { updateProfile } from '../lib/profile';

export default function Profile() {
  const [profileName, setProfileName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateProfile(profileName, profilePicture);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout home={false}>
      <div className="flex flex-col items-center justify-center flex-grow bg-[#F8FFED]">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700">Profile Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-[#E0F0E8]"
                placeholder="Enter your profile name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Profile Picture URL</label>
              <input
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-[#E0F0E8]"
                placeholder="Enter the URL of your profile picture"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
