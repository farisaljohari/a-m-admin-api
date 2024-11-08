export default () => ({
  DB_HOST: process.env.AZURE_POSTGRESQL_HOST,
  DB_PORT: process.env.AZURE_POSTGRESQL_PORT,
  DB_USER: process.env.AZURE_POSTGRESQL_USER,
  DB_PASSWORD: process.env.AZURE_POSTGRESQL_PASSWORD,
  DB_NAME: process.env.AZURE_POSTGRESQL_DATABASE,
  DB_SYNC: process.env.AZURE_POSTGRESQL_SYNC,
  DB_SSL: process.env.AZURE_POSTGRESQL_SSL,
});
