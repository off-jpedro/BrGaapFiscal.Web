import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import Button from "sap/m/Button";
import Event from "sap/ui/base/Event";

/**
 * @namespace brgaapfiscal.web.controller
 */
export default class View extends Controller {

    private apiUrl: string = "http://localhost:5136/api/notafiscal";

    public onInit(): void {
        this.loadNotas();
    }

    // Carrega as notas fiscais da API
    private async loadNotas(): Promise<void> {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error("Erro ao buscar notas fiscais");
            }
            const data = await response.json();

            // Carregar o modelo com os dados recebidos
            const oModel = new JSONModel(data);
            const oView = this.getView();
            if (oView) {
                oView.setModel(oModel);
            }
        } catch (error) {
            MessageBox.error("Erro ao carregar notas fiscais.");
            console.error(error);
        }
    }

    // Ação ao clicar em "Adicionar"
    public onAdd(): void {
        MessageBox.information("Aqui abriria um formulário para adicionar uma nota.");
    }

    // Ação ao clicar em "Editar"
    public onEdit(oEvent: Event): void {
        const oButton = oEvent.getSource() as Button;
        const oContext = oButton.getBindingContext();
        if (!oContext) return;

        // Obtém o objeto do item clicado
        const oItem = oContext.getObject() as { numeroNota: string };
        MessageBox.information(`Editar Nota Fiscal: ${oItem.numeroNota}`);
    }

    // Ação ao clicar em "Remover"
    public onDelete(oEvent: Event): void {
        const oButton = oEvent.getSource() as Button;
        const oContext = oButton.getBindingContext();
        if (!oContext) return;

        // Obtém o objeto do item clicado
        const oItem = oContext.getObject() as { id: string };
        const sUrl = `${this.apiUrl}/${oItem.id}`;

        // Confirmação de exclusão
        MessageBox.confirm("Deseja remover esta nota?", {
            onClose: async (sAction: string) => {  // Define explicitamente o tipo de 'sAction' como string
                if (sAction === "OK") {
                    try {
                        const response = await fetch(sUrl, { method: "DELETE" });
                        if (!response.ok) {
                            throw new Error("Erro ao remover");
                        }
                        MessageBox.success("Nota removida!");
                        this.loadNotas();  // Recarregar a lista após exclusão
                    } catch (error) {
                        MessageBox.error("Erro ao remover a nota.");
                        console.error(error);
                    }
                }
            }
        });
    }
}
