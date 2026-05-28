// Injeta um estilo no <head> para ocultar o corpo da página imediatamente
// Isso previne o aparecimento do conteúdo da página não autorizada antes do script validar o acesso
const styleHide = document.createElement("style");
styleHide.id = "auth-hide-body";
styleHide.innerHTML = "body { display: none !important; }";
document.head.appendChild(styleHide);

document.addEventListener("DOMContentLoaded", function () {
    const perfilLogado = localStorage.getItem("perfilLogado");
    const perfilPermitido = document.body.dataset.perfilPermitido;

    if (perfilLogado === null || perfilLogado !== perfilPermitido) {
        exibirBannerAcessoNegado();
        document.getElementById("auth-hide-body").remove();
        return;
    }

    // Se tiver acesso permitido, remove o bloqueio e exibe a página normalmente
    document.getElementById("auth-hide-body").remove();
});

function exibirBannerAcessoNegado() {
    // Limpa o conteúdo da página atual para não exibir nada não autorizado
    document.body.innerHTML = "";
    document.body.style.overflow = "hidden";

    // Cria o container do banner
    const bannerContainer = document.createElement("div");
    bannerContainer.style.position = "fixed";
    bannerContainer.style.top = "0";
    bannerContainer.style.left = "0";
    bannerContainer.style.width = "100vw";
    bannerContainer.style.height = "100vh";
    bannerContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    bannerContainer.style.display = "flex";
    bannerContainer.style.justifyContent = "center";
    bannerContainer.style.alignItems = "center";
    bannerContainer.style.zIndex = "9999";
    bannerContainer.style.fontFamily = '"Inter", sans-serif';

    // Cria o card do banner
    const bannerCard = document.createElement("div");
    bannerCard.style.backgroundColor = "#ffffff";
    bannerCard.style.padding = "24px";
    bannerCard.style.borderRadius = "8px";
    bannerCard.style.maxWidth = "400px";
    bannerCard.style.width = "90%";
    bannerCard.style.textAlign = "center";
    bannerCard.style.boxShadow =
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";

    // Ícone de alerta (vermelho)
    const iconContainer = document.createElement("div");
    iconContainer.style.backgroundColor = "#fee2e2";
    iconContainer.style.color = "#dc2626";
    iconContainer.style.width = "48px";
    iconContainer.style.height = "48px";
    iconContainer.style.borderRadius = "50%";
    iconContainer.style.display = "flex";
    iconContainer.style.justifyContent = "center";
    iconContainer.style.alignItems = "center";
    iconContainer.style.margin = "0 auto 16px";
    iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    `;

    // Título
    const title = document.createElement("h2");
    title.innerText = "Acesso Restrito";
    title.style.fontSize = "20px";
    title.style.fontWeight = "600";
    title.style.color = "#111827";
    title.style.margin = "0 0 8px 0";

    // Mensagem
    const message = document.createElement("p");
    message.innerText = "Você não tem permissão para acessar esta página.";
    message.style.fontSize = "14px";
    message.style.color = "#6b7280";
    message.style.margin = "0 0 24px 0";
    message.style.lineHeight = "1.5";

    // Botão de retornar
    const btnVoltar = document.createElement("button");
    btnVoltar.innerText = "Voltar para a página anterior";
    btnVoltar.style.backgroundColor = "#2563eb";
    btnVoltar.style.color = "#ffffff";
    btnVoltar.style.border = "none";
    btnVoltar.style.padding = "10px 20px";
    btnVoltar.style.borderRadius = "6px";
    btnVoltar.style.fontWeight = "500";
    btnVoltar.style.cursor = "pointer";
    btnVoltar.style.width = "100%";
    btnVoltar.style.fontSize = "14px";
    btnVoltar.style.transition = "background-color 0.2s";

    btnVoltar.onmouseover = function () {
        btnVoltar.style.backgroundColor = "#1d4ed8";
    };
    btnVoltar.onmouseout = function () {
        btnVoltar.style.backgroundColor = "#2563eb";
    };

    btnVoltar.onclick = function () {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            const perfil = localStorage.getItem("perfilLogado");
            if (perfil) {
                // Volta para a dashboard do usuário
                window.location.href = "../" + perfil + "/dashboard.html";
            } else {
                // Se nenhum logado, envia para login
                window.location.href = "../../index.html";
            }
        }
    };

    // Montar a estrutura
    bannerCard.appendChild(iconContainer);
    bannerCard.appendChild(title);
    bannerCard.appendChild(message);
    bannerCard.appendChild(btnVoltar);
    bannerContainer.appendChild(bannerCard);

    document.body.appendChild(bannerContainer);
}
