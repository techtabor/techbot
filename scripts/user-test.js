// Commands:
//   me? - responds with username and user id
module.exports = function(robot) {
    robot.hear(/me\?/i, function(msg){
      msg.reply('hi there' +
        " " + msg.message.user.name +
        " " + msg.message.user.id
    );
    });
}
