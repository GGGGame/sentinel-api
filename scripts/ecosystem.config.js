export const apps = [
    {
        name: 'sentinelServer',
        script: "./dist/server.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restartg: "1G",
        env: {
            NODE_ENV: "production"
        }

    }
]