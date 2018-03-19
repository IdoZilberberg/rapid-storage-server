const router = require('express').Router();
const filesdb = require('../../services/filesdb');

router.route('/*')
.get((req, res) => {
  // const fullPath = req.params['full_path'];
  const fullPath = req.originalUrl;
  const token = req.headers['X-AUTH'];

  if (req.query['metadata'] === 'true') {
    return filesdb.getFileMetadata(token, fullPath)
    .then(response => {
      return res.status(200).json(response);
    });
  } else {
    return filesdb.getFileDownloadLink(token, fullPath);
  }

  // return res.status(200).json({status: 'ok'});
})
.put((req, res) => {
  const fullPath = req.originalUrl;
  const token = req.headers['X-AUTH'];
  const publicFlag = req.query['public'];

  return filesdb.setFilePublicFlag(token, fullPath, publicFlag)
  .then(response => {
    switch (response.status) {
      case 'ok':
        return res.status(200).json(response);
      case 'no_auth':
        return res.status(403).json(response);
      case 'not_found':
        return res.status(404).json(response);
      default:
        return res.status(500).json(response);
    }

  })
  .catch(error => {
    return res.status(500).json({status: 'error', message: error.message});
  });
})
.delete((req, res) => {
  const fullPath = req.originalUrl;
  const token = req.headers['X-AUTH'];

  return filesdb.deleteFile(token, fullPath)
  .then(response => {
    switch (response.status) {
      case 'ok':
        return res.status(200).json(response);
      case 'no_auth':
        return res.status(403).json(response);
      case 'not_found':
        return res.status(404).json(response);
      default:
        return res.status(500).json(response);
    }

  })
  .catch(error => {
    return res.status(500).json({status: 'error', message: error.message});
  });

});

router.route('/:private_file_id')
.post((req, res) => {
  const privateFileId = req.params['private_file_id'];
  const token = req.headers['X-AUTH'];
  const fileMetadata = req.body;

  return filesdb.addFileMetadata(token, fullPath, fileMetadata)
  .then(response => {
    return res.status(200).json(response);
  });
});


module.exports = router;