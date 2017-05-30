"https://api.spotify.com/v1/search?q=${query}&type=artist" // artists: {item: []}
"https://api.spotify.com/v1/artists/${id}/related-artists" // artists: []

const Task = require('data.task');
const Either = require('data.either');
const request = require('request');
const oauth = require('./token');

const httpGet = (url) =>
    new Task((rej, res) =>
        request.get(url, {
            'auth': {
                'bearer': oauth
            }
        }, (error, response, body) => error ? rej(err) : res(body))
    );

const first = xs =>
    Either.fromNullable(xs[0]);

const eitherToTask = either => either.fold(Task.rejected, Task.of);
const parse = Either.try(JSON.parse);
const getJSON = (url) =>
    httpGet(url)
    .map(parse) // Either Task Artist
    .chain(eitherToTask); // Task Artist

const findArtist = name =>
    getJSON(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
    .map(res => res.artists.items) // Task Items
    .map(first) // Task Either Items
    .chain(eitherToTask); // Fold either to Task Items

const relatedArtists = id =>
    getJSON(`https://api.spotify.com/v1/artists/${id}/related-artists`)
    .map(res => res.artists); // Task Artist
// .map(first) // Task Either Artist
// .chain(eitherToTask); // Fold either to Task Either

module.exports = {
    findArtist,
    relatedArtists
};
