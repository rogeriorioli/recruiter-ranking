import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongo';
import Candidato from '@/lib/models/Candidato';
import Vaga from '@/lib/models/Vaga';
import { cosineSimilarity } from '@/utils/cosine-similarity';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vagaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { vagaId } = await params;
    
    // Buscar a vaga e verificar se pertence ao usuário
    const vaga = await Vaga.findOne({ vagaId, userId: session.user.id });
    if (!vaga) {
      return NextResponse.json(
        { error: 'Vaga not found' },
        { status: 404 }
      );
    }

    // Buscar todos os candidatos da vaga que pertencem ao usuário
    const candidatos = await Candidato.find({ vagaId, userId: session.user.id });
    
    if (candidatos.length === 0) {
      return NextResponse.json({
        vaga,
        ranking: [],
        message: 'Nenhum candidato encontrado para esta vaga'
      });
    }

    // Calcular similaridade para cada candidato
    const ranking = candidatos.map(candidato => {
      const similarity = cosineSimilarity(vaga.embedding, candidato.embedding);
      const fitScore = Math.round(similarity * 100);
      
      return {
        _id: candidato._id,
        nome: candidato.nome,
        fitScore,
        observacoes: candidato.observacoes,
        createdAt: candidato.createdAt
      };
    });

    // Ordenar por fit score (maior para menor)
    ranking.sort((a, b) => b.fitScore - a.fitScore);

    return NextResponse.json({
      vaga: {
        _id: vaga._id,
        titulo: vaga.titulo,
        local: vaga.local,
        salario: vaga.salario,
        requisitos: vaga.requisitos
      },
      ranking,
      totalCandidatos: ranking.length
    });
    
  } catch (error) {
    console.error('Error calculating ranking:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ranking' },
      { status: 500 }
    );
  }
}
