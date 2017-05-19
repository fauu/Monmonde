// tslint:disable:no-invalid-this
import * as Leaflet from "leaflet";
import * as MBTiles from "mbtiles-offline";

const base64Prefix = "data:image/png;base64,";
const bufferTiles = 1;

export const WorldMapTileLayer = Leaflet.TileLayer.extend({
  edgeBufferTiles: bufferTiles,
  mbtiles: undefined,
  options: {
    maxZoom: 7,
    minZoom: 4,
  },

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
  },

  getTileUrl(tilePoint: any, tile: any) {
    const coords = [tilePoint.x, Math.pow(2, tilePoint.z) - tilePoint.y - 1, tilePoint.z];

    this.mbtiles.findOne(coords)
      .then((image: Uint8Array) => {
        tile.src = `${base64Prefix}${btoa(String.fromCharCode.apply(null, image))}`;
      });
  },
});
