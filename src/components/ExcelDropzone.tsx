
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet } from 'lucide-react';

interface ExcelDropzoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const ExcelDropzone: React.FC<ExcelDropzoneProps> = ({ onFileSelect, isProcessing }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  if (isProcessing) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Processando planilha...</p>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
        }`}
    >
      <input {...getInputProps()} />
      <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-blue-600">Solte a planilha Excel aqui...</p>
      ) : (
        <div>
          <p className="text-gray-600 mb-2">
            Arraste e solte sua planilha de RCA's aqui, ou clique para selecionar
          </p>
          <p className="text-sm text-gray-400">
            Formatos suportados: .xlsx, .xls (máx. 5MB)
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Campos obrigatórios: NOME, EMAIL, TELEFONE, ESTADO, REGIÃO
          </p>
        </div>
      )}
    </div>
  );
};

export default ExcelDropzone;
