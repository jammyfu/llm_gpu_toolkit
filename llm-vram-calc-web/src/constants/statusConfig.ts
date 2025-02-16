import type { StatusColors } from '../types/themeTypes';
import type { RunStatus } from '../types/modelTypes';

export const statusColors: StatusColors = {
  "can-run": { color: "#a9d134", bg: "#f6ffed" },
  "barely-run": { color: "#faad14", bg: "#fffbe6" },
  "cannot-run": { color: "#ff4d4f", bg: "#fff2f0" },
};

export const statusOrder: { [key in RunStatus]: number } = {
  "can-run": 0,
  "barely-run": 1,
  "cannot-run": 2,
};

export const QUANTIZATION_BITS = {
  FP32: 32,
  FP16: 16,
  Q8_0: 8,
  Q4_K_M: 4,
  Q5_K_M: 5,
  Q6_K_M: 6,
  Q2_K: 2,
  Q3_K_S: 3,
  Q3_K_M: 3,
  Q3_K_L: 3,
  Q4_0: 4,
  Q4_1: 4,
  Q5_0: 5,
  Q5_1: 5,
  Q6_K: 6,
} as const;

export const GPU_MEMORY_KEY = "gpu_memory_setting"; 