"use strict";
// Import the 'mongoose' module to create the database connection
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import INSTRUMENTOS from "../constants/instrumentos.constants.js";

// Create the 'users' collection schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    rut: {
      type: String,
      required: true,
      unique: true,
    },
    fecha_nacimiento: {
      type: Date,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    instrumento: {
      type: String,
      enum: INSTRUMENTOS,
      required: false,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    versionKey: false,
  },
);

/** Encrypts the user's password */
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/** Compares the user's password */
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

/** 'User' data model */
const User = mongoose.model("User", userSchema);

// Export the 'User' data model
export default User;
