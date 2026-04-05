/** Returns true if the error was caused by an AbortController signal */
export function isAbortError(err: any): boolean {
  return (
    err?.name === "AbortError" ||
    err?.name === "CanceledError" ||
    err?.code === "ERR_CANCELED"
  );
}
