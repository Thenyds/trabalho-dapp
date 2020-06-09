let cfpCliente;

window.addEventListener('load', () => {
    console.log("*** página de gerenciamento de dados do cliente carregada ");

    let form = "";
    // let divHeaderPesquisar = document.getElementById("pesquisar");
    // let divHeaderGerenciar = document.getElementById("gerenciar");
    // let divPesquisar = document.getElementById("pesquisarCliente");
    // let divGerenciar = document.getElementById("gerenciarCliente");
    let url_string = window.location.href;
    let url = new URL(url_string);
    cpfCliente = parseInt(url.searchParams.get("cpf"), 10);
    
    if (cpfCliente === null || cpfCliente === undefined || isNaN(cpfCliente)) {
        document.getElementById("gerenciar").hidden = "true";
        document.getElementById("gerenciarCliente").hidden = "true";

        // restaga formulário de pesquisa de clientes
        form = document.getElementById("pesquisarCliente");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', pesquisarCliente);
    } else {
        console.log("CPF Cliente: ", cpfCliente);

        document.getElementById("pesquisar").hidden = "true";
        document.getElementById("pesquisarCliente").hidden = "true";

        // restaga formulário de gerenciar clientes
        form = document.getElementById("gerenciarCliente");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', atualizarDados);

        gerenciarClientes(cpfCliente);
    }
    
});

function pesquisarCliente() {
    document.getElementById("gerenciar").hidden = "false";
    document.getElementById("gerenciarCliente").hidden = "false";
    document.getElementById("pesquisar").hidden = "true";
    document.getElementById("pesquisarCliente").hidden = "true";

    let cpfInformado = $("#cpfCliente").val();
    gerenciarClientes(cpfInformado);
}

function gerenciarClientes(cpf) {
    console.log("*** Gerenciar Clientes ***");

    // if (cpf === null || cpf === undefined || cpf === "") {
    //     cpf = $("#cpfCliente").val();
    // }

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
            window.location.href = "/gerenciarClientes";
        } else {
            alert("Erro ao atualizar dados do cliente. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}