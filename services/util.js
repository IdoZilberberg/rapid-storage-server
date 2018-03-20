const generatePrivateFileId = () => {
  let text = "";
  const possible = "0123456789ABCDEF";
  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Hard-coded for the purpose of the exercise
const users = {
  'usr1tok': 'user1',
  'usr2tok': 'user2',
  'usr3tok': 'user3'
};

const getUserIdFromToken = (token) => {
  if(!token)  {
    return null;
  }
  return users[token];
};

module.exports = {
  generatePrivateFileId: generatePrivateFileId,
  getUserIdFromToken: getUserIdFromToken
};