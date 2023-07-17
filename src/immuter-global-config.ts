import { ImmuterConfig } from './immuter'

interface ImmuterGlobalConfigProps {
  setGlobalConfig(aBoolean: boolean): void
  setFreezeConfig(aBoolean: boolean): void
}

export class GlobalConfig {
  constructor(private ImmuterGlobalConfig: ImmuterGlobalConfigProps) {}

  public get not() {
    return {
      freeze: () => {
        this.ImmuterGlobalConfig.setGlobalConfig(true)
        this.ImmuterGlobalConfig.setFreezeConfig(false)
      },
    }
  }

  private freezeHandler() {
    this.ImmuterGlobalConfig.setGlobalConfig(true)
    this.ImmuterGlobalConfig.setFreezeConfig(false)
  }

  public freeze() {
    this.ImmuterGlobalConfig.setGlobalConfig(true)
    this.ImmuterGlobalConfig.setFreezeConfig(true)
  }
}
