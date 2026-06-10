const parametros = new URLSearchParams(window.location.search);

const id = Number(
    parametros.get("id")
);

const veiculo = VeiculoService.Buscar(id);

document.getElementById("proprietario").value =
    veiculo.proprietario;

document.getElementById("marca").value =
    veiculo.marca;

document.getElementById("modelo").value =
    veiculo.modelo;

document.getElementById("placa").value =
    veiculo.placa;

document.getElementById("ano").value =
    veiculo.ano;

    
const formulario =
    document.getElementById("form-veiculo");

formulario.addEventListener(
    "submit",
    function(evento){

        evento.preventDefault();

        const veiculoAtualizado = {

            id: veiculo.id,

            proprietario:
                document.getElementById("proprietario").value,

            marca:
                document.getElementById("marca").value,

            modelo:
                document.getElementById("modelo").value,

            placa:
                document.getElementById("placa").value,

            ano:
                document.getElementById("ano").value
        };

        VeiculoService.Atualizar(
            veiculoAtualizado
        );

        alert("Veículo atualizado!");

        window.location.href =
            "listar-veiculos.html";
    }
);