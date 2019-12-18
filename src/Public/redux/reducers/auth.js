const initialState = {
  data: ''
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_REGISTER_FULFILLED':
      return {
        ...state,
        isLoading: true,
        message: 'success'
      };

    case 'POST_LOGIN_FULFILLED':
      return {
        ...state,
        isLoading: true,
        authToken: action.payload.data.user,
        message: 'success'
      };

    case 'LOGOUT_FULFILLED':
      return {
        authToken: {
          role: null
        }
      };

    default:
      return state;
  }
};

export default auth;
