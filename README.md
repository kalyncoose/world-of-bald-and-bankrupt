# World of Bald and Bankrupt
![Banner](src/assets/banner-thin.jpg)

An interactive world map displaying the adventures of Benjamin from Bald and Bankrupt.

#### Technologies
- [Node.js](https://nodejs.org/en/)
- [Vue.js](https://vuejs.org/)
- [OpenLayers](https://openlayers.org/)
- [Mapbox](https://www.mapbox.com/)

## How to Contribute
Do you know the exact location of a video? Contribute by updating any of the map markers in the code using the steps below.

### Fork the Repository
If you don't already have a GitHub account, [start here](https://github.com/signup).

If you already have a GitHub account, fork the repository.

### Search the Items
All videos are stored in the [items.json](src/assets/items.json) file.

Use `CTRL+F` in the file using the title of the YouTube video to find it.

For example, I found the item for the video of Karabash here:
```json
{
    "snippet": {
      "publishedAt": "2019-09-08T07:51:23Z",
      "title": "KARABASH...Russia's Toxic Town",
      "description": "LATEST MERCH: https://teespring.com/en-GB/stores/bald-and-bankrupt\n🇷🇺 Not long ago the town of Karabash was declared Russia's most toxic town due got the heavy pollutants that a mining plant was pumping into the air over the region. \n\nAnd so with my friend Roman from the popular YouTube channel NFKRZ we decided to visit the town and see for ourselves just how life was progressing there. \n\nJoin us on the road to Karabash...",
      "position": 53,
      "resourceId": {
        "kind": "youtube#video",
        "videoId": "wa35Vx_07fQ"
      }
    },
    "visible": false,
    "geometry": {
      "type": "Point",
      "coordinates": [
        0,  // latitude
        0   // longitude
      ]
    }
  }
```

### Find the Coordinates
Go to [Google Maps](https://www.google.com/maps), search for the location of the video and right-click a spot and then click the latitude/longitude coordinates to copy them.

![Example](src/assets/coordinates.PNG)

### Update the Coordinates
Update the `geometry` object, in the `coordinates` array from `0,0` to the new coordinates, like so:
```json
"geometry": {
  "type": "Point",
  "coordinates": [
    55.46974447765765,  // latitude
    60.218681676726014  // longitude
  ]
}
```

### Commit and Push the Changes
1. Add the changes using `git add .`
1. Commit the changes using `git commit -m "example comment"`
1. Push the changes using `git push`

### Create a Pull Request
Create a [pull request](https://github.com/kalyncoose/world-of-bald/pulls) from your fork to my repository.

Make sure to describe in the pull request which items you have changed and why.