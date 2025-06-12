
import { useProfiles } from './useProfiles';
import { useGroups } from './useGroups';
import { useFiles } from './useFiles';
import { useMessageTemplates } from './useMessageTemplates';

export const useSupabaseData = () => {
  const profilesData = useProfiles();
  const groupsData = useGroups();
  const filesData = useFiles();
  const templatesData = useMessageTemplates();

  const loading = profilesData.loading || groupsData.loading || filesData.loading || templatesData.loading;

  return {
    // Profiles
    profiles: profilesData.profiles,
    userProfile: profilesData.userProfile,
    addProfile: profilesData.addProfile,
    createRepresentativeProfile: profilesData.createRepresentativeProfile,
    fetchProfiles: profilesData.fetchProfiles,
    
    // Groups
    groups: groupsData.groups,
    addGroup: groupsData.addGroup,
    fetchGroups: groupsData.fetchGroups,
    
    // Files
    files: filesData.files,
    uploadFile: filesData.uploadFile,
    assignFileToRepresentative: filesData.assignFileToRepresentative,
    fetchFiles: filesData.fetchFiles,
    
    // Templates
    templates: templatesData.templates,
    fetchTemplates: templatesData.fetchTemplates,
    
    // General
    loading
  };
};
