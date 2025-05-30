export const apps = [
    {
        name: 'sentinelServer',
        script: "./dist/server.js",
        instances: 1,
        autorestart: true,
        exec_mode: "fork",
        watch: false,
        max_memory_restart: "1G",
        env: {
            NODE_ENV: "development",
            PORT: 3030,
            HOST: "0.0.0.0"  // Explicitly set host
        },

    }
]