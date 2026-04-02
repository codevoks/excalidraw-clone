export function pointerToCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  if (!canvas) {
    return { x: null, y: null };
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const canvasX = (clientX - rect.left) * scaleX;
  const canvasY = (clientY - rect.top) * scaleY;
  return { x: canvasX, y: canvasY };
}
