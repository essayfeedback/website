const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cors = require("cors");
const admin = require("firebase-admin");
const secrets = require("./secrets");

const app = express();

const {
  mongodb: { username, password }
} = secrets;

mongoose.connect(`mongodb://${username}:${encodeURIComponent(password)}@ds161804.mlab.com:61804/essayfeedback`, { useNewUrlParser: true });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secret = secrets.firebase.secret;

app.use(
  cookieSession({
    keys: secret
  })
);

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(secrets.firebase)
  },
  "server"
);

app.use((req, res, next) => {
  req.firebaseServer = firebase;
  next();
});

app.use(require("./logger"));
app.use("/api/essays", require("./routes/essays"));
app.use("/api/users", require("./routes/users"));

app.post("/api/auth/login", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const token = req.body.token || "";
  firebase
    .auth()
    .verifyIdToken(token)
    .then(decodedToken => {
      req.session.decodedToken = decodedToken;
      return decodedToken;
    })
    .then(decodedToken => res.json({ status: true, decodedToken }))
    .catch(error => {
      res.json({ error });
    });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.decodedToken = null;
  res.json({ status: true });
});

const PORT = 3001;
app.listen(PORT, err => {
  if (err) throw err;
  console.info(`server ready at http://localhost:${PORT}`);
});
