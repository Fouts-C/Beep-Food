import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

export interface SignUpData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    venmoUsername?: string;
    username?: string;
    profilePicBase64?: string;
    profilePicMimeType?: string;
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
        const { email, password, firstName, lastName, phone, venmoUsername, username, profilePicBase64, profilePicMimeType } = data;

        // Validate .edu email if required
        if (!email.endsWith('.edu')) {
            throw new Error('Please use a .edu email address to sign up.');
        }

        let profilePictureUrl: string | undefined = undefined;

        if (profilePicBase64 && profilePicMimeType) {
            try {
                const fileExt = profilePicMimeType.split('/')[1] || 'jpg';
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(`public/${fileName}`, decode(profilePicBase64), {
                        contentType: profilePicMimeType,
                    });

                if (uploadError) {
                    console.error('Error uploading profile pic:', uploadError);
                } else if (uploadData) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(uploadData.path);
                    profilePictureUrl = publicUrl;
                }
            } catch (err) {
                console.error('Failed to upload image', err);
            }
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
                    profile_picture_url: profilePictureUrl,
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
     * Sign in with Apple using the native identity token from @invertase/react-native-apple-authentication.
     * Creates a profile row for first-time Apple users since Apple only provides name/email on the first sign-in.
     */
    async signInWithApple(identityToken: string, appleUser?: {
        email?: string | null;
        firstName?: string | null;
        lastName?: string | null;
    }) {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: identityToken,
        });

        if (error) throw error;

        if (data.user) {
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();

            if (!existingProfile) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email || appleUser?.email || '',
                    first_name: appleUser?.firstName || null,
                    last_name: appleUser?.lastName || null,
                    phone: null,
                    venmo_username: null,
                    username: null,
                    profile_picture_url: null,
                });
            }
        }

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
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            // If the row doesn't exist, recover by creating the profile row dynamically
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user?.email) {
                throw new Error('Your profile does not exist and we could not retrieve your email to create it. Please create a new account.');
            }

            const { data: upsertData, error: upsertError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    email: userData.user.email,
                    ...updates
                })
                .select();

            if (upsertError) throw upsertError;
            return upsertData[0];
        }

        return data[0];
    },

    /**
     * Upload a new profile picture and update the user's profile
     */
    async uploadProfilePicture(userId: string, profilePicBase64: string, profilePicMimeType: string) {
        try {
            const fileExt = profilePicMimeType.split('/')[1] || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(`public/${fileName}`, decode(profilePicBase64), {
                    contentType: profilePicMimeType,
                });

            if (uploadError) {
                console.error('Error uploading profile pic:', uploadError);
                throw uploadError;
            } else if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(uploadData.path);

                // Update the profile with the new URL
                await this.updateProfile(userId, { profile_picture_url: publicUrl });
                return publicUrl;
            }
        } catch (err) {
            console.error('Failed to upload image', err);
            throw err;
        }
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
