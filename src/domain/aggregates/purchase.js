import { BaseAggregate } from "./base-aggregate";

// TODO: unit test
const Purchase = class extends BaseAggregate {
  constructor({ _rev, id, tenantId, isFlagged, isIgnored, isBad }) {
    super(_rev);
    this.id = id;
    this.tenantId = tenantId;
    this.isFlagged = isFlagged;
    this.isIgnored = isIgnored;
    this.isBad = isBad;
  }

  evaluate(amount, categorization) {
    if (amount < 0) {
      return;
    }

    // skip purchases less than 200 unless...
    if (amount < 200) {
      // ...the category is overridden for this rule
      if (
        categorization.category !== "housing" &&
        categorization.subcategory !== "storage"
      ) {
        return;
      }
    }

    // evaluate these categories in a different domain if necessary
    if (
      categorization.category === "investments" ||
      categorization.subcategory === "mortgage"
    ) {
      return;
    }

    // these rules set an appropriate max by category / subcategory
    // rent
    if (
      categorization.category === "housing" &&
      categorization.subcategory === "rent" &&
      amount <= 1000
    ) {
      return;
    }

    // car note / lease
    if (
      categorization.category === "transportation" &&
      categorization.subcategory === "car note/lease" &&
      amount <= 500
    ) {
      return;
    }

    this.flag();
  }

  flag() {
    this.isFlagged = true;
    this.isIgnored = !this.isFlagged;
    this.isBad = !this.isFlagged;
  }

  ignore() {
    this.isIgnored = true;
    this.isBad = !this.isIgnored;
  }

  confirmBad() {
    this.isIgnored = false;
    this.isBad = !this.isIgnored;
  }
};

export { Purchase };
