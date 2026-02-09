#!/bin/bash
set -e

echo "Configuring PostgreSQL authentication for Docker network..."

# This script runs after PostgreSQL is initialized
# Configure pg_hba.conf to allow connections from Docker network
cat >> /var/lib/postgresql/data/pg_hba.conf <<EOF

# Docker network connections
host all all 0.0.0.0/0 md5
host all all 172.16.0.0/12 md5
EOF

echo "PostgreSQL authentication configured successfully!"

