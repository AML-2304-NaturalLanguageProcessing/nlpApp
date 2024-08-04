// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Sign in using Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    // Check if email is confirmed
    const user = data.user;
    if (user && !user.email_confirmed_at) {
      setError('Please confirm your email before logging in.');
      return;
    }

    // Redirect to homepage
    router.push('/homepage');
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-[#F8FFED]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg flex items-center">
        <div className="w-1/2">
          <img src="/images/reading_image_large.png" alt="Reading" className="w-full h-auto" />
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-2xl font-bold mb-4">User Login</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
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
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col items-center justify-between">
              <div>
                <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
                  Login
                </button>
              </div>
              <Link href="/forgot-password" legacyBehavior>
                <a className="text-green-700">Forgot Password?</a>
              </Link>
            </div>
          </form>
          <p className="mt-4">
            Don't have an account?{' '}
            <Link href="/signup" legacyBehavior>
              <a className="text-green-700">Sign Up</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
