const secrets = "../../secrets.js";

function checkSession(req, res, next) {
  if (req.session) next();
  else res.status(403).end("Not in session");
}

function checkAPIAuth(req, res, next) {
  if (req.body.secret === secrets.auth.apiToken) next();
  else res.status(403).end("Not authorized");
}

module.exports = {
  checkSession,
  checkAPIAuth
};
