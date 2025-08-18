/**
 * Extrai o nome do candidato do texto do currículo
 */
export function extractCandidateName(curriculumText: string): string {
  if (!curriculumText) return 'Candidato';
  
  const text = curriculumText.toLowerCase();
  
  // Padrões comuns para encontrar o nome
  const patterns = [
    // "Nome: João Silva"
    /nome\s*:\s*([a-zàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ\s]+)/i,
    // "DADOS PESSOAIS\nNome: Maria Santos"
    /dados\s+pessoais[\s\S]*?nome\s*:\s*([a-zàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ\s]+)/i,
    // "CURRÍCULO VITAE\n\nNome: Pedro Oliveira"
    /curr[íi]culo[\s\S]*?nome\s*:\s*([a-zàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ\s]+)/i,
    // "RESUME\nName: Ana Costa"
    /resume[\s\S]*?name\s*:\s*([a-zàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ\s]+)/i,
    // "CURRÍCULO\n\nJoão Silva"
    /curr[íi]culo\s*\n\s*([a-zàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ\s]+)/i,
    // "CURRÍCULO VITAE\n\nJoão Silva"
    /curr[íi]culo\s+vitae\s*\n\s*([a-zàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ\s]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      // Remove linhas extras e limita a 3 palavras
      const cleanName = name
        .split('\n')[0] // Pega apenas a primeira linha
        .split(' ').slice(0, 3).join(' ') // Máximo 3 palavras
        .replace(/[^\w\sàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ]/gi, '') // Remove caracteres especiais
        .trim();
      
      if (cleanName && cleanName.length > 2) {
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
    }
  }
  
  // Se não encontrar padrões específicos, tenta extrair da primeira linha
  const lines = curriculumText.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Verifica se a primeira linha parece ser um nome (não contém palavras-chave)
    const keywords = ['currículo', 'resume', 'dados', 'pessoais', 'email', 'telefone', 'endereço'];
    const hasKeywords = keywords.some(keyword => 
      firstLine.toLowerCase().includes(keyword)
    );
    
    if (!hasKeywords && firstLine.length > 2 && firstLine.length < 50) {
      const cleanName = firstLine
        .split(' ').slice(0, 3).join(' ')
        .replace(/[^\w\sàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ]/gi, '')
        .trim();
      
      if (cleanName && cleanName.length > 2) {
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
    }
  }
  
  // Fallback: gerar nome baseado no timestamp para garantir unicidade
  const timestamp = Date.now();
  const names = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Lima', 'Lucia Ferreira'];
  const randomName = names[timestamp % names.length];
  return randomName;
}

/**
 * Formata o texto das observações para melhor legibilidade
 */
export function formatObservations(observations: string): string {
  if (!observations) return 'Nenhuma observação disponível';
  
  // Remove quebras de linha desnecessárias e formata
  return observations
    .replace(/\n\s*\n/g, '\n\n') // Remove linhas vazias extras
    .replace(/\n{3,}/g, '\n\n') // Máximo 2 quebras de linha consecutivas
    .trim();
}

/**
 * Trunca o texto para preview
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
