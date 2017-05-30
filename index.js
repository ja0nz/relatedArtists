
const Task = require('data.task');
const Spotify = require('./spotify');

const argv = new Task((rej, res) => res(process.argv)),
      names = argv.map(argv => argv.slice(2));

const related = name =>
      Spotify.findArtist(name)
      .map(artist => artist.id)
      .chain(Spotify.relatedArtists)
      .map(artists => artists.map(artist => artist.name));

const main = ([artist1, artist2]) =>
      Task.of(rels1 => rels2 => [rels1, rels2])
      .ap(related(artist1))
      .ap(related(artist2));


 names.chain(main).fork(console.error, console.log);

// Spotify.findArtist('oasis').fork(console.error, console.log);
