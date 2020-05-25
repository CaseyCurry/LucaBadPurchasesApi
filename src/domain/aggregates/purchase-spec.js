import { expect } from "chai";
import { Purchase } from "./purchase";

describe("purchase test suite", () => {
  describe("when a purchase is created", () => {
    it("should create", () => {
      const purchase = new Purchase({
        id: "123",
        tenantId: "456",
        dateFlagged: new Date().toISOString(),
        isFlagged: true,
        isIgnored: false,
        isBad: false
      });
      expect(purchase).to.exist;
    });
  });
});
