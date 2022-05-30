

console.clear();

const {WebRiskServiceClient} = require('@google-cloud/web-risk');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { assess } = require('./phish-zip');

const { init: initDB } = require('./db');
const { addBlacklist, getBlacklist } = require('./request-handlers');


const keyFilename = `${__dirname}/ultra-complex-333814-ee49203db903.json`;

async function isURLSafe(uri) {
  // Create the WebRisk client library.
  const client = new WebRiskServiceClient({ keyFilename });

  // Create an API request to check for malware, social engineering,
  // and unwanted software.
  const request = {
    uri: uri,
    threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
  };

  // call the WebRisk searchUris API.
  const {threat} = (await client.searchUris(request))[0];
  if (threat) {
    // console.info(threat);
    return false;
  } else {
    // console.info('no threats found');
    return  true;
  }
}



function atob(str) {
  return Buffer.from(str, 'base64').toString();
}


const app = express();

// middlewares

app.use(morgan('dev'));
app.use(express.static('static'));


app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/static/index.html`);
});


const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: 'Content-Type,openstack-xavisoft-auth-token',
  exposedHeaders: 'openstack-xavisoft-auth-token'
}

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json())


app.get('/api/url/:url', async function (req, res) {

  let url = atob(req.params.url);

  if (url.indexOf('google.com') === -1)
    return res.send({ safe: false });
  else
    return res.send({ safe: true });

  // console.log('requested.');

  try {

    const url = atob(req.params.url);
    let safe = await isURLSafe(url);
    // let { safe } = await assess(url);

    res.send({ safe });

  } catch (err) {
    res.status(500).send();
    console.log(String(err));
  }
});


app.get('/api/blacklist', getBlacklist);
app.post('/api/blacklist/', addBlacklist);
app.get('/download-database', function(req, res) {
  res.download(`${__dirname}/db/db.sqlite`);
})




const PORT = process.env.PORT || 8080;

(async () => {

	await initDB();

	app.listen(PORT, function() {

		console.log('Server started at PORT', PORT);
	});

})();

