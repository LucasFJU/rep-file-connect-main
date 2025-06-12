
import { useState, useMemo } from "react";
import { useFiles } from "@/contexts/FileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  User,
  FileText,
  RefreshCw
} from "lucide-react";

const AdvancedDeliveryTracker = () => {
  const { deliveryLogs, representatives, groups } = useFiles();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [representativeFilter, setRepresentativeFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredLogs = useMemo(() => {
    let filtered = deliveryLogs.filter(log => {
      const matchesSearch = 
        log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.representativeName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;
      const matchesRep = representativeFilter === "all" || log.representativeName === representativeFilter;
      
      let matchesGroup = true;
      if (groupFilter !== "all") {
        const rep = representatives.find(r => r.name === log.representativeName);
        matchesGroup = rep?.groupId === groupFilter;
      }

      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const logDate = log.dateSent;
        
        switch (dateFilter) {
          case "today":
            matchesDate = logDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesRep && matchesGroup && matchesDate;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.dateSent.getTime() - b.dateSent.getTime();
          break;
        case 'representative':
          comparison = a.representativeName.localeCompare(b.representativeName);
          break;
        case 'file':
          comparison = a.fileName.localeCompare(b.fileName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [deliveryLogs, searchTerm, statusFilter, representativeFilter, groupFilter, dateFilter, sortBy, sortOrder, representatives]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const success = filteredLogs.filter(log => log.status === 'sent').length;
    const errors = filteredLogs.filter(log => log.status === 'error').length;
    const successRate = total > 0 ? (success / total) * 100 : 0;

    return { total, success, errors, successRate };
  }, [filteredLogs]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRepresentativeFilter("all");
    setGroupFilter("all");
    setDateFilter("all");
  };

  const exportLogs = () => {
    const csvContent = [
      ['Data', 'Representante', 'Arquivo', 'Status', 'Mensagem'].join(','),
      ...filteredLogs.map(log => [
        log.dateSent.toLocaleString(),
        log.representativeName,
        log.fileName,
        log.status,
        log.message || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Total de Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.success}</p>
                <p className="text-xs text-gray-500">Sucessos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.errors}</p>
                <p className="text-xs text-gray-500">Erros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Taxa de Sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Avançados */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Logs de Entrega Avançados</CardTitle>
              <CardDescription>Filtros avançados e busca detalhada</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Linha 1 de Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar arquivo ou representante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={representativeFilter} onValueChange={setRepresentativeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Representante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Representantes</SelectItem>
                {representatives.map(rep => (
                  <SelectItem key={rep.id} value={rep.name}>{rep.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Grupos</SelectItem>
                {groups.map(group => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Linha 2 de Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o Período</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="representative">Representante</SelectItem>
                <SelectItem value="file">Arquivo</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Mais Recente</SelectItem>
                <SelectItem value="asc">Mais Antigo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum log encontrado com os filtros atuais.</p>
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={log.id} className={`p-4 border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant={log.status === 'sent' ? 'default' : 'destructive'}>
                          {log.status === 'sent' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {log.status === 'sent' ? 'Enviado' : 'Erro'}
                        </Badge>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          {log.representativeName}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FileText className="h-3 w-3" />
                          {log.fileName}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {log.dateSent.toLocaleString()}
                        </div>
                        
                        {log.message && (
                          <div className="text-xs text-red-600">
                            {log.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedDeliveryTracker;
