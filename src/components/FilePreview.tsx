
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Image, 
  File, 
  Download,
  Eye,
  X
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: 'personalized' | 'public';
  representativeId?: string;
  representativeName?: string;
  uploadDate: Date;
  size: number;
  status: 'uploaded' | 'sent' | 'error';
}

interface FilePreviewProps {
  files: FileItem[];
  representativeName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend: () => void;
  messageTemplate?: string;
}

const FilePreview = ({ files, representativeName, isOpen, onClose, onConfirmSend, messageTemplate }: FilePreviewProps) => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-600" />;
    }
    
    if (['pdf'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const personalizedFiles = files.filter(f => f.type === 'personalized');
  const publicFiles = files.filter(f => f.type === 'public');
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview do Envio - {representativeName}
            </DialogTitle>
            <DialogDescription>
              Confira os arquivos que serão enviados e a mensagem antes de confirmar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Resumo do Envio */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{files.length}</div>
                    <div className="text-sm text-gray-600">Arquivos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{formatFileSize(totalSize)}</div>
                    <div className="text-sm text-gray-600">Tamanho Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {personalizedFiles.length + (publicFiles.length > 0 ? 1 : 0)}
                    </div>
                    <div className="text-sm text-gray-600">Grupos de Arquivo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mensagem Template */}
            {messageTemplate && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Mensagem que será enviada:</h3>
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm whitespace-pre-wrap">
                      {messageTemplate.replace(/\{\{nome\}\}/g, representativeName)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Arquivos Personalizados */}
            {personalizedFiles.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="default">Personalizados</Badge>
                  {personalizedFiles.length} arquivo(s)
                </h3>
                <div className="grid gap-3">
                  {personalizedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.name)}
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • Enviado em {file.uploadDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedFile(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Arquivos Públicos */}
            {publicFiles.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Públicos</Badge>
                  {publicFiles.length} arquivo(s)
                </h3>
                <div className="grid gap-3">
                  {publicFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.name)}
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-gray-600">
                            {formatFileSize(file.size)} • Enviado em {file.uploadDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedFile(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={onConfirmSend} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Confirmar e Enviar
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Arquivo Individual */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Arquivo</DialogTitle>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                {getFileIcon(selectedFile.name)}
                <div className="flex-1">
                  <div className="font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatFileSize(selectedFile.size)} • 
                    {selectedFile.type === 'personalized' ? ' Personalizado' : ' Público'} • 
                    Enviado em {selectedFile.uploadDate.toLocaleDateString()}
                  </div>
                </div>
                <Badge variant={selectedFile.type === 'personalized' ? 'default' : 'secondary'}>
                  {selectedFile.type === 'personalized' ? 'Personalizado' : 'Público'}
                </Badge>
              </div>
              
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <File className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Preview não disponível</p>
                <p className="text-sm text-gray-500">Em uma implementação real, aqui seria exibido o preview do arquivo</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilePreview;
