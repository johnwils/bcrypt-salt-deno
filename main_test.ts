import { assertEquals, assertExists, assert } from "jsr:@std/assert";
import { BcryptSalt } from "./main.ts";

Deno.test("uses a default maxHashTime of 500", () => {
  const bs = new BcryptSalt();
  assertEquals(bs.maxHashTime, 500);
});

Deno.test("uses a custom maxHashTime of 10", () => {
  const maxHashTime = 10;
  const bs = new BcryptSalt({ maxHashTime });
  assertEquals(bs.maxHashTime, maxHashTime);
});

Deno.test("returns custom maxHashTime of 1000", () => {
  const maxHashTime = 1000;
  const bs = new BcryptSalt({ maxHashTime });
  assertExists(bs.maxHashTime);
});

Deno.test("returns saltRounds", () => {
  const bs = new BcryptSalt();
  assertExists(bs.saltRounds);
});

Deno.test("returns a lower hashTime than maxTime", () => {
  const maxHashTime = 500;
  const bs = new BcryptSalt({ maxHashTime });
  assert(bs.maxHashTime <= maxHashTime);
});

Deno.test("returns a higher nextHashTime than maxTime", () => {
  const maxHashTime = 500;
  const bs = new BcryptSalt({ maxHashTime });
  assert(bs.nextHashTime >= maxHashTime);
});
