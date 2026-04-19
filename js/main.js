const $ = (element) => document.querySelector(element);
const $$ = (elements) => document.querySelectorAll(elements);

//Variaáveis globais
 const limite_exemplar_aluno = 2;
const  limite_exemplar_professor = 5;

// Banco global
const db = {
    usuarios: [],
    exemplares: [],
    reservas: [],
    historico: [],
    emprestimos: []
};


// Inicializa banco
function bancoFicticio(){

   db.usuarios = [
        {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@ifpr.edu.br",
            matricula: "2023001",
            tipo: "aluno",
            emprestimos: 1,
            pendencias: false
        },
        {
            id: 2,
            nome: "Maria Souza",
            email: "maria.souza@ifpr.edu.br",
            matricula: "2023002",
            tipo: "aluno",
            emprestimos: 2,
            pendencias: false
        },
        {
            id: 3,
            nome: "Carlos Mendes",
            email: "carlos.mendes@ifpr.edu.br",
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
            status: "disponivel"
        },
        {
            id: "IFPR-002",
            titulo: "Algoritmos",
            status: "reservado"
        }
    ];

    db.historico = [
        {
            usuario: "João Silva",
            titulo: "Clean Code",
            data: "2026-04-18",
            status: "Devolvido"
        },
        {
            usuario: "Maria Souza",
            titulo: "Algoritmos",
            data: "2026-04-17",
            status: "Em Aberto"
        },
        {
            usuario: "João Silva",
            titulo: "Engenharia de Software",
            data: "2026-04-18",
            status: "Devolvido"
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

    if(exemplar.status !== "disponivel"){
        return { ok: false, msg: "Exemplar indisponível" };
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

    exemplar.status = "reservado";

    db.historico.push({
        usuario: usuario.nome,
        titulo: exemplar.titulo,
        data: new Date().toISOString().split("T")[0],
        status: "Reservado"
    });
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


function toggleDarkMode() {
    const link = $("#theme");

    if (link.getAttribute("href") === "./css/style.css") {
        link.setAttribute("href", "./css/dark_mode.css");
    } else {
        link.setAttribute("href", "./css/style.css");
    }
}

function renderizarHistorico(lista) {
    const tbody = document.querySelector('#historico tbody');

    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Nenhum registro nesse dia</td></tr>`;
        return;
    }

    lista.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.data}</td>
                <td>${item.titulo}</td>
                <td>${item.data}</td>
                <td>
                    <span class="badge ${item.status === 'Devolvido' ? 'badge-success' : 'badge-warn'}">
                        ${item.status}
                    </span>
                </td>
            </tr>
        `;
    });
}

document.querySelectorAll('.day').forEach(dia => {
    dia.addEventListener('click', () => {

        const data = dia.dataset.date;

        if (!data) return; // ignora espaços vazios

        // filtra histórico
        const filtrado = db.historico.filter(h => h.data === data);

        // muda pra tela de histórico
        switchModulo('historico');

        // renderiza tabela
        renderizarHistorico(filtrado);

        // mostra a data selecionada (opcional)
        const titulo = document.querySelector('#historico h2');
        if (titulo) {
            titulo.innerText = `📜 Histórico - ${data}`;
        }

    });
});

renderizarHistorico(db.historico);

function validarEmprestimo(usuario, exemplar){

    if(!usuario) {
        return { ok: false, msg: "Usuário não encontrado" };
    }

    if(!exemplar){
        return { ok: false, msg: "Exemplar não encontrado" };
    }

    if(exemplar.status === "emprestado"){
        return { ok: false, msg: "Exemplar já está emprestado" };
    }

    if(exemplar.status === "reservado"){
        return { ok: false, msg: "Exemplar está reservado" };
    }

    const limite = usuario.tipo === "professor" ? limite_exemplar_professor : limite_exemplar_aluno;

    if (usuario.emprestimos >= limite) {
        return { ok: false, msg: "Limite de empréstimos excedido." };
    }

    if (usuario.pendencias) {
        return { ok: false, msg: "Usuário possui pendências." };
    }

    return { ok: true };
}

function criarEmprestimo(usuario, exemplar){

    const hoje = new Date();

    const prazo = usuario.tipo === "professor" ? 15 : 7;

    const dataDevolucao = new Date();
    dataDevolucao.setDate(hoje.getDate() + prazo);

    db.emprestimos.push({
        usuarioId: usuario.id,
        exemplarId: exemplar.id,
        dataEmprestimo: hoje,
        dataDevolucao: dataDevolucao
    });

    // Status atual
    exemplar.status = "emprestado";

    usuario.emprestimos++;

    // histórico
    db.historico.push({
        usuario: usuario.nome,
        titulo: exemplar.titulo,
        data: hoje.toISOString().split("T")[0],
        status: "Emprestado"
    });
}

function processarEmprestimo(matricula, exemplarId){

    const usuario = buscarMatricula(matricula);
    const exemplar = buscarExemplares(exemplarId);

    const campo = $("#mensagememprestimo");

    const validacao = validarEmprestimo(usuario, exemplar);

    if(!validacao.ok){
        campo.innerHTML = validacao.msg;
        campo.style.color = "red";
        return;
    }

    try {
        criarEmprestimo(usuario, exemplar);
        campo.innerText = "Empréstimo realizado com sucesso!";
        campo.style.color = "green";
    } catch (e) {
        campo.innerText = "Erro interno ao realizar empréstimo.";
        campo.style.color = "red";
    }
}

document.querySelector('#emprestimo .btn-primary').addEventListener('click', () => {

    const matricula = $('#emprestimo input[type="email"]').value;
    const exemplarId = $('#emprestimo input[type="text"]').value;

    processarEmprestimo(matricula, exemplarId);
});