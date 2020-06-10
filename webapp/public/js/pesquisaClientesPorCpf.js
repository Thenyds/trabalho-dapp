window.addEventListener('load', () => {
    console.log("*** página de pesquisar cliente carregada ");

    let form = document.getElementById("pesquisarCliente");
    
    form.addEventListener('submit', pesquisarCliente);
    
});

function pesquisarCliente() {
    
    // previne a página de ser recarregada
    event.preventDefault();

    let cpfInformado = $("#cpfCliente").val();

    window.location.href = "/listarClientesPorCpf?cpf="+cpfInformado;
}