type Producer<TBaseState> = (draftState: TBaseState) => void;
declare class Immuter {
    private readonly config;
    private static globalImmuterInstance;
    private constructor();
    static get global(): {
        not: {
            freeze: () => void;
        };
        freeze: () => void;
    };
    static get not(): {
        freeze: Immuter;
    };
    static produce<TBaseState extends object>(aBaseState: TBaseState, aProducer: Producer<TBaseState>): TBaseState;
    static clone<TBaseState extends object>(aBaseState: TBaseState): TBaseState;
    clone<TBaseState extends object>(aBaseState: TBaseState): TBaseState;
    private execute;
    private freezeIfNecessary;
    produce<TBaseState extends object>(aBaseState: TBaseState, produce: Producer<TBaseState>): TBaseState;
}

export { Immuter };
