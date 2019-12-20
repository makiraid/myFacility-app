const initialState = {
  data: ''
};

const pickedOrder = (state = initialState, action) => {
  switch (action.type) {
    case 'PICKED_ORDER_FULFILLED':
      return {
        ...state,
        data: action.payload
      };

    case 'CLEAR_PICKED_ORDER_FULFILLED':
      return {
        ...state,
        data: ''
      };

    default:
      return state;
  }
};

export default pickedOrder;
