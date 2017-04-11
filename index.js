const fs = require('fs');
const AnkiExport = require('anki-apkg-export').default;

//apkg.addMedia('anki.png', fs.readFileSync('anki.png'));

let categories = ['search', 'layers', 'buffers', 'files', 'jump', 'git'];

categories.forEach((cat) => {
    const apkg = new AnkiExport('spacemacs-bindings::' + cat);
    const catContent = fs.readFileSync(`./bindings/${cat}`);
    catContent.toString()
        .split('\n')
        .map((line) => {
            const sides = line.split(' -- ');
            if (sides.length === 2) {
                let keys = `<kbd>${sides[0]}</kbd>`.replace('SPC', '<i>SPC</i>')
                apkg.addCard(keys, sides[1], {tags: [cat, 'binding to def']})
                apkg.addCard(sides[1], keys, {tags: [cat, 'def to binding']})
                // maybe: option single sided
            }
        })
    apkg
        .save()
        .then(zip => {
            fs.writeFileSync(`./spacemacs-${cat}.apkg`, zip, 'binary');
            console.log(`Package has been generated: spacemacs-${cat}.apkg`);
        })
        .catch(err => console.log(err.stack || err));

})
