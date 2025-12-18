const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.code = 401;
      throw new Error("User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      res.code = 403;
      throw new Error("Permission denied");
    }
    next();
  };
};

module.exports = authorizedRoles;
