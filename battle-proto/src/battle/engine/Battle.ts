import { BattleMon } from "~/battle/engine";

interface BattleParams {
  mons: BattleMon[];
}

export class Battle {
  public mons: BattleMon[];

  constructor({ mons }: BattleParams) {
    this.mons = mons;
  }

  get playerMon(): BattleMon {
    return this.mons[0];
  }
}
