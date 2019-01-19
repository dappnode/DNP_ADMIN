const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, './build/index.html');
let htmlString = fs.readFileSync(indexPath, 'utf8');

// Replace js scripts

const jsTags = htmlString.match(/<script[^<>]+><\/script>/g) || []
// [ '<script type="text/javascript" src="/static/js/main.0b9b0536.js"></script>' ]
jsTags.forEach(jsTag => {
    try {
        const jsSubPath = (jsTag.split('src="')[1] || "").split('"')[0]
        const jsPath = path.resolve(__dirname, './build', `.${jsSubPath}`);
        console.log({jsPath, jsSubPath})
        let jsString = fs.readFileSync(jsPath, 'utf8'); 
        // Remove script references that break the html
        // "-<script type="text/javascript" src="/static/js/main.0b9b0536.js"></script>"

        // jsString = removeAllMatches(jsString, /<script[^<>]+><\/script>/g)
        // const jsTags2 = jsString.match(/<script[^<>]+><\/script>/g);
        // console.log('jsTags2')
        // console.log(jsTags2)
        // console.log(jsString)
        
        htmlString = htmlString.replace(jsTag, '<script>\n'+jsString+'\n</script>')
    } catch (e) {
        console.error(`Error injecting js from ${jsTag}: ${e.stack}`)
    }
})

// Replace css scripts

const cssTags = htmlString.match(/<link[^<>]+stylesheet[^<>]+>/g) || [];
// [ '<link href="/static/css/main.5d2936ec.css" rel="stylesheet">' ]
cssTags.forEach(cssTag => {
    try {
        const cssSubPath = (cssTag.split('href="')[1] || "").split('"')[0]
        const cssPath = path.resolve(__dirname, './build', `.${cssSubPath}`);
        console.log({cssPath, cssSubPath})
        let cssString = fs.readFileSync(cssPath, 'utf8'); 
        htmlString = htmlString.replace(cssTag, `<style>${cssString}</style>`)
    } catch (e) {
        console.error(`Error injecting css from ${cssTag}: ${e.stack}`)
    }
})

fs.writeFileSync(indexPath, htmlString)


// Utils

function removeAllMatches(s, reg) {
    const matches = s.match(reg) || [];
    console.log(matches)
    matches.forEach(match => {
        s = s.replace(match, "")
    })
    return s
}

