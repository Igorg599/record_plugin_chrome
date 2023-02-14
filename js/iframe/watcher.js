import onChange from "../../libs/onChanhe.min.js"

const watch = (elements, initialState) => {
  const { buttonStart, buttonStop, body, content, player } = elements

  const changeRecord = (state) => {
    if (state.recording) {
      content.style.display = "none"
      player.style.display = "block"
    } else {
      content.style.display = "block"
      player.style.display = "none"
    }
  }

  const watchedObject = onChange(initialState, (path) => {
    switch (path) {
      case "recording":
        changeRecord(initialState)
        break
      // case "screenStream":
      //   console.log(watchedObject.screenStream)
      //   break
      default:
        break
    }
  })

  return watchedObject
}

export default watch
