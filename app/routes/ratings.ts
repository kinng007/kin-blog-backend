import express from "express";
import Rating from "../models/ratings";
import { TUser } from "../models/users";
import nodemailer from "nodemailer";
import config from "./../config";

const router = express.Router({ mergeParams: true });

router.get("/", async (request, response) => {
  const user: TUser = <TUser>response.locals.user;
  if (!user) {
    response.status(401);
    response.json(response.locals.err);
  }
  console.log(user);
  try {
    const exists = await Rating.exists({ user: user._id.toString() });
    if (exists) {
      const rating = await Rating.findOne({ user: user._id.toString() });
      console.info(rating);
      response.send(rating);
    } else {
      response.send({});
    }
  } catch (err) {
    console.error(err);
    response.sendStatus(500);
  }
});

router.post("/", async (request, response) => {
  const user: TUser = <TUser>response.locals.user;
  if (!user) {
    response.status(401);
    response.json(response.locals.err);
  }
  const { score, comment } = request.body;

  if (!score) return response.sendStatus(400);

  try {
    const existingRating = await Rating.exists({ user: user._id.toString() });
    const rating = existingRating
      ? await Rating.findOneAndUpdate(
          { user: user._id.toString() },
          { score, comment }
        )
      : await new Rating({ score, comment, user: user._id.toString() }).save();
    await sendEmail(user, rating);
    response.send(rating);
  } catch (err) {
    console.error(err);
    response.sendStatus(500);
  }
});

async function sendEmail(user: TUser, rating: any) {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Kin Blog 👻" <kinblog@projects.com>', // sender address
    to: config.devEmail, // list of receivers
    subject: `Kin Blog was rated by ${user.displayName} [${user.userName}]`, // Subject line
    html: `Rating Score: <b>${rating.score}</b><br/>Rating Comment: <b>${rating.comment}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

export default router;
