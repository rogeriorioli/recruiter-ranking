import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Candidato from '@/lib/models/Candidato';
import Vaga from '@/lib/models/Vaga';
import { generateEmbedding, generateObservations } from '@/lib/gemini';
import { parsePDF, parseDOCX, getFileExtension } from '@/utils/file-parser';
import { extractCandidateName } from '@/utils/candidate-utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const vagaId = formData.get('vagaId') as string;
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!vagaId) {
      return NextResponse.json(
        { error: 'Vaga ID is required' },
        { status: 400 }
      );
    }

    // Verificar se a vaga existe
    const vaga = await Vaga.findOne({ vagaId });
    if (!vaga) {
      return NextResponse.json(
        { error: 'Vaga not found' },
        { status: 404 }
      );
    }

    const candidatosCriados = [];
    
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = getFileExtension(file.name);
      
      let textoCurriculo = '';
      
      if (extension === 'pdf') {
        textoCurriculo = await parsePDF(buffer, file.name);
      } else if (extension === 'docx') {
        textoCurriculo = await parseDOCX(buffer);
      } else {
        continue; // Pular arquivo não suportado
      }

      // Extrair nome do candidato do texto do currículo
      const nome = extractCandidateName(textoCurriculo);
      
      // Gerar embedding para o currículo
      const embedding = await generateEmbedding(textoCurriculo);
      
      // Gerar observações usando IA
      const observacoes = await generateObservations(vaga.requisitos, textoCurriculo);
      
      const candidato = new Candidato({
        nome,
        vagaId,
        textoCurriculo,
        embedding,
        observacoes
      });
      
      await candidato.save();
      candidatosCriados.push(candidato);
    }

    return NextResponse.json({
      message: `${candidatosCriados.length} candidatos processados com sucesso`,
      candidatos: candidatosCriados
    });
    
  } catch (error) {
    console.error('Error processing candidatos:', error);
    return NextResponse.json(
      { error: 'Failed to process candidatos' },
      { status: 500 }
    );
  }
}
