
import React, { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseDataContext } from '@/contexts/SupabaseDataContext';
import { useToast } from '@/hooks/use-toast';
import { RepresentativeRow } from '@/types/representative';
import { processExcelFile, downloadTemplate } from '@/utils/excelProcessor';
import ExcelDropzone from './ExcelDropzone';
import ImportSummary from './ImportSummary';
import RepresentativePreview from './RepresentativePreview';

const ExcelRepresentativeImport = () => {
  const [importedData, setImportedData] = useState<RepresentativeRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { addProfile, fetchProfiles } = useSupabaseDataContext();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setIsProcessing(true);
    
    processExcelFile(
      file,
      (data) => {
        setImportedData(data);
        setIsProcessing(false);
        toast({
          title: "Arquivo processado",
          description: `${data.length} registros encontrados. ${data.filter(r => r.isValid).length} válidos.`,
        });
      },
      (errorMessage) => {
        setIsProcessing(false);
        toast({
          title: "Erro na importação",
          description: errorMessage,
          variant: "destructive",
        });
      }
    );
  };

  const importValidRepresentatives = async () => {
    const validReps = importedData.filter(rep => rep.isValid);
    
    if (validReps.length === 0) {
      toast({
        title: "Nenhum representante válido",
        description: "Corrija os erros antes de importar.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const rep of validReps) {
      try {
        console.log('Importando representante:', rep.name, rep.email);
        
        const profile = await addProfile({
          name: rep.name,
          email: rep.email,
          phone: rep.phone,
          role: 'representative'
        });

        if (profile) {
          console.log('Representante criado com sucesso:', profile);
          successCount++;
        } else {
          console.error('Falha ao criar perfil para:', rep.email);
          errorCount++;
          errors.push(`Falha ao criar ${rep.name}`);
        }
      } catch (error) {
        console.error(`Erro ao processar ${rep.email}:`, error);
        errorCount++;
        errors.push(`Erro ao processar ${rep.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    setIsImporting(false);
    
    if (successCount > 0) {
      // Atualizar lista de perfis
      await fetchProfiles();
      setImportedData([]);
      
      toast({
        title: "Importação concluída",
        description: `${successCount} representante(s) importado(s) com sucesso${errorCount > 0 ? `. ${errorCount} erro(s) encontrado(s).` : '.'}`,
      });
    }

    if (errorCount > 0 && successCount === 0) {
      toast({
        title: "Falha na importação",
        description: errors.join(', '),
        variant: "destructive",
      });
    }
  };

  const validCount = importedData.filter(rep => rep.isValid).length;
  const invalidCount = importedData.filter(rep => !rep.isValid).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Importar RCA's via Planilha Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Download */}
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-blue-900">Baixe o template da empresa</p>
            <p className="text-xs text-blue-600">Planilha com os campos: NOME, EMAIL, TELEFONE, ESTADO, REGIÃO</p>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Template RCA's
          </Button>
        </div>

        {/* Upload Area */}
        <ExcelDropzone onFileSelect={handleFileSelect} isProcessing={isProcessing} />

        {/* Results */}
        {importedData.length > 0 && (
          <div className="space-y-4">
            <ImportSummary 
              validCount={validCount}
              invalidCount={invalidCount}
              onImport={importValidRepresentatives}
              isImporting={isImporting}
            />
            <RepresentativePreview 
              data={importedData}
              onClear={() => setImportedData([])}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExcelRepresentativeImport;
