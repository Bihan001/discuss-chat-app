import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setCurrentChatUser } from './actions/user';
import Avatar from './components/Avatar';
import ContactBox from './components/ContactBox';
import MessagesBox from './components/MessagesBox';
import ChatInputBox from './components/ChatInputBox';
import Welcome from './components/Welcome';
import CreateChannel from './components/createChannel';
import JoinChannel from './components/joinChannel';
import AddContact from './components/addContact';
import ProfileModal from './components/profileModal';
import MobileMessageModal from './components/mobileMessageModal';
import ContactProfileModal from './components/contactProfileModal';
import firebase from './firebase';
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from 'mdbreact';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import './App.css';

let listener = null;

let myHistory = [];

const Main = ({ user: { user, currentContact }, signout, setCurrentChatUser, history, router, route }) => {
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
  const [isContactProfileModalVisible, setContactProfileModalVisibility] = useState(false);
  const notificationsRef = useRef(notifications);
  const currentContactRef = useRef(currentContact);

  useEffect(() => {
    let aside = document.querySelector('aside');
    if (aside && window.innerWidth <= 768) {
      if (isMobileMessageModalOpen || isContactProfileModalVisible) {
        aside.style.opacity = 0;
      } else {
        aside.style.opacity = 1;
      }
    }
  }, [
    isCreateChannelModalOpen,
    isJoinChannelModalOpen,
    isAddContactModalOpen,
    isMobileMessageModalOpen,
    isProfileModalVisible,
    isContactProfileModalVisible,
  ]);

  const setNotifications = (x) => {
    notificationsRef.current = x;
    _setNotifications(x);
  };

  const resizeHeightOnMobile = () => {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  };

  useEffect(() => {
    addListeners();
    resizeHeightOnMobile();
    history.listen((location) => {
      if (history.action === 'POP') {
        console.log(myHistory);
        //history.go(1);
        if (myHistory[myHistory.length - 1] === '/cm') {
          setCreateChannelModalVisibility(false);
          myHistory.pop();
        }
        if (myHistory[myHistory.length - 1] === '/jm') {
          setJoinChannelModalVisibility(false);
          myHistory.pop();
        }
        if (myHistory[myHistory.length - 1] === '/am') {
          setAddContactModalVisibility(false);
          myHistory.pop();
        }
        if (myHistory[myHistory.length - 1] === '/mm') {
          setMobileMessageModalVisibility(false);
          myHistory.pop();
        }
        if (myHistory[myHistory.length - 1] === '/pm') {
          setProfileModalVisibility(false);
          myHistory.pop();
        }
        if (myHistory[myHistory.length - 1] === '/ccm') {
          setContactProfileModalVisibility(false);
          myHistory.pop();
        }
      }
    });
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
          channel['display'] = true;
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
            otherUser['display'] = true;
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

  const filterContacts = (e) => {
    let val = e.target.value.toUpperCase();
    let tmpContacts = [...filteredContacts];
    for (let i = 0; i < tmpContacts.length; i++) {
      if (tmpContacts[i].name.toUpperCase().indexOf(val) > -1) {
        tmpContacts[i].display = true;
      } else {
        tmpContacts[i].display = false;
      }
    }
    setFilterContacts(tmpContacts);
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

  const toggleCreateChannelModalVisibility = () =>
    setCreateChannelModalVisibility((v) => {
      if (!v) {
        myHistory.push('/cm');
        history.push('/cm');
      } else myHistory.pop();
      return !v;
    });
  const toggleJoinChannelModalVisibility = () =>
    setJoinChannelModalVisibility((v) => {
      if (!v) {
        myHistory.push('/jm');
        history.push('/jm');
      } else myHistory.pop();
      return !v;
    });
  const toggleAddContactModalVisibility = () =>
    setAddContactModalVisibility((v) => {
      if (!v) {
        myHistory.push('/am');
        history.push('/am');
      } else myHistory.pop();
      return !v;
    });
  const toggleMobileMessageModalVisibility = () =>
    setMobileMessageModalVisibility((v) => {
      if (!v) {
        myHistory.push('/mm');
        history.push('/mm');
      } else myHistory.pop();
      return !v;
    });
  const toggleProfileModalVisibility = () =>
    setProfileModalVisibility((v) => {
      if (!v) {
        myHistory.push('/pm');
        history.push('/pm');
      } else myHistory.pop();
      return !v;
    });

  const toggleContactProfileModalVisibility = () =>
    setContactProfileModalVisibility((v) => {
      if (!v) {
        myHistory.push('/ccm');
        history.push('/ccm');
      } else myHistory.pop();
      return !v;
    });

  return (
    user && (
      <div className='fullScreen'>
        <div className='app'>
          <CreateChannel
            user={user}
            isOpen={isCreateChannelModalOpen}
            toggleVisibility={toggleCreateChannelModalVisibility}
          />
          <JoinChannel isOpen={isJoinChannelModalOpen} toggleVisibility={toggleJoinChannelModalVisibility} />
          <AddContact isOpen={isAddContactModalOpen} toggleVisibility={toggleAddContactModalVisibility} />
          <ProfileModal isOpen={isProfileModalVisible} toggleVisibility={toggleProfileModalVisibility} />
          {window.innerWidth > 768 && (
            <ContactProfileModal
              isOpen={isContactProfileModalVisible}
              toggleVisibility={toggleContactProfileModalVisibility}
            />
          )}
          {window.innerWidth <= 768 && (
            <MobileMessageModal
              isVisible={isMobileMessageModalOpen}
              userNames={userNames}
              toggleVisibility={toggleMobileMessageModalVisibility}
              toggleContactProfileModalVisibility={toggleContactProfileModalVisibility}
              isContactProfileModalVisible={isContactProfileModalVisible}
            />
          )}
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
            <div className='search'>
              <input type='text' placeholder='Search Contacts...' onChange={(e) => filterContacts(e)} />
            </div>
            <div className='contact-boxes'>
              {filteredContacts.length > 0 &&
                filteredContacts.map((item) =>
                  item.display ? (
                    <ContactBox
                      contact={item}
                      key={item.id}
                      getNotificationCount={getNotificationCount}
                      isMobileMessageModalOpen={isMobileMessageModalOpen}
                      toggleMobileMessageModalVisibility={toggleMobileMessageModalVisibility}
                    />
                  ) : null
                )}
            </div>
          </aside>
          {window.innerWidth <= 768 ? null : currentContact ? (
            <main>
              <header id='messageBox-header' onClick={() => toggleContactProfileModalVisibility()}>
                <Avatar user={currentContact} showName /> {/* Contact header on selected chat */}
                {currentContact.isPrivate ? (
                  currentContact.status === 'online' ? (
                    <MDBIcon icon='circle' className='offline-icon' />
                  ) : (
                    <MDBIcon icon='circle' className='online-icon' />
                  )
                ) : null}
              </header>
              {/* Chat box */}
              <MessagesBox userNames={userNames} />
              <ChatInputBox />
            </main>
          ) : (
            <Welcome hasContacts={filteredContacts.length > 0} />
          )}
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { setCurrentChatUser })(Main);
