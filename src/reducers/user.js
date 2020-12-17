import * as types from '../actions/types';

const initialState = {
  user: 'loading',
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
        currentUser: null,
        loading: false,
      };
    case types.CLEAR_USER:
      return {
        ...state,
        user: null,
        currentContact: null,
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
