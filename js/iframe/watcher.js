import onChange from "../../libs/onChanhe.min.js"

const watch = (elements, initialState, newMedia) => {
  const {
    switch: { microphoneTitle, microphone },
    errors,
    content,
    player,
    buttons: { play },
  } = elements

  const changeGeneralView = (state) => {
    if (!state.UIState.generalView) {
      content.style.display = "none"
      player.style.display = "block"
    } else {
      content.style.display = "block"
      player.style.display = "none"
    }
  }

  const changeVoiceStream = async (value) => {
    if (value) {
      await newMedia.getFlowAudio()
      if (newMedia.voiceStream) {
        microphoneTitle.textContent = "Выключить микрофон"
      } else {
        microphone.checked = false
        microphone.disabled = true
        errors.microphone.style.display = "block"
      }
    } else {
      newMedia.resetVoiceStream()
      microphoneTitle.textContent = "Включить микрофон"
    }
  }

  const changeRecord = () => {
    if (play.classList.contains("stop")) {
      play.classList.remove("stop")
    } else {
      play.classList.add("stop")
    }
  }

  const watchedObject = onChange(initialState, (path, value) => {
    switch (path) {
      case "UIState.generalView": {
        changeGeneralView(initialState)
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
      default:
        break
    }
  })

  return watchedObject
}

export default watch
