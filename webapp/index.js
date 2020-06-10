const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const cliente = require("./apis/clientes/clientes.js");

// set default views folder
app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// registra a sessão do usuário
app.use(session({
    secret: 'mysecret',
    saveUninitialized: false,
    resave: false
}));

const authRoutes = require('./apis/routes/auth.js');

app.get('/', (req, res) => {
    res.redirect('/api/auth');
});

// * Auth pages * //
app.use("/api/auth", authRoutes);

app.get("/adicionarCliente", cliente.renderAdicionarCliente);
app.post("/adicionarCliente", cliente.adicionarCliente)
app.get("/listarClientes", cliente.renderListarClientes);
app.get("/buscarClientes", cliente.buscarClientes);
app.get("/pesquisaClientesPorCpf", cliente.renderPesquisaClientesPorCpf);
app.get("/listarClientesPorCpf", cliente.renderListarClientesPorCpf);
app.get("/gerenciarClientes", cliente.renderGerenciarDadosCliente);
app.get("/buscarClientesPorCpf", cliente.buscarClientePorCpf);
app.post("/atualizarDadosCliente", cliente.atualizarDadosCliente);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})