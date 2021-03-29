import { StatDict, StaticStatParams } from "~/core";

import { StaticStat } from "./Stat";

export interface MoveParams {
  name: string;
  cost: number;
  castTime: number;
  power: number;
  accuracy: number;
  requirements: StaticStatParams[];
}

export class Move {
  public readonly name: string;
  public readonly cost: number;
  public readonly castTime: number;
  public readonly power: number;
  public readonly accuracy: number;
  public readonly requirements: StatDict;

  constructor({ name, cost, castTime, power, accuracy, requirements }: MoveParams) {
    this.name = name;
    this.cost = cost;
    this.castTime = castTime;
    this.power = power;
    this.accuracy = accuracy;
    this.requirements = StaticStat.dictFromParamsArr(requirements);
  }

  public static dictFromParamsArr(paramsArr: MoveParams[]): MoveDict {
    return paramsArr.reduce((dict, el, _) => {
      const statType = new Move(el);
      dict[el.name] = statType;
      return dict;
    }, {});
  }
}

export type MoveDict = { [moveName: string]: Move };
