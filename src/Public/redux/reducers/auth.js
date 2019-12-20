const initialState = {
  authToken: ''
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_REGISTER_FULFILLED':
      return {
        ...state,
        message: 'success'
      };

    case 'POST_LOGIN_FULFILLED':
      return {
        ...state,
        authToken: action.payload.data.user,
        message: 'success'
      };

    case 'LOGOUT_FULFILLED':
      return {
        authToken: ''
      };

    default:
      return state;
  }
};

export default auth;
