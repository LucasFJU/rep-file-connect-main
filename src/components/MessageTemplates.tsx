
import { useState } from "react";
import { useFiles } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Copy,
  Eye
} from "lucide-react";

const MessageTemplates = () => {
  const { messageTemplates, createMessageTemplate, updateMessageTemplate, deleteMessageTemplate } = useFiles();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    content: '',
    isDefault: false
  });

  const detectVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    return matches ? matches.map(match => match.slice(2, -2)) : [];
  };

  const handleCreateTemplate = () => {
    if (!templateForm.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o template",
        variant: "destructive",
      });
      return;
    }

    if (!templateForm.content.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, insira o conteúdo da mensagem",
        variant: "destructive",
      });
      return;
    }

    const variables = detectVariables(templateForm.content);
    
    if (editingTemplate) {
      updateMessageTemplate(editingTemplate, {
        ...templateForm,
        variables
      });
      toast({
        title: "Template atualizado",
        description: "O template foi atualizado com sucesso",
      });
    } else {
      createMessageTemplate({
        ...templateForm,
        variables
      });
      toast({
        title: "Template criado",
        description: "O novo template foi criado com sucesso",
      });
    }

    setTemplateForm({ name: '', content: '', isDefault: false });
    setEditingTemplate(null);
    setIsCreateDialogOpen(false);
  };

  const handleEditTemplate = (template: any) => {
    setTemplateForm({
      name: template.name,
      content: template.content,
      isDefault: template.isDefault
    });
    setEditingTemplate(template.id);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteMessageTemplate(templateId);
    toast({
      title: "Template excluído",
      description: "O template foi excluído com sucesso",
    });
  };

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Template copiado",
      description: "O conteúdo do template foi copiado para a área de transferência",
    });
  };

  const getPreviewText = (content: string) => {
    return content
      .replace(/\{\{nome\}\}/g, 'João Silva')
      .replace(/\{\{empresa\}\}/g, 'Empresa XYZ')
      .replace(/\{\{(\w+)\}\}/g, '[Variável]');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Mensagem</h2>
          <p className="text-gray-600">Crie e gerencie templates para suas mensagens do WhatsApp</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setTemplateForm({ name: '', content: '', isDefault: false });
              setEditingTemplate(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Editar Template' : 'Criar Novo Template'}
              </DialogTitle>
              <DialogDescription>
                {editingTemplate ? 'Edite as informações do template' : 'Crie um novo template de mensagem. Use {{variavel}} para inserir dados dinâmicos'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateName">Nome do Template</Label>
                <Input
                  id="templateName"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Saudação Padrão"
                />
              </div>
              
              <div>
                <Label htmlFor="templateContent">Conteúdo da Mensagem</Label>
                <Textarea
                  id="templateContent"
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Olá {{nome}}, segue em anexo os arquivos solicitados..."
                  rows={6}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Variáveis disponíveis: nome, empresa
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={templateForm.isDefault}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isDefault">Definir como template padrão</Label>
              </div>
              
              {templateForm.content && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm font-medium">Preview:</Label>
                  <div className="mt-1 text-sm whitespace-pre-wrap">
                    {getPreviewText(templateForm.content)}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateTemplate} className="flex-1">
                  {editingTemplate ? 'Atualizar' : 'Criar'} Template
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Templates */}
      <div className="grid md:grid-cols-2 gap-6">
        {messageTemplates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {template.isDefault && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Padrão
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPreviewTemplate(template.id)}
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyTemplate(template.content)}
                    title="Copiar"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditTemplate(template)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteTemplate(template.id)}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {template.content.length > 100 
                    ? template.content.substring(0, 100) + '...'
                    : template.content
                  }
                </div>
                
                {template.variables.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Variáveis:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messageTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold mb-2">Nenhum template criado</h3>
            <p className="text-gray-600 mb-4">Crie seu primeiro template de mensagem para agilizar o envio</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Preview */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview do Template</DialogTitle>
          </DialogHeader>
          
          {previewTemplate && (() => {
            const template = messageTemplates.find(t => t.id === previewTemplate);
            if (!template) return null;
            
            return (
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Nome: {template.name}</Label>
                  {template.isDefault && (
                    <Badge variant="default" className="ml-2">Padrão</Badge>
                  )}
                </div>
                
                <div>
                  <Label className="font-medium">Conteúdo Original:</Label>
                  <div className="bg-gray-50 p-3 rounded mt-1 text-sm whitespace-pre-wrap">
                    {template.content}
                  </div>
                </div>
                
                <div>
                  <Label className="font-medium">Preview com Dados de Exemplo:</Label>
                  <div className="bg-blue-50 p-3 rounded mt-1 text-sm whitespace-pre-wrap border-l-4 border-blue-500">
                    {getPreviewText(template.content)}
                  </div>
                </div>
                
                {template.variables.length > 0 && (
                  <div>
                    <Label className="font-medium">Variáveis Detectadas:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button onClick={() => setPreviewTemplate(null)} className="w-full">
                  Fechar
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageTemplates;
