import * as SF from './starforged/dataforged.json' with { type: 'json' };
import * as IS from './ironsworn/datasworn.json' with { type: 'json' };
// for some reason these complain about ironsworn assets not having the right number of abilities. no Asset constructor throws an error for this on build, the schemas check out, and all IDs are numbered properly, so i don't know what that's about :shrug:
const starforged = SF.default;
const ironsworn = IS.default;
export { starforged, ironsworn };
