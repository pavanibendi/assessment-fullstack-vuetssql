#!/bin/bash

# run the container with environment variables
docker run -it --rm -p 3075:8080 -e PORT=8080 -e NODE_ENV=staging -e DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/jdwly -e JWT_SECRET="somesupersecret" jdwly-api

# log to the console the current host and port
echo "Server running, health check at http://localhost:3075/health"