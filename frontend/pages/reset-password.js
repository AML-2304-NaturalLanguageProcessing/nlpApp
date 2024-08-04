// pages/reset-password.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const queryParams = new URLSearchParams(hash.replace('#', '?'));
    const accessToken = queryParams.get('access_token') || queryParams.get('token');

    if (!accessToken) {
      setError('Invalid or missing reset token.');
    } else {
      setToken(accessToken);
      console.log('Access Token:', accessToken);
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    }, {
      accessToken: token,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password has been reset successfully. You can now login with your new password.');
      setTimeout(() => {
        router.push('/login');
      }, 3000); // Redirect to login page after 3 seconds
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-[#F8FFED]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-[#E0F0E8]"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-[#E0F0E8]"
              placeholder="Confirm your new password"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
              Reset Password
            </button>
            <Link href="/login" legacyBehavior>
              <a className="text-green-700">Back to Login</a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
