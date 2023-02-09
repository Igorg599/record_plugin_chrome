chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  const iframePlugin = document.querySelector("#record_plugin")
  switch (msg) {
    case "initialization": {
      addEventListener(evtFromPage, (e) => {
        chrome.runtime.sendMessage(e.detail)
        sendResponse(e.detail), { once: true }
      })
      dispatchEvent(new Event(evtToPage))
      break
    }
    case "close": {
      iframePlugin?.remove()
      break
    }
    case "open": {
      const iframe = document.createElement("iframe")
      iframe.id = "record_plugin"
      iframe.style.opacity = "0.1"
      iframe.style.height = "100vh"
      iframe.style.width = "100vw"
      iframe.style.position = "fixed"
      iframe.style.top = "0px"
      iframe.style.right = "0px"
      iframe.style.zIndex = "9000000000000000000"
      iframe.allow = "display-capture"
      iframe.frameBorder = "none"
      iframe.src = chrome.runtime.getURL("../html/iframe.html")
      document.body.appendChild(iframe)
      let timer = setInterval(() => {
        if (iframe.style.opacity === "0.6") {
          clearInterval(timer)
          return
        }
        iframe.style.opacity = `${+iframe.style.opacity + 0.02}`
      }, 25)
      break
    }
    default:
      throw new Error("Error message!")
  }
})
