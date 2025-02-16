export function calculateMemoryRequirement(
  fileSize: string,
  quantization: string
): number {
  const sizeMatch = fileSize.match(/(\d+\.?\d*)\s*(GB|TB)/i);
  if (!sizeMatch) return 0.5;

  let size = parseFloat(sizeMatch[1]);
  if (sizeMatch[2].toUpperCase() === "TB") {
    size *= 1024;
  }

  let memoryMultiplier;
  switch (quantization.toUpperCase()) {
    case "FP16":
      memoryMultiplier = 2.0;
      break;
    case "Q8_0":
      memoryMultiplier = 1.5;
      break;
    case "Q4_K_M":
    case "Q4_0":
    case "Q4_1":
      memoryMultiplier = 1.2;
      break;
    case "Q5_K_M":
    case "Q5_0":
    case "Q5_1":
      memoryMultiplier = 1.3;
      break;
    case "Q6_K_M":
    case "Q6_K":
      memoryMultiplier = 1.4;
      break;
    case "Q2_K":
      memoryMultiplier = 1.1;
      break;
    case "Q3_K_S":
    case "Q3_K_M":
    case "Q3_K_L":
      memoryMultiplier = 1.15;
      break;
    default:
      memoryMultiplier = 1.0;
  }

  let memoryRequired = size * memoryMultiplier;
  memoryRequired *= 1.1;
  return Math.max(memoryRequired, 0.5);
} 