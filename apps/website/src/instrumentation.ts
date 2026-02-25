export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { dbService } = await import("./services/databaseService");
    await dbService.initialize();
  }
}
