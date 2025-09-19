import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config.js';

const _SecretToken = SECRET_TOKEN;
const _TokenExpiryTime = "24h";

export const authorize = function (roles = []) {
  if (!Array.isArray(roles)) roles = [roles];

  return (req, res, next) => {
    function sendError(status, msg) {
      return res.status(status).json({
        message: msg,
      });
    }

    try {
    //extracting authorization header
      const token = req.headers["Authorization"] || req.headers["authorization"];

      if (!token) return sendError("Error: No Token"); // Token does not exist
      if (token.indexOf("Bearer") !== 0) return sendError(401,"Error: Token format invalid"); // Wrong format

      //verifying JWT 
      const tokenString = token.split(" ")[1];
      jwt.verify(tokenString, _SecretToken, (err, decodedToken) => {
        if (err) {
          console.log(err);
          return sendError(401,"Error: Broken Or Expired Token");
        }
        if (!decodedToken.role) return sendError(403,"Error: Role missing");
        const userRole = decodedToken.role;
        if (roles.indexOf(userRole) === -1)
          return sendError(403, "Error: User not authorized");

        req.user = decodedToken;
        next();
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error Occured" });
    }
  };
};

export const issueToken = function (user) {
  var token = jwt.sign({ ...user, iss: "Node-Auth" }, _SecretToken, {
    expiresIn: _TokenExpiryTime,
  });
  return token;
};

export const Roles = {
  User: ["user"],
  Admin: ["admin"],
  All: ["user", "admin"],
};