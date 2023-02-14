import onChange from "../../libs/onChanhe.min.js"

const watch = (elements, initialState) => {
  const { buttonStart, buttonStop, body, container } = elements

  const watchedObject = onChange(initialState, (path) => {
    switch (path) {
      case "qqq":
        break
      default:
        break
    }
  })

  return watchedObject
}

export default watch
