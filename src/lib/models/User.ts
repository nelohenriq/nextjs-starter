import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    this.password = await bcrypt.hash(user.password, 10);
  }
  return next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
