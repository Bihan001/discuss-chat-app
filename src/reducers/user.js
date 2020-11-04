import * as types from '../actions/types';

const initialState = {
  user: null,
  loading: true,
  currentContact: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.SET_USER:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case types.CLEAR_USER:
      return {
        ...state,
        user: null,
        loading: false,
      };
    case types.SET_CONTACT:
      return {
        ...state,
        currentContact: payload,
      };
    default:
      return state;
  }
}
