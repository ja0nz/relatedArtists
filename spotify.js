// `https://api.spotify.com/v1/search?q=${query}&type=artist` // artists: {item: []}
// `https://api.spotify.com/v1/artists/${id}/related-artists` // artists: []

const Task = require('data.task');
const Either = require('data.either');
const request = require('request');
const oauth = require('./token');

const httpGet = (url) => // :: String -> Task Response
    new Task((rej, res) =>
        request.get(url, {
            'auth': {
                'bearer': oauth
            }
        }, (error, response, body) => error ? rej(err) : res(body))
    );

const first = xs => // :: Array -> Either
    Either.fromNullable(xs[0]); // null checking, code branch to Left or Right

const eitherToTask = either => // :: Either -> InnerType
      either.fold(Task.rejected, Task.of); // Reject or Accept

const parse = Either.try(JSON.parse); // :: Either JSON

const getJSON = url => // :: String -> Task JSON
    httpGet(url) // Task Response
    .map(parse) //  Task Either JSON
    .chain(eitherToTask); // Task JSON or rejected

const findArtist = name => // :: String -> Task Items
    getJSON(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
    .map(res => res.artists.items) // Task Items
    .map(first) // Task Either Items
    .chain(eitherToTask); // Task Items or rejected

const relatedArtists = id => // :: String -> Task [Artists]
    getJSON(`https://api.spotify.com/v1/artists/${id}/related-artists`)
    .map(res => res.artists); // Task Artist
// .map(first) // Task Either Artist
// .chain(eitherToTask); // Fold either to Task Either

module.exports = {
    findArtist,
    relatedArtists
};
