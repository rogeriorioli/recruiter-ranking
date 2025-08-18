import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    
    const result = await model.embedContent(text);
    const embedding = await result.embedding;
    
    return embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

export async function generateObservations(vagaRequisitos: string, candidatoTexto: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Analise o perfil do candidato em relação aos requisitos da vaga e forneça observações concisas (máximo 100 palavras) sobre:
      
      Requisitos da vaga: ${vagaRequisitos}
      
      Perfil do candidato: ${candidatoTexto}
      
      Forneça observações sobre:
      - Pontos fortes do candidato
      - Possíveis gaps
      - Recomendação geral
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error generating observations:', error);
    return 'Análise não disponível';
  }
}
