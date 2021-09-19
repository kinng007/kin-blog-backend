import express from "express";
import { User } from "../models/users";
import { TUser } from "./../models/users";
import { TokenPayload } from "google-auth-library";

const router = express.Router({ mergeParams: true });

router.get("/me", (request, response) => {
  response.send(response.locals.user);
});

router.get("/", (request, response) => {
  User.find({}, (err, res) => {
    if (err) {
      console.error(err);
      return response.sendStatus(500);
    }
    if (res.length === 0) return response.sendStatus(404);
    response.send(res);
  });
});

router.post("/", async (request, response) => {
  const user: TUser = <TUser>response.locals.user;
  const tokenPayload: TokenPayload = <TokenPayload>response.locals.tokenPayload;

  if (!tokenPayload) {
    response.status(401);
    response.json(response.locals.err);
  } else {
    const { displayName, introduction } = request.body;

    if (!!user) {
      //user already exists so update intro
      const userU = await User.findOneAndUpdate(
        { _id: user._id.toString() },
        {
          displayName,
          introduction: introduction || "Test Intro",
          pictureUrl: tokenPayload.picture,
        }
      );
      response.send(userU);
    } else {
      const userN = await new User({
        displayName: displayName,
        userName: tokenPayload.email,
        introduction: introduction || "Test Intro",
        pictureUrl: tokenPayload.picture,
      }).save();
      response.send(userN);
    }
  }
});

router.get("/:id", (request, response) => {
  const { id } = request.params;

  User.findOne({ _id: id }, (err, res) => {
    if (err) {
      console.error(err);
      return response.sendStatus(500);
    }

    if (!res) return response.sendStatus(404);
    response.send(res);
  });
});

router.get("/userName/:userName", (request, response) => {
  const { userName } = request.params;

  User.findOne({ userName: userName }, (err, res) => {
    if (err) {
      console.error(err);
      return response.sendStatus(500);
    }

    if (!res) return response.sendStatus(404);
    response.send(res);
  });
});

router.put("/:id", async (request, response) => {
  const user: TUser = <TUser>response.locals.user;

  const { id } = request.params;
  const { displayName, userName, introduction } = request.body;

  if (!displayName || !userName || !introduction)
    return response.sendStatus(400);

  User.findOneAndUpdate({ _id: id }, { user, userName, introduction })
    .then((res) => response.send(res))
    .catch((e) => {
      console.error(e);
      response.sendStatus(500);
    });
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  User.deleteOne({ _id: id })
    .then(() => response.sendStatus(200))
    .catch((e) => {
      console.error(e);
      response.sendStatus(500);
    });
});

export default router;
