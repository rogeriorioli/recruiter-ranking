import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongo';
import Usuario from './models/Usuario';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          return null;
        }

        try {
          await connectDB();
          
          const usuario = await Usuario.findOne({ email: credentials.email });
          
          if (!usuario) {
            return null;
          }

          const senhaValida = await bcrypt.compare(credentials.senha, usuario.senha);
          
          if (!senhaValida) {
            return null;
          }

          return {
            id: usuario._id.toString(),
            email: usuario.email,
            nome: usuario.nome,
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.nome = token.nome as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
