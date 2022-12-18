import {
  Animation,
  MeshBuilder,
  DynamicTexture,
  StandardMaterial,
  ICanvasRenderingContext,
  Scene,
  Mesh
} from '@babylonjs/core'
import { textChangeRangeIsUnchanged } from 'typescript'

import * as slot0 from '../../../public/images/slot0.png'
import * as slot1 from '../../../public/images/slot1.png'
import * as slot2 from '../../../public/images/slot2.png'
import * as slot3 from '../../../public/images/slot3.png'
import * as slot4 from '../../../public/images/slot4.png'
import * as slot5 from '../../../public/images/slot5.png'

type TileImages = {
  slot0: HTMLImageElement
  slot1: HTMLImageElement
  slot2: HTMLImageElement
  slot3: HTMLImageElement
  slot4: HTMLImageElement
  slot5: HTMLImageElement
}

type TextureSize = {
  width: number
  height: number
}

type TileTransform = {
  posX: number
  posY: number
  width: number
  height: number
  margin: number
}

export class Tile {
  id: number
  type: number
  mesh: Mesh
  material: StandardMaterial
  size: number
  scene: Scene
  row: number
  column: number
  tileImages: TileImages
  wheelSpeed: number
  textureSize: TextureSize
  textureCanvas: DynamicTexture
  canvasContext: ICanvasRenderingContext
  selectedTileImage: HTMLImageElement
  previousTileImage: HTMLImageElement
  nextTileImage: HTMLImageElement
  tileCenterPosition: TileTransform
  wheelAnimation: Animation
  standByAnimation: Animation
  standBy: boolean
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
    this.id = 0
    this.size = 0
    this.row = row
    this.column = column
    this.type = type
    this.mesh = MeshBuilder.CreateCylinder('cylinder', {
      height: 0.25,
      diameter: 0.4,
      subdivisions: 5
    })
    this.material = new StandardMaterial('material')
    this.wheelSpeed = 0.5
    this.textureSize = {
      width: 1024,
      height: 512
    }
    this.textureCanvas = new DynamicTexture('dynamic texture', this.textureSize)
    this.canvasContext = this.textureCanvas.getContext()
    this.scene = scene
    this.selectedTileImage = document.createElement('img')
    this.previousTileImage = document.createElement('img')
    this.nextTileImage = document.createElement('img')
    this.standBy = standBy
    this.tileImages = {
      slot0: document.createElement('img'),
      slot1: document.createElement('img'),
      slot2: document.createElement('img'),
      slot3: document.createElement('img'),
      slot4: document.createElement('img'),
      slot5: document.createElement('img')
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

    this.tileCenterPosition = {
      posX: -160,
      posY: 350,
      width: 300,
      height: 70,
      margin: 170
    }

    this.currentAnimation = standBy
      ? this.standByAnimation
      : this.wheelAnimation
    this.currentAnimationDelay = this.standBy ? 200 : this.column * 200
    this.currentAnimationLength = standBy ? 180 : 90

    // load image references
    this.setupTileImages()
    this.setup()
  }

  public setMeshPosition(x: number, y: number, z: number) {
    this.mesh.position.x = x
    this.mesh.position.y = y
    this.mesh.position.z = z
  }

  public setMeshRotation(x: number, y: number, z: number) {
    this.mesh.rotation.x = x
    this.mesh.rotation.y = y
    this.mesh.rotation.z = z
  }

  getSlotImg(image: string): HTMLImageElement {
    const tmpImage: HTMLImageElement = new Image(235, 155)
    tmpImage.src = image
    return tmpImage
  }

  setupTileImages() {
    this.tileImages.slot0 = this.getSlotImg(slot0)
    this.tileImages.slot1 = this.getSlotImg(slot1)
    this.tileImages.slot2 = this.getSlotImg(slot2)
    this.tileImages.slot3 = this.getSlotImg(slot3)
    this.tileImages.slot4 = this.getSlotImg(slot4)
    this.tileImages.slot5 = this.getSlotImg(slot5)
    this.updateTileImages()
  }

  updateTileImages() {
    const previousTileIndex =
      this.type - 1 >= 0
        ? this.type - 1
        : Object.keys(this.tileImages).length - 1
    const nextTileImageIndex =
      this.type + 1 <= Object.keys(this.tileImages).length - 1
        ? this.type + 1
        : 0

    this.previousTileImage =
      this.tileImages[('slot' + previousTileIndex) as keyof TileImages]
    this.selectedTileImage =
      this.tileImages[('slot' + this.type) as keyof TileImages]
    this.nextTileImage =
      this.tileImages[('slot' + nextTileImageIndex) as keyof TileImages]

    // draw the tile on a timeout to wait for the images to be loaded.
    this.drawAllTilesToCanvas()
  }

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

  setup() {
    // Texture and material setup
    this.material.diffuseTexture = this.textureCanvas
    this.mesh.material = this.material
    this.setWheelAnimation()
    this.setStandByAnimation()
    this.mesh.animations = []
    this.mesh.animations.push(this.currentAnimation)

    setTimeout(() => {
      this.scene.beginAnimation(this.mesh, 0, 180, this.standBy)
      this.drawAllTilesToCanvas()
    }, this.currentAnimationDelay)
  }

  drawAllTilesToCanvas() {
    this.clearCanvas()
    const nextTileImageIndex =
      this.type + 1 <= Object.keys(this.tileImages).length - 1
        ? this.type + 1
        : 0
    this.drawTileToCanvas(
      this.tileImages[('slot' + nextTileImageIndex) as keyof TileImages],
      this.tileCenterPosition
    )

    let i =
      nextTileImageIndex - 1 >= 0
        ? nextTileImageIndex - 1
        : Object.keys(this.tileImages).length - 1
    let countMultiplier = 1
    while (i !== nextTileImageIndex) {
      this.previousTileImage = this.tileImages[('slot' + i) as keyof TileImages]
      this.drawTileToCanvas(this.previousTileImage, {
        posX: this.tileCenterPosition.posX,
        posY:
          this.tileCenterPosition.posY -
          this.tileCenterPosition.margin * countMultiplier,
        width: this.tileCenterPosition.width,
        height: this.tileCenterPosition.height,
        margin: this.tileCenterPosition.margin
      })
      i = i - 1 >= 0 ? i - 1 : Object.keys(this.tileImages).length - 1
      countMultiplier++
    }

    this.textureCanvas.update()
  }

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

  destroy() {
    this.mesh.dispose()
  }
}
