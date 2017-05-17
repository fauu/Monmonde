import { autorun, observable } from "mobx";
import { Repository } from "typeorm";

import { Country, ICountryData } from "./Country";
import { ExplorationZone, IExplorationZoneData } from "./ExplorationZone";
import { ILocationData, Location } from "./Location";
import { ISettlementData, Settlement } from "./Settlement";

export class GeographyStore {

  @observable.ref public locations: Location[] | undefined = undefined;
  public countries: Country[];

  private countryRepository: Repository<Country>;
  private locationRepository: Repository<Location>;

  public async init(
    countryRepository: Repository<Country>,
    locationRepository: Repository<Location>,
  ) {
    this.countryRepository = countryRepository;
    this.locationRepository = locationRepository;

    await this.seedDb();

    this.locations = await this.fetchLocations();
  }

  private async fetchLocations(): Promise<Location[]> {
    const locations = await this.locationRepository.createQueryBuilder("location")
      .innerJoinAndSelect("location.country", "country")
      .innerJoinAndSelect("location.settlement", "settlement")
      .leftJoinAndSelect("location.explorationZone", "explorationZone")
      .getMany();

    return locations;
  }

  private async seedDb() {
      const countryData: ICountryData[] = [
        { code: "POL", name: "Poland" },
        { code: "DEU", name: "Germany" },
        { code: "CZE", name: "Czechia" },
        { code: "LTU", name: "Lithuania" },
      ];
      const countries: Map<string, Country> = new Map();
      countryData.forEach((datum) => {
        countries.set(datum.code, new Country(datum));
      });
      await this.countryRepository.persist([...countries.values()]);

      const settlementData: ISettlementData[] = [
        { name: "Warsaw" },
        { name: "Zakopane" },
        { name: "Łeba" },
        { name: "Berlin" },
        { name: "Kraków" },
        { name: "Prague" },
        { name: "Kaunas" },
        { name: "Rathen" },
      ];
      const settlements: Map<string, Settlement> = new Map();
      settlementData.forEach((datum) => {
        settlements.set(datum.name, new Settlement(datum));
      });

      const explorationZoneData: IExplorationZoneData[] = [
        { name: "Kampinos Forest" },
        { name: "Polish Tatras" },
        { name: "Słowiński Park" },
        { name: "Wieliczka Salt Mine" },
        { name: "Kaunas Reservoir" },
        { name: "Bastei" },
      ];
      const explorationZones: Map<string, ExplorationZone> = new Map();
      explorationZoneData.forEach((datum) => {
        explorationZones.set(datum.name, new ExplorationZone(datum));
      });

      const locationData: ILocationData[] = [
        {
          country: countries.get("POL")!,
          explorationZone: explorationZones.get("Kampinos Forest")!,
          latitude: 52.2297,
          longitude: 21.0122,
          settlement: settlements.get("Warsaw")!,
        },
        {
          country: countries.get("POL")!,
          explorationZone: explorationZones.get("Polish Tatras")!,
          latitude: 49.2992,
          longitude: 19.9496,
          settlement: settlements.get("Zakopane")!,
        },
        {
          country: countries.get("POL")!,
          explorationZone: explorationZones.get("Słowiński Park")!,
          latitude: 54.7601,
          longitude: 17.5563,
          settlement: settlements.get("Łeba")!,
        },
        {
          country: countries.get("DEU")!,
          latitude: 52.5200,
          longitude: 13.4050,
          settlement: settlements.get("Berlin")!,
        },
        {
          country: countries.get("POL")!,
          explorationZone: explorationZones.get("Wieliczka Salt Mine")!,
          latitude: 50.0647,
          longitude: 19.9450,
          settlement: settlements.get("Kraków")!,
        },
        {
          country: countries.get("CZE")!,
          latitude: 50.0755,
          longitude: 14.4378,
          settlement: settlements.get("Prague")!,
        },
        {
          country: countries.get("LTU")!,
          explorationZone: explorationZones.get("Kaunas Reservoir")!,
          latitude: 54.8985,
          longitude: 23.9036,
          settlement: settlements.get("Kaunas")!,
        },
        {
          country: countries.get("DEU")!,
          explorationZone: explorationZones.get("Bastei")!,
          latitude: 50.9588,
          longitude: 14.0833,
          settlement: settlements.get("Rathen")!,
        },
      ];
      const locations: Location[] = [];
      locationData.forEach((data) => {
        locations.push(new Location(data));
      });
      await this.locationRepository.persist(locations);
  }

}
