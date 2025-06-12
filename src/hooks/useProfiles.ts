
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Profile } from '@/types/supabase';

export const useProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user && userProfile) {
      fetchProfiles();
      setLoading(false);
    }
  }, [user, userProfile]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      console.log('Fetching profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      console.log('Profiles fetched:', data);
      setProfiles((data as Profile[]) || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const addProfile = async (profileData: Omit<Profile, 'id' | 'created_at'>) => {
    try {
      console.log('Attempting to create Supabase auth user and profile:', profileData);

      // 1. Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profileData.email,
        password: 'robusfer2025', // Senha padrão
        options: {
          data: { 
            name: profileData.name, 
            phone: profileData.phone, 
            role: profileData.role || 'representative' 
          },
          emailRedirectTo: window.location.origin // Redireciona para a origem após a confirmação (se necessário)
        }
      });

      if (authError) {
        console.error('Error creating Supabase auth user:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Supabase auth user not returned after signup.');
      }

      // 2. Insert profile into 'profiles' table using the new user's ID
      const { data: profileInsertData, error: profileInsertError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id, // Use o ID do usuário de autenticação
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          role: profileData.role || 'representative'
        })
        .select()
        .single();

      if (profileInsertError) {
        console.error('Error adding profile to database:', profileInsertError);
        // Se a inserção do perfil falhar, você pode querer reverter a criação do usuário de autenticação
        // await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileInsertError;
      }

      console.log('Profile and auth user created successfully:', profileInsertData);
      await fetchProfiles();
      return profileInsertData as Profile;
    } catch (error) {
      console.error('Error in addProfile:', error);
      throw error;
    }
  };

  const createRepresentativeProfile = async (userId: string, name: string, email: string, phone: string) => {
    try {
      const profileData = {
        id: userId,
        name,
        email,
        phone,
        role: 'representative' as const
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating representative profile:', error);
        return null;
      }

      await fetchProfiles();
      return data as Profile;
    } catch (error) {
      console.error('Error creating representative profile:', error);
      return null;
    }
  };

  return {
    profiles,
    userProfile,
    loading,
    addProfile,
    fetchProfiles,
    fetchUserProfile,
    createRepresentativeProfile
  };
};


