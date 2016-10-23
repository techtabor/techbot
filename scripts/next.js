// Commands:
//   next? - tells the time of the next tecttabor
module.exports = function(robot) {
    robot.hear(/next\?/i, function (msg) {
        msg.send("2016. November 14.");
    }
);
}
