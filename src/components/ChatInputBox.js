import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import emojiIcon from '../assets/tag_faces.svg';
import micIcon from '../assets/mic.svg';
import sendIcon from '../assets/send.svg';
import firebase from '../firebase';
import { connect } from 'react-redux';
import SendFileModal from './sendFileModal';
import ProgressBar from './progressBar';

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

  useEffect(() => {
    if (currentContact.isPrivate) {
      setMessagesRef(firebase.database().ref('private_messages'));
    } else {
      setMessagesRef(firebase.database().ref('messages'));
    }
  }, [currentContact]);

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
          <div className='icon emoji-selector'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
              <path
                fill='currentColor'
                d='M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z'></path>
            </svg>
          </div>
          <div className='icon emoji-selector' onClick={() => toggleUploadModalVisibility()}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
              <path
                fill='currentColor'
                d='M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z'></path>
            </svg>
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
        <ProgressBar uploadState={uploadDetails.uploadState} uploadPercent={uploadDetails.uploadPercentage} />
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(ChatInputBox);
