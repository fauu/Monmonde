import * as Leaflet from "leaflet";
import * as MBTiles from "mbtiles-offline";
import * as path from "path";
import { WorldMapTileLayer } from "./WorldMapTileLayer";

export class WorldMap {

  private static readonly mbtilesPath = "../../assets/world-map.mbtiles";

  private mbtiles: MBTiles;

  public init(host: HTMLElement) {
    const mbtilesPath = path.resolve(__dirname, WorldMap.mbtilesPath);

    this.mbtiles = new MBTiles(mbtilesPath);

    const mbtilesLayer = new WorldMapTileLayer(this.mbtiles);

    const map = Leaflet.map(host, { zoomControl: false, attributionControl: false });
    mbtilesLayer.addTo(map);

    this.locationMarker([52.237049, 21.017532], "Warsaw").addTo(map);

    setTimeout(() => map.setView([52.237049, 21.017532], 7), 500);
  }

  private locationMarker(latlng: [number, number], name: string) {
    const divicon = Leaflet.divIcon({iconSize: undefined, html: name});

    return Leaflet.marker(latlng, {icon: divicon});
  }

}
