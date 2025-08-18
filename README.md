# Painel de Recrutamento com IA

Um sistema completo de recrutamento que utiliza inteligência artificial para analisar candidatos e gerar rankings baseados em similaridade com os requisitos das vagas.

## 🚀 Funcionalidades

- **Upload de Vagas**: Suporte para arquivos Excel/CSV com informações das vagas
- **Upload de Candidatos**: Processamento de currículos em PDF/DOCX
- **Extração Automática de Nome**: Identificação automática do nome do candidato no currículo
- **Análise com IA**: Geração de embeddings e observações usando Google Gemini
- **Ranking Inteligente**: Cálculo de similaridade entre vagas e candidatos
- **Visualização Detalhada**: Accordion para visualizar observações completas
- **Interface Moderna**: UI responsiva com shadcn/ui e Tailwind CSS
- **Tratamento de Encoding**: Correção automática de caracteres especiais (UTF-8)

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **IA**: Google Gemini API para embeddings e análise
- **Processamento**: 
  - XLSX para Excel/CSV
  - mammoth para DOCX
  - Tratamento automático de encoding UTF-8

## 📋 Pré-requisitos

- Node.js 18+ 
- MongoDB (local ou Atlas)
- Conta Google Cloud com Gemini API habilitada

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd recruiter
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/recruiter

# Google Gemini API Key
GEMINI_API_KEY=sua_chave_api_gemini_aqui
```

4. **Configure o MongoDB**
- Instale o MongoDB localmente ou use MongoDB Atlas
- Crie um banco de dados chamado `recruiter`

5. **Configure o Google Gemini API**
- Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
- Crie uma API key
- Adicione a chave no arquivo `.env.local`

## 🚀 Executando o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── vagas/         # Endpoints para vagas
│   │   ├── candidatos/    # Endpoints para candidatos
│   │   └── ranking/       # Endpoints para ranking
│   ├── vagas/             # Páginas de vagas
│   └── upload/            # Páginas de upload
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── VagaCard.tsx      # Card de vaga
│   ├── FileUpload.tsx    # Componente de upload
│   └── RankingTable.tsx  # Tabela de ranking
├── lib/                  # Configurações e modelos
│   ├── mongo.ts          # Conexão MongoDB
│   ├── gemini.ts         # Configuração Gemini
│   └── models/           # Modelos Mongoose
└── utils/                # Utilitários
    ├── cosine-similarity.ts  # Cálculo de similaridade
    └── file-parser.ts        # Parsing de arquivos com encoding
```

## 📊 Como Usar

### 1. Upload de Vagas
- Prepare um arquivo Excel/CSV com as colunas:
  - `titulo`: Título da vaga
  - `requisitos`: Descrição dos requisitos
  - `local`: Localização da vaga
  - `salario`: Faixa salarial
  - `vagaId` (opcional): ID único da vaga
- Faça upload na página inicial
- **Caracteres especiais são tratados automaticamente**

### 2. Upload de Candidatos
- Selecione uma vaga
- Faça upload de currículos em PDF ou DOCX
- O sistema processará automaticamente:
  - **Extração automática do nome** do candidato do currículo
  - Extração de texto com encoding correto
  - Geração de embeddings
  - Análise com IA
  - Cálculo de similaridade

### 3. Visualizar Ranking
- Acesse a página de ranking da vaga
- Veja os candidatos ordenados por Fit Score
- **Clique no ícone de olho** para expandir e ver as observações completas
- Analise as observações geradas pela IA em formato detalhado

## 🔍 API Endpoints

### Vagas
- `GET /api/vagas` - Listar todas as vagas
- `POST /api/vagas` - Criar vagas via upload

### Candidatos
- `POST /api/candidatos` - Upload de candidatos

### Ranking
- `GET /api/ranking/[vagaId]` - Obter ranking de candidatos

## 🎨 Personalização

### Cores e Tema
Edite as variáveis CSS em `src/app/globals.css` para personalizar o tema.

### Componentes
Os componentes shadcn/ui podem ser customizados editando os arquivos em `src/components/ui/`.

## 🔧 Funcionalidades Técnicas

### Tratamento de Encoding
- Correção automática de caracteres especiais (UTF-8)
- Suporte para acentos, cedilhas e caracteres especiais
- Compatibilidade com diferentes codificações de arquivo

### Parsing de Arquivos
- **Excel/CSV**: Processamento completo com XLSX
- **DOCX**: Extração de texto com mammoth
- **PDF**: Implementação atual com texto placeholder (veja seção abaixo)

## 📄 Implementação de PDF

### Estado Atual
- O sistema atualmente usa um texto placeholder para PDFs
- Isso permite testar toda a funcionalidade do sistema
- O texto placeholder simula um currículo real com dados estruturados

### Para Implementação em Produção
Para parsing real de PDF, você pode implementar uma das seguintes opções:

#### Opção 1: pdf-parse (Recomendado)
```bash
npm install pdf-parse @types/pdf-parse
```

#### Opção 2: pdfjs-dist (Mais robusto)
```bash
npm install pdfjs-dist
```

#### Opção 3: Google Cloud Vision API
- Mais preciso para PDFs complexos
- Requer configuração adicional

### Como Implementar
Edite o arquivo `src/utils/file-parser.ts` na função `parsePDF()` e substitua o texto placeholder pela implementação desejada.

## 🐛 Troubleshooting

### Erro de Conexão MongoDB
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no `.env.local`

### Erro Gemini API
- Verifique se a API key está correta
- Confirme se a API está habilitada no Google Cloud Console

### Erro de Upload
- Verifique o formato dos arquivos
- Confirme se os campos obrigatórios estão presentes

### Problemas de Encoding
- O sistema corrige automaticamente caracteres especiais
- Se persistir, verifique se o arquivo está salvo em UTF-8

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.
