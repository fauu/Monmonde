import { mapObjectGfxDefinitions } from "./MapObjectGfxDefinitions";
import { TilemapLayer } from "./TilemapChunk";
import { PIXIResources } from "./Types";

export class ObjectDisplayLayer {

  private resources: PIXIResources;
  private realDisplaySize: [number, number];
  private displayTileSize: number;
  private objectScaling: number;
  private displacement: [number, number];

  private _container: PIXI.Container;
  public get container() {
    return this._container;
  }

  public constructor(
    resources: PIXIResources,
    realDisplaySize: [number, number],
    displayTileSize: number,
    objectScaling: number,
  ) {
    this.resources = resources;
    this.realDisplaySize = realDisplaySize;
    this._container = new PIXI.Container();
    this.displayTileSize = displayTileSize;
    this.objectScaling = objectScaling;
    this.displacement = [0, 0];
  }

  public setObjectLayer(objectLayer: TilemapLayer) {
    for (let y = 0; y < objectLayer.length; y++) {
      for (let x = 0; x < objectLayer.length; x++) {
        const objectGfxIdx = objectLayer[y][x];
        if (objectGfxIdx === -1) {
          continue;
        }

        const sprite = new PIXI.Sprite();
        sprite.setTransform(
          x * this.displayTileSize,
          y * this.displayTileSize,
          this.objectScaling,
          this.objectScaling,
        );
        sprite.anchor.set(0, 1);
        const spriteName = mapObjectGfxDefinitions[objectGfxIdx].name;
        sprite.texture = this.resources[spriteName].texture;

        this._container.addChild(sprite);
      }
    }
  }

  public setDisplayRect(displayRectStart: [number, number], realDisplayRectSize: [number, number]) {
    const realDisplayRectStart =
      [displayRectStart[0] * this.displayTileSize, displayRectStart[1] * this.displayTileSize];

    for (const displayObject of this._container.children) {
      displayObject.position.x -= realDisplayRectStart[0];
      displayObject.position.y -= realDisplayRectStart[1] - (1 * this.displayTileSize);

      // const shouldCull =
      //   displayObject.position.x < 0
      //   || displayObject.position.x > this.realDisplaySize[0]
      //   || displayObject.position.y < 0
      //   || displayObject.position.y > this.realDisplaySize[1]

      // displayObject.visible = !shouldCull;
    }
  }

  public translate(vector: [number, number]) {
    this.container.position.x += vector[0];
    this.container.position.y += vector[1];
  }

}
