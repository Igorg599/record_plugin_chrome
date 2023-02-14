export default class Media {
  constructor() {
    this.screenStream = null
    this.voiceStream = null
  }

  async getFlowVideo() {
    if (navigator.mediaDevices.getDisplayMedia) {
      try {
        // получаем поток
        const _screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        this.screenStream = _screenStream
      } catch (e) {
        console.log("getDisplayMedia", e)
      }
    } else {
      alert("getDisplayMedia not supported")
    }
  }

  async getFlowAudio() {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        // получаем поток
        const _voiceStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        this.voiceStream = _voiceStream
      } catch (e) {
        console.log("getUserMedia", e)
      }
    } else {
      alert("getUserMedia not supported")
    }
  }

  resetScreenStream() {
    if (this.screenStream?.getTracks) {
      this.screenStream.getTracks().forEach((track) => track.stop())
      this.screenStream = null
    }
  }

  resetVoiceStream() {
    if (this.voiceStream?.getTracks) {
      this.voiceStream.getTracks().forEach((track) => track.stop())
      this.voiceStream = null
    }
  }
}
