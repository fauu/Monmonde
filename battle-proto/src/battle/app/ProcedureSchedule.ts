interface ScheduledProcedure {
  framesRemaining: number;
  run: () => void;
}

export class ProcedureSchedule {
  private procedures: ScheduledProcedure[] = [];

  public schedule(framesFromNow: number, run: () => void): void {
    this.procedures.push({ framesRemaining: framesFromNow, run });
  }

  public update(): void {
    this.procedures = this.procedures.filter((proc) => {
      proc.framesRemaining--;
      const ready = proc.framesRemaining === 0;
      if (ready) {
        proc.run();
      }
      return !ready;
    });
  }
}
