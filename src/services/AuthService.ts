import { supabase } from '../lib/supabase';

export interface SignUpData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    venmoUsername?: string;
    username?: string;
}

export interface UserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    venmo_username: string | null;
    username: string | null;
    profile_picture_url: string | null;
    created_at: string;
    updated_at: string;
}

export const AuthService = {
    /**
     * Sign up a new user with email and password
     */
    async signUp(data: SignUpData) {
        const { email, password, firstName, lastName, phone, venmoUsername, username } = data;

        // Validate .edu email if required
        if (!email.endsWith('.edu')) {
            throw new Error('Please use a .edu email address to sign up.');
        }

        const { data: authData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    venmo_username: venmoUsername,
                    username,
                },
            },
        });

        if (error) throw error;
        return authData;
    },

    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in with Apple (OAuth)
     */
    async signInWithApple() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign out the current user
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Send password reset email
     */
    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'beepfood://reset-password',
        });
        if (error) throw error;
    },

    /**
     * Get the current authenticated user
     */
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    /**
     * Get the current user's profile
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: Partial<UserProfile>) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Listen to authentication state changes
     */
    onAuthStateChange(callback: (session: any) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
    },

    /**
     * Get current session
     */
    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    },
};
