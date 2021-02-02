const util = require('util')
const gc = require('../config')
// const bucket = gc.bucket('adx-dev') // should be your bucket name TODO: Mudar nome pra prd
const bucket = gc.bucket(process.env.NODE_ENV !== 'production' ? 'survey-dev' : 'survey-prd') // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

var uploadImage = async function (file, isEdition) {
  return new Promise((resolve, reject) => {
    try {
      const gcsname = isEdition ? isEdition : Date.now() + '_._' + file.originalname
      const bFile = bucket.file(gcsname)
  
      const stream = bFile.createWriteStream({
        metadata: {
          contentType: file.mimetype
        },
        resumable: false,
        gzip: 'auto'
      })
  
      stream.on('error', (err) => {
        file.cloudStorageError = err
        reject(err)
      })
  
      stream.on('finish', () => {
        file.cloudStorageObject = gcsname
        // Descomentar caso queira deixar arquivo publico
        bFile.makePublic().then(() => {
          // TODO: não atualiza arquivo publico
          const publicUrl = util.format(
            `https://storage.googleapis.com/${bucket.name}/${gcsname}`
          )
          file.cloudStoragePublicUrl = publicUrl;
          resolve(publicUrl)
        })
        // const publicUrl = util.format(
        //   `https://console.cloud.google.com/storage/browser/${bucket.name}/${gcsname}`
        // )
        // file.cloudStoragePublicUrl = publicUrl;
        // resolve(publicUrl)
      })
      stream.end(file.buffer)
    } catch (error) {
      reject(error)
    }
  })
}

var deleteImage = async function (file) {
  return new Promise((resolve, reject) => {
    const bFile = bucket.file(file)

    bFile.delete(function (err, apiResponse) {
      if (err) {
        reject(err)
      } else {
        resolve(apiResponse)
      }
    })
  })
}

module.exports = {
  uploadImage: uploadImage,
  deleteImage: deleteImage
}