window.GMass.tour = {};

function startGmassTour() {
    window.GMass.tour.active = true;

    var sdk = window.GMass.sdk;
    window.GMass.tour.userEmail = sdk.User.getEmailAddress();



	var baseUrl = window.GMass.main.BaseURLCDN;

	var template = `
	<div id="gmass-target" ><div></div><div></div><div></div><div></div></div>
	<div id="gmass-walkthrough-steps">

	
		<div class="fireworks" style="display:none">
			<div class="firework"></div>
			<div class="firework"></div>
			<div class="firework"></div>
		</div>
		<img src="${baseUrl}walkthrough/tourguide.png" class="tourguide">
		<div class="tourguide-words">
			Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
			<br><br>
			totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
			<br><br>
			<a href=#>gotcha</a>
		</div>
		<div id="gmass-walkthrough-controlbar">
			<div>
				<a href="#" class="previous-step" title="Go back a step">&larr;</a>
			</div>
			<div>
				<!--
					<a href="#" title="Minimize tour"</a>&#x1F5D5;</a>
				-->
				<a href="#" class="close-walkthrough" title="Close tour">&#x2716;</a>
			</div>
		</div>
		<h1>
			<div>
				<img src="${baseUrl}walkthrough/logo.png">
			</div>
			<span>Turn Gmail into an email marketing powerhouse</span>
		</h1>
		<ul>
			<li>
				<img src="${baseUrl}walkthrough/accept-off.svg">
				<span>Connect GMass + Gmail</span>
			</li>
			<li>
				<img src="${baseUrl}walkthrough/accept-off.svg">
				<span>Connect a Google Sheet</span>
			</li>
			<li>
				<img src="${baseUrl}walkthrough/accept-off.svg">
				<span>Add mail merge tags</span>
			</li>
			<li>
				<img src="${baseUrl}walkthrough/accept-off.svg">
				<span>Check the settings &amp; send!</span>
			</li>

		</ul>
	</div>
	`;
	
	
	var steps = [

		{ 
			"name": "ask-click-google-sheets",
			"align": "right",
			"completedBullets": 1,
			"text": `
					<p>Let's <strong>create a test campaign</strong>!</p>
					<p>Click the Google Sheets icon we've added next to the Gmail search bar.</p>
					<p><img src="${baseUrl}walkthrough/ob-sheetsbutton.png" width="200"></p>
					<p>Yeah... Google makes us get a few more permissions. <em>I know, I know.</em></p>
					<p>This is the last time!</p>
				`,
				"target": "#gmassimport",
		},
		{
			"name": "sheets-auth-shown",
			"align": "right",
			"completedBullets": 1,
			"text": `
					<p>Click Sign Up with Google one more time to connect GMass to your Google Sheets.</p>
					<p>We're almost done!</p>
				`,
		},
		{ 
			"align": "right",
			"name": "sheets-granted",
			"text": `
				<p>Phew. Enough permissions!</p>
				<p>NOW click that Sheets icon.</p>
				<p>(Yeah, there are a few other new icons up there too, don't worry about those yet!)</p>
			`,
			"target": "#gmassimport",
		},
		{ 
			"align": "right",
			name: "sheets-shown",
			"text": `
					<p>Choose the <strong>GMass Sample Sheet</strong> from the dropdown menu (you might have to scroll to the end).</p>
					<p>Then click the <strong>CONNECT TO SPREADSHEET</strong> button.</p>
					<p><a href="#" class="hide-in-the-way">Hide this box if it's in the way</a></p>
				`,
			"target": "#test-target2",
		},
		{ 
			name: "sheet-selected",
			"text": `
					<p>GMass has turned all the contacts in the Sheet into one long @gmass.co address.</p>
					<p><img src="${baseUrl}walkthrough/ob-alias.png" width="200"></p>
					<p>It keeps the compose window clean and moving fast!</p>
					<p><a href="#" class="walkthrough-next">Ah so <em>that's</em> what that is. Let's move on.</p>
				`,
			"align": "left",
			"completedBullets": 2,
			"target": "#test-target3",
		},
		{ 
			"name": "ask-to-personalize",
			"align": "left",
			"text": `
					<p>We'll use <strong>mail merge</strong> to add each contact's first name.</p>
					<p>Type a left curly brace { after Hi. That shows every column name from the connected Google Sheet.</p>
					<p><img src="${baseUrl}walkthrough/ob-mailmerge.png" width="200"></p>
					<p>Choose <strong>FirstName</strong> from the list.</p>
					<p><a href="#" class="walkthrough-next">Done!</p>
				`,
		},
		{
			"name": "check-settings",
			"align": "left",
			"text": `
					<p>Looks good!</p>
					<p>Let's quickly check the <strong>campaign settings</strong>.</p>
					<p>You can set up auto follow-ups, schedule, run A/B tests, send test emails, and more from the settings.</p>
					<p>Click the down arrow next to the GMass button to explore.</p>
					<p><img src="${baseUrl}walkthrough/ob-settingsarrow.png" width="200"></p>
					<p><a href="#" class="walkthrough-next">All set, let's send this thing!</p>
				`,
			"completedBullets": 3,
		},
		{ 
			"name": "ask-to-send",
			"align": "left",	
			"text": `
					<p>Send the campaign by <strong>clicking the red <span style="color:#c42529;">GMass</strong> button</strong>.</p>
					<p><img src="${baseUrl}walkthrough/ob-gmassbutton.png" width="200"></p>
					<p>DON'T use Gmail's blue send button! Your mail merges won't work (nor any of the other GMass features).</p>
					<p id="walkthrough-sending" style="color:#B43531"></p>
				`,
		},
		{ 
			"name": "email-sent",
			"completedBullets": 4,
			"align": "right",
			"text": `
					<p>YOU DID IT! You just sent your <strong>first mail merge campaign</strong> with GMass.</p>
					<p>Check your <a href="https://mail.google.com/mail/u/` + getGmailUserNumber() + `/#sent">Sent folder</a> to see each of the 10 emails you just sent.</p>
					<p><a href="#" class="walkthrough-next">Let's finish up!</p>
				`,
			"fireworks": true
		},
		{
			"name": "thank-you",
			"align": "right",
			"text": `
					<p>Thanks for taking the tour of the basics!</p>
					<p>There is a lot more to learn about like <a target="_blog" href="https://www.gmass.co/features/auto-follow-up-gmail">email sequences</a>, <a target="_blog" href="https://www.gmass.co/blog/triggered-emails/">triggers</a>, <a target="_blog" href="https://www.gmass.co/blog/mass-email-with-personalized-attachments/">attachments</a>, and <a target="_blog" href="https://www.gmass.co/blog/recurring-automated-email-campaigns-gmail-sheets/">automation</a>.</p>
					<p>Remember: You can send up to 50 emails a day during your trial.</p>
					<p><a href="https://www.gmass.co/pricing?email=` + encodeURIComponent(window.GMass.tour.userEmail) + `&utm_source=web&utm_medium=extension&utm_campaign=tour&utm_content=subscribe" target="_blank">Subscribe to a paid plan</a> now for unlimited* daily emails and more email marketing super powers!</p>
					<p style="font-size:80%;"><br />* Gmail has daily limits. We can break them.</p>
				
				`,
			"fireworks": false
		},
	];

	// ensure all steps are named so we can go to any by name
	steps.forEach((x, i) => {
		if (!x.name)
			x.name = 'step-' + i;
	});

	function getGmailUserNumber(){
		var fullUrl = window.location.href;
		var match = fullUrl.match(/\/u\/(\d+)\//);

		if (match) {
			var userId = match[1];
			return userId;
		} else {
			return 0;
		}
	}

	function moveTargetToElement(target, targetElement) {

	  const targetRect = targetElement.getBoundingClientRect();
	  const targetCenterX = targetRect.left + targetRect.width / 2;
	  const targetCenterY = targetRect.top + targetRect.height / 2;
	  const movingElementRect = target.getBoundingClientRect();
	  const movingElementWidth = movingElementRect.width;
	  const movingElementHeight = movingElementRect.height;

	  // Calculate the top-left corner coordinates to center the moving element over the target element
	  const left = targetCenterX - movingElementWidth / 2;
	  const top = targetCenterY - movingElementHeight / 2;

	  target.style.position = "absolute";
	  target.style.left = left + "px";
	  target.style.top = top + "px";
	}


	var stepNumber = -1;
	var d = document.createElement('div');
	d.innerHTML =template
	document.body.appendChild(d);

	var wrap = document.getElementById('gmass-walkthrough-steps');
	var target = document.getElementById('gmass-target');
	var words = wrap.querySelector('.tourguide-words');
	var fireworks = wrap.querySelector('.fireworks');

	wrap.querySelector('.previous-step').onclick = function (e) {
		e.preventDefault();
		previousStep();
	};

	wrap.querySelector('.close-walkthrough').onclick = function(e) {
		e.preventDefault();

		var buttons = [];

		buttons.push({
			html: 'Yes',
			result: 'yes'
		});

		buttons.push({
			html: "No"
		});

		GMass.confirm({
			title: 'Close Guided Tour?',
			message: 'Are you sure you want to close the tour?',
			buttons: buttons,
			callback: function (result) {
				if (result == 'yes') {
					stepNumber = 999;
					nextStep();
				}
			}
		});



	
	};

	// move the tour based on events coming from gmass.js
	document.addEventListener("gmass-auth-shown", function (e) {
		if (e.detail.message.indexOf('Sheets') > 0) {
			nextStep('sheets-auth-shown');
		}
	});

	//these are all events that are dispatched in certain places in gmass.js
	document.addEventListener("gmass-sheets-granted", function (e) {
		nextStep('sheets-granted');
	});
	document.addEventListener("gmass-sheets-modal-shown", function(e) {
		nextStep('sheets-shown');
	});
	document.addEventListener("gmass-sheet-selected", function (e) {
		nextStep('sheet-selected');
	});
	document.addEventListener("gmass-sent", function (e) {
		nextStep('email-sent');
	});

	

	var previousStepNumbers = [];
	function previousStep() {
		if (previousStepNumbers.length) {
			var tmp = previousStepNumbers.pop();
			nextStep(steps[tmp].name);
		}
	}
	
	function nextStep(stepName)
	{
		// if we completed the tour, ignore any additional calls here
		// or if the user declined the tour, don't do anything. gmass.js will still dispatch the events, which will call nextStep, but now it will just return
		if (window.GMassTourCompleted)
			return;

		previousStepNumbers.push(stepNumber);

		// find the next step to show
		var step;
		if (stepName) {
			// find the named step and goto it
			steps.forEach((x,i) => {
				if (x.name == stepName) {
					stepNumber = i;
				}
			})
		}
		else {
			// goto the next step
			stepNumber++;
		}

		//sets step to the right step based on the step number
		step = steps[stepNumber];
		console.log('Showing step ' + stepNumber + ' / ' + stepName);

		if (step) {
			trackTourStep(window.GMass.tour.userEmail, step.name);
		}
		

		// toggle previous step button
		if (stepNumber > 1)
			wrap.querySelector('.previous-step').style.display = 'inline-block';
		else
			wrap.querySelector('.previous-step').style.display = 'none';

		// clear existing settings
		wrap.style.display = 'block';
		wrap.classList.add('tour-active');	
		words.style.display = 'block';
		target.style.display='none';
		fireworks.style.display = 'none';

		if (!step)
		{
			wrap.classList.remove('tour-active');	
			window.GMassTourCompleted = true;
			window.GMass.tour.active = false;
			return;
		}

		//resets the position of the speech bubble so that it can be applied again based on a property of the step
		wrap.classList.remove('right');	
		wrap.classList.remove('left');	

		//here the step's specific alignment is applied
		if (step.align)
			wrap.classList.add(step.align);	

		//text of the div (speech bubble) is set
		words.innerHTML = step.text;

		var hideLink = words.querySelector('.hide-in-the-way');
		if (hideLink) {
			hideLink.onclick = function (e) {
				e.preventDefault();
				words.style.display = 'none';
			}
		}

		var sendingElement = document.getElementById('walkthrough-sending');
		if (sendingElement != null) {
			sendingElement.innerHTML = '';
		}

		//if the text in the speech bubble has a link that advanced the tour, then the click event on it is set here. not all the steps have text that has this, because in most cases, user doesn't need to click to advance the tour
		var nextLink = 	words.querySelector('.walkthrough-next');
		if (nextLink) {
			nextLink.onclick = function(e) {
				e.preventDefault();
				nextStep();
			}
		}

		//if there's a red blinking target for the step, then this moves it to the right position.
		if (step.target) {
			var el = document.querySelector(step.target);
			if (el) {
				target.style.display='block';
				moveTargetToElement(target, el);
			}
		}

		//i think this changes all the gray checkmarks to green checkmarks
		if (step.completedBullets) {
			wrap.querySelectorAll('li>img').forEach((img, i) => {
				if (i+1 <= step.completedBullets) {
					img.src = `${baseUrl}walkthrough/accept.svg`;
				}
			});
		}

		//just makes fireworks appear on a particular step of the tour
		if (step.fireworks)
			fireworks.style.display = 'block';
	}	


	//called only once, this starts the first step of the tour
	nextStep();

}


 

//starts oauth signup
function startGmassWalkthrough() {
    var sdk = window.GMass.sdk;
    window.GMass.tour.userEmail = sdk.User.getEmailAddress();


    var baseUrl = window.GMass.main.BaseURLCDN;
	var xmlhttpUser = new XMLHttpRequest();
	//passing in gmasskey here just to get information back as to whether it's right or not. if not right, and user did not click button (meaning fresh gmail reload), then we will ask him to re auth to fix it
	xmlhttpUser.open("GET", window.GMass.main.BaseURL + "gmass/getuserstatus?emailaddress=" + sdk.User.getEmailAddress() + "&buttonClicked=" + false + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())));
	xmlhttpUser.send();

	//create authentication div and launch if user not authenticated
	xmlhttpUser.onreadystatechange = function () {
		if (xmlhttpUser.readyState == 4) {
			UserResult = JSON.parse(xmlhttpUser.responseText);
			EverSent = UserResult.everSent;

			//this condition: !buttonClicked && UserResult.IsKeyValid==false
			//is so that when gmail is reloaded (!buttonClicked version of CheckAuth) if we find that key not valid and popup under threshold, we want user to re auth
			//don't want to do it for all checkauth, like when clicking spreadsheet button or clicking manual followup button, because hose have their own checks for valid key, so don't want two popups asking user to re auth
			//but actually, other than on loading gmail only button presses that trigger checkauth are main gmass button, build list button, maybe one other place
			if ((!UserResult.hasToken || !UserResult.isAuthorized || (!false && UserResult.IsKeyValid == false)) && ((parseInt(localStorage.getItem("GMassPopup")) < 2) || false)) {

				//only launch this popup twice, don't want to annoy user
				localStorage.setItem("GMassPopup", parseInt(localStorage.getItem("GMassPopup")) + 1);
				var popuptype;
				if ((UserResult.hasToken && UserResult.isAuthorized) && UserResult.IsKeyValid == false) {
					popuptype = 2;
				}
				else {
					popuptype = 1;
				}

				// start with connect account flow
				
				
				var div = document.createElement('div');
				div.style.paddingLeft = '30px';
				div.style.paddingRight = '100px';

				div.innerHTML = `
		<h1 style="color:black; text-align:center; line-height:2rem; font-size:35px; margin-top:0;">
			You're about to do<br> <span style="color:#BE1E2D">amazing</span> things with Gmail.
		</h1>
		
		<p style="text-align:center">But first, we've got to connect GMass to your Google account.</p>
		
		<p style="margin:2rem;text-align:center; ">
			<a href="#" id="connect-gmass">
				<img src="${baseUrl}walkthrough/signup-with-google.png">
			</a>
		</p>
		
		<img src="${baseUrl}walkthrough/tourguide.png" class="tourguide">

		<p>
			<a href="https://www.gmass.co/blog/gmass-privacy-information-what-data-does-our-server-store/" target="_blank" style="font-size:80%; color:#666 !important;">Why we ask for permissions</a>
		</p>
		`;

				div.querySelector('#connect-gmass').onclick = function (e) {
					e.preventDefault();

					function doConnect() {
						if (window.LaunchGMassSignupWithGoogle)
							window.LaunchGMassSignupWithGoogle(sdk.User.getEmailAddress());
						else
							setTimeout(doConnect, 10);
					}
					doConnect();
				};

				document.addEventListener("gmass-connected", function (e) {
					getStartedWithGMass();
				});

				sdk.Widgets.showModalView({
					el: div,
					buttons: []
				});
			}
			else if ((UserResult.isAuthorized && !UserResult.everSent && UserResult.ExtensionLoads <= 2 && !false) || (sdk.User.getEmailAddress().includes('wordzen.com') || sdk.User.getEmailAddress().includes('gm.ly'))) {
				sdk.log("extension loaded, launch sample");
				getStartedWithGMass();
			}
		}
	}



}

window.startGmassWalkthroughGlobal = startGmassWalkthrough;

//starts tour
function getStartedWithGMass()
{
	var sdk = window.GMass.sdk;
	sdk.Widgets.hideModalView();
	
	var div = document.createElement('div');
	div.innerHTML = `
		<h1 style="color:black; text-align:center; line-height:2rem; font-size:35px; margin-top:0;">Let's get you started with GMass</h1>
		<div style="width: 700px"><img src="https://www.gmass.co/images/gmass-mailarrows3.gif"></div>
	`;
	
	sdk.Widgets.showModalView({
		el: div,
		hideCloseButton: true,
		buttons: [
			{ 
				text: "Skip the tour",
				onClick: function() {
					sdk.Widgets.hideModalView();
				}
			},
			{ 
				text: "Quick tour ",
				color: '#07B650',
				type: 'PRIMARY_ACTION',
				onClick: function() {
					sdk.Widgets.hideModalView();
					startGmassTour();
				}
			}
		]
	});

	document.addEventListener("gmass-sending", function (e) {
		var sendingElement = document.getElementById('walkthrough-sending');
		if (sendingElement != null) {
			sendingElement.innerHTML = 'Sending...';
		}
	});

}

function trackTourStep(userEmail, stepName) {

	var xmlhttpUser = new XMLHttpRequest();
	//passing in gmasskey here just to get information back as to whether it's right or not. if not right, and user did not click button (meaning fresh gmail reload), then we will ask him to re auth to fix it
	xmlhttpUser.open("GET", window.GMass.main.BaseURL + "gmass/logtouractivity?userEmail=" + encodeURIComponent(userEmail) + "&stepName=" + encodeURIComponent(stepName));
	xmlhttpUser.send();

}

// this kicks of the walkthrough
//startGmassWalkthrough();

// skip to main walkthrough for testing
// getStartedWithGMass();
