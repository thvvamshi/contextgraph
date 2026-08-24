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
      )
    );
  }

  return driver;
};

export const checkDatabaseConnection = async (): Promise<void> => {
  const databaseDriver = getDriver();

  await databaseDriver.verifyConnectivity();

  console.log("CognoDB connection successful");
};