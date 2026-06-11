const lista = document.getElementById("lista-veiculos");

const veiculos = VeiculoService.Listar();

function AdicionarEventosExcluir(){
    const botaoExcluir = document.querySelectorAll(".btn-excluir");

    botaoExcluir.forEach(botao => {
        botao.addEventListener(
            "click",
            function(){

                const id = Number(this.dataset.id);

                const confirmar = confirm("Você realmente deseja excluir?")

                if(confirmar){
                    VeiculoService.Excluir(id);
                    location.reload();
                }
            }
        )
})
}

function RenderizarVeiculos(listaVeiculos){
    lista.innerHTML = "";

    listaVeiculos.forEach(veiculo => {
        lista.innerHTML += `
            <div class="card">
                <div class="card-topo">
                    <div class="icone-carro">
                        <img
                            src="../../assets/icons/icon-car.svg"
                            alt=""
                        />
                    </div>

                    <div class="card-acoes">
                        <a href="editar-veiculo.html?id=${veiculo.id}">
                            <img
                                src="../../assets/icons/icon-edit.svg"
                                alt="Editar"
                            />
                        </a>

                        <button class="btn-excluir" data-id="${veiculo.id}">

                            <img
                                src="../../assets/icons/icon-gray-trash.svg"
                                alt="Excluir"
                            />
                        </button>
                    </div>
                </div>

                <div class="card-veiculo">
                    <h2 class="veiculo">
                        ${veiculo.marca} ${veiculo.modelo}
                    </h2>

                    <p class="placa">
                        ${veiculo.placa} • ${veiculo.ano}
                    </p>
                </div>

                <div class="proprietario">
                    <p class="proprietario-titulo">
                        Proprietário
                    </p>

                    <p class="proprietario-nome">
                        ${veiculo.proprietario}
                    </p>
                </div>

                <a href="veiculo.html?id=${veiculo.id}" class="historico">
                    Ver Histórico
                </a>
            </div>
        `
    });

    AdicionarEventosExcluir();
}

RenderizarVeiculos(veiculos);

const pesquisa = document.getElementById("pesquisa");

pesquisa.addEventListener(
    "input",
    function() {
        const texto = this.value.toLowerCase();

        const filtrados = veiculos.filter(veiculo =>
            veiculo.marca
                    .toLowerCase()
                    .includes(texto)

            ||

            veiculo.modelo
                .toLowerCase()
                .includes(texto)

            ||

            veiculo.placa
                .toLowerCase()
                .includes(texto)

            ||

            veiculo.proprietario
                .toLowerCase()
                .includes(texto)
        );

        RenderizarVeiculos(filtrados);
    }
)

