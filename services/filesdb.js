const firebase = require('firebase');
const _ = require('lodash');
const util = require('./util');

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
firebase.auth().signInWithEmailAndPassword('izilberberg@gmail.com', '123456')
.then(() => {
  console.log('Signed in to DB');
});
const db = firebase.database();
const fullpathsRef = firebase.database().ref('/fullpaths');
let localFullpathsDb;

fullpathsRef.on('value', snapshot => {
  localFullpathsDb = snapshot.val();
  console.log('Updated local copy of db');
});

const getFileDownloadLink = (token, fullPath) => {

  const res = localFullpathsDb.ge;
  // fullPath - if !token then it's a public file, o/w it's a private file and fullPath is a filePrivateId

};

const addFileMetadata = (token, fileMetadata) => {

  // const newFileKey = db.ref().child('fullpaths').push().key;
  // const updates = {
  //   // [`/fullpaths/${newFileKey}`]: fileMetadata
  //   [`fileid/${fileMetadata.fileId}`]: fileMetadata
  //   // [`/fullpath/${fileMetadata.path}/${fileMetadata.name}`]: fileMetadata
  // };

  fileMetadata.fileId = fileMetadata.fileId.toUpperCase();
  return db.ref(`fileid/${fileMetadata.fileId}`).set(fileMetadata);

};

const getFileMetadata = (token, fileId, fullPath) => {

  const userId = util.getUserIdFromToken(token);

  if(token && !userId)  {
    return Promise.reject(new Error('not_found'));
  }

  fileId = fileId || '';
  fileId = fileId.toUpperCase();
  return db.ref(`fileid/${fileId}`).once('value')
  .then(response => {
    if(fileId)  {

    }
    const files = fileId ? [response.val()] : _.map(response.val());
    const filtered = _.filter(files, file => {
      if(fullPath && fullPath !== `${file.path}${file.name}`) {
        return false;
      }

      if(userId && userId !== file.ownerUserId) {
        return false;
      }

      return true;

    });
    return filtered;
  });

};

// Find matching file(s) to the given fullPath



// };

const setFileFlags = (token, fileId, publicFlag, undeleteFlag) => {
  return firebase.database().ref(`fileid/${fileId}`).once('value')
  .then(response => {
    const fileMetadata = response.val();
    fileMetadata.isPublic = publicFlag;
    if(undeleteFlag)  {
      fileMetadata.deletionDate = null;
    }
    // const updates = {
    //   [`fileid/${fileMetadata.fileId}`]: fileMetadata,
    //   // [`fullpath/${fileMetadata.path}/${fileMetadata.name}`]: fileMetadata
    // };
    console.log(`Setting public flag of ${fileId} to ${publicFlag}. UndeleteFlag=${undeleteFlag}`);
    return db.ref(`fileid/${fileMetadata.fileId}`).set(fileMetadata);
    // return db.ref().update(updates);
  });
};

const deleteFile = (token, fileId) => {

  return firebase.database().ref(`fileid/${fileId}`).once('value')
  .then(response => {
    const fileMetadata = response.val();
    fileMetadata.deletionDate = new Date().toISOString();
    return db.ref(`fileid/${fileMetadata.fileId}`).set(fileMetadata);
  });


};

module.exports = {
  getFileDownloadLink: getFileDownloadLink,
  addFileMetadata: addFileMetadata,
  getFileMetadata: getFileMetadata,
  setFileFlags: setFileFlags,
  deleteFile: deleteFile
};



