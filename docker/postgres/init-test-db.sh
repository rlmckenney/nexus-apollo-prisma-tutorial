#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE dev;
    CREATE DATABASE test;
    GRANT ALL PRIVILEGES ON DATABASE dev TO prisma;
    GRANT ALL PRIVILEGES ON DATABASE test TO prisma;
EOSQL