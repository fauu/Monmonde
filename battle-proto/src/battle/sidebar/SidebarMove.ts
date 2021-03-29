import { Move } from "~/core";

export interface SidebarMove {
  move: Move;
  kbdKey: string;
  available: boolean;
}
