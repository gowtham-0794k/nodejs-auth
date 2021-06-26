const JWT = require('jsonwebtoken');
const dbCon = require('../connections/mongodb');

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET || '123';
      const options = {
        expiresIn: '1h',
        issuer: 'stak.com',
        audience: userId.toString(),
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          return;
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: async (req, res, next) => {
    const { db, email, access_token } = req.headers;
    if (!email || !access_token || !db)
      return res.status(422).json({
        code: 422,
        error: 'You must provide email, access_token and db',
      });
    if (!req.headers['access_token'])
      return res.status(400).json({
        code: 400,
        error: 'Unauthorized',
      });

    const data_base = dbCon.get(db);
    const userCollection = data_base.collection('user_list');
    const user = await userCollection.findOne({ email: email });
    if (!user.access_token)
      return res.status(400).send({
        code: 400,
        message: `${access_token} is not available!`,
      });
    const bearerToken = access_token.split(' ');
    const token = bearerToken[1];
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || '123',
      (err, payload) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
          return res.status(400).json({
            code: 400,
            error: message,
          });
        }
        req.payload = payload;
        next();
      }
    );
  },
};
