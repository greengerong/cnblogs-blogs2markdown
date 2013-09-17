var xml2js = require('xml2js'),
    fs = require('fs'),
    underscore = require('underscore')  ,
    toMarkdown = require('to-markdown').toMarkdown;

require('date-utils');

var parser = new xml2js.Parser(xml2js.defaults["0.2"]);
var file = __dirname + '/resources/1.xml';
var templateFile = __dirname + '/resources/blog.tmpl';
var output = __dirname + "/_post/";
var encode = "UTF-8";

fs.readFile(file, encode, function (err, data) {
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

            var pubDate = new Date(item.pubDate).toFormat("YYYY-MM-DD-HH:MI:SS");
            var title = item.title[0].replace(/\//g, "_");
            var file = pubDate + "-" + title + ".md";
            var content = toMarkdown(item.description[0]);

            var data = { title: item.title[0], markdown: content.trim()};
            var fileText = underscore.template(fs.readFileSync(templateFile, encode).trim(), data);
            fs.writeFile(output + file, fileText, {encoding: encode}, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(file + " done !");
            });
        });
    });
});