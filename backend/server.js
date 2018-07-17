const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');
// Import Facebook and Google OAuth apps configs
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { makeExecutableSchema } = require('graphql-tools');
const graphqlHTTP = require('express-graphql');
const mongoose =  require('mongoose');
var https = require('https');
var fs = require('fs');
const typeDefs  = require('./schema/schema');
const resolvers = require('./schema/resolver');
const User = require('./model/users');

// mlab database connection
mongoose.connect('mongodb://apollo_react:apollo123@ds125031.mlab.com:25031/apollo_react');
mongoose.connection.once('open', () =>{
  console.log("connected to database");
});
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const SECRET = 'aslkdjlkaj10830912039jlkoaiuwer';

// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes
const transformFacebookProfile = (profile) => ({
  name: profile.name,
  avatar: profile.picture.data.url,
});

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
  name: profile.displayName,
  avatar: profile.image.url,
});

// Register Facebook Passport strategy
passport.use(new FacebookStrategy(
    {
        clientID: '164587440902214',
        clientSecret: '131f0306c2778723271c7c0ae2346206',
        callbackURL: 'https://localhost:4000/auth/facebook/callback',
        profileFields: ['id', 'name', 'displayName', 'picture', 'email'],
    },
  // Gets called when user authorizes access to their profile
  function (accessToken, refreshToken, profile, done){
    // Return done callback and pass transformed user object
     done(null, transformFacebookProfile(profile._json))
     }
));

// Register Google Passport strategy
passport.use(new GoogleStrategy(
  {
    clientID: '985241434805-isu6i3pl9o5gf64fgnmh9coav06cuikr.apps.googleusercontent.com',
    clientSecret: 'OWkDy36_UL0UpALzMFfX1Ahu',
    callbackURL: 'https://localhost.xip.io:4000/auth/google/callback',
  },
  function (accessToken, refreshToken, profile, done){
    done(null, transformGoogleProfile(profile._json))
    }
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));
// Initialize http server
const app = express();

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Facebook auth routes
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  // Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
  (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));

// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));


app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context: { User, SECRET } }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

//var privateKey  = fs.readFileSync('C:/demo/ca.key', 'utf8');
//var certificate = fs.readFileSync('C:/demo/ca.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
//var httpsServer = https.createServer(credentials,app);
//httpsServer.listen(4000);

const server = app.listen(4000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
