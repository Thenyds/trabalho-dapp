window.addEventListener("load", function() {

    
    // restaga formulário de produtos
    let formCliente = this.document.getElementById("form-cliente");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    formCliente.addEventListener('submit', adicionarCliente);
})

function adicionarCliente() {

    // previne a página de ser recarregada
    event.preventDefault();

    // resgata os dados do formulário
    let cpf = $("#txtCpf").val();
    let rg = $("#txtRg").val();
    let nome = $("#txtNome").val();
    let telefone = $("#txtTelefone").val();
    let idade = $("#txtIdade").val();
    let endereco = $("#txtEndereco").val();
    let renda = $("#txtRenda").val();
    let escolaridade = $("#txtEscolaridade").val();

    // envia a requisição para o servidor
    $.post("/adicionarCliente", {
        cpf: cpf,
        rg: rg,
        nome: nome,
        telefone: telefone,
        idade: idade,
        endereco: endereco,
        renda: renda,
        escolaridade: escolaridade
    }, function(res) {
        
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> clientes.js -> adicionarCliente: ***", res.msg);            
            // limpa dados do formulário
            // $("#txtCpf").val("");
            // $("#txtRg").val("");
            // $("#txtNome").val("");
            // $("#txtTelefone").val("");
            // $("#txtIdade").val("");
            // $("#txtEndereco").val("");
            // $("#txtRenda").val("");
            // $("#txtEscolaridade").val("");
            
            // remove atributo disabled do botao
            // $('#load').attr('disabled', false);

            alert("Cliente cadastrado com sucesso");
            location.href = location.href;
        } else {
            alert("Erro ao cadastrar cliente. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
    
}