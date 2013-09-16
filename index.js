var xml2js = require('xml2js'),
    fs = require('fs'),
    dateUtils = require('date-utils'),
    toMarkdown = require('to-markdown').toMarkdown;


var parser = new xml2js.Parser(xml2js.defaults["0.2"]);
var file = '/resources/1.xml';
var output = "/_post/";
var encode = "UTF-8";

fs.readFile(__dirname + file, encode, function (err, data) {
    if (err) {
        console.log(err);
        return;
    }

    parser.parseString(data.trim(), function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        var blogs = result.rss.channel[0].item;

        console.log("all blogs " + blogs.length + " will be convert.");
        blogs.forEach(function (item) {

            var pubDate = new Date(item.pubDate).toFormat("YYYY-MM-DD HH:MI:SS");
            var file = pubDate + "_" + item.title + ".md";
            var content = toMarkdown(item.description[0]);
            fs.writeFile(__dirname + output + file, content, {encoding: encode}, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
//                console.log(file + " done !");
            });
        });
    });
});