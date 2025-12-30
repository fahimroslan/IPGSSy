function GmassGetEmailAddress() {
	var opener = typeof (window) !== "undefined" ? window.opener : null;
	var globals = typeof GLOBALS !== "undefined" ? GLOBALS : (opener && opener.GLOBALS || []);

	if (!globals || !globals.length) {
		if (window.GMass?.sdk?.userEmailAddress && window.GMass.sdk.userEmailAddress != 'nobody@nobody.com') {
			console.log('no longer searching for GLOBALS, user email has been set using another way');
			return;
		}

		setTimeout(function () {
			console.log('cant access GLOBALS yet');
			GmassGetEmailAddress();
		}, 50);
		return;
	}

	document.head.setAttribute('data-ueag', globals[10]);
}

GmassGetEmailAddress();