const TILE_BULBASAUR = 1
const TILE_PIKACHU = 2
const TILE_CHARMANDER = 3
const TILE_SQUIRTLE = 4
const TILE_EEVEE = 5
const TILE_BALL = 6

const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key]

const TILES_ARRAY = [
  TILE_BULBASAUR,
  TILE_PIKACHU,
  TILE_CHARMANDER,
  TILE_SQUIRTLE,
  TILE_EEVEE,
  TILE_BALL
]

export {
  TILE_BULBASAUR,
  TILE_PIKACHU,
  TILE_CHARMANDER,
  TILE_SQUIRTLE,
  TILE_EEVEE,
  TILE_BALL,
  TILES_ARRAY,
  getKeyValue
}
