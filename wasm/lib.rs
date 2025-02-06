#![no_std]
#![feature(int_roundings)]

extern crate alloc;

pub mod matrix2;
pub mod matrix3;
pub mod matrix4;

mod heap;
use heap::Heap;

#[global_allocator]
static ALLOC: Heap = Heap::new();

extern "C" {
  fn panic();
}

#[panic_handler]
#[no_mangle]
pub fn panic_handler(_info: &core::panic::PanicInfo) -> ! {
  unsafe { panic() };
  loop {}
}

#[no_mangle]
pub unsafe fn alloc(size: usize) -> *mut u8 {
  let align = core::mem::align_of::<usize>();
  let layout = alloc::alloc::Layout::from_size_align_unchecked(size, align);
  alloc::alloc::alloc(layout)
}

#[no_mangle]
pub unsafe fn dealloc(ptr: *mut u8, size: usize) {
  let align = core::mem::align_of::<usize>();
  let layout = alloc::alloc::Layout::from_size_align_unchecked(size, align);
  alloc::alloc::dealloc(ptr, layout);
}
