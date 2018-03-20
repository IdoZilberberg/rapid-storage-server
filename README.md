# Home task for RapidAPI - SERVER part

(c) 2018 Ido Zilberberg

The other part is the [WEB CLIENT](https://github.com/IdoZilberberg/rapid-storage-web).

## Setup
* Install [Node/npm](https://nodejs.org/en/)
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

## Some scale considerations
* Deploy both WEB and SERVER on multiple Heroku dynos, or Amazon EC2 or equivalents. This way can scale each separately.
* Cache the files list on the server
* Consider replacing Google Firebase storage with Amazon S3 (haven't actually tested which is better though)
* Consider replacing Google Firebase database with MongoDB or some other dedicated DB. Firebase DB is not really a good choice anyway. It is suitable to serverless architecture which was how I started. I would have used a free-tier MongoDB from mLab if I had to do it again.

### Low volume 
For small scale, it is enough to have a single Node.js app that:
* Serves the front-end code (Angular 5) as static files ("web app") - in my case I did separate those into 2 different applications
* Connects to Heroku File Stack add-on for file storage
* Connects to Google Firebase to store file metadata
* Deploys on a single Heroku dyno

### High volume
* Replace Heroku File Stack with Amazon S3 of other infinitely scalable storage solution
* Replace Google Firebase with a scalable DB solution (e.g. relational: [Amazon RDS](https://aws.amazon.com/rds/); document-based: [mLab MongoDB](https://mlab.com/home))


## Stuff I didn't do
* It is not possible to download files by directly calling an API (from Postman for example) - the sevrer does not actually transfer file data, only download URLs. The client actually downloads/uploads files. I think this is a sensible choice anyway but the assignment instructions did ask for direct download to be implemented.
* Planned to deploy on Heroku - both the client and server, but this didn't work out in time. 
