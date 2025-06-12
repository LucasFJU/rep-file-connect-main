
import { useState, useMemo } from "react";
import { useFiles } from "@/contexts/FileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Send, 
  AlertCircle,
  Download,
  Calendar
} from "lucide-react";

const ReportsAndAnalytics = () => {
  const { files, deliveryLogs, representatives, groups } = useFiles();
  const [timeRange, setTimeRange] = useState("7d");
  const [reportType, setReportType] = useState("overview");

  const filteredLogs = useMemo(() => {
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return deliveryLogs.filter(log => log.dateSent >= cutoff);
  }, [deliveryLogs, timeRange]);

  const stats = useMemo(() => {
    const totalSent = filteredLogs.filter(log => log.status === 'sent').length;
    const totalErrors = filteredLogs.filter(log => log.status === 'error').length;
    const successRate = totalSent + totalErrors > 0 ? (totalSent / (totalSent + totalErrors)) * 100 : 0;
    
    return {
      totalFiles: files.length,
      totalSent,
      totalErrors,
      successRate,
      activeReps: representatives.length,
      totalGroups: groups.length
    };
  }, [files, filteredLogs, representatives, groups]);

  const chartData = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayLogs = filteredLogs.filter(log => 
        log.dateSent.toDateString() === date.toDateString()
      );
      
      data.push({
        date: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        enviados: dayLogs.filter(log => log.status === 'sent').length,
        erros: dayLogs.filter(log => log.status === 'error').length
      });
    }
    
    return data;
  }, [filteredLogs, timeRange]);

  const representativeData = useMemo(() => {
    const repCounts = representatives.map(rep => {
      const repLogs = filteredLogs.filter(log => log.representativeName === rep.name);
      return {
        name: rep.name,
        enviados: repLogs.filter(log => log.status === 'sent').length,
        erros: repLogs.filter(log => log.status === 'error').length
      };
    }).filter(rep => rep.enviados > 0 || rep.erros > 0);
    
    return repCounts;
  }, [representatives, filteredLogs]);

  const groupData = useMemo(() => {
    return groups.map(group => {
      const groupReps = representatives.filter(rep => rep.groupId === group.id);
      const groupLogs = filteredLogs.filter(log => 
        groupReps.some(rep => rep.name === log.representativeName)
      );
      
      return {
        name: group.name,
        value: groupLogs.filter(log => log.status === 'sent').length,
        color: group.color
      };
    }).filter(group => group.value > 0);
  }, [groups, representatives, filteredLogs]);

  const COLORS = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899'
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
          <p className="text-gray-600">Análise detalhada das entregas e performance</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
                <p className="text-xs text-gray-500">Arquivos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
                <p className="text-xs text-gray-500">Enviados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalErrors}</p>
                <p className="text-xs text-gray-500">Erros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Taxa Sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeReps}</p>
                <p className="text-xs text-gray-500">Representantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalGroups}</p>
                <p className="text-xs text-gray-500">Grupos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Linha do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle>Entregas por Dia</CardTitle>
            <CardDescription>Evolução das entregas nos últimos {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enviados" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="erros" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pizza por Grupo */}
        <Card>
          <CardHeader>
            <CardTitle>Entregas por Grupo</CardTitle>
            <CardDescription>Distribuição de entregas entre grupos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={groupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {groupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.color as keyof typeof COLORS] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Barras por Representante */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance por Representante</CardTitle>
            <CardDescription>Entregas e erros por representante</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={representativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enviados" fill="#10b981" />
                <Bar dataKey="erros" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Representantes */}
      <Card>
        <CardHeader>
          <CardTitle>Top Representantes</CardTitle>
          <CardDescription>Representantes com mais entregas no período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {representativeData
              .sort((a, b) => b.enviados - a.enviados)
              .slice(0, 5)
              .map((rep, index) => (
                <div key={rep.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{rep.name}</p>
                      <p className="text-sm text-gray-500">
                        {rep.enviados} enviados, {rep.erros} erros
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{rep.enviados}</p>
                    <p className="text-xs text-gray-500">entregas</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAndAnalytics;
