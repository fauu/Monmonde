import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Location } from "./Location";
import { MonmondeEntity } from "./MonmondeEntity";

export interface ICountryData {
  code: string;
  name: string;
}

@Entity()
export class Country extends MonmondeEntity<ICountryData> implements ICountryData {

  @PrimaryColumn({ type: "string", length: 3 })
  public code: string;

  @Column("string")
  public name: string;

  @OneToMany((type) => Location, (location) => location.country)
  public locations: Location[];

  public constructor(data?: ICountryData) {
    super(data);
  }

}
