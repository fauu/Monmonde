import { StatDict, StaticStat, StaticStatParams } from "~/core";

export interface SpeciesParams {
  name: string;
  stats: StaticStatParams[];
}

export class Species {
  public name: string;
  public stats: StatDict;

  constructor({ name, stats: statsParamsArr }: SpeciesParams) {
    this.name = name;
    this.stats = StaticStat.dictFromParamsArr(statsParamsArr);
  }
}
