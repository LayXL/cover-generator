import path from "node:path"

export function escapePath(segment: string): string {
  return path.normalize(segment.replace(/[^a-zA-Z0-9-_]/g, "_"))
}
