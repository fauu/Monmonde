import { BattleMove, OngoingAction } from "~/battle/engine";
import { Move } from "~/core";

interface BattleMonParams {
  label: string;
  hp: number;
  hpMax: number;
  energy: number;
  moves: BattleMove[];
  ongoingAction?: OngoingAction;
}

export type BattleMonCommitEnergyChangesResult =
  | "NothingChanged"
  | "EnergyChanged"
  | "EnergyAndMovesChanged";

export class BattleMon {
  public energy: number;
  public ongoingAction?: OngoingAction;

  private _label: string;
  private _hp: number;
  private _hpMax: number;
  private _moves: BattleMove[];
  private _tickHpDelta: number;
  private _tickEnergyDelta: number;

  constructor({ label, hp, hpMax, energy, moves }: BattleMonParams) {
    this._label = label;
    this._hp = hp;
    this._hpMax = hpMax;
    this.energy = energy;
    this._moves = moves;
    this._tickHpDelta = 0;
    this._tickEnergyDelta = 0;
  }

  public modifyHpDirty(delta: number): void {
    this._tickHpDelta += delta;
  }

  public modifyEnergyDirty(delta: number): void {
    this._tickEnergyDelta += delta;
  }

  public commitHpChanges(): boolean {
    const oldHp = this._hp;
    this._hp += this._tickHpDelta;
    if (this._hp < 0) {
      this._hp = 0;
    } else if (this._hp > this._hpMax) {
      this._hp = this._hpMax;
    }

    this._tickHpDelta = 0;

    const realDelta = this._hp - oldHp;
    return realDelta !== 0;
  }

  public commitEnergyChanges(): BattleMonCommitEnergyChangesResult {
    const oldEnergy = this.energy;
    this.energy += this._tickEnergyDelta;
    if (this.energy < 0) {
      this.energy = 0;
    } else if (this.energy > 100) {
      this.energy = 100;
    }

    this._tickEnergyDelta = 0;

    const movesHaveChanged = this.updateMovesAvailability();
    const realDelta = this.energy - oldEnergy;

    let result: BattleMonCommitEnergyChangesResult = "NothingChanged";
    if (realDelta !== 0) {
      if (movesHaveChanged) result = "EnergyAndMovesChanged";
      else result = "EnergyChanged";
    }
    return result;
  }

  public tryInitAction(action: Move): boolean {
    if (this.ongoingAction || this.energy < action.cost) return false;
    this.ongoingAction = new OngoingAction(action);
    return true;
  }

  public progressOngoingAction(msecs: number): boolean {
    if (!this.ongoingAction) return false;

    const prevCompletedPercent = this.ongoingAction.completedPercent;
    const finished = this.ongoingAction.progress(msecs);
    const energyConsumedThisTick =
      this.ongoingAction.completedPercent *
        this.ongoingAction.completedPercent *
        this.ongoingAction.action.cost -
      prevCompletedPercent * prevCompletedPercent * this.ongoingAction.action.cost;
    this._tickEnergyDelta -= energyConsumedThisTick;

    return finished;
  }

  private updateMovesAvailability(): boolean {
    let anyChanged = false;
    this._moves.forEach((battleMove) => {
      const prevAvailable = battleMove.available;
      battleMove.available = battleMove.move.cost <= this.energy;
      if (battleMove.available !== prevAvailable) anyChanged = true;
    });
    return anyChanged;
  }

  get label(): string {
    return this._label;
  }

  get hp(): number {
    return this._hp;
  }

  get hpMax(): number {
    return this._hpMax;
  }

  get moves(): BattleMove[] {
    return this._moves;
  }

  get hpPercent(): number {
    return this._hp / this._hpMax;
  }

  get energyPercent(): number {
    return this.energy / 100;
  }

  get hpBaseRegenFactor(): number {
    return 1 - 1 / (1 + 32 * Math.pow(this.energyPercent, 5));
  }
}
