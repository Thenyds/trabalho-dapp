pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract CrmContract {
	
	// evento para notificar que os dados do cliente foram atualizados
    event clienteAtualizado(string _cpfCliente, string _msg);

	struct Cliente {
		string 	cpf;
		string	rg;
		string 	nome;
		string 	telefone;
		uint 	idade;
		string 	endereco;
		uint32 	renda;
		string	escolaridade;
	}
	
	struct Conta {
		uint 	numero;
		string	agencia;
		string 	cpfTitular;
		bool 	bloqueio;
		int32 	saldo;
	}

	mapping (string => Cliente) clientes;
	string[] public clienteCpfs;

	mapping (uint => Conta) contas;
	uint[] public contaNumeros;

	function existeCpf(string memory _cpf) private returns (bool) {
		string memory cpfRetornado = clientes[_cpf].cpf;
		if (bytes(cpfRetornado).length >= 1) {
			return true;
		} else {
			return false;
		}
	}

	// função para cadastrar um cliente
    function adicionarCliente(string memory cpf, string memory rg, string memory nome, string memory telefone, uint idade, string memory endereco, uint32 renda, string memory escolaridade) public {
        
        require(bytes(cpf).length >= 1, "O campo CPF é obrigatório");
        require(bytes(rg).length >= 1, "O campo RG é obrigatório");
        require(bytes(nome).length >= 1, "O campo nome é obrigatório");
        require(!existeCpf(cpf), "O CPF informado já está cadastrado.");

        clientes[cpf] = Cliente(cpf, rg, nome, telefone, idade, endereco, renda, escolaridade);
        clienteCpfs.push(cpf);
    }

    // função para cadastrar uma conta
    function adicionarConta(string memory agencia, string memory cpfTitular, bool bloqueio, int32 saldo) public {
        
        require(bytes(cpfTitular).length >= 1, "O campo CPF é obrigatório");
        require(bytes(agencia).length >= 1, "O campo agencia é obrigatório");
        require(existeCpf(cpfTitular) == false, "O CPF informado não é um cliente válido.");

        uint numeroConta = contaNumeros.length + 1;
        contas[numeroConta] = Conta(numeroConta, agencia, cpfTitular, bloqueio, saldo);
        contaNumeros.push(numeroConta);
    }

    // função que retorna todos os clientes cadastrados
    function listarClientes() public view returns(string[] memory, string[] memory, string[] memory, string[] memory, uint[] memory, string[] memory, uint32[] memory, string[] memory) {

    	string[] memory cpfs = clienteCpfs;

        string[] memory rgs = new string[](cpfs.length);
        string[] memory nomes = new string[](cpfs.length);
        string[] memory telefones = new string[](cpfs.length);
        uint[] memory idades = new uint[](cpfs.length);
        string[] memory enderecos = new string[](cpfs.length);
        uint32[] memory rendas = new uint32[](cpfs.length);
        string[] memory escolaridades = new string[](cpfs.length);

        for (uint i = 0; i < cpfs.length; i++) {
            (rgs[i], nomes[i], telefones[i], idades[i], enderecos[i], rendas[i], escolaridades[i]) = informacoesCliente(cpfs[i]);
        }

        return (cpfs, rgs, nomes, telefones, idades, enderecos, rendas, escolaridades);
    }

    // função para resgatar info de um produto
    function informacoesCliente(string memory _cpf) public view
        returns(
            string memory,
            string memory,
            string memory,
            uint,
            string memory,
            uint32,
            string memory
        ) {

            Cliente memory cliente = clientes[_cpf];
            require(bytes(cliente.cpf).length >= 1, "CPF não cadastrado.");
            
            return (
                cliente.rg,
                cliente.nome,
                cliente.telefone,
                cliente.idade,
                cliente.endereco,
                cliente.renda,
                cliente.escolaridade
            );
    }

	// função para atualizar os dados de um cliente
    function atualizarDadosCliente(string memory _cpfCliente, string memory _newRg, string memory _newNome, string memory _newTelefone, uint _newIdade, string memory _newEndereco, uint32 _newRenda, string memory _newEscolaridade) public {
        require(bytes(_newRg).length >= 1, "RG é obrigatório");
        require(bytes(_newNome).length >= 1, "Nome é obrigatório");

        Cliente storage cliente = clientes[_cpfCliente];

        cliente.cpf = _cpfCliente;
        cliente.rg = _newRg;
        cliente.nome = _newNome;
        cliente.telefone = _newTelefone;
        cliente.idade = _newIdade;
        cliente.endereco = _newEndereco;
        cliente.renda = _newRenda;
        cliente.escolaridade = _newEscolaridade;

        emit clienteAtualizado(_cpfCliente, "Dados do cliente atualizados com sucesso");
    }
}