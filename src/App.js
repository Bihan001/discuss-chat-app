import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setUser, clearUser } from './actions/user';
import Loading from './components/loading';
import firebase from './firebase';
import Login from './login';
import Main from './main';

const App = ({ user: { user }, setUser, clearUser, history }) => {
  const [usersRef] = useState(firebase.database().ref('users'));
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setUser(user);
        //history.push('/dashboard');
      } else {
        clearUser();
        console.log('not logged in');
      }
    });
  }, []);

  // const register = async (email, password) => {
  //   try {
  //     const createdUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
  //     if (createdUser) {
  //       await createdUser.user.updateProfile({
  //         displayName: 'NEW USER',
  //         photoURL: 'https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg',
  //       });
  //       await usersRef.child(createdUser.user.uid).set({
  //         name: createdUser.user.displayName,
  //         avatar: createdUser.user.photoURL,
  //       });
  //       console.log(createdUser);
  //       setUser(createdUser.user);
  //     } else {
  //       console.log('no user created');
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const signin = async (email, password) => {
    try {
      // const signedinUser = await firebase.auth().signInWithEmailAndPassword(email, password);
      // setUser(signedinUser.user);
      var provider = new firebase.auth.GoogleAuthProvider();
      var result = await firebase.auth().signInWithPopup(provider);
      await usersRef.child(result.user.uid).update({
        name: result.user.displayName,
        avatar: result.user.photoURL,
        email: result.user.email,
        status: 'online',
      });
      setUser(result.user);
      console.log(result.user);
    } catch (err) {
      console.log(err);
    }
  };

  const signout = async (e) => {
    try {
      e.preventDefault();
      await firebase.database().ref('users').child(user.uid).update({ status: 'offline' });
      await firebase.auth().signOut();
      clearUser();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      {user === 'loading' ? (
        <Loading />
      ) : !user ? (
        <Login signin={signin} />
      ) : (
        <Main signout={signout} history={history} />
      )}
    </Fragment>
  );
  // return (
  //   <Fragment>
  //     <Switch>
  //       <Route exact path='/' component={() => <Login signin={signin} />} />
  //       <Route exact path='/dashboard' component={() => <Main signout={signout} history={history} />} />
  //     </Switch>
  //   </Fragment>
  // );
};

const mapDispatchToProps = (state) => ({
  user: state.user,
});

export default connect(mapDispatchToProps, { setUser, clearUser })(App);
