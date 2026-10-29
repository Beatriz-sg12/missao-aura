
const perfis = [
    {
        id: 1,
        nome: "Engenheiro de Sistemas",
        categoria: "Construção e Tecnologia",
        descricao: "Transforma problemas em soluções. Sua criatividade e habilidade técnica ajudam a equipe a superar desafios tecnológicos.",
        imagem: "perfil1.jpg",
        recomendacao: "Cuide dos sistemas da nave, desenvolva soluções tecnológicas e mantenha os equipamentos da expedição funcionando."
    },
    {
        id: 2,
        nome: "Explorador Espacial",
        categoria: "Exploração e Descoberta",
        descricao: "Corajoso e aventureiro, você gosta de conhecer lugares novos, experimentar alternativas e lidar com situações inesperadas.",
        imagem: "perfil2.jpg",
        recomendacao: "Explore o terreno desconhecido, identifique caminhos seguros e descubra novas regiões para a equipe."
    },
    {
        id: 3,
        nome: "Cientista Planetário",
        categoria: "Ciência e Pesquisa",
        descricao: "Curioso e observador, você busca respostas por meio da investigação, da análise e da descoberta de novos conhecimentos.",
        imagem: "perfil3.jpg",
        recomendacao: "Analise amostras, estude as condições do planeta e investigue fenômenos que possam ajudar a missão."
    },
    {
        id: 4,
        nome: "Estrategista da Missão",
        categoria: "Planejamento e Liderança",
        descricao: "Você gosta de organizar informações, coordenar pessoas e tomar decisões para alcançar objetivos em equipe.",
        imagem: "perfil4.jpg",
        recomendacao: "Organize as tarefas da tripulação, estabeleça prioridades e coordene os próximos passos da expedição."
    }
];

const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoNascimento = document.getElementById("nascimento");

const painelFormulario = document.getElementById("painelFormulario");
const resultado = document.getElementById("resultado");
const mensagemErro = document.getElementById("mensagemErro");

const imagemPerfil = document.getElementById("imagemPerfil");
const saudacao = document.getElementById("saudacao");
const categoria = document.getElementById("categoria");
const nomePerfil = document.getElementById("nomePerfil");
const descricaoPerfil = document.getElementById("descricaoPerfil");
const recomendacaoPerfil = document.getElementById("recomendacaoPerfil");
const mensagemEmpate = document.getElementById("mensagemEmpate");
const botaoRefazer = document.getElementById("refazer");

// Impede a seleção de datas futuras.
const hoje = new Date();
const dataLocal = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0")
].join("-");

campoNascimento.max = dataLocal;

// Calcula a idade considerando se o aniversário já ocorreu.
function calcularIdade(dataNascimento) {
    const nascimento = new Date(dataNascimento + "T00:00:00");
    const agora = new Date();

    let idade = agora.getFullYear() - nascimento.getFullYear();

    const aindaNaoFezAniversario =
        agora.getMonth() < nascimento.getMonth() ||
        (
            agora.getMonth() === nascimento.getMonth() &&
            agora.getDate() < nascimento.getDate()
        );

    if (aindaNaoFezAniversario) {
        idade--;
    }

    return idade;
}

// Soma um ponto para o perfil escolhido em cada pergunta.
function calcularPontuacao() {
    const pontuacao = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };

    for (let i = 1; i <= 4; i++) {
        const resposta = document.querySelector(
            `input[name="p${i}"]:checked`
        );

        if (!resposta) {
            return null;
        }

        pontuacao[resposta.value]++;
    }

    return pontuacao;
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    mensagemErro.textContent = "";

    const nome = campoNome.value.trim();
    const nascimento = campoNascimento.value;

    if (!nome || !nascimento) {
        mensagemErro.textContent =
            "Preencha seu nome e sua data de nascimento.";
        return;
    }

    if (nascimento > dataLocal) {
        mensagemErro.textContent =
            "A data de nascimento não pode ser futura.";
        return;
    }

    const dataValidada = new Date(nascimento + "T00:00:00");

    if (
        Number.isNaN(dataValidada.getTime()) ||
        dataValidada.toISOString().slice(0, 10) !== nascimento
    ) {
        mensagemErro.textContent =
            "Informe uma data de nascimento válida.";
        return;
    }

    const idade = calcularIdade(nascimento);

    if (idade < 0) {
        mensagemErro.textContent =
            "A data de nascimento informada é inválida.";
        return;
    }

    const pontuacao = calcularPontuacao();

    if (!pontuacao) {
        mensagemErro.textContent =
            "Responda às quatro perguntas para descobrir seu perfil.";
        return;
    }

    const maiorPontuacao = Math.max(...Object.values(pontuacao));

    const vencedores = perfis.filter(
        perfil => pontuacao[perfil.id] === maiorPontuacao
    );

    // Em caso de empate, sorteia entre os perfis empatados.
    const empate = vencedores.length > 1;

    const perfil = vencedores[
        Math.floor(Math.random() * vencedores.length)
    ];

    // Preenche a tela de resultado.
    saudacao.textContent =
        `Olá, ${nome}! Sua idade é ${idade} ${idade === 1 ? "ano" : "anos"}.`;

    imagemPerfil.src = perfil.imagem;
    imagemPerfil.alt = perfil.nome;

    imagemPerfil.onerror = function() {
        this.onerror = null;
        this.alt = "Não foi possível carregar a imagem: " + perfil.imagem;
    };

    categoria.textContent = perfil.categoria;
    nomePerfil.textContent = perfil.nome;
    descricaoPerfil.textContent = perfil.descricao;
    recomendacaoPerfil.textContent = perfil.recomendacao;

    if (empate) {
        mensagemEmpate.textContent =
            "Você combina com vários perfis! Houve um empate entre " +
            vencedores.map(item => item.nome).join(", ") +
            ". Um deles foi escolhido para representar seu resultado.";
        mensagemEmpate.hidden = false;
    } else {
        mensagemEmpate.textContent = "";
        mensagemEmpate.hidden = true;
    }

    painelFormulario.hidden = true;
    resultado.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Permite realizar o teste novamente.
botaoRefazer.addEventListener("click", function() {
    formulario.reset();

    mensagemErro.textContent = "";
    mensagemEmpate.textContent = "";
    mensagemEmpate.hidden = true;

    imagemPerfil.removeAttribute("src");
    painelFormulario.hidden = false;
    resultado.hidden = true;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
