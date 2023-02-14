import watch from "./wather.js"
import Media from "./media.js"

document.addEventListener("DOMContentLoaded", async function () {
  const initialState = {
    screenStream: null,
    voiceStream: await Media.getFlowAudio(),
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

  elements.buttonStart.addEventListener("click", async () => {
    watchState.screenStream = await Media.getFlowVideo()
  })

  elements.body.addEventListener("click", () => {
    if (!watchState.recording) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "close")
      })
    }
  })

  elements.container.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
  })
})
