export function handleDbError(operation: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "Unknown database error";
  throw new Error(`Database operation failed (${operation}): ${message}`);
}
