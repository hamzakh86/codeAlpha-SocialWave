require("dotenv").config();
const User = require("../models/user.model");
const Token = require("../models/token.model");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const opts = {};
const jwt = require("jsonwebtoken");
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
opts.passReqToCallback = true;

passport.use(
  new JwtStrategy(opts, async function (req, jwt_payload, done) {
    try {
      const user = await User.findOne({ email: jwt_payload.email });

      if (user) {
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        
        // Find the exact token record corresponding to the current request's access token
        let refreshTokenFromDB = await Token.findOne({
          user: user._id,
          accessToken,
        });

        // Fallback to checking by user if exact match is not found
        if (!refreshTokenFromDB) {
          refreshTokenFromDB = await Token.findOne({
            user: user._id,
          });
        }

        if (!refreshTokenFromDB) {
          return done(null, false);
        }

        let refreshPayload;
        try {
          refreshPayload = jwt.verify(
            refreshTokenFromDB.refreshToken,
            process.env.REFRESH_SECRET
          );
        } catch (verifyError) {
          // If the refresh token has expired or is signed with a different key, 
          // it's an unauthorized session rather than a server error
          return done(null, false);
        }

        if (refreshPayload.email !== jwt_payload.email) {
          return done(null, false);
        }

        const tokenExpiration = new Date(jwt_payload.exp * 1000);
        const now = new Date();
        const timeDifference = tokenExpiration.getTime() - now.getTime();

        if (timeDifference > 0 && timeDifference < 30 * 60 * 1000) {
          const payloadNew = {
            _id: user._id,
            email: user.email,
          };
          const newToken = jwt.sign(payloadNew, process.env.SECRET, {
            expiresIn: "6h",
          });

          return done(null, { user, newToken });
        }
        return done(null, { user });
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
