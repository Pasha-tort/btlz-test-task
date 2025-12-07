import { WorkflowBase } from "./workflow-base.js";

export abstract class WorkflowsStepBase {
    public workflow?: WorkflowBase;
    public abstract handle(...args: unknown[]): Promise<void> | void;

    public setContext(workflow: WorkflowBase) {
        this.workflow = workflow;
    }
}
