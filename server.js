//Install express server
const express = require('express');

const app = express();

// Serve only the static files form the dist directory
// SampleAngular - name of app
app.use(express.static('./dist/SampleAngular'));

//Wait for a request to any path and redirect all of the requests to index.html
app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/SampleAngular/'}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);