export function register() {
    // Only run on Node.js runtime (not Edge)
    if (process.env.NEXT_RUNTIME === "nodejs") {
        process.on("uncaughtException", (err: unknown) => {
            if (err instanceof Error) {
                console.error("UNCAUGHT EXCEPTION:", err.stack || err.message);
            } else {
                console.error("UNCAUGHT EXCEPTION:", err);
            }
        });

        process.on("unhandledRejection", (reason: unknown) => {
            if (reason instanceof Error) {
                console.error("UNHANDLED REJECTION:", reason.stack || reason.message);
            } else {
                console.error("UNHANDLED REJECTION:", reason);
            }
        });

        console.log("📌 Server instrumentation loaded");
    }
}
