const fs = require("fs-extra");
const minifier = require('html-minifier');
const { inlineSource } = require("inline-source");

(async () => {

    console.log("Starting build ...");

    console.time("Build took");

    const dir = "./docs";
    const dev = "http://localhost/q";
    const live = "https://q.chikuse.co.za/apiv2";
    const bitmap = fs.readFileSync("favicon.webp");
    const base64Icon = Buffer.from(bitmap).toString("base64");
    const handler = e => e.fileContent = e.fileContent.replace("//await", "await");
    const html = await inlineSource("index.html", {
        compress: true,
        attribute: false,
        ignore: ["json", "webp", "ico", "png", "svg"],
        handlers: [handler],
        fs
    });

    fs.emptyDirSync(dir);
    fs.copySync("sw.js", `${dir}/sw.js`);
    fs.copySync("robots.txt", `${dir}/robots.txt`);
    fs.copySync("manifest.json", `${dir}/manifest.json`);
    fs.copySync("images/icons-192.png", `${dir}/images/icons-192.png`);
    fs.copySync("images/icons-512.png", `${dir}/images/icons-512.png`);
    fs.outputFileSync(`${dir}/index.html`, minifier.minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
    })
        .replace(/favicon.webp/g, `data:image/webp;base64,${base64Icon}`)
        .replace("__oncontextmenu", "oncontextmenu")
        .replace(dev, live));

    console.timeEnd("Build took");

})();