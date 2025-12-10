// CORS helper function for all Lambda functions
const getCorsHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
};

const isOptionsRequest = (event) => {
  return (
    event.httpMethod === "OPTIONS" ||
    (event.requestContext && event.requestContext.httpMethod === "OPTIONS")
  );
};

const handleOptionsRequest = () => {
  return {
    statusCode: 200,
    headers: getCorsHeaders(),
    body: JSON.stringify({}),
  };
};

module.exports = {
  getCorsHeaders,
  isOptionsRequest,
  handleOptionsRequest,
};
