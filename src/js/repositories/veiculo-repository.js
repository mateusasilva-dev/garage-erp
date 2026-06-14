/**
 * Repositório de Veículos - GarageERP
 *
 * Gerencia a persistência e lógica de negócio dos veículos
 * usando o storage unificado "garageerp_ordens_dados".
 */

(function () {
    /**
     * Repositório de Veículos - GarageERP
     *
     * Refatorado para delegar ao ClienteStorage, unificando a fonte de verdade.
     */
    const VeiculoStorage = {
        Salvar(veiculo) {
            // Delega para o ClienteStorage que já lida com o ID e Storage Unificado corretamente
            return window.ClienteStorage.adicionarVeiculo(
                veiculo.clienteId,
                veiculo,
            );
        },

        Listar() {
            return window.ClienteStorage.listarVeiculos();
        },

        Buscar(id) {
            return window.ClienteStorage.buscarVeiculo(id);
        },

        Atualizar(veiculoAtualizado) {
            return window.ClienteStorage.atualizarVeiculo(
                veiculoAtualizado.id,
                veiculoAtualizado,
            );
        },

        Excluir(id) {
            return window.ClienteStorage.excluirVeiculo(id);
        },
    };

    window.VeiculoStorage = VeiculoStorage;
})();
