const fs = require('fs');
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

if (!fs.existsSync('output')) fs.mkdirSync('output');

categories.forEach(cat => {
  const apkg = new AnkiExport(`spacemacs-bindings::${cat}`);
  const catContent = fs.readFileSync(`./mappings/${cat}`, 'utf-8');
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

  apkg
    .save()
    .then(zip => {
      fs.writeFileSync(`./output/spacemacs-${cat}.apkg`, zip, 'binary');
      console.log(`Package has been generated: spacemacs-${cat}.apkg`);
    })
    .catch(err => console.log(err.stack || err));
});
