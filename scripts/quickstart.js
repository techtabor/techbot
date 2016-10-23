module.exports = function(robot) {
    robot.respond(/bitek\?/i, function(msg){
      // this log the bit numbers to console as a side effect
      var result = authorize(credentials(), listBits);
      msg.reply("");
    });
}

var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute listBits
 *
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(credentials) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      return listBits(oauth2Client);
    }
  });
}

/**
 * Print the names and number of bits of students in this spreadsheet:
 * https://docs.google.com/spreadsheets/d/14bKF4uSlKfjlgtP_t_ktQ4qLQzHfzu85zhWeix5uo5Q/edit#gid=1615643101
 */
function listBits(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '14bKF4uSlKfjlgtP_t_ktQ4qLQzHfzu85zhWeix5uo5Q',
    range: 'bitek!A2:B20',
  }, function(err, response) {
    var reply = "";
    if (err) {
      reply = 'The API returned an error: ' + err;
    } else {
      var rows = response.values;
      if (rows.length == 0) {
        reply = 'No data found.';
      } else {
        reply += 'Név, Össz:\n';
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          // Print columns A (Name) and B (Össz).
          reply = reply + row[0] + ": " + row[1] + "\n";
        }
      }
    }
    console.log(reply);
    return reply;
  });
}

function credentials() {
  var cs = '{"installed":{"client_id":"648831429316-0sm9tr096o2qtct9vn99om9466khlsp0.apps.googleusercontent.com",' +
    '"project_id":"angular-rhythm-147222","auth_uri":"https://accounts.google.com/o/oauth2/auth",' +
    '"token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"' +
    process.env.CLIENT_SECRET +
    '","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}';
  return JSON.parse(cs);
}
