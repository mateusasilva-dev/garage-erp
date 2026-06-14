console.log(GarageOrdens.listarOrdens());

const ordens = GarageOrdens.listarOrdens();
const total = ordens.length;

const concluido = ordens.filter((ordem) => ordem.status === "concluido").length;

const em_andamento = ordens.filter(
    (ordem) => ordem.status === "em_andamento",
).length;

const pendente = ordens.filter((ordem) => ordem.status === "pendente").length;

const atrasado = ordens.filter((ordem) => ordem.status === "atrasado").length;

function Porcentagem(valor, total) {
    if (total === 0) {
        return 0;
    }

    return (valor / total) * 100;
}

function AtualizarTexto(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

const pctConcluido = Math.round(Porcentagem(concluido, total));

AtualizarTexto("indice-concluido", `${pctConcluido}%`);

const pctAtrasado = Math.round(Porcentagem(atrasado, total));

AtualizarTexto("indice-atrasado", `${pctAtrasado}%`);

//Cards
function ValorIndice(id, valor, total) {
    const pct = Porcentagem(valor, total);

    document.getElementById("indice-" + id).textContent = `${Math.round(pct)}%`;
}

ValorIndice("concluido", concluido, total);
ValorIndice("atrasado", atrasado, total);

function ValorQuan(id, valor) {
    const elemento = document.getElementById("num-" + id);
    if (elemento) {
        elemento.textContent = `${valor}`;
    }
}

ValorQuan("OS", total);

function AtualizarClientes() {
    const TotalClientes = ClienteStorage.listar().length;
    ValorQuan("cliente", TotalClientes);
    AtualizarTexto("num-cliente", TotalClientes);
}

AtualizarClientes();

//Gráfico Distribuicao de Status das Ordens
function AtualizarBarra(id, valor, total) {
    const pct = Porcentagem(valor, total);
    const barra = document.getElementById("barra-" + id);
    const performance = document.getElementById("performance-" + id);

    if (barra) barra.style.width = pct + "%";
    if (performance) {
        performance.textContent = `${valor} de ${total} (${Math.round(pct)}%)`;
    }
}

AtualizarBarra("concluido", concluido, total);
AtualizarBarra("andamento", em_andamento, total);
AtualizarBarra("pendente", pendente, total);
AtualizarBarra("atrasado", atrasado, total);

const receitaTotal = ordens
    .filter((ordem) => ordem.status === "concluido")
    .reduce((total, ordem) => {
        return total + GarageOrdens.obterTotal(ordem);
    }, 0);

AtualizarTexto("num-receita-total", GarageOrdens.formatarMoeda(receitaTotal));

const receitaElemento = document.getElementById("receita-total");

const receitaMedia = concluido === 0 ? 0 : receitaTotal / concluido;

AtualizarTexto("num-receita-media", GarageOrdens.formatarMoeda(receitaMedia));

//monthly-graphic

const labels = ["Dez", "Jan", "Fev", "Mar", "Abr", "Mai"];

const data = {
    labels: labels,
    datasets: [
        {
            label: "Quantidade de Ordem de Serviço",
            data: [4, 2, 3, 1, 5, 3],
            borderColor: "rgba(37, 99, 235, 1)",
            backgroundColor: "rgba(37, 99, 235, 0.5)",
        },
    ],
};

const config = {
    type: "bar",
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Performance Mensal da Oficina",
            },
        },
    },
};

window.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("monthly-graphic").getContext("2d");
    new Chart(ctx, config);
});

const rankingClientes = {};

ordens.forEach((ordem) => {
    const nome = ordem.cliente.nome;

    if (!rankingClientes[nome]) {
        rankingClientes[nome] = 0;
    }

    rankingClientes[nome]++;
});

const clientesOrdenados = Object.entries(rankingClientes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

const listaClientes = document.getElementById("lista-clientes-frequentes");

listaClientes.innerHTML = "";

clientesOrdenados.forEach((cliente, index) => {
    const nome = cliente[0];

    const quantidade = cliente[1];

    listaClientes.innerHTML += `
        <div class="frequency-card">
            <div class="frequency-numbername">
                <p class="frequency-number">${index + 1}</p>
                <p class="frequency-name">${nome}</p>
            </div>
            <p class="number-os">${quantidade} OS</p>
        </div>
    `;
});

const rankingVeiculos = {};

ordens.forEach((ordem) => {
    const chave = ordem.veiculo.placa;

    if (!rankingVeiculos[chave]) {
        rankingVeiculos[chave] = {
            modelo: ordem.veiculo.modelo,
            placa: ordem.veiculo.placa,
            proprietario: ordem.cliente.nome,
            quantidade: 0,
        };
    }

    rankingVeiculos[chave].quantidade++;
});

const veiculosOrdenados = Object.values(rankingVeiculos)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

const listaVeiculos = document.getElementById("lista-veiculos-frequentes");

listaVeiculos.innerHTML = "";

veiculosOrdenados.forEach((veiculo, index) => {
    listaVeiculos.innerHTML += `
        <div class="frequency-card">
            <div class="frequency-numbername">
                <p class="frequency-number">${index + 1}</p>

                <div class="frequency-information">
                    <p class="frequency-name">
                        ${veiculo.modelo}
                    </p>

                    <div class="frequency-cadastro">
                        <p class="frequency-plate">
                            ${veiculo.placa}
                        </p>

                        <p class="frequency-owner">
                            ${veiculo.proprietario}
                        </p>
                    </div>
                </div>
            </div>

            <p class="number-os">${veiculo.quantidade} OS</p>
        </div>
    `;
});
