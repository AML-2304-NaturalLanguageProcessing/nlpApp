// pages/forgot-password.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-[#F8FFED]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg flex items-center">
        <div className="w-1/2">
          <img src="/images/reading_image_large.png" alt="Reading" className="w-full h-auto" />
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          <form className="space-y-4" onSubmit={handleForgotPassword}>
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
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <div className="flex flex-col items-center justify-between">
                <div>
              <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
                Send Reset Link
              </button></div>
              <Link href="/login" legacyBehavior>
                <a className="text-green-700">Back to Login</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
