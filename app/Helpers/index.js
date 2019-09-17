'use strict'

const crypto = use('crypto')

const Helpers = use('Helpers')
//String Random

/**
 * Generate Random String
 *
 * @param {int} lenght
 * @return { string }
 */

const str_random = async (lenght = 40) => {
  let string = ''
  let len = string.length

  if (len < lenght) {
    let size = lenght - len

    let bytes = await crypto.randomBytes(size)
    let buffer = Buffer.from(bytes)
    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }

  return string
}

/**
 * Manager single update.
 * Move just one file to specific path
 *
 * @param { FileJar } file arquivo
 * @param { string } path destino
 * @return { Object}
 */

const manage_single_upload = async (file, paht = null) => {
  path = path ? path : Helpers.publicPath('uploads')

  const random_name = await str_random(30)

  let filename = `${new Data().getTime()}-${random_name}.${file.subtype}`

  await file.move(path, {
    name: filename
  })

  return file
}

/**
 * Manager multiples files
 * @param {FileJar} FileJar
 * @param {string} path
 * @return { Object <FileJar>}
 */

const manage_multiple_uploads = async (fileJar, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')

  let successes = [],
    errors = []
  await Promise.all(
    fileJar.files.map(async file => {
      let random_name = await str_random(30)
      let filename = `${new Data().getTime()}-${random_name}.${file.subtype}`

      await file.move(path, {
        name: filename
      })

      if (file.moved()) {
        successes.push(file)
      } else {
        errors.push(file.error())
      }
    })
  )

  return successes, errors
}

module.exports = {
  str_random,
  manage_single_upload,
  manage_multiple_uploads

}
