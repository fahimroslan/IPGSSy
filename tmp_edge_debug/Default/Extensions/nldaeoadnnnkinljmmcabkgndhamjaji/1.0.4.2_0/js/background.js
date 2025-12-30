chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

// Function to fetch data and store it in local storage
function fetchData(callback) {
  fetch('https://api.ziteboard.com/board/myboards?chrome_ext=42', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (typeof data === 'object' && data !== null && typeof data.m === 'string' && data.m === 'forbidden') {
      callback({ status: "Not authenticated." })
      return
    }
    console.log(data)
    console.log('Number of boards:', data.m.boardArr.length);
    console.log('First board item:', data.m.boardArr[0]);
    chrome.storage.local.set({ items: data.m.boardArr }, () => {
      console.log('Items saved to local storage');
      callback({ status: "Data fetch complete" })
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    if (callback) callback({ status: "Error fetching data" });
  });
}

// Listener for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
    fetchData((response) => {
      sendResponse(response); // Send response only after data is fetched and saved
    });
    // Return true to indicate you will send a response asynchronously
    return true;
  }
});
