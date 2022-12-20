import {
  Animation,
  MeshBuilder,
  DynamicTexture,
  StandardMaterial,
  ICanvasRenderingContext,
  Scene,
  Mesh
} from '@babylonjs/core'

import * as slot0 from '../../../public/images/slot0.png'
import * as slot1 from '../../../public/images/slot1.png'
import * as slot2 from '../../../public/images/slot2.png'
import * as slot3 from '../../../public/images/slot3.png'
import * as slot4 from '../../../public/images/slot4.png'
import * as slot5 from '../../../public/images/slot5.png'

export class Tile {
  // The type of tile to draw.
  type: number

  // Coordinates (row = x, column = y).
  row: number
  column: number

  // if its standing by or rolling.
  standBy: boolean

  // rendering properties.
  scene: Scene
  mesh: Mesh
  material: StandardMaterial

  // size of the texture where tiles are drawn.
  textureSize: TextureSize
  textureCanvas: DynamicTexture
  canvasContext: ICanvasRenderingContext

  // all images to draw.
  tileImages: TileImages

  // where to draw the images.
  tileCenterPosition: TileTransform

  // animations
  wheelAnimation: Animation
  standByAnimation: Animation

  // current animation
  currentAnimation: Animation
  currentAnimationLength: number
  currentAnimationDelay: number

  constructor(
    type: number,
    row: number,
    column: number,
    scene: Scene,
    standBy: boolean
  ) {
    this.type = type
    this.row = row
    this.column = column
    this.standBy = standBy
    this.scene = scene
    this.mesh = MeshBuilder.CreateCylinder('cylinder', {
      height: 0.25,
      diameter: 0.4,
      subdivisions: 5
    })
    this.material = new StandardMaterial('material')
    this.textureSize = {
      width: 1024,
      height: 512
    }
    this.textureCanvas = new DynamicTexture('dynamic texture', this.textureSize)
    this.canvasContext = this.textureCanvas.getContext()
    this.tileImages = {
      slot0: document.createElement('img'),
      slot1: document.createElement('img'),
      slot2: document.createElement('img'),
      slot3: document.createElement('img'),
      slot4: document.createElement('img'),
      slot5: document.createElement('img')
    }
    this.tileCenterPosition = {
      posX: -160,
      posY: 350,
      width: 300,
      height: 70,
      margin: 170
    }
    this.standByAnimation = new Animation(
      'standByAnimation',
      'rotation.x',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    this.wheelAnimation = new Animation(
      'wheelAnimation',
      'rotation.x',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    this.currentAnimation = standBy
      ? this.standByAnimation
      : this.wheelAnimation
    this.currentAnimationDelay = this.standBy ? 200 : this.column * 200
    this.currentAnimationLength = standBy ? 180 : 90

    // load image references
    this.setupTileImages()

    // set animations
    this.setWheelAnimation()
    this.setStandByAnimation()

    // draw tiles
    this.drawAllTilesToCanvas()
    this.setup()
  }

  // set the position of the mesh.
  public setMeshPosition(x: number, y: number, z: number) {
    this.mesh.position.x = x
    this.mesh.position.y = y
    this.mesh.position.z = z
  }

  // set the rotation of the mesh.
  public setMeshRotation(x: number, y: number, z: number) {
    this.mesh.rotation.x = x
    this.mesh.rotation.y = y
    this.mesh.rotation.z = z
  }

  // assign tile images
  setupTileImages() {
    this.tileImages.slot0.src = slot0
    this.tileImages.slot1.src = slot1
    this.tileImages.slot2.src = slot2
    this.tileImages.slot3.src = slot3
    this.tileImages.slot4.src = slot4
    this.tileImages.slot5.src = slot5
  }

  // Wheel animation
  setWheelAnimation() {
    this.wheelAnimation.setKeys([
      {
        frame: 0,
        value: 0
      },
      {
        frame: 30,
        value: -3 * Math.PI
      },
      {
        frame: 60,
        value: -5 * Math.PI
      },
      {
        frame: 80,
        value: -5.8 * Math.PI
      },
      {
        frame: 90,
        value: -6 * Math.PI
      }
    ])
  }

  // Stand by animation
  setStandByAnimation() {
    this.standByAnimation.setKeys([
      {
        frame: 0,
        value: 0
      },
      {
        frame: 60,
        value: -2 * Math.PI
      },
      {
        frame: 120,
        value: -4 * Math.PI
      },
      {
        frame: 180,
        value: -6 * Math.PI
      }
    ])
  }

  // setup material and animations
  setup() {
    // Texture and material setup
    this.material.diffuseTexture = this.textureCanvas
    this.mesh.material = this.material
    this.mesh.animations = []
    this.mesh.animations.push(this.currentAnimation)

    setTimeout(() => {
      this.scene.beginAnimation(this.mesh, 0, 180, this.standBy)
      this.drawAllTilesToCanvas()
    }, this.currentAnimationDelay)
  }

  // draw all tiles
  drawAllTilesToCanvas() {
    this.clearCanvas()

    // Calculate the next tile type index.
    // if its the last type, it goes back to 0.
    const nextTileImageIndex =
      this.type + 1 <= Object.keys(this.tileImages).length - 1
        ? this.type + 1
        : 0

    // we draw the next tile in the center
    this.drawTileToCanvas(
      this.tileImages[('slot' + nextTileImageIndex) as keyof TileImages],
      this.tileCenterPosition
    )

    // draw back from the next tile.
    let i =
      nextTileImageIndex - 1 >= 0
        ? nextTileImageIndex - 1
        : Object.keys(this.tileImages).length - 1

    let countMultiplier = 1

    while (i !== nextTileImageIndex) {
      // draw the tile
      this.drawTileToCanvas(this.tileImages[('slot' + i) as keyof TileImages], {
        posX: this.tileCenterPosition.posX,
        posY:
          this.tileCenterPosition.posY -
          this.tileCenterPosition.margin * countMultiplier,
        width: this.tileCenterPosition.width,
        height: this.tileCenterPosition.height,
        margin: this.tileCenterPosition.margin
      })
      // update the index count related to the type
      i = i - 1 >= 0 ? i - 1 : Object.keys(this.tileImages).length - 1
      // update the count (used to pad the images on the texture).
      countMultiplier++
    }
    this.textureCanvas.update()
  }

  // clear the canvas
  clearCanvas() {
    if (this.canvasContext) {
      this.canvasContext.fillStyle = 'white'
      this.canvasContext.fillRect(
        0,
        10,
        this.textureSize.width,
        this.textureSize.height - 20
      )
    }
  }

  // draw a given tile to the canvas
  drawTileToCanvas(image: HTMLImageElement, tileTransform: TileTransform) {
    if (this.canvasContext) {
      // this canvas manipulation is done to picture the images in the right angle
      this.canvasContext.save()
      this.canvasContext.translate(
        this.textureSize.width / 2,
        this.textureSize.height / 2
      )
      this.canvasContext.rotate((90 * Math.PI) / 180)
      this.canvasContext.scale(-1, 1)
      this.canvasContext.drawImage(
        image,
        tileTransform.posX,
        tileTransform.posY,
        tileTransform.width,
        tileTransform.height
      )
      this.canvasContext.restore()
    }
  }

  // destroy the mesh of this tile.
  destroy() {
    this.mesh.dispose()
  }
}
