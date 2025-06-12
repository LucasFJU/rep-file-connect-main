
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFiles } from '@/contexts/FileContext';
import { useToast } from '@/hooks/use-toast';

interface FileWithProgress extends File {
  progress?: number;
  status?: 'uploading' | 'completed' | 'error';
}

const EnhancedFileUpload = () => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploadType, setUploadType] = useState<'personalized' | 'public'>('public');
  const { uploadFile } = useFiles();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Arquivos recebidos:', acceptedFiles);
    
    const newFiles = acceptedFiles.map(file => ({
      ...file,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simular upload com progresso
    newFiles.forEach((file, index) => {
      simulateUpload(file, index);
    });
  }, []);

  const simulateUpload = (file: FileWithProgress, index: number) => {
    console.log('Iniciando upload simulado para:', file.name);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10; // Incremento entre 10-30%
      
      setFiles(prev => prev.map(f => {
        if (f.name === file.name && f.size === file.size) {
          if (progress >= 100) {
            clearInterval(interval);
            
            // Adicionar arquivo ao contexto
            console.log('Upload concluído, adicionando ao contexto:', f.name);
            uploadFile(f, uploadType);
            
            toast({
              title: "Upload concluído",
              description: `${f.name} foi enviado com sucesso.`,
            });
            
            return { ...f, progress: 100, status: 'completed' };
          }
          return { ...f, progress: Math.min(progress, 100) };
        }
        return f;
      }));
    }, 300);
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const completedFiles = files.filter(f => f.status === 'completed');
  const uploadingFiles = files.filter(f => f.status === 'uploading');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Envio de Arquivos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção do Tipo de Upload */}
        <div className="flex gap-2">
          <Button
            variant={uploadType === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadType('public')}
          >
            Público
          </Button>
          <Button
            variant={uploadType === 'personalized' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadType('personalized')}
          >
            Personalizado
          </Button>
        </div>

        {/* Zona de Drop */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-600">Solte os arquivos aqui...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Arraste e solte arquivos aqui, ou clique para selecionar
              </p>
              <p className="text-sm text-gray-400">
                PDF, DOC, DOCX, PNG, JPG, TXT até 10MB cada
              </p>
            </div>
          )}
        </div>

        {/* Lista de Arquivos */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                Arquivos {uploadingFiles.length > 0 ? 'em envio' : 'carregados'}:
              </h4>
              {completedFiles.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  Limpar concluídos
                </Button>
              )}
            </div>
            
            {files.map((file) => (
              <div key={`${file.name}-${file.size}`} className="flex items-center gap-3 p-3 border rounded-lg">
                <File className="h-4 w-4 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <Badge variant={uploadType === 'personalized' ? 'default' : 'secondary'}>
                      {uploadType === 'personalized' ? 'Personalizado' : 'Público'}
                    </Badge>
                    {file.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={file.progress || 0} className="flex-1" />
                    <span className="text-xs text-gray-500">
                      {Math.round(file.progress || 0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Informações de Status */}
        {uploadingFiles.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              {uploadingFiles.length} arquivo(s) sendo enviado(s)...
            </p>
          </div>
        )}

        {completedFiles.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              {completedFiles.length} arquivo(s) enviado(s) com sucesso!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedFileUpload;
