import mongoose from "mongoose";
// require("dotenv").config({ path: ".env.local" });
//function to connect to mangoose databse

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });
    console.log(process.env.MONGODB_URL);
    await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`);
  } catch (error) {
    console.log(error);
  }
};
