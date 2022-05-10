

console.clear();

const {WebRiskServiceClient} = require('@google-cloud/web-risk');
const express = require('express');
const cors = require('cors');
const { assess } = require('./phish-zip');


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

  // let url = atob(req.params.url);

  // if (url.indexOf('google.com') === -1)
  //   return res.send({ safe: false });
  // else
  //   return res.send({ safe: true });

  try {

    const url = atob(req.params.url);
    // let safe = await isURLSafe(url);
    let { safe } = await assess(url);

    res.send({ safe });

  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {

	console.log('Server started at PORT', PORT);
});

