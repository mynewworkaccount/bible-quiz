const fs = require("fs-extra");
const { inlineSource } = require("inline-source");

(async () => {
    console.log("Starting build ...");

    const dir = "./dist";
    const testApi = "http://localhost/q";
    const liveApi = "https://chikuse.co.za/q/api";
    
    const start = Date.now();
    const html = await inlineSource("index.html", {
        compress: true,
        attribute: false,
        ignore: ["json", "ico", "png"],
        fs
    });

    fs.emptyDirSync(dir);
    
    fs.copySync("./images", `${dir}/images`);
    fs.copySync("favicon.ico", `${dir}/favicon.ico`);
    fs.copySync("manifest.json", `${dir}/manifest.json`);
    fs.outputFileSync(`${dir}/index.html`, html.replace(testApi, liveApi));

    let sw = fs.readFileSync('sw.js', 'utf8');
    sw = sw.replace("'/app.js',\n", "");
    sw = sw.replace("'/style.css',\n", "");
    fs.outputFileSync(`${dir}/sw.js`, sw);

    const buildTime = Date.now() - start;

    console.log(`Successfully built in ${buildTime}ms`);

})();