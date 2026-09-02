export function captureException(error: unknown, context?: Record<string, unknown>) {
  console.error(
    JSON.stringify({
      level: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
    }),
  );
}

export function captureMessage(message: string, context?: Record<string, unknown>) {
  console.info(JSON.stringify({ level: "info", message, ...context }));
}
