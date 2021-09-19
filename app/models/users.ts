import mongoose, { ObjectId } from "mongoose";
const { Schema } = mongoose;

const UserS = new Schema({
  id: { type: Number, unique: true, sparse: true },
  displayName: { type: String, required: true, max: 255 },
  userName: { type: String, required: true, max: 60 },
  introduction: { type: String, required: true, max: 2047 },
  pictureUrl: { type: String }
});

export interface TUser {
  _id: ObjectId;
  displayName: string;
  userName: string;
  introduction: string;
  pictureUrl: string
}

export const User = mongoose.model("User", UserS);
