require('dotenv').config();
const electron = require('electron');
const path = require('path');
const url = require('url');
const songSearch = require('./search');
const cors = require('cors');
const cheerio = require('cheerio');
const http = require('http');
const https = require('https');
const youtubeStream = require('youtube-audio-stream');
const moment = require('moment');
const request = require('request');

const {app, BrowserWindow, ipcMain} = electron;
let win;

const DownloadManager = require('electron-download-manager');

DownloadManager.register({
    downloadFolder: app.getPath('downloads')
});

const youtubeAPIKey = 'AIzaSyBKMRMYEiUIePp2IKzBNgCaxVLgFhjMSlQ';
//const youtubeAPIKey = 'AIzaSyDTs_JROc87YNawi6dT281aF7nB1DNwtM8'

var fs = require('fs');
var host = '127.0.0.1';
var port = 1337;
var express = require('express');

var server = express();
server.use(cors());
server.use(express.static(__dirname + '/build')); //use static files in ROOT/public folder

const getDuration = (youtubeId, callback) => {
    console.log('Getting info for', youtubeId);
    https.get('https://hxc-tube.herokuapp.com/get/' + youtubeId, (resp) => {
        let body = '';

        resp.on('data', (chunk) => {
            body += chunk;
        });

        resp.on('end', () => {
            console.log(body);
            var result = JSON.parse(body);

            let duration = moment.duration(result.items[0].contentDetails.duration).asSeconds();

            const bitrate = 128;
            const ratio = 0.0234353085554361;
            const size = parseInt(((bitrate - bitrate * ratio) / 8) * 1024 * duration, 10);

            console.warn(`DURATION IS ${duration}`);
            // don't set content-length header for livestreams
            if (duration !== 0) {
                callback(size);
            } else {
                callback(null);
            }
        });
    });
};

server.get('/stream/:streamId', function(req, res) {
    let track = Buffer.from(req.params.streamId, 'base64').toString('ascii');
    console.log(`Querying for '${track}'...`);

    https.get('https://hxc-tube.herokuapp.com/search/' + track, (resp) => {
        let body = '';

        resp.on('data', (chunk) => {
            body += chunk;
        });

        resp.on('end', () => {
            var result = JSON.parse(body);

            if (result.items.length) {
                let videoId = result.items[0].id.videoId;

                getDuration(videoId, (size) => {
                    if (size) {
                        res.set({
                            'Content-Length': size,
                            'Content-Type': 'audio/mpeg',
                            'Accept-Ranges': 'bytes'
                        });
                    }

                    //youtubeStream(videoLink).pipe(res);
                    request(`https://hxctube.herokuapp.com/${videoId}`).pipe(res);
                });
            } else {
                res.json({error: 'not found'});
            }
        });
    });
});

server.get('/stream2/:streamId', function(req, res) {
    let track = Buffer.from(req.params.streamId, 'base64').toString('ascii');
    console.log(`Querying for '${track}'...`);

    https.get('https://www.youtube.com/results?search_query=' + track, (resp) => {
        let body = '';

        resp.on('data', (chunk) => {
            body += chunk;
        });

        resp.on('end', () => {
            let $ = cheerio.load(body);

            let videoLink = null;
            let videoTitle = null;
            let youtubeId = null;

            $('a[rel="spf-prefetch"]').each((i, elem) => {
                if (
                    $(elem)
                        .attr('href')
                        .toString()
                        .indexOf('ad') === -1
                ) {
                    videoLink = `https://www.youtube.com${$(elem).attr('href')}`;
                    videoTitle = $(elem).attr('title');

                    console.log(`Found match: '${videoTitle}'!`);
                    youtubeId = $(elem)
                        .attr('href')
                        .replace('/watch?v=', '');

                    getDuration(youtubeId, (size) => {
                        if (size) {
                            res.set({
                                'Content-Length': size,
                                'Content-Type': 'audio/mpeg',
                                'Accept-Ranges': 'bytes'
                            });
                        }

                        //youtubeStream(videoLink).pipe(res);
                        request(`https://hxc-tube.herokuapp.com/${youtubeId}`).pipe(res);
                    });

                    //res.redirect(`https://hxc-tube.herokuapp.com/${youtubeId}`);

                    return false;
                }
            });
        });
    });
});

server.get('/api/search/:search', function(req, res) {
    let {search} = req.params;
    // print the args out
    console.log('Searching for songs...');
    console.log('Search: ' + search);

    songSearch.search(
        {
            search: search,
            limit: 50, // defaults to 50
            itunesCountry: 'us', // defaults to 'us'
            youtubeAPIKey: youtubeAPIKey
        },
        function(err, songs) {
            console.log([err, songs]);

            if (!err) {
                res.json(songs);
            } else {
                var data = [
                    {
                        title: 'Sexy and I Know It',
                        artist: 'LMFAO',
                        album: 'Sorry for Party Rocking (Deluxe Version)',
                        discNumber: 1,
                        trackNumber: 4,
                        genre: 'Pop',
                        coverUrl:
                            'https://is3-ssl.mzstatic.com/image/thumb/Music118/v4/be/3d/c2/be3dc2a7-4641-6189-5c66-7b488a6853f6/source/600x600bb.jpg',
                        youtubeId: 'wyx6JDQCslE'
                    }
                ];
                res.json({error: err});
                //res.json(data)
            }
        }
    );
});

server.listen(port, host);

function createWindow() {
    const urlArg = process.argv[2];

    win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
            webSecurity: true,
            preload: path.resolve('./preload.js')
        }
    });

    win.webContents.openDevTools();
    win.loadURL(`http://localhost:1337/`);
    //win.loadURL(`file://${__dirname}/build/index.html`)

    win.setMenuBarVisibility(false);
    win.autoHideMenuBar = true;

    win.on('closed', () => {
        win = null;
    });

    ipcMain.on('download', (event, url) => {
        DownloadManager.download(
            {
                url: url
            },
            function(error, info) {
                if (error) {
                    console.log(error);
                    return;
                }

                console.log('DONE: ' + info.url);
            }
        );
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
