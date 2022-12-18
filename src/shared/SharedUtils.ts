const TILE_RED = 1;
const TILE_BLUE = 2;
const TILE_GREEN = 3;
const TILE_YELLOW = 4;
const TILE_WHITE = 5;

const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>
  obj[key];

const TILES_ARRAY = [
    TILE_RED,
    TILE_BLUE,
    TILE_GREEN,
    TILE_YELLOW,
    TILE_WHITE,
];

export {
    TILE_RED,
    TILE_BLUE,
    TILE_GREEN,
    TILE_YELLOW,
    TILE_WHITE,
    TILES_ARRAY,
    getKeyValue,
}