// Commands:
//   google <query> - returns query of lmgtfy
module.exports = function(robot) {
    robot.hear(/google (.*)/i, function (msg) {
        msg.reply('http://lmgtfy.com/?q=' + msg.match[1])
    }
);
}
