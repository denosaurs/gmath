#![no_std]
#![feature(core_intrinsics, lang_items, alloc_error_handler)]

extern crate alloc;
extern crate wee_alloc;

pub mod matrix2;
pub mod matrix3;
pub mod matrix4;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[panic_handler]
#[no_mangle]
pub fn panic(_info: &core::panic::PanicInfo) -> ! {
  core::intrinsics::abort();
}

#[alloc_error_handler]
#[no_mangle]
pub fn oom(_layout: core::alloc::Layout) -> ! {
  core::intrinsics::abort()
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
