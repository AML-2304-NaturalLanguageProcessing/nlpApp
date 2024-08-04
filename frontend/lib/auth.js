// lib/auth.js
import { supabase } from './supabase';

export const signup = async (email, password) => {
  try {
    // Check if the email already exists
    let { data: existingEmails, error: emailError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (emailError) throw emailError;
    if (existingEmails.length > 0) throw new Error('Email already exists');

    // Sign up the user
    let { user, session, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;
    if (!user) {
      throw new Error('Please check your email for the confirmation link');
    }

    console.log("User:", user); // Debugging log

    // Insert the new user into the users table
    let { error: insertError } = await supabase
      .from('users')
      .insert([{ id: user.id, email }]);

    if (insertError) throw insertError;

    return user;
  } catch (error) {
    console.error("Signup error:", error); // Debugging log
    throw error;
  }
};
