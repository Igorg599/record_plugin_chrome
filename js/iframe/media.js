export default class Media {
  static async getFlowVideo() {
    if (navigator.mediaDevices.getDisplayMedia) {
      try {
        // получаем поток
        const _screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        return _screenStream
      } catch (e) {
        console.log("getDisplayMedia", e)
        return null
      }
    } else {
      alert("getDisplayMedia not supported")
      return null
    }
  }

  static async getFlowAudio() {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        // получаем поток
        const _voiceStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        return _voiceStream
      } catch (e) {
        console.log("getUserMedia", e)
        return null
      }
    } else {
      alert("getUserMedia not supported")
      return null
    }
  }
}
