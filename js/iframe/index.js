import watch from "./watcher.js"
import Media from "./media.js"

document.addEventListener("DOMContentLoaded", async function () {
  const newMedia = new Media()

  const initialState = {
    recording: false,
    UIState: {
      wiewIframe: "control",
      switch: {
        microphone: false,
      },
    },
  }

  const elements = {
    body: document.querySelector("body"),
    control: document.querySelector(".control"),
    player: document.querySelector(".player"),
    buttons: {
      run: document.querySelector("#record_run"),
      play: document.querySelector("#play"),
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
    watchState.UIState.wiewIframe = "control"
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.id, "open")
    })
  }

  elements.buttons.run.addEventListener("click", async () => {
    await newMedia.getFlowVideo()
    if (newMedia.screenStream) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "record")
      })
      watchState.UIState.wiewIframe = "player"
      newMedia.screenStream.oninactive = () => {
        stopRecord()
      }
    }
  })

  elements.buttons.play.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
    watchState.recording = !watchState.recording
    if (!elements.buttons.play.classList.contains("stop")) {
      stopRecord()
    }
  })

  elements.body.addEventListener("click", () => {
    if (watchState.UIState.wiewIframe === "control") {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "close")
      })
    }
  })

  elements.control.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
  })

  elements.switch.microphone.addEventListener("change", (e) => {
    watchState.UIState.switch.microphone = e.target.checked
  })
})
