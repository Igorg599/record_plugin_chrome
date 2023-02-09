document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, "open")
      window.close()
    })
  }, 1500)
})
