import { OAuth2Client, TokenPayload } from "google-auth-library";
import express from "express";
import {} from "express-session";
import config from "../config";
import { User, TUser } from "./../models/users";

const client = new OAuth2Client(config.googleClientId);

const router = express.Router({ mergeParams: true });

router.use(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.locals.err = { errorMessage: "cookie not found" };
    next();
  } else {
    const token = authorization.replace("gauth=", "");
    if (!token) {
      res.locals.err = { errorMessage: "gAuth token not found" };
      next();
    } else {
      await handleToken(
        token,
        async (tokenPayload) => {
          const { email } = tokenPayload;
          res.locals.tokenPayload = tokenPayload;

          const exists = await User.exists({ userName: email });
          let user: TUser | undefined = undefined;
          if (exists) {
            user = await User.findOne({ userName: email });
          }

          res.locals.user = user;
          next();
        },
        () => {
          res.locals.err = { errorMessage: "gAuth token invalid" };
          next();
        }
      );
    }
  }
});

const handleToken = async function (
  token: string,
  callback: (tokenPayload: TokenPayload) => void,
  errCallback?: () => void
): Promise<void> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.googleClientId,
  });
  if (!!ticket.getPayload()) {
    callback(<TokenPayload>ticket.getPayload());
  } else {
    errCallback && errCallback();
  }
};

export default router;
