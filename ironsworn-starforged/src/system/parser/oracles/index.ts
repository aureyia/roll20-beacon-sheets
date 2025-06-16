import { Context, Effect, Layer } from "effect";

export class Assets extends Context.Tag("Assets")<
  Assets, >(){}

export const AssetsLive = Layer.effect