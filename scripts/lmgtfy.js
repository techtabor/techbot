// Commands:
//   google <query> - returns query of lmgtfy
module.exports = function(robot) {
    robot.respond(/google (.*)/i, function (msg) {
        msg.send('http://lmgtfy.com/?q=' + msg.match[1].split(' ').join('+'))
    }
);
}
