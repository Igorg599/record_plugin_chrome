import "../../libs/i18next.min.js"
import "../../libs/plyr-player.min.js"
import watch from "./watcher.js"
import Media from "./media.js"
import resources from "./locales/index.js"
import lStorage from "./utils/localStorage.js"

document.addEventListener("DOMContentLoaded", async function () {
  const player = new Plyr("#video", {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "volume",
      "captions",
      "settings",
      "fullscreen",
    ],
  })
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
    fullscreen: false,
    emptyRecord: true,
    mode: "screen",
    UIState: {
      wiewIframe: "control",
      switch: {
        microphone: false,
        camera: false,
        cameraLocal: false,
        audio: false,
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
    tabs: {
      screen: document.querySelector(".radio_screen"),
      cameraOnly: document.querySelector(".radio_camera"),
    },
    switch: {
      microphone: document.querySelector("#cb1"),
      microphoneTitle: document.querySelector(".switch_titleMicrophone"),
      cameraSwitch: document.querySelector("#cb2"),
      cameraTitle: document.querySelector(".switch_titleCamera"),
      cameraLocalSwitch: document.querySelector("#cb3"),
      cameraLocalTitle: document.querySelector(".switch_titleCameraLocal"),
      audio: document.querySelector("#cb4"),
      audioTitle: document.querySelector(".switch_titleAudio"),
      language: document.querySelector("#language-toggle"),
    },
    switchContainer: {
      cameraContainer: document.querySelector(".switch_container_camera"),
      cameraLocalContainer: document.querySelector(
        ".switch_container_cameraLocal"
      ),
      audioContainer: document.querySelector(".switch_container_audio"),
    },
    errors: {
      microphoneErr: document.querySelector(".err_microphone"),
      cameraErr: document.querySelector(".err_camera"),
      cameraLocalErr: document.querySelector(".err_cameraLocal"),
      cameraTab: document.querySelector(".err_camera_tab"),
    },
    video: document.querySelector(".recording"),
    camera: document.querySelector(".recording_camera"),
    output: document.querySelector(".output"),
    downloadTitle: document.querySelector(".download_title"),
    download: document.querySelector(".download"),
    pulse: document.querySelector(".pulse"),
    gramophone: document.querySelector(".gramophone"),
    bigCamera: document.querySelector("#only_camera"),
  }

  const watchState = watch(elements, initialState, newMedia, i18nInstance)

  const stopRecord = () => {
    setTimeout(() => {
      newMedia.resetScreenStream()
      watchState.UIState.wiewIframe = "control"
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "open")
      })
    })
  }

  const changeFullScreen = (value) => {
    watchState.fullscreen = value
  }

  elements.buttons.run.addEventListener("click", async () => {
    switch (watchState.mode) {
      case "screen": {
        await newMedia.getFlowVideo()
        if (newMedia.screenStream) {
          chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, "record_screen")
          })
          watchState.UIState.wiewIframe = "player"
          newMedia.screenStream.oninactive = () => {
            if (newMedia.mediaRecorder) {
              newMedia.mediaRecorder.stop()
              newMedia.resetMediaRecorder()
            }
            stopRecord()
          }
        }
        break
      }
      case "camera": {
        watchState.UIState.wiewIframe = "player"
        break
      }
      default:
        break
    }
  })

  elements.buttons.play.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
    watchState.recording = !watchState.recording
    if (!elements.buttons.play.classList.contains("is-clicked")) {
      if (newMedia.mediaRecorder) {
        newMedia.mediaRecorder.stop()
        newMedia.resetMediaRecorder()
      }
      stopRecord()
    } else {
      newMedia.getMediaRecorder(elements, watchState, i18nInstance)
      if (newMedia.mediaRecorder) {
        newMedia.mediaRecorder.start()
      }
    }
  })

  elements.body.addEventListener("click", () => {
    if (watchState.UIState.wiewIframe === "control") {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "offCamera")
      })
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "close")
      })
    }
  })

  elements.control.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
  })

  elements.gramophone.addEventListener("click", (e) => {
    e.stopImmediatePropagation()
  })

  elements.switch.microphone.addEventListener("change", (e) => {
    watchState.UIState.switch.microphone = e.target.checked
  })

  elements.switch.audio.addEventListener("change", (e) => {
    watchState.UIState.switch.audio = e.target.checked
  })

  elements.switch.cameraSwitch.addEventListener("change", (e) => {
    watchState.UIState.switch.camera = e.target.checked
  })

  elements.switch.cameraLocalSwitch.addEventListener("change", (e) => {
    watchState.UIState.switch.cameraLocal = e.target.checked
  })

  elements.camera.addEventListener("leavepictureinpicture", () => {
    watchState.UIState.switch.camera = false
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

  elements.tabs.screen.addEventListener("click", () => {
    watchState.mode = "screen"
  })

  elements.tabs.cameraOnly.addEventListener("click", () => {
    watchState.mode = "camera"
  })

  player.on("enterfullscreen", () => {
    changeFullScreen(true)
  })

  player.on("exitfullscreen", () => {
    changeFullScreen(false)
  })

  window.addEventListener("message", function (event) {
    if (event.source === parent) {
      if (event.data === "close_camera") {
        watchState.UIState.switch.cameraLocal = false
      }
    }
  })
})
