export async function fileToUint8ClampedArray(
  file: File
): Promise<Uint8ClampedArray> {
  const arrayBuffer = await file.arrayBuffer()
  const uint8ClampedArray = new Uint8ClampedArray(arrayBuffer)

  return uint8ClampedArray
}
