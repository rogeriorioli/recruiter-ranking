import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongo';
import Usuario from '@/lib/models/Usuario';

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha } = await request.json();

    // Validações básicas
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verificar se o email já existe
    const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 12);

    // Criar o usuário
    const novoUsuario = new Usuario({
      nome,
      email: email.toLowerCase(),
      senha: senhaCriptografada,
    });

    await novoUsuario.save();

    return NextResponse.json(
      { message: 'Usuário cadastrado com sucesso' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
