import mongoose, { Schema, Model, SchemaOptions } from "mongoose";

export interface TBlog {
  id: number,
  title: string,
  author: string,
  subtitle: string,
  content: string
}

const schemaOptions: SchemaOptions = {
  timestamps: { createdAt: 'createdOn', updatedAt: 'lastUpdatedOn' },
};

const BlogS = new Schema<TBlog, Model<TBlog>, TBlog>({
  id: { type: Number, unique: true, sparse: true },
  title: { type: String, required: true, max: 255 },
  author: { type: String, required: true, max: 60 },
  subtitle: { type: String, required: true, max: 511 },
  content: { type: String, required: true }
}, schemaOptions);


export const Blog = mongoose.model<TBlog>("Blog", BlogS);
