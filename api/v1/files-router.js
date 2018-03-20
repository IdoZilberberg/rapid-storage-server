const router = require('express').Router();
const filesdb = require('../../services/filesdb');
const util = require('../../services/util');

/*
Endpoints:

1. GET /[path/to/public/file][?fileid=xxx][&metadata=true]
2. PUT /?fileid=xxx&public=true|false
3. POST / body=filedata

 */

// router.route('/')
// .get((req, res) => {
//   const token = req.headers['X-AUTH'];
//   const isMetadataRequested = req.query['metadata'] === 'true';
//   const privateFileId = req.query['fileid'];
//   return filesdb.getFileMetadataByPrivateFileId(token, privateFileId)
//   .then(response => {
//     switch (response.status) {
//       case 'ok':
//         return res.status(200).json(response);
//       case 'no_auth':
//         return res.status(403).json(response);
//       case 'not_found':
//         return res.status(404).json(response);
//       default:
//         return res.status(500).json(response);
//     }
//   });
// });

router.route('/allfiles')
.get((req, res) => {
  console.log('Reading all files...');
  return filesdb.getFileMetadata(null, null, null)
  .then(response => {
    if (!response) {
      throw new Error('Empty response');
    }

    console.log(`Returned ${response.length} files`);
    return res.status(200).json(response);

  })
  .catch(error => {
    if(error.message === 'not_found') {
      return res.status(404).json({status: 'error', message: error.message});
    }
    return res.status(500).json({status: 'error', message: error.message});
  });
});

router.route('/:full_path?')

// Get file metadata with a download link
.get((req, res) => {
  const token = req.headers['x-auth'];

  // const isMetadataRequested = req.query['metadata'] === 'true';
  // const fullPath = req.params['full_path'];
  const fullPath = req.params['full_path'] || '';
  const fileId = req.query['fileid'] || '';
  console.log(`GET fileid=${fileId} fullPath=${fullPath}`);
  if (fullPath.length === 0 && fileId.length === 0) {
    return res.status(500).json({status: 'error', message: 'empty path and fileid not provided'});
  }

  return filesdb.getFileMetadata(token, fileId, fullPath)
  .then(response => {
    if(!response || response.length===0)  {
      return res.status(404).json({status: 'not_found'});
    }

    return res.status(200).json(response);
  })
  .catch(error => {
    if(error.message === 'not_found') {
      return res.status(404).json({status: 'error', message: error.message});
    }
    return res.status(500).json({status: 'error', message: error.message});
  });

});


router.route('/')
.post((req, res) => {
  const token = req.headers['x-auth'];
  const fileMetadata = req.body;
  console.log('Upload: ', JSON.stringify(fileMetadata));

  return filesdb.addFileMetadata(token, fileMetadata)
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(500).json({status: 'error', message: error.message});
  });

});

router.route('/:file_id')
.put((req, res) => {
  const token = req.headers['x-auth'];
  const publicFlag = req.query['public'];
  const undeleteFlag = req.query['undelete'];
  const fileId = req.params['file_id'] || '';

  return filesdb.setFileFlags(token, fileId, publicFlag, undeleteFlag)
  .then(response => {
    return res.status(200).json(response);
    // switch (response.status) {
    //   case 'ok':
    //     return res.status(200).json(response);
    //   case 'no_auth':
    //     return res.status(403).json(response);
    //   case 'not_found':
    //     return res.status(404).json(response);
    //   default:
    //     return res.status(500).json(response);
    // }

  })
  .catch(error => {
    return res.status(500).json({status: 'error', message: error.message});
  });
});

router.route('/:file_id')
.delete((req, res) => {
  // const fullPath = req.originalUrl;
  const token = req.headers['x-auth'];
  const fileId = req.params['file_id'] || '';

  return filesdb.deleteFile(token, fileId)
  .then(response => {
    return res.status(200).json(response);
    // switch (response.status) {
    //   case 'ok':
    //     return res.status(200).json(response);
    //   case 'no_auth':
    //     return res.status(403).json(response);
    //   case 'not_found':
    //     return res.status(404).json(response);
    //   default:
    //     return res.status(500).json(response);
    // }

  })
  .catch(error => {
    return res.status(500).json({status: 'error', message: error.message});
  });

});

module.exports = router;