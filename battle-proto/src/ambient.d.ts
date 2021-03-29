/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import { Container } from "@pixi/display";

declare module "@pixi/display" {
  interface Container {
    getChild<T extends Container>(name: string): T | undefined;
  }
}
