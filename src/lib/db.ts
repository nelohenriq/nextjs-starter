import mongoose from "mongoose";

const connectDB = async () => {
  const connection = await mongoose.connection.readyState;

  if (connection === 1) {
    console.log("Already connected");
    return;
  }

  if (connection === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME,
      bufferCommands: false,
    });
    console.log("Already connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
