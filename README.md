# rapid-storage-server

Based on a barebones Node.js app using [Express 4](http://expressjs.com/).

## Setup
* Clone the repo: `git clone https://github.com/IdoZilberberg/rapid-storage-server.git`
* Run `npm install`
* Start the server: `node index.js`. It will listen on port 5000.

## Architecture

<p>The client `rapid-storage-web` communicates with this server with a REST API that uses sensible HTTP verbs for the various operations as explained below.</p>
<p>The server stores file metadata on [Google Firebase real-time database](https://firebase.google.com/products/realtime-database).</p>
<p>The server stores actual files on [Google Firebase storage](https://firebase.google.com/products/storage/).</p>

## Router

The `Files Router` (api/v1/files-router.js) accepts these endpoints:

* `GET /allfiles` Returns metadata for all public and user's private files, useful for listing files in UI 
* `GET /path/to/file` Returns metadata for the specified file, including the download link from storage 
* `POST /` Body contains metadata for a single file 
* `PUT /file_id?[public=true|false]|[undelete=true]` set file's public flag to true or false. If undelete=true, undelete the file (opposite of `DELETE`)  
* `DELETE /file_id` Delete the file specified by `file_id` - only sets `deletionDate` to now, nothing is actually deleted

Note: it is good practice to version your API so that breaking changes get a new version number and do not break client applications.

## Services

* `FilesDB` (services/filesdb.js) Performs all communication with Firebase, called by `Files Router`.
* `util` Stuff that is cross-application and doesn't fit anywhere else 

## Stuff I didn't do
* It is not possible to download files by directly calling an API (from Postman for example) - the sevrer does not actually transfer file data, only download URLs. The client actually downloads/uploads files. I think this is a sensible choice anyway but the assignment instructions did ask for direct download to be implemented.
* Planned to deploy on Heroku - both the client and server, but this didn't work out in time. 
