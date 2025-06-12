
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { FileItem } from '@/types/supabase';

export const useFiles = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFiles();
      setLoading(false);
    }
  }, [user]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
        return;
      }

      setFiles((data as FileItem[]) || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const uploadFile = async (file: File, type: 'personalized' | 'public', representativeId?: string) => {
    if (!user) return null;

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const folderPath = type === 'public' ? 'public' : `personal/${representativeId || user.id}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      // Save metadata to database
      const { data, error } = await (supabase as any)
        .from('files')
        .insert({
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          type,
          uploaded_by: user.id,
          representative_id: representativeId
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving file metadata:', error);
        return null;
      }

      await fetchFiles();
      return data as FileItem;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const assignFileToRepresentative = async (fileId: string, representativeId?: string) => {
    try {
      const { error } = await (supabase as any)
        .from('files')
        .update({ representative_id: representativeId })
        .eq('id', fileId);

      if (error) {
        console.error('Error assigning file:', error);
        return false;
      }

      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error assigning file:', error);
      return false;
    }
  };

  return {
    files,
    loading,
    uploadFile,
    assignFileToRepresentative,
    fetchFiles
  };
};
