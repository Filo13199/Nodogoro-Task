const CryptoJS =require('crypto-js')
const mongoose=require("mongoose");
const axios=require("axios");
exports.getUserInfo = async(req,res)=>{
    try{
        const userId=req.user.sub;
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