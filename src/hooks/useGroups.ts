
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Group } from '@/types/supabase';

export const useGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGroups();
      setLoading(false);
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('groups')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching groups:', error);
        return;
      }

      setGroups((data as Group[]) || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const addGroup = async (groupData: Omit<Group, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('groups')
        .insert(groupData)
        .select()
        .single();

      if (error) {
        console.error('Error adding group:', error);
        return null;
      }

      await fetchGroups();
      return data as Group;
    } catch (error) {
      console.error('Error adding group:', error);
      return null;
    }
  };

  return {
    groups,
    loading,
    addGroup,
    fetchGroups
  };
};
