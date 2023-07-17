interface ImmuterGlobalConfigProps {
    setGlobalConfig(aBoolean: boolean): void;
    setFreezeConfig(aBoolean: boolean): void;
}
declare class GlobalConfig {
    private ImmuterGlobalConfig;
    constructor(ImmuterGlobalConfig: ImmuterGlobalConfigProps);
    get not(): {
        freeze: () => void;
    };
    freeze(): void;
}

type Produce<TBaseState> = (draftState: TBaseState) => void;
declare class Immuter {
    private static config;
    private static setGlobalConfig;
    private static setFreezeConfig;
    private static globalImmuterConfig;
    static get global(): GlobalConfig;
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
    private static resetFreezeConfig;
    static produce<TBaseState extends object>(aBaseState: TBaseState, produce: Produce<TBaseState>): TBaseState;
}

export { Immuter };
