const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send({
      statusCode: 401,
      message: 'Accesso non autorizzato. Token mancante.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({
      statusCode: 401,
      message: 'Accesso non autorizzato. Token non valido.',
    });
  }
};

module.exports = authenticateUser;