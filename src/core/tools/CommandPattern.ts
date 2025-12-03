// [LUMEN STRATEGY] Design Pattern Implementation
export interface ICommand {
    execute(): void;
    undo(): void;
}

export class CommandHistory {
    private undoStack: ICommand[] = [];
    private redoStack: ICommand[] = [];
    private static readonly LIMIT = 50;

    public execute(command: ICommand): void {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = []; // Clear redo stack on new action

        if (this.undoStack.length > CommandHistory.LIMIT) {
            this.undoStack.shift();
        }
    }

    public undo(): void {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    public redo(): void {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }

    public get canUndo(): boolean { return this.undoStack.length > 0; }
    public get canRedo(): boolean { return this.redoStack.length > 0; }
}
