import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { signup } from '../lib/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const user = await signup(email, password);
      setSuccess("Signup successful! Please check your email for the confirmation link.");
      console.log("Signed up user:", user); // Debugging log
    } catch (error) {
      setError(error.message);
      console.error("Signup error:", error); // Debugging log
    }
  };

  return (
      <div className="flex flex-col items-center justify-center flex-grow bg-[#F8FFED]">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-[#E0F0E8]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-[#E0F0E8]"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-[#E0F0E8]"
                placeholder="Confirm your password"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-4">
            Already have an account?{' '}
            <Link href="/login" legacyBehavior>
              <a className="text-green-700">Login</a>
            </Link>
          </p>
        </div>
      </div>
  );
}
