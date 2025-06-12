
import { useState } from "react";
import { useFiles } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Users, 
  Link,
  Unlink,
  Search
} from "lucide-react";

const FileAssignment = () => {
  const { files, representatives, assignFileToRepresentative } = useFiles();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<string>('');

  const unassignedFiles = files.filter(f => f.type === 'personalized' && !f.representativeId);
  const assignedFiles = files.filter(f => f.type === 'personalized' && f.representativeId);

  const handleAssignFile = (fileId: string, representativeId: string) => {
    const file = files.find(f => f.id === fileId);
    const representative = representatives.find(r => r.id === representativeId);
    
    if (file && representative) {
      assignFileToRepresentative(fileId, representativeId);
      toast({
        title: "Arquivo vinculado",
        description: `${file.name} foi vinculado a ${representative.name}`,
      });
    }
  };

  const handleUnassignFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      assignFileToRepresentative(fileId, undefined);
      toast({
        title: "Arquivo desvinculado",
        description: `${file.name} foi desvinculado`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Arquivos Não Vinculados */}
      {unassignedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlink className="h-5 w-5 text-orange-600" />
              Arquivos Não Vinculados ({unassignedFiles.length})
            </CardTitle>
            <CardDescription>
              Arquivos personalizados que precisam ser vinculados a representantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unassignedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(1)} MB • {file.uploadDate.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(repId) => handleAssignFile(file.id, repId)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Selecionar representante" />
                      </SelectTrigger>
                      <SelectContent>
                        {representatives.map((rep) => (
                          <SelectItem key={rep.id} value={rep.id}>
                            {rep.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arquivos Vinculados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-green-600" />
            Arquivos Vinculados ({assignedFiles.length})
          </CardTitle>
          <CardDescription>
            Arquivos personalizados já vinculados a representantes específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum arquivo personalizado vinculado ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {file.representativeName}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(repId) => handleAssignFile(file.id, repId)} defaultValue={file.representativeId}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {representatives.map((rep) => (
                          <SelectItem key={rep.id} value={rep.id}>
                            {rep.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassignFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dica de Vinculação Automática */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Vinculação Automática
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Como funciona a detecção automática:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>O sistema busca o nome do representante no nome do arquivo</li>
              <li>Exemplo: "relatorio-joao.pdf" será vinculado a "João Silva"</li>
              <li>Também funciona com primeiro nome: "apresentacao-maria.pptx"</li>
              <li>Use hífen, underscore ou espaços para separar palavras</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <p className="text-blue-800">
                <strong>Dica:</strong> Para melhor detecção, use nomes como: 
                "documento-{"{nome}"}.pdf" ou "{"{nome}"}-relatorio.docx"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileAssignment;
