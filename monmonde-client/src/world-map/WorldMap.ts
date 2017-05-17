import * as Leaflet from "leaflet";
import * as MBTiles from "mbtiles-offline";
import * as path from "path";
import { Location } from "../Location";
import { WorldMapTileLayer } from "./WorldMapTileLayer";
// tslint:disable-next-line:no-var-requires
require("leaflet-edgebuffer");

export class WorldMap {

  private static readonly mbtilesPath = "../../assets/world-map.mbtiles";

  private map: Leaflet.Map;
  private mbtiles: MBTiles;

  public init(host: HTMLElement) {
    const mbtilesPath = path.resolve(__dirname, WorldMap.mbtilesPath);

    this.mbtiles = new MBTiles(mbtilesPath);

    const mbtilesLayer = new WorldMapTileLayer(this.mbtiles);

    this.map = Leaflet.map(host, { zoomControl: false, attributionControl: false });
    mbtilesLayer.addTo(this.map);

    setTimeout(() => this.map.setView([52.237049, 21.017532], 7), 2000);
  }

  public addLocationMarkers(locations: Location[]) {
    for (const location of locations) {
      const coords: [number, number] = [location.latitude, location.longitude];
      const name = `${location.settlement.name}`;

      this.makeLocationMarker(coords, name).addTo(this.map);
    }
  }

  private makeLocationMarker(latlng: [number, number], name: string) {
    const divicon = Leaflet.divIcon(
      {
        html: name,
        iconSize: undefined,
      },
    );

    return Leaflet.marker(latlng, {icon: divicon});
  }

}
