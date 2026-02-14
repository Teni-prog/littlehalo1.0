import { createClient } from '@/lib/supabase/server';

/**
 * Demo Authentication Helper Functions
 * 
 * These functions provide simple database queries for demo authentication.
 * When ready to implement real authentication, replace these with Supabase Auth methods.
 */

/**
 * Get user by ID
 * @param {string} userId - The user's UUID
 * @returns {Promise<Object|null>} User object with sitter_profile and children, or null if not found
 */
export async function getUserById(userId) {
    try {
        const supabase = await createClient();

        const { data: user, error } = await supabase
            .from('users')
            .select(`
        *,
        sitter_profile:sitter_profiles(*),
        children:children(*)
      `)
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error in getUserById:', error);
        return null;
    }
}

/**
 * Get user by email
 * @param {string} email - The user's email address
 * @returns {Promise<Object|null>} User object with sitter_profile and children, or null if not found
 */
export async function getUserByEmail(email) {
    try {
        const supabase = await createClient();

        const { data: user, error } = await supabase
            .from('users')
            .select(`
        *,
        sitter_profile:sitter_profiles(*),
        children:children(*)
      `)
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error in getUserByEmail:', error);
        return null;
    }
}

/**
 * Get all users
 * @returns {Promise<Array>} Array of all users with sitter_profile data
 */
export async function getAllUsers() {
    try {
        const supabase = await createClient();

        const { data: users, error } = await supabase
            .from('users')
            .select(`
        *,
        sitter_profile:sitter_profiles(*)
      `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all users:', error);
            return [];
        }

        return users || [];
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return [];
    }
}

/**
 * Get users by type (parent or sitter)
 * @param {string} userType - 'parent' or 'sitter'
 * @returns {Promise<Array>} Array of users matching the type
 */
export async function getUsersByType(userType) {
    try {
        const supabase = await createClient();

        const { data: users, error } = await supabase
            .from('users')
            .select(`
        *,
        sitter_profile:sitter_profiles(*)
      `)
            .eq('user_type', userType)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users by type:', error);
            return [];
        }

        return users || [];
    } catch (error) {
        console.error('Error in getUsersByType:', error);
        return [];
    }
}
