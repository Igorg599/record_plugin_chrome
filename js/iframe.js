import onChange from "../libs/onChanhe.min.js"

class Media {
  constructor() {
    this.screenStream
    this.voiceStream
    this.recording
  }

  async getFlowVideo() {
    if (navigator.mediaDevices.getDisplayMedia) {
      try {
        // получаем поток
        const _screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        // обновляем состояние
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
        // обновляем состояние
        this.voiceStream = _voiceStream
      } catch (e) {
        console.log("getUserMedia", e)
        this.voiceStream = "unavailable"
      }
    } else {
      alert("getUserMedia not supported")
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const newMedia = new Media()
  newMedia.getFlowAudio()
  document.querySelector("button").addEventListener("click", () => {
    newMedia.getFlowVideo()
  })

  document.querySelector("body").addEventListener("click", () => {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.id, "close")
    })
  })

  document.querySelector(".container").addEventListener("click", (e) => {
    e.stopImmediatePropagation()
  })
})
