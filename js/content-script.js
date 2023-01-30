chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "close") {
    iframe.style.width = "0px"
  }
  if (msg == "toggle") {
    toggle()
  }
})

var iframe = document.createElement("iframe")
iframe.id = "recording_plugin"
iframe.style.background = "green"
iframe.style.borderRadius = "11px"
iframe.style.opacity = "0.7"
iframe.style.height = "110px"
iframe.style.width = "250px"
iframe.style.position = "fixed"
iframe.style.top = "200px"
iframe.style.right = "50px"
iframe.style.zIndex = "9000000000000000000"
iframe.frameBorder = "none"
iframe.innerHTML = ""
iframe.src = chrome.runtime.getURL("html/popup.html")

document.body.appendChild(iframe)

function toggle() {
  if (iframe.style.width == "0px") {
    iframe.style.width = "250px"
  } else {
    iframe.style.width = "0px"
  }
}
