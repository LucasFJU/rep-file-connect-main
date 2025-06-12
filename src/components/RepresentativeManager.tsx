
import { useState } from "react";
import { useSupabaseDataContext } from "@/contexts/SupabaseDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  FileText,
  UserPlus,
  FileSpreadsheet
} from "lucide-react";
import ExcelRepresentativeImport from "./ExcelRepresentativeImport";
import { useFiles } from "@/contexts/FileContext";

const RepresentativeManager = () => {
  const { files } = useFiles();
  const { profiles, addProfile, fetchProfiles } = useSupabaseDataContext();
  const { toast } = useToast();
  const [isAddingRep, setIsAddingRep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRep, setNewRep] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Filtrar apenas representantes (perfis com role = 'representative')
  const representatives = profiles.filter(profile => profile.role === 'representative');

  const validateForm = () => {
    if (!newRep.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do representante",
        variant: "destructive",
      });
      return false;
    }

    if (!newRep.email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe o email do representante",
        variant: "destructive",
      });
      return false;
    }

    if (!newRep.phone.trim()) {
      toast({
        title: "Telefone obrigatório",
        description: "Por favor, informe o telefone do representante",
        variant: "destructive",
      });
      return false;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRep.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido",
        variant: "destructive",
      });
      return false;
    }

    // Verificar se email já existe
    const emailExists = profiles.some(profile => 
      profile.email.toLowerCase() === newRep.email.toLowerCase()
    );
    
    if (emailExists) {
      toast({
        title: "Email já cadastrado",
        description: "Este email já está sendo usado por outro usuário",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAddRepresentative = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Criando representante:', newRep);
      
      const profile = await addProfile({
        name: newRep.name.trim(),
        email: newRep.email.trim().toLowerCase(),
        phone: newRep.phone.trim(),
        role: 'representative'
      });
      
      if (profile) {
        console.log('Representante criado com sucesso:', profile);
        
        // Atualizar lista
        await fetchProfiles();
        
        // Limpar formulário
        setNewRep({ name: '', email: '', phone: '' });
        setIsAddingRep(false);
        
        toast({
          title: "Representante adicionado",
          description: `${newRep.name} foi adicionado ao sistema`,
        });
      } else {
        throw new Error('Falha ao criar o perfil do representante');
      }
    } catch (error) {
      console.error('Erro ao criar representante:', error);
      toast({
        title: "Erro ao adicionar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o representante",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRepresentativeFileCount = (repId: string) => {
    return files.filter(f => f.representativeId === repId).length;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Cadastro Individual
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Importação Excel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          {/* Add Representative Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Adicionar Novo Representante
              </CardTitle>
              <CardDescription>
                Adicione um novo representante de vendas ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isAddingRep ? (
                <Button onClick={() => setIsAddingRep(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Representante
                </Button>
              ) : (
                <form onSubmit={handleAddRepresentative} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        placeholder="João Silva"
                        value={newRep.name}
                        onChange={(e) => setNewRep(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@empresa.com"
                        value={newRep.email}
                        onChange={(e) => setNewRep(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                      <Input
                        id="phone"
                        placeholder="+5511999999999"
                        value={newRep.phone}
                        onChange={(e) => setNewRep(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adicionando..." : "Adicionar Representante"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddingRep(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <ExcelRepresentativeImport />
        </TabsContent>
      </Tabs>

      {/* Representatives List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Representantes de Vendas ({representatives.length})
          </CardTitle>
          <CardDescription>
            Gerencie sua equipe de vendas e visualize suas estatísticas de arquivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {representatives.map((rep) => {
              const fileCount = getRepresentativeFileCount(rep.id);
              return (
                <div key={rep.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{rep.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {rep.email}
                          </span>
                          {rep.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {rep.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileText className="h-3 w-3" />
                        <span>{fileCount} arquivos</span>
                      </div>
                    </div>
                    <Badge variant={fileCount > 0 ? "default" : "secondary"}>
                      {fileCount > 0 ? "Com Arquivos" : "Sem Arquivos"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {representatives.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum representante cadastrado ainda.</p>
              <p className="text-sm">Adicione seu primeiro representante para começar.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepresentativeManager;
