
import React from 'react';
import { RepresentativeRow } from '@/types/representative';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface RepresentativePreviewProps {
  data: RepresentativeRow[];
  onClear: () => void;
}

const RepresentativePreview: React.FC<RepresentativePreviewProps> = ({ data, onClear }) => {
  return (
    <div className="space-y-4">
      <div className="max-h-80 overflow-y-auto border rounded-lg">
        <div className="space-y-2 p-4">
          {data.map((rep, index) => (
            <div key={index} className={`p-3 border rounded-lg ${rep.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {rep.isValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs text-gray-500">Linha {rep.rowIndex}</span>
                  </div>
                  <p className="font-medium text-sm">{rep.name || 'Nome não informado'}</p>
                  <p className="text-xs text-gray-600">📧 {rep.email || 'Email não informado'}</p>
                  <p className="text-xs text-gray-600">📞 {rep.phone || 'Telefone não informado'}</p>
                  <p className="text-xs text-gray-600">🏛️ {rep.state || 'Estado não informado'}</p>
                  <p className="text-xs text-gray-600">📍 {rep.region || 'Região não informada'}</p>
                  {rep.isValid && (
                    <p className="text-xs text-green-600">✅ Representante será cadastrado no sistema</p>
                  )}
                  {!rep.isValid && (
                    <div className="mt-2">
                      {rep.errors.map((error, errorIndex) => (
                        <p key={errorIndex} className="text-xs text-red-600">• {error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={onClear} className="w-full">
        <X className="h-4 w-4 mr-2" />
        Limpar Dados
      </Button>
    </div>
  );
};

export default RepresentativePreview;
