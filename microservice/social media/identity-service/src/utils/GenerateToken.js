const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RegisterToken = require("../model/RefreshToken");

const generateToken = async (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expireAt = new Date();
  expireAt.setDate(expireAt.getDate() + 7); //7 days

  await RegisterToken.create({
    token: refreshToken,
    access: accessToken,
    user: user._id,
    expireAt: expireAt,
  });

  return { accessToken, refreshToken };
};

module.exports = generateToken;
