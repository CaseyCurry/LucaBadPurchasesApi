import { expect } from "chai";
import proxyquire from "proxyquire";

describe("categories api test suite", () => {
  const tenantId = "123";

  describe("when cache is empty", () => {
    let apiGetCount = 0;
    const mockCategories = { a: "a" };
    const cachedCategoriesApi = proxyquire("./cached-categories-api", {
      "./categories-api": {
        categoriesApi: {
          get: () => {
            apiGetCount++;
            return Promise.resolve(mockCategories);
          }
        }
      },
      "node-cache": () => {
        let cachedCategories;
        return {
          get: () => cachedCategories,
          set: categories => (cachedCategories = categories)
        };
      }
    }).cachedCategoriesApi;

    beforeEach(() => {
      cachedCategoriesApi.initialize();
    });

    describe("when the first get is made", () => {
      it("should get categories from the api", async () => {
        const categories = await cachedCategoriesApi.get(tenantId);
        expect(categories).to.deep.equal(mockCategories);
      });
    });

    describe("when the second get is made", () => {
      it("should get categories from the api", async () => {
        apiGetCount = 0;
        await cachedCategoriesApi.get(tenantId);
        await cachedCategoriesApi.get(tenantId);
        expect(apiGetCount).to.equal(1);
      });
    });
  });

  describe("when categories are in cache", () => {
    const mockCategories = { a: "a" };
    const cachedCategoriesApi = proxyquire("./cached-categories-api", {
      "node-cache": () => {
        return {
          get: () => mockCategories
        };
      }
    }).cachedCategoriesApi;

    beforeEach(() => {
      cachedCategoriesApi.initialize();
    });

    it("should get categories from api", async () => {
      const categories = await cachedCategoriesApi.get(tenantId);
      expect(categories).to.deep.equal(mockCategories);
    });
  });
});
