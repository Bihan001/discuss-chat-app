import React, { useState } from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import { connect } from 'react-redux';
import firebase from '../firebase';

const JoinChannel = ({ isOpen, toggleVisibility, updateChannels, user: { user } }) => {
  const [channelID, setChannelID] = useState('');
  const [usersRef] = useState(firebase.database().ref('users'));
  const [channelsRef] = useState(firebase.database().ref('channels'));
  const joinChannel = async () => {
    try {
      if (!channelID.trim()) return;
      let snap = await channelsRef.child(channelID).once('value');
      if (!snap) return alert('No channel found');
      let snapChannel = snap.val();
      if (snapChannel.users) {
        if (!snapChannel.users.includes(user.uid)) {
          snapChannel.users.push(user.uid);
        } else console.log('User has already joined the channel');
      } else {
        snapChannel.users = [user.uid];
      }
      await channelsRef.child(channelID).update(snapChannel);
      snap = await usersRef.child(user.uid).once('value');
      let snapUser = snap.val();
      if (snapUser.channels) {
        if (!snapUser.channels.includes(channelID)) {
          snapUser.channels.push(channelID);
        } else console.log("Channel is already present in user's list");
      } else {
        snapUser.channels = [channelID];
      }
      await usersRef.child(user.uid).update(snapUser);
      //updateChannels(snapChannel);
      setChannelID('');
      toggleVisibility();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <MDBModal isOpen={isOpen} toggle={toggleVisibility}>
      <MDBModalHeader toggle={toggleVisibility}>Join Channel</MDBModalHeader>
      <MDBModalBody>
        <div className='form-group'>
          <label htmlFor='joinChannelInput'>Channel ID</label>
          <input
            type='text'
            className='form-control'
            id='joinChannelInput'
            value={channelID}
            onChange={(e) => setChannelID(e.target.value)}
          />
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={toggleVisibility}>
          Close
        </MDBBtn>
        <MDBBtn color='primary' onClick={() => joinChannel()}>
          Join
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(JoinChannel);
