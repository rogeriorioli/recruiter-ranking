'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VagaCard } from '@/components/VagaCard';
import { FileUpload } from '@/components/FileUpload';
import { Plus, Briefcase, Upload, Users } from 'lucide-react';

interface Vaga {
  _id: string;
  titulo: string;
  local: string;
  salario: string;
  requisitos: string;
  vagaId: string;
  createdAt: string;
}

export default function Home() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      const response = await fetch('/api/vagas');
      const data = await response.json();
      
      if (response.ok) {
        setVagas(data.vagas);
      } else {
        console.error('Error fetching vagas:', data.error);
      }
    } catch (error) {
      console.error('Error fetching vagas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVagasUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/vagas', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowUpload(false);
        fetchVagas(); // Recarregar lista
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading vagas:', error);
      alert('Erro ao fazer upload das vagas');
    } finally {
      setUploadLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando vagas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel de Recrutamento</h1>
        <p className="text-gray-500">
          Gerencie vagas e analise candidatos com IA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vagas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vagas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações</CardTitle>
            <Upload className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowUpload(!showUpload)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Vaga
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="mb-8">
          <FileUpload
            onFilesSelected={handleVagasUpload}
            acceptedTypes=".xlsx,.xls,.csv"
            multiple={false}
            title="Upload de Vagas"
            description="Faça upload de um arquivo Excel ou CSV com as vagas. O arquivo deve conter as colunas: titulo, requisitos, local, salario"
            isLoading={uploadLoading}
          />
        </div>
      )}

      {/* Vagas List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Vagas Disponíveis</h2>
          {!showUpload && (
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Vagas
            </Button>
          )}
        </div>

        {vagas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-gray-500 mb-4">
                Comece fazendo upload de vagas para começar a usar o sistema
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Vaga
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vagas.map((vaga) => (
              <VagaCard key={vaga._id} vaga={vaga} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
