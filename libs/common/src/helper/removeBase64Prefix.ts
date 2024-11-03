export function removeBase64Prefix(dataUrl: string): string {
  return dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
}
