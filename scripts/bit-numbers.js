// Commands:
//   bitek? - lists everyone's bits, only available to mentors
//   bitjeim? - tells the number of bits you have
//   bitdoc - shows link of doc where you can edit bits
module.exports = function(robot) {
  var mentor_regex = 'Shell|czeildi|csirke|mdanka|nlaci|porcupine|szgabbor|vizilo'

  robot.hear(/bitdoc/i, function(msg){
    if (msg.message.user.name.match(mentor_regex)) {
      msg.send(
        "https://docs.google.com/spreadsheets/d/" +
        process.env.HUBOT_GOOGLE_SPREADSHEET_SHEET_KEY +
        "/edit#gid=1615643101"
      );
    } else {
      msg.reply("Neked nincs jogosultságod ehhez a google sheetshez.");
    }
  });

    robot.hear(/bitek\?/i, function(msg){
      if (msg.message.user.name.match(mentor_regex)) {
        authorize(msg, '.*', listBits);
      } else {
        msg.reply("Neked nincs jogosultságod mindenki bitjeit lekérdezni. Használd a bitjeim? parancsot.");
      }
    });

    robot.hear(/bitjeim\?/, function(msg) {
      authorize(msg, msg.message.user.name, listBits);
    });
}

var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


function authorize(msg, uname_regexp, callback) {
  var credentials = getCredentials();
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.setCredentials(getToken());
  callback(oauth2Client, uname_regexp, msg);
}

/**
 * Print the names and number of bits of students in the specified spreadsheet:
 */
function listBits(auth, uname_regexp, msg) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: process.env.HUBOT_GOOGLE_SPREADSHEET_SHEET_KEY,
    range: 'bitek!A2:C22',
  }, function(err, response) {
    var reply = "";
    if (err) {
      reply = 'The API returned an error: ' + err;
    } else {
      var rows = response.values;
      if (rows.length == 0) {
        reply = 'No data found.';
      } else {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row[0].search(uname_regexp) != -1) {
            reply = reply + row[1] + ": " + row[2] + "\n";
          }
        }
        if (reply === "") {
          reply = "Nem szerepelsz a táblázatban, azaz 0 bited van."
        }
      }
    }
    msg.send(reply);
  });
}

function getCredentials() {
  var cs = '{"installed":{"client_id":"626461546407-1j4b342lradl1slaj0ngvsbsce41qv7s.apps.googleusercontent.com",' +
    '"project_id":"sincere-venture-148319","auth_uri":"https://accounts.google.com/o/oauth2/auth",' +
    '"token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"' +
    process.env.CLIENT_SECRET +
    '","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}';
  return JSON.parse(cs);
}

function getToken() {
  var token = '{"access_token":"' +
    process.env.G_ACCESS_TOKEN +
    '","token_type":"Bearer","refresh_token":"' +
    process.env.G_REFRESH_TOKEN +
    '","expiry_date":1478372605780}';
  return JSON.parse(token);
}
