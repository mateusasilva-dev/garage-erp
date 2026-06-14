/**
 * Controller - Detalhes e Histórico do Veículo
 *
 * Exibe as informações do veículo e lista o histórico de ordens
 * de serviço vinculadas a ele.
 */

document.addEventListener("DOMContentLoaded", () => {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        window.location.href = "listar-veiculos.html";
        return;
    }

    const veiculo = window.VeiculoStorage.Buscar(id);
    const ordens = window.GarageOrdens.listarOrdens();

    if (!veiculo) {
        window.customAlert("Veículo não encontrado", "danger");
        setTimeout(() => {
            window.location.href = "listar-veiculos.html";
        }, 1500);
        return;
    }

    const cliente = window.ClienteStorage.obterPorId(veiculo.clienteId);

    document.getElementById("veiculo-nome").textContent =
        `${veiculo.marca} ${veiculo.modelo}`;

    document.getElementById("veiculo-info").textContent =
        `${veiculo.placa} • ${veiculo.ano}`;

    document.getElementById("veiculo-proprietario").textContent =
        `Proprietário: ${cliente ? cliente.nome : "Não encontrado"}`;

    // Atualiza links dos botões "Editar Veículo" e "Nova Ordem" na visualização do veículo
    const btnEditar = document.querySelector(".btn-editar");
    if (btnEditar) {
        btnEditar.href = `editar-veiculo.html?id=${veiculo.id}`;
    }
    const btnNovaOrdem = document.querySelector(".btn-nova-ordem");
    if (btnNovaOrdem) {
        btnNovaOrdem.href = `nova-ordem.html?clienteId=${veiculo.clienteId}&veiculoId=${veiculo.id}`;
    }

    const historico = ordens.filter((ordem) => {
        const veiculoIdOrdem =
            ordem.veiculoId !== undefined
                ? String(ordem.veiculoId)
                : ordem.veiculo
                  ? String(ordem.veiculo.id)
                  : null;

        return veiculoIdOrdem === String(veiculo.id);
    });

    document.getElementById("total-servicos").textContent =
        `${historico.length} serviços registrados`;

    const lista = document.getElementById("lista-historico");

    const statusMap = {
        pendente: {
            classe: "badge-pendente",
            icone: "../../assets/icons/icon-blue-file.svg",
            texto: "Pendente",
        },
        em_andamento: {
            classe: "badge-andamento",
            icone: "../../assets/icons/icon-orange-clock.svg",
            texto: "Em andamento",
        },
        concluido: {
            classe: "badge-concluido",
            icone: "../../assets/icons/icon-check-circle.svg",
            texto: "Concluído",
        },
        atrasado: {
            classe: "badge-atrasado",
            icone: "../../assets/icons/icon-red-warning-circle.svg",
            texto: "Atrasado",
        },
    };

    lista.innerHTML = "";

    historico.forEach((ordem) => {
        const status = statusMap[ordem.status];

        lista.innerHTML += `
            <a href="ordem.html?id=${ordem.id}" class="history-card">
                <div class="history-content">
                    <div class="history-os">
                        <p class="history-service">
                            ${ordem.queixa}
                        </p>

                        <div class="history-data">
                            ${window.GarageOrdens.formatarDataCompleta(ordem.dataCriacao)}
                        </div>
                    </div>
                </div>

                <div class="badge ${status.classe}">
                    <img src="${status.icone}" alt="">
                    ${status.texto}
                </div>
            </a>
        `;
    });
});
