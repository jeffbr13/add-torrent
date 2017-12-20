const {URL} = require('url');

const express = require('express');
const router = express.Router();


const Transmission = require('transmission-promise');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'add-torrent'
  });
});

/* POST torrent submission form */
router.post('/', function (req, res, next) {
  const transmission_rpc_url = new URL(process.env.TRANSMISSION_RPC_URL)
  const torrent_url = new URL(req.body.url)
  console.log(`Adding <${torrent_url}> to <${transmission_rpc_url.hostname}>…`)
  const transmission = new Transmission({
    host: transmission_rpc_url.hostname,
    port: transmission_rpc_url.port,
    username: transmission_rpc_url.username,
    password: transmission_rpc_url.password,
    ssl: (transmission_rpc_url.protocol === 'https:'),
    url: transmission_rpc_url.pathname,
  })
  transmission.addUrl(torrent_url)
    .then(function (torrent) {
      console.log(`Added torrent <${torrent_url}> to <${transmission_rpc_url.hostname}>:`, torrent)
      res.status(201)
      res.setHeader('ETag', torrent.hashString)
      res.render('index', {
        title: 'add-torrent',
        torrent_url: torrent_url,
        torrent_name: torrent.name,
        torrent_hash: torrent.hashString,
      })
    }).catch(next)
})

module.exports = router;
