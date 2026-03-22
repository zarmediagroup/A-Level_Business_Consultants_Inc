export type UserRole = "admin" | "client";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  company?: string;
  service_category?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  document_count?: number;
}

export interface Document {
  id: string;
  client_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  folder?: string;
  category: string;
  status: string;
  uploaded_at: string;
  uploaded_by: string;
  notes?: string;
  client?: Profile;
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  related_document_id?: string;
  related_client_id?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  ip_address?: string;
  user?: Profile;
}

export interface ClientNote {
  id: string;
  client_id: string;
  admin_id: string;
  note: string;
  created_at: string;
  updated_at: string;
  admin?: Profile;
}

export interface DashboardStats {
  total_clients: number;
  active_clients: number;
  total_documents: number;
  pending_reviews: number;
  recent_uploads: number;
  unread_notifications: number;
}
