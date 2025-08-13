const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth Middleware - Request:", {
    method: req.method,
    url: req.url,
    hasAuthHeader: !!authHeader,
    hasToken: !!token,
    tokenLength: token ? token.length : 0
  });

  if (!token) {
    console.log("Auth Middleware - No token provided");
    return res.status(401).json({
      error: "Access denied! No Token provided",
    });
  }

  try {
    console.log("Auth Middleware - Attempting to verify token...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Auth Middleware - Token verified successfully for user:", payload["sub"]);

    //add user info to req.user
    req.user = {
      userId: payload["sub"],
      email: payload["email"],
      name: payload["name"],
    };

    //Add User ID to headers for downstream services
    req.headers["x-user-id"] = payload["sub"];

    //optional
    req.headers["x-user-email"] = payload["email"];
    req.headers["x-user-name"] = payload["name"];

    console.log("Auth Middleware - Headers set:", {
      "x-user-id": req.headers["x-user-id"],
      "x-user-email": req.headers["x-user-email"]
    });

    next();
  } catch (err) {
    console.error("Auth Middleware - Token verification failed:", {
      error: err.message,
      tokenSample: token ? token.substring(0, 50) + "..." : "none",
      googleClientId: process.env.GOOGLE_CLIENT_ID ? "set" : "not set",
      audience: process.env.GOOGLE_CLIENT_ID
    });
    res.status(401).json({
      error: "Invalid Token!",
      details: err.message
    });
  }
}

module.exports = authMiddleware;
