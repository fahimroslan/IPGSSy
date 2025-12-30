let admitButtonText = 'Admit';
let viewAllButtonText = 'View all';
let admitAllButtonText = 'Admit all';

// init texts of buttons from options
chrome.storage.sync.get(['admitButtonText', 'viewAllButtonText', 'admitAllButtonText'], function(data) {
  document.getElementById('admin-button-text').value = data.admitButtonText ? data.admitButtonText : admitButtonText;
  document.getElementById('view-all-button-text').value = data.viewAllButtonText ? data.viewAllButtonText : viewAllButtonText;
  document.getElementById('admin-all-button-text').value = data.admitAllButtonText ? data.admitAllButtonText : admitAllButtonText;
});

function saveOptions() {
  var admitButtonText = document.getElementById('admin-button-text').value;
  var viewAllButtonText = document.getElementById('view-all-button-text').value;
  var admitAllButtonText = document.getElementById('admin-all-button-text').value;
  chrome.storage.sync.set({
    admitButtonText: admitButtonText,
    viewAllButtonText: viewAllButtonText,
    admitAllButtonText: admitAllButtonText,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

document.querySelectorAll('.option-button').forEach(
    button => button.addEventListener('change', saveOptions)
);
