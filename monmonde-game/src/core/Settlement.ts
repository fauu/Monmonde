import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Location } from "./Location";
import { MonmondeEntity } from "./MonmondeEntity";

export interface ISettlementData {
  name: string;
}

@Entity()
export class Settlement extends MonmondeEntity<ISettlementData> implements ISettlementData {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column("string")
  public name: string;

  @OneToOne((type) => Location, (location) => location.settlement)
  public location: Location;

  public constructor(data?: ISettlementData) {
    super(data);
  }

}
