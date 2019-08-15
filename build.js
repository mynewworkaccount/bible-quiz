const fs = require("fs-extra");
const { inlineSource } = require("inline-source");

(async () => {
    console.log("Starting build ...");

    const dir = "./dist";
    const start = Date.now();
    const dev = "http://localhost/q";
    const live = "https://chikuse.co.za/q/apiv2";
    const html = await inlineSource("index.html", {
        compress: true,
        attribute: false,
        ignore: ["json", "webp", "ico", "png"],
        handlers: [e => {
            e.fileContent = e.fileContent.replace("//await", "await");
        }],
        fs
    });

    fs.emptyDirSync(dir);
    fs.copySync("sw.js", `${dir}/sw.js`);
    fs.copySync("favicon.ico", `${dir}/favicon.ico`);
    fs.copySync("manifest.json", `${dir}/manifest.json`);
    fs.copySync("./images/bg.webp", `${dir}/images/bg.webp`);
    fs.copySync("./images/icons-192.png", `${dir}/images/icons-192.png`);
    fs.copySync("./images/icons-512.png", `${dir}/images/icons-512.png`);
    fs.outputFileSync(`${dir}/index.html`, html
        .replace("__oncontextmenu", "oncontextmenu")
        .replace(dev, live));

    const buildTime = Date.now() - start;

    console.log(`Successfully built in ${buildTime}ms`);
})();