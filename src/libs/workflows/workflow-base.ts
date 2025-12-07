import { WorkflowsStepBase } from "./workflows-step-base.js";

export abstract class WorkflowBase {
    public abstract state: WorkflowsStepBase;
    public getState() {
        return this.state;
    }

    public abstract setState(state: string): WorkflowsStepBase;
}
