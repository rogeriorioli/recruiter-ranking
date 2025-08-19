'use client';

// import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function InstrucoesPage() {
  // const { data: session } = useSession();

  const handleDownloadTemplate = () => {
    // Criar template CSV
    const csvContent = `titulo,requisitos,local,salario,vagaId
"Desenvolvedor Full Stack","JavaScript, React, Node.js, MongoDB, 3+ anos de experiência","São Paulo, SP","R$ 5.000 - R$ 8.000","DEV001"
"Analista de Marketing","Marketing digital, Google Ads, Facebook Ads, 2+ anos de experiência","Rio de Janeiro, RJ","R$ 3.500 - R$ 5.500","MKT001"
"Designer UX/UI","Figma, Adobe Creative Suite, prototipagem, 2+ anos de experiência","Remoto","R$ 4.000 - R$ 6.500","DES001"`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-vagas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcelTemplate = () => {
    // Criar template Excel (simulado com CSV que pode ser aberto no Excel)
    const excelContent = `titulo,requisitos,local,salario,vagaId
"Desenvolvedor Full Stack","JavaScript, React, Node.js, MongoDB, 3+ anos de experiência","São Paulo, SP","R$ 5.000 - R$ 8.000","DEV001"
"Analista de Marketing","Marketing digital, Google Ads, Facebook Ads, 2+ anos de experiência","Rio de Janeiro, RJ","R$ 3.500 - R$ 5.500","MKT001"
"Designer UX/UI","Figma, Adobe Creative Suite, prototipagem, 2+ anos de experiência","Remoto","R$ 4.000 - R$ 6.500","DES001"`;

    const blob = new Blob([excelContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-vagas.xlsx');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Instruções para Upload de Vagas</h1>
          <p className="text-gray-500">
            Aprenda como preparar seus arquivos CSV ou Excel para upload de vagas
          </p>
        </div>

        {/* Download Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Template CSV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Baixe o template CSV para criar suas vagas. Pode ser aberto em qualquer editor de texto ou Excel.
              </p>
              <Button onClick={handleDownloadTemplate} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar Template CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Template Excel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Baixe o template Excel para criar suas vagas. Ideal para quem prefere trabalhar com planilhas.
              </p>
              <Button onClick={handleDownloadExcelTemplate} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar Template Excel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Estrutura do Arquivo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estrutura do Arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Campo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Tipo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Obrigatório</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">titulo</td>
                    <td className="border border-gray-300 px-4 py-2">Texto</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </td>
                                         <td className="border border-gray-300 px-4 py-2">Título da vaga (ex: &quot;Desenvolvedor Full Stack&quot;)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">requisitos</td>
                    <td className="border border-gray-300 px-4 py-2">Texto</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">Descrição detalhada dos requisitos da vaga</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">local</td>
                    <td className="border border-gray-300 px-4 py-2">Texto</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </td>
                                         <td className="border border-gray-300 px-4 py-2">Localização da vaga (ex: &quot;São Paulo, SP&quot; ou &quot;Remoto&quot;)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">salario</td>
                    <td className="border border-gray-300 px-4 py-2">Texto</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </td>
                                         <td className="border border-gray-300 px-4 py-2">Faixa salarial (ex: &quot;R$ 5.000 - R$ 8.000&quot;)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">vagaId</td>
                    <td className="border border-gray-300 px-4 py-2">Texto</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">ID único da vaga (opcional - será gerado automaticamente se não fornecido)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Exemplo Prático */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exemplo Prático</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Exemplo de conteúdo CSV:</h4>
              <pre className="text-sm overflow-x-auto">
{`titulo,requisitos,local,salario,vagaId
"Desenvolvedor Full Stack","JavaScript, React, Node.js, MongoDB, 3+ anos de experiência em desenvolvimento web, conhecimento em APIs RESTful, Git, metodologias ágeis","São Paulo, SP","R$ 5.000 - R$ 8.000","DEV001"
"Analista de Marketing","Marketing digital, Google Ads, Facebook Ads, 2+ anos de experiência, conhecimento em análise de dados, Google Analytics, criação de campanhas","Rio de Janeiro, RJ","R$ 3.500 - R$ 5.500","MKT001"
"Designer UX/UI","Figma, Adobe Creative Suite, prototipagem, 2+ anos de experiência, conhecimento em design system, pesquisa de usuário, testes de usabilidade","Remoto","R$ 4.000 - R$ 6.500","DES001"`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Dicas Importantes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dicas Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Use aspas para textos longos</h4>
                  <p className="text-sm text-gray-600">
                    Sempre coloque textos com vírgulas entre aspas para evitar problemas de parsing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Seja detalhado nos requisitos</h4>
                  <p className="text-sm text-gray-600">
                    Quanto mais detalhados os requisitos, melhor será a análise de compatibilidade com os candidatos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Use IDs únicos</h4>
                  <p className="text-sm text-gray-600">
                    Se fornecer vagaId, certifique-se de que sejam únicos para cada vaga.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Encoding UTF-8</h4>
                  <p className="text-sm text-gray-600">
                    Salve o arquivo em UTF-8 para garantir que caracteres especiais (acentos, cedilhas) sejam exibidos corretamente.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Como Criar no Excel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Como Criar no Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Passo a Passo:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                  <li>Abra o Excel e crie uma nova planilha</li>
                  <li>Na primeira linha, adicione os cabeçalhos: titulo, requisitos, local, salario, vagaId</li>
                  <li>Preencha os dados nas linhas seguintes</li>
                  <li>Salve como &quot;Arquivo CSV UTF-8 (delimitado por vírgulas)&quot;</li>
                  <li>Ou salve como .xlsx e faça upload diretamente</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Como Criar no Google Sheets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Como Criar no Google Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Passo a Passo:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                  <li>Abra o Google Sheets e crie uma nova planilha</li>
                  <li>Na primeira linha, adicione os cabeçalhos: titulo, requisitos, local, salario, vagaId</li>
                  <li>Preencha os dados nas linhas seguintes</li>
                  <li>Vá em Arquivo → Fazer download → Valores separados por vírgula (.csv)</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voltar ao Início */}
        <div className="text-center">
          <Link href="/">
            <Button>
              Voltar ao Painel Principal
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
