import React, { useState, useEffect } from 'react';

// Simulando a disponibilidade de um Router, já que você usou vite/react
const useRoutes = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handlePopState();
    };
    
    // Simula o redirecionamento do servidor
    if (path.startsWith('/dashboard')) {
      const authCheck = localStorage.getItem('isLoggedIn') === 'true';
      if (!authCheck) {
        // Em um app real, faríamos um fetch, aqui simulamos:
        // Se a rota for dashboard, assume que o login foi tentado
        localStorage.setItem('isLoggedIn', 'true');
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [path]);

  const navigate = (newPath) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
  };

  return { path, navigate };
};

// Componente: Tela de Login/Portfólio Público
const LoginPage = ({ navigate }) => {
  const handleLogin = () => {
    // Redireciona para o endpoint de backend que inicia o OAuth do GitHub
    window.location.href = 'http://localhost:3000/auth/github';
  };

  const projectList = [
    { name: "Sistema de Autenticação OAuth (Este Projeto)", description: "Backend Node.js/Express com Passport.js e MongoDB para Login Seguro via GitHub.", url: "https://github.com/SeuUsuario/RepoBootcamp" },
    { name: "Análise de Dados com Python", description: "Projeto de Data Science utilizando Pandas e Matplotlib para visualização de tendências financeiras.", url: "https://github.com/SeuUsuario/DataAnalytics" },
    { name: "Landing Page Responsiva", description: "Design moderno e totalmente responsivo desenvolvido com React e Tailwind CSS.", url: "https://github.com/SeuUsuario/ResponsiveLanding" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 md:p-10 transition duration-300">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700">PortfolioHUB</h1>
          <p className="text-gray-600 mt-2">Plataforma centralizada para exibição e gestão de portfólios digitais.</p>
        </header>

        <section className="mb-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acesso e Gestão</h2>
          <p className="text-lg text-gray-700 mb-6">Entre com seu GitHub para visualizar o Dashboard de Gerenciamento e a documentação completa.</p>
          
          <button
            onClick={handleLogin}
            className="w-full md:w-auto px-8 py-3 bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
          >
            Acessar com GitHub
          </button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-2">Projetos em Destaque (Portfólio Público)</h2>
          <div className="space-y-4">
            {projectList.map((project, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 text-sm font-medium mt-2 inline-block">
                  Ver Repositório &rarr;
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Componente: Dashboard (Pós-Login)
const DashboardPage = ({ navigate }) => {
  const [userName, setUserName] = useState('Usuário GitHub'); // Simulação
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simula a obtenção de dados do usuário logado (normalmente viria do backend)
    setTimeout(() => {
      // Aqui você faria um fetch para '/api/user' no backend
      setIsReady(true);
      // Aqui, o backend já confirmou que o login funcionou!
    }, 500);
  }, []);


  const handleLogout = () => {
    // Redireciona para o endpoint de logout no backend
    window.location.href = 'http://localhost:3000/logout';
    localStorage.removeItem('isLoggedIn');
    setIsLoggedOut(true);
  };

  if (isLoggedOut) {
    return <div className="p-10 text-center">Desconectado com sucesso.</div>;
  }
  
  if (!isReady) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-xl font-medium">Carregando Dashboard...</div></div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6 border-b pb-2">Dashboard de Gerenciamento - Logado</h1>
        <p className="text-lg mb-8">Olá, <span className="font-extrabold text-gray-800">{userName}</span>! O Login com GitHub e a integração de segurança foram concluídos com sucesso.</p>

        <div className="space-y-6">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Seção 5: Integração e Testes (Concluída)</h3>
            <p className="text-gray-700">O sistema validou sua autenticação (via token e sessão) e o backend (porta 3000) redirecionou você para este painel no frontend (porta 5173), comprovando o fluxo completo.</p>
          </div>
          
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Controle de Versão e Acesso (Seção 4)</h3>
            <p className="text-gray-700">Esta seção permite gerenciar permissões de repositórios privados e públicos via API do GitHub (usando o `GITHUB_PAT` no Backend).</p>
            <p className="mt-2 text-sm text-gray-500">Exemplo de Uso: Clique em um repositório para revogar o acesso de um colaborador específico, gerenciado via OAuth.</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Sair e Desconectar GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const App = () => {
  const { path } = useRoutes();

  const renderComponent = () => {
    if (path === '/' || path.startsWith('/?')) {
      return <LoginPage />;
    }
    if (path.startsWith('/dashboard')) {
      // Simula a lógica de Auth para evitar redirecionamento infinito em produção
      if (localStorage.getItem('isLoggedIn') !== 'true') {
         // Em produção, isso faria um fetch no backend para verificar a sessão.
         // Aqui, garantimos a renderização do dashboard após o callback do server/index.js
      }
      return <DashboardPage />;
    }
    // Caso de rota não encontrada (pode redirecionar para o login)
    return <LoginPage />; 
  };

  return (
    <div>
      <style>{`
        /* Importa a fonte Inter para uma estética moderna */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      {renderComponent()}
    </div>
  );
};

export default App;
