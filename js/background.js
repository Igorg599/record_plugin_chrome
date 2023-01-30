try {
  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      chrome.tabs.sendMessage(activeTab.id, "toggle")
    })
  })
} catch (err) {
  console.log(err)
}
