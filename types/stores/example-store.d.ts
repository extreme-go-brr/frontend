export declare const useCounterStore: import("pinia").StoreDefinition<"counter", {
    counter: number;
}, {
    doubleCount: (state: {
        counter: number;
    } & import("pinia").PiniaCustomStateProperties<{
        counter: number;
    }>) => number;
}, {
    increment(): void;
}>;
