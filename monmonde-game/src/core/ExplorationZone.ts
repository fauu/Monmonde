import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Location } from "./Location";
import { MonmondeEntity } from "./MonmondeEntity";

export interface IExplorationZoneData {
  name: string;
}

@Entity()
export class ExplorationZone extends MonmondeEntity<IExplorationZoneData> implements IExplorationZoneData {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column("string")
  public name: string;

  @OneToOne((type) => Location, (location) => location.explorationZone)
  public location: Location;

  public constructor(data?: IExplorationZoneData) {
    super(data);
  }

}
