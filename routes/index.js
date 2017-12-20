const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'add-transmission' });
});

/* POST submission form */
router.post('/', function (req, res, next) {
  console.log(req.body)
  torrent_url = req.body.url
  res.status(201)
  res.send(`Torrenting ${torrent_url}.`)
})

module.exports = router;
