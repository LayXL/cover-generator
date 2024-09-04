export const urlSearchParamsToObject = (urlSearchParams: URLSearchParams) => {
  const entries = urlSearchParams.entries()

  const result: Record<string, string> = {}

  for (const [key, value] of entries) {
    result[key] = value
  }

  return result
}
