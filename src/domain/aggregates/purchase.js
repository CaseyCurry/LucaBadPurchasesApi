import { BaseAggregate } from "./base-aggregate";

// TODO: unit test
const Purchase = class extends BaseAggregate {
  constructor({ id, tenantId, dateFlagged, isFlagged, isIgnored, isBad }) {
    super();
    this.id = id;
    this.tenantId = tenantId;
    this.dateFlagged = dateFlagged;
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
      // ...this rule is overridden for this category
      if (
        !(
          categorization.category === "housing" &&
          categorization.subcategory === "storage"
        )
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
    // FIX: meh... three mutually exclusive boolean properties. Mind how the table is indexed.
    this.isFlagged = true;
    this.isIgnored = false;
    this.isBad = false;
    this.dateFlagged = new Date().toISOString();
  }

  ignore() {
    this.isIgnored = true;
    this.isBad = false;
    this.isFlagged = false;
  }

  confirmBad() {
    this.isBad = true;
    this.isIgnored = false;
    this.isFlagged = false;
  }
};

export { Purchase };
