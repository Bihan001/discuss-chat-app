import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import emojiIcon from '../assets/tag_faces.svg';
import micIcon from '../assets/mic.svg';
import sendIcon from '../assets/send.svg';
import firebase from '../firebase';
import { connect } from 'react-redux';
import SendFileModal from './sendFileModal';

const ChatInputBox = ({ user: { currentContact, user } }) => {
  const [uploadDetails, setUploadDetails] = useState({
    uploadState: '',
    uploadTask: null,
    uploadPercentage: 0,
  });
  const [file, setFile] = useState(null);
  const [messagesRef] = useState(firebase.database().ref('messages'));
  const [storageRef] = useState(firebase.storage().ref());
  const [msg, setMsg] = useState('');
  const [isUploadModalOpen, setUploadModalVisibility] = useState(false);
  const sendMsg = async (fileURL = '') => {
    try {
      if (!fileURL && !msg.trim()) return;
      if (fileURL != '')
        await messagesRef.child(currentContact.id).push().set({
          fileURL: fileURL,
          user: user.uid,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
      else
        await messagesRef.child(currentContact.id).push().set({
          message: msg,
          user: user.uid,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
      setMsg('');
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (uploadDetails.uploadTask != null) {
      const pathToUpload = currentContact.id;
      const ref = messagesRef;
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
            sendFileMessage(url);
          });
        }
      );
    }
  }, [uploadDetails.uploadTask]);
  const uploadFile = async (e) => {
    try {
      e.preventDefault();
      const metadata = { contentType: mime.lookup(file.name) };
      const filepath = `chat/public/${uuidv4()}.${file.name.split('.').pop()}`;
      setUploadDetails({
        ...uploadDetails,
        uploadState: 'uploading',
        uploadTask: storageRef.child(filepath).put(file, metadata),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const sendFileMessage = (url) => {
    console.log(url);
    setFile(null);
    toggleUploadModalVisibility();
    sendMsg(url);
  };

  const toggleUploadModalVisibility = () => setUploadModalVisibility((v) => !v);

  return (
    <div className='chat-input-box'>
      <SendFileModal
        file={file}
        setFile={setFile}
        uploadFile={uploadFile}
        isOpen={isUploadModalOpen}
        toggleModal={toggleUploadModalVisibility}
      />
      <div className='icon emoji-selector'>
        <img src={emojiIcon} alt='' />
      </div>
      <div className='icon emoji-selector' onClick={() => toggleUploadModalVisibility()}>
        <img src={emojiIcon} alt='' />
      </div>
      <div className='chat-input'>
        <input
          type='text'
          placeholder='Type a message'
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => (e.key === 'Enter' ? sendMsg() : null)}
        />
      </div>

      <div className='icon send' onClick={() => sendMsg()}>
        <img src={sendIcon} alt='' />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(ChatInputBox);
