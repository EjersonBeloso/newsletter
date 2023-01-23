const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", (req, res) => {
	res.redirect("/");
});

app.post("/success", (req, res) => {
	res.redirect("/");
});

app.post("/", (req, res) => {
	const first = req.body.firstName;
	const last = req.body.lastName;
	const email = req.body.email;
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: first,
					LNAME: last,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);
	const url = "https://us9.api.mailchimp.com/3.0/lists/62d99682e3";
	const options = {
		method: "POST",
		auth: "ejerson:0c6a3337f63fbf4645778dc568cd68cf-us9",
	};
	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", (data) => {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});

app.listen(3000, () => {
	console.log("Server is running on port 3000.");
});

//api key
//0c6a3337f63fbf4645778dc568cd68cf-us9

//unique id for list
//62d99682e3
