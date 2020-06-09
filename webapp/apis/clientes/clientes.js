const path = require('path');
const Web3 = require("web3");

const crmContractBuild =  require(path.resolve("../dapp/build/contracts/CrmContract.json"));
const crmContractAbi = crmContractBuild.abi;
const crmContractAddress = crmContractBuild.networks['8995'].address;
const httpEndpoint = 'http://localhost:8540';

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

let web3 = new Web3(httpEndpoint, null, OPTIONS);

let CrmContract = new web3.eth.Contract(crmContractAbi, crmContractAddress);

module.exports = {
    renderAdicionarCliente: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            console.log("*** ClienteApi -> renderAdicionarCliente ***");
            res.render('formularioCliente.html');
        }
    },

    adicionarCliente: async function(req, res) {

        if (!req.session.username) {
            console.log("*** Não logado! -> ClienteApi -> adicionarCliente ***");
            res.redirect('/api/auth');
            res.end();
        } else {
            console.log("*** ClienteApi -> adicionarCliente ***");
            console.log(req.body);

            let cpf = req.body.cpf;
            let rg = req.body.rg;
            let nome   = req.body.nome;
            let telefone   = req.body.telefone;
            let idade   = req.body.idade;
            let endereco = req.body.endereco;
            let renda = req.body.renda;
            let escolaridade = req.body.escolaridade;

            let userAddr = req.session.address;
            let pass     = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await CrmContract.methods.adicionarCliente(cpf, rg, nome, telefone, idade, endereco, renda, escolaridade)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Cliente cadastrado com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                        })
                } 
            } catch (err) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    renderListarClientes: function(req, res) {
        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('listaClientes.html');
        }
    },
    renderGerenciarDadosCliente: function(req, res) {
        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('gerenciarClientes.html');
        }
    },
    buscarClientes: async function(req, res) {
        console.log(crmContractAddress)
        let userAddr = req.session.address;
        console.log("*** Buscar Clientes ***", userAddr);

        await CrmContract.methods.listarClientes()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (listaClientes) {

                console.log("listaClientes", listaClientes);
                if (listaClientes === null) {
                    return res.send({ error: false, msg: "Não existe cliente cadastrado ainda."});
                }

                let clientes = [];
                for (i = 0; i < listaClientes['0'].length; i++) {
                    clientes.push(
                        {
                            'cpf': listaClientes['0'][i],
                            'rg': listaClientes['1'][i],
                            'nome': listaClientes['2'][i],
                            'telefone': listaClientes['3'][i],
                            'idade': +listaClientes['4'][i],
                            'endereco': listaClientes['5'][i],
                            'renda': +listaClientes['6'][i],
                            'escolaridade': listaClientes['7'][i]
                        }
                    );
                }

                console.log("clientes", clientes);

                res.send({ error: false, msg: "Clientes retornados com sucesso", clientes});
                return true;
            })
            .catch(error => {
                console.log("*** clientesApi -> listarClientes ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    },

    buscarClientePorCpf: async function(req, res){

        console.log(crmContractAddress)
        let userAddr = req.session.address;
        console.log("*** Buscar cliente por CPF ***", userAddr);
        console.log(req);

        await CrmContract.methods.informacoesCliente(req.query.cpf)
            .call({ from: userAddr, gas: 3000000 })
            .then(function (cliente) {

                console.log("cliente", cliente);
                if (cliente === null) {
                    return res.send({ error: false, msg: "cliente não localizado"});
                }

                let clienteRetorno = 
                    {
                        'cpf': req.query.cpf,
                        'rg': cliente['0'],
                        'nome': cliente['1'],
                        'telefone': cliente['2'],
                        'idade': +cliente['3'],
                        'endereco': cliente['4'],
                        'renda': +cliente['5'],
                        'escolaridade': cliente['6']
                    }

                console.log("clienteRetorno", clienteRetorno);

                res.send({ error: false, msg: "Dados do cliente resgatados com sucesso", clienteRetorno});
                return true;
            })
            .catch(error => {
                console.log("*** clientesApi -> buscarClientePorCpf ***error:", error);
                res.send({ error: true, msg: error});
            })
    },
    
    atualizarDadosCliente: async (req, res) => {
        
        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
        
            let cpfCliente = req.body.cpfCliente;
            let newRg   = req.body.newRg;
            let newNome  = req.body.newNome;
            let newTelefone  = req.body.newTelefone;
            let newIdade  = req.body.newIdade;
            let newEndereco  = req.body.newEndereco;
            let newRenda  = req.body.newRenda;
            let newEscolaridade  = req.body.newEscolaridade;

            let userAddr  = req.session.address;
            let pass      = req.session.password;

            console.log("apis -> clientes.js -> atualizarDadosCliente: ", userAddr, cpfCliente, newRg, newNome, newTelefone, newIdade, newEndereco, newRenda, newEscolaridade);

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                console.log("Account unlocked?", accountUnlocked);
                if (accountUnlocked) {

                    await CrmContract.methods.atualizarDadosCliente(cpfCliente, newRg, newNome, newTelefone, newIdade, newEndereco, newRenda, newEscolaridade)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(receipt => {
                            console.log(receipt);
                            return res.send({ 'error': false, 'msg': 'Cliente atualizado com sucesso.'}); 
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': "erro ao se comunicar com o contrato"});
                        })
                }
            } catch (error) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    }
}