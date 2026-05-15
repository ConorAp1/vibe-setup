export function parseFiles(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /<file path="([^"]+)">([\s\S]*?)<\/file>/g
  let match
  while ((match = re.exec(text)) !== null) {
    out[match[1]] = match[2].trim()
  }
  return out
}
