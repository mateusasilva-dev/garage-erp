/**
 * Controller - Listar Clientes
 *
 * Lida com o comportamento da pagina de listagem de clientes (listar-clientes.html).
 * Integra com ClienteStorage para buscar, filtrar e deletar registros.
 */

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search");
    const listContainer = document.querySelector(".lista");

    // Renderiza a lista de clientes na tela
    function renderizarClientes(busca = "") {
        const clientes = window.ClienteStorage.listar(busca);
        listContainer.innerHTML = "";

        if (clientes.length === 0) {
            listContainer.innerHTML = `
                <div class="sem-resultados" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280; font-size: 16px;">
                    Nenhum cliente cadastrado ou encontrado para a busca.
                </div>
            `;
            return;
        }

        clientes.forEach((cliente) => {
            const card = document.createElement("div");
            card.className = "card";

            // Obtem a primeira letra do nome para o icone circular
            const primeiraLetra = cliente.nome
                ? cliente.nome.charAt(0).toUpperCase()
                : "C";

            card.innerHTML = `
                <div class="card-topo">
                    <div class="icone-letra">${primeiraLetra}</div>
                    <div class="card-acoes">
                        <a href="editar-cliente.html?id=${cliente.id}" title="Editar cliente">
                            <img src="../../assets/icons/icon-edit.svg" alt="Editar" />
                        </a>
                        <button class="btn-excluir" style="background: none; border: none; padding: 0; cursor: pointer;" title="Excluir cliente">
                            <img src="../../assets/icons/icon-gray-trash.svg" alt="Excluir" />
                        </button>
                    </div>
                </div>
                <h2 class="nome-cliente">${cliente.nome}</h2>
                <div class="info-cliente">
                    <img src="../../assets/icons/icon-email.svg" alt="Email" />
                    ${cliente.email}
                </div>
                <div class="info-cliente">
                    <img src="../../assets/icons/icon-phone.svg" alt="Telefone" />
                    ${cliente.telefone}
                </div>
                <button class="historico btn-detalhes">Ver Detalhes</button>
            `;

            // Acao de ver detalhes
            card.querySelector(".btn-detalhes").addEventListener(
                "click",
                () => {
                    window.location.href = `cliente.html?id=${cliente.id}`;
                },
            );

            // Acao de exclusao
            card.querySelector(".btn-excluir").addEventListener("click", () => {
                window.customConfirm(
                    `Tem certeza que deseja excluir o cliente "${cliente.nome}"? Esta ação removerá também todos os seus veículos e ordens de serviço.`,
                    () => {
                        window.ClienteStorage.excluir(cliente.id);
                        window.customAlert(
                            "Cliente excluído com sucesso!",
                            "success",
                        );
                        renderizarClientes(
                            searchInput ? searchInput.value : "",
                        );
                    },
                );
            });

            listContainer.appendChild(card);
        });
    }

    // Escuta a pesquisa em tempo real
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderizarClientes(e.target.value);
        });
    }

    // Inicializa a listagem
    renderizarClientes();
});
