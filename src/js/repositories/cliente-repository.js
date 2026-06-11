/**
 * Servico de Clientes - GarageERP
 *
 * Este arquivo e responsavel pela persistencia e manipulacao dos dados de clientes,
 * seus veiculos e historico de servicos utilizando o LocalStorage do navegador.
 *
 * A estrutura de dados e normalizada para facilitar a extensao e integracao futura:
 * - 'clientes': Array de objetos cliente { id, nome, email, telefone }
 * - 'veiculos': Array de objetos veiculo { id, clienteId, modelo, placa, ano }
 * - 'ordens': Array de objetos ordem de servico { id, clienteId, veiculoId, servico, status, data, dataFmt, concluidoEm }
 *
 * Regra: Nao contem qualquer manipulacao de DOM, sendo focado exclusivamente em dados.
 */

// Dados iniciais para simulacao (Mock) com base no design das paginas HTML
const MOCK_CLIENTES = [
    {
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(11) 98765-4321",
    },
    {
        id: "2",
        nome: "Maria Santos",
        email: "maria@email.com",
        telefone: "(11) 97654-3210",
    },
    {
        id: "3",
        nome: "Pedro Oliveira",
        email: "pedro@email.com",
        telefone: "(11) 96543-2109",
    },
    {
        id: "4",
        nome: "Caio Rocha",
        email: "caio@email.com",
        telefone: "(83) 28193-1513",
    },
    {
        id: "5",
        nome: "Erick Barbosa",
        email: "erick@email.com",
        telefone: "(32) 92813-1513",
    },
];

const MOCK_VEICULOS = [
    {
        id: "v1",
        clienteId: "1",
        modelo: "Volkswagen Gol",
        placa: "ABC-1234",
        ano: "2020",
    },
    {
        id: "v2",
        clienteId: "1",
        modelo: "Honda Civic",
        placa: "JKL-3456",
        ano: "2022",
    },
    {
        id: "v3",
        clienteId: "2",
        modelo: "Fiat Uno",
        placa: "DEF-5678",
        ano: "2019",
    },
    {
        id: "v4",
        clienteId: "3",
        modelo: "Chevrolet Onix",
        placa: "GHI-9012",
        ano: "2021",
    },
];

const MOCK_ORDENS = [
    {
        id: "o1",
        clienteId: "1",
        veiculoId: "v1",
        servico: "Troca de pneus",
        status: "atrasado", // status: atrasado, concluido, andamento, pendente
        data: "10 de mar. de 2024, 07:00",
        dataFmt: "2024-03-10T07:00",
        concluidoEm: null,
    },
    {
        id: "o2",
        clienteId: "1",
        veiculoId: "v2",
        servico: "Troca de óleo e filtros",
        status: "concluido",
        data: "01 de mar. de 2024, 05:00",
        dataFmt: "2024-03-01T05:00",
        concluidoEm: "01 de mar. de 2024",
    },
];

/**
 * Inicializa o LocalStorage com os dados mockados caso as chaves correspondentes nao existam.
 */
function inicializarLocalStorage() {
    if (!localStorage.getItem("clientes")) {
        localStorage.setItem("clientes", JSON.stringify(MOCK_CLIENTES));
    }
    if (!localStorage.getItem("veiculos")) {
        localStorage.setItem("veiculos", JSON.stringify(MOCK_VEICULOS));
    }
    if (!localStorage.getItem("ordens")) {
        localStorage.setItem("ordens", JSON.stringify(MOCK_ORDENS));
    }
}

// Executa a inicializacao automaticamente ao carregar o script
inicializarLocalStorage();

// Servico exportado globalmente para uso nos controllers
const ClienteStorage = {
    /**
     * Retorna a lista de todos os clientes.
     * Permite busca opcional por nome, email ou telefone.
     * @param {string} [busca] - Termo de pesquisa para filtrar clientes.
     * @returns {Array} - Array de clientes filtrados.
     */
    listar(busca = "") {
        const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
        if (!busca) {
            return clientes;
        }
        const termo = busca.toLowerCase().trim();
        return clientes.filter(
            (c) =>
                (c.nome && c.nome.toLowerCase().includes(termo)) ||
                (c.email && c.email.toLowerCase().includes(termo)) ||
                (c.telefone && c.telefone.toLowerCase().includes(termo)),
        );
    },

    /**
     * Obtem um cliente pelo ID, realizando o join com seus veiculos e historico de ordens.
     * @param {string} id - ID do cliente.
     * @returns {Object|null} - Objeto do cliente populado ou null se nao encontrado.
     */
    obterPorId(id) {
        const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
        const cliente = clientes.find((c) => String(c.id) === String(id));
        if (!cliente) return null;

        // Join de Veiculos
        const veiculos = JSON.parse(localStorage.getItem("veiculos") || "[]");
        cliente.veiculos = veiculos.filter(
            (v) => String(v.clienteId) === String(id),
        );

        // Join de Ordens (Historico de Servicos)
        const ordens = JSON.parse(localStorage.getItem("ordens") || "[]");
        cliente.historico = ordens.filter(
            (o) => String(o.clienteId) === String(id),
        );

        return cliente;
    },

    /**
     * Cadastra um novo cliente no LocalStorage.
     * @param {Object} dadosCliente - Dados do cliente { nome, email, telefone }.
     * @returns {Object} - O cliente cadastrado com seu ID gerado.
     */
    criar(dadosCliente) {
        const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");

        const novoCliente = {
            id: Date.now().toString(),
            nome: dadosCliente.nome || "",
            email: dadosCliente.email || "",
            telefone: dadosCliente.telefone || "",
        };

        clientes.push(novoCliente);
        localStorage.setItem("clientes", JSON.stringify(clientes));
        return novoCliente;
    },

    /**
     * Atualiza os dados de um cliente ja cadastrado.
     * @param {string} id - ID do cliente.
     * @param {Object} dadosNovos - Campos a atualizar { nome, email, telefone }.
     * @returns {Object|null} - O cliente atualizado ou null se nao encontrado.
     */
    atualizar(id, dadosNovos) {
        const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
        const index = clientes.findIndex((c) => String(c.id) === String(id));
        if (index === -1) return null;

        clientes[index] = {
            ...clientes[index],
            nome:
                dadosNovos.nome !== undefined
                    ? dadosNovos.nome
                    : clientes[index].nome,
            email:
                dadosNovos.email !== undefined
                    ? dadosNovos.email
                    : clientes[index].email,
            telefone:
                dadosNovos.telefone !== undefined
                    ? dadosNovos.telefone
                    : clientes[index].telefone,
        };

        localStorage.setItem("clientes", JSON.stringify(clientes));
        return clientes[index];
    },

    /**
     * Exclui um cliente e realiza a remocao em cascata de seus veiculos e ordens.
     * @param {string} id - ID do cliente a ser removido.
     * @returns {boolean} - true se a delecao foi concluida.
     */
    excluir(id) {
        // Remove o cliente
        let clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
        clientes = clientes.filter((c) => String(c.id) !== String(id));
        localStorage.setItem("clientes", JSON.stringify(clientes));

        // Remocao em cascata dos veiculos do cliente
        let veiculos = JSON.parse(localStorage.getItem("veiculos") || "[]");
        veiculos = veiculos.filter((v) => String(v.clienteId) !== String(id));
        localStorage.setItem("veiculos", JSON.stringify(veiculos));

        // Remocao em cascata das ordens de servico do cliente
        let ordens = JSON.parse(localStorage.getItem("ordens") || "[]");
        ordens = ordens.filter((o) => String(o.clienteId) !== String(id));
        localStorage.setItem("ordens", JSON.stringify(ordens));

        return true;
    },

    /**
     * Adiciona um veiculo associado a um cliente.
     * @param {string} clienteId - ID do proprietario do veiculo.
     * @param {Object} dadosVeiculo - { modelo, placa, ano }.
     * @returns {Object} - O veiculo cadastrado com seu ID gerado.
     */
    adicionarVeiculo(clienteId, dadosVeiculo) {
        const veiculos = JSON.parse(localStorage.getItem("veiculos") || "[]");
        const novoVeiculo = {
            id: "v_" + Date.now().toString(),
            clienteId: String(clienteId),
            modelo: dadosVeiculo.modelo || "",
            placa: dadosVeiculo.placa || "",
            ano: dadosVeiculo.ano || "",
        };
        veiculos.push(novoVeiculo);
        localStorage.setItem("veiculos", JSON.stringify(veiculos));
        return novoVeiculo;
    },

    /**
     * Adiciona uma ordem de servico associada a um cliente.
     * @param {string} clienteId - ID do cliente.
     * @param {Object} dadosOrdem - { veiculoId, servico, status, data, dataFmt, concluidoEm }.
     * @returns {Object} - A ordem cadastrada com seu ID gerado.
     */
    adicionarOrdem(clienteId, dadosOrdem) {
        const ordens = JSON.parse(localStorage.getItem("ordens") || "[]");
        const novaOrdem = {
            id: "o_" + Date.now().toString(),
            clienteId: String(clienteId),
            veiculoId: dadosOrdem.veiculoId || "",
            servico: dadosOrdem.servico || "",
            status: dadosOrdem.status || "pendente",
            data: dadosOrdem.data || new Date().toLocaleString("pt-BR"),
            dataFmt: dadosOrdem.dataFmt || new Date().toISOString(),
            concluidoEm: dadosOrdem.concluidoEm || null,
        };
        ordens.push(novaOrdem);
        localStorage.setItem("ordens", JSON.stringify(ordens));
        return novaOrdem;
    },
};

// Vincula ao escopo global (window)
window.ClienteStorage = ClienteStorage;
