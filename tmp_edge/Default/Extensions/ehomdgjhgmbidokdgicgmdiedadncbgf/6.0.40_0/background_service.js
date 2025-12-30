chrome.runtime.onInstalled.addListener((details) => {
	
	if (details.reason == 'install')
	{
		chrome.tabs.create({
			url: 'https://www.gmass.co/gmass/extensioninstall',
			active: true
		});
	}
	else
	{
		chrome.tabs.create({
			url: 'https://mail.google.com',
			active: true
		});	
	}
});

if (chrome.runtime.setUninstallURL) {
    chrome.runtime.setUninstallURL('https://www.gmass.co/g/uninstall');
}