# Configuração do Sistema de Autenticação

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# MongoDB Configuration (se não estiver configurado)
MONGODB_URI=your-mongodb-connection-string
```

## Como Gerar o NEXTAUTH_SECRET

Para gerar uma chave secreta segura, execute no terminal:

```bash
openssl rand -base64 32
```

Ou use um gerador online de chaves secretas.

## Funcionalidades Implementadas

### 1. Sistema de Cadastro
- Página de cadastro em `/cadastro`
- Validação de campos obrigatórios
- Verificação de email único
- Criptografia de senha com bcrypt

### 2. Sistema de Login
- Página de login em `/login`
- Autenticação com email e senha
- Redirecionamento automático após login
- Tratamento de erros

### 3. Proteção de Rotas
- Middleware configurado para proteger todas as rotas
- Exceções para páginas de login e cadastro
- Redirecionamento automático para login se não autenticado

### 4. Isolamento de Dados por Usuário
- Todas as vagas e candidatos são associados ao usuário logado
- APIs protegidas para retornar apenas dados do usuário atual
- Verificação de propriedade nas operações

### 5. Interface de Usuário
- Barra de navegação com informações do usuário
- Botão de logout
- Navegação consistente em todas as páginas

## Estrutura de Dados

### Modelo de Usuário
```typescript
{
  nome: string;
  email: string;
  senha: string; // criptografada
  createdAt: Date;
  updatedAt: Date;
}
```

### Vagas e Candidatos Atualizados
- Adicionado campo `userId` para associar ao usuário
- Todas as consultas filtram por `userId`

## Como Usar

1. Configure as variáveis de ambiente
2. Execute o projeto: `npm run dev`
3. Acesse `/cadastro` para criar uma conta
4. Faça login em `/login`
5. Use o sistema normalmente - todos os dados serão isolados por usuário

## Segurança

- Senhas criptografadas com bcrypt
- Sessões JWT seguras
- Proteção CSRF automática
- Validação de entrada em todas as APIs
- Isolamento completo de dados entre usuários
