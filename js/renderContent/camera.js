export const renderCamera = async () => {
  const container = document.createElement("div")
  container.id = "container_camera"
  container.style.height = "100vh"
  container.style.width = "100vw"
  container.style.top = "0px"
  container.style.right = "0px"
  container.style.position = "absolute"
  container.style.zIndex = "90001"
  container.style.pointerEvents = "none"
  document.body.appendChild(container)
  const video = document.createElement("video")
  video.id = "video_local"
  video.style.position = "fixed"
  video.style.height = "200px"
  video.style.width = "200px"
  video.style.borderRadius = "50%"
  video.style.objectFit = "cover"
  video.style.bottom = "30px"
  video.style.left = "30px"
  video.style.pointerEvents = "auto"
  video.style.cursor = "move"
  container.append(video)
  if (navigator.mediaDevices.getUserMedia) {
    try {
      const _cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      video.srcObject = _cameraStream
      video.play()
    } catch (e) {
      chrome.runtime.sendMessage("cameraError")
    }
  } else {
    chrome.runtime.sendMessage("cameraError")
  }
}
