const fs = require("fs-extra");
const { inlineSource } = require("inline-source");

(async () => {
    console.log("Starting build ...");

    const dir = "./dist";
    const start = Date.now();
    let html = await inlineSource("index.html", {
        compress: true,
        attribute: false,
        ignore: ["json", "webp", "ico", "png"],
        handlers: [e => {
            e.fileContent = e.fileContent.replace("//await", "await");
        }],
        fs
    });

    html = html
        .replace("___oncontextmenu", "oncontextmenu")
        .replace("http://localhost/q", "https://chikuse.co.za/q/apiv2");

    fs.emptyDirSync(dir);
    fs.copySync("sw.js", `${dir}/sw.js`);
    fs.copySync("favicon.ico", `${dir}/favicon.ico`);
    fs.outputFileSync(`${dir}/index.html`, html);
    fs.copySync("manifest.json", `${dir}/manifest.json`);
    fs.copySync("./images/bg.webp", `${dir}/images/bg.webp`);
    fs.copySync("./images/icons-192.png", `${dir}/images/icons-192.png`);
    fs.copySync("./images/icons-512.png", `${dir}/images/icons-512.png`);

    const buildTime = Date.now() - start;

    console.log(`Successfully built in ${buildTime}ms`);
})();