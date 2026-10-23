# Watch & Listen

A one-page site: a Vimeo video on top, your Spotify playlist underneath, and a single **Play both** button that starts them together.

After that the two players are independent: pausing, seeking or skipping the video leaves Spotify playing. The video plays with full sound. When a video ends, the next one in the list loads.

## Make it yours

Edit `config.js`:

- `vimeoVideos`: Vimeo IDs, the number at the end of a `vimeo.com/...` link.
- `spotifyPlaylist`: your playlist share link (`https://open.spotify.com/playlist/...`).

## Run it

It's plain static files. Serve the folder over HTTP (embeds don't work from `file://`):

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Any static host (GitHub Pages, Netlify) works too.

Spotify plays full tracks only when the visitor is logged in to Spotify in that browser; otherwise it plays 30-second previews.
