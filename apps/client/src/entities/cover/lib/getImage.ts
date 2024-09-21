export async function getImage(src: string) {
  const img = new Image()

  img.src = src

  return new Promise<HTMLImageElement>((resolve) => {
    img.onload = () => resolve(img)
  })
}
