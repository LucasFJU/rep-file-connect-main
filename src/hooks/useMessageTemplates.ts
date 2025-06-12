
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { MessageTemplate } from '@/types/supabase';

export const useMessageTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTemplates();
      setLoading(false);
    }
  }, [user]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('message_templates')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching templates:', error);
        return;
      }

      setTemplates((data as MessageTemplate[]) || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  return {
    templates,
    loading,
    fetchTemplates
  };
};
