const firebase = require('firebase');
// const util = require('./util');

const config = {
  apiKey: 'AIzaSyDs2TZ1qGAZ-_dO_mu9GF3d4MwdqdSWVEM',
  authDomain: 'rapid-storage-db.firebaseapp.com',
  databaseURL: 'https://rapid-storage-db.firebaseio.com',
  storageBucket: ''
};

/*

  fullpaths/ - mapping from full path to metadata
  fileids/ - mapping from private file IDs to metadata

 */

firebase.initializeApp(config);
const db = firebase.database();
const fullpathsRef = firebase.database().ref('/fullpaths');
let localFullpathsDb;

fullpathsRef.on('value', snapshot => {
  localFullpathsDb = snapshot.val();
  console.log('Updated local copy of db');
});

const getFileDownloadLink = (token, fullPath) => {

  const res = localFullpathsDb.ge
  // fullPath - if !token then it's a public file, o/w it's a private file and fullPath is a filePrivateId

};

const addFileMetadata = (token, fullPath, fileMetadata) => {

  const newFileKey = db.ref().child('fullpaths').push().key;
  const updates = {
    [`/fullpaths/${newFileKey}`]: fileMetadata
  };

  return db.ref().update(updates);

};

const getFileMetadata = (token, fullPath) => {
  return firebase.database().ref('/users/' + userId).once('value');
};

const setFilePublicFlag = (token, fullPath, publicFlag) => {

};

const deleteFile = (token, fullPath) => {



};

module.exports = {
  getFileDownloadLink: getFileDownloadLink,
  addFileMetadata: addFileMetadata,
  getFileMetadata: getFileMetadata,
  setFilePublicFlag: setFilePublicFlag,
  deleteFile: deleteFile
};



