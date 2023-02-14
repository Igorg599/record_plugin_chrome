import watch from "./watcher.js"
import Media from "./media.js"

document.addEventListener("DOMContentLoaded", async function () {
  const newMedia = new Media()
  await newMedia.getFlowAudio()

  const initialState = {
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

  const stopRecord = () => {
    newMedia.resetScreenStream()
    watchState.recording = false
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.id, "open")
    })
  }

  elements.buttonStart.addEventListener("click", async () => {
    await newMedia.getFlowVideo()
    if (newMedia.screenStream) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "record")
      })
      watchState.recording = true
      newMedia.screenStream.oninactive = () => {
        stopRecord()
      }
    }
  })

  elements.buttonStop.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
    stopRecord()
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
