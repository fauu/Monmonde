import * as Leaflet from "leaflet";
import * as MBTiles from "mbtiles-offline";

const zoomLevel = 7;
const base64Prefix = "data:image/png;base64,";

// tslint:disable-next-line:variable-name
export const WorldMapTileLayer = Leaflet.TileLayer.extend({
  mbtiles: undefined,
  options: {
    maxZoom: zoomLevel,
    minZoom: zoomLevel,
  },
  size: undefined,

  createTile(coords: any, done: any) {
    const tile = document.createElement("img");

    Leaflet.DomEvent.on(tile, "load", (Leaflet as any).bind(this._tileOnLoad, this, done, tile));
    Leaflet.DomEvent.on(tile, "error", (Leaflet as any).bind(this._tileOnError, this, done, tile));

    if (this.options.crossOrigin) {
      tile.crossOrigin = "";
    }
    tile.alt = "";
    tile.setAttribute("role", "presentation");

    tile.src = this.getTileUrl(coords, tile);

    return tile;
  },

  initialize(mbtiles: MBTiles, options: any) {
    this.mbtiles = mbtiles;

    Leaflet.Util.setOptions(this, options);

    mbtiles.count()
      .then((count) => {
        this.size = Math.sqrt(count);
      });
  },

  getTileUrl(tilePoint: any, tile: any) {
    const coords = [tilePoint.x, this.size - tilePoint.y - 1, zoomLevel];

    this.mbtiles.findOne(coords)
      .then((image: Uint8Array) => {
        tile.src = `${base64Prefix}${btoa(String.fromCharCode.apply(null, image))}`;
      });
  },
});
