const { saveLogInfo } = require("../middlewares/logger/logInfo");
const createCategoryFilterService = require("./categoryFilterService");
const Config = require("../models/config.model");

/**
 * @param next - confirmPost (/middlewares/post/confirmPost.js)
 */
const processPost = async (req, res, next) => {
  try {
    const { content, communityName } = req.body;
    const { serviceProvider, timeout } = await getSystemPreferences();

    if (serviceProvider === "disabled") {
      req.failedDetection = false;
      return next();
    }

    try {
      const categoryFilterService = createCategoryFilterService(serviceProvider);
      const categories = await categoryFilterService.getCategories(content, timeout);

      if (Object.keys(categories).length > 0) {
        const recommendedCommunity = Object.keys(categories)[0];

        if (recommendedCommunity !== communityName) {
          const type = "categoryMismatch";
          const info = { community: communityName, recommendedCommunity };
          return res.status(403).json({ type, info });
        } else {
          req.failedDetection = false;
          return next();
        }
      } else {
        req.failedDetection = true;
        return next();
      }
    } catch (serviceError) {
      // If the external service fails (no API key, network error, etc.),
      // fall through and create the post normally
      console.warn("[processPost] Category service failed, skipping:", serviceError.message);
      req.failedDetection = false;
      return next();
    }
  } catch (error) {
    console.error("[processPost] Unexpected error:", error.message);
    req.failedDetection = false;
    return next();
  }
};

const getSystemPreferences = async () => {
  try {
    const config = await Config.findOne({}, { _id: 0, __v: 0 });

    if (!config) {
      return {
        serviceProvider: "disabled",
        timeout: 10000,
      };
    }

    const {
      categoryFilteringServiceProvider: serviceProvider = "disabled",
      categoryFilteringRequestTimeout: timeout = 10000,
    } = config;

    return {
      serviceProvider,
      timeout,
    };
  } catch (error) {
    return {
      serviceProvider: "disabled",
      timeout: 10000,
    };
  }
};

module.exports = processPost;
