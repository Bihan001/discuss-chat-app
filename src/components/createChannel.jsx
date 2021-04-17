import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../firebase';

let validFileExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

const CreateChannel = ({ user, isOpen, toggleVisibility }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [storageRef] = useState(firebase.storage().ref());
  const [channelsRef] = useState(firebase.database().ref('channels'));
  const [usersRef] = useState(firebase.database().ref('users'));
  const [uploadDetails, setUploadDetails] = useState({
    uploadState: '',
    uploadTask: null,
    uploadPercentage: 0,
  });

  useEffect(() => {
    if (uploadDetails.uploadTask != null) {
      uploadDetails.uploadTask.on(
        'state_changed',
        (snap) => {
          console.log(snap);
          setUploadDetails({
            ...uploadDetails,
            uploadPercentage: Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
          });
        },
        (err) => console.log(err),
        () => {
          uploadDetails.uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            createChannel(url);
          });
        }
      );
    }
  }, [uploadDetails.uploadTask]);

  const uploadImgFile = () => {
    if (validFileExtensions.includes(mime.lookup(imgFile.name))) {
      const metadata = { contentType: mime.lookup(imgFile.name) };
      const filepath = `chat/icons/${uuidv4()}.${imgFile.name.split('.').pop()}`;
      setUploadDetails({
        ...uploadDetails,
        uploadState: 'uploading',
        uploadTask: storageRef.child(filepath).put(imgFile, metadata),
      });
    } else console.log('Upload only jpeg or png file');
  };

  const createChannel = async (url = '') => {
    try {
      if (!name.trim()) return;
      setImgFile(null);
      setUploadDetails({ ...uploadDetails, uploadState: 'done' });
      const key = channelsRef.push().key;
      const newGroup = {
        id: key,
        name: name,
        description: description,
        avatar: url,
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
        <div className='input-group mb-3'>
          <span className='input-group-text'>Channel Description</span>
          <textarea
            className='form-control'
            aria-label='Channel Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className='input-group'>
          <div className='input-group-prepend'>
            <span className='input-group-text' id='imgIconInput'>
              Channel Icon
            </span>
          </div>
          <div className='custom-file'>
            <input
              type='file'
              className='custom-file-input'
              id='iconInput'
              aria-describedby='imgIconInput'
              onChange={(e) => setImgFile(e.target.files[0])}
            />
            <label className='custom-file-label' htmlFor='iconInput'>
              {imgFile ? imgFile.name : 'Choose file...'}
            </label>
          </div>
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color='secondary' onClick={toggleVisibility}>
          Close
        </MDBBtn>
        <MDBBtn color='primary' onClick={() => (imgFile ? uploadImgFile() : createChannel())}>
          Create
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default CreateChannel;
