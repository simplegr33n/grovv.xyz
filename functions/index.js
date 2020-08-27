'use strict';

const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const admin = require('firebase-admin');
admin.initializeApp();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
// const gcs = require('@google-cloud/storage')();
const { Storage } = require('@google-cloud/storage');
const client = new Storage();

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  // File and directory paths.
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    return console.log('Already a Thumbnail.');
  }

  const meta = object.metadata;
  /**
    * Exit if the image is already a thumbnail.
    */
  if (meta && meta.isThumb == 'true') {
    console.log('Already a Thumbnail.');
    return null;
  }
  /**
  * Exit if the image is not optimized.
  */
  if (meta && meta.metadata) {
    if (meta.metadata.optimized != 'true') {
      console.log('Not yet optimized.');
      return null;
    }
  }

  // Cloud Storage files.
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    'Cache-Control': 'public,max-age=3600',
    isThumb: true
  };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir)
  // Download file from bucket.
  await file.download({ destination: tempLocalFile });
  console.log('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], { capture: ['stdout', 'stderr'] });
  console.log('Thumbnail created at', tempLocalThumbFile);
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata });
  console.log('Thumbnail uploaded to Storage at', thumbFilePath);
  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);
  // Get the Signed URLs for the thumbnail and original image.
  const config = {
    action: 'read',
    expires: '03-01-2500',
  };
  const results = await Promise.all([
    thumbFile.getSignedUrl(config),
    file.getSignedUrl(config),
  ]);
  console.log('Got Signed URLs.');
  const thumbResult = results[0];
  const originalResult = results[1];
  const thumbFileUrl = thumbResult[0];
  const fileUrl = originalResult[0];
  // Add the URLs to the Database
  await admin.database().ref('images').push({ path: fileUrl, thumbnail: thumbFileUrl });
  return console.log('Thumbnail URLs saved to database.');
});


// https://gist.github.com/mbove77/a082a9ff74dd625f45975848116418d7
// // Optimize Images Function
exports.optimizeImages = functions.storage.object().onFinalize((data) => {
  // File and directory paths.
  const filePath = data.name;
  const fileName = path.basename(filePath);
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  var size;
  var crop;

  // Exit if this is triggered on a file that is not an image.
  if (!data.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Exit if this is a move or deletion event.
  if (data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return null;
  }

  // Exit if file exists but is not new and is only being triggered
  // because of a metadata change.
  if (data.resourceState === 'exists' && data.metageneration > 1) {
    console.log('This is a metadata change event.');
    return null;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return null;
  }

  // In my case i determine the size of the image based on the extension, 
  // but you can ignore this part or  use a custom rule.

  // if (data.contentType == 'image/jpeg') {
  size = "1600x1200^";
  crop = "1600x1200+0+0";
  // } else {
  //     size = "200x200^";
  //     crop = "200x200+0+0";
  // }

  // Cloud Storage files.
  const bucket = client.bucket(data.bucket);
  const file = bucket.file(filePath);

  return file.getMetadata()
    .then(([metadata]) => {
      if (metadata.metadata && metadata.metadata.optimized) {
        return Promise.reject('Image has been already optimized');
      }
      return Promise.resolve();
    })
    .then(() => mkdirp(tempLocalDir))
    .then(() => file.download({ destination: tempLocalFile }))
    .then(() => {
      console.log('Resize to: ' + size);
      return spawn('convert', [tempLocalFile, '-geometry', size, '-gravity', 'center', '-crop', crop, tempLocalFile]);
    })
    .then(() => {
      console.log('The file has been downloaded to', tempLocalFile);
      return spawn('convert', [tempLocalFile, '-strip', '-interlace', 'Plane', '-quality', '85', tempLocalFile]);
    })
    .then(() => {
      console.log('Optimized image created at', tempLocalFile);
      // Uploading the Optimized image.
      return bucket.upload(tempLocalFile, {
        destination: file,
        metadata: {
          metadata: {
            optimized: true
          }
        }
      });
    })
    .then(() => {
      console.log('Optimized image uploaded to Storage at', file);
      // Once the image has been uploaded delete the local files to free up disk space.
      fs.unlinkSync(tempLocalFile);
      return null;
    });
});