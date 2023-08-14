// next.config.js
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    publicExcludes: ["!icon.png", "!splash.png"], // Add any exclusions
  },
  // ... other Next.js config options ...
});
