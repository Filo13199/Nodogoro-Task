var tmp;
 if (process.env.NODE_ENV === "production"){
  tmp = "https://nodogoro-ecommerce.herokuapp.com/api/";
}
else{
  //tmp = 'http://192.168.1.12:3000/api/';
  tmp = "http://localhost:5000/api/"
}  
//tmp = "http://localhost:5000/api/"

export const link = tmp;
