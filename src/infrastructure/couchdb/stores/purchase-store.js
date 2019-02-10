import buildStore from "./build-store";

const PurchaseStore = (http, baseUrl) => {
  const url = `${baseUrl}bad-purchases%2Fpurchases/`;
  return {
    url,
    http,
    build: () => {
      const views = {
        views: {
          "flagged-by-tenant": {
            map:
              "function (doc) {\n  if (doc.isFlagged && !doc.isIgnored && !doc.isBad) {\n    emit(doc.tenantId, null);\n  }\n}"
          },
          "purchases-by-tenant": {
            map: "function (doc) {\n  emit([doc.tenantId, doc.id], null);\n}"
          }
        },
        language: "javascript"
      };
      return buildStore(http, url, views);
    }
  };
};

export { PurchaseStore };
