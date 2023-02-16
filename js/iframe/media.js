export default class Media {
  constructor() {
    this.screenStream = null
    this.voiceStream = null
    this.mediaRecorder = null
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

  getMediaRecorder(elements) {
    const { output, download, video } = elements
    let data = []
    video.srcObject = this.screenStream
    let combine
    if (this.voiceStream) {
      combine = new MediaStream([
        ...this.screenStream.getTracks(),
        ...this.voiceStream.getTracks(),
      ])
    } else {
      combine = new MediaStream([...this.screenStream.getTracks()])
    }
    this.mediaRecorder = new MediaRecorder(combine)

    this.mediaRecorder.ondataavailable = (e) => {
      data.push(e.data)
    }

    this.mediaRecorder.onstop = () => {
      let blobData = new Blob(data, { type: "video/mp4" })
      // Convert the blob data to a url
      let url = URL.createObjectURL(blobData)
      // Assign the url to the output video tag and anchor
      output.src = url
      download.href = url
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
