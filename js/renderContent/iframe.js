export const renderIframe = (iframePlugin) => {
  const iframe = iframePlugin ? iframePlugin : document.createElement("iframe")
  iframe.id = "record_plugin"

  if (!iframePlugin) {
    iframe.style.position = "fixed"
    iframe.style.zIndex = "90000"
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
}
