import React, { useState } from 'react';
import firebase from '../firebase';

const CreateChannel = ({ user }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channelsRef] = useState(firebase.database().ref('channels'));
  const createModal = async (e) => {
    e.preventDefault();
    const key = channelsRef.push().key;
    const newGroup = {
      id: key,
      name: name,
      description: description,
      createdBy: user.uid,
      dateCreated: firebase.database.ServerValue.TIMESTAMP,
    };
    await channelsRef.child(key).update(newGroup);
    setName('');
    setDescription('');
  };

  return (
    <div className='modal fade' id='CreateChannelModal' tabIndex='-1' aria-labelledby='createModal' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='createModal'>
              Create new Channel
            </h5>
            <button type='button' className='btn-close' data-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>
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
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-dismiss='modal'>
              Close
            </button>
            <button type='button' className='btn btn-primary' onClick={(e) => createModal(e)}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChannel;
