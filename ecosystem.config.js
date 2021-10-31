module.exports = {
  apps: [
    {
      name: "yoco-frontend",
      script: "node server.js",
      watch: true,
      env_development: {
        NODE_ENV: "development",
        PORT: 4001,
        REACT_APP_SERVICES_URI: "https://api-dev.yocoservices.com/",
        REACT_APP_GRAPHQL_URI: "https://api-dev.yocoservices.com/graphql",
        REACT_APP_IDFY_API_URL: "https://eve.idfy.com/v3",
        REACT_APP_ASSETS_BASE_URL: "https://storage.googleapis.com/yoco_dev_assets",
        REACT_APP_IDFY_API_KEY: "d3e358f4-1cb8-413c-b7a6-8e818a323c82",
        REACT_APP_IDFY_ACCOUNT_ID: "e63d836c5fd2/811a2f39-e52c-4633-a874-119a089eb141",
        REACT_APP_GOOGLE_MAP_APIKEY:"AIzaSyDy-jaQ1x2IjgRawCmaKPcUEaNEHYvBVRY"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
        REACT_APP_SERVICES_URI: "https://api.yocoservices.com/",
        REACT_APP_GRAPHQL_URI: "https://api.yocoservices.com/graphql",
        REACT_APP_IDFY_API_URL: "https://eve.idfy.com/v3",
        REACT_APP_ASSETS_BASE_URL: "https://storage.googleapis.com/yoco_dev_assets",
        REACT_APP_IDFY_API_KEY: "d3e358f4-1cb8-413c-b7a6-8e818a323c82",
        REACT_APP_IDFY_ACCOUNT_ID: "e63d836c5fd2/811a2f39-e52c-4633-a874-119a089eb141",
        REACT_APP_GOOGLE_MAP_APIKEY:"AIzaSyDy-jaQ1x2IjgRawCmaKPcUEaNEHYvBVRY"
      }
    }
  ]
}