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
      break
    }
    case "onCamera": {
      ;(async () => {
        const src1 = chrome.runtime.getURL("js/renderContent/camera.js")
        const contentScript = await import(src1)
        contentScript.renderCamera()
        const src2 = chrome.runtime.getURL("libs/jquery-3.6.0.min.js")
        await import(src2)
        const src3 = chrome.runtime.getURL("libs/jquery-ui.min.js")
        await import(src3)
        $(function () {
          $("#video_local").draggable({ containment: "#layout_camera" })
        })
      })()
      break
    }
    case "offCamera": {
      document.querySelector("#layout_camera").remove()
      break
    }
    default:
      throw new Error(`Error message - ${msg}!`)
  }
})
