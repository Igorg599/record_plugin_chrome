export default class Media {
  constructor() {
    this.screenStream = null
    this.voiceStream = null
    this.cameraStream = null
    this.mediaRecorder = null
  }

  async getFlowVideo() {
    if (navigator.mediaDevices.getDisplayMedia) {
      try {
        // получаем поток
        const _screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 60 },
          },
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

  async getFlowCamera() {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        // получаем поток
        const _cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 576, ideal: 720, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
          },
        })
        this.cameraStream = _cameraStream
      } catch (e) {
        console.log("getUserMedia", e)
      }
    } else {
      alert("getUserMedia not supported")
    }
  }

  getMediaRecorder(elements, state, i18nInstance) {
    const {
      output,
      downloadTitle,
      video,
      buttons: { play },
      pulse,
    } = elements
    let data = []
    video.srcObject = this.screenStream
    let combine
    if (this.voiceStream) {
      if (state.mode === "screen") {
        combine = new MediaStream([
          ...this.screenStream.getTracks(),
          ...this.voiceStream.getTracks(),
        ])
      } else {
        combine = new MediaStream([
          ...this.cameraStream.getTracks(),
          ...this.voiceStream.getTracks(),
        ])
      }
    } else {
      if (state.mode === "screen") {
        combine = new MediaStream([...this.screenStream.getTracks()])
      } else {
        combine = new MediaStream([...this.cameraStream.getTracks()])
      }
    }
    this.mediaRecorder = new MediaRecorder(combine)

    this.mediaRecorder.ondataavailable = (e) => {
      data.push(e.data)
    }

    this.mediaRecorder.onstop = () => {
      if (data.length) {
        state.emptyRecord = false
      }
      let blobData = new Blob(data, { type: "video/mp4" })
      // Convert the blob data to a url
      let url = URL.createObjectURL(blobData)
      // Assign the url to the output video tag and anchor
      output.src = url
      downloadTitle.href = url
      play.classList.remove("is-clicked")
      play.textContent = i18nInstance.t("buttons.start")
      pulse.classList.remove("pulsating-circle")
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

  resetMediaRecorder() {
    if (this.mediaRecorder) {
      this.mediaRecorder = null
    }
  }
}
