import { Move } from "~/core";

export class OngoingAction {
  public timeElapsed: number;
  public justStarted: boolean;

  private _action: Move;

  constructor(action: Move) {
    this.timeElapsed = 0;
    this.justStarted = true;
    this._action = action;
  }

  public progress(msecs: number): boolean {
    this.timeElapsed += msecs;
    return Math.fround(this.timeElapsed) >= this._action.castTime;
  }

  get action(): Move {
    return this._action;
  }

  get completedPercent(): number {
    return this.timeElapsed / this._action.castTime;
  }
}
