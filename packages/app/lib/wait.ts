export const wait = async (milliseconds: number) => {
  await new Promise<void>((resolve) => setTimeout(resolve, milliseconds))
}
