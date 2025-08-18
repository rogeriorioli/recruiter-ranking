'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, User, Target, Eye, ChevronDown } from 'lucide-react';
import { truncateText, formatObservations } from '@/utils/candidate-utils';

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

interface RankingTableProps {
  vaga: Vaga;
  ranking: Candidato[];
  totalCandidatos: number;
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export function RankingTable({ vaga, ranking, totalCandidatos }: RankingTableProps) {
  const [expandedObservations, setExpandedObservations] = useState<Set<string>>(new Set());

  const toggleObservations = (candidatoId: string) => {
    const newExpanded = new Set(expandedObservations);
    if (newExpanded.has(candidatoId)) {
      newExpanded.delete(candidatoId);
    } else {
      newExpanded.add(candidatoId);
    }
    setExpandedObservations(newExpanded);
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getFitScoreVariant = (score: number): BadgeVariant => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Informações da Vaga */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {vaga.titulo}
          </CardTitle>
          <CardDescription>
            {vaga.local} • {vaga.salario} • {totalCandidatos} candidatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-medium">Requisitos:</h4>
            <p className="text-sm text-gray-500">{vaga.requisitos}</p>
          </div>
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Ranking de Candidatos
          </CardTitle>
          <CardDescription>
            Ordenados por Fit Score (similaridade com os requisitos da vaga)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ranking.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum candidato encontrado para esta vaga</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Candidato</TableHead>
                  <TableHead className="w-32">Fit Score</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-32">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map((candidato, index) => {
                  const isExpanded = expandedObservations.has(candidato._id);
                  return (
                    <TableRow key={candidato._id}>
                      <TableCell className="font-medium">
                        {index === 0 && (
                          <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />
                        )}
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{candidato.nome}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getFitScoreVariant(candidato.fitScore)}
                          className={getFitScoreColor(candidato.fitScore)}
                        >
                          {candidato.fitScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <button
                            onClick={() => toggleObservations(candidato._id)}
                            className="w-full text-left py-1 hover:bg-gray-50 rounded transition-colors"
                          >
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              <span className="flex-1">
                                {truncateText(candidato.observacoes || 'Nenhuma observação disponível', 80)}
                              </span>
                              <ChevronDown 
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`} 
                              />
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="mt-2 bg-gray-50 p-3 rounded-md">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {formatObservations(candidato.observacoes || 'Nenhuma observação disponível')}
                              </p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(candidato.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {ranking.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {ranking.filter(c => c.fitScore >= 80).length}
                </div>
                <div className="text-sm text-gray-500">Excelente (80%+)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {ranking.filter(c => c.fitScore >= 60 && c.fitScore < 80).length}
                </div>
                <div className="text-sm text-gray-500">Bom (60-79%)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {ranking.filter(c => c.fitScore < 60).length}
                </div>
                <div className="text-sm text-gray-500">Abaixo (60%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
