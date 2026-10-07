const { Client } = require('pg');

async function createDatabaseIfNotExists() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1111',
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'project_manager'",
    );
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE project_manager');
      console.log('SUCCESS: Database project_manager created successfully!');
    } else {
      console.log('SUCCESS: Database project_manager already exists.');
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
  }
}

createDatabaseIfNotExists();
