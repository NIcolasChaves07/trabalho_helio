const $ = (element) => document.querySelector(element);
const $$ = (elements) => document.querySelectorAll(elements);

//Variaáveis globais
 const limite_exemplar_aluno = 2;
const  limite_exemplar_professor = 5;

// Banco global
const db = {
    usuarios: [],
    exemplares: [],
    reservas: []
};

// Inicializa banco
function bancoFicticio(){

   db.usuarios = [
        {
            id: 1,
            nome: "João Silva",
            matricula: "2023001",
            tipo: "aluno",
            emprestimos: 1,
            pendencias: false
        },
        {
            id: 2,
            nome: "Maria Souza",
            matricula: "2023002",
            tipo: "aluno",
            emprestimos: 2,
            pendencias: false
        },
        {
            id: 3,
            nome: "Carlos Mendes",
            matricula: "PROF001",
            tipo: "professor",
            emprestimos: 3,
            pendencias: true
        }
    ];

    db.exemplares = [
        {
            id: "IFPR-001",
            titulo: "Clean Code",
            reservado: false
        },
        {
            id: "IFPR-002",
            titulo: "Algoritmos",
            reservado: true
        }
    ];
}

// chama o banco
bancoFicticio();


// BUSCAS
function buscarMatricula(matricula){
    return db.usuarios.find(u => u.matricula === matricula);
}

function buscarExemplares(id){
    return db.exemplares.find(e => e.id === id);
}


// VALIDAÇÃO
function validarReserva(usuario, exemplar){

    if(!usuario) {
        return { ok: false, msg: "Usuário não encontrado" };
    }
    else if(!exemplar){
        return { ok: false, msg: "Exemplar não encontrado" };
    }
    else if(exemplar.reservado){
        return { ok: false, msg: "Exemplar já reservado" };
    }

    const limite = usuario.tipo === "professor" ? limite_exemplar_professor : limite_exemplar_aluno;

    if (usuario.emprestimos >= limite) {
        return { ok: false, msg: "Limite de empréstimos excedido." };
    }
    else if (usuario.pendencias) {
        return { ok: false, msg: "Usuário possui pendências." };
    }

    return { ok: true, msg: "Reserva válida" };
}


// CRIAR RESERVA
function criarReserva(usuario, exemplar){
    db.reservas.push({
        usuarioId: usuario.id,
        exemplarId: exemplar.id,
        dataReserva: new Date()
    });

    exemplar.reservado = true;
}


// PROCESSO
function processarReserva(matricula, exemplarId){

    const usuario = buscarMatricula(matricula);
    const exemplar = buscarExemplares(exemplarId);

    const validacao = validarReserva(usuario, exemplar);

    const campo = $("#mensagemReserva");

    if(!validacao.ok){
        campo.innerText = validacao.msg;
        return;
    }

    try {
        criarReserva(usuario, exemplar);
        campo.innerText = "Reserva realizada com sucesso!";
        campo.style.color = "green";
    } catch (e) {
        campo.innerText = "Erro interno ao realizar reserva.";
        campo.style.color = "red";
    }
}


// BOTÃO
document.querySelector('#reserva .btn-primary').addEventListener('click', () => {

    const matricula = $('input[placeholder="Ex: 202300123"]').value;
    const exemplarId = $('input[placeholder="Código de Tombo"]').value;

    processarReserva(matricula, exemplarId);
});

 
 function switchModulo(moduloId) {
        // Esconde todos os módulos
        document.querySelectorAll('.modulo').forEach(m => m.classList.remove('active'));
        // Desativa todos os itens do menu
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        
        // Ativa o selecionado
        const target = document.getElementById(moduloId);
        if(target) target.classList.add('active');
        
        // Ativa o botão no menu lateral
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            // Busca o item que tem o ID do modulo no atributo onclick
            if(item.getAttribute('onclick').includes("'" + moduloId + "'")) {
                item.classList.add('active');
            }
        });
        
        // Atualiza o título do header
        const titles = {
            'home': 'Painel Geral',
            'emprestimo': 'Módulo de Empréstimo',
            'cad-perfil': 'Cadastrar Perfis',
            'cad-livro': 'Cadastrar Livros',
            'reserva': 'Módulo de Reservas',
            'devolucao': 'Módulo de Devoluções',
            'historico': 'Módulo de Histórico'
        };
        document.getElementById('modulo-title').innerText = titles[moduloId] || 'Sistema de Biblioteca';
}

document.querySelectorAll('.day').forEach(dia => {
    dia.addEventListener('click', () => {
        console.log(dia.dataset.date);
    });
});

function toggleDarkMode() {
    const link = $("#theme");

    if (link.getAttribute("href") === "./css/style.css") {
        link.setAttribute("href", "./css/dark_mode.css");
    } else {
        link.setAttribute("href", "./css/style.css");
    }
}
