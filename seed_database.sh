#!/bin/bash

# Script to seed the Octopus TMS database with sample data
# Created on 2025-08-04

# Set the path to the application.properties file
PROPERTIES_FILE="./base/src/main/resources/application.properties"

# Check if the properties file exists
if [ ! -f "$PROPERTIES_FILE" ]; then
    echo "Error: application.properties file not found at $PROPERTIES_FILE"
    exit 1
fi

# Extract database connection details from application.properties
DB_URL=$(grep "spring.datasource.url" "$PROPERTIES_FILE" | cut -d':' -f2- | sed 's/}.*$//' | sed 's/^[^:]*://' | sed 's/\\//g')
DB_USERNAME=$(grep "spring.datasource.username" "$PROPERTIES_FILE" | cut -d':' -f2- | sed 's/}.*$//' | sed 's/^[^:]*://' | sed 's/\\//g')
DB_PASSWORD=$(grep "spring.datasource.password" "$PROPERTIES_FILE" | cut -d':' -f2- | sed 's/}.*$//' | sed 's/^[^:]*://' | sed 's/\\//g')

# Extract database name from the URL
DB_NAME=$(echo "$DB_URL" | sed 's/.*\///')

# Extract host and port from the URL
DB_HOST_PORT=$(echo "$DB_URL" | sed 's/.*:\/\///' | sed 's/\/.*//')
DB_HOST=$(echo "$DB_HOST_PORT" | cut -d':' -f1)
DB_PORT=$(echo "$DB_HOST_PORT" | cut -d':' -f2)

echo "Database connection details:"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "Username: $DB_USERNAME"
echo "Password: $DB_PASSWORD"

# Confirm with the user
read -p "Do you want to proceed with seeding the database? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 1
fi

# Execute the SQL script
echo "Seeding the database with sample data..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -f seed_data.sql

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Database seeded successfully!"
else
    echo "Error: Failed to seed the database."
    exit 1
fi

echo "Done."