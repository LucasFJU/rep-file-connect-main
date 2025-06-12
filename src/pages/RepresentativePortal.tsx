
import { useState } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useSupabaseDataContext } from "@/contexts/SupabaseDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  LogOut,
  User,
  Globe,
  Clock,
  Search
} from "lucide-react";

const RepresentativePortal = () => {
  const { user, signOut } = useAuth();
  const { files } = useSupabaseDataContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter files for the current user
  const userFiles = files.filter(file => 
    file.type === 'public' || file.representative_id === user?.id
  );
  
  const personalizedFiles = userFiles.filter(f => f.type === 'personalized');
  const publicFiles = userFiles.filter(f => f.type === 'public');

  const filteredPersonalizedFiles = personalizedFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPublicFiles = publicFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const handleDownload = (fileName: string) => {
    console.log('Downloading file:', fileName);
    // Simulate download
  };

  const FileList = ({ files, emptyMessage }: { files: any[], emptyMessage: string }) => (
    <>
      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">{emptyMessage}</p>
          {searchTerm && (
            <p className="text-sm">Tente ajustar os termos de busca</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <Badge variant={file.type === 'personalized' ? 'default' : 'secondary'}>
                        {file.type === 'personalized' ? 'Personalizado' : 'Público'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(file.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span>{formatFileSize(file.file_size)}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(file.name)}
                    className="hover:bg-blue-50 hover:border-blue-300 ml-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal do Representante</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={signOut} className="text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardContent className="flex items-center p-6">
            <User className="h-12 w-12 text-blue-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bem-vindo, {user?.email}!</h2>
              <p className="text-gray-600">
                Você tem {personalizedFiles.length} arquivos personalizados e {publicFiles.length} arquivos públicos disponíveis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar seus arquivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Files Tabs */}
        <Tabs defaultValue="personalized" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personalized" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Meus Arquivos ({filteredPersonalizedFiles.length})
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Arquivos da Empresa ({filteredPublicFiles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personalized" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Arquivos Personalizados
                </CardTitle>
                <CardDescription>
                  Arquivos enviados especificamente para você
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileList 
                  files={filteredPersonalizedFiles} 
                  emptyMessage="Nenhum arquivo personalizado disponível ainda." 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="public" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Arquivos da Empresa
                </CardTitle>
                <CardDescription>
                  Catálogos, apresentações e outros materiais da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileList 
                  files={filteredPublicFiles} 
                  emptyMessage="Nenhum arquivo da empresa disponível ainda." 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Precisa de Ajuda?</CardTitle>
            <CardDescription>
              Entre em contato com seu administrador se tiver alguma dúvida sobre acessar ou baixar arquivos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Acesso a Arquivos</h4>
                <p className="text-sm text-gray-600">
                  Arquivos pessoais são enviados especificamente para você, enquanto arquivos da empresa estão disponíveis para todos os representantes.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Problemas com Download?</h4>
                <p className="text-sm text-gray-600">
                  Se estiver tendo problemas para baixar arquivos, entre em contato com o administrador do sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepresentativePortal;
