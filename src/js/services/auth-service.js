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
        if (window.showAccessDeniedBanner) {
            window.showAccessDeniedBanner();
        } else {
            // Fallback caso o script de alertas não tenha carregado
            document.body.innerHTML = "<h1>Acesso Negado</h1>";
        }
        document.getElementById("auth-hide-body").remove();
        return;
    }

    // Se tiver acesso permitido, remove o bloqueio e exibe a página normalmente
    document.getElementById("auth-hide-body").remove();

    // Verifica se há alguma notificação pendente a ser exibida
    const pendingToast = sessionStorage.getItem("pendingToast");
    if (pendingToast) {
        try {
            const { mensagem, tipo } = JSON.parse(pendingToast);
            if (window.customAlert) {
                window.customAlert(mensagem, tipo);
            }
        } catch (e) {
            console.error("Erro ao processar notificação pendente:", e);
        }
        sessionStorage.removeItem("pendingToast");
    }
});
