import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useFiles } from "@/contexts/FileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  Send, 
  Activity, 
  Download,
  CheckCircle,
  Clock
} from "lucide-react";
import EnhancedFileUpload from "@/components/EnhancedFileUpload";
import FileFilters from "@/components/FileFilters";
import RepresentativeManager from "@/components/RepresentativeManager";
import DeliveryTracker from "@/components/DeliveryTracker";
import AdvancedDeliveryTracker from "@/components/AdvancedDeliveryTracker";
import WhatsAppSender from "@/components/WhatsAppSender";
import GroupManager from "@/components/GroupManager";
import MessageTemplates from "@/components/MessageTemplates";
import ReportsAndAnalytics from "@/components/ReportsAndAnalytics";
import FileAssignment from "@/components/FileAssignment";

const AdminDashboard = () => {
  const { files, deliveryLogs, representatives, groups } = useFiles();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debug: Log de alterações nos arquivos
  useEffect(() => {
    console.log('AdminDashboard: Arquivos alterados, total:', files.length);
    console.log('AdminDashboard: Arquivos atuais:', files.map(f => ({ 
      name: f?.name || 'sem nome', 
      type: f?.type || 'desconhecido', 
      status: f?.status || 'desconhecido' 
    })));
  }, [files]);

  const stats = [
    {
      title: "Total de Arquivos",
      value: files.length,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Representantes",
      value: representatives.length,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Grupos",
      value: groups.length,
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Entregas Recentes",
      value: deliveryLogs.length,
      icon: Activity,
      color: "text-orange-600"
    }
  ];

  // Filtrar e ordenar arquivos com verificações de null/undefined
  const filteredFiles = files.filter(file => {
    // Garantir que o arquivo e propriedades obrigatórias existem
    if (!file || typeof file.name !== 'string' || typeof file.type !== 'string' || typeof file.status !== 'string') {
      console.warn('AdminDashboard: Arquivo com propriedades inválidas encontrado:', file);
      return false;
    }

    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(file.type);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(file.status);
    
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
      case 'date':
        comparison = (a.uploadDate?.getTime() || 0) - (b.uploadDate?.getTime() || 0);
        break;
      case 'size':
        comparison = (a.size || 0) - (b.size || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'personalized':
        return 'Personalizado';
      case 'public':
        return 'Público';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'uploaded':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <Routes>
      <Route index element={
        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="flex items-center p-6">
                    <Icon className={`h-8 w-8 ${stat.color} mr-3`} />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Conteúdo Principal */}
          <div className="grid lg:grid-cols-2 gap-6">
            <EnhancedFileUpload />
            
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Biblioteca de Arquivos</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Gerencie seus arquivos enviados ({files.length} arquivos)
                  </p>
                  
                  <FileFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedTypes={selectedTypes}
                    onTypeChange={setSelectedTypes}
                    selectedStatuses={selectedStatuses}
                    onStatusChange={setSelectedStatuses}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredFiles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {files.length === 0 
                          ? "Nenhum arquivo foi carregado ainda. Use o envio acima para adicionar arquivos."
                          : "Nenhum arquivo encontrado com os filtros aplicados."
                        }
                      </p>
                    </div>
                  ) : (
                    filteredFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{file.name || 'Arquivo sem nome'}</p>
                            <Badge variant={file.type === 'personalized' ? 'default' : 'secondary'}>
                              {getFileTypeLabel(file.type)}
                            </Badge>
                            {getStatusIcon(file.status)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {file.representativeName && `Para: ${file.representativeName} • `}
                            {file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'Tamanho desconhecido'} • {file.uploadDate ? file.uploadDate.toLocaleDateString('pt-BR') : 'Data desconhecida'}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" title="Baixar arquivo">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      } />
      <Route path="files" element={<FileAssignment />} />
      <Route path="representatives" element={<RepresentativeManager />} />
      <Route path="groups" element={<GroupManager />} />
      <Route path="templates" element={<MessageTemplates />} />
      <Route path="whatsapp" element={<WhatsAppSender />} />
      <Route path="logs" element={<AdvancedDeliveryTracker />} />
      <Route path="reports" element={<ReportsAndAnalytics />} />
    </Routes>
  );
};

export default AdminDashboard;
