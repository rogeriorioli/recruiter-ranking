'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';

interface VagaCardProps {
  vaga: {
    _id: string;
    titulo: string;
    local: string;
    salario: string;
    requisitos: string;
    vagaId: string;
    createdAt: string;
  };
}

export function VagaCard({ vaga }: VagaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{vaga.titulo}</CardTitle>
            <CardDescription className="line-clamp-2">
              {vaga.requisitos.substring(0, 150)}...
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{vaga.local}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <DollarSign className="h-4 w-4" />
            <span>{vaga.salario}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Criada em {formatDate(vaga.createdAt)}</span>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Link href={`/vagas/${vaga.vagaId}`}>
              <Button size="sm" className="flex-1">
                Ver Ranking
              </Button>
            </Link>
            <Link href={`/upload/candidatos?vagaId=${vaga.vagaId}`}>
              <Button size="sm" variant="outline">
                Adicionar Candidatos
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
