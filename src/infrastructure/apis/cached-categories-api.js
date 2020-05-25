import NodeCache from "node-cache";
import { categoriesApi } from "./categories-api";
import { longLifeTokens } from "../../../config/secrets.json";

let cache;

const cachedCategoriesApi = {
  get: async tenantId => {
    // TODO: test multi-tenancy
    let categories = cache.get(tenantId);
    if (!categories) {
      const token = longLifeTokens[tenantId];
      categories = await categoriesApi.get(token);
      cache.set(tenantId, categories);
    }
    return categories;
  },
  initialize: () => {
    cache = new NodeCache({ stdTTL: 300, checkperiod: 0 });
  }
};

export { cachedCategoriesApi };
