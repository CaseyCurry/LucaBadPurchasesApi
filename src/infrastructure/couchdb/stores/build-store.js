const buildStore = (http, url, views) => {
  return http(url).then(async response => {
    if (response.status == 404) {
      await createDatabase(http, url);
      return configureViews(http, url, views);
    } else {
      return configureViews(http, url, views);
    }
  });
};

const createDatabase = (http, url) => {
  return http(url, { method: "PUT" });
};

const configureViews = (http, url, views) => {
  const viewsUrl = `${url}_design/doc/`;
  return http(viewsUrl).then(response => {
    if (response.status == 404) {
      return createViews(http, viewsUrl, views);
    } else {
      return response.json().then(body => {
        return createViews(http, viewsUrl, views, body);
      });
    }
  });
};

const createViews = (http, viewsUrl, newViews, existingViews) => {
  if (
    existingViews &&
    JSON.stringify(existingViews.views) == JSON.stringify(newViews.views) &&
    existingViews.language == newViews.language
  ) {
    return Promise.resolve();
  }
  return http(viewsUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({}, existingViews, newViews))
  });
};

export default buildStore;
