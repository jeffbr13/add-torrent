const {URL} = require('url');

const express = require('express');
const router = express.Router();

const Transmission = require('transmission-promise');


function download_type_directories() {
  const name_dir_strings = (process.env.DOWNLOAD_DIRECTORIES || '')
    .split(',')
    .map(s => s.split(':'))
    .reduce((o, [name, directory]) => (o[name] = directory, o), {} )  // reduce [[key, value]] into {key: value}
  name_dir_strings[''] = ''
  return name_dir_strings
}


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'add-torrent',
    download_types: Object.keys(download_type_directories()).sort(),
  });
});


/* POST torrent submission form */
router.post('/', function (req, res, next) {
  const transmission_rpc_url = new URL(process.env.TRANSMISSION_RPC_URL || 'http://localhost:9001/transmission/rpc/')
  const torrent_url = new URL(req.body.url)
  const torrent_type = req.body.type
  console.log(`Adding <${torrent_url}> to <${transmission_rpc_url.hostname}>…`)
  const transmission = new Transmission({
    host: transmission_rpc_url.hostname,
    port: transmission_rpc_url.port,
    username: transmission_rpc_url.username,
    password: transmission_rpc_url.password,
    ssl: (transmission_rpc_url.protocol === 'https:'),
    url: transmission_rpc_url.pathname,
  })
  transmission.addUrl(torrent_url, {'download-dir': download_type_directories()[torrent_type]})
    .then(function (torrent) {
      console.log(`Added torrent <${torrent_url}> to <${transmission_rpc_url.hostname}>:`, torrent)
      res.status(201)
      res.setHeader('ETag', torrent.hashString)
      torrent.url = torrent_url

      if (req.header('Accept').indexOf('application/json') !== -1) {
        res.json(torrent)

      } else {
        res.render('index', {
          title: 'add-torrent',
          download_types: Object.keys(download_type_directories()).sort(),
          torrent: torrent,
        })
      }
    }).catch(next)
})

module.exports = router;
