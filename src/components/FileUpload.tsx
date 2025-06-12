
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFiles } from '@/contexts/FileContext';
import { useToast } from '@/hooks/use-toast';

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<'personalized' | 'public'>('public');
  const { uploadFile } = useFiles();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleUpload = () => {
    files.forEach(file => {
      uploadFile(file, uploadType);
    });
    
    toast({
      title: "Arquivos enviados",
      description: `${files.length} arquivo(s) enviado(s) com sucesso.`,
    });
    
    setFiles([]);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Arquivos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.name} className="flex items-center gap-3 p-3 border rounded-lg">
                <File className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button onClick={handleUpload} className="w-full">
              Enviar {files.length} arquivo(s)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
