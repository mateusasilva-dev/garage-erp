/**
 * Repositório de Clientes - GarageERP
 *
 * CORREÇÕES APLICADAS:
 * - Unificado com a mesma chave "garageerp_ordens_dados" usada pelo GarageOrdens,
 *   eliminando o conflito de dois storages paralelos com IDs incompatíveis.
 * - Geração de IDs via Date.now() substituída por um contador global incremental
 *   com prefixo por tipo (cli_*, vei_*), garantindo que IDs nunca colidam entre
 *   clientes, veículos e ordens.
 * - VeiculoStorage (legado) agora delega para cá, tornando-se um adaptador
 *   transparente em vez de uma segunda fonte de verdade.
 */

(function () {
    const CHAVE_UNIFICADA = "garageerp_ordens_dados";

    // ─── Helpers de storage ───────────────────────────────────────────────────────

    function obterDadosUnificados() {
        const raw = localStorage.getItem(CHAVE_UNIFICADA);
        if (!raw) return { clientes: [], veiculos: [], ordens: [] };
        try {
            return JSON.parse(raw);
        } catch (e) {
            return { clientes: [], veiculos: [], ordens: [] };
        }
    }

    function salvarDadosUnificados(dados) {
        localStorage.setItem(CHAVE_UNIFICADA, JSON.stringify(dados));
    }

    // ─── Geração de IDs únicos globais ────────────────────────────────────────────

    function proximoId(dados, tipo) {
        const contadores = dados._contadores || {};
        const atual = contadores[tipo] || 0;
        const novo = atual + 1;
        contadores[tipo] = novo;
        dados._contadores = contadores;
        return tipo + "_" + novo;
    }

    // ─── ClienteStorage ───────────────────────────────────────────────────────────

    const ClienteStorage = {
        listar(busca = "") {
            const dados = obterDadosUnificados();
            const clientes = dados.clientes || [];
            if (!busca) return clientes;
            const termo = busca.toLowerCase().trim();
            return clientes.filter(
                (c) =>
                    (c.nome && c.nome.toLowerCase().includes(termo)) ||
                    (c.email && c.email.toLowerCase().includes(termo)) ||
                    (c.telefone && c.telefone.toLowerCase().includes(termo)),
            );
        },

        obterPorId(id) {
            const dados = obterDadosUnificados();
            const sid = String(id);
            const cliente = (dados.clientes || []).find(
                (c) => String(c.id) === sid,
            );
            if (!cliente) return null;

            // Join de veículos
            cliente.veiculos = (dados.veiculos || []).filter(
                (v) => String(v.clienteId) === sid,
            );

            // Join de ordens (histórico de serviços)
            cliente.historico = (dados.ordens || []).filter((o) => {
                const oid =
                    o.clienteId !== undefined
                        ? String(o.clienteId)
                        : o.cliente
                          ? String(o.cliente.id)
                          : null;
                return oid === sid;
            });

            return cliente;
        },

        criar(dadosCliente) {
            const dados = obterDadosUnificados();
            const novoCliente = {
                id: proximoId(dados, "cli"),
                nome: dadosCliente.nome || "",
                email: dadosCliente.email || "",
                telefone: dadosCliente.telefone || "",
            };
            dados.clientes = dados.clientes || [];
            dados.clientes.push(novoCliente);
            salvarDadosUnificados(dados);
            return novoCliente;
        },

        atualizar(id, dadosNovos) {
            const dados = obterDadosUnificados();
            const clientes = dados.clientes || [];
            const sid = String(id);
            const index = clientes.findIndex((c) => String(c.id) === sid);
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

            dados.clientes = clientes;
            salvarDadosUnificados(dados);
            return clientes[index];
        },

        excluir(id) {
            const dados = obterDadosUnificados();
            const sid = String(id);

            dados.clientes = (dados.clientes || []).filter(
                (c) => String(c.id) !== sid,
            );
            dados.veiculos = (dados.veiculos || []).filter(
                (v) => String(v.clienteId) !== sid,
            );

            // Remove ordens do cliente
            dados.ordens = (dados.ordens || []).filter((o) => {
                const oid =
                    o.clienteId !== undefined
                        ? String(o.clienteId)
                        : o.cliente
                          ? String(o.cliente.id)
                          : null;
                return oid !== sid;
            });

            salvarDadosUnificados(dados);
            return true;
        },

        // ── Veículos (helpers usados pelo VeiculoStorage) ─────────────────

        adicionarVeiculo(clienteId, dadosVeiculo) {
            const dados = obterDadosUnificados();
            const novoVeiculo = {
                id: proximoId(dados, "vei"),
                clienteId: String(clienteId),
                marca: dadosVeiculo.marca || "",
                modelo: dadosVeiculo.modelo || "",
                placa: dadosVeiculo.placa || "",
                ano: dadosVeiculo.ano || "",
            };
            dados.veiculos = dados.veiculos || [];
            dados.veiculos.push(novoVeiculo);
            salvarDadosUnificados(dados);
            return novoVeiculo;
        },

        atualizarVeiculo(id, dadosNovos) {
            const dados = obterDadosUnificados();
            const veiculos = dados.veiculos || [];
            const sid = String(id);
            const index = veiculos.findIndex((v) => String(v.id) === sid);
            if (index === -1) return null;

            veiculos[index] = {
                ...veiculos[index],
                ...dadosNovos,
                id: veiculos[index].id,
            };
            dados.veiculos = veiculos;
            salvarDadosUnificados(dados);
            return veiculos[index];
        },

        buscarVeiculo(id) {
            const dados = obterDadosUnificados();
            const sid = String(id);
            return (
                (dados.veiculos || []).find((v) => String(v.id) === sid) || null
            );
        },

        excluirVeiculo(id) {
            const dados = obterDadosUnificados();
            const sid = String(id);
            dados.veiculos = (dados.veiculos || []).filter(
                (v) => String(v.id) !== sid,
            );
            // Também remove ordens vinculadas ao veículo
            dados.ordens = (dados.ordens || []).filter((o) => {
                const ovid =
                    o.veiculoId !== undefined
                        ? String(o.veiculoId)
                        : o.veiculo
                          ? String(o.veiculo.id)
                          : null;
                return ovid !== sid;
            });
            salvarDadosUnificados(dados);
            return true;
        },

        listarVeiculos() {
            return obterDadosUnificados().veiculos || [];
        },
    };

    // ─── Exposição global ─────────────────────────────────────────────────────────

    window.ClienteStorage = ClienteStorage;
})();
