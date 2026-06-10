const formulario = document.getElementById("form-veiculo");

formulario.addEventListener("submit", function(evento){
    event.preventDefault();

    const veiculo = {
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

    VeiculoService.Salvar(veiculo);

    alert("Veículo cadastrado com sucesso!");

    window.location.href = "listar-veiculos.html";
});