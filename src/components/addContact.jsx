import React, { useState } from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { connect } from 'react-redux';
import firebase from '../firebase';
const AddContact = ({ isOpen, toggleVisibility, user: { user } }) => {
  const [contactID, setContactID] = useState('');
  const [usersRef] = useState(firebase.database().ref('users'));

  const addContact = async () => {
    try {
      if (!contactID.trim()) return;
      if (contactID === user.uid) return;
      let snap = await usersRef.child(contactID).once('value');
      let snapUser1 = snap.val();
      if (snapUser1.contacted) {
        if (!snapUser1.contacted.includes(user.uid)) {
          snapUser1.contacted.push(user.uid);
        } else console.log("You are already in user's contacted list");
      } else {
        snapUser1.contacted = [user.uid];
      }
      await usersRef.child(contactID).update(snapUser1);
      snap = await usersRef.child(user.uid).once('value');
      let snapUser2 = snap.val();
      if (snapUser2.contacted) {
        if (!snapUser2.contacted.includes(contactID)) {
          snapUser2.contacted.push(contactID);
        } else console.log('User is already in your contacted list');
      } else {
        snapUser2.contacted = [contactID];
      }
      await usersRef.child(user.uid).update(snapUser2);
      //updateContacts(snapUser1, contactID);
      setContactID('');
      toggleVisibility();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MDBModal isOpen={isOpen} toggle={toggleVisibility}>
      <MDBModalHeader toggle={toggleVisibility}>Add Contact</MDBModalHeader>
      <MDBModalBody>
        <div className='form-group'>
          <label htmlFor='addContactInput'>Contact ID</label>
          <input
            type='text'
            className='form-control'
            id='addContactInput'
            value={contactID}
            onChange={(e) => setContactID(e.target.value)}
          />
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={toggleVisibility}>
          Close
        </MDBBtn>
        <MDBBtn color='primary' onClick={() => addContact()}>
          Add
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(AddContact);
