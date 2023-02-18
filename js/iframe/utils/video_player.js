function initVideoPlayer() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll()

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer()
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.log("Browser not supported!")
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById("video")
  const player = new shaka.Player(video)
  // player.requestFullscreen()

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player

  // Listen for error events.
  player.addEventListener("error", onErrorEvent)

  // Try to load a manifest.
  // This is an asynchronous process.
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail)
}

function onError(error) {
  // Log the error.
  console.log("Error code", error.code, "object", error)
}

export default initVideoPlayer
