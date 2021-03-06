import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MDBIcon } from 'mdbreact';
import mime from 'mime-types';
import emojiIcon from '../assets/tag_faces.svg';
import micIcon from '../assets/mic.svg';
import sendIcon from '../assets/send.svg';
import firebase from '../firebase';
import { connect } from 'react-redux';
import SendFileModal from './sendFileModal';
import ProgressBar from './progressBar';
import Picker from 'emoji-picker-react';

const ChatInputBox = ({ user: { currentContact, user } }) => {
  const [uploadDetails, setUploadDetails] = useState({
    uploadState: '',
    uploadTask: null,
    uploadPercentage: 0,
  });
  const [file, setFile] = useState(null);
  const [messagesRef, setMessagesRef] = useState(null);
  const [storageRef] = useState(firebase.storage().ref());
  const [msg, setMsg] = useState('');
  const [isUploadModalOpen, setUploadModalVisibility] = useState(false);
  const [isEmojiBoardVisible, setEmojiBoardVisibility] = useState(false);

  useEffect(() => {
    if (currentContact.isPrivate) {
      setMessagesRef(firebase.database().ref('private_messages'));
    } else {
      setMessagesRef(firebase.database().ref('messages'));
    }
  }, [currentContact]);

  const toggleEmojiBoardVisibility = () => setEmojiBoardVisibility((v) => !v);

  const sendMsg = async (fileURL = '') => {
    try {
      if (!fileURL && !msg.trim()) return;
      setMsg('');
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
    } catch (err) {
      console.log(err);
    }
  };

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
      const filepath = `chat/${currentContact.isPrivate ? currentContact.id : 'public'}/${uuidv4()}.${file.name
        .split('.')
        .pop()}`;
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
    setUploadDetails({ ...uploadDetails, uploadState: 'done' });
    //toggleUploadModalVisibility();
    setUploadModalVisibility(false);
    sendMsg(url);
  };

  const toggleUploadModalVisibility = () => setUploadModalVisibility((v) => !v);

  return (
    messagesRef && (
      <div>
        <div className='chat-input-box'>
          <SendFileModal
            file={file}
            setFile={setFile}
            uploadFile={uploadFile}
            isOpen={isUploadModalOpen}
            toggleModal={toggleUploadModalVisibility}
          />
          {/* <div className='icon emoji-selector'>
            <MDBIcon
              className='input-icons'
              far
              icon='grin'
              style={{ fontSize: '1.3rem' }}
              onClick={() => toggleEmojiBoardVisibility()}
            />
            {isEmojiBoardVisible && <Picker onEmojiClick={(e, emoji) => console.log(emoji)} preload={true} />}
          </div> */}
          <div className='chat-input'>
            <input
              type='text'
              placeholder='Type a message'
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyPress={(e) => (e.key === 'Enter' ? sendMsg() : null)}
            />
          </div>
          <div className='icon emoji-selector' onClick={() => toggleUploadModalVisibility()}>
            <MDBIcon className='input-icons' icon='paperclip' style={{ fontSize: '1.1rem' }} />
          </div>
          <div className='icon send dark' style={{ height: '100%' }} onClick={() => sendMsg()}>
            <MDBIcon className='input-icons' icon='paper-plane' style={{ fontSize: '1.1rem' }} />
          </div>
        </div>
        <ProgressBar uploadState={uploadDetails.uploadState} uploadPercent={uploadDetails.uploadPercentage} />
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(ChatInputBox);
