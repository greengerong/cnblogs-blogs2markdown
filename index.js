var xml2js = require('xml2js'),
    fs = require('fs'),
    underscore = require('underscore')  ,
    toMarkdown = require('to-markdown').toMarkdown,
    pinYin = require("./PinYin");

require('date-utils');

var parser = new xml2js.Parser(xml2js.defaults["0.2"]);
var file = __dirname + '/resources/CNBlogs_BlogBackup_131_200907_201309.xml';
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

            var pubDate = new Date(item.pubDate).toFormat("YYYY-MM-DD-HH-MI-SS");

            var title = item.title[0].replace(/(\/)|(-+)|(\.)|(>)/g, "_").replace(/([\u4e00-\u9fa5])/g,function (matched, $1) {
                return  "_" + pinYin($1, {
                        style: pinYin.STYLE_NORMAL,
                        heteronym: false
                    }
                ).join("_") + "_";
            }).replace(/_+/g, "_").replace(/(^_)|(_$)|(\s+)/g, "");
            var file = pubDate + "_" + title + ".md";

            var content = toMarkdown(item.description[0]);

            var data = { title: item.title[0], markdown: content.trim(), url: item.guid[0]};
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