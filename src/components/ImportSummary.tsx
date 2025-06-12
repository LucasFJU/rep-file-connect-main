
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImportSummaryProps {
  validCount: number;
  invalidCount: number;
  onImport: () => void;
  isImporting?: boolean;
}

const ImportSummary: React.FC<ImportSummaryProps> = ({ validCount, invalidCount, onImport, isImporting = false }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          {validCount} válidos
        </Badge>
        {invalidCount > 0 && (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            {invalidCount} com erro
          </Badge>
        )}
      </div>

      {validCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 mb-2">
            ✅ Os representantes serão cadastrados no sistema como perfis ativos.
          </p>
          <Button onClick={onImport} disabled={isImporting} className="w-full">
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importando {validCount} RCA(s)...
              </>
            ) : (
              `Importar ${validCount} RCA(s)`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImportSummary;
