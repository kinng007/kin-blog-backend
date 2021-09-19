import mongoose, { ObjectId } from "mongoose";
const { Schema } = mongoose;

const RatingS = new Schema({
  id: { type: Number, unique: true, sparse: true },
  score: { type: Number, required: true },
  comment: { type: String, required: false, max: 1023 },
  user: { type: String, required: true, max: 60 },
});

export interface TRating {
  _id: ObjectId;
  score: number;
  user: string;
  comment?: string;
}

const Rating = mongoose.model("Rating", RatingS);

export default Rating;
