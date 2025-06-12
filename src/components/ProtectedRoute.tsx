
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useSupabaseDataContext } from "@/contexts/SupabaseDataContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'representative';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading: loadingAuth } = useAuth();
  const { userProfile, loading: loadingProfile } = useSupabaseDataContext();

  if (loadingAuth || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userProfile && userProfile.role !== requiredRole) {
    // Redirecionar para uma página de acesso negado ou para a página inicial
    // Dependendo da sua lógica de aplicação, você pode querer uma página específica
    // ou apenas redirecionar para o root.
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;


