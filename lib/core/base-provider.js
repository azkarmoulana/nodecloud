const providers = require("./providers");
const path = require("path");
const ncConfig = require(path.join(process.cwd(), ".nc.config"));
const validProviders = require("./providers-list");

class Provider {
  /**
   * Provider constructor
   * @constructor
   * @param {string} provider - Type of provider - can be found here '/aws/provider'
   */
  constructor() {
    this._providers = this.getProviders();
    return this._providers;
  }

  /**
   * Returns requested provider type
   * @param {Object} {provider - Type of provider - can be found here '/aws/provider'}
   */
  getProviders(options) {
    if (ncConfig === undefined) {
      throw new Error(
        "Provider config file not found. Please create a config file in project root."
      );
    }

    let providersToLoad = {};

    if (options.overrideProviders) {
      ncConfig.map(provider => {
        const module = require(provider.libName);
        providersToLoad[provider.tag] = new module(ncConfig.configPath);
      });
    } else {
      ncConfig.map(provider => {
        if (!validProviders.includes(provider.name)) {
          throw new Error("Provider not supported");
        }

        const module = require(provider.libName);
        providersToLoad[provider.tag] = new module(ncConfig.configPath);
      });
    }

    return providersToLoad;
  }
}

module.exports = Provider;
