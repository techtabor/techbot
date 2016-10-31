// Commands:
//   google <query> - returns query of lmgtfy
module.exports = function(robot) {
    robot.respond(/google (.*)/i, function (msg) {
        var question = msg.match[1]
        msg.send(`http://lmgtfy.com/?q=${question}`);
    }
);
}
