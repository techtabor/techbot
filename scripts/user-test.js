// Commands:
//   me - echos your name
module.exports = function(robot) {
    robot.hear(/me/i, function(msg){
      msg.reply('hi there, ' + msg.message.user);
    });
}
