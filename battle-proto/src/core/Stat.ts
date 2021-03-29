import { StatType, StatTypes } from "~/core";

export interface StaticStatParams {
  typeName: string;
  value: number;
}

export class StaticStat {
  public type: StatType;
  public value: number;

  constructor({ typeName, value }: StaticStatParams) {
    this.type = StatTypes[typeName];
    this.value = value;
  }

  public static dictFromParamsArr(paramsArr: StaticStatParams[]): StatDict {
    return paramsArr.reduce((dict, el, _) => {
      const stat = new StaticStat({ typeName: el.typeName, value: el.value });
      dict[el.typeName] = stat;
      return dict;
    }, {});
  }
}

export type StatDict = { [statTypeName: string]: StaticStat };
