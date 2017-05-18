import { Location } from "./Location";
import { MonmondeEntity } from "./MonmondeEntity";

export interface IPlayerData {
  location: Location;
}

export class Player extends MonmondeEntity<IPlayerData> implements IPlayerData {

  public location: Location;

  public constructor(data?: IPlayerData) {
    super(data);
  }

}
