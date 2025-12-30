document.addEventListener('DOMContentLoaded', function () {
  // Trigger background script to fetch data
  chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    console.log(response.status);

    if (response.status === "Data fetch complete") {
      // Fetch items and map from local storage after data fetch is complete
      chrome.storage.local.get(['items', 'map'], function (data) {
        const items = data.items || [];
        const map = data.map || {};
        if (items.length > 0) {
          displayFolders(items, map);
        } else {
          console.log("No items found in local storage.");
          // Optionally, display a message or placeholder here
        }
      });
    } else if (response.status === "Not authenticated.") {
      // Display a warning message to the user
      showAuthenticationWarning();
    } else {
      displayFolders([], {}); // Assuming you want to display folders even on error
      // Handle other statuses and potential errors
    }
  });

  document.getElementById('add-folder').addEventListener('click', function () {
    addFolder();
  });
});

function showAuthenticationWarning() {
  const folderManagement = document.getElementById('folder-management');
  folderManagement.innerHTML = `
    <div class="auth-warning">
      <p>You are not authenticated. Please log in to Ziteboard to access and manage your boards.</p>
      <p><a href="https://app.ziteboard.com?loginpanel=1" target="_blank">Log in to Ziteboard</a></p>
    </div>
  `;
}

let currentFolder = 'ZITEBOARD'; // State to track the current folder

function displayItems(items, map, folderName, container) {
  container.innerHTML = '';

  items.forEach(item => {
    if ((map[item.auth_bid] || 'ZITEBOARD') === folderName) {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `
        <h3 class="item-title">${item.title}</h3>
        <a href="https://app.ziteboard.com?code=${item.auth_bid}" target="_blank" class="item-link">Open Board</a>
        <p class="item-date">Created at: ${item.date} &nbsp;&nbsp;&nbsp;&nbsp; (Last updated: ${item.updatedAt.substr(0, 10)})</p>
        <label for="folder-select-${item.auth_bid}">Move to folder:</label>
        <select id="folder-select-${item.auth_bid}" class="folder-select"></select>
      `;
      container.appendChild(itemDiv);

      const folderSelect = itemDiv.querySelector('.folder-select');
      populateFolderSelect(folderSelect, item, map);

      folderSelect.addEventListener('change', () => {
        moveToFolder(item, folderSelect.value);
      });
    }
  });
}

function addFolder() {
  const addFolderButton = document.getElementById('add-folder');
  const existingInput = document.getElementById('new-folder-input');
  
  if (existingInput) {
    existingInput.style.display = 'block';
    return;
  }

  const folderDiv = document.createElement('div');
  folderDiv.id = 'new-folder-input';
  folderDiv.innerHTML = `
    <input type="text" placeholder="Folder name" />
    <button class="save-folder">Save Folder</button>
  `;
  addFolderButton.insertAdjacentElement('afterend', folderDiv);

  folderDiv.querySelector('.save-folder').addEventListener('click', function () {
    saveFolder(folderDiv.querySelector('input').value);
    folderDiv.style.display = 'none';
  });
}

function saveFolder(folderName) {
  chrome.storage.local.get('folders', function (data) {
    const folders = data.folders || [];
    if (!folders.includes(folderName)) {
      folders.push(folderName);
      chrome.storage.local.set({ folders: folders });
      chrome.storage.local.get(['items', 'map'], function (data) {
        const items = data.items || [];
        const map = data.map || {};
        displayFolders(items, map);
      });
    } else {
      alert('Folder already exists!');
    }
  });
}

function countItemsInFolders(items, map) {
  const counts = {};
  items.forEach(item => {
    const folder = map[item.auth_bid] || 'ZITEBOARD';
    if (!counts[folder]) {
      counts[folder] = 0;
    }
    counts[folder]++;
  });
  return counts;
}

function displayFolders(items, map) {
  const folderManagement = document.getElementById('folder-management');
  chrome.storage.local.get('folders', function (data) {
    const folders = data.folders || [];

    const counts = countItemsInFolders(items, map);

    folderManagement.innerHTML = '';

    // Display the "ZITEBOARD" folder first
    const ziteboardItemCount = counts['ZITEBOARD'] || 0;
    const ziteboardDiv = document.createElement('div');
    ziteboardDiv.className = `folder ${currentFolder === 'ZITEBOARD' ? 'current-folder' : ''}`;
    ziteboardDiv.id = `folder-ZITEBOARD`;
    ziteboardDiv.innerHTML = `
      <span>ZITEBOARD (${ziteboardItemCount})</span>
      ${ziteboardItemCount === 0 ? '<button class="delete-folder">Delete</button>' : ''}
    `;

    // Handle ZITEBOARD folder click
    ziteboardDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      openFolder('ZITEBOARD');
    });

    // Handle ZITEBOARD delete button click
    if (ziteboardItemCount === 0) {
      const deleteButton = ziteboardDiv.querySelector('.delete-folder');
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering folder click
        deleteFolder('ZITEBOARD');
      });
    }

    const ziteboardContent = document.createElement('div');
    ziteboardContent.className = 'folder-content';
    ziteboardContent.appendChild(ziteboardDiv);
    folderManagement.appendChild(ziteboardContent);

    if (currentFolder === 'ZITEBOARD') {
      const ziteboardItemList = document.createElement('div');
      ziteboardItemList.className = 'item-list';
      displayItems(items, map, 'ZITEBOARD', ziteboardItemList);
      folderManagement.appendChild(ziteboardItemList);
    }

    // Display user-defined folders
    folders.forEach(folder => {
      const itemCount = counts[folder] || 0;
      const folderDiv = document.createElement('div');
      folderDiv.className = `folder ${folder === currentFolder ? 'current-folder' : ''}`;
      folderDiv.id = `folder-${folder}`;
      folderDiv.innerHTML = `
        <span>${folder} (${itemCount})</span>
        ${itemCount === 0 ? '<button class="delete-folder">Delete</button>' : ''}
      `;

      // Handle user-defined folder click
      folderDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        openFolder(folder);
      });

      // Handle delete button click
      if (itemCount === 0) {
        const deleteButton = folderDiv.querySelector('.delete-folder');
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent triggering folder click
          deleteFolder(folder);
        });
      }

      const folderContent = document.createElement('div');
      folderContent.className = 'folder-content';
      folderContent.appendChild(folderDiv);
      folderManagement.appendChild(folderContent);

      if (folder === currentFolder) {
        const itemList = document.createElement('div');
        itemList.className = 'item-list';
        displayItems(items, map, folder, itemList);
        folderManagement.appendChild(itemList);
      }
    });
  });
}

function deleteFolder(folderName) {
  chrome.storage.local.get(['folders', 'map'], function (data) {
    let folders = data.folders || [];
    let map = data.map || {};

    folders = folders.filter(folder => folder !== folderName);

    // Remove folder from map
    for (let key in map) {
      if (map[key] === folderName) {
        map[key] = 'ZITEBOARD';
      }
    }

    chrome.storage.local.set({ folders: folders, map: map }, function () {
      chrome.storage.local.get(['items', 'map'], function (data) {
        const items = data.items || [];
        const map = data.map || {};
        displayFolders(items, map);
      });
    });
  });
}

function populateFolderSelect(selectElement, item, map) {
  chrome.storage.local.get('folders', function (data) {
    const folders = data.folders || [];
    selectElement.innerHTML = '<option value="ZITEBOARD">ZITEBOARD</option>';
    folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder;
      option.textContent = folder;
      if ((map[item.auth_bid] || 'ZITEBOARD') === folder) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
  });
}

function moveToFolder(item, folderName) {
  chrome.storage.local.get('map', function (data) {
    const map = data.map || {};
    const oldFolder = map[item.auth_bid] || 'ZITEBOARD';
    map[item.auth_bid] = folderName;
    chrome.storage.local.set({ map: map }, () => {
      chrome.storage.local.get(['items', 'map'], function (data) {
        const items = data.items || [];
        displayFolders(items, map);
      });
    });
  });
}

function openFolder(folderName) {
  if (currentFolder === folderName) {
    currentFolder = null; // Close the current folder
    chrome.storage.local.get(['items', 'map'], function (data) {
      const items = data.items || [];
      const map = data.map || {};
      displayFolders(items, map);
    });
  } else {
    currentFolder = folderName; // Update current folder
    chrome.storage.local.get(['items', 'map'], function (data) {
      const items = data.items || [];
      const map = data.map || {};
      displayFolders(items, map);
    });
  }
}
