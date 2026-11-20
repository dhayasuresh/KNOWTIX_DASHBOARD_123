export function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[([\s\S]*)\]/);
    return match ? JSON.parse(match[0]) : [];
  }
}
