
import React, { createContext, useContext } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { FileItem, Profile, Group, MessageTemplate } from '@/types/supabase';

interface SupabaseDataContextType {
  // Profiles
  profiles: Profile[];
  userProfile: Profile | null;
  addProfile: (profileData: Omit<Profile, 'id' | 'created_at'>) => Promise<Profile | null>;
  createRepresentativeProfile: (userId: string, name: string, email: string, phone: string) => Promise<Profile | null>;
  fetchProfiles: () => Promise<void>;
  
  // Groups
  groups: Group[];
  addGroup: (groupData: Omit<Group, 'id' | 'created_at'>) => Promise<Group | null>;
  fetchGroups: () => Promise<void>;
  
  // Files
  files: FileItem[];
  uploadFile: (file: File, type: 'personalized' | 'public', representativeId?: string) => Promise<FileItem | null>;
  assignFileToRepresentative: (fileId: string, representativeId?: string) => Promise<boolean>;
  fetchFiles: () => Promise<void>;
  
  // Templates
  templates: MessageTemplate[];
  fetchTemplates: () => Promise<void>;
  
  // General
  loading: boolean;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export const SupabaseDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const data = useSupabaseData();

  return (
    <SupabaseDataContext.Provider value={data}>
      {children}
    </SupabaseDataContext.Provider>
  );
};

export const useSupabaseDataContext = () => {
  const context = useContext(SupabaseDataContext);
  if (context === undefined) {
    throw new Error('useSupabaseDataContext must be used within a SupabaseDataProvider');
  }
  return context;
};
