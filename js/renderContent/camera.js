export const renderCamera = async () => {
  const layout = document.createElement("div")
  layout.id = "layout_camera"
  layout.style.height = "100vh"
  layout.style.width = "100vw"
  layout.style.top = "0px"
  layout.style.right = "0px"
  layout.style.position = "absolute"
  layout.style.zIndex = "90001"
  layout.style.pointerEvents = "none"
  document.body.appendChild(layout)

  const container = document.createElement("div")
  container.id = "video_local"
  container.style.position = "fixed"
  container.style.height = "200px"
  container.style.width = "200px"
  container.style.bottom = "30px"
  container.style.left = "30px"
  container.style.pointerEvents = "auto"
  container.style.cursor = "move"
  layout.appendChild(container)

  const video = document.createElement("video")
  video.style.height = "100%"
  video.style.width = "100%"
  video.style.borderRadius = "50%"
  video.style.objectFit = "cover"
  video.style.position = "static"
  container.append(video)

  const changeSize = document.createElement("div")
  changeSize.style.display = "none"
  changeSize.style.width = "45px"
  changeSize.style.height = "30px"
  changeSize.style.left = "0px"
  changeSize.style.right = "0px"
  changeSize.style.backdropFilter = "blur(20px)"
  changeSize.style.position = "absolute"
  changeSize.style.bottom = "20px"
  changeSize.style.background = "rgba(0, 0, 0, 0.5)"
  changeSize.style.borderRadius = "30px"
  changeSize.style.margin = "auto"
  changeSize.style.justifyContent = "space-around"
  changeSize.style.alignItems = "center"
  container.append(changeSize)

  const smallSize = document.createElement("div")
  const largeSize = document.createElement("div")
  const closeCamera = document.createElement("div")

  smallSize.style.width = "9px"
  smallSize.style.height = "9px"
  smallSize.style.background = "#fff"
  smallSize.style.borderRadius = "9px"
  smallSize.style.cursor = "move"
  changeSize.append(smallSize)
  smallSize.addEventListener("click", () => {
    smallSize.style.background = "#fff"
    smallSize.style.border = "none"
    largeSize.style.background = "none"
    largeSize.style.border = "1px solid #fff"
    container.style.height = "200px"
    container.style.width = "200px"
    smallSize.style.cursor = "move"
    largeSize.style.cursor = "pointer"
  })

  largeSize.style.width = "14px"
  largeSize.style.height = "14px"
  largeSize.style.border = "1px solid #fff"
  largeSize.style.borderRadius = "14px"
  largeSize.style.cursor = "pointer"
  changeSize.append(largeSize)
  largeSize.addEventListener("click", () => {
    largeSize.style.background = "#fff"
    largeSize.style.border = "none"
    smallSize.style.background = "none"
    smallSize.style.border = "1px solid #fff"
    container.style.height = "300px"
    container.style.width = "300px"
    smallSize.style.cursor = "pointer"
    largeSize.style.cursor = "move"
  })

  container.addEventListener("mouseover", () => {
    changeSize.style.display = "flex"
    closeCamera.style.display = "block"
  })

  container.addEventListener("mouseout", () => {
    changeSize.style.display = "none"
    closeCamera.style.display = "none"
  })

  closeCamera.id = "close_camera"
  closeCamera.style.position = "absolute"
  closeCamera.style.textAlign = "center"
  closeCamera.style.width = "40px"
  closeCamera.style.height = "40px"
  closeCamera.style.boxShadow = "rgba(132, 164, 193, 0.15) 0px 4px 40px"
  closeCamera.style.left = "7px"
  closeCamera.style.top = "7px"
  closeCamera.style.visibility = "visible"
  closeCamera.style.background = "rgb(255, 255, 255)"
  closeCamera.style.border = "1px solid rgb(211, 218, 223)"
  closeCamera.style.borderRadius = "40px"
  closeCamera.style.cursor = "pointer"
  closeCamera.style.display = "none"
  container.append(closeCamera)
  closeCamera.addEventListener("mouseover", () => {
    closeCamera.style.backgroundColor = "#d3c0c0"
  })
  closeCamera.addEventListener("mouseout", () => {
    closeCamera.style.backgroundColor = "#fff"
  })

  const pseudoStyle = document.createElement("style")
  pseudoStyle.innerHTML = `#close_camera::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 30px;
    background-color: #3f3f3f;
    transform: rotate(45deg);
    top: 4.5px;
    left: 19px;
  }
  #close_camera::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 30px;
    background-color: #3f3f3f;
    transform: rotate(-45deg);
    top: 4.5px;
    left: 19px;
  }`
  document.head.appendChild(pseudoStyle)

  closeCamera.addEventListener("click", () => {
    document
      .querySelector("#record_plugin")
      .contentWindow.postMessage("close_camera", "*")
  })

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
