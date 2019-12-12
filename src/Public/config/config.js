import axios from 'axios';

// import { API_KEY } from 'react-native-dotenv';

API_KEY = 'https://compliance990.herokuapp.com/';

// const header = async () => {
//   return {
//     headers: {
//       Authorization: `Bearer ${userToken}`,
//       'x-scope': xScope
//     }
//   };
// };

const post = async (url, data, header) => {
  return await axios.post(`${API_KEY + url}`, data, header)
};

export default { post };
