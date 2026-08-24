import neo4j, { Driver } from "neo4j-driver";
import { env } from "./env.js";

let driver: Driver | null = null;

export const getDriver = (): Driver => {
  if (!driver) {
    if (!env.cognodb.uri) {
      throw new Error("COGNODB_URI is not configured");
    }

    if (!env.cognodb.username) {
      throw new Error("COGNODB_USERNAME is not configured");
    }

    if (!env.cognodb.password) {
      throw new Error("COGNODB_PASSWORD is not configured");
    }

    driver = neo4j.driver(
      env.cognodb.uri,
      neo4j.auth.basic(
        env.cognodb.username,
        env.cognodb.password
      ),
      {
        maxConnectionLifetime: 3 * 60 * 60 * 1000,
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2 * 60 * 1000,
        disableLosslessIntegers: true
      }
    );
  }

  return driver;
};

export const checkDatabaseConnection = async (): Promise<void> => {
  const databaseDriver = getDriver();
  await databaseDriver.verifyConnectivity();
  console.log("CognoDB connection successful");
};

export const closeDriver = async (): Promise<void> => {
  if (driver) {
    await driver.close();
    driver = null;
  }
};