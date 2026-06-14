/**
 * Controller - Editar Cliente
 *
 * Lida com o comportamento do formulario de edicao de cliente (editar-cliente.html).
 * Carrega os dados existentes, valida e salva as alteracoes usando ClienteStorage.
 */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".card-edicao");
    const btnCancelar = document.querySelector(".btn-cancelar");

    if (!form) return;

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

    // Busca os dados do cliente no localstorage
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

    // Inputs do formulario
    const nomeInput = form.querySelector('input[type="text"]');
    const telefoneInput = form.querySelector('input[type="tel"]');
    const emailInput = form.querySelector('input[type="email"]');

    // Preenche os inputs com os dados do cliente
    if (nomeInput) nomeInput.value = cliente.nome || "";
    if (telefoneInput) telefoneInput.value = cliente.telefone || "";
    if (emailInput) emailInput.value = cliente.email || "";

    // Capitalização inteligente do nome em tempo real (Title Case)
    if (nomeInput) {
        nomeInput.addEventListener("input", (e) => {
            const cursorPosition = e.target.selectionStart;
            let value = e.target.value;

            // Formata o nome para capitalizar a primeira letra de cada palavra
            let palavras = value.split(/(\s+)/);
            palavras = palavras.map((palavra) => {
                if (palavra.trim().length > 0) {
                    return (
                        palavra.charAt(0).toUpperCase() +
                        palavra.slice(1).toLowerCase()
                    );
                }
                return palavra;
            });

            e.target.value = palavras.join("");

            // Restaura a posição do cursor
            e.target.setSelectionRange(cursorPosition, cursorPosition);
        });
    }

    // Máscara inteligente para telefone (celular com 11 dígitos ou fixo com 10 dígitos)
    if (telefoneInput) {
        telefoneInput.setAttribute("maxLength", "15");

        telefoneInput.addEventListener("input", (e) => {
            let valor = e.target.value.replace(/\D/g, "");

            // Limita a no máximo 11 dígitos
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            // Aplica a formatação dinâmica
            if (valor.length > 0) {
                if (valor.length <= 2) {
                    valor = `(${valor}`;
                } else if (valor.length <= 6) {
                    valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
                } else if (valor.length <= 10) {
                    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
                } else {
                    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
                }
            }

            e.target.value = valor;
        });
    }

    // Manipula o envio do formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = nomeInput ? nomeInput.value.trim() : "";
        const telefone = telefoneInput ? telefoneInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";

        // Validacoes com customAlert
        if (!nome || !telefone || !email) {
            window.customAlert(
                "Por favor, preencha todos os campos obrigatórios (*).",
                "warning",
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            window.customAlert(
                "Por favor, insira um endereço de e-mail válido.",
                "warning",
            );
            return;
        }

        // Valida se o telefone está completo (físico ou celular)
        if (telefone.length < 14) {
            window.customAlert(
                "Por favor, insira um número de telefone celular ou fixo válido com DDD.",
                "warning",
            );
            return;
        }

        // Atualiza os dados
        window.ClienteStorage.atualizar(clienteId, { nome, telefone, email });

        sessionStorage.setItem(
            "pendingToast",
            JSON.stringify({
                mensagem: "Cliente atualizado com sucesso!",
                tipo: "success",
            }),
        );
        // Redireciona de volta para a tela de detalhes do cliente
        window.location.href = `cliente.html?id=${clienteId}`;
    });

    // Acao do botao cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = `cliente.html?id=${clienteId}`;
        });
    }
});
