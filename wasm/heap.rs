/// # Heap Allocator
///
/// > Because I wanted the simplest possible allocator and keep size down. Muahahaha!
///
/// I decided to implement a really simple allocator for this project to allow
/// for the very limited scope of allocations we actually require.
///
/// The allocator is a memory pool/fixed-size block allocator which stores 64 byte
/// blocks. The blocks are stored linearly in memory and have an associated free
/// bit in the page heap header. The free bit is toggled when the block is allocated
/// or deallocated.
///
/// The allocator should make for an efficient and simple solution for the limited
/// scope of allocations we require. I expect most allocations in gmath to be close
/// together in code, and as such the allocator will make sure to allocate blocks
/// in linear order. We still suffer from fragmentation, especially when earlier
/// blocks are deallocated and then reallocated, but this should be a non-issue
/// for the scope of this project at the moment.
use core::alloc::{GlobalAlloc, Layout};
use core::arch::wasm32;

/// The WebAssembly page size is 64KB.
const WASM_PAGE_SIZE: usize = 65536;
/// The maximum number of WebAssembly pages. Multiplied by the page size, this is 4GB.
const _WASM_MAX_PAGES: usize = 65536;
/// The size of a block in the page heap.
const PAGE_HEAP_BLOCK_SIZE: usize = 64;
/// The number of 64 byte blocks in a page.
const PAGE_HEAP_BLOCK_COUNT: usize = WASM_PAGE_SIZE / PAGE_HEAP_BLOCK_SIZE;
/// The number of free lists in the page heap.
const PAGE_HEAP_FREE_LIST_COUNT: usize = PAGE_HEAP_BLOCK_COUNT / 64;
/// The size of the page heap header.
const PAGE_HEAP_HEADER_SIZE: usize = core::mem::size_of::<PageHeap>();
/// The size of the usable memory in the page heap.
const _PAGE_HEAP_SIZE: usize = WASM_PAGE_SIZE - PAGE_HEAP_HEADER_SIZE;
/// The max number of blocks in the page heap.
const _PAGE_HEAP_MAX_BLOCKS: usize = _PAGE_HEAP_SIZE / PAGE_HEAP_BLOCK_SIZE;

/// A mask used to check and toggle a bit in the free list.
const FREE_MASK: u64 = 1 << 63;

struct PageHeap {
  /// A free list of each free 64 byte block in the heap. We are stored at the
  /// beginning of each page.
  /// ```txt
  ///   This is a us!
  ///  /-\
  /// [XXX00000000000000000000000000000]
  /// ```
  free: [u64; PAGE_HEAP_FREE_LIST_COUNT],
  /// The index of the next free block in the heap.
  head: usize,
}

impl PageHeap {
  fn allocate(&mut self) -> Option<usize> {
    self
      .free
      .iter_mut()
      .enumerate()
      .skip(self.head)
      .find(|(_index, bitfield)| **bitfield != u64::MAX)
      .map(|(index, bitfield)| {
        let leading_ones = bitfield.leading_ones() as usize;

        // Update the head to the next free block
        self.head = index;

        // Mark the block as allocated
        *bitfield |= FREE_MASK >> leading_ones;

        // Calculate the offset of the next free block
        let offset = PAGE_HEAP_HEADER_SIZE + ((index * 64) + leading_ones) * 64;

        // Return the offset if it is within the page
        if offset <= WASM_PAGE_SIZE - PAGE_HEAP_BLOCK_SIZE {
          Some(offset)
        } else {
          None
        }
      })?
  }

  fn dealloc(&mut self, offset: usize) {
    let index = (offset - PAGE_HEAP_HEADER_SIZE) / 64;
    let bitfield = &mut self.free[index / 64];
    let bit = index % 64;

    // Update the head to the minimum of the current head and the deallocated block
    self.head = self.head.min(index);

    // Mark the block as free
    *bitfield &= !(FREE_MASK >> bit);
  }
}

pub struct Heap;

impl Heap {
  pub const fn new() -> Self {
    Self
  }
}

unsafe impl GlobalAlloc for Heap {
  unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
    // We only allocate in 64 byte blocks
    assert!(layout.size() <= 64);

    for i in 0..wasm32::memory_size::<0>() {
      let page_offset = i * WASM_PAGE_SIZE;
      let page_heap = &mut *(page_offset as *mut PageHeap);

      if let Some(offset) = page_heap.allocate() {
        return (page_offset + offset) as *mut u8;
      }
    }

    // If we reach this point, we need to grow the memory but the procedure after that is essentially the same
    let page_offset = wasm32::memory_grow::<0>(1) * WASM_PAGE_SIZE;
    let page_heap = &mut *(page_offset as *mut PageHeap);

    if let Some(offset) = page_heap.allocate() {
      return (page_offset + offset) as *mut u8;
    }

    panic!("Out of memory")
  }

  unsafe fn dealloc(&self, ptr: *mut u8, _layout: Layout) {
    let page = (ptr as usize).div_floor(WASM_PAGE_SIZE);
    let page_offset = page * WASM_PAGE_SIZE;
    let page_heap = &mut *(page_offset as *mut PageHeap);
    let offset = ptr as usize - page_offset;

    page_heap.dealloc(offset);
  }
}
