(function () {
  const cfg = window.SYNC_CONFIG;
  const videos = cfg.vimeoVideos;
  let index = 0;
  let playing = false;
  let spotify = null;

  const playBtn = document.getElementById("play-both");

  // --- Vimeo ---------------------------------------------------------------
  const vimeo = new Vimeo.Player("vimeo", {
    id: videos[index],
    responsive: false,
    playsinline: true,
  });
  vimeo.ready().then(() => vimeo.setVolume(1));

  // When one video ends, roll into the next. Spotify keeps going.
  vimeo.on("ended", () => {
    index = (index + 1) % videos.length;
    vimeo.loadVideo(videos[index]).then(() => {
      vimeo.setVolume(1);
      if (playing) return vimeo.play();
    });
  });

  // --- Spotify -------------------------------------------------------------
  function toSpotifyUri(s) {
    const m = s.match(/playlist[/:]([A-Za-z0-9]+)/);
    return m ? `spotify:playlist:${m[1]}` : s;
  }

  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    IFrameAPI.createController(
      document.getElementById("spotify"),
      { uri: toSpotifyUri(cfg.spotifyPlaylist), width: "100%", height: 352 },
      (controller) => { spotify = controller; }
    );
  };

  // --- One button for both -------------------------------------------------
  // The two players are otherwise independent: pausing, seeking or skipping
  // the video never touches Spotify, and vice versa.
  playBtn.addEventListener("click", () => {
    playing = !playing;
    if (playing) {
      vimeo.play().catch(() => {});
      // resume() starts the playlist if it hasn't started yet.
      if (spotify) spotify.resume();
    } else {
      vimeo.pause().catch(() => {});
      if (spotify) spotify.pause();
    }
    playBtn.textContent = playing ? "❚❚ Pause both" : "▶ Play both";
  });
})();
