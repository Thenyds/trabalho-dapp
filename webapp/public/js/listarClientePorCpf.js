let cfpCliente;

window.addEventListener('load', () => {
    console.log("*** página de listar dados do cliente carregada ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    cpfCliente = parseInt(url.searchParams.get("cpf"), 10);

    // let btnPesquisa = document.getElementById("btnNovaPesquisa");
    // let btnEdita = document.getElementById("btnEdita");
    
    // btnPesquisa.addEventListener('onclick', voltarPesquisarCliente);
    // btnEdita.addEventListener('onclick', irGerenciarCliente);

    listarClientesPorCpf(cpfCliente);
});

function listarClientesPorCpf(cpf) {

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

function voltarPesquisarCliente() {
    
    // previne a página de ser recarregada
    event.preventDefault();

    // $("#cpf").val("");
    // $("#rg").val("");
    // $("#nome").val("");
    // $('#telefone').val("");
    // $('#idade').val("");
    // $('#endereco').val("");
    // $('#renda').val("");
    // $('#escolaridade').val("");

    window.location.href = "/pesquisaClientesPorCpf";
}

function irGerenciarCliente() {
    
    // previne a página de ser recarregada
    event.preventDefault();

    window.location.href = "/gerenciarClientes?cpf="+cpfCliente;
}