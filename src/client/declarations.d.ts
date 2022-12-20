declare module '*.jpg'
declare module '*.png'

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

type ButtonImages = {
  spinButton: string
  spinButtonHover: string
  spinButtonDisabled: string
  spinButtonDown: string
}
