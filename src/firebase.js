import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCPx04ccHjjSoSvRbTe8YLIlSZZusR-pJg',
  authDomain: 'discuss-2311c.firebaseapp.com',
  databaseURL: 'https://discuss-2311c.firebaseio.com',
  projectId: 'discuss-2311c',
  storageBucket: 'discuss-2311c.appspot.com',
  messagingSenderId: '331499613158',
  appId: '1:331499613158:web:603f7be4727baf0aae8427',
  measurementId: 'G-BYS1DCRQCY',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
