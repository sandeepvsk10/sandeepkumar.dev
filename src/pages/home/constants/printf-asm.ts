/**
 * `main` from `printf("Software Engineer\n"); return 0;`, compiled on Apple Silicon with
 * `clang -S -O0 se.c` (arm64, macOS SDK 27). Directives and comments are dropped. The string's page
 * offset is shown as the linked value from `otool -tvV` (`#0x4a0`) instead of `l_.str@PAGEOFF`, so
 * every instruction stays short.
 */
export const PRINTF_ASM = [
  ["SUB", "sp, sp, #32"],
  ["STP", "x29, x30, [sp, #16]"],
  ["ADD", "x29, sp, #16"],
  ["MOV", "w8, #0"],
  ["STR", "w8, [sp, #8]"],
  ["STUR", "wzr, [x29, #-4]"],
  ["ADRP", "x0, l_.str@PAGE"],
  ["ADD", "x0, x0, #0x4a0"],
  ["BL", "_printf"],
  ["LDR", "w0, [sp, #8]"],
  ["LDP", "x29, x30, [sp, #16]"],
  ["ADD", "sp, sp, #32"],
  ["RET", ""],
] as const;

/**
 * Shown before the instructions run: the chip and target they were compiled for, from this Mac's
 * `sysctl machdep.cpu.brand_string` (Apple M4) and `clang -print-target-triple` (arm64-apple-darwin27.0.0,
 * version dropped to keep it short).
 */
export const PRINTF_TARGET = ["M4", "arm64-apple-darwin"] as const;
