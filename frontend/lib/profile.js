// lib/profile.js
import { supabase } from './supabase';

export const updateProfile = async (profileName, profilePicture) => {
  const user = supabase.auth.user();
  
  if (!user) throw new Error('User not logged in');

  let updates = {
    id: user.id,
    profile_name: profileName,
    profile_picture: profilePicture,
    updated_at: new Date()
  };

  let { error } = await supabase.from('users').upsert(updates, {
    returning: 'minimal', // Don't return the value after inserting
  });

  if (error) throw error;
};
