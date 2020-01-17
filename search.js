var YouTube = require('youtube-node');
var async = require('async');
var searchitunes = require('searchitunes');

//var cheerio    = require('cheerio');
//var http       = require('http');
//var https      = require('https');

var youtube = new YouTube();
var lfm = null;

module.exports.search = function search(options, callback) {
  var internalOpts = {
    search: options.search || '',
    limit: options.limit || 50,
    itunesCountry: options.itunesCountry,
    youtubeAPIKey: options.youtubeAPIKey,
  };

  // init youtube and lastfm
  youtube.setKey(internalOpts.youtubeAPIKey);

  itunesLookup(
    internalOpts.search,
    internalOpts.itunesCountry,
    internalOpts.limit,
    function (err, tracks) {
      if (err) {
        callback(err); return;
      } else {
        async.map(
          tracks,
          findYoutubeURLForTrack,
          function (err, tracksWithYoutube) {
          if (err) {
            callback(err); return;
          }

          var tracksFound = tracksWithYoutube.filter(function (item) {
            return item != null;
          });

          callback(null, uniqueTracks(tracksFound));
        });
      }
    }
  );
};

function findYoutubeURLForTrack(trackObj, callback) {
  var query = trackObj.title + ' ' + trackObj.artist;

  trackObj.streamId = Buffer.from(query).toString('base64');
  callback(null, trackObj);
  //console.log(`Querying for '${query}'...`);
  /*
	https.get('https://www.youtube.com/results?search_query=' + query, (resp) => {
		let body = '';

		resp.on('data', (chunk) => {
			body += chunk;
		});

		resp.on('end', () => {
			let $ = cheerio.load(body);

			let videoLink = null;
			let videoTitle = null;

			$('a[rel="spf-prefetch"]').each((i, elem) => {
				if ($(elem).attr('href').toString().indexOf('ad') === -1) {
					videoLink = `https://www.youtube.com${$(elem).attr('href')}`;
					videoTitle = $(elem).attr('title');

					//console.log(`Found match: '${videoTitle}'!`);

					//res.redirect('/download?url=' + videoLink + '&title=' + videoTitle);
          trackObj.youtubeId = $(elem).attr('href').replace('/watch?v=', '');
          callback(null, trackObj);

					return false;
				}
			});

      if (!trackObj.youtubeId) {
         callback('Not Found', null);
      }
		});
  });*/
};

function findYoutubeURLForTrackOld(trackObj, callback) {
  youtube.search(
    trackObj.title + ' ' + trackObj.artist,
    1,
    function (error, result) {
    if (error || result.items.length === 0) {
      callback(error, null);
    } else {
      trackObj.youtubeId = result.items[0].id.videoId;
      callback(null, trackObj);
    }
  });
};

function itunesLookup(search, country, limit, callback) {
  searchitunes({
    country: country,
    term: search,
    limit: limit,
  }, function (err, data) {
      if (err) {
        callback(err, []);
      } else {
        var songs = data.results.map(function (result) {
          var song = {
            title: result.trackName,
            artist: result.artistName,
            album: result.collectionName,
            discNumber: result.discNumber,
            trackNumber: result.trackNumber,
            genre: result.primaryGenreName,
            coverUrl: result.artworkUrl100.replace('100x100', '600x600'),
          };
          return song;
        });

        callback(null, songs);
      }
    }
  );
};

function uniqueTracks(tracks) {
  var unique = {};
  var distinct = [];
  for (var i in tracks) {
    if (typeof (unique[tracks[i].streamId]) === 'undefined') {
    //if (typeof (unique[tracks[i].youtubeId]) === 'undefined') {
      distinct.push(tracks[i]);
    }

    //unique[tracks[i].youtubeId] = 0;
    unique[tracks[i].streamId] = 0;
  }

  console.log(distinct);
  return distinct;
}

