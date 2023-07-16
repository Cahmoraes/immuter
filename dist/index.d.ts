type Produce<TBaseState> = (draftState: TBaseState) => void;
declare class Immuter {
    private static config;
    static get not(): {
        freeze: {
            clone: typeof Immuter.clone;
            produce: typeof Immuter.produce;
        };
    };
    private static setFreeze;
    static clone<TBaseState extends object>(aBaseState: TBaseState): TBaseState;
    private static execute;
    private static freezeIfNecessary;
    private static resetConfig;
    static produce<TBaseState extends object>(aBaseState: TBaseState, produce: Produce<TBaseState>): TBaseState;
}

export { Immuter };
