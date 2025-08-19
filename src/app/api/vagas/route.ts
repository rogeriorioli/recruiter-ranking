import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongo';
import Vaga from '@/lib/models/Vaga';
import { generateEmbedding } from '@/lib/gemini';
import { parseExcel, parseCSV, getFileExtension } from '@/utils/file-parser';

interface VagaData {
  titulo?: string;
  requisitos?: string;
  local?: string;
  salario?: string;
  vagaId?: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const vagas = await Vaga.find({ userId: session.user.id }).sort({ createdAt: -1 });
    
    return NextResponse.json({ vagas });
  } catch (error) {
    console.error('Error fetching vagas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vagas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getFileExtension(file.name);
    
    let vagasData: VagaData[] = [];
    
    if (extension === 'xlsx' || extension === 'xls') {
      vagasData = await parseExcel(buffer);
    } else if (extension === 'csv') {
      vagasData = await parseCSV(buffer);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please use Excel or CSV.' },
        { status: 400 }
      );
    }

    const vagasCriadas = [];
    
    for (const vagaData of vagasData) {
      // Validar campos obrigatórios
      if (!vagaData.titulo || !vagaData.requisitos || !vagaData.local || !vagaData.salario) {
        continue; // Pular linha inválida
      }

      // Gerar ID único se não fornecido
      const vagaId = vagaData.vagaId || `vaga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Gerar embedding para os requisitos
      const embedding = await generateEmbedding(vagaData.requisitos);
      
      const vaga = new Vaga({
        userId: session.user.id,
        titulo: vagaData.titulo,
        requisitos: vagaData.requisitos,
        local: vagaData.local,
        salario: vagaData.salario,
        vagaId,
        embedding
      });
      
      await vaga.save();
      vagasCriadas.push(vaga);
    }

    return NextResponse.json({
      message: `${vagasCriadas.length} vagas criadas com sucesso`,
      vagas: vagasCriadas
    });
    
  } catch (error) {
    console.error('Error creating vagas:', error);
    return NextResponse.json(
      { error: 'Failed to create vagas' },
      { status: 500 }
    );
  }
}
