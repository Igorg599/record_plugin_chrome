document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("close").addEventListener("click", () => {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.id, "close")
    })
  })
})
