#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const AnkiExport = require('anki-apkg-export').default;

const categories = [
  'search',
  'layouts',
  'buffers',
  'files',
  'jump',
  'git',
  'global',
  'projects',
  'lisp',
  'toggle'
];

const generate = async folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  const promises = categories.map(cat => {
    const apkg = new AnkiExport(`spacemacs-bindings::${cat}`);
    const catContent = fs.readFileSync(path.join(__dirname, `mappings/${cat}`), 'utf-8');
    catContent.split('\n').map(line => {
      const sides = line.split(' -- ');
      if (sides.length === 2) {
        const keys = `<kbd>${sides[0]}</kbd>`.replace('SPC', '<i>SPC</i>');

        apkg.addCard(keys, sides[1], {tags: [cat, 'binding to def']});
        // apkg.addCard(sides[1], keys, {tags: [cat, 'def to binding']})
        // maybe: option two sided -> would need to shuffle the cards

        // §idea: extra args to add tags --
      }
    });

    return apkg
      .save()
      .then(zip => {
        const deckPath = path.join(folder, `spacemacs-${cat}.apkg`);
        fs.writeFileSync(deckPath, zip, 'binary');
        console.log(`🗂  spacemacs-${cat}.apkg generated`);
        return deckPath;
      })
      .catch(err => console.error(err.stack || err));
  });

  await Promise.all(promises);
  console.log(`All ${categories.length} decks have been generated in '${folder}' 🗃`);
};
module.exports = {generate};
if (!module.parent) {
  const folder = process.argv[2];
  if (!folder) {
    console.error('Provide a folder to generate deck in');
    process.exit(1);
  }
  console.log(`About to generate spacemacs anki decks in provided folder '${folder}' 🚀`);
  generate(folder);
}
