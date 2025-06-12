
import { useState } from "react";
import { useFiles } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import FilePreview from "./FilePreview";
import { 
  MessageSquare, 
  Send, 
  Users, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Filter
} from "lucide-react";

const WhatsAppSender = () => {
  const { 
    representatives, 
    files, 
    groups, 
    messageTemplates, 
    sendFilesToRepresentatives 
  } = useFiles();
  const { toast } = useToast();
  const [selectedReps, setSelectedReps] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  const [previewRep, setPreviewRep] = useState<string | null>(null);

  const handleRepresentativeToggle = (repId: string) => {
    setSelectedReps(prev => 
      prev.includes(repId) 
        ? prev.filter(id => id !== repId)
        : [...prev, repId]
    );
  };

  const selectAll = () => {
    const filteredReps = getFilteredRepresentatives();
    const allRepIds = filteredReps.map(rep => rep.id);
    setSelectedReps(allRepIds);
  };

  const clearSelection = () => {
    setSelectedReps([]);
  };

  const getFilteredRepresentatives = () => {
    if (selectedGroup === 'all') {
      return representatives;
    }
    if (selectedGroup === 'unassigned') {
      return representatives.filter(rep => !rep.groupId);
    }
    return representatives.filter(rep => rep.groupId === selectedGroup);
  };

  const getRepresentativeFiles = (repId: string) => {
    const personalizedFiles = files.filter(f => 
      f.type === 'personalized' && 
      f.representativeId === repId && 
      f.status === 'uploaded'
    );
    const publicFiles = files.filter(f => f.type === 'public' && f.status === 'uploaded');
    return [...personalizedFiles, ...publicFiles];
  };

  const handleSendFiles = async () => {
    if (selectedReps.length === 0) {
      toast({
        title: "Nenhum destinatário selecionado",
        description: "Por favor, selecione pelo menos um representante",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      await sendFilesToRepresentatives(selectedReps, selectedTemplate);
      
      toast({
        title: "Arquivos enviados com sucesso",
        description: `Arquivos foram enviados para ${selectedReps.length} representante(s) via WhatsApp`,
      });

      setSelectedReps([]);
    } catch (error) {
      toast({
        title: "Falha no envio",
        description: "Ocorreu um erro ao enviar os arquivos",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getGroupColor = (groupId: string | undefined) => {
    if (!groupId) return 'gray';
    const group = groups.find(g => g.id === groupId);
    return group?.color || 'gray';
  };

  const getGroupName = (groupId: string | undefined) => {
    if (!groupId) return 'Sem grupo';
    const group = groups.find(g => g.id === groupId);
    return group?.name || 'Grupo desconhecido';
  };

  const defaultTemplate = messageTemplates.find(t => t.isDefault);
  const currentTemplate = messageTemplates.find(t => t.id === selectedTemplate) || defaultTemplate;

  return (
    <div className="space-y-6">
      {/* Controles de Envio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Distribuição de Arquivos via WhatsApp
          </CardTitle>
          <CardDescription>
            Envie arquivos para representantes selecionados via WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtro por Grupo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Filtrar por Grupo</label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Representantes</SelectItem>
                  <SelectItem value="unassigned">Sem Grupo</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${group.color}-500`} />
                        {group.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template de Mensagem */}
            <div>
              <label className="text-sm font-medium mb-2 block">Template de Mensagem</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar template" />
                </SelectTrigger>
                <SelectContent>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        {template.name}
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">Padrão</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview da Mensagem */}
          {currentTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium mb-1">Preview da mensagem:</div>
              <div className="text-sm text-blue-800">
                {currentTemplate.content.replace(/\{\{nome\}\}/g, '[Nome do Representante]')}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={selectAll} disabled={isSending}>
              <Users className="h-4 w-4 mr-2" />
              Selecionar Todos
            </Button>
            <Button variant="outline" onClick={clearSelection} disabled={isSending}>
              Limpar Seleção
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {selectedReps.length} selecionado(s)
            </Badge>
          </div>

          <Button 
            onClick={handleSendFiles} 
            disabled={selectedReps.length === 0 || isSending}
            className="w-full"
            size="lg"
          >
            {isSending ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Enviando Arquivos...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Arquivos para Representantes Selecionados
              </>
            )}
          </Button>

          {selectedReps.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Arquivos serão enviados via WhatsApp para {selectedReps.length} representante(s). 
                Cada um receberá seus arquivos personalizados mais todos os arquivos públicos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Representantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Selecionar Destinatários
            {selectedGroup !== 'all' && (
              <Badge variant="outline">
                {selectedGroup === 'unassigned' ? 'Sem Grupo' : getGroupName(selectedGroup)}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Escolha quais representantes devem receber os arquivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getFilteredRepresentatives().map((rep) => {
              const repFiles = getRepresentativeFiles(rep.id);
              const isSelected = selectedReps.includes(rep.id);
              
              return (
                <div key={rep.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`rep-${rep.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleRepresentativeToggle(rep.id)}
                      disabled={isSending}
                    />
                    <div className="flex-1">
                      <label htmlFor={`rep-${rep.id}`} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">{rep.name}</div>
                          {rep.groupId && (
                            <Badge variant="outline" className="text-xs">
                              <div className={`w-2 h-2 rounded-full bg-${getGroupColor(rep.groupId)}-500 mr-1`} />
                              {getGroupName(rep.groupId)}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{rep.phone}</div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileText className="h-3 w-3" />
                        <span>{repFiles.length} arquivo(s)</span>
                      </div>
                      {repFiles.length === 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <AlertCircle className="h-3 w-3" />
                          Nenhum arquivo
                        </div>
                      )}
                    </div>
                    
                    {repFiles.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewRep(rep.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Badge variant={repFiles.length > 0 ? "default" : "secondary"}>
                      {repFiles.length > 0 ? 'Pronto' : 'Sem Arquivos'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {getFilteredRepresentatives().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum representante encontrado.</p>
              <p className="text-sm">
                {selectedGroup === 'all' 
                  ? 'Adicione representantes primeiro.'
                  : 'Nenhum representante neste grupo.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview de Arquivos */}
      {previewRep && (() => {
        const rep = representatives.find(r => r.id === previewRep);
        const repFiles = getRepresentativeFiles(previewRep);
        
        return (
          <FilePreview
            files={repFiles}
            representativeName={rep?.name || ''}
            isOpen={!!previewRep}
            onClose={() => setPreviewRep(null)}
            onConfirmSend={() => {
              setSelectedReps([previewRep]);
              setPreviewRep(null);
              handleSendFiles();
            }}
            messageTemplate={currentTemplate?.content}
          />
        );
      })()}

      {/* Informações da Integração WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Configuração da Integração WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Status Atual:</strong> Modo Demo - Arquivos são simulados como enviados mas não são entregues via WhatsApp.
            </p>
            <p>
              <strong>Para ativar o envio real via WhatsApp:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Configure as credenciais da API do WhatsApp Business</li>
              <li>Configure endpoints webhook para status de entrega</li>
              <li>Adicione endpoints de upload de arquivo para compartilhamento de mídia</li>
              <li>Implemente autenticação adequada e limitação de taxa</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSender;
