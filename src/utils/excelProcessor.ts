
import * as XLSX from 'xlsx';
import { RepresentativeRow } from '@/types/representative';
import { validateRow } from './excelValidation';

export const processExcelFile = (
  file: File,
  onSuccess: (data: RepresentativeRow[]) => void,
  onError: (message: string) => void
) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Converter para JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        onError("O arquivo deve conter pelo menos uma linha de cabeçalho e uma linha de dados.");
        return;
      }

      // Primeira linha são os headers
      const headers = jsonData[0] as string[];
      const expectedHeaders = ['nome', 'email', 'telefone', 'estado', 'regiao'];
      
      // Verificar se os headers necessários estão presentes
      const missingHeaders = expectedHeaders.filter(header => 
        !headers.some(h => h?.toLowerCase().replace(/ã/g, 'a').includes(header))
      );
      
      if (missingHeaders.length > 0) {
        onError(`Headers obrigatórios faltando: ${missingHeaders.join(', ')}. Use: NOME, EMAIL, TELEFONE, ESTADO, REGIÃO`);
        return;
      }

      // Mapear colunas
      const nameCol = headers.findIndex(h => h?.toLowerCase().includes('nome'));
      const emailCol = headers.findIndex(h => h?.toLowerCase().includes('email'));
      const phoneCol = headers.findIndex(h => h?.toLowerCase().includes('telefone'));
      const stateCol = headers.findIndex(h => h?.toLowerCase().includes('estado'));
      const regionCol = headers.findIndex(h => h?.toLowerCase().replace(/ã/g, 'a').includes('regiao'));

      // Processar dados
      const rows = jsonData.slice(1).map((row: any[], index) => {
        const rowData = {
          name: row[nameCol],
          email: row[emailCol],
          phone: row[phoneCol],
          state: row[stateCol],
          region: row[regionCol]
        };
        return validateRow(rowData, index);
      }).filter(row => row.name || row.email || row.phone || row.state || row.region); // Filtrar linhas completamente vazias

      onSuccess(rows);

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      onError("Erro ao processar o arquivo Excel. Verifique o formato.");
    }
  };

  reader.readAsBinaryString(file);
};

export const downloadTemplate = () => {
  const template = [
    ['NOME', 'EMAIL', 'TELEFONE', 'ESTADO', 'REGIÃO'],
    ['ADOLFO', 'adolfo@empresa.com', '(16) 99176-4200', 'SÃO PAULO', 'FRANCA'],
    ['AECIO', 'aecio@empresa.com', '(34) 99983-6093', 'MINAS GERAIS', 'NORESTE MININAS'],
    ['ALCIMAR', 'alcimar@empresa.com', '(91) 99352-2219', 'PARÁ', 'SUL DO PARÁ']
  ];

  const ws = XLSX.utils.aoa_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Representantes');
  XLSX.writeFile(wb, 'planilha_representantes_rca.xlsx');
};
