import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, FileText, MessageSquare, ArrowRight } from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Gestão de Representantes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gerencie e distribua arquivos para seus representantes de forma eficiente
            </p>
            <Button asChild size="lg" className="mr-4">
              <a href="/auth">
                Fazer Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Gestão de Representantes</CardTitle>
                <CardDescription>
                  Organize representantes em grupos e gerencie suas informações
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Distribuição de Arquivos</CardTitle>
                <CardDescription>
                  Envie arquivos personalizados ou públicos via WhatsApp
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Templates de Mensagem</CardTitle>
                <CardDescription>
                  Crie mensagens personalizadas para diferentes situações
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Redirecionar usuário autenticado para dashboard apropriado
  // Por enquanto, vamos para admin sempre (implementar role check depois)
  return <Navigate to="/admin" replace />;
};

export default Index;
