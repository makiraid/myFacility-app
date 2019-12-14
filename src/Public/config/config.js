import axios from 'axios';

import { HOST_NAME } from 'react-native-dotenv';

// const HOST_NAME = 'https://compliance990.herokuapp.com/';

// const header = async () => {
//   return {
//     headers: {
//       Authorization: `Bearer ${userToken}`,
//       'x-scope': xScope
//     }
//   };
// };

const post = (url, data, header) => {
  return axios.post(`${HOST_NAME + url}`, data, header);
};

export default { post };
