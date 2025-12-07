import { WorkflowBase } from "#libs/workflows/workflow-base.js";
import { GetTariffBoxPendingStep, GetTariffBoxSaveDBStep, GetTariffBoxSendToSheet, GetTariffBoxUnknownStep } from "./steps.js";

export enum GetTariffBoxStepEnum {
    PENDING = "pending",
    SAVE_DB = "saveDB",
    SEND_TO_SHEET = "sendToSheet",
}

export type TypesGetTariffBoxWorkflowSteps = GetTariffBoxPendingStep | GetTariffBoxSaveDBStep | GetTariffBoxSendToSheet | GetTariffBoxUnknownStep;

export class GetTariffBoxWorkflow extends WorkflowBase {
    public state: TypesGetTariffBoxWorkflowSteps;
    constructor(state: GetTariffBoxStepEnum) {
        super();
        this.state = this.setState(state); //!! assignment for the sake of type safety
    }

    public setState(state: GetTariffBoxStepEnum): TypesGetTariffBoxWorkflowSteps {
        switch (state) {
            case GetTariffBoxStepEnum.PENDING:
                this.state = new GetTariffBoxPendingStep();
                this.state.setContext(this);
                break;
            case GetTariffBoxStepEnum.SAVE_DB:
                this.state = new GetTariffBoxSaveDBStep();
                this.state.setContext(this);
                break;
            case GetTariffBoxStepEnum.SEND_TO_SHEET:
                this.state = new GetTariffBoxSendToSheet();
                this.state.setContext(this);
                break;
            default:
                this.state = new GetTariffBoxUnknownStep();
                this.state.setContext(this);
                break;
        }
        return this.state;
    }
}
