import onChange from "../../libs/onChanhe.min.js"

const renderLangElements = (elements, i18nInstance, state) => {
  const {
    switch: {
      microphoneTitle,
      language,
      cameraTitle,
      cameraLocalTitle,
      audioTitle,
    },
    buttons: { run, play },
    downloadTitle,
    errors: {
      microphoneErr,
      cameraErr,
      cameraLocalErr,
      cameraTab,
      audioWarning,
    },
    tabs: { screen, cameraOnly },
  } = elements

  if (state?.language === "en") {
    language.checked = true
  }
  downloadTitle.textContent = i18nInstance.t("download")
  run.textContent = i18nInstance.t("start")
  microphoneErr.textContent = i18nInstance.t("errors.switch")
  cameraErr.textContent = i18nInstance.t("errors.switch")
  cameraLocalErr.textContent = i18nInstance.t("errors.switch")
  audioWarning.textContent = i18nInstance.t("errors.audio")
  play.textContent = i18nInstance.t("buttons.start")
  cameraTitle.textContent = state.UIState.switch.camera
    ? i18nInstance.t("camera.off")
    : i18nInstance.t("camera.on")
  cameraLocalTitle.textContent = state.UIState.switch.cameraLocal
    ? i18nInstance.t("cameraLocal.off")
    : i18nInstance.t("cameraLocal.on")
  microphoneTitle.textContent = state.UIState.switch.microphone
    ? i18nInstance.t("microphone.off")
    : i18nInstance.t("microphone.on")
  audioTitle.textContent = state.UIState.switch.audio
    ? i18nInstance.t("audio.off")
    : i18nInstance.t("audio.on")
  screen.children[0].textContent = i18nInstance.t("tabs.screen")
  cameraOnly.children[0].textContent = i18nInstance.t("tabs.cameraOnly")
  cameraTab.textContent = i18nInstance.t("errors.camera")
}

const watch = (elements, initialState, newMedia, i18nInstance) => {
  renderLangElements(elements, i18nInstance, initialState)

  const {
    switch: {
      microphoneTitle,
      microphone,
      cameraTitle,
      cameraSwitch,
      cameraLocalSwitch,
      audioTitle,
    },
    errors,
    control,
    player,
    buttons: { play, run },
    pulse,
    gramophone,
    download,
    camera,
    bigCamera,
    switchContainer: { cameraContainer, cameraLocalContainer, audioContainer },
    close,
    closeRecord,
  } = elements

  const changeViewUIframe = (state) => {
    if (!state.emptyRecord) {
      download.style.display = "flex"
    }
    if (state.UIState.wiewIframe === "player") {
      gramophone.style.display = "none"
      control.style.display = "none"
      player.style.display = "block"
      close.style.display = "none"
      if (state.mode === "camera") {
        bigCamera.style.display = "block"
        bigCamera.srcObject = newMedia.cameraStream
        bigCamera.play()
      }
    } else {
      if (!state.emptyRecord) {
        gramophone.style.display = "block"
      }
      bigCamera.style.display = "none"
      control.style.display = "block"
      player.style.display = "none"
      close.style.display = "block"
    }
  }

  const changeVoiceStream = async (value) => {
    if (value) {
      await newMedia.getFlowAudio()
      if (newMedia.voiceStream) {
        microphoneTitle.textContent = i18nInstance.t("microphone.off")
      } else {
        microphone.checked = false
        microphone.disabled = true
        errors.microphoneErr.style.display = "block"
      }
    } else {
      newMedia.resetVoiceStream()
      microphoneTitle.textContent = i18nInstance.t("microphone.on")
    }
  }

  const changeAudioStream = (value) => {
    if (value) {
      audioTitle.textContent = i18nInstance.t("audio.off")
      errors.audioWarning.style.display = "block"
    } else {
      audioTitle.textContent = i18nInstance.t("audio.on")
      errors.audioWarning.style.display = "none"
    }
  }

  const changeCameraStream = async (value) => {
    if (cameraSwitch.checked !== value) {
      cameraSwitch.checked = value
    }
    if (value) {
      cameraTitle.textContent = i18nInstance.t("camera.off")
      if (newMedia.cameraStream) {
        camera.srcObject = newMedia.cameraStream
        camera.play()
        camera.onloadedmetadata = function () {
          camera.requestPictureInPicture()
        }
      } else {
        errors.cameraErr.style.display = "block"
        cameraSwitch.checked = false
        cameraSwitch.disabled = true
        cameraTitle.textContent = i18nInstance.t("camera.on")
      }
    } else {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
      }
      cameraTitle.textContent = i18nInstance.t("camera.on")
    }
  }

  const changeCameraLocalStream = (value) => {
    if (cameraLocalSwitch.checked !== value) {
      cameraLocalSwitch.checked = value
    }
    if (value) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "onCamera")
      })
      chrome.runtime.onMessage.addListener(function (request) {
        if (request === "cameraError") {
          cameraLocalSwitch.checked = false
          cameraLocalSwitch.disabled = true
          errors.cameraLocalErr.style.display = "block"
        }
      })
    } else {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.sendMessage(tab.id, "offCamera")
      })
    }
  }

  const changeRecord = () => {
    if (play.classList.contains("is-clicked")) {
      play.classList.remove("is-clicked")
      pulse.classList.remove("pulsating-circle")
      play.textContent = i18nInstance.t("buttons.start")
      closeRecord.style.display = "block"
    } else {
      play.classList.add("is-clicked")
      pulse.classList.add("pulsating-circle")
      play.textContent = i18nInstance.t("buttons.stop")
      closeRecord.style.display = "none"
    }
  }

  const changeMode = async (state, value) => {
    switch (value) {
      case "camera": {
        cameraContainer.style.display = "none"
        cameraLocalContainer.style.display = "none"
        audioContainer.style.display = "none"
        if (state.UIState.switch.camera) {
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture()
          }
        }
        if (!newMedia.cameraStream) {
          run.disabled = true
          run.style.cursor = "default"
          errors.cameraTab.style.display = "block"
        }
        if (state.UIState.switch.cameraLocal) {
          chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, "offCamera")
          })
          cameraLocalSwitch.checked = false
          state.UIState.switch.cameraLocal = false
        }
        break
      }
      case "screen": {
        cameraContainer.style.display = "block"
        cameraLocalContainer.style.display = "block"
        audioContainer.style.display = "block"
        if (run.disabled) {
          run.disabled = false
          run.style.cursor = "pointer"
          errors.cameraTab.style.display = "none"
        }
      }
      default:
        break
    }
  }

  const watchedObject = onChange(initialState, (path, value) => {
    switch (path) {
      case "UIState.wiewIframe": {
        changeViewUIframe(initialState)
        break
      }
      case "UIState.switch.microphone": {
        changeVoiceStream(value)
        break
      }
      case "UIState.switch.audio": {
        changeAudioStream(value)
        break
      }
      case "UIState.switch.camera": {
        changeCameraStream(value)
        break
      }
      case "UIState.switch.cameraLocal": {
        changeCameraLocalStream(value)
        break
      }
      case "recording": {
        changeRecord()
        break
      }
      case "mode": {
        changeMode(initialState, value)
        break
      }
      case "language": {
        i18nInstance
          .changeLanguage(value)
          .then(() => renderLangElements(elements, i18nInstance, initialState))
        break
      }
      case "fullscreen": {
        if (value) gramophone.style.transform = "none"
        else gramophone.style.transform = "translate(-48vh, -30vh)"
        break
      }
      default:
        break
    }
  })

  return watchedObject
}

export default watch
