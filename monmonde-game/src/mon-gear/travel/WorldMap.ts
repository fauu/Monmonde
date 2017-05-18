import * as classNames from "classnames";
import * as Leaflet from "leaflet";
import * as MBTiles from "mbtiles-offline";
import * as path from "path";
// tslint:disable-next-line:no-var-requires
require("leaflet-edgebuffer");

import { Location } from "../../core/Location";
import { WorldMapTileLayer } from "./WorldMapTileLayer";

export class WorldMap {

  private static readonly setViewDelayMs = 2000;
  private static readonly mbtilesPath = "../../../assets/world-map-new.mbtiles";

  private map: Leaflet.Map;
  private mbtiles: MBTiles;
  private onZoomEnd: () => any;
  private zoomLevel: number = 7;

  public constructor(onZoomEnd: () => any) {
    this.onZoomEnd = onZoomEnd;
  }

  public init(host: HTMLElement, viewCenterCoords: [number, number]) {
    const mbtilesPath = path.resolve(__dirname, WorldMap.mbtilesPath);

    this.mbtiles = new MBTiles(mbtilesPath);

    const mbtilesLayer = new WorldMapTileLayer(this.mbtiles);

    this.map = Leaflet.map(host, { zoomControl: false, attributionControl: false });
    mbtilesLayer.addTo(this.map);

    host.classList.add(`zoom-${this.zoomLevel}`);

    this.map.on("zoomend", () => {
      const newZoomLevel = this.map.getZoom();
      host.classList.remove(`zoom-${this.zoomLevel}`);
      this.zoomLevel = newZoomLevel;
      host.classList.add(`zoom-${this.zoomLevel}`);

      this.onZoomEnd();
    });

    setTimeout(() => this.map.setView(viewCenterCoords, this.zoomLevel), WorldMap.setViewDelayMs);
  }

  public zoomIn() {
    this.map.zoomIn();
  }

  public zoomOut() {
    this.map.zoomOut();
  }

  public isMaxZoomed(): boolean {
    return this.map.getZoom() === this.map.getMaxZoom();
  }

  public isMinZoomed(): boolean {
    return this.map.getZoom() === this.map.getMinZoom();
  }

  public addLocationMarkers(locations: Location[], playerLocation: Location) {
    for (const location of locations) {
      const coords: [number, number] = [location.latitude, location.longitude];
      const name = `${location.settlement.name}`;

      this.makeLocationMarker(coords, location, location === playerLocation).addTo(this.map);
    }
  }

  private makeLocationMarker(latlng: [number, number], location: Location, isPlayerLocation: boolean) {
    const markerIcon = Leaflet.divIcon({
      className: "world-map__location-marker",
      iconAnchor: [3, 0],
      iconSize: undefined,
    });

    const marker =  Leaflet.marker(latlng, { icon: markerIcon });
    let labelHtml = location.settlement.name;
    if (location.explorationZone) {
      labelHtml = `
        ${labelHtml}
        <span class="world-map__location-label-exploration-zone-name">${location.explorationZone.name}</span>
      `;
    }
    if (isPlayerLocation) {
      labelHtml = `
        <i class="mdi mdi-map-marker world-map__location-label-current-location-icon"></i>
        ${labelHtml}
      `;
    }
    const labelClassName = classNames({
      "world-map__location-label": true,
      "world-map__location-label--with-exploration-zone": location.explorationZone !== undefined,
    });
    marker.bindTooltip(labelHtml, {
      className: labelClassName,
      direction: "center",
      interactive: !isPlayerLocation,
      offset: [0, 18],
      permanent: true,
    }).openTooltip();

    return marker;
  }

}
