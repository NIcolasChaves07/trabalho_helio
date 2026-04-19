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