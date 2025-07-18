import jwt from "jsonwebtoken";

// Function to generate token from  a user

export const generateToken = (userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET);
  return token;
};
