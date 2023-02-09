chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "initialization") {
    addEventListener(evtFromPage, (e) => {
      chrome.runtime.sendMessage(e.detail)
      sendResponse(e.detail), { once: true }
    })
    dispatchEvent(new Event(evtToPage))
  }
  if (msg === "close") {
    iframe.style.width = "0px"
  }
  if (msg == "toggle") {
    toggle()
  }
})

var iframe = document.createElement("iframe")
iframe.style.background = "green"
iframe.style.borderRadius = "11px"
iframe.style.opacity = "0.7"
iframe.style.height = "100vh"
iframe.style.width = "0px"
iframe.style.position = "fixed"
iframe.style.top = "0px"
iframe.style.right = "0px"
iframe.style.zIndex = "9000000000000000000"
iframe.allow = "display-capture"
iframe.frameBorder = "none"
iframe.src = chrome.runtime.getURL("../html/iframe.html")

document.body.appendChild(iframe)

function toggle() {
  if (iframe.style.width == "0px") {
    iframe.style.width = "100vw"
  } else {
    iframe.style.width = "0px"
  }
}
