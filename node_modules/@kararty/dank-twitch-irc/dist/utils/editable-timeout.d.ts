/// <reference types="node" />
/**
 * A wrapper around <code>setTimeout()</code> and <code>clearTimeout()</code>
 * that allows the timer to be edited to complete earlier or later,
 * relative to its original start time.
 */
export declare class EditableTimeout {
    readonly callback: () => void;
    readonly startTime: number;
    runTime: number;
    runningTimeout: NodeJS.Timeout | undefined;
    completed: boolean;
    constructor(callback: () => void, runTime: number);
    stop(): boolean;
    update(newRunTime: number): void;
    private updateTimer;
    private invokeCallback;
}
//# sourceMappingURL=editable-timeout.d.ts.map