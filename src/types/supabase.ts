
export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'representative';
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface FileItem {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  type: 'personalized' | 'public';
  status: 'uploaded' | 'sent' | 'delivered' | 'read';
  uploaded_by?: string;
  representative_id?: string;
  group_id?: string;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  created_by?: string;
  created_at: string;
}
