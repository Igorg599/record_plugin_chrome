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
      ;(async () => {
        const src = chrome.runtime.getURL("js/renderContent/iframe.js")
        const contentScript = await import(src)
        contentScript.renderIframe(iframePlugin)
      })()
      break
    }
    case "record": {
      iframePlugin.style.backgroundColor = "rgba(0,0,0,0.0)"
      iframePlugin.style.height = "100px"
      iframePlugin.style.width = "150px"
      iframePlugin.style.bottom = "0px"
      iframePlugin.style.top = ""
      break
    }
    case "onCamera": {
      ;(async () => {
        const src = chrome.runtime.getURL("js/renderContent/camera.js")
        const contentScript = await import(src)
        contentScript.renderCamera()
      })()
      break
    }
    case "offCamera": {
      document.querySelector("#container_camera").remove()
      break
    }
    default:
      throw new Error(`Error message - ${msg}!`)
  }
})
