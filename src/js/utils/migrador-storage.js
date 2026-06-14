/**
 * migrador-storage.js — GarageERP
 *
 * Roda UMA VEZ automaticamente ao carregar qualquer página.
 * Detecta dados no antigo localStorage["veiculos"] (VeiculoStorage legado)
 * e os move para dentro do storage unificado "garageerp_ordens_dados".
 *
 * Depois de migrar, apaga a chave legada para não re-migrar.
 *
 * QUANDO INCLUIR: antes de cliente-repository.js e ordem-repository.js
 * em todas as páginas HTML.
 */
(function migrarStorageLegado() {
    const CHAVE_UNIFICADA = "garageerp_ordens_dados";
    const CHAVE_LEGADA = "veiculos";
    const CHAVE_MIGRADO = "garageerp_migrado_v1";

    // Não re-executa se já migrou
    if (localStorage.getItem(CHAVE_MIGRADO)) return;

    var rawLegado = localStorage.getItem(CHAVE_LEGADA);
    if (!rawLegado) {
        // Nada a migrar — marca como feito e sai
        localStorage.setItem(CHAVE_MIGRADO, "1");
        return;
    }

    var veiculosLegados;
    try {
        veiculosLegados = JSON.parse(rawLegado);
    } catch (e) {
        localStorage.setItem(CHAVE_MIGRADO, "1");
        return;
    }

    if (!Array.isArray(veiculosLegados) || veiculosLegados.length === 0) {
        localStorage.setItem(CHAVE_MIGRADO, "1");
        return;
    }

    // Carrega o storage unificado
    var raw = localStorage.getItem(CHAVE_UNIFICADA);
    var dados;
    try {
        dados = raw
            ? JSON.parse(raw)
            : { clientes: [], veiculos: [], ordens: [] };
    } catch (e) {
        dados = { clientes: [], veiculos: [], ordens: [] };
    }

    if (!Array.isArray(dados.veiculos)) dados.veiculos = [];
    if (!Array.isArray(dados.clientes)) dados.clientes = [];
    if (!Array.isArray(dados.ordens)) dados.ordens = [];

    var contadores = dados._contadores || {};

    // IDs já existentes no storage unificado (para não duplicar)
    var idsExistentes = {};
    dados.veiculos.forEach(function (v) {
        idsExistentes[String(v.id)] = true;
    });

    // Máximo ID numérico de veículo já usado (para o contador)
    var maxVei = contadores["vei"] || 0;
    dados.veiculos.forEach(function (v) {
        var n = Number(v.id);
        if (!isNaN(n) && n > maxVei) maxVei = n;
    });

    var migrados = 0;
    veiculosLegados.forEach(function (v) {
        var sid = String(v.id);

        // Se o veículo já existe no unificado (por ID), pula
        if (idsExistentes[sid]) return;

        // Gera novo ID prefixado para evitar colisão com IDs mockados (1-6)
        maxVei += 1;
        var novoId = "vei_" + maxVei;

        var novoVeiculo = {
            id: novoId,
            clienteId: String(v.clienteId || ""),
            marca: v.marca || "",
            modelo: v.modelo || "",
            placa: v.placa || "",
            ano: v.ano || "",
        };

        // Atualiza as ordens que referenciavam o ID antigo deste veículo
        dados.ordens.forEach(function (ordem) {
            // Snapshot desnormalizado: ordem.veiculo.id
            if (ordem.veiculo && String(ordem.veiculo.id) === sid) {
                ordem.veiculo.id = novoId;
            }
            // Campo normalizado (se existir)
            if (
                ordem.veiculoId !== undefined &&
                String(ordem.veiculoId) === sid
            ) {
                ordem.veiculoId = novoId;
            }
        });

        dados.veiculos.push(novoVeiculo);
        idsExistentes[novoId] = true;
        migrados++;
    });

    contadores["vei"] = maxVei;
    dados._contadores = contadores;

    try {
        localStorage.setItem(CHAVE_UNIFICADA, JSON.stringify(dados));
        // Remove a chave legada apenas após salvar com sucesso
        localStorage.removeItem(CHAVE_LEGADA);
        localStorage.setItem(CHAVE_MIGRADO, "1");

        if (migrados > 0) {
            console.info(
                "[GarageERP] Migração concluída: " +
                    migrados +
                    " veículo(s) movido(s) para o storage unificado.",
            );
        }
    } catch (e) {
        console.warn("[GarageERP] Migração falhou ao salvar:", e);
    }
})();
