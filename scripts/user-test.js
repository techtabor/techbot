// Commands:
//   me? - echos your name
module.exports = function(robot) {
    robot.listen(/me\?/i, function(msg){
      var name = msg.user.name;
      msg.reply(', you are #{name} to me.')
    });
}
