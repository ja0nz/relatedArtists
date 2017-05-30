
const Task = require('data.task');
const Spotify = require('./spotify');
const Sum = require('./sum');
const Pair = require('./pair');
const {List} = require('immutable-ext');

const argv = new Task((rej, res) => res(process.argv)), // :: Task Name
      names = argv.map(argv => argv.slice(2)); // :: Task Bandnamens

const Intersection = entries => // Semigroup Array
      ({
          entries,
          concat: ({entries: ys}) => // set operation
              Intersection(entries.filter(x => ys.some(y => x == y)))
      });


const related = name => // :: String -> Task [Artistsnames]
      Spotify.findArtist(name) // Task Items
      .map(artist => artist.id) // Task Ids
      .chain(Spotify.relatedArtists) // :: ID -> Task [Artists]
      .map(artists => artists.map(artist => artist.name)); // Cut out artistnames  

/*
  Extended example

  const artistIntersection = rels =>
  rels.foldMap(x => Pair(Intersection(x), Sum(x.length))) // Making a pair
  .bimap(x => x.xs, y => y.x) // run two functors
  .toList() // Natural transformation
*/

const artistIntersection = rels => // :: Task [Task artist1, Task Artist2] -> [names] 
      rels.foldMap(Intersection).entries; // no empty list assumed


const main = (names) => // :: String -> [names]
      List(names) // List of tasks
      .traverse(Task.of, related) // traverse every enty ito an Task of lists
      .map(artistIntersection); // map out List and foldMap to Semigroup



/*
  1 Applicative workflow

  Applicative Functor
  const artistIntersection = rels1 => rels2 =>
  Intersection(rels1).concat(Intersection(rels2)).xs;

  Apply to both Artists
  const main = ([artist1, artist2]) =>
  // Task.of(rels1 => rels2 => [rels1, rels2])
  Task.of(artistIntersection)
  .ap(related(artist1))
  .ap(related(artist2));

  Limited to two names
*/

names.chain(main)
    .fork(console.error, console.log);
