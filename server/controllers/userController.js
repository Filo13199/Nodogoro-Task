const CryptoJS =require('crypto-js')
const mongoose=require("mongoose");
const axios=require("axios");
exports.getUserInfo = async(req,res)=>{
    try{
        const userId=req.params.sub;
        const token=req.oauth.access_token;
        const url=`https://dev-sbjztdyr.us.auth0.com/api/v2/users/${userId}`;
        axios.get(url,{headers:{Authorization:`Bearer ${token}`}})
        .then(response=>{
            return res.send({data:response.data});
        })
        .catch(err=>{
            console.log(err);
            return res.status(403).json(`Reason: ${err.message}`);
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(400).send({error:err.message});
    }
}
exports.login = async(req,res)=>{
    try{
        const code=req.query.code;
        const domain='dev-sbjztdyr.us.auth0.com'
        const accessToken = await getAccessTokenSilently({
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
        });
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
        axios.get(userDetailsByIdUrl, {headers:{Authorization:`Bearer ${accessToken}`}})
        .then(res=>{
            return res.send({data:res.data});
        })
        .catch(err=>{
            console.log(err);
            return res.status(403).json(`Reason: ${err.message}`);
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(400).send({error:err.message});
    }
}
exports.updateUser = async(req,res)=>{
    try{
        const tokenEndpoint = "https://dev-sbjztdyr.us.auth0.com/oauth/token";
        const reqBody={}
        reqBody.client_id=process.env.AUTH0_CLIENTID
        reqBody.client_secret=process.env.AUTH0_SECRET
        reqBody.audience=`https://${process.env.AUTH0_DOMAIN}/api/v2/`
        reqBody.grant_type="client_credentials"
        axios.post(tokenEndpoint, reqBody,{'content-type': 'application/json'})
        .then(response => {
            const userId=req.params.sub;
            const token=response.data.access_token;
            const url=`https://dev-sbjztdyr.us.auth0.com/api/v2/users/${userId}`;
            const userData=req.body;
            axios.patch(url,userData,{headers:{Authorization:`Bearer ${token}`}})
            .then(response=>{
                console.log(response.data);
                return res.send({data:response.data});
            })
            .catch(err=>{
                console.log(err.response.data.message);
                return res.status(403).send({error:err.response.data.message});
            })
        })
        .catch(err => {
          console.log(err);
          return res.status(403).json(`Reason: ${err.message}`);
        })
       
    }
    catch(err){
        console.log(err.message);
        return res.status(400).send({error:err.message});
    }
}