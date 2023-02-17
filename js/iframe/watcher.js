import onChange from "../../libs/onChanhe.min.js"

const renderLangElements = (elements, i18nInstance, initialState) => {
  const {
    switch: { microphoneTitle, language },
    buttons: { run },
    downloadTitle,
    errors: { microphone },
  } = elements

  if (initialState?.language === "en") {
    language.checked = true
  }
  microphoneTitle.textContent = i18nInstance.t("microphone.on")
  downloadTitle.textContent = i18nInstance.t("download")
  run.textContent = i18nInstance.t("start")
  microphone.textContent = i18nInstance.t("errors.microphone")
}

const watch = (elements, initialState, newMedia, i18nInstance) => {
  renderLangElements(elements, i18nInstance, initialState)

  const {
    switch: { microphoneTitle, microphone },
    errors,
    control,
    player,
    buttons: { play },
    pulse,
  } = elements

  const changeViewUIframe = (state) => {
    if (state.UIState.wiewIframe === "player") {
      control.style.display = "none"
      player.style.display = "block"
    } else {
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
        errors.microphone.style.display = "block"
      }
    } else {
      newMedia.resetVoiceStream()
      microphoneTitle.textContent = i18nInstance.t("microphone.on")
    }
  }

  const changeRecord = () => {
    if (play.classList.contains("stop")) {
      play.classList.remove("stop")
      pulse.classList.remove("pulsating-circle")
    } else {
      play.classList.add("stop")
      pulse.classList.add("pulsating-circle")
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
      case "recording": {
        changeRecord()
        break
      }
      case "language": {
        i18nInstance
          .changeLanguage(value)
          .then(() => renderLangElements(elements, i18nInstance))
      }
      default:
        break
    }
  })

  return watchedObject
}

export default watch
