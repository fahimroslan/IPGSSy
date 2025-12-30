document.querySelector('.options').addEventListener('click', function () {
  chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});

function switchExtension(isOn) {
  chrome.storage.sync.set({
    isWorking: isOn
  }, function() {

  chrome.browserAction.setIcon({path: `images/auto_admit128${isOn ? '' : '_off'}.png`});
  setTimeout(function () { window.close(); }, 500)

  });
}

document.querySelector('.switch-on').addEventListener('click', function () {
  switchExtension(true);
});


document.querySelector('.switch-off').addEventListener('click', function () {
  switchExtension(false)
});