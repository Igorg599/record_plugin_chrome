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
      const iframe = iframePlugin
        ? iframePlugin
        : document.createElement("iframe")
      iframe.id = "record_plugin"

      if (!iframePlugin) {
        iframe.style.position = "fixed"
        iframe.style.zIndex = "9000000000000000000"
        iframe.allow = "microphone; camera; display-capture"
        iframe.frameBorder = "none"
        iframe.src = chrome.runtime.getURL("../html/iframe.html")
        document.body.appendChild(iframe)
      }

      iframe.style.backgroundColor = "rgba(0,0,0,0.1)"
      iframe.style.height = "100vh"
      iframe.style.width = "100vw"
      iframe.style.top = "0px"
      iframe.style.right = "0px"
      let opacity = 0.1
      let timer = setInterval(() => {
        if (opacity >= 0.6) {
          clearInterval(timer)
          return
        }
        opacity += 0.02
        iframe.style.backgroundColor = `rgba(0,0,0,${opacity})`
      }, 25)
      break
    }
    case "record": {
      iframePlugin.style.backgroundColor = "rgba(0,0,0,0.0)"
      iframePlugin.style.height = "60px"
      iframePlugin.style.width = "120px"
      iframePlugin.style.bottom = "0px"
      iframePlugin.style.top = ""
      iframePlugin.style.paddingRight = "15px"
      break
    }
    default:
      throw new Error(`Error message - ${msg}!`)
  }
})
