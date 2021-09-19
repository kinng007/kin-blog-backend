import express from "express";
import { Blog, TBlog } from "../models/blogs";
import { TUser } from "./../models/users";

const router = express.Router({ mergeParams: true });

router.get("/all", (request, response) => {
  Blog.find({}, (err, res) => {
    if (err) {
      console.error(err);
      return response.sendStatus(500);
    }
    response.send(res);
  });
});

router.get("/", (request, response) => {
  const user: TUser = <TUser>response.locals.user;
  if (!user) {
    response.status(401);
    response.json(response.locals.err);
  } else {
    Blog.find({ author: user._id.toString() }, (err, res) => {
      if (err) {
        console.error(err);
        return response.sendStatus(500);
      }
      response.send(res);
    });
  }
});

router.get("/:id", (request, response) => {
  const { id } = request.params;

  Blog.findOne({ _id: id }, (err, res) => {
    if (err) {
      console.error(err);
      return response.sendStatus(500);
    }
    response.send(res);
  });
});

router.post("/", (request, response) => {
  const user: TUser = <TUser>response.locals.user;
  if (!user) {
    response.status(401);
    response.json(response.locals.err);
  } else {
    const { title, subtitle, content } = request.body;

    if (!title || !subtitle || !content) return response.sendStatus(400);

    const blog = new Blog({
      title,
      subtitle,
      author: user._id.toString(),
      content,
    });

    blog
      .save()
      .then((res) => response.send(res))
      .catch((e) => {
        console.error(e);
        response.sendStatus(500);
      });
  }
});

router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const user: TUser = <TUser>response.locals.user;
  if (!user) {
    response.status(401);
    response.json(response.locals.err);
  } else {
    const { title, subtitle, content } = request.body;

    if (!title || !subtitle || !content) return response.sendStatus(400);

    Blog.findOneAndUpdate(
      { _id: id },
      {
        title,
        subtitle,
        content,
      }
    )
      .then((res) => response.send(res))
      .catch((e) => {
        console.error(e);
        response.sendStatus(500);
      });
  }
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params;
  const user: TUser = <TUser>response.locals.user;
  if (!user) {
    response.status(401);
    response.json(response.locals.err);
  } else {
    const blog = await Blog.findOne({ _id: id });
    if (blog?.author !== user._id.toString()) {
      response.status(403);
      response.json({ errorMessage: "Only author of a blog can delete it" });
    } else {
      Blog.deleteOne({ _id: id })
        .then(() => response.sendStatus(200))
        .catch((e) => {
          console.error(e);
          response.sendStatus(500);
        });
    }
  }
});

export default router;
