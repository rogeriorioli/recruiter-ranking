'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RankingTable } from '@/components/RankingTable';
import { Navigation } from '@/components/Navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Candidato {
  _id: string;
  nome: string;
  fitScore: number;
  observacoes: string;
  createdAt: string;
}

interface Vaga {
  _id: string;
  titulo: string;
  local: string;
  salario: string;
  requisitos: string;
}

interface RankingData {
  vaga: Vaga;
  ranking: Candidato[];
  totalCandidatos: number;
}

export default function VagaRankingPage() {
  const params = useParams();
  const vagaId = params.vagaId as string;
  
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/ranking/${vagaId}`);
      const data = await response.json();
      
      if (response.ok) {
        setRankingData(data);
      } else {
        setError(data.error || 'Erro ao carregar ranking');
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
      setError('Erro ao carregar ranking');
    } finally {
      setIsLoading(false);
    }
  }, [vagaId]);

  useEffect(() => {
    if (vagaId) {
      fetchRanking();
    }
  }, [vagaId, fetchRanking]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Calculando ranking...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={fetchRanking}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!rankingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Dados não encontrados</h2>
          <p className="text-gray-500 mb-6">
            Não foi possível carregar os dados do ranking
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

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar às Vagas
                </Button>
              </Link>
              <h1 className="text-3xl font-bold mb-2">Ranking de Candidatos</h1>
              <p className="text-gray-500">
                Análise de compatibilidade com a vaga usando IA
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchRanking} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Link href={`/upload/candidatos?vagaId=${vagaId}`}>
                <Button>
                  Adicionar Candidatos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <RankingTable
          vaga={rankingData.vaga}
          ranking={rankingData.ranking}
          totalCandidatos={rankingData.totalCandidatos}
        />
      </div>
    </>
  );
}
