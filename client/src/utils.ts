export function wait(millis: number): Promise<void> {
  return new Promise(res => setTimeout(res, millis));
}