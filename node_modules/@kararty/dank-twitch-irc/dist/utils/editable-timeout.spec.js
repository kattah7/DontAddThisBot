"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const editable_timeout_1 = require("./editable-timeout");
describe("./utils/editable-timeout", function () {
    describe("EditableTimeout", function () {
        beforeEach(function () {
            // initialize the time to be 5000 milliseconds after
            // UTC epoch
            sinon.useFakeTimers(5000);
        });
        it("should capture run time and current time at creation", function () {
            // tslint:disable-next-line:no-empty
            const timeout = new editable_timeout_1.EditableTimeout(() => { }, 1234);
            chai_1.assert.strictEqual(timeout.startTime, 5000);
            chai_1.assert.strictEqual(timeout.runTime, 1234);
        });
        it("should run the callback after `runTime` if not edited", function () {
            let wasHit = false;
            const timeout = new editable_timeout_1.EditableTimeout(() => {
                wasHit = true;
            }, 1234);
            sinon.clock.tick(1233);
            chai_1.assert.isFalse(wasHit);
            chai_1.assert.isFalse(timeout.completed);
            sinon.clock.tick(1);
            chai_1.assert.isTrue(wasHit);
            chai_1.assert.isTrue(timeout.completed);
        });
        it("should be stoppable", function () {
            let wasHit = false;
            const timeout = new editable_timeout_1.EditableTimeout(() => {
                wasHit = true;
            }, 1234);
            sinon.clock.tick(1233);
            chai_1.assert.isFalse(wasHit);
            chai_1.assert.isFalse(timeout.completed);
            timeout.stop();
            sinon.clock.tick(1);
            chai_1.assert.isFalse(wasHit);
            chai_1.assert.isFalse(timeout.completed);
            sinon.clock.tick(1000000);
            chai_1.assert.isFalse(wasHit);
            chai_1.assert.isFalse(timeout.completed);
        });
        it("should do nothing if stop is called after timeout is completed", function () {
            let wasHit = false;
            const timeout = new editable_timeout_1.EditableTimeout(() => {
                wasHit = true;
            }, 1234);
            sinon.clock.tick(1234);
            chai_1.assert.isTrue(wasHit);
            chai_1.assert.isTrue(timeout.completed);
            timeout.stop();
            chai_1.assert.isTrue(wasHit);
            chai_1.assert.isTrue(timeout.completed);
        });
        it("should be possible to update the remaining run time", function () {
            let wasHit = false;
            const timeout = new editable_timeout_1.EditableTimeout(() => {
                wasHit = true;
            }, 2000);
            sinon.clock.tick(1000);
            chai_1.assert.isFalse(wasHit);
            chai_1.assert.isFalse(timeout.completed);
            timeout.update(1500);
            chai_1.assert.isFalse(wasHit);
            chai_1.assert.isFalse(timeout.completed);
            sinon.clock.tick(499);
            chai_1.assert.isFalse(wasHit);
            chai_1.assert.isFalse(timeout.completed);
            sinon.clock.tick(1);
            chai_1.assert.isTrue(wasHit);
            chai_1.assert.isTrue(timeout.completed);
        });
        it("should do nothing if update is called after timeout is completed", function () {
            let hitCount = 0;
            const timeout = new editable_timeout_1.EditableTimeout(() => {
                hitCount += 1;
            }, 1000);
            sinon.clock.tick(999);
            chai_1.assert.strictEqual(hitCount, 0);
            chai_1.assert.isFalse(timeout.completed);
            sinon.clock.tick(1);
            chai_1.assert.strictEqual(hitCount, 1);
            chai_1.assert.isTrue(timeout.completed);
            timeout.update(2000);
            chai_1.assert.strictEqual(hitCount, 1);
            chai_1.assert.isTrue(timeout.completed);
            sinon.clock.tick(1000);
            chai_1.assert.strictEqual(hitCount, 1);
            chai_1.assert.isTrue(timeout.completed);
        });
    });
});
//# sourceMappingURL=editable-timeout.spec.js.map