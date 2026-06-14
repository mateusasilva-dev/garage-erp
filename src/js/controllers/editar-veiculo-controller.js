const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

const veiculo = VeiculoStorage.Buscar(id);

const selectCliente = document.getElementById("cliente");
const inputPlaca = document.getElementById("placa");
const clientes = ClienteStorage.listar();

clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nome;
    selectCliente.appendChild(option);
});

if (veiculo) {
    // FIX: garantir string para o value do select
    selectCliente.value = String(veiculo.clienteId || "");

    document.getElementById("marca").value = veiculo.marca || "";
    document.getElementById("modelo").value = veiculo.modelo || "";
    inputPlaca.value = window.Formatters.formatarPlaca(veiculo.placa || "");
    document.getElementById("ano").value = veiculo.ano || "";
}

// Formatação da placa em tempo real
if (inputPlaca) {
    inputPlaca.addEventListener("input", function (e) {
        const cursorPosition = e.target.selectionStart;
        const valorOriginal = e.target.value;
        const valorFormatado = window.Formatters.formatarPlaca(valorOriginal);

        e.target.value = valorFormatado;

        // Tenta manter a posição do cursor (ajustando se o traço foi inserido)
        if (
            valorFormatado.length > valorOriginal.length &&
            valorFormatado.includes("-")
        ) {
            e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        }
    });
}

const formulario = document.getElementById("form-veiculo");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const veiculoAtualizado = {
        id: veiculo.id,
        clienteId: document.getElementById("cliente").value,
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        placa: inputPlaca.value,
        ano: document.getElementById("ano").value,
    };

    VeiculoStorage.Atualizar(veiculoAtualizado);

    window.customAlert("Veículo atualizado!", "success");

    window.location.href = "listar-veiculos.html";
});

// Ação do botão cancelar
const btnCancelar = document.querySelector(".btn-cancelar");
if (btnCancelar) {
    btnCancelar.addEventListener("click", function (evento) {
        evento.preventDefault();
        window.location.href = "listar-veiculos.html";
    });
}
