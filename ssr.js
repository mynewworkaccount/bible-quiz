const express = require("express");
const puppeteer = require("puppeteer");
const fs = require('fs');
const rimraf = require("rimraf");
const csso = require('csso');
const Terser = require("terser");

async function ssr(url) {
    const start = Date.now();
    const scripts = {};
    const stylesheets = {};
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.on("response", async resp => {
        const responseUrl = resp.url();
        const resourceType = resp.request().resourceType();
        const sameOrigin = new URL(responseUrl).origin === new URL(url).origin;
        if (!sameOrigin) return;

        if (resourceType === "stylesheet") {
            const styles = await resp.text();
            const minifiedCss = csso.minify(styles).css;
            stylesheets[responseUrl] = minifiedCss;
        }
        if (resourceType === "script") {
           const scriptstext = await resp.text();
            scripts[responseUrl] = Terser.minify(scriptstext).code;
        }
    });

    await page.goto(url, { waitUntil: "networkidle0" });

    await page.$$eval('link[rel="stylesheet"]', (links, content) => {
        links.forEach(link => {
            const text = content[link.href];
            if (text) {
                const style = document.createElement("style");
                style.textContent = text;
                link.replaceWith(style);
            }
        });
    }, stylesheets);

    await page.$$eval('script', (links, content) => {
        links.forEach(link => {
            const text = content[link.src];
            if (text) {
                const script = document.createElement("script");
                script.textContent = text;
                link.replaceWith(script);
            }
        });
    }, scripts);

    const html = await page.content();
    await browser.close();

    const ttRenderMs = Date.now() - start;
    console.info(`Headless rendered page in: ${ttRenderMs}ms`);
    return html;
}

(async () => {
    const html = await ssr(`http://localhost:5500/index.html`);
})();