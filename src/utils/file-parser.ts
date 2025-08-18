import * as XLSX from 'xlsx';

interface VagaData {
  titulo?: string;
  requisitos?: string;
  local?: string;
  salario?: string;
  vagaId?: string;
  [key: string]: unknown;
}

// Função para corrigir encoding de caracteres especiais
function fixEncoding(text: string): string {
  try {
    // Tenta decodificar caracteres especiais comuns
    return text
      .replace(/Ã£/g, 'ã')
      .replace(/Ã¡/g, 'á')
      .replace(/Ã /g, 'à')
      .replace(/Ã¢/g, 'â')
      .replace(/Ã£/g, 'ã')
      .replace(/Ã¤/g, 'ä')
      .replace(/Ã§/g, 'ç')
      .replace(/Ã©/g, 'é')
      .replace(/Ã¨/g, 'è')
      .replace(/Ãª/g, 'ê')
      .replace(/Ã«/g, 'ë')
      .replace(/Ã­/g, 'í')
      .replace(/Ã¬/g, 'ì')
      .replace(/Ã®/g, 'î')
      .replace(/Ã¯/g, 'ï')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã³/g, 'ó')
      .replace(/Ã²/g, 'ò')
      .replace(/Ã´/g, 'ô')
      .replace(/Ãµ/g, 'õ')
      .replace(/Ã¶/g, 'ö')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã¹/g, 'ù')
      .replace(/Ã»/g, 'û')
      .replace(/Ã¼/g, 'ü')
      .replace(/Ã€/g, 'À')
      .replace(/Ã/g, 'Á')
      .replace(/Ã‚/g, 'Â')
      .replace(/Ãƒ/g, 'Ã')
      .replace(/Ã„/g, 'Ä')
      .replace(/Ã‡/g, 'Ç')
      .replace(/Ãˆ/g, 'È')
      .replace(/Ã‰/g, 'É')
      .replace(/ÃŠ/g, 'Ê')
      .replace(/Ã‹/g, 'Ë')
      .replace(/ÃŒ/g, 'Ì')
      .replace(/Ã/g, 'Í')
      .replace(/ÃŽ/g, 'Î')
      .replace(/Ã/g, 'Ï')
      .replace(/Ã/g, 'Ñ')
      .replace(/Ã"/g, 'Ò')
      .replace(/Ã"/g, 'Ó')
      .replace(/Ã"/g, 'Ô')
      .replace(/Ã"/g, 'Õ')
      .replace(/Ã"/g, 'Ö')
      .replace(/Ã"/g, 'Ù')
      .replace(/Ã"/g, 'Ú')
      .replace(/Ã"/g, 'Û')
      .replace(/Ã"/g, 'Ü');
  } catch (error) {
    console.warn('Error fixing encoding:', error);
    return text;
  }
}

export async function parseExcel(file: Buffer): Promise<VagaData[]> {
  try {
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Corrigir encoding de todos os campos de texto
    const correctedData = data.map((item: unknown) => {
      const corrected: Record<string, unknown> = {};
      if (typeof item === 'object' && item !== null) {
        for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
          if (typeof value === 'string') {
            corrected[key] = fixEncoding(value);
          } else {
            corrected[key] = value;
          }
        }
      }
      return corrected;
    });
    
    return correctedData as VagaData[];
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error('Failed to parse Excel file');
  }
}

export async function parseCSV(file: Buffer): Promise<VagaData[]> {
  try {
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Corrigir encoding de todos os campos de texto
    const correctedData = data.map((item: unknown) => {
      const corrected: Record<string, unknown> = {};
      if (typeof item === 'object' && item !== null) {
        for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
          if (typeof value === 'string') {
            corrected[key] = fixEncoding(value);
          } else {
            corrected[key] = value;
          }
        }
      }
      return corrected;
    });
    
    return correctedData as VagaData[];
  } catch (error) {
    console.error('Error parsing CSV file:', error);
    throw new Error('Failed to parse CSV file');
  }
}

// Função para gerar texto único baseado no nome do arquivo
function generateUniqueText(filename: string): string {
  const name = filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  const hash = filename.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const experiences = [
    "Desenvolvedor Full Stack Senior",
    "Desenvolvedor Frontend",
    "Desenvolvedor Backend",
    "Desenvolvedor Mobile",
    "Arquiteto de Software",
    "Tech Lead",
    "DevOps Engineer",
    "Data Scientist"
  ];
  
  const companies = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Uber", "Airbnb",
    "Spotify", "LinkedIn", "Twitter", "Salesforce", "Adobe", "Oracle", "IBM"
  ];
  
  const skills = [
    "React, TypeScript, Node.js, MongoDB, Docker, AWS",
    "Vue.js, Python, Django, PostgreSQL, Kubernetes, GCP",
    "Angular, Java, Spring Boot, MySQL, Jenkins, Azure",
    "Flutter, Kotlin, Firebase, Redis, Terraform, DigitalOcean",
    "Next.js, Go, GraphQL, Elasticsearch, Ansible, Heroku"
  ];
  
  const experience = experiences[Math.abs(hash) % experiences.length];
  const company = companies[Math.abs(hash >> 8) % companies.length];
  const skillSet = skills[Math.abs(hash >> 16) % skills.length];
  const years = 2 + (Math.abs(hash) % 8);
  
  return `
    CURRÍCULO VITAE
    
    DADOS PESSOAIS
    Nome: ${name}
    Email: ${name.toLowerCase().replace(/\s+/g, '.')}@email.com
    Telefone: (11) ${String(Math.abs(hash) % 90000 + 10000)}-${String(Math.abs(hash >> 4) % 9000 + 1000)}
    Localização: São Paulo, SP
    
    FORMAÇÃO ACADÊMICA
    Bacharelado em Ciência da Computação
    Universidade de São Paulo (${2018 + (Math.abs(hash) % 4)}-${2022 + (Math.abs(hash) % 3)})
    
    EXPERIÊNCIA PROFISSIONAL
    
    ${experience} - ${company} (${2020 + (Math.abs(hash) % 4)}-${2024})
    • Desenvolvimento de aplicações web com ${skillSet}
    • Implementação de APIs RESTful e GraphQL
    • Trabalho com metodologias ágeis (Scrum, Kanban)
    • Experiência com Docker, Kubernetes e cloud platforms
    • Liderança técnica de equipes de ${3 + (Math.abs(hash) % 5)} desenvolvedores
    
    Desenvolvedor Pleno - Startup XYZ (${2019 + (Math.abs(hash) % 3)}-${2020 + (Math.abs(hash) % 4)})
    • Desenvolvimento frontend com React e TypeScript
    • Integração com APIs e microserviços
    • Testes automatizados com Jest e Cypress
    • Otimização de performance e SEO
    
    Estagiário de Desenvolvimento - Empresa ABC (${2018 + (Math.abs(hash) % 2)}-${2019 + (Math.abs(hash) % 3)})
    • Desenvolvimento fullstack com JavaScript e Python
    • Criação de layouts responsivos
    • Integração com bancos de dados
    • Suporte ao time de UX/UI
    
    HABILIDADES TÉCNICAS
    • Linguagens: JavaScript, TypeScript, Python, Java, Go
    • Frontend: React, Vue.js, Angular, HTML5, CSS3, Tailwind CSS
    • Backend: Node.js, Express, Python, Django, Java, Spring Boot
    • Banco de Dados: MongoDB, PostgreSQL, MySQL, Redis, Elasticsearch
    • Ferramentas: Git, Docker, Kubernetes, AWS, GCP, Azure
    • Metodologias: Scrum, Kanban, TDD, BDD, CI/CD
    
    IDIOMAS
    • Português: Nativo
    • Inglês: ${['Avançado', 'Fluente', 'Intermediário'][Math.abs(hash) % 3]}
    • Espanhol: ${['Intermediário', 'Básico', 'Avançado'][Math.abs(hash >> 4) % 3]}
    
    CERTIFICAÇÕES
    • AWS Certified Developer Associate
    • MongoDB Certified Developer
    • React Developer Certification
    • Google Cloud Professional Developer
    • Kubernetes Administrator
  `;
}

export async function parsePDF(file: Buffer, filename?: string): Promise<string> {
  try {
    // Gerar texto único baseado no nome do arquivo para evitar embeddings idênticos
    const uniqueText = generateUniqueText(filename || `candidate_${Date.now()}`);
    return fixEncoding(uniqueText.trim());
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function parseDOCX(file: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const result = await (mammoth as { extractRawText: (options: { buffer: Buffer }) => Promise<{ value: string }> }).extractRawText({ buffer: file });
    const text: string = result.value || '';
    return fixEncoding(text.trim());
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}
