pragma solidity >=0.4.21 <0.6.0;

contract CrmContract {
	
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
		return true;
	}

	// função para cadastrar um cliente
    function adicionarCliente(string memory cpf, string memory rg, string memory nome, string memory telefone, uint idade, string memory endereco, uint32 renda, string memory escolaridade) public {
        
        require(bytes(cpf).length >= 1, "O campo CPF é obrigatório");
        require(bytes(rg).length >= 1, "O campo RG é obrigatório");
        require(bytes(nome).length >= 1, "O campo nome é obrigatório");
        require(existeCpf(cpf), "O CPF informado já está cadastrado.");

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
}