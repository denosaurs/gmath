import { assert, assertEquals } from "jsr:@std/assert";
import { alloc, dealloc, memory } from "../wasm/mod.ts";

const WASM_PAGE_SIZE = 65536;
const PAGE_HEAP_BLOCK_SIZE = 64;
const PAGE_HEAP_BLOCK_COUNT = WASM_PAGE_SIZE / PAGE_HEAP_BLOCK_SIZE;
const PAGE_HEAP_FREE_LIST_COUNT = PAGE_HEAP_BLOCK_COUNT / 64;
const PAGE_HEAP_HEADER_SIZE = (PAGE_HEAP_FREE_LIST_COUNT * 8) + 8;
const PAGE_HEAP_SIZE = WASM_PAGE_SIZE - PAGE_HEAP_HEADER_SIZE;
const PAGE_HEAP_MAX_BLOCKS = Math.floor(PAGE_HEAP_SIZE / PAGE_HEAP_BLOCK_SIZE);

function reset() {
  new Uint8Array(memory.buffer).fill(0);
}

Deno.test("memory starts out empty", () => {
  reset();
  assert(new BigUint64Array(memory.buffer).every((u64) => u64 === 0n));
});

Deno.test("simple allocations", async ({ step }) => {
  reset();

  const free = new BigUint64Array(memory.buffer, 0, PAGE_HEAP_FREE_LIST_COUNT);
  await step("free list starts out empty", () => {
    assert(free.every((u64) => u64 === 0n));
  });

  await step("first allocation ends up right after page header", () => {
    const ptr1 = alloc(PAGE_HEAP_BLOCK_SIZE);
    assertEquals(ptr1, PAGE_HEAP_HEADER_SIZE);
    assertEquals(
      free[0],
      0b1000000000000000000000000000000000000000000000000000000000000000n,
    );
  });

  await step("second allocation ends up right after first", () => {
    const ptr2 = alloc(PAGE_HEAP_BLOCK_SIZE);
    assertEquals(ptr2, PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE);
    assertEquals(
      free[0],
      0b1100000000000000000000000000000000000000000000000000000000000000n,
    );
  });

  await step("allocates full first free bitfield", () => {
    for (let i = 0; i < 62; i++) {
      assertEquals(
        alloc(PAGE_HEAP_BLOCK_SIZE),
        PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE * (i + 2),
      );
    }
    assertEquals(
      free[0],
      0b1111111111111111111111111111111111111111111111111111111111111111n,
    );
  });

  await step("continues to allocate using next bitfield", () => {
    const ptr3 = alloc(PAGE_HEAP_BLOCK_SIZE);
    assertEquals(
      free[0],
      0b1111111111111111111111111111111111111111111111111111111111111111n,
    );
    assertEquals(
      free[1],
      0b1000000000000000000000000000000000000000000000000000000000000000n,
    );
    assertEquals(ptr3, PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE * 64);
  });
});

Deno.test("grows memory", async ({ step }) => {
  reset();

  const firstPageFree = new BigUint64Array(
    memory.buffer,
    0,
    PAGE_HEAP_FREE_LIST_COUNT,
  );
  const secondPageFree = new BigUint64Array(
    memory.buffer,
    WASM_PAGE_SIZE,
    PAGE_HEAP_FREE_LIST_COUNT,
  );
  await step("free lists start out empty", () => {
    assert(firstPageFree.every((u64) => u64 === 0n));
    assert(secondPageFree.every((u64) => u64 === 0n));
  });

  await step("fills up the first pages free list", () => {
    for (let i = 0; i < PAGE_HEAP_MAX_BLOCKS; i++) {
      const ptr = alloc(PAGE_HEAP_BLOCK_SIZE);
      assertEquals(ptr, PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE * i);
      assert(
        ptr < WASM_PAGE_SIZE - PAGE_HEAP_BLOCK_SIZE,
        "should not allocate past first page",
      );
    }
    assert(
      firstPageFree.slice(0, PAGE_HEAP_FREE_LIST_COUNT - 1).every((u64) =>
        u64 ===
          0b1111111111111111111111111111111111111111111111111111111111111111n
      ),
      "should fill up first page free list",
    );
    assert(
      firstPageFree[PAGE_HEAP_FREE_LIST_COUNT - 1] >= 0b1n,
      "should fill up at least one bit in the last u64 of the first page free list",
    );
    assert(
      secondPageFree.every((u64) => u64 === 0n),
      "should not touch second page free list",
    );
  });

  await step("allocates past first page", () => {
    const ptr = alloc(PAGE_HEAP_BLOCK_SIZE);
    assert(ptr >= WASM_PAGE_SIZE, "should allocate past first page");
    assertEquals(ptr, WASM_PAGE_SIZE + PAGE_HEAP_HEADER_SIZE);
    assert(
      firstPageFree.slice(0, PAGE_HEAP_FREE_LIST_COUNT - 1).every((u64) =>
        u64 ===
          0b1111111111111111111111111111111111111111111111111111111111111111n
      ),
    );
    assertEquals(
      secondPageFree[0],
      0b1000000000000000000000000000000000000000000000000000000000000000n,
    );
  });
});

Deno.test("deallocations", async ({ step }) => {
  reset();

  const firstPageFree = new BigUint64Array(
    memory.buffer,
    0,
    PAGE_HEAP_FREE_LIST_COUNT,
  );
  const secondPageFree = new BigUint64Array(
    memory.buffer,
    WASM_PAGE_SIZE,
    PAGE_HEAP_FREE_LIST_COUNT,
  );
  await step("free lists start out empty", () => {
    assert(firstPageFree.every((u64) => u64 === 0n));
    assert(secondPageFree.every((u64) => u64 === 0n));
  });

  await step("fills up the first pages free list", () => {
    for (let i = 0; i < PAGE_HEAP_MAX_BLOCKS; i++) {
      const ptr = alloc(PAGE_HEAP_BLOCK_SIZE);
      assertEquals(ptr, PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE * i);
      assert(
        ptr < WASM_PAGE_SIZE - PAGE_HEAP_BLOCK_SIZE,
        "should not allocate past first page",
      );
    }
    assert(
      firstPageFree.slice(0, PAGE_HEAP_FREE_LIST_COUNT - 1).every((u64) =>
        u64 ===
          0b1111111111111111111111111111111111111111111111111111111111111111n
      ),
      "should fill up first page free list",
    );
    assert(
      firstPageFree[PAGE_HEAP_FREE_LIST_COUNT - 1] >= 0b1n,
      "should fill up at least one bit in the last u64 of the first page free list",
    );
    assert(
      secondPageFree.every((u64) => u64 === 0n),
      "should not touch second page free list",
    );
  });

  await step("allocates past first page", () => {
    const ptr = alloc(PAGE_HEAP_BLOCK_SIZE);
    assert(ptr >= WASM_PAGE_SIZE, "should allocate past first page");
    assertEquals(ptr, WASM_PAGE_SIZE + PAGE_HEAP_HEADER_SIZE);
    assert(
      firstPageFree.slice(0, PAGE_HEAP_FREE_LIST_COUNT - 1).every((u64) =>
        u64 ===
          0b1111111111111111111111111111111111111111111111111111111111111111n
      ),
    );
    assertEquals(
      secondPageFree[0],
      0b1000000000000000000000000000000000000000000000000000000000000000n,
    );
  });

  await step("deallocates first allocation", () => {
    dealloc(PAGE_HEAP_HEADER_SIZE, PAGE_HEAP_BLOCK_SIZE);
    assertEquals(
      firstPageFree[0],
      0b0111111111111111111111111111111111111111111111111111111111111111n,
    );
  });

  await step("reallocates first allocation", () => {
    const ptr = alloc(PAGE_HEAP_BLOCK_SIZE);
    assertEquals(ptr, PAGE_HEAP_HEADER_SIZE);
    assertEquals(
      firstPageFree[0],
      0b1111111111111111111111111111111111111111111111111111111111111111n,
    );
  });

  await step("deallocates second allocation", () => {
    dealloc(PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE, PAGE_HEAP_BLOCK_SIZE);
    assertEquals(
      firstPageFree[0],
      0b1011111111111111111111111111111111111111111111111111111111111111n,
    );
  });

  await step("deallocates arbitrary allocation", () => {
    dealloc(
      PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE * 16,
      PAGE_HEAP_BLOCK_SIZE,
    );
    assertEquals(
      firstPageFree[0],
      0b1011111111111111011111111111111111111111111111111111111111111111n,
    );
  });

  await step("reallocates previous deallocations", () => {
    assertEquals(
      alloc(PAGE_HEAP_BLOCK_SIZE),
      PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE,
    );
    assertEquals(
      alloc(PAGE_HEAP_BLOCK_SIZE),
      PAGE_HEAP_HEADER_SIZE + PAGE_HEAP_BLOCK_SIZE * 16,
    );
  });
});
