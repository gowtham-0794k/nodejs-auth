const userValidation = require('../../validations/user.validation');
const _ = require('lodash');
const dbCon = require('../../connections/mongodb');
const bcrypt = require('bcrypt');
const { signAccessToken } = require('../../helpers/jwt_helpers');

// signup

module.exports.signUp = async function (req, res) {
  try {
    const { email, password } = req.body;
    const { db } = req.headers;
    const validateUser = userValidation.signUpValidation(req.body);

    if (validateUser) {
      if (!db) {
        res.status(400).json({
          code: 400,
          error: 'Please add db in the header',
        });
      } else {
        const connection = await connectToDb(db, 'user_list');
        const userExist = await connection.findOne({
          email: email,
        });
        if (userExist)
          return res.status(400).send({
            code: 400,
            message: `${email} is already been registered`,
          });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let userData = req.body;
        userData['password'] = hashedPassword;
        userData['access_token'] = '';
        const createUser = await connection.insertOne(userData);
        if (createUser) {
          return res.status(200).json({ code: 200, message: 'success' });
        }
      }
    } else {
      res.status(422).json({
        code: 422,
        error:
          'You must provide email, password, name, contact, address, gender and country',
      });
    }
  } catch (error) {
    if (error)
      return res.status(422).send({
        code: 422,
        error: 'Something went wrong!',
      });
  }
};

// signIn

module.exports.signIn = async function (req, res) {
  try {
    const { email, password } = req.body;
    const { db } = req.headers;
    if (!email || !password || !db)
      return res.status(422).json({
        code: 422,
        error: 'You must provide email, password and db',
      });
    const connection = await connectToDb(db, 'user_list');
    const user = await connection.findOne({ email: email });
    if (!user)
      return res.status(400).json({
        code: 400,
        error: `${email} not exist!`,
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        code: 400,
        error: 'Invalid password!',
      });
    const user_id = user._id;
    const accessToken = await signAccessToken(user._id.toString());
    const updateUserToken = await connection.updateOne(
      { _id: user_id },
      {
        $set: {
          access_token: accessToken,
        },
      }
    );

    res.status(200).send({ code: 200, accessToken });
  } catch (error) {
    if (error)
      return res.status(422).send({
        code: 422,
        error: 'Something went wrong!',
      });
  }
};

// getusers data

module.exports.getUserData = async function (req, res) {
  try {
    const { db, email, access_token } = req.headers;
    const { name, contact } = req.params;
    if (!email || !access_token || !db)
      return res.status(422).json({
        code: 422,
        error: 'You must provide email, access_token and db',
      });
    const connection = await connectToDb(db, 'user_list');
    const user = await connection
      .aggregate([
        {
          $match: {
            $or: [{ name: name }, { contact: contact }],
          },
        },
      ])
      .toArray();
    if (!user)
      return res.status(400).json({
        code: 400,
        error: `${email} not exist!`,
      });
    let userData = _.map(user, (row) =>
      _.pick(row, 'email', 'name', 'contact', 'address', 'gender', 'country')
    );

    res.status(200).send({ code: 200, userData });
  } catch (error) {
    if (error)
      return res.status(422).send({
        code: 422,
        error: 'Something went wrong!',
      });
  }
};

// logout

module.exports.logout = async function (req, res) {
  try {
    const { db, email, access_token } = req.headers;
    if (!email || !access_token || !db)
      return res.status(422).json({
        code: 422,
        error: 'You must provide email, access_token and db',
      });
    const connection = await connectToDb(db, 'user_list');
    const user = await connection.findOne({ email: email });
    const user_id = user._id;
    const updateUserToken = await connectToDb(db, 'user_list').updateOne(
      { _id: user_id },
      {
        $set: {
          access_token: '',
        },
      }
    );
    if (!user)
      return res.status(400).json({
        code: 400,
        error: `${email} not exist!`,
      });

    res.status(200).send({ code: 200, message: 'Logout success!' });
  } catch (error) {
    if (error)
      return res.status(422).send({
        code: 422,
        error: 'Something went wrong!',
      });
  }
};

function connectToDb(dbName, collectionName) {
  const data_base = dbCon.get(dbName);
  const db_connection = data_base.collection(collectionName);
  return db_connection;
}
