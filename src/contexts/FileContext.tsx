
import React, { createContext, useContext } from 'react';
import { useSupabaseDataContext } from '@/contexts/SupabaseDataContext';

interface FileContextType {
  files: Array<{
    id: string;
    name: string;
    type: 'personalized' | 'public';
    representativeId?: string;
    representativeName?: string;
    uploadDate: Date;
    size: number;
    status: 'uploaded' | 'sent' | 'error';
  }>;
  representatives: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    groupId?: string;
  }>;
  groups: Array<{
    id: string;
    name: string;
    description?: string;
    color: string;
    createdAt: Date;
  }>;
  messageTemplates: Array<{
    id: string;
    name: string;
    content: string;
    variables: string[];
    isDefault: boolean;
  }>;
  deliveryLogs: Array<any>;
  uploadFile: (file: File, type: 'personalized' | 'public') => any;
  assignFileToRepresentative: (fileId: string, representativeId?: string) => Promise<boolean>;
  addRepresentative: (rep: any) => void;
  getFilesForRepresentative: (representativeId: string) => any[];
  sendFilesToRepresentatives: (selectedReps?: string[], templateId?: string) => Promise<void>;
  createGroup: (group: any) => void;
  updateGroup: (groupId: string, groupData: any) => void;
  deleteGroup: (groupId: string) => void;
  assignRepresentativeToGroup: (repId: string, groupId?: string) => void;
  createMessageTemplate: (template: any) => void;
  updateMessageTemplate: (templateId: string, template: any) => void;
  deleteMessageTemplate: (templateId: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

// Helper function to extract variables from templates
const extractVariables = (content: string): string[] => {
  const matches = content.match(/\{([^}]+)\}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseData = useSupabaseDataContext();

  const contextValue: FileContextType = {
    files: supabaseData.files.map(file => ({
      id: file.id,
      name: file.name,
      type: file.type,
      representativeId: file.representative_id,
      representativeName: supabaseData.profiles.find(p => p.id === file.representative_id)?.name,
      uploadDate: new Date(file.created_at),
      size: file.file_size,
      status: file.status as 'uploaded' | 'sent' | 'error'
    })),
    representatives: supabaseData.profiles.filter(p => p.role === 'representative').map(rep => ({
      id: rep.id,
      name: rep.name,
      email: rep.email,
      phone: rep.phone || '',
      groupId: undefined // This will be handled by a separate group-member table later
    })),
    groups: supabaseData.groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      color: 'blue',
      createdAt: new Date(group.created_at)
    })),
    messageTemplates: supabaseData.templates.map(template => ({
      id: template.id,
      name: template.name,
      content: template.content,
      variables: extractVariables(template.content),
      isDefault: template.name === 'Envio de Arquivo Personalizado'
    })),
    deliveryLogs: [],
    uploadFile: (file: File, type: 'personalized' | 'public') => {
      supabaseData.uploadFile(file, type);
      return {
        id: Date.now().toString(),
        name: file.name,
        type,
        uploadDate: new Date(),
        size: file.size,
        status: 'uploaded' as const
      };
    },
    assignFileToRepresentative: supabaseData.assignFileToRepresentative,
    addRepresentative: (rep: any) => {
      supabaseData.addProfile({
        name: rep.name,
        email: rep.email,
        phone: rep.phone,
        role: 'representative'
      });
    },
    getFilesForRepresentative: (representativeId: string) => {
      return supabaseData.files
        .filter(f => f.representative_id === representativeId || f.type === 'public')
        .map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          representativeId: file.representative_id,
          representativeName: supabaseData.profiles.find(p => p.id === file.representative_id)?.name,
          uploadDate: new Date(file.created_at),
          size: file.file_size,
          status: file.status as 'uploaded' | 'sent' | 'error'
        }));
    },
    sendFilesToRepresentatives: async (selectedReps?: string[], templateId?: string) => {},
    createGroup: (group: any) => supabaseData.addGroup(group),
    updateGroup: (groupId: string, groupData: any) => {},
    deleteGroup: (groupId: string) => {},
    assignRepresentativeToGroup: (repId: string, groupId?: string) => {},
    createMessageTemplate: (template: any) => {},
    updateMessageTemplate: (templateId: string, template: any) => {},
    deleteMessageTemplate: (templateId: string) => {}
  };

  return (
    <FileContext.Provider value={contextValue}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};
