// Commands:
//   next? - tells the time of the next techtabor
module.exports = function(robot) {
    robot.hear(/next\?/i, function (msg) {
        msg.send("2017. Január 30/31.");
    }
);
}
