import onChange from "../../libs/onChanhe.min.js"

const renderLangElements = (elements, i18nInstance, initialState) => {
  const {
    switch: { microphoneTitle, language, cameraTitle },
    buttons: { run, play },
    downloadTitle,
    errors: { microphoneErr, cameraErr },
  } = elements

  if (initialState?.language === "en") {
    language.checked = true
  }
  microphoneTitle.textContent = i18nInstance.t("microphone.on")
  downloadTitle.textContent = i18nInstance.t("download")
  run.textContent = i18nInstance.t("start")
  microphoneErr.textContent = i18nInstance.t("errors.switch")
  cameraErr.textContent = i18nInstance.t("errors.switch")
  play.textContent = i18nInstance.t("buttons.start")
  cameraTitle.textContent = i18nInstance.t("camera.on")
}

const watch = (elements, initialState, newMedia, i18nInstance) => {
  renderLangElements(elements, i18nInstance, initialState)

  const {
    switch: { microphoneTitle, microphone, cameraTitle, cameraSwitch },
    errors,
    control,
    player,
    buttons: { play },
    pulse,
    gramophone,
    download,
    camera,
  } = elements

  const changeViewUIframe = (state) => {
    if (!state.emptyRecord) {
      download.style.display = "flex"
    }
    if (state.UIState.wiewIframe === "player") {
      gramophone.style.display = "none"
      control.style.display = "none"
      player.style.display = "block"
    } else {
      if (!state.emptyRecord) {
        gramophone.style.display = "block"
      }
      control.style.display = "block"
      player.style.display = "none"
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

  const changeCameraStream = async (value) => {
    if (cameraSwitch.checked !== value) {
      cameraSwitch.checked = value
    }
    if (value) {
      cameraTitle.textContent = i18nInstance.t("camera.off")
      if (newMedia.cameraStream) {
        camera.requestPictureInPicture()
      } else {
        await newMedia.getFlowCamera()
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
        }
      }
    } else {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
      }
      cameraTitle.textContent = i18nInstance.t("camera.on")
    }
  }

  const changeRecord = () => {
    if (play.classList.contains("is-clicked")) {
      play.classList.remove("is-clicked")
      pulse.classList.remove("pulsating-circle")
      play.textContent = i18nInstance.t("buttons.start")
    } else {
      play.classList.add("is-clicked")
      pulse.classList.add("pulsating-circle")
      play.textContent = i18nInstance.t("buttons.stop")
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
      case "UIState.switch.camera": {
        changeCameraStream(value)
        break
      }
      case "recording": {
        changeRecord()
        break
      }
      case "language": {
        i18nInstance
          .changeLanguage(value)
          .then(() => renderLangElements(elements, i18nInstance))
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
