
import { useFiles } from "@/contexts/FileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Calendar,
  TrendingUp
} from "lucide-react";

const DeliveryTracker = () => {
  const { deliveryLogs, files } = useFiles();

  const stats = {
    totalSent: deliveryLogs.filter(log => log.status === 'sent').length,
    totalErrors: deliveryLogs.filter(log => log.status === 'error').length,
    uniqueFiles: new Set(deliveryLogs.map(log => log.fileName)).size,
    uniqueRecipients: new Set(deliveryLogs.map(log => log.representativeName)).size
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Sent</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSent}</p>
              <p className="text-sm text-gray-500">Successful Deliveries</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <XCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalErrors}</p>
              <p className="text-sm text-gray-500">Failed Deliveries</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueFiles}</p>
              <p className="text-sm text-gray-500">Unique Files Sent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueRecipients}</p>
              <p className="text-sm text-gray-500">Recipients Reached</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Delivery History
          </CardTitle>
          <CardDescription>
            Track all file deliveries and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deliveryLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No delivery history yet.</p>
              <p className="text-sm">Send some files to see delivery tracking here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveryLogs
                .sort((a, b) => b.dateSent.getTime() - a.dateSent.getTime())
                .map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(log.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{log.fileName}</span>
                          <span className="text-sm text-gray-500">→ {log.representativeName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateTime(log.dateSent)}
                          </span>
                          {log.message && (
                            <span className="text-red-600">{log.message}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(log.status)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      {deliveryLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-800">Success Rate</div>
                <div className="text-2xl font-bold text-green-600">
                  {deliveryLogs.length > 0 ? Math.round((stats.totalSent / deliveryLogs.length) * 100) : 0}%
                </div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800">Last Delivery</div>
                <div className="text-sm text-blue-600">
                  {deliveryLogs.length > 0 
                    ? formatDateTime(deliveryLogs[deliveryLogs.length - 1].dateSent)
                    : 'No deliveries yet'
                  }
                </div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-800">Total Deliveries</div>
                <div className="text-2xl font-bold text-purple-600">{deliveryLogs.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryTracker;
