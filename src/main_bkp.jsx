import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setCurrentChatUser } from './actions/user';
import Avatar from './components/Avatar';
import ContactBox from './components/ContactBox';
import MessagesBox from './components/MessagesBox';
import ChatInputBox from './components/ChatInputBox';
import Search from './components/Search';
import Welcome from './components/Welcome';
import CreateChannel from './components/createChannel';
import JoinChannel from './components/joinChannel';
import AddContact from './components/addContact';
import ProfileModal from './components/profileModal';
import firebase from './firebase';
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from 'mdbreact';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import './App.css';
import MobileMessageModal from './components/mobileMessageModal';

let listener = null;

const Main = ({ user: { user, currentContact }, signout, setCurrentChatUser }) => {
  //const [message, setMessage] = useState('');
  //const [search, setSearch] = useState('');
  const [filteredContacts, setFilterContacts] = useState([]);
  const [notifications, _setNotifications] = useState([]);
  const [demo, _setDemo] = useState(null);
  const [channelsRef] = useState(firebase.database().ref('channels'));
  const [usersRef] = useState(firebase.database().ref('users'));
  const [connectedRef] = useState(firebase.database().ref('.info/connected'));
  const [messagesRef] = useState(firebase.database().ref('messages'));
  const [pvtMessagesRef] = useState(firebase.database().ref('private_messages'));
  const [isCreateChannelModalOpen, setCreateChannelModalVisibility] = useState(false);
  const [isJoinChannelModalOpen, setJoinChannelModalVisibility] = useState(false);
  const [isAddContactModalOpen, setAddContactModalVisibility] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [isMobileMessageModalOpen, setMobileMessageModalVisibility] = useState(false);
  const [isProfileModalVisible, setProfileModalVisibility] = useState(false);

  const notificationsRef = useRef(notifications);
  const currentContactRef = useRef(currentContact);

  const setNotifications = (x) => {
    notificationsRef.current = x;
    _setNotifications(x);
  };

  useEffect(() => {
    addListeners();
  }, []);

  // For contact status (online or offline)
  useEffect(() => {
    if (listener) {
      listener.off();
      console.log('turned off status listener');
    }
    clearNotifications();
    currentContactRef.current = currentContact;
    if (currentContact && currentContact.isPrivate) {
      let ids = currentContact.id.split('/');
      let otherID = '';
      if (ids[0] === user.uid) otherID = ids[1];
      else otherID = ids[0];
      listener = usersRef.child(otherID);
      listener.on('value', (snap) => {
        let tmpContact = snap.val();
        if (tmpContact.status !== currentContact.status) {
          setCurrentChatUser({ ...currentContact, status: tmpContact.status });
        }
      });
    }
  }, [currentContact]);

  const addListeners = () => {
    usersRef.on('child_added', (snap) => {
      setUserNames((names) => ({ ...names, [snap.key]: snap.val().name }));
    });

    usersRef
      .child(user.uid)
      .child('channels')
      .on('child_added', (s) => {
        const channelKey = s.val();
        channelsRef.child(channelKey).once('value', (snap) => {
          let channel = snap.val();
          channel['isPrivate'] = false;
          setFilterContacts((items) => [channel, ...items]);
          messagesRef.child(snap.key).on('value', (s) => {
            handleNotifications(snap.key, s);
          });
        });
      });

    usersRef
      .child(user.uid)
      .child('contacted')
      .on('child_added', (s) => {
        const userKey = s.val();
        if (userKey !== user.uid) {
          usersRef.child(userKey).once('value', (snap) => {
            let otherUser = snap.val();
            otherUser['isPrivate'] = true;
            otherUser['id'] = snap.key < user.uid ? `${user.uid}/${snap.key}` : `${snap.key}/${user.uid}`;
            setFilterContacts((items) => [otherUser, ...items]);
            pvtMessagesRef.child(otherUser['id']).on('value', (s) => {
              handleNotifications(otherUser['id'], s);
            });
          });
        }
      });

    connectedRef.on('value', async (snap) => {
      const currentState = snap.val();
      await usersRef.child(user.uid).update({
        status: currentState ? 'online' : 'offline',
      });
    });

    usersRef.child(user.uid).onDisconnect().update({ status: 'offline' });
  };

  const handleNotifications = (contactID, snap) => {
    let lastTotal = 0;
    let notifications = notificationsRef.current;
    let currentContact = currentContactRef.current;
    let index = notifications.findIndex((n) => n.id === contactID);
    if (index !== -1) {
      let tmpNotifications = [...notifications];
      if (!currentContact || (currentContact && contactID !== currentContact.id)) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          tmpNotifications[index].count = snap.numChildren() - lastTotal;
        }
      } else tmpNotifications[index].total = snap.numChildren();
      tmpNotifications[index].lastKnownTotal = snap.numChildren();
      setNotifications(tmpNotifications);
    } else {
      const n = {
        id: contactID,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      };
      setNotifications([...notifications, n]);
    }
  };

  const clearNotifications = () => {
    const index = notifications.findIndex((n) => n.id === currentContact.id);
    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      setNotifications(updatedNotifications);
    }
  };

  const getNotificationCount = (contactID) => {
    let cnt = 0;
    notifications.forEach((n) => {
      if (n.id === contactID) cnt = n.count;
    });
    return cnt > 0 ? cnt : null;
  };

  const toggleCreateChannelModalVisibility = () => setCreateChannelModalVisibility((v) => !v);
  const toggleJoinChannelModalVisibility = () => setJoinChannelModalVisibility((v) => !v);
  const toggleAddContactModalVisibility = () => setAddContactModalVisibility((v) => !v);
  const toggleMobileMessageModalVisibility = () => setMobileMessageModalVisibility((v) => !v);
  const toggleProfileModalVisibility = () => setProfileModalVisibility((v) => !v);

  return (
    user && (
      <div className='app'>
        <CreateChannel
          user={user}
          isOpen={isCreateChannelModalOpen}
          toggleVisibility={toggleCreateChannelModalVisibility}
        />
        <JoinChannel isOpen={isJoinChannelModalOpen} toggleVisibility={toggleJoinChannelModalVisibility} />
        <AddContact isOpen={isAddContactModalOpen} toggleVisibility={toggleAddContactModalVisibility} />
        <ProfileModal isOpen={isProfileModalVisible} toggleVisibility={toggleProfileModalVisibility} />
        {window.innerWidth <= 768 && (
          <MobileMessageModal
            isVisible={isMobileMessageModalOpen}
            userNames={userNames}
            toggleVisibility={toggleMobileMessageModalVisibility}
          />
        )}
        {window.innerWidth > 768 || !isMobileMessageModalOpen ? (
          <aside>
            <header>
              <Avatar user={user} showName isUser isDark />
              <MDBDropdown dropleft>
                <MDBDropdownToggle style={{ padding: '5px 7px', margin: 0 }} id='toggle'>
                  <MDBIcon icon='ellipsis-v' />
                </MDBDropdownToggle>
                <MDBDropdownMenu basic>
                  <MDBDropdownItem className='menu-item' onClick={() => toggleProfileModalVisibility()}>
                    Profile
                  </MDBDropdownItem>
                  <MDBDropdownItem className='menu-item' onClick={() => toggleAddContactModalVisibility()}>
                    Add Contact
                  </MDBDropdownItem>
                  <MDBDropdownItem className='menu-item' onClick={() => toggleJoinChannelModalVisibility()}>
                    Join Channel
                  </MDBDropdownItem>
                  <MDBDropdownItem className='menu-item' onClick={() => toggleCreateChannelModalVisibility()}>
                    Create Channel
                  </MDBDropdownItem>
                  <MDBDropdownItem className='menu-item' divider />
                  <MDBDropdownItem className='menu-item' onClick={(e) => signout(e)}>
                    Logout
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </header>
            <Search />
            <div className='contact-boxes'>
              {filteredContacts.length > 0 &&
                filteredContacts.map((item) => (
                  <ContactBox
                    contact={item}
                    key={item.id}
                    getNotificationCount={getNotificationCount}
                    isMobileMessageModalOpen={isMobileMessageModalOpen}
                    toggleMobileMessageModalVisibility={toggleMobileMessageModalVisibility}
                  />
                ))}
            </div>
          </aside>
        ) : null}
        {window.innerWidth <= 768 ? null : currentContact ? (
          <main>
            <header>
              <Avatar user={currentContact} showName /> {/* Contact header on selected chat */}
              {currentContact.isPrivate ? (
                currentContact.status === 'online' ? (
                  <MDBIcon icon='circle' style={{ color: '#7CFC00', paddingLeft: '5px', fontSize: '0.8rem' }} />
                ) : (
                  <MDBIcon icon='circle' style={{ color: '#FF4500', paddingLeft: '5px', fontSize: '0.8rem' }} />
                )
              ) : null}
            </header>
            {/* Chat box */}
            <MessagesBox userNames={userNames} />
            <ChatInputBox />
          </main>
        ) : (
          <Welcome />
        )}
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { setCurrentChatUser })(Main);
