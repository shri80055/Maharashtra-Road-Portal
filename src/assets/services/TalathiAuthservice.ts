// import axios from "axios";

// export const getTalathiUser = (ferfarToken: string) => {
//   return axios.get("https://localhost:7094/api/TalathiUsers/GetUserInfo", {
//     params: {
//       token: ferfarToken,
//     },
//   });
// };


 import axios from "axios";

//  const API_URL ="http://localhost:5152/api/talathiusers/login";

 const API_URL = "https://localhost:7094/api/TalathiUsers/GetUserInfo",

 export const getTalathiUser = (fertoken:string)=>{

     return axios.get(API_URL, { params:{Eferfar:fertoken} });

 };