export declare type FunctionPropsOf<T extends object> = {
    [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K];
};
export declare type OverrideFunction<S, T extends Record<string, (...args: any) => any>, K extends keyof T> = (this: S, oldFn: T[K], ...args: Parameters<T[K]>) => ReturnType<T[K]>;
export declare function applyReplacement<S, T extends Record<string, any>, K extends keyof T>(self: S, target: T, key: K, newFn: OverrideFunction<S, T, K>): void;
export declare type OverrideFunctions<S, T extends Record<string, any>> = {
    [K in keyof T as T[K] extends (...args: any) => any ? K : never]?: OverrideFunction<S, T, K>;
};
export declare function applyReplacements<S, T extends Record<string, any>>(self: S, target: T, replacements: OverrideFunctions<S, T>): void;
//# sourceMappingURL=apply-function-replacements.d.ts.map