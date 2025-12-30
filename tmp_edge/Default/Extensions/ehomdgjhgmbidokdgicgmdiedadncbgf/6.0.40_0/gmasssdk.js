//v 1.7 10/23/25

window.GMass = window.GMass || {};
window.GMass.sdk = {};
window.GMass.sdk.debug = false;
window.GMass.sdk.userEmailAddress = 'nobody@nobody.com';

window.GMass.weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
window.GMass.sdk.log = function (msg) {
    if (window.GMass.sdk.debug) {
        console.log(msg);
    }
}
window.GMass.sdk.ButterBar = {};
window.GMass.sdk.ButterBar.showMessage = function (options) {
    let self = this;
    document.body.querySelectorAll('.gmass-butterbar').forEach(b => {
        b.remove();
    });

    var template = `
		<div class="gmass-butterbar">
			<span class="gmass-butterbar-text"></span>
			<div class="gmasssdk__butterbar-buttons"></div>
			<div class="gmass-butterbar-close" role="button" tabindex="0">
				<div></div>
			</div>
		</div>
	`;

    var div = document.createElement('div');
    div.innerHTML = template;
    var el = div.firstElementChild;

    if (options.text)
        el.querySelector('.gmass-butterbar-text').textContent = options.text;
    else
        el.querySelector('.gmass-butterbar-text').innerHTML = options.html;


    let buttonsDiv = el.querySelector('.gmasssdk__butterbar-buttons');
    if (options.buttons) {
        options.buttons.forEach(b => {
            var buttonSpan = document.createElement('span');
            buttonSpan.className = 'T-I-atl';
            buttonSpan.setAttribute('style', 'user-select: none; margin-right:1rem;');
            buttonSpan.innerHTML = b.title;
            buttonSpan.setAttribute('role', 'button');
            buttonSpan.addEventListener('click', b.onClick);
            buttonsDiv.appendChild(buttonSpan);
        });
    } else {
        buttonsDiv.remove();
    }

    this.element = el;
    document.body.appendChild(el);

    el.querySelector('.gmass-butterbar-close').addEventListener('click', function () {
        el.remove();
    });

    if (options.time) {
        setTimeout(function () { el.remove(); }, options.time);
    }

    this.destroy = function () {
        if (self.element)
            self.element.remove();
    };

    return this;
};
window.GMass.sdk.User = {};
window.GMass.sdk.User.getEmailAddress = function () {

    if (document.head.getAttribute('data-ueag') != null) {
        return document.head.getAttribute('data-ueag');
    }
    else {
        if (window.GMass.sdk.userEmailAddress == 'nobody@nobody.com') {

            var emailFound = false;

            var str = document.title;
            const emailRegex = /\b[A-Za-z0-9._%+-]+(?:'[A-Za-z0-9._%+-]+)*@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const matches = str.match(emailRegex);

            if (!matches) {
                let anchorElement = document.querySelector('a[aria-label*="Google Account"]');
                let ariaLabel = anchorElement.getAttribute('aria-label');
                let emailMatch = ariaLabel.match(/\b[A-Za-z0-9._%+-]+(?:'[A-Za-z0-9._%+-]+)*@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);

                if (emailMatch) {
                    window.GMass.sdk.userEmailAddress = emailMatch[0];
                    emailFound = true;
                    console.log('email found backup way: ' + window.GMass.sdk.userEmailAddress);
                } else {
                    return null;
                }

            }
            else {
                window.GMass.sdk.userEmailAddress = matches[matches.length - 1];
                emailFound = true;
                console.log('email found primary way: ' + window.GMass.sdk.userEmailAddress);
            }

            if (emailFound) {

                return window.GMass.sdk.userEmailAddress;
            }
            else {
                return null;
            }
        }
        else {
            return window.GMass.sdk.userEmailAddress;
        }
    }
};
window.GMass.sdk.Utils = {};
window.GMass.sdk.Utils.triggerMouseEvent = function (node, eventType) {
	var clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent(eventType, true, true);
	node.dispatchEvent(clickEvent);
};
window.GMass.sdk.Utils.triggerFullClick = function (node) {
	window.GMass.sdk.Utils.triggerMouseEvent(node, 'mouseover');
	window.GMass.sdk.Utils.triggerMouseEvent(node, 'mousedown');
	window.GMass.sdk.Utils.triggerMouseEvent(node, 'mouseup');
	window.GMass.sdk.Utils.triggerMouseEvent(node, 'click');
}
window.GMass.sdk.DropdownView = function (button) {
    const self = this;

    this.button = button;
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'gmasssdk__menu');
    this.el.style.position = 'fixed';
    this.el.style.left = '0px';
    this.el.style.top = '0px';
    this.destroyed = false;
    this.listeners = [];

    function bodyClick(e) {
        if (window.GMass.snippetClick) {
            window.GMass.snippetClick = false;
            return;
        }

        if (!self.destroyed && e.target != self.button && !self.el.contains(e.target)) {
            if (!document.body.contains(e.target)) {
                return;
            }
            var overlay = document.querySelector('.gmass-overlay-box-wrap');
            if (overlay && overlay.contains(e.target))
                return;
            var modal = document.querySelector('.gmasssdk__modal_fullscreen');
            if (modal&& modal.contains(e.target))
                return;
            self.close();
        }
    }

    this.close = function () {
        clearInterval(self.repositionInterval);
        document.body.removeEventListener('click', bodyClick);
        self.dispatch('destroy');
        self.button.setAttribute('aria-pressed', 'false');
        self.el.remove();
        self.destroyed = true;

    };

    this.reposition = function () {
        const height = parseInt(self.el.clientHeight);
        if (height < 100) {
            setTimeout(self.reposition, 10);
            return;
        }

        const buttonRect = self.button.getBoundingClientRect();
        const width = parseInt(self.el.clientWidth);

        let left = parseInt(buttonRect.left);
        let top = parseInt(buttonRect.top - height - 10);
        if (left + width > window.innerWidth - 10) {
            left = window.innerWidth - width - 10;
        }
        if (left < 10) {
            left = 10;
        }

        left = parseInt(left);
        top = parseInt(top);
        if (Math.abs(left - parseInt(self.el.style.left)) > 2)
            self.el.style.left = left + 'px';
        if (Math.abs(top - parseInt(self.el.style.top)) > 2)
            self.el.style.top = top + 'px';

        self.el.classList.add('visible');
    };

    this.on = function (event, callback) {
        self.listeners.push({ event: event, callback: callback });
    };
    this.once = function (event, callback) {
        console.warn('DropdownView once ' + event + ' not implemented');
    };


    this.dispatch = function (eventType, event) {
        self.listeners.forEach(l => {
            if (l.event == eventType) {
                l.callback(event || {});
            }
        });
    };

    document.body.appendChild(this.el);
    window.addEventListener('resize', self.reposition);
    this.repositionInterval = setInterval(self.reposition, 500);
    this.reposition();
    setTimeout(function () {
        document.body.addEventListener('click', bodyClick);
    }, 500);
    return this;
}

window.GMass.sdk.Conversations = {};
window.GMass.sdk.Conversations.registerMessageViewHandler = function () {
    console.warn('registerMessageViewHandler not implemented');
}

window.GMass.ComposeView = function (element) {
    let self = this;
    this.element = element;
    this.destroyed = false;
    this.listeners = [];

    this.sendButton = element.querySelector(".gU.Up  > .J-J5-Ji .T-I-atl");
    this.mutationObserver = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];
            var removedNodes = mutation.removedNodes;
            var addedNodes = mutation.addedNodes;

            var toDiv;
            var removedFromTo;
            var form;
            var formChanged;

            if (isNewUI) {
                toDiv = self.element.querySelector('div[name="to"]');
                removedFromTo = toDiv != null && toDiv.contains(mutation.target);
                form = self.element.querySelector('form');
                formChanged = false;
            }
            if (!self.destroyed && !document.body.contains(self.element)) {
                self.dispatch('destroy');
                self.destroyed = true;
                self.close();
            }



            addedNodes.forEach(node => {

                if (isNewUI) {
                    if (toDiv != null && node.nodeType === 1 && node.hasAttribute('data-hovercard-id') && toDiv.contains(node)) {
                        var isRealChip = node.querySelector('.afK') != null;
                        if (isRealChip) {
                            self.dispatch('toContactAdded', { contact: self.stringToContact(node.getAttribute('data-hovercard-id')) });
                        }
                    }
                }
                if (node.tagName == 'INPUT' && node.getAttribute('name') == 'to' && node.getAttribute('type') == 'hidden') {
                    self.dispatch('toContactAdded', { contact: self.stringToContact(node.value) });
                }

                if (isNewUI) {
                    if (form != null && node.nodeType === 1 && form.contains(node))
                        formChanged = true;
                }


				var attachmentInput = node.querySelector ? node.querySelector('input[name="attach"]') : false;
				if (attachmentInput)
				{					
					var lnk = node.querySelector('a');
					if (lnk && lnk.querySelectorAll('div').length == 2)
					{
						var divs = lnk.querySelectorAll('div');
						var filename = divs[0].innerText;
						var filesize = divs[1].innerText;

						self.dispatch('attachmentAdded', {
							url: lnk.href,
							filename: filename,
							filesize: filesize,
							id: attachmentInput.value
						});
                    }
				}
				var googleDriveLink = node.querySelector ? node.querySelector('div.gmail_drive_chip a[aria-label]') : false;
				if (googleDriveLink) {
					var filename = googleDriveLink.getAttribute('aria-label');
					self.dispatch('attachmentAdded', {
						url: googleDriveLink.href,
						filename: filename,
						filesize: 25000000,
						id: 'href/' + filename,
						div: node.parentNode
					});
				}
				
            });

            removedNodes.forEach(node => {

                if (isNewUI) {
                    if (removedFromTo && node.nodeType === 1)
                        var hoverCard = node.querySelector('[data-hovercard-id]');

                    if (hoverCard != null) {
                        {
                            var isRealChip = hoverCard.querySelector('.afK') != null;
                            if (isRealChip) {
                                self.dispatch('toContactRemoved', { contact: self.stringToContact(hoverCard.getAttribute('data-hovercard-id')) });
                            }
                        }
                    }
                }

                if (node.classList && node.classList.contains('vR')) {
                    var formTo = node.querySelector('[name=to]');
                    if (formTo) {
                        self.dispatch('toContactRemoved', { contact: self.stringToContact(formTo.value) });
                    }
                }

                if (isNewUI) {
                    if (form != null && node.nodeType === 1 && form.contains(node))
                        formChanged = true;
                }
            });

            if (isNewUI) {
                window.GMass.sdk.log(Date() + "generally something changed");
            }
        }

        if (isNewUI) {
            if (formChanged) {
                self.dispatch('composeFormChanged');
            }

            if (addedNodes.length > 0 || removedNodes.length > 0) {
                self.dispatch('composeViewChanged');
            }
        }

    });

    this.mutationObserver.observe(self.element.parentNode, { subtree: true, childList: true });


    this.getElement = function () {
        return self.element;
    };

    this.stringToContact = function (str) {
        var address = str;
        var name = address;
        if (address.indexOf('<') > 0) {
            name = address.substring(0, address.indexOf('<') - 1);
            address = address.substring(address.indexOf('<') + 1);
            address = address.substring(0, address.length - 1);
        }
        return { emailAddress: address, name: name };
    };

    this.dispatch = function (eventType, event) {
        self.listeners.forEach(l => {
            if (l.event == eventType) {
                l.callback(event || {});
            }
        });
    };

    this.on = function (event, callback) {
        self.listeners.push({ event: event, callback: callback });
    };

    this.getUiVersion = function () {
        if (self.element.querySelector('textarea[name="to"]') != null)
            return 1;
        return 2;
    }

    var isNewUI = this.getUiVersion() == 2;


	this.getAttachments = function () {
		var arr = self.element.querySelectorAll('.GM [name="attach"]');
		var ret = [];
		arr.forEach(x => {
			var wrap = x.parentNode;
			var lnk = wrap.querySelector('a');
			var divs = wrap.querySelectorAll('a div');
			if (divs.length > 0) {
				var filename = divs[0].innerText;
				var filesize = divs[1].innerText;
				ret.push({
					url: lnk.href,
					filename: filename,
					filesize: filesize,
					id: x.getAttribute('id'),
					div: wrap
				});
			}
		});
		return ret;
	};

	this.clearAttachments = function () {
		var arr = self.getAttachments();
		arr.forEach(x => {
			self.removeAttachment(x.filename);
		});
	};

	this.removeAttachment = function (filename) {
		
		var arr = self.getAttachments();
		arr.forEach(x => {
			if (x.filename == filename) {
				if (x.div) {
					var deleteLink = x.div.querySelector('[role="button"]');

					if (deleteLink) {
						window.GMass.sdk.Utils.triggerFullClick(deleteLink);
					}
					else {
						setTimeout(function () {
							self.removeAttachment(filename);
						}, 500);
					}
					return;
				}
            }
		});
		var googleDriveLink = self.getContentDiv().querySelector(`div.gmail_drive_chip [aria-label="${filename}"]`);
		if (googleDriveLink) {
			googleDriveLink.parentNode.remove();
        }
	};


    this.getSubject = function () {
        let formSubject = self.element.querySelector('[name="subject"]');
        return formSubject.value;
    };

    this.getSubjectAltMethod = function () {
        let formSubject = self.element.querySelector('[name="subjectbox"]');
        return formSubject.value;
    };


    this.setSubject = function (newSubject) {
        let formSubject = self.element.querySelector('[name="subjectbox"]');
        formSubject.value = newSubject;

        let formSubject2 = self.element.querySelector('[name="subject"]');
        formSubject2.value = newSubject;

        self.saveDraft();
    };

    this.saveDraft = function () {
        let body = self.element.querySelector('div[contenteditable=true]');
        if (body != null) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent('keydown', false, true);
            body.dispatchEvent(evt);
        }
    }

    this.saveDraftAlternate = function () {
        let body = self.element.querySelector('div[contenteditable=true]');
        if (body != null) {
            body.dispatchEvent(new KeyboardEvent('keydown', { 'key': ' ' }));
        }
    }

    this.getToRecipients = () => self.getRecipients('to');
    this.getCcRecipients = () => self.getRecipients('cc');
    this.getBccRecipients = () => self.getRecipients('bcc');

    this.getRecipients = function (type) {
        var ret = [];
        var tos = self.element.querySelectorAll('[type=hidden][name=' + type + ']');
        tos.forEach(to => {
            ret.push(self.stringToContact(to.value));
        });

        if (isNewUI) {
            var tos = self.element.querySelectorAll('div[name="' + type + '"] [data-hovercard-id]');
            tos.forEach(to => {
                ret.push(self.stringToContact(to.getAttribute('data-hovercard-id')));
            });
        }

        return ret;
    };

    this.setToRecipients = (arr, objFlag = null) => this.setRecipients('to', arr, objFlag);
    this.setCcRecipients = (arr) => this.setRecipients('cc', arr);
    this.setBccRecipients = (arr) => this.setRecipients('bcc', arr);
    this.clearRecipients = () => {
        this.setRecipients('to', []);
        this.setRecipients('cc', []);
        this.setRecipients('bcc', []);
    };


    if (isNewUI) {
        self.element.addEventListener('change', function (e) {
            if (!e || !e.target)
                return;
            ['to', 'cc', 'bcc'].forEach(type => {
                var div = self.element.querySelector('div[name=' + type + ']');
                if (div != null && div.contains(e.target)) {
                    console.log("to/cc/bcc change detected");
                }
            });
        });
    }

    this.setRecipients = function (type, arr, objFlag = null) {
        let body = self.element.querySelector('div[contenteditable=true]');

        if (body == null) {
            body = self.element.querySelector('div[contenteditable=false]');
        }

        var to = self.element.querySelector('textarea[name=' + type + ']');

        var newStyle = false;
        if (isNewUI) {

            if (to == null) {
                if (type == 'cc') {
                    self.element.querySelector('[name="subjectbox"]').dispatchEvent(new KeyboardEvent('keydown', {
                        bubbles: true, cancelable: true, ctrlKey: true, shiftKey: true, keyCode: 67, which: 67
                    }));
                }
                else if (type == 'bcc') {
                    self.element.querySelector('[name="subjectbox"]').dispatchEvent(new KeyboardEvent('keydown', {
                        bubbles: true, cancelable: true, ctrlKey: true, shiftKey: true, keyCode: 66, which: 66
                    }));
                }

                to = self.element.querySelector('[name=' + type + '] input');
                newStyle = true;
            }

            if (to == null) {
                console.warn("Could not find recipient box " + type);
                return;
            }
        }
        to.value = '';

        var cardsDiv;
        var toDiv;

        if (!isNewUI) {
            let cardsDiv = to.parentNode;
            cardsDiv.querySelectorAll('.vR .vM').forEach(deleteLink => {
                deleteLink.click();
            });
        }
        else {
            to.parentNode.querySelectorAll('.vR .vM').forEach(deleteLink => {
                deleteLink.click();
            });
            let toDiv = self.element.querySelector('div[name=' + type + ']');
            if (toDiv) {
                toDiv.querySelectorAll('.afX').forEach(deleteLink => {
                    deleteLink.click();
                });
            }
        }

        if (arr.length == 0)
            return;
        if (type == 'cc') {
            self.element.querySelector("span.aB.gQ.pE").click();
        }
        else if (type == 'bcc') {
            self.element.querySelector("span.aB.gQ.pB").click();
        }


        if (isNewUI) {
            var dt = new DataTransfer;
            dt.setData("text/plain", arr.join(","));
            to.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt }));
            if (objFlag)
                objFlag.done = true;
            return;
        }
        let index = 0;
        function addAddress() {

            to = self.element.querySelector('textarea[name=' + type + ']');

            if (to.value.length == 0) {
                to.value = arr[index];
                index++;
            }
            to.dispatchEvent(new window.FocusEvent("blur"));
            body.focus();

            if (index < arr.length) {
                setTimeout(addAddress, 10);
            }
            else {
                if (objFlag)
                    objFlag.done = true;
            }
        }
        setTimeout(addAddress, type != 'to' || newStyle ? 250 : 10);

    };

    this.isInlineReplyForm = function () {
        return self.element.querySelector('table.IG') != null;
    };

    this.isReady = function () {
        var nh = self.element.closest('.nH[role]');

        if (isNewUI) {
            var to1 = self.element.querySelector('input[name="to"]');
            var to2 = self.element.querySelector('div[name="to"] input');

            return nh != null && (to1 != null || to2 != null);
        }
        else {
            return nh != null;
        }

    };


    this.formatDraftId = function (email_id) {
        if (!email_id || email_id.length == 0) {
            return null;
        }
        if (email_id.startsWith("#")) {
            email_id = email_id.substring(1);
        }
        if (email_id.indexOf(':') > 0) {
            email_id = email_id.substring(email_id.indexOf(':') + 1);
        }
        return email_id;
    };

    this.getCurrentDraftID = function () {
        return new Promise((resolve, reject) => {
            let formDraft = self.element.querySelector('[name="draft"]');

            var counter = 0;
            function get() {
                counter++;
                let email_id = formDraft != null ? self.formatDraftId(formDraft.value) : null;

                if (!email_id) {
                    setTimeout(get, 100);
                }
                else {
                    resolve(email_id);
                }
                if (counter > 20)
                    resolve(null);
            }

            if (!formDraft) {
                console.error('Could not find draft element');
                resolve(null);
            }
            else {
                get();
            }
        });
    };

    this.getDraftID = function () {
        let formDraft = self.element.querySelector('[name="draft"]');
        return new Promise((resolve, reject) => {
            function get() {

                let email_id = self.formatDraftId(formDraft.value);
                if (!email_id) {
                    setTimeout(get, 100);
                }
                else {
                    resolve(email_id);
                }
            }

            if (!formDraft) {
                console.error('Could not find draft element');
                reject();
            }
            else {
                get();
            }
        });
    };

    this.setBodyHTML = function (html) {
        let body = self.element.querySelector('div[contenteditable=true]');
        if (body == null) {
            body = self.element.querySelector('div[contenteditable=false]');
        }
        body.innerHTML = html;
        self.saveDraft();
    };

    this.addButton = function (options) {
        if (typeof (options.text) == 'undefined')
            options.text = '';

        var button = document.createElement("div");
        var buttonClasses = (options.classList || []);
        buttonClasses.push("gmass-sdk-button");

        button.setAttribute("class", buttonClasses.join(' '));
        button.setAttribute("role", 'button');
        button.setAttribute("aria-label", options.title);
        button.setAttribute("data-tooltip", options.title);
        if (typeof (options.style) != 'undefined')
            button.setAttribute("style", options.style);

        var html = options.html || 'Button';
        if (options.iconClass) {
            html = `<div
				class="${options.iconClass} inboxsdk__button_icon"
				style="height: 36px; font-size: 14px; border: none; padding: 5px 5px 4px; align-items: center; display: inline-flex; justify-content: center; position: relative; z-index: 0; border-radius: 4px 0px 0px 4px; box-sizing: border-box; letter-spacing: 0.15px; font-family: &quot;Google Sans&quot;, Roboto, RobotoDraft, Helvetica, Arial, sans-serif; background-image: none; background-color: rgb(196, 35, 41);">
					${options.text}&nbsp;
				</div>`;
        }

        button.innerHTML = html;
        button.addEventListener('click', function (e) {
            if (options.hasDropdown) {
                if (typeof (button.dropdown) == 'undefined' || button.dropdown.destroyed) {
                    button.dropdown = new window.GMass.sdk.DropdownView(button);
                    e.dropdown = button.dropdown;
                    button.setAttribute('aria-pressed', 'true');
                    options.onClick(e);
                }
                else {
                    button.setAttribute('aria-pressed', 'false');
                    button.dropdown.close();
                    delete button.dropdown;
                    return;
                }
            } else {
                options.onClick();
            }
        });
        var buttonDiv = self.element.querySelector(".gU.Up  > .J-J5-Ji");
        var dividers = buttonDiv.querySelectorAll('.J-J5-Ji');
        var lastDivider = dividers[dividers.length - 1];

        if (options.beforeSendButton) {
            buttonDiv.prepend(button);
        }
        else {
            lastDivider.parentNode.insertBefore(button, lastDivider.nextSibling);
        }

        return button;
    };

    this.show = function () {
        self.style.display = 'inline-block';
    }

    this.getSendButton = function () {
        return self.element.querySelector('.dC');
    }


    this.showSendButton = function () {
        var sb = self.getSendButton();
        if (sb != null) {
            sb.style.display = 'inline-flex';
        }
    }

    this.hideSendButton = function () {
        var sb = self.getSendButton();
        if (sb != null) {
            sb.style.display = 'none';
        }
    }

    this.getHTMLContent = function () {
        let body = self.element.querySelector('div[contenteditable=true]');
        if (body == null) {
            body = self.element.querySelector('div[contenteditable=false]');
        }
        return body.innerHTML;
    };

    this.setHTMLContent = function (html) {
        let body = self.element.querySelector('div[contenteditable=true]');
        if (body == null) {
            body = self.element.querySelector('div[contenteditable=false]');
        }
        body.innerHTML = html;
    };

    this.getContentDiv = function () {
        var contentDiv = self.element.querySelector('div[contenteditable=true]');
        if (contentDiv == null) {
            return self.element.querySelector('div[contenteditable=false]');
        }
        else {
            return contentDiv;
        }
		
	};

    this.close = function () {
        self.mutationObserver.disconnect();

        if (!self.destroyed) {

            if (self.element.querySelector('div[contenteditable=true]') != null) {
                self.element.querySelector('div[contenteditable=true]')
                    .dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27 }));
            }
            else {
                self.element.querySelector('div[contenteditable=false]')
                    .dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27 }));
            }
        }
    };

    this.getFromContact = function () {
        let from = self.element.querySelector('.GS .J-J5-Ji.J-JN-M-I-Jm');
        if (from) {
            return self.stringToContact(from.innerText);
        } else {
            return self.stringToContact(window.GMass.sdk.User.getEmailAddress());
        }

    };

    this.insertTextIntoBodyAtCursor = function (text) {
		self.insertIntoBodyAtCursor(text, false, true);
    };
    this.insertHTMLIntoBodyAtCursor = function (html) {
		self.insertIntoBodyAtCursor(html, true, true);
    };
	this.insertIntoBodyAtCursor = function (content, isHtml, deleteContents) {
        let body = self.element.querySelector('div[contenteditable=true]');
        if (body == null) {
            body = self.element.querySelector('div[contenteditable=false]');
        }
        body.focus();

        let sel = window.getSelection();

        if (sel.getRangeAt && sel.rangeCount) {
            let range = sel.getRangeAt(0);

			if (deleteContents)
            range.deleteContents();

            if (!isHtml) {
                range.insertNode(document.createTextNode(content));
            }
            else {
                let el = document.createElement("div");
                el.innerHTML = content;

                let frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
            }
        }

        self.saveDraft();
    };
	this.removeBodySelection = function()
	{
        let body = self.element.querySelector('div[contenteditable=true]');
        if (body == null) {
            body = self.element.querySelector('div[contenteditable=false]');
        }
		body.focus();
		window.getSelection().removeAllRanges();
    }
    this.sendButton.addEventListener('click', function (e) {

        let cancelled = false;
        self.listeners.forEach(l => {
            if (l.event == 'presending') {
                e.cancel = function () {
                    cancelled = true;
                };
                l.callback(e);
            }
        });

        if (cancelled) {
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    }, true);
	setTimeout(function () {
		self.fromAddressItems = element.querySelectorAll('.J-N.HX');
		self.fromAddressItems.forEach(link => {
			link.addEventListener('click', function (e) {
				self.listeners.forEach(l => {
					if (l.event == 'fromContactChanged') {
						l.callback(e);
					}
				});
			});
		});
	}, 500);

    return this;
}


window.GMass.sdk.Compose = {};
window.GMass.sdk.Compose.registerComposeViewHandler = function (callback) {
    document.body.querySelectorAll('div.M9').forEach(composeWindow => {
        let newComposeView = new window.GMass.ComposeView(composeWindow);
        if (newComposeView.isReady()) {
            callback(newComposeView);
        } else {
            window.GMass.sdk.log("Warning: existing form not yet ready");
            setTimeout(function () {
                callback(newComposeView);
            }, 1000);
        }
    });
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (addedNode) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    if (addedNode.classList && addedNode.classList.contains('An')) {
                        var composeWindow = addedNode.closest('div.M9');
                        if (composeWindow) {
                            let newComposeView = new window.GMass.ComposeView(composeWindow);
                            window.GMass.lastComposeView = newComposeView;

                            if (newComposeView.isReady()) {
                                setTimeout(function () {
                                    callback(newComposeView);
                                }, 0);
                            }
                            else {
                                window.GMass.sdk.log("Warning: existing form not yet ready");
                                setTimeout(function () {
                                    callback(newComposeView);
                                }, 1000);
                            }
                        }
                    }
                }
            });
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};

window.GMass.sdk.Compose.openNewComposeView = function () {

    window.GMass.lastComposeView = null;

    let composeEl = document.getElementsByClassName("T-I T-I-KE L3")[0];
    if (composeEl) {
        composeEl.click();
    }
    else {
        let composeEl = document.getElementsByClassName("Yh akV")[0];
        if (composeEl) {
            composeEl.click();
        }
    }

    return new Promise((resolve, reject) => {
        function get() {
            if (!window.GMass.lastComposeView) {
                setTimeout(get, 100);
            }
            else {
                resolve(window.GMass.lastComposeView);
            }
        }
        get();
    });
};
window.GMass.sdk.Widgets = {};
window.GMass.sdk.Widgets.showModalView = function (options) {

    var template = `
		<div class="gmasssdk__modal_fullscreen">
			<div class="Kj-JD gmasssdk__modal_container" tabindex="0" role="alertdialog">
			  <div class="Kj-JD-K7 Kj-JD-K7-GIHV4 gmasssdk__modal_toprow ">
				<span class="Kj-JD-K7-K0" role="heading">${(options.title ?? '')}</span>
				${options.hideCloseButton === true ? '' : '<span class="Kj-JD-K7-Jq gmasssdk__modal_close" tabindex="0" role="button"></span>'}
			  </div>
			  <div class="Kj-JD-Jz gmasssdk__modal_content"></div>
			  <div class="Kj-JD-Jl gmasssdk__modal_buttons"></div>
			</div>
		</div>
	`;
    let div = document.createElement('div');
    div.innerHTML = template;

    let contentDiv = div.querySelector('.gmasssdk__modal_content');
    let buttonDiv = div.querySelector('.gmasssdk__modal_buttons');
    let closeDiv = div.querySelector('.gmasssdk__modal_close');
    contentDiv.appendChild(options.el);
    if (closeDiv) {
        closeDiv.addEventListener('click', function () {
            div.remove();
        });
    }
    if (options.buttons && options.buttons.length) {
        options.buttons.forEach(button => {

            let b = document.createElement('button');
            b.setAttribute('role', 'button');
            b.setAttribute('tabindex', '0');
            if (button.type == 'PRIMARY_ACTION')
                b.className = 'J-at1-auR';
            b.innerHTML = button.text;
            b.addEventListener('click', button.onClick);
            if (button.color) {
                b.style.backgroundColor = button.color;
            }
            buttonDiv.appendChild(b);
        });
    } else {
        buttonDiv.style.display = 'none';
    }
    document.body.appendChild(div);
	window.GMass.sdk.Widgets.currentModalDiv = div;
    return {
        close: function () {
            div.remove();
        }
    };
};


window.GMass.sdk.Widgets.hideModalView = function()
{
	if (window.GMass.sdk.Widgets.currentModalDiv) {
		window.GMass.sdk.Widgets.currentModalDiv.remove();
		window.GMass.sdk.Widgets.currentModalDiv = null;
    }
}

