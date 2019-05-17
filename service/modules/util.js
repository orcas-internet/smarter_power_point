const fs = require('fs');

function getFileContents(fn) {
    const fullName = process.cwd() + '/' + fn;
    if (fs.existsSync(fullName)) {
        return fs.readFileSync(fullName, {encoding: 'utf8'});
    }

    return '[]';
}

function saveToFile(fn, content) {
    const fullName = process.cwd() + '/' + fn;
    fs.writeFileSync(fullName, content, {encoding: 'utf8'});
}

module.exports.getFileContents = getFileContents;
module.exports.saveToFile = saveToFile;