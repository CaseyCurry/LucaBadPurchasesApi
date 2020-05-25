import fetch from "node-fetch";
import { categoriesAppSvcsUrl } from "../../../config/settings";

const categoriesApi = {
  get: token => {
    return fetch(`${categoriesAppSvcsUrl}categories`, {
      headers: {
        Authorization: token
      }
    }).then(response => {
      if (response.status < 200 || response.status > 299) {
        throw new Error(
          `The call to the categories api failed with code ${response.status}`
        );
      }
      return response.json();
    });
  }
};

export { categoriesApi };
