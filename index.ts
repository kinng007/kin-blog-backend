import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./app/config";
import routes from "./app/routes";

const { port, mongoUrl } = config;

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(routes);

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", (err:any) => console.error("MongoDB connection error:", err));
db.once("open", () => {
  console.log("Connected to DB");
  app.listen(port, () => console.log(`Listening on port: ${port}`));
});
