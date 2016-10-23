var MsgReply = function () {
  this.reply = "";
}

MsgReply.prototype.getReply = function() {
  return this.reply;
};

MsgReply.prototype.setReply = function(r) {
    this.reply = r;
}

module.exports = function(robot) {
    robot.hear(/bitek\?/i, function(msg){
      reply_with = new MsgReply();
      authorize(getCredentials(), reply_with, msg, listBits);
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


function authorize(credentials, reply_with, msg, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
  callback(oauth2Client, reply_with, msg);
  // Check if we have previously stored a token.
  // fs.readFile(TOKEN_PATH, function(err, token) {
  //   if (err) {
  //     getNewToken(oauth2Client, callback);
  //   } else {
  //     oauth2Client.setCredentials(JSON.parse(token));
  //     callback(oauth2Client, reply_with, msg);
  //   }
  // });
}

/**
 * Print the names and number of bits of students in the specified spreadsheet:
 */
function listBits(auth, reply_with, msg) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: process.env.HUBOT_GOOGLE_SPREADSHEET_SHEET_KEY,
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
    reply_with.setReply(reply);
    msg.send("bit numbers under development\n"); //+ reply_with.getReply());
  });
}

function getCredentials() {
  var cs = '{"installed":{"client_id":"648831429316-0sm9tr096o2qtct9vn99om9466khlsp0.apps.googleusercontent.com",' +
    '"project_id":"angular-rhythm-147222","auth_uri":"https://accounts.google.com/o/oauth2/auth",' +
    '"token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"' +
    process.env.CLIENT_SECRET +
    '","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}';
  return JSON.parse(cs);
}
