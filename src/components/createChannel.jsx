import React, { useState } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import firebase from '../firebase';

const CreateChannel = ({ user, isOpen, toggleVisibility }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channelsRef] = useState(firebase.database().ref('channels'));
  const [usersRef] = useState(firebase.database().ref('users'));
  const createChannel = async (e) => {
    try {
      e.preventDefault();
      if (!name.trim()) return;
      const key = channelsRef.push().key;
      const newGroup = {
        id: key,
        name: name,
        description: description,
        users: [user.uid],
        createdBy: user.uid,
        dateCreated: firebase.database.ServerValue.TIMESTAMP,
      };
      await channelsRef.child(key).update(newGroup);
      //await channelsRef.child(key).child('users').child(user.uid).set({ key: user.uid });
      // await usersRef.child(user.uid).child('channels').child(key).set({ key });
      let snap = await usersRef.child(user.uid).once('value');
      let snapUser = snap.val();
      if (snapUser.channels) {
        if (!snapUser.channels.includes(key)) {
          snapUser.channels.push(key);
        }
      } else {
        snapUser.channels = [key];
      }
      await usersRef.child(user.uid).update(snapUser);
      setName('');
      setDescription('');
      toggleVisibility();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MDBModal isOpen={isOpen} toggle={toggleVisibility}>
      <MDBModalHeader toggle={toggleVisibility}>Create new Channel</MDBModalHeader>
      <MDBModalBody>
        <div className='input-group mb-3'>
          <span className='input-group-text' id='basic-addon3'>
            Channel Name
          </span>
          <input
            type='text'
            className='form-control'
            aria-describedby='basic-addon3'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='input-group'>
          <span className='input-group-text'>Channel Description</span>
          <textarea
            className='form-control'
            aria-label='Channel Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={toggleVisibility}>
          Close
        </MDBBtn>
        <MDBBtn color='primary' onClick={(e) => createChannel(e)}>
          Create
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default CreateChannel;
