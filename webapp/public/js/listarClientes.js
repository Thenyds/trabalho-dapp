window.addEventListener("load", function() {

    // função para carregar produtos
    listarClientes();
})

function listarClientes() {
    console.log("*** Listar Clientes ***");

    $.get("/buscarClientes", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> listarClientes.js -> listarClientes: ***", res.msg);

            if (res.clientes.length === 0) {
                alert("Não existe cliente cadastrado ainda.");
                return;
            }

            let clientes = res.clientes;

            // adiciona clientes na tabela
            for (let i = 0; i < clientes.length; i++) {
                let newRow = $("<tr>");
                let cols = "";
                let cpf = clientes[i].cpf;
                let rg = clientes[i].rg;
                let nome = clientes[i].nome;
                let telefone = clientes[i].telefone;
                let idade = clientes[i].idade;
                let endereco = clientes[i].endereco;
                let renda = clientes[i].renda;
                let escolaridade = clientes[i].escolaridade;

                cols += `<td> ${cpf} </td>`;
                cols += `<td> ${rg} </td>`;
                cols += `<td class="truncade-td"> ${nome} </td>`;
                cols += `<td class="truncade-td-tel"> ${telefone} </td>`;
                cols += `<td> ${idade} </td>`;
                cols += `<td class="truncade-td"> ${endereco} </td>`;
                cols += `<td> ${renda} </td>`;
                cols += `<td> ${escolaridade} </td>`;
                cols += `<td align="center"> 
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href="/gerenciarClientes?cpf=${clientes[i].cpf}&origem=lista"><i class="fas fa-edit"></i></a>
                    </span>
                </td>`
                
                newRow.append(cols);
                $("#clientes-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar clientes do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}