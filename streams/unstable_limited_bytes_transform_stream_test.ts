// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "@std/assert";
import { LimitedBytesTransformStream } from "./unstable_limited_bytes_transform_stream.ts";

Deno.test("LimitedBytesTransformStream - specified size is the boundary of the chunks", async function () {
  const r = ReadableStream.from([
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]).pipeThrough(new LimitedBytesTransformStream(6));

  const chunks = await Array.fromAsync(r);
  assertEquals(chunks, [
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
  ]);
});

Deno.test("LimitedBytesTransformStream - specified size is not the boundary of the chunks", async function () {
  const r = ReadableStream.from([
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]).pipeThrough(new LimitedBytesTransformStream(7));

  const chunks = await Array.fromAsync(r);
  assertEquals(chunks, [
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7]),
  ]);
});

Deno.test("LimitedBytesTransformStream - specified size is 0", async function () {
  const r = ReadableStream.from([
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]).pipeThrough(new LimitedBytesTransformStream(0));

  const chunks = await Array.fromAsync(r);
  assertEquals(chunks.length, 0);
});

Deno.test("LimitedBytesTransformStream - specified size is equal to the total size of the chunks", async function () {
  const r = ReadableStream.from([
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]).pipeThrough(new LimitedBytesTransformStream(18));

  const chunks = await Array.fromAsync(r);
  assertEquals(chunks, [
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]);
});

Deno.test("LimitedBytesTransformStream - specified size is greater than the total size of the chunks", async function () {
  const r = ReadableStream.from([
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]).pipeThrough(new LimitedBytesTransformStream(19));

  const chunks = await Array.fromAsync(r);
  assertEquals(chunks, [
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]);
});

Deno.test("LimitedBytesTransformStream - specified size is less than the size of the first chunk", async function () {
  const r = ReadableStream.from([
    new Uint8Array([1, 2, 3]),
    new Uint8Array([4, 5, 6]),
    new Uint8Array([7, 8, 9]),
    new Uint8Array([10, 11, 12]),
    new Uint8Array([13, 14, 15]),
    new Uint8Array([16, 17, 18]),
  ]).pipeThrough(new LimitedBytesTransformStream(2));

  const chunks = await Array.fromAsync(r);
  assertEquals(chunks, [
    new Uint8Array([1, 2]),
  ]);
});
