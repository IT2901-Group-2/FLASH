export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { dbService } = await import("./services/databaseService");

    // Initialize database service
    console.log("\x1b[1;32m✓\x1b[0m Initializing database...");
    const dbLoaded = await dbService.initialize().getOrThrow();
    console.log(
      dbLoaded
        ? "\x1b[1;32m✓\x1b[0m Loaded existing database"
        : "\x1b[1;33mW\x1b[0m Couldn't load existing database. A new database has been created instead."
    );
  }
}
