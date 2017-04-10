const fs = require('fs');
const AnkiExport = require('anki-apkg-export').default;

const apkg = new AnkiExport('spacemacs-binding');

//apkg.addMedia('anki.png', fs.readFileSync('anki.png'));

apkg.addCard('card #1 front', 'card #1 back');
apkg.addCard('card #2 front', 'card #2 back', {tags: ['nice', 'better card']});
// apkg.addCard('card #3 with image <img src="anki.png" />', 'card #3 back');

let categories = ['search'];

categories.forEach((cat) => {
    const catContent = fs.readFileSync(`./bindings/${cat}`)
    catContent.toString()
        .split('\n')
        .map((line) => {
            const sides = line.split(' - ');
            apkg.addCard(sides[0], sides[1], {tags: [cat, 'binding to def']})
            apkg.addCard(sides[1], sides[0], {tags: [cat, 'def to binding']})
        })
})

// maybe: option two sided


apkg
    .save()
    .then(zip => {
        fs.writeFileSync('./output.apkg', zip, 'binary');
        console.log(`Package has been generated: output.pkg`);
    })
    .catch(err => console.log(err.stack || err));
