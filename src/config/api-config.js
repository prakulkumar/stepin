let gatewayApi;

gatewayApi = process.env.API_URL;
console.log(process.env.NODE_ENV);

// gatewayApi = "http://localhost:5000";
gatewayApi = "https://stepin-api.herokuapp.com";

// if (process.env.NODE_ENV === "development")
//   gatewayApi = "http://localhost:5000";
// else if (process.env.NODE_ENV === "production")
//   gatewayApi = "https://stepin-api.herokuapp.com";

export const API_ROOT = gatewayApi;
