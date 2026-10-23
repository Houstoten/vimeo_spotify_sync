(function () {
  const cfg = window.SYNC_CONFIG;
  const videos = cfg.vimeoVideos;
  let index = 0;
  let muted = cfg.muteVideo;
  let playing = false;
  let spotify = null;
  let spotifyStarted = false;

  const playBtn = document.getElementById("play-both");
  const muteBtn = document.getElementById("mute");
  const nowEl = document.getElementById("now");

  // --- Vimeo ---------------------------------------------------------------
  const vimeo = new Vimeo.Player("vimeo", {
    id: videos[index],
    responsive: false,
    muted: muted,
    playsinline: true,
  });

  function showTitle() {
    vimeo.getVideoTitle().then((t) => {
      nowEl.textContent = `${index + 1}/${videos.length} · ${t}`;
    }).catch(() => {});
  }
  vimeo.ready().then(showTitle);

  function loadVideo(i) {
    index = (i + videos.length) % videos.length;
    return vimeo.loadVideo(videos[index]).then(() => {
      showTitle();
      vimeo.setMuted(muted);
      if (playing) return vimeo.play();
    });
  }

  // When one video ends, roll into the next. Spotify keeps going.
  vimeo.on("ended", () => loadVideo(index + 1));

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
  function render() {
    playBtn.textContent = playing ? "❚❚ Pause both" : "▶ Play both";
    muteBtn.textContent = muted ? "🔇 Video muted" : "🔊 Video sound";
  }

  playBtn.addEventListener("click", () => {
    playing = !playing;
    if (playing) {
      vimeo.play().catch(() => {});
      if (spotify) {
        // play() starts the playlist from the top, resume() picks up where it left off.
        spotifyStarted ? spotify.resume() : spotify.play();
        spotifyStarted = true;
      }
    } else {
      vimeo.pause().catch(() => {});
      if (spotify) spotify.pause();
    }
    render();
  });

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    vimeo.setMuted(muted);
    render();
  });

  document.getElementById("prev").addEventListener("click", () => loadVideo(index - 1));
  document.getElementById("next").addEventListener("click", () => loadVideo(index + 1));

  render();
})();
