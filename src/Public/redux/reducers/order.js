const initialState = {
  data: []
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDER_FULFILLED':
      return {
        ...state,
        data: action.payload
      };

    default:
      return state;
  }
};

export default order;
