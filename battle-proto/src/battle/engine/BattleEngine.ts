import { Battle, BattleMon, BattleMove, OngoingAction } from "~/battle/engine";
import { Move, Species } from "~/core";
import moveData from "~/data/moves.json";
import speciesData from "~/data/species.json";

interface ActionCommand {
  action: Move;
}

interface MonEvent {
  monIdx: number;
}

interface ActionCastStartedEvent extends MonEvent {
  type: "ActionCastStarted";
  actionName: string;
}

interface ActionCastProgressedEvent extends MonEvent {
  type: "ActionCastProgressed";
  newCastTimeElapsedPercent: number;
}

interface ActionCastEndedEvent extends MonEvent {
  type: "ActionCastEnded";
}

interface HpChangedEvent extends MonEvent {
  type: "HpChanged";
  newHpPercent: number;
}

interface EnergyChangedEvent extends MonEvent {
  type: "EnergyChanged";
  newEnergyPercent: number;
}

interface DamageTakenEvent extends MonEvent {
  type: "DamageTaken";
}

export type BattleEvent =
  | ActionCastStartedEvent
  | ActionCastProgressedEvent
  | ActionCastEndedEvent
  | DamageTakenEvent
  | EnergyChangedEvent
  | HpChangedEvent;

const HP_BASE_REGEN_PER_TICK = 0.2;
const ENERGY_BASE_REGEN_PER_TICK = 0.15;

type PlayerMonMovesChangeHandler = (moves: BattleMove[]) => void;
type PlayerMonCastingStateChange = (casting: boolean) => void;

interface BattleEngineParams {
  onPlayerMonMovesChange: PlayerMonMovesChangeHandler;
  onPlayerMonCastingStateChange: PlayerMonCastingStateChange;
}

export class BattleEngine {
  public static readonly TICKRATE = 12;

  public battle: Battle;

  private _actionCommand?: ActionCommand;
  private _tickNo: number;
  private _onPlayerMonMovesChange: PlayerMonMovesChangeHandler;
  private _onPlayerMonCastingStateChange: PlayerMonCastingStateChange;

  constructor({ onPlayerMonMovesChange, onPlayerMonCastingStateChange }: BattleEngineParams) {
    const species = speciesData.data.map((el) => new Species(el));
    console.log(species);

    const moves = Move.dictFromParamsArr(moveData.data);

    this.battle = new Battle({
      mons: [
        new BattleMon({
          label: "Charizard",
          hp: 135,
          hpMax: 170,
          energy: 30,
          moves: [moves["Fire Fang"], moves["Air Slash"], moves["Inferno"]].map(
            (m) =>
              ({
                move: m,
                available: false,
              } as BattleMove)
          ),
        }),
        new BattleMon({
          label: "Nidoking",
          hp: 120,
          hpMax: 200,
          energy: 80,
          moves: [moves["Spike Attack"], moves["Poison Sting"], moves["Megaspike"]].map(
            (m) =>
              ({
                move: m,
                available: false,
              } as BattleMove)
          ),
        }),
      ],
    });
    this._tickNo = -1;
    this._onPlayerMonMovesChange = onPlayerMonMovesChange;
    this._onPlayerMonCastingStateChange = onPlayerMonCastingStateChange;

    onPlayerMonMovesChange(this.battle.playerMon.moves);
    onPlayerMonCastingStateChange(false);
  }

  public handleTick(): BattleEvent[] {
    this._tickNo++;

    if (this._tickNo === 0) this._onPlayerMonMovesChange(this.battle.playerMon.moves);

    const eventsToReport: BattleEvent[] = [];

    if (this._actionCommand) {
      const action = this._actionCommand.action;
      if (this.battle.playerMon.tryInitAction(action)) {
        eventsToReport.push({
          type: "ActionCastStarted",
          monIdx: 0,
          actionName: action.name,
        });
        this._onPlayerMonCastingStateChange(true);
      }
      this._actionCommand = undefined;

      // DEV
      // if (this.battle.mons[1].tryInitAction(moves["Megahorn"])) {
      //   eventsToReport.push({
      //     type: "ActionCastStarted",
      //     monIdx: 1,
      //     actionName: "Megahorn"
      //   });
      // }
    }

    this.battle.mons.forEach((mon, monIdx) => {
      mon.modifyHpDirty(HP_BASE_REGEN_PER_TICK * mon.hpBaseRegenFactor);
      mon.modifyEnergyDirty(ENERGY_BASE_REGEN_PER_TICK);

      if (mon.ongoingAction) {
        eventsToReport.push(...this.handleTickOngoingAction(mon.ongoingAction, monIdx));
      }

      const commitEnergyChangesResult = mon.commitEnergyChanges();
      if (commitEnergyChangesResult !== "NothingChanged") {
        eventsToReport.push({
          type: "EnergyChanged",
          monIdx,
          newEnergyPercent: mon.energyPercent,
        });

        if (
          mon === this.battle.playerMon &&
          commitEnergyChangesResult === "EnergyAndMovesChanged"
        ) {
          this._onPlayerMonMovesChange(mon.moves);
        }
      }
      if (mon.commitHpChanges()) {
        eventsToReport.push({
          type: "HpChanged",
          monIdx,
          newHpPercent: mon.hpPercent,
        });
      }
    });

    return eventsToReport;
  }

  public handleActionKey(keyIdx: number): void {
    const moveIdx = keyIdx;
    if (moveIdx >= this.battle.mons[0].moves.length) return;
    this._actionCommand = { action: this.battle.mons[0].moves[moveIdx].move };
  }

  private handleTickOngoingAction(ongoingAction: OngoingAction, monIdx: number): BattleEvent[] {
    const eventsToReport: BattleEvent[] = [];

    if (ongoingAction.justStarted) {
      ongoingAction.justStarted = false;
      return eventsToReport;
    }

    const mon = this.battle.mons[monIdx];
    const otherMonIdx = (monIdx + 1) % 2;
    const otherMon = this.battle.mons[otherMonIdx];

    const progressTimeMsec = 1000 / BattleEngine.TICKRATE;
    const completed = mon.progressOngoingAction(progressTimeMsec);

    eventsToReport.push({
      type: "ActionCastProgressed",
      monIdx,
      newCastTimeElapsedPercent: ongoingAction.completedPercent,
    });

    if (completed) {
      mon.ongoingAction = undefined;
      eventsToReport.push({ type: "ActionCastEnded", monIdx });
      this._onPlayerMonCastingStateChange(false);

      const move = ongoingAction.action;
      if (move) {
        const dmg = move.power / 3;
        otherMon.modifyHpDirty(-dmg);
        eventsToReport.push({
          type: "DamageTaken",
          monIdx: otherMonIdx,
        });
      }
    }

    return eventsToReport;
  }
}
