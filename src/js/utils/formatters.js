/**
 * Utilitários de Formatação - GarageERP
 * 
 * Centraliza funções de formatação de data, moeda e strings para uso em todo o sistema.
 */

const Formatters = {
    /**
     * Formata uma data ISO ou timestamp para o padrão DD/MM/AAAA.
     * @param {string|Date} data 
     * @returns {string}
     */
    formatarDataCurta(data) {
        if (!data) return "";
        return new Date(data).toLocaleDateString("pt-BR");
    },

    /**
     * Formata uma data ISO ou timestamp para o padrão DD/MM/AAAA às HH:MM.
     * @param {string|Date} data 
     * @returns {string}
     */
    formatarDataCompleta(data) {
        if (!data) return "";
        return new Date(data).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    },

    /**
     * Formata um valor numérico para a moeda brasileira (R$).
     * @param {number} valor 
     * @returns {string}
     */
    formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    },

    /**
     * Converte uma string de moeda (ex: R$ 1.200,50) para um número (1200.50).
     * @param {string} valor 
     * @returns {number}
     */
    converterValorMoeda(valor) {
        const texto = String(valor || "0")
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();

        return Number(texto) || 0;
    },

    /**
     * Escapa caracteres HTML para prevenir XSS.
     * @param {string} valor 
     * @returns {string}
     */
    escaparHtml(valor) {
        return String(valor || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

// Vincula ao escopo global para compatibilidade com o sistema atual
window.Formatters = Formatters;
