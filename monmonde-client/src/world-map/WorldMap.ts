import * as Leaflet from "leaflet";
import * as MBTiles from "mbtiles-offline";
import * as path from "path";
import { Location } from "../Location";
import { WorldMapTileLayer } from "./WorldMapTileLayer";
// tslint:disable-next-line:no-var-requires
require("leaflet-edgebuffer");

export class WorldMap {

  private static readonly setViewDelayMs = 2000;
  private static readonly mbtilesPath = "../../assets/world-map.mbtiles";

  private map: Leaflet.Map;
  private mbtiles: MBTiles;

  public init(host: HTMLElement, viewCenterCoords: [number, number]) {
    const mbtilesPath = path.resolve(__dirname, WorldMap.mbtilesPath);

    this.mbtiles = new MBTiles(mbtilesPath);

    const mbtilesLayer = new WorldMapTileLayer(this.mbtiles);

    this.map = Leaflet.map(host, { zoomControl: false, attributionControl: false });
    mbtilesLayer.addTo(this.map);

    setTimeout(() => this.map.setView(viewCenterCoords, 7), WorldMap.setViewDelayMs);
  }

  public addLocationMarkers(locations: Location[], playerLocation: Location) {
    for (const location of locations) {
      const coords: [number, number] = [location.latitude, location.longitude];
      const name = `${location.settlement.name}`;

      this.makeLocationMarker(coords, name, location === playerLocation).addTo(this.map);
    }
  }

  private makeLocationMarker(latlng: [number, number], name: string, isPlayerLocation: boolean) {
    const markerIcon = Leaflet.divIcon({
      className: "world-map__location-marker",
      iconAnchor: [3, 0],
      iconSize: undefined,
    });

    const marker =  Leaflet.marker(latlng, { icon: markerIcon });
    let labelHtml = name;
    if (isPlayerLocation) {
      labelHtml = `<i class="mdi mdi-map-marker world-map__location-label-current-location-icon"></i> ${labelHtml}`;
    }
    marker.bindTooltip(labelHtml, {
      className: "world-map__location-label",
      direction: "center",
      interactive: !isPlayerLocation,
      offset: [0, 20],
      permanent: true,
    }).openTooltip();

    return marker;
  }

}
