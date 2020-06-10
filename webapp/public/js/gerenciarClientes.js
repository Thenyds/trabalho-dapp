let cfpCliente, pagOrigem;

window.addEventListener('load', () => {
    console.log("*** página de gerenciamento de dados do cliente carregada ");

    // restaga formulário de gerenciar clientes
    form = document.getElementById("gerenciarCliente");

    let url_string = window.location.href;
    let url = new URL(url_string);
    cpfCliente = parseInt(url.searchParams.get("cpf"), 10);
    pagOrigem = url.searchParams.get("origem");
    
    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', atualizarDados);

    gerenciarClientes(cpfCliente);
});

function gerenciarClientes(cpf) {

    // previne a página de ser recarregada
    event.preventDefault();

    console.log("*** Gerenciar Clientes ***");

    $.get("/buscarClientesPorCpf", {cpf: cpf}, function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> clientes.js -> buscarClientesPorCpf: ***", res.msg);

            if (res.msg === "cliente não localizado") {
                return;
            }

            let cliente = res.clienteRetorno;

            $('#cpf').val(cliente.cpf);
            $('#rg').val(cliente.rg);
            $('#nome').val(cliente.nome);
            $('#telefone').val(cliente.telefone);
            $('#idade').val(cliente.idade);
            $('#endereco').val(cliente.endereco);
            $('#renda').val(cliente.renda);
            $('#escolaridade').val(cliente.escolaridade);
            
        } else {
            alert("Erro ao resgatar clientes do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function atualizarDados() {
    event.preventDefault();
    console.log("*** Atualizar dados do cliente: ", cpfCliente);

    $('#btnAtualizar').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let newRg = $("#rg").val();
    let newNome = $("#nome").val();
    let newTelefone = $('#telefone').val();
    let newIdade = $('#idade').val();
    let newEndereco = $('#endereco').val();
    let newRenda = $('#renda').val();
    let newEscolaridade = $('#escolaridade').val();


    // envia a requisição para o servidor
    $.post("/atualizarDadosCliente", {cpfCliente, newRg, newNome, newTelefone, newIdade, newEndereco, newRenda, newEscolaridade}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> clientes.js -> atualizarDadosCliente: ***", res.msg);            
            // limpa dados do formulário
            $("#cpf").val("");
            $("#rg").val("");
            $("#nome").val("");
            $('#telefone').val("");
            $('#idade').val("");
            $('#endereco').val("");
            $('#renda').val("");
            $('#escolaridade').val("");
            
            // remove atributo disabled do botao
            $('#btnAtualizar').attr('disabled', false);

            alert("Os dados do cliente foram atualizados com sucesso");

            if (pagOrigem === "lista") {
                window.location.href = "/listarClientes";
            } else {
                window.location.href = "/pesquisaClientesPorCpf";
            }
        } else {
            alert("Erro ao atualizar dados do cliente. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}