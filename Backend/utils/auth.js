const crypto = require("crypto");

// Convert a buffer to a Base64Url string
function base64url(source) {
  let encoded = source.toString("base64");
  encoded = encoded.replace(/=/g, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");
  return encoded;
}

// Generate JWT signature and build token
function signJWT(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const token = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", secret).update(token).digest();
  const encodedSignature = base64url(signature);
  return `${token}.${encodedSignature}`;
}

// Verify JWT signature and parse payload
function verifyJWT(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const computedSignature = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest();
  if (base64url(computedSignature) !== signature) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(payload, "base64").toString());
  } catch (err) {
    return null;
  }
}

// Password hashing helper
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

// Password verification helper
function verifyPassword(password, storedPassword) {
  const [salt, hash] = storedPassword.split(":");
  const computedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === computedHash;
}

// Express JWT Auth Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "zerodha_clone_secret_key_159";
    const user = verifyJWT(token, secret);
    if (user) {
      req.user = user;
      return next();
    }
  }
  return res.status(401).json({ error: "Unauthorized access" });
}

module.exports = {
  signJWT,
  verifyJWT,
  hashPassword,
  verifyPassword,
  authenticateJWT
};
