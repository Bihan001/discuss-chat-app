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

export const setCurrentChannel = (contact) => async (dispatch) => {
  //const snap = await firebase.database().ref('channels').child(contactID).once('value');
  dispatch({
    type: types.SET_CONTACT,
    payload: contact,
  });
};

export const setCurrentChatUser = (user, ownID) => async (dispatch) => {
  // let ids = user.id.split('/');
  // let otherID = '';
  // if (ids[0] === ownID) otherID = ids[1];
  // else otherID = ids[0];
  // let snap = await firebase.database().ref('users').child(otherID).once('value');
  // snap = snap.val();
  // if (snap.status !== user.status) {
  //   user.status = snap.status;
  // }
  dispatch({
    type: types.SET_CONTACT,
    payload: user,
  });
};
