import watch from "./watcher.js"
import Media from "./media.js"

document.addEventListener("DOMContentLoaded", async function () {
  const newMedia = new Media()
  // await newMedia.getFlowAudio()

  const initialState = {
    recording: false,
    UIState: {
      switch: {
        microphone: false,
      },
    },
  }

  const elements = {
    body: document.querySelector("body"),
    content: document.querySelector(".content"),
    player: document.querySelector(".player"),
    buttons: {
      start: document.querySelector("#record_start"),
      stop: document.querySelector("#record_stop"),
    },
    switch: {
      microphone: document.querySelector("#cb1"),
      microphoneTitle: document.querySelector(".switch_titleMicrophone"),
    },
    errors: {
      microphone: document.querySelector(".error_microphone"),
    },
  }

  const watchState = watch(elements, initialState, newMedia)

  const stopRecord = () => {
    newMedia.resetScreenStream()
    watchState.recording = false
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.id, "open")
    })
  }

  elements.buttons.start.addEventListener("click", async () => {
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

  elements.buttons.stop.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
    stopRecord()
    // newMedia.resetVoiceStream()
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

  elements.switch.microphone.addEventListener("change", (e) => {
    watchState.UIState.switch.microphone = e.target.checked
  })
})
