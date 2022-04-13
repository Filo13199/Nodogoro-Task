var axios = require("axios");

const tokenEndpoint = "https://dev-sbjztdyr.us.auth0.com/oauth/token";

 oAuth = (req, res, next) => {
 

  const reqBody={}
  reqBody.client_id=process.env.AUTH0_CLIENTID
  reqBody.client_secret=process.env.AUTH0_SECRET
  reqBody.audience=`https://${process.env.AUTH0_DOMAIN}/api/v2/`
  reqBody.grant_type="client_credentials"
  axios.post(tokenEndpoint, reqBody,{'content-type': 'application/json'})
  .then(response => {
    req.oauth=response.data;
    next();
  })
  .catch(err => {
    console.log(err);
    return res.status(403).json(`Reason: ${err.message}`);
  })
}

module.exports = oAuth;