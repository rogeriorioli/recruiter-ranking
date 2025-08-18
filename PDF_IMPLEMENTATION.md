# Implementação de Parsing Real de PDF

## 📋 Estado Atual

O sistema atualmente usa um texto placeholder para PDFs que simula um currículo real. Isso permite testar toda a funcionalidade do sistema sem problemas de dependências.

## 🎯 Opções para Implementação em Produção

### Opção 1: pdf-parse (Recomendado para Simplicidade)

```bash
npm install pdf-parse @types/pdf-parse
```

**Implementação:**
```typescript
export async function parsePDF(file: Buffer): Promise<string> {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(file);
    return fixEncoding(data.text.trim());
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error('Failed to parse PDF file');
  }
}
```

**Vantagens:**
- Simples de implementar
- Funciona bem para PDFs de texto
- Pequeno tamanho de bundle

**Desvantagens:**
- Pode ter problemas com PDFs complexos
- Dependência pode ter problemas de compatibilidade

### Opção 2: pdfjs-dist (Recomendado para Robustez)

```bash
npm install pdfjs-dist
```

**Implementação:**
```typescript
export async function parsePDF(file: Buffer): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configurar worker
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    // Carregar documento
    const loadingTask = pdfjsLib.getDocument({ data: file });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extrair texto de todas as páginas
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fixEncoding(fullText.trim());
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error('Failed to parse PDF file');
  }
}
```

**Vantagens:**
- Mais robusto e confiável
- Suporte a PDFs complexos
- Mantido pela Mozilla
- Melhor extração de texto

**Desvantagens:**
- Bundle maior
- Configuração mais complexa

### Opção 3: Google Cloud Vision API (Recomendado para Precisão)

**Implementação:**
```typescript
import { ImageAnnotatorClient } from '@google-cloud/vision';

export async function parsePDF(file: Buffer): Promise<string> {
  try {
    const client = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    
    const [result] = await client.documentTextDetection(file);
    const fullTextAnnotation = result.fullTextAnnotation;
    
    if (fullTextAnnotation) {
      return fixEncoding(fullTextAnnotation.text);
    } else {
      throw new Error('No text found in PDF');
    }
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error('Failed to parse PDF file');
  }
}
```

**Vantagens:**
- Maior precisão
- Funciona com PDFs escaneados
- OCR de alta qualidade

**Desvantagens:**
- Requer conta Google Cloud
- Custo por requisição
- Configuração mais complexa

## 🔧 Como Implementar

### Passo 1: Escolha uma Opção
Decida qual opção melhor se adequa às suas necessidades:
- **Simplicidade**: pdf-parse
- **Robustez**: pdfjs-dist  
- **Precisão**: Google Cloud Vision API

### Passo 2: Instale as Dependências
```bash
# Para pdf-parse
npm install pdf-parse @types/pdf-parse

# Para pdfjs-dist
npm install pdfjs-dist

# Para Google Cloud Vision
npm install @google-cloud/vision
```

### Passo 3: Edite o Arquivo
Abra `src/utils/file-parser.ts` e substitua a função `parsePDF()` pela implementação escolhida.

### Passo 4: Teste
```bash
npm run build
npm run dev
```

## 🧪 Testando

### Arquivo de Teste
Crie um PDF simples com texto para testar:

```
CURRÍCULO VITAE

DADOS PESSOAIS
Nome: Maria Santos
Email: maria.santos@email.com
Telefone: (11) 88888-8888

EXPERIÊNCIA
Desenvolvedora Frontend - Empresa XYZ (2020-2024)
• React, TypeScript, CSS
• Trabalho em equipe
• Metodologias ágeis

HABILIDADES
• JavaScript, TypeScript
• React, Vue.js
• HTML5, CSS3
• Git, Docker
```

### Verificação
1. Faça upload do PDF
2. Verifique se o texto foi extraído corretamente
3. Confirme se o encoding está correto
4. Teste o ranking gerado

## 🚨 Problemas Comuns

### pdf-parse
- **Erro de arquivo de teste**: Use import dinâmico
- **PDFs complexos**: Considere pdfjs-dist
- **Encoding**: Use a função fixEncoding()

### pdfjs-dist
- **Worker não encontrado**: Configure o worker corretamente
- **Bundle grande**: Use import dinâmico
- **Performance**: Considere processamento em background

### Google Cloud Vision
- **Credenciais**: Configure as variáveis de ambiente
- **Custo**: Monitore o uso da API
- **Rate limiting**: Implemente retry logic

## 📈 Próximos Passos

1. **Implemente uma das opções** acima
2. **Teste com diferentes tipos de PDF**
3. **Otimize a performance** se necessário
4. **Adicione validação** de arquivos
5. **Implemente cache** para PDFs processados

## 🔗 Recursos Úteis

- [pdf-parse Documentation](https://www.npmjs.com/package/pdf-parse)
- [pdfjs-dist Documentation](https://mozilla.github.io/pdf.js/)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
