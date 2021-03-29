export type StatTypeCategory = "Physical" | "Elemental";

interface StatTypeParams {
  name: string;
  category: StatTypeCategory;
}

export class StatType {
  public name: string;
  public category: StatTypeCategory;

  constructor({ name, category }: StatTypeParams) {
    this.name = name;
    this.category = category;
  }

  public static dictFromParamsArr(paramsArr: StatTypeParams[]): StatTypeDict {
    return paramsArr.reduce((dict, el, _) => {
      const statType = new StatType({ name: el.name, category: el.category });
      dict[el.name] = statType;
      return dict;
    }, {});
  }
}

export type StatTypeDict = { [statTypeName: string]: StatType };

const statTypesInit: StatTypeParams[] = [
  { name: "Biped", category: "Physical" },
  { name: "Quadruped", category: "Physical" },
  { name: "Tail", category: "Physical" },
  { name: "Arm", category: "Physical" },
  { name: "Claw", category: "Physical" },
  { name: "Pincer", category: "Physical" },
  { name: "Beak", category: "Physical" },
  { name: "Fang", category: "Physical" },
  { name: "Spike", category: "Physical" },
  { name: "Serpentine", category: "Physical" },
  { name: "Wing", category: "Physical" },
  { name: "Shell", category: "Physical" },
  { name: "Cut", category: "Physical" }, // Blade?
  { name: "Shadow", category: "Elemental" },
  { name: "Grass", category: "Elemental" },
  { name: "Flame", category: "Elemental" },
  { name: "Water", category: "Elemental" },
  { name: "Ice", category: "Elemental" },
  { name: "Lightning", category: "Elemental" },
  { name: "Toxin", category: "Elemental" },
  { name: "Mind", category: "Elemental" },
  { name: "Enchantment", category: "Elemental" },
  { name: "Sound", category: "Elemental" },
  { name: "Earth", category: "Elemental" },
  { name: "Cyberspace", category: "Elemental" }
];

export const StatTypes = StatType.dictFromParamsArr(statTypesInit);
