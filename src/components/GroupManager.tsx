
import { useState } from "react";
import { useFiles } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus,
  Palette
} from "lucide-react";

const GroupManager = () => {
  const { groups, representatives, createGroup, updateGroup, deleteGroup, assignRepresentativeToGroup } = useFiles();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    color: 'blue'
  });

  const colors = [
    { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
    { value: 'green', label: 'Verde', class: 'bg-green-500' },
    { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
    { value: 'red', label: 'Vermelho', class: 'bg-red-500' },
    { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-500' },
    { value: 'pink', label: 'Rosa', class: 'bg-pink-500' }
  ];

  const handleCreateGroup = () => {
    if (!groupForm.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o grupo",
        variant: "destructive",
      });
      return;
    }

    if (editingGroup) {
      updateGroup(editingGroup, groupForm);
      toast({
        title: "Grupo atualizado",
        description: "O grupo foi atualizado com sucesso",
      });
    } else {
      createGroup(groupForm);
      toast({
        title: "Grupo criado",
        description: "O novo grupo foi criado com sucesso",
      });
    }

    setGroupForm({ name: '', description: '', color: 'blue' });
    setEditingGroup(null);
    setIsCreateDialogOpen(false);
  };

  const handleEditGroup = (group: any) => {
    setGroupForm({
      name: group.name,
      description: group.description || '',
      color: group.color
    });
    setEditingGroup(group.id);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId);
    toast({
      title: "Grupo excluído",
      description: "O grupo foi excluído e os representantes foram desvinculados",
    });
  };

  const getRepresentativesByGroup = (groupId: string) => {
    return representatives.filter(rep => rep.groupId === groupId);
  };

  const getUnassignedRepresentatives = () => {
    return representatives.filter(rep => !rep.groupId);
  };

  const handleAssignRepresentative = (repId: string, groupId: string) => {
    assignRepresentativeToGroup(repId, groupId);
    toast({
      title: "Representante atribuído",
      description: "O representante foi atribuído ao grupo com sucesso",
    });
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      pink: 'bg-pink-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Grupos</h2>
          <p className="text-gray-600">Organize seus representantes em grupos</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setGroupForm({ name: '', description: '', color: 'blue' });
              setEditingGroup(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Editar Grupo' : 'Criar Novo Grupo'}
              </DialogTitle>
              <DialogDescription>
                {editingGroup ? 'Edite as informações do grupo' : 'Crie um novo grupo para organizar seus representantes'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Nome do Grupo</Label>
                <Input
                  id="groupName"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Vendas Norte"
                />
              </div>
              
              <div>
                <Label htmlFor="groupDescription">Descrição (opcional)</Label>
                <Textarea
                  id="groupDescription"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do grupo..."
                />
              </div>
              
              <div>
                <Label htmlFor="groupColor">Cor do Grupo</Label>
                <Select value={groupForm.color} onValueChange={(value) => setGroupForm(prev => ({ ...prev, color: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.class}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateGroup} className="flex-1">
                  {editingGroup ? 'Atualizar' : 'Criar'} Grupo
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grupos Existentes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const groupReps = getRepresentativesByGroup(group.id);
          
          return (
            <Card key={group.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getColorClass(group.color)}`} />
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGroup(group.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {group.description && (
                  <CardDescription>{group.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">{groupReps.length} representante(s)</span>
                  </div>
                  
                  <div className="space-y-2">
                    {groupReps.map((rep) => (
                      <div key={rep.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{rep.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => assignRepresentativeToGroup(rep.id, undefined)}
                          title="Remover do grupo"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {groupReps.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Nenhum representante neste grupo</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Representantes Não Atribuídos */}
      {getUnassignedRepresentatives().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Representantes Não Atribuídos
            </CardTitle>
            <CardDescription>
              Atribua estes representantes a um grupo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUnassignedRepresentatives().map((rep) => (
                <div key={rep.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{rep.name}</div>
                    <div className="text-sm text-gray-500">{rep.phone}</div>
                  </div>
                  
                  <Select onValueChange={(groupId) => handleAssignRepresentative(rep.id, groupId)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Selecionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getColorClass(group.color)}`} />
                            {group.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupManager;
