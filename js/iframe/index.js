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
    content: document.querySelector(".content"),
    player: document.querySelector(".player"),
  }

  const watchState = watch(elements, initialState)

  elements.buttonStart.addEventListener("click", async () => {
    watchState.screenStream = await Media.getFlowVideo()
    if (watchState.screenStream) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "record")
      })
      watchState.recording = true
    }
  })

  elements.body.addEventListener("click", () => {
    if (!watchState.recording) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "close")
      })
    }
  })

  elements.content.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
  })
})
