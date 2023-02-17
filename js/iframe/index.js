import "../../libs/i18next.min.js"
import watch from "./watcher.js"
import Media from "./media.js"
import resources from "./locales/index.js"
import lStorage from "./utils/localStorage.js"

document.addEventListener("DOMContentLoaded", async function () {
  const newMedia = new Media()
  const defaultLanguage = lStorage.get("language_plugin") || "en"

  const i18nInstance = i18next.createInstance()
  await i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  })

  const initialState = {
    recording: false,
    language: defaultLanguage,
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
      language: document.querySelector("#language-toggle"),
    },
    errors: {
      microphone: document.querySelector(".error_microphone"),
    },
    video: document.querySelector(".recording"),
    output: document.querySelector(".output"),
    downloadTitle: document.querySelector(".download_title"),
    pulse: document.querySelector(".pulse"),
  }

  const watchState = watch(elements, initialState, newMedia, i18nInstance)

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
        if (newMedia.mediaRecorder) {
          newMedia.mediaRecorder.stop()
          newMedia.resetMediaRecorder()
        }
      }
    }
  })

  elements.buttons.play.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
    watchState.recording = !watchState.recording
    if (!elements.buttons.play.classList.contains("stop")) {
      stopRecord()
      if (newMedia.mediaRecorder) {
        newMedia.mediaRecorder.stop()
        newMedia.resetMediaRecorder()
      }
    } else {
      newMedia.getMediaRecorder(elements, newMedia)
      if (newMedia.mediaRecorder) {
        newMedia.mediaRecorder.start()
      }
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

  elements.switch.language.addEventListener("change", (e) => {
    if (e.target.checked) {
      watchState.language = "en"
      lStorage.set("language_plugin", "en")
    } else {
      watchState.language = "ru"
      lStorage.set("language_plugin", "ru")
    }
  })
})
