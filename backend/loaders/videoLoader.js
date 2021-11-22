const fetch = require("node-fetch");



function getVideo() {
    const playlistId = "UUN1hnUccO4FD5WfM7ithXaw";
    const path = BASE_PATH + "/playlistItems?part=snippet&playlistId=" + playlistId + "&maxResults=50&key=" + YOUTUBE_API_KEY;
    console.log(path);
    fetch(path)
        .then(response => response.json())
        .then(json => json.items.forEach(item => console.log(item.snippet)))
        .catch(err => console.log(err));
}

function getRating() {
    const playlistId = "UUN1hnUccO4FD5WfM7ithXaw";
    const path = BASE_PATH + "/videos?key="+YOUTUBE_API_KEY+"&id=fQb_JaH2GQw&part=statistics";
    console.log(path);
    fetch(path)
        .then(response => response.json())
        .then(json => console.log(json.items[0].statistics))
        .catch(err => console.log(err));
}


function getDuration() {
    const playlistId = "UUN1hnUccO4FD5WfM7ithXaw";
    const path = BASE_PATH + "/videos?key="+YOUTUBE_API_KEY+"&id=fQb_JaH2GQw&part=contentDetails";
    console.log(path);
    fetch(path)
        .then(response => response.json())
        .then(json => console.log(json.items[0].contentDetails.duration))
        .catch(err => console.log(err));
}

function load() {
    
}

function writeCSVLine(snippet, rating) {
    const line = `${snippet.resourceId.videoId},${snippet.channelId},${snippet.title},"${snippet.description}",${snippet.publishedAt}`
    fs.writeFile("../datasets/videos.json", line, err => console.error(err))
}

const rating = {
    "kind": "youtube#videoListResponse",
    "etag": "G5-mVJ5Knt2je2O_smbYPhgqwEE",
    "items": [
        {
            "kind": "youtube#video",
            "etag": "MHlK8tqWEC78CmcnvzyRD_hK4Gk",
            "id": "fQb_JaH2GQw",
            "statistics": {
                "viewCount": "3358890",
                "likeCount": "35924",
                "dislikeCount": "902",
                "favoriteCount": "0",
                "commentCount": "995"
            }
        }
    ],
    "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 1
    }
}

const duration = {
    "kind": "youtube#videoListResponse",
    "etag": "t-hVC7-1yUcGuWbc9D4s3ivhPuA",
    "items": [
        {
            "kind": "youtube#video",
            "etag": "bv3g_k62GvMnNdkhNiyi4nSJ8XY",
            "id": "3eSfCeTV2qI",
            "contentDetails": {
                "duration": "PT2M49S",
                "dimension": "2d",
                "definition": "hd",
                "caption": "false",
                "licensedContent": true,
                "contentRating": {},
                "projection": "rectangular"
            }
        }
    ],
    "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 1
    }
}

const snippet = {
    publishedAt: '2017-10-16T22:14:26Z',
    channelId: 'UCN1hnUccO4FD5WfM7ithXaw',
    title: 'Maroon 5, Julia Michaels - Help Me Out ft. Julia Michaels (Lyric Video)',
    description: '"RED PILL BLUES” is out now.\n' +
        'http://smarturl.it/RedPillBlues \n' +
        '\n' +
        'For more, visit: \n' +
        'https://www.facebook.com/maroon5 \n' +
        'https://twitter.com/maroon5 \n' +
        'https://www.instagram.com/maroon5 \n' +
        '\n' +
        'Sign up for updates: http://smarturl.it/Maroon5.News/n' +
        '\n' +
        'Music video by Maroon 5, Julia Michaels performing Help Me Out. (C) 2017 Interscope Records\n' +
        '\n' +
        'http://vevo.ly/tgNbbC',
    thumbnails: {
        default: {
            url: 'https://i.ytimg.com/vi/JA2JdSP7wyg/default.jpg',
            width: 120,
            height: 90
        },
        medium: {
            url: 'https://i.ytimg.com/vi/JA2JdSP7wyg/mqdefault.jpg',
            width: 320,
            height: 180
        },
        high: {
            url: 'https://i.ytimg.com/vi/JA2JdSP7wyg/hqdefault.jpg',
            width: 480,
            height: 360
        },
        standard: {
            url: 'https://i.ytimg.com/vi/JA2JdSP7wyg/sddefault.jpg',
            width: 640,
            height: 480
        },
        maxres: {
            url: 'https://i.ytimg.com/vi/JA2JdSP7wyg/maxresdefault.jpg',
            width: 1280,
            height: 720
        }
    },
    channelTitle: 'Maroon5VEVO',
    playlistId: 'UUN1hnUccO4FD5WfM7ithXaw',
    position: 49,
    resourceId: { kind: 'youtube#video', videoId: 'JA2JdSP7wyg' },
    videoOwnerChannelTitle: 'Maroon5VEVO',
    videoOwnerChannelId: 'UCN1hnUccO4FD5WfM7ithXaw'
}


getDuration();