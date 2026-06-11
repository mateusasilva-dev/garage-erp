/**
 * Controller - Detalhes do Cliente
 *
 * Lida com o comportamento da pagina de detalhes do cliente (cliente.html).
 * Exibe os dados do cliente, seus veiculos cadastrados e historico de ordens de servico.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Recupera o ID do cliente da URL
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get("id");

    if (!clienteId) {
        sessionStorage.setItem(
            "pendingToast",
            JSON.stringify({
                mensagem: "Cliente não identificado.",
                tipo: "danger",
            }),
        );
        window.location.href = "listar-clientes.html";
        return;
    }

    // Busca os dados completos do cliente (com join de veiculos e historico)
    const cliente = window.ClienteStorage.obterPorId(clienteId);

    if (!cliente) {
        sessionStorage.setItem(
            "pendingToast",
            JSON.stringify({
                mensagem: "Cliente não encontrado.",
                tipo: "danger",
            }),
        );
        window.location.href = "listar-clientes.html";
        return;
    }

    // 1. Preenche as informacoes basicas do cabecalho
    const avatarContainer = document.querySelector(".avatar-cliente");
    const infoTextoH1 = document.querySelector(".info-texto h1");
    const dadosContato = document.querySelector(".dados-contato");
    const btnEditar = document.querySelector(
        ".cabecalho-cliente .botao-secundario",
    );

    if (infoTextoH1) infoTextoH1.textContent = cliente.nome;
    if (avatarContainer) {
        // Primeira letra em destaque
        const primeiraLetra = cliente.nome
            ? cliente.nome.charAt(0).toUpperCase()
            : "C";
        avatarContainer.innerHTML = `<span style="font-size: 32px; font-weight: 700; color: #ffffff;">${primeiraLetra}</span>`;
    }

    if (dadosContato) {
        dadosContato.innerHTML = `
            <span>
                <img src="../../assets/icons/icon-email.svg" alt="E-mail" />
                ${cliente.email}
            </span>
            <span>
                <img src="../../assets/icons/icon-phone.svg" alt="Telefone" />
                ${cliente.telefone}
            </span>
        `;
    }

    if (btnEditar) {
        btnEditar.href = `editar-cliente.html?id=${cliente.id}`;
    }

    // 2. Preenche os links de adicionar veiculo e criar nova ordem
    const btnAddVeiculo = document.querySelector(".cartao-veiculos .botao");
    const btnAddOrdem = document.querySelector(
        ".cartao-historico .botao-grande",
    );

    if (btnAddVeiculo) {
        // Redireciona com query param de clienteId
        btnAddVeiculo.href = `novo-veiculo.html?clienteId=${cliente.id}`;
    }
    if (btnAddOrdem) {
        // Redireciona com query param de clienteId
        btnAddOrdem.href = `nova-ordem.html?clienteId=${cliente.id}`;
    }

    // 3. Renderiza Veiculos
    const veiculosTitulo = document.querySelector(".cartao-veiculos h2");
    const listaVeiculosContainer = document.querySelector(".lista-veiculos");

    if (veiculosTitulo) {
        veiculosTitulo.textContent = `Veículos (${cliente.veiculos.length})`;
    }

    if (listaVeiculosContainer) {
        listaVeiculosContainer.innerHTML = "";

        if (cliente.veiculos.length === 0) {
            listaVeiculosContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                    Nenhum veículo cadastrado para este cliente.
                </div>
            `;
        } else {
            cliente.veiculos.forEach((v) => {
                const veiculoLink = document.createElement("a");
                veiculoLink.href = `veiculo.html?id=${v.id}`;
                veiculoLink.className = "campo-veiculo";
                veiculoLink.innerHTML = `
                    <div class="icone-caixa">
                        <img src="../../assets/icons/icon-car.svg" alt="Carro" />
                    </div>
                    <div class="detalhes-veiculo">
                        <p>${v.modelo}</p>
                        <span>Placa: ${v.placa} • Ano: ${v.ano}</span>
                    </div>
                `;
                listaVeiculosContainer.appendChild(veiculoLink);
            });
        }
    }

    // 4. Renderiza Histórico de Serviços (Ordens de Servico)
    const historicoTitulo = document.querySelector(".cartao-historico h2");
    const listaHistoricoContainer = document.querySelector(".lista-historico");

    if (historicoTitulo) {
        historicoTitulo.textContent = `Histórico de Serviços (${cliente.historico.length})`;
    }

    if (listaHistoricoContainer) {
        listaHistoricoContainer.innerHTML = "";

        if (cliente.historico.length === 0) {
            listaHistoricoContainer.innerHTML = `
                <div style="padding: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                    Nenhuma ordem de serviço registrada para este cliente.
                </div>
            `;
        } else {
            cliente.historico.forEach((o) => {
                const divOrdem = document.createElement("div");

                // Configura as classes e badges dinamicamente com base no status da OS
                if (o.status === "atrasado") {
                    divOrdem.className = "bloco-status status-atrasado";
                    divOrdem.innerHTML = `
                        <div class="status-topo">
                            <div class="linha-status">
                                <div class="icone-status">
                                    <img src="../../assets/icons/icon-gray-warning.svg" alt="" />
                                </div>
                                <div class="info-status">
                                    <div class="data-status">
                                        <img src="../../assets/icons/icon-calendar.svg" alt="Data" />
                                        ${o.data}
                                    </div>
                                    <p>${o.servico}</p>
                                </div>
                            </div>
                            <div class="badge badge-atrasado">
                                <img src="../../assets/icons/icon-red-warning-circle.svg" alt="" />
                                Atrasado
                            </div>
                        </div>
                        <div class="aviso aviso-atrasado">
                            <img src="../../assets/icons/icon-red-warning.svg" alt="" />
                            Atenção: serviço atrasado
                        </div>
                    `;
                } else if (o.status === "concluido") {
                    divOrdem.className = "bloco-status status-concluido";
                    divOrdem.innerHTML = `
                        <div class="status-topo">
                            <div class="linha-status">
                                <div class="icone-status">
                                    <img src="../../assets/icons/icon-gray-check-circle.svg" alt="" />
                                </div>
                                <div class="info-status">
                                    <div class="data-status">
                                        <img src="../../assets/icons/icon-calendar.svg" alt="Data" />
                                        ${o.data}
                                    </div>
                                    <p>${o.servico}</p>
                                </div>
                            </div>
                            <div class="badge badge-concluido">
                                <img src="../../assets/icons/icon-check-circle.svg" alt="" />
                                Concluído
                            </div>
                        </div>
                        <div class="aviso aviso-concluido">
                            <img src="../../assets/icons/icon-green-check-circle.svg" alt="" />
                            Concluído em ${o.concluidoEm || o.data}
                        </div>
                    `;
                } else if (o.status === "andamento") {
                    divOrdem.className = "bloco-status status-pendente"; // Reaproveita estilos
                    divOrdem.innerHTML = `
                        <div class="status-topo">
                            <div class="linha-status">
                                <div class="icone-status">
                                    <img src="../../assets/icons/icon-orange-clock.svg" alt="" />
                                </div>
                                <div class="info-status">
                                    <div class="data-status">
                                        <img src="../../assets/icons/icon-calendar.svg" alt="Data" />
                                        ${o.data}
                                    </div>
                                    <p>${o.servico}</p>
                                </div>
                            </div>
                            <div class="badge" style="background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 500;">
                                <img src="../../assets/icons/icon-orange-clock.svg" style="width: 14px; height: 14px;" alt="" />
                                Em Andamento
                            </div>
                        </div>
                    `;
                } else {
                    // pendente
                    divOrdem.className = "bloco-status status-pendente";
                    divOrdem.innerHTML = `
                        <div class="status-topo">
                            <div class="linha-status">
                                <div class="icone-status">
                                    <img src="../../assets/icons/icon-gray-file.svg" alt="" />
                                </div>
                                <div class="info-status">
                                    <div class="data-status">
                                        <img src="../../assets/icons/icon-calendar.svg" alt="Data" />
                                        ${o.data}
                                    </div>
                                    <p>${o.servico}</p>
                                </div>
                            </div>
                            <div class="badge badge-pendente">
                                <img src="../../assets/icons/icon-blue-file.svg" alt="" />
                                Pendente
                            </div>
                        </div>
                    `;
                }

                // Permite clicar na OS para ir para detalhes da ordem
                divOrdem.style.cursor = "pointer";
                divOrdem.addEventListener("click", () => {
                    window.location.href = `ordem.html?id=${o.id}`;
                });

                listaHistoricoContainer.appendChild(divOrdem);
            });
        }
    }
});
