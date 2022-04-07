var axios = require("axios");

const tokenEndpoint = "https://dev-sbjztdyr.us.auth0.com/oauth/token";

 oAuth = (req, res, next) => {
  var code = req.query.code;
  if(!code) {
    return res.status(401).send("Missing authorization code");
  }
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.AUTH0_CLIENTID);
  params.append("client_secret", process.env.AUTH0_SECRET)
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000/Home");

  axios.post(tokenEndpoint, params)
  .then(response => {
    req.oauth = response.data;
    next();
  })
  .catch(err => {
    console.log(err);
    return res.status(403).json(`Reason: ${err.message}`);
  })
}

module.exports = oAuth;