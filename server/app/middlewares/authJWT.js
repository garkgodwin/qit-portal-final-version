const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants/configs");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  req.isRoleVerified = false;
  let bearerToken = req.header("Authorization");
  if (
    !bearerToken ||
    (typeof bearerToken === "string" && bearerToken.includes("undefined"))
  ) {
    return res.status(403).send({ message: "No token provided" });
  }
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      let message = err.message.includes("expired")
        ? "Your credentials has expired."
        : "Token provided is invalid";
      return res.status(403).send({
        message: message,
      });
    }
    req.userId = decoded.id;
    return next();
  });
};

isAdmin = async (req, res, next) => {
  if (req.isRoleVerified) {
    return next();
  }
  User.findById(req.userId)
    .then((data) => {
      if (data) {
        if (data.role === 1) {
          req.isRoleVerified = true;
          return next();
        } else {
          req.isRoleVerified = false;
          return next();
        }
      } else {
        return res.status(401).send({
          message: "Unauthorized.",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Something went wrong while user with admin role",
      });
    });
};

isRegistrar = (req, res, next) => {
  if (req.isRoleVerified) {
    return next();
  }
  User.findById(req.userId)
    .then((data) => {
      if (data) {
        if (data.role === 2) {
          req.isRoleVerified = true;
          return next();
        } else {
          req.isRoleVerified = false;
          return next();
        }
      } else {
        return res.status(401).send({
          message: "Unauthorized.",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Something went wrong while user with registrar role",
        error: error,
      });
    });
};

isInstructor = (req, res, next) => {
  if (req.isRoleVerified) {
    return next();
  }
  User.findById(req.userId)
    .then((data) => {
      if (data) {
        if (data.role === 3) {
          req.isRoleVerified = true;
          return next();
        } else {
          req.isRoleVerified = false;
          return next();
        }
      } else {
        return res.status(401).send({
          message: "Unauthorized.",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Something went wrong while user with instructor role",
        error: error,
      });
    });
};

isStudent = (req, res, next) => {
  if (req.isRoleVerified) {
    return next();
  }
  User.findById(req.userId)
    .then((data) => {
      if (data) {
        if (data.role === 4) {
          req.isRoleVerified = true;
          return next();
        } else {
          req.isRoleVerified = false;
          return next();
        }
      } else {
        return res.status(401).send({
          message: "Unauthorized.",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Something went wrong while user with student role",
        error: error,
      });
    });
};

isGuardian = (req, res, next) => {
  if (req.isRoleVerified) {
    return next();
  }
  User.findById(req.userId)
    .then((data) => {
      if (data) {
        if (data.role === 5) {
          req.isRoleVerified = true;
          return next();
        } else {
          return res.status(401).send({
            message: "Unauthorized.",
          });
        }
      } else {
        return res.status(401).send({
          message: "Unauthorized.",
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Something went wrong while user with guardian role",
        error: error,
      });
    });
};

module.exports = {
  verifyToken,
  isAdmin,
  isRegistrar,
  isInstructor,
  isStudent,
  isGuardian,
};
