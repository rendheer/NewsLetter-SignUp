const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


const app = express();
// app.use(express.static("public")) This is done to render static files like css and images and 
// they are moved under a folder called public
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    
    const firstName = req.body.fName; 
    const lastName = req.body.lName; 
    const email = req.body.email; 
    console.log(firstName + " " + lastName + " " + email);
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/31ca70721c";
    const options = {
        method: "POST",
        auth: "joshy1:11883c572419645100351478c546853f-us17"
    };
  
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            // res.send("Successfully Subscribed!");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("There was an error with signing up, please try again later!");
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.post("/back", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("The server is running on port 3000");
})

// process.env.PORT is for deploying to heoku
// Mail chimp api key 11883c572419645100351478c546853f-us17
// Audience ID 31ca70721c
// url https://us17.api.mailchimp.com/3.0/

// curl -X PATCH \
//   https://${dc}.api.mailchimp.com/3.0/lists/{list_id} \
//   --user "anystring:${apikey}"' \
//    -d '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}'