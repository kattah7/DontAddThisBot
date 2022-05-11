"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableTimeout = void 0;
/**
 * A wrapper around <code>setTimeout()</code> and <code>clearTimeout()</code>
 * that allows the timer to be edited to complete earlier or later,
 * relative to its original start time.
 */
class EditableTimeout {
    callback;
    startTime;
    runTime;
    runningTimeout;
    completed = false;
    constructor(callback, runTime) {
        this.callback = callback;
        this.startTime = Date.now();
        /**
         * Time in milliseconds of when <code>callback</code> should be invoked,
         * relative to {@link startTime}.
         */
        this.runTime = runTime;
        this.updateTimer();
    }
    stop() {
        if (this.runningTimeout == null) {
            // no stop was performed
            return false;
        }
        else {
            clearTimeout(this.runningTimeout);
            return true;
        }
    }
    update(newRunTime) {
        if (this.completed) {
            return;
        }
        this.runTime = newRunTime;
        this.updateTimer();
    }
    updateTimer() {
        this.stop();
        // calculate time the new setTimeout needs to run
        let timeRemaining;
        if (this.runningTimeout == null) {
            // this is the first invocation by the constructor
            timeRemaining = this.runTime;
        }
        else {
            const currentTime = Date.now();
            const alreadyPassed = currentTime - this.startTime;
            timeRemaining = this.runTime - alreadyPassed;
        }
        this.runningTimeout = setTimeout(this.invokeCallback.bind(this), timeRemaining);
    }
    invokeCallback() {
        this.completed = true;
        this.callback();
    }
}
exports.EditableTimeout = EditableTimeout;
//# sourceMappingURL=editable-timeout.js.map