import { getDriver } from "../config/database.js";
import { customerContextQuery } from "../graph/queries/customer-context.js";
import { expertDiscoveryQuery } from "../graph/queries/expert-discovery.js";
import { resolutionContextQuery } from "../graph/queries/resolution-context.js";
import { showcaseContextQuery } from "../graph/queries/showcase-context.js";
import { agentContextQuery } from "../graph/queries/agent-context.js";

export class GraphRepository {
  async getCustomerContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(customerContextQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  async discoverExperts(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(expertDiscoveryQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  async getResolutionContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(resolutionContextQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  async getShowcaseContext(customerTier: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(showcaseContextQuery, {
        customerTier,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  async getAgentContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(agentContextQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }
}
