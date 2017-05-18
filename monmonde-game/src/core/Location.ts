import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Country } from "./Country";
import { ExplorationZone } from "./ExplorationZone";
import { MonmondeEntity } from "./MonmondeEntity";
import { Settlement } from "./Settlement";

export interface ILocationData {
  explorationZone?: ExplorationZone;
  latitude: number;
  longitude: number;
  country: Country;
  settlement: Settlement;
}

@Entity()
export class Location extends MonmondeEntity<ILocationData> implements ILocationData {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column("number")
  public latitude: number;

  @Column("number")
  public longitude: number;

  @ManyToOne((type) => Country, (country) => country.locations)
  public country: Country;

  @OneToOne(
    (type) => Settlement,
    (settlement) => settlement.location,
    { cascadeAll: true, nullable: false },
  )
  @JoinColumn()
  public settlement: Settlement;

  @OneToOne(
    (type) => ExplorationZone,
    (explorationZone) => explorationZone.location,
    { cascadeAll: true },
  )
  @JoinColumn()
  public explorationZone: ExplorationZone;

  public constructor(data?: ILocationData) {
    super(data);
  }

}
