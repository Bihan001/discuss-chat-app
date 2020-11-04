import * as types from './types';
import firebase from '../firebase';

export const setUser = (user) => (dispatch) => {
  dispatch({
    type: types.SET_USER,
    payload: user,
  });
};

export const clearUser = () => (dispatch) => {
  dispatch({
    type: types.CLEAR_USER,
  });
};

export const setCurrentContact = (contactID) => async (dispatch) => {
  const snap = await firebase.database().ref('channels').child(contactID).once('value');
  dispatch({
    type: types.SET_CONTACT,
    payload: snap.val(),
  });
};
