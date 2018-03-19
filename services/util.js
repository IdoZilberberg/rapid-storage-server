const generatePrivateFileId = () => {
  let text = "";
  const possible = "0123456789ABCDEF";
  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = {
  generatePrivateFileId: generatePrivateFileId
};