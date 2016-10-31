robot.respond /google (.*) /i, (res) ->
	question = res.match[1]
	res.reply "http://lmgtfy.com/?q=#{question}"