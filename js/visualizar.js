// Função para obter informações do usuário
async function obterDadosUsuario() {
    const authToken = localStorage.getItem('token');
    const queryString = new URLSearchParams(window.location.search);
    const usuarioId = queryString.get('id');

    if (!usuarioId) {
        exibirErro('ID do usuário não foi especificado.');
        return;
    }

    if (!authToken) {
        exibirErro('É necessário estar autenticado para visualizar as informações do usuário.');
        exibirBotaoDeLogin();
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:8000/api/user/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (resposta.ok) {
            const dadosUsuario = await resposta.json();
            exibirInformacoesUsuario(dadosUsuario);
        } else {
            throw new Error('Falha ao carregar as informações do usuário.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        exibirErro('Não foi possível carregar as informações do usuário.');
    }
}

// Função para exibir as informações do usuário na página
function exibirInformacoesUsuario(usuario) {
    document.getElementById('nomeUsuario').textContent = usuario.name;
    document.getElementById('emailUsuario').textContent = usuario.email;
    const dataCadastro = new Date(usuario.created_at);
    const formatoData = dataCadastro.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    document.getElementById('dataCriacaoUsuario').textContent = `Cadastrado em: ${formatoData}`;
    document.getElementById('detalhesUsuario').classList.remove('d-none');
}

// Função para exibir mensagem de erro
function exibirErro(mensagem) {
    const elementoErro = document.getElementById('mensagemErro');
    elementoErro.textContent = mensagem;
    elementoErro.classList.remove('d-none');
}

// Função para exibir o botão de login
function exibirBotaoDeLogin() {
    const botaoLogin = document.getElementById('botaoLogin');
    botaoLogin.classList.remove('d-none');
    botaoLogin.addEventListener('click', () => {
        window.location.href = 'login.html'; // Redireciona para a página de login
    });
}

// Função para retornar à página anterior
document.getElementById('botaoVoltar').addEventListener('click', function() {
    window.history.back();
});

// Carrega as informações do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', obterDadosUsuario);
