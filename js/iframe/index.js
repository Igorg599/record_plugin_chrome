import watch from "./wather.js"
import Media from "./media.js"

document.addEventListener("DOMContentLoaded", async function () {
  const initialState = {
    screenStream: null,
    voiceStream: null,
    recording: false,
    UIState: {},
  }

  const elements = {
    buttonStart: document.querySelector("#record_start"),
    buttonStop: document.querySelector("#record_stop"),
    body: document.querySelector("body"),
    container: document.querySelector(".container"),
  }

  const watchState = watch(elements, initialState)

  watchState.voiceStream = await Media.getFlowAudio()
  console.log(watchState.voiceStream)

  elements.buttonStart.addEventListener("click", async () => {
    watchState.screenStream = await Media.getFlowVideo()
  })

  elements.body.addEventListener("click", () => {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.id, "close")
    })
  })

  elements.container.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
  })
})
