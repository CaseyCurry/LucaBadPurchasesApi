import { expect } from "chai";
import { categoriesApi } from "./categories-api";
import { longLifeTokens } from "../../../config/secrets.json";

describe("categories api test suite", () => {
  const tenant = "1a845694-2e9f-4619-aa42-6e5bc2394893";

  it("should get categories", async () => {
    const categories = await categoriesApi.get(longLifeTokens[tenant]);
    expect(categories.length).to.exist;
  });
});
