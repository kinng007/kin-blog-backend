import express from "express";
import cors from "cors";
//import cookieParser from "cookie-parser";
import tasks from "./tasks";
import users from "./users";
import auth from "./auth";
import blogs from "./blogs";
import ratings from "./ratings";

const router = express.Router({ mergeParams: true });
var corsOptions = {
  origin: [
    "http://localhost:4200",
    "https://kinblog.mdbgo.io",
    "https://blog-frontend-svc-blog-ui-kinng007.cloud.okteto.net",
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.use(cors(corsOptions));
router.options("*", cors(corsOptions)); // include before other routes

router.get("/", (req, res) => res.sendFile("index.html"));

router.use("/api/v1", auth);

router.use("/api/v1/blogs", blogs);

router.use("/api/v1/tasks", tasks);

router.use("/api/v1/users", users);

router.use("/api/v1/ratings", ratings);

export default router;
