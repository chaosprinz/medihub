/*
## Dependencies and setup
 */
const Express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const CookieParser = require('cookie-parser')

const Config = require('./config')

let app = Express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
let spotify = new SpotifyWebApi(Config.spotify)

app.use(CookieParser())

/**/

const Helper = {
  randomString: (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
      '0123456789'
    let randomString = ""
    for(x = 0; x === (length - 1); x++) {
      randomString += chars[Math.round(Math.random() * chars.length)]
    }
    return randomString
  },

  getSpotifyToken: () => ({
    access_token: spotify.getAccessToken(),
    refresh_token: spotify.getRefreshToken()
  })
}

const spotifyLogin = (req, res) => {
  let state = Helper.randomString(16)
  let authorizeURL = spotify.createAuthorizeURL(Config.scopes, state)
  res.redirect(authorizeURL)
}

const spotifyAuthCallback = (req, res) => {
  let code = req.query.code || null
  spotify.authorizationCodeGrant(code).then(
    (data) => {
      spotify.setAccessToken(data.body['access_token'])
      spotify.setRefreshToken(data.body['refresh_token'])
      res.json(Helper.getSpotifyToken())
    }
  )
}

const spotifyMessageHandler = (msg) => {
  switch(msg.command) {
    case 'get_token':
      spotifySocket.emit('token', Helper.getSpotifyToken())
  }
}
/*
## Express-routing
*/
app.get('/spotify/login', spotifyLogin)
app.get('/spotify/cb', spotifyAuthCallback)

/*
socket.io handling
*/
let spotifySocket
let spotifyIo =io
  .of('/spotify')
  .on('connection', (socket) => {
    socket.on("message", spotifyMessageHandler)
    socket.emit('message','hallo du hanswurst')
  })


server.listen(Config.port,
  () => console.log(`API-Server listening on port ${Config.port}`))
