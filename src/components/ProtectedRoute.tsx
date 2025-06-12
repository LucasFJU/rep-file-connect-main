
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'representative';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Para agora, permitir acesso independente do role
  // TODO: Implementar verificação de role quando os perfis estiverem carregados
  
  return <>{children}</>;
};

export default ProtectedRoute;
