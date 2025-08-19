'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { Navigation } from '@/components/Navigation';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Vaga {
  _id: string;
  titulo: string;
  local: string;
  salario: string;
  vagaId: string;
}

function UploadCandidatosContent() {
  const searchParams = useSearchParams();
  const vagaId = searchParams.get('vagaId');
  
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const fetchVaga = useCallback(async () => {
    try {
      const response = await fetch('/api/vagas');
      const data = await response.json();
      
      if (response.ok) {
        const vagaEncontrada = data.vagas.find((v: Vaga) => v.vagaId === vagaId);
        if (vagaEncontrada) {
          setVaga(vagaEncontrada);
        }
      }
    } catch (error) {
      console.error('Error fetching vaga:', error);
    }
  }, [vagaId]);

  useEffect(() => {
    if (vagaId) {
      fetchVaga();
    }
  }, [vagaId, fetchVaga]);

  const handleCandidatosUpload = async (files: File[]) => {
    if (files.length === 0 || !vagaId) return;

    setIsLoading(true);
    setUploadStatus('idle');
    
    const formData = new FormData();
    formData.append('vagaId', vagaId);
    
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/candidatos', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('success');
        setMessage(data.message);
      } else {
        setUploadStatus('error');
        setMessage(data.error || 'Erro ao processar candidatos');
      }
    } catch (error) {
      console.error('Error uploading candidatos:', error);
      setUploadStatus('error');
      setMessage('Erro ao fazer upload dos candidatos');
    } finally {
      setIsLoading(false);
    }
  };

  if (!vagaId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">Vaga não especificada</h2>
          <p className="text-gray-500 mb-6">
            É necessário especificar uma vaga para fazer upload de candidatos
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando informações da vaga...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Vagas
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Upload de Candidatos</h1>
          <p className="text-gray-500">
            Adicione currículos para a vaga selecionada
          </p>
        </div>

      {/* Vaga Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vaga Selecionada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{vaga.titulo}</h3>
            <p className="text-gray-500">{vaga.local} • {vaga.salario}</p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Status */}
      {uploadStatus === 'success' && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Upload realizado com sucesso!</h3>
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadStatus === 'error' && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800">Erro no upload</h3>
                <p className="text-sm text-red-700">{message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Component */}
      <FileUpload
        onFilesSelected={handleCandidatosUpload}
        acceptedTypes=".pdf,.docx"
        multiple={true}
        title="Upload de Currículos"
        description="Faça upload de arquivos PDF ou DOCX com os currículos dos candidatos. O nome do arquivo será usado como nome do candidato."
        isLoading={isLoading}
      />

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-1">Formatos aceitos:</h4>
              <ul className="list-disc list-inside text-gray-500 ml-2">
                <li>PDF (.pdf)</li>
                <li>Word (.docx)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Processamento:</h4>
              <ul className="list-disc list-inside text-gray-500 ml-2">
                <li>O texto será extraído automaticamente dos arquivos</li>
                <li>Embeddings serão gerados usando IA para análise de similaridade</li>
                <li>Observações serão criadas automaticamente pela IA</li>
                <li>O ranking será calculado automaticamente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Dica:</h4>
              <p className="text-gray-500 ml-2">
                Use nomes descritivos para os arquivos, pois eles serão usados como nomes dos candidatos no sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {uploadStatus === 'success' && (
        <div className="mt-8 flex gap-4">
          <Link href={`/vagas/${vagaId}`}>
            <Button>
              Ver Ranking
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => {
              setUploadStatus('idle');
              setMessage('');
            }}
          >
            Adicionar Mais Candidatos
          </Button>
        </div>
      )}
    </div>
    </>
  );
}

export default function UploadCandidatosPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      </div>
    }>
      <UploadCandidatosContent />
    </Suspense>
  );
}
