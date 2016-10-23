function getToken() {
  var token = '{"access_token":"' +
    process.env.G_ACCESS_TOKEN +
    '","token_type":"Bearer","refresh_token":"' +
    process.env.G_REFRESH_TOKEN +
    '","expiry_date":1477180321256}';
  return JSON.parse(token);
}
