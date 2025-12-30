// JavaScript source code

window.GMass.main = {};
var GMASS_MAX_FOLLOWUP_STAGES = 1000;

var primaryAPIEndPoint = "https://ext.gmass.us/";

var BaseURL = primaryAPIEndPoint;
window.GMass.main.BaseURL = BaseURL;

var BaseURLCDN = "https://cdn.gmass.us/"
window.GMass.main.BaseURLCDN = BaseURLCDN;

var BaseURLGenerate = "nothing";
var BaseURLSend = "nothing";

var imgCDNLoaded = false;
var imgAPILoaded = false;

var loaderDomainCDN = 'xxx';
var loaderDomainAPI = 'yyy';

const arrayCDN = ["cdn.gmass.us", "cdn.apigma3.net", "cdn.gmass.co", "www.gmass.co", "ext.gmass.us", "cdn.gmapi1.net", "cdn.wordzen.com"];
const arrayAPI = ["ext.gmass.us", "ext.apigma3.net", "extension.gmass.co", "ext.gmapi1.net", "www.gmass.co", "gmext.wordzen.com"];

function fetchTestImage() {

    var d = new Date();
    var n = d.getMilliseconds();

    var i = 0;
    var j = 0;

    findCDN(i);
    findAPI(j);
    function findCDN(ii) {

        var imgCDN = document.createElement('img');
        var imgError = false;

        imgCDN.src = 'https://' + arrayCDN[ii] + '/images/page_white_copy.png?rnd=' + n;

        imgCDN.onload = function (e) {
            console.log('main script: ^^^^^^^^^^^^^^^^^^^^ GMass CDN: Success for ' + arrayCDN[ii]);
            loaderDomainCDN = arrayCDN[ii];
            imgCDNLoaded = true;
        }

        imgCDN.onerror = function (e) {
            imgError = true;
            console.log('main script: **************** GMass CDN: Error for ' + arrayCDN[ii] + ' so trying next one ' + (ii + 1 + 1) + ' out of ' + arrayCDN.length);



            if (ii + 1 >= arrayCDN.length) {
                console.log("GMass CDN: Nothing left to try, sorry **************");

            }
            else {
                console.log("CDN about to increment the index, which is currently " + (ii + 1));
                console.log("CDN about to call findCDN on i=" + (ii + 1) + " which means " + (ii + 1 + 1) + " as the index");
                findCDN(ii + 1, imgCDN);
            }


        }

        console.log('main script: GMass CDN: Trying ' + arrayCDN[ii] + ' ' + (ii + 1) + '/' + arrayCDN.length);

        var dNow = new Date();
        var startTimeMillis = dNow.getTime();

        var imgTimeoutInterval = setTimeout(checkTimeForDownload, 0);

        function checkTimeForDownload() {

            if (!imgCDNLoaded) {

                var dNow2 = new Date();
                var currentTimeMillis = dNow2.getTime();

                var msDiff = currentTimeMillis - startTimeMillis;
                console.log('main script: GMass CDN: Time passed so far for number ' + (ii + 1) + '/' + arrayCDN.length + ': ' + msDiff + ' for ' + arrayCDN[ii]);

                if ((msDiff) >= 2000) {

                    console.log('main script: **************** GMass CDN: Timeout for ' + arrayCDN[ii] + ' which is number ' + (ii + 1) + ' of ' + arrayCDN.length);
                    if (!imgError) {
                        imgCDN.src = '';
                    }
                    else {
                        console.log(imgCDN.src + " already in error state so not resetting img.src to '' to prompt another error");
                    }

                }
                else if (imgCDNLoaded == false) {
                    setTimeout(checkTimeForDownload, 100);
                }

            }
            else {
                console.log('main script: GMass CDN: SUCCESS for ' + arrayCDN[ii]);
            }
        }

    }

    function findAPI(jj) {

        var imgAPI = document.createElement('img');
        var imgError = false;

        if (arrayAPI[jj].includes("localhost")) {
            imgAPI.src = 'http://' + arrayAPI[jj] + '/images/page_white_copy.png?rnd=' + n;
        }
        else {
            imgAPI.src = 'https://' + arrayAPI[jj] + '/images/page_white_copy.png?rnd=' + n;
        }

        imgAPI.onload = function (e) {
            console.log('main script: ^^^^^^^^^^^^^^^^^^^^ GMass API: Success for ' + arrayAPI[jj]);
            loaderDomainAPI = arrayAPI[jj];
            imgAPILoaded = true;
        }

        imgAPI.onerror = function (e) {
            imgError = true;
            console.log('main script: **************** GMass API: Error for ' + arrayAPI[jj] + ' so trying next one ' + (jj + 1 + 1) + ' out of ' + arrayAPI.length);



            if (jj + 1 >= arrayAPI.length) {
                console.log("GMass API: Nothing left to try, sorry **************");

            }
            else {
                console.log("API about to increment the index, which is currently " + (jj + 1));
                console.log("API about to call findAPI on j=" + (jj + 1) + " which means " + (jj + 1 + 1) + " as the index");
                findAPI(jj + 1, imgAPI);
            }


        }

        console.log('main script: GMass API: Trying ' + arrayAPI[jj] + ' ' + (jj + 1) + '/' + arrayAPI.length);

        var dNow = new Date();
        var startTimeMillis = dNow.getTime();

        var imgTimeoutInterval = setTimeout(checkTimeForDownload, 0);

        function checkTimeForDownload() {

            if (!imgAPILoaded) {

                var dNow2 = new Date();
                var currentTimeMillis = dNow2.getTime();

                var msDiff = currentTimeMillis - startTimeMillis;
                console.log('main script: GMass API: Time passed so far for number ' + (jj + 1) + '/' + arrayAPI.length + ': ' + msDiff + ' for ' + arrayAPI[jj]);

                if ((msDiff) >= 2000) {

                    console.log('main script: **************** GMass API: Timeout for ' + arrayAPI[jj] + ' which is number ' + (jj + 1) + ' of ' + arrayAPI.length);
                    if (!imgError) {
                        imgAPI.src = '';
                    }
                    else {
                        console.log(imgAPI.src + " already in error state so not resetting img.src to '' to prompt another error");
                    }

                }
                else if (imgAPILoaded == false) {
                    setTimeout(checkTimeForDownload, 100);
                }

            }
            else {
                console.log('main script: GMass API: SUCCESS for ' + arrayAPI[jj]);
            }
        }

    }

}

if (document.readyState === "complete") {
    fetchTestImage();
}
else {
    window['onload'] = function () {
        fetchTestImage();
    }
}

setTimeout(GMassReady, 0);

function corsTest(url, callback) {
    var xmlCors = new XMLHttpRequest();
    xmlCors.open("GET", url + "gmass/corstestv3", true);

    try {
        xmlCors.send();

        xmlCors.onreadystatechange = function () {
            if (xmlCors.readyState == 4) {

                try {
                    if (JSON.parse(xmlCors.responseText).success) {
                        callback(true);
                        return;
                    };
                }
                catch (error) {
                    callback(false);
                    return;
                }

                callback(false);
                return;
            }
        }
    }
    catch (error) {
        callback(false);
        return;
    }
}

var numberTimesCheckedHeaderForEmailAddress = 0;
function GMassReady() {

    if (imgCDNLoaded && imgAPILoaded) {

        if (!document.head.getAttribute('data-ueag')) {

            if (numberTimesCheckedHeaderForEmailAddress <= 60) {
                numberTimesCheckedHeaderForEmailAddress++;
                setTimeout(GMassReady, 100);
                console.log(numberTimesCheckedHeaderForEmailAddress + ': waiting for ready, data-ueag doesnt have user email address yet');
                return;
            }
            else {
            }

        }

        console.log('main script: () () () () () () () () Loading GMass from CDN server ' + loaderDomainCDN + ' and API server ' + loaderDomainAPI);

        if (loaderDomainAPI == 'ext.gmass.us') {

            BaseURLGenerate = "https://extsheets.gmass.us/";
            BaseURLSend = "https://extsend.gmass.us/";

            corsTest(BaseURLSend, function (result) {
                if (!result) {
                    console.log('BaseURLSend: CORS test failed for ' + BaseURLSend + ' so setting back to ' + primaryAPIEndPoint);
                    BaseURLSend = primaryAPIEndPoint;
                }
            });

            corsTest(BaseURLGenerate, function (result) {
                if (!result) {
                    console.log('BaseURLGenerate: CORS test failed for ' + BaseURLGenerate + ' so setting back to ' + primaryAPIEndPoint);
                    BaseURLGenerate = primaryAPIEndPoint;
                }
            });

        }
        else {
            BaseURL = (loaderDomainAPI.includes("localhost") ? "http://" : "https://") + loaderDomainAPI + "/";
            window.GMass.main.BaseURL = BaseURL;
            BaseURLSend = BaseURL;
            BaseURLGenerate = BaseURL;

        }

        BaseURLCDN = "https://" + loaderDomainCDN + "/";
        window.GMass.main.BaseURLCDN = BaseURLCDN;

        var ShouldLaunchSample = true;

        varAlertDisabledMessage = "You've disabled JavaScript alerts, which disables most GMass functionality. Please close your Chrome browser entirely and re-launch to fix this. <a href=\"http://www.gmass.co/blog/beware-of-the-checkbox-in-the-alert-box-when-sending-email-campaigns-with-gmail/\">See this blog post for more information.</a>";
        var JSVersion = "1191";

        var SpreadsheetId = "";

        var targetObj = {};
        var importComposeView = null;
        var sdk = window.GMass.sdk;
        sdk.debug = !true;
        var LogIntervals = false;
        var link = document.createElement("link");
        link.href = BaseURLCDN + "extensioncss/custom-gmasssdk-V124.css";
        link.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(link);

        var link2 = document.createElement("link");
        link2.href = BaseURLCDN + "extensioncss/gmass-globalsv7.css";
        link2.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(link2);

        var link3 = document.createElement("link");
        link3.href = BaseURLCDN + "extensioncss/gmasssdk.css";
        link3.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(link3);

        var link4 = document.createElement("link");
        link4.href = BaseURLCDN + "extensioncss/walkthrough.css";
        link4.rel = "stylesheet";

        document.getElementsByTagName("head")[0].appendChild(link4);

        try {
            sdk.log('Email address=' + sdk.User.getEmailAddress());

            var snippetsDefaultCodeMenu = ['<span>If/Then</span>If FirstName="John" Then', '<span>If/Then</span>If LastName="Smith" Then', '<span>If/Then</span>If EmailAddress="john@gmail.com" Then', '<span>Else</span>Else', '<span>Else If</span>Else If FirstName="John" Then', '<span>End If</span>End If', '<span>A/B Test</span>spin}}Hi{{variation}}Hello{{variation}}Hey{{end spin', '<span>A/B Test</span>spin', '<span>A/B Test</span>variation', '<span>A/B Test</span>end spin'];


            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://www.gmass.co/optin/setextensioninstallcookie', true);
            xhr.withCredentials = true;
            xhr.send(null);

            var ComposeTagger = "x";
            var QuerySelector = "";

            var GMassSearch;
            var SearchInput;
            App = document.location.href.indexOf("mail.google.com") >= 0 ? "newGmail" : "Inbox";

            var SearchInputCounter = 0;
            var SearchInputExists = setInterval(function () {

                if (SearchInputCounter >= 100) {

                    clearInterval(SearchInputExists);

                }
                if (document.querySelector("input[spellcheck='false'][name='q']") != null) {

                    clearInterval(SearchInputExists);
                    SearchInput = document.querySelector("input[spellcheck='false'][name='q']");

                }

                SearchInputCounter++;

                if (LogIntervals) { sdk.log("search box interval run"); }

            }, 500);

            var TopAreaCounter = 0;
            var TopAreaExists = setInterval(function () {

                if (TopAreaCounter >= 100) {

                    clearInterval(TopAreaExists);
                    NotifyMissingElement("after 100 tries, top area div didn't reveal");

                }

                if (document.querySelector("[role='search']") != null) {

                    clearInterval(TopAreaExists);

                    var searchForm = document.querySelector("[role='search']");

                    var SearchWidth = searchForm.parentElement;

                    var varTestElement = SearchWidth.parentElement;
                    var varElements = SearchWidth.parentElement;
                    var varElements2 = SearchWidth.parentElement;
                    var varElements3 = SearchWidth.parentElement;
                    var divButtons = document.createElement("div");
                    divButtons.style.display = "flex";
                    divButtons.style.flexGrow = "1";
                    GMassSearch = document.createElement("div");
                    GMassSearch.setAttribute("id", "gmassbutton");
                    GMassSearch.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
                    GMassSearch.addEventListener("click", function () {

                        CheckAuth(true);
                        GenerateDraft();

                    });

                    if (App == "newGmail") {
                        GMassSearch.style.width = "20px";
                    }

                    StylizeGMassSearch(GMassSearch);
                    if (App == "newGmail") {
                        divButtons.appendChild(GMassSearch);
                    }
                    else {
                        if (varElements != null) {
                            varElements.appendChild(GMassSearch);
                        }
                        else {
                            NotifyMissingElement(App + " varElements search area" + " NOT FOUND queryselector ");
                        }
                    }
                    var GMassImport = document.createElement("div");
                    GMassImport.setAttribute("id", "gmassimport");
                    GMassImport.innerHTML = "&nbsp;&nbsp;&nbsp;";

                    if (App == "newGmail") {
                        GMassImport.style.width = "20px";
                    }

                    StylizeGMassSheets(GMassImport);

                    GMassImport.addEventListener("click", function () {

                        importComposeView = null;
                        sdk.ButterBar.showMessage({ text: "Checking Google Sheets permissions...", time: 5000 });
                        CheckAuthSheets(true);


                    });

                    if (App == "newGmail") {
                        divButtons.appendChild(GMassImport);
                    }
                    else {
                        if (varElements2 != null) {
                            varElements2.appendChild(GMassImport);
                        }
                        else {
                        }
                    }
                    var GMassCampaigns = document.createElement("div");
                    GMassCampaigns.setAttribute("id", "gmasscampaigns");
                    GMassCampaigns.innerHTML = "&nbsp;&nbsp;&nbsp;";

                    if (App == "newGmail") {
                        GMassCampaigns.style.width = "20px";
                    }

                    StylizeCampaignButton(GMassCampaigns);


                    GMassCampaigns.addEventListener("click", function () {
                        importComposeView = null;
                        LaunchFollowup();


                    });


                    if (App == "newGmail") {
                        divButtons.appendChild(GMassCampaigns);
                    }
                    else {
                        if (varElements3 != null) {
                            varElements3.appendChild(GMassCampaigns);
                        }
                        else {
                        }
                    }
                    var GMassDashboard = document.createElement("div");
                    GMassDashboard.setAttribute("id", "gmassdashboard");
                    GMassDashboard.innerHTML = "&nbsp;&nbsp;&nbsp;";

                    if (App == "newGmail") {
                        GMassDashboard.style.width = "20px";
                    }


                    StylizeDashboardButton(GMassDashboard);

                    GMassDashboard.addEventListener("click", function () {

                        LaunchDashboard();


                    });


                    if (App == "newGmail") {
                        divButtons.appendChild(GMassDashboard);
                    }
                    else {
                        if (varElements3 != null) {
                            varElements3.appendChild(GMassDashboard);
                        }
                    }


                    if (App == "newGmail") {
                        if (varElements != null) {
                            varElements.insertBefore(divButtons, varElements.lastChild);
                            if (SearchWidth != null) {
                                SearchWidth.style.paddingRight = "5px";
                                SearchWidth.style.maxWidth = "722px";
                            }
                            else {
                                NotifyMissingElement("search width issue couldnt be set to 720x because querySelector NOT FOUND ");
                            }

                        }
                        else {
                            window.onload = function (e) {
                                sdk.ButterBar.showMessage({ html: "<span style='color: red'>WARNING:</span><span style='color: yellow'>" + Date() + ":</span> The GMass buttons at the top didn't load. This includes the Build List button, the Google Sheet Connector button, and the Manual Followup button. This happens when Google changes Gmail's code, and GMass hasn't adapted yet. Usually our engineers react right away, and this should be fixed shortly. Feel free to also <a style='color: #99FFFF' target='_blog' href='https://www.gmass.co/g/support'>submit a support request</a> to make sure we're aware.", time: 20000 });

                            }
                            NotifyMissingElement(App + " varElements search area NOT FOUND QuerySelector ");
                        }
                    }
                    var MainBB = setInterval(BBFunc, 1000);


                }
                else {
                    console.log("waiting for top area: " + TopAreaCounter);
                }

                TopAreaCounter++;
                if (LogIntervals) { sdk.log("top area interval run"); }
            }, 500);


            var SmallButton = false;
            var SuppressBeatsPopup = false;

            var xmlBS = new XMLHttpRequest();
            xmlBS.open("GET", BaseURL + "gmass/getbuttonsize?emailaddress=" + sdk.User.getEmailAddress(), true);
            xmlBS.send();

            xmlBS.onreadystatechange = function () {
                if (xmlBS.readyState == 4) {

                    if (JSON.parse(xmlBS.responseText).SmallButton) {
                        SmallButton = true;
                    };

                    if (JSON.parse(xmlBS.responseText).SuppressBeatsPopup) {
                        SuppressBeatsPopup = true;
                    };
                }
            }

            var AuthCounter;
            var DriveAccessCounter;
            var EverSent = false;

            if (localStorage.getItem("GMassPopup") === null) {
                localStorage.setItem("GMassPopup", "0");
            }
            window.startGmassWalkthroughGlobal();
            SetDefaultSettings();
            sdk.Compose.registerComposeViewHandler(function (composeView) {

                function migrateLocalStorageKeys() {
                    if (!localStorage.getItem("GMassEndTime") &&
                        localStorage.getItem("EndTime") !== null) {
                        localStorage.setItem("GMassEndTime", localStorage.getItem("EndTime"));
                        localStorage.removeItem("EndTime");
                    }
                    if (!localStorage.getItem("GMassEndTimeBox") &&
                        localStorage.getItem("EndTimeBox") !== null) {
                        localStorage.setItem("GMassEndTimeBox",
                                            localStorage.getItem("EndTimeBox"));
                        localStorage.removeItem("EndTimeBox");
                    }
                }
                migrateLocalStorageKeys();

                var BumpSettingsSavedForDuringListSwitch = null;

                var loadedSmtpDropdown = false;

                var arrayMultiSendEmails = [];
                var LoadedMultiSendAccounts = false;

                var ccCheckByPass = false;
                var sizeCheckByPass = false;
                var replytoCheckByPass = false;

                var hideSomeSettings = false;

                var ToList = composeView.getToRecipients();

                sdk.log('got compose view, ui version=' + composeView.getUiVersion());
                sdk.log(composeView);
                var isComposeInlineReply = composeView.isInlineReplyForm();
                sdk.log('isInlineReplyForm=' + isComposeInlineReply);
                sdk.log('subject=' + composeView.getSubject());
                composeView.getCurrentDraftID().then(function (draftID) {
                    sdk.log('draftid promise=' + draftID);
                });

                var GMassLaunchedCompose = false;
                var settingsID = makeid();
                sdk.log(settingsID);
                var LoadedCampaigns = false;
                var formData = {};
                var sendUrlCurrent = ''

                var MainButtonPressed = false;

                var PersonalizationItemsChanged = false;
                var MultiSendInterval = 10;
                var ComposeInterval1Running = false;
                var ComposeInterval2Running = false;
                var ComposeMonitorInterval1 = 1;
                var ComposeMonitorInterval2 = 2;
                var RC1 = 3;
                var SMTPSettingsInterval = 4;
                var saveProgressInterval = 5;

                var ToFieldMonitor = false;

                var PriorAlias = '';
                var BypassConfirmationOnToChangeWhenScheduled = false;
                var SkipTContactRemoved = false;
                var DraftCheckCallTime = new Date(new Date().getTime());

                var musicNoteImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADdYAAA3WAZBveZwAADCASURBVHhe7Z0HeFvl9caPLQ9579hO4iSOs/ceJIEQMhilECBQCqSBlkJpS1toofBvCRS6KLQUKKMtI+wVZoBAdsgO2cPZwxlO4sROvLf/572SU9u69+pK1rrS+eV5H90rK7Jk6b3fOt85JAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAjmIsx+KwiBSmfWCNYAVg9WR1Y96wzrJOsEayergHWMVcISBMEEoAG6kLWQdY7VyGrSEX5eySpmbWc9y7qYlcgSBCEA6cr6hFXLUjO1UdWxTrNeYU1jJbMEQQgAxrFOsdSM2x41sNAzuI8VzRIEwU9czqpmqRnVU0IX/08sQRD8QF9WKUvNnJ5WBSuVJQiCD4ll7WapmdIbwtgfs/ghhSyvCf7mDtbzLN3vYlyEhQYkxlFyZCRVNTZQRX0DlbNOVNfSuTqsthmmhtWNhWW5kEGMLviTJNYeVgflTIWI8DC6s3sn+lmPzhRrsdjvtdHcRBdW1dDehibaUV5FCwpO0KaiYuV+Na7L61wzZ9r4+2IsZ18Mf2Y+TB8SiNEFf3IZax4rXDlrQzy34nNG9qORqfrL4eF8AUjtmElh4banOVxWQR/uO0IfHzhK60+doSZ2Pb7o1/TIoWcvGkHJ0VF8hWjaQZbwu2OefWex8p8CD7zkeBaWBXFBLGcdZWEFQes6pokYXfAnL7Fusx22Bl/MR/p3p1ndsm136BCTEE/xqerL5CU1tZRfXEq53O3Pjoux32ujiZrqwsLoqdKmpj9kPvc+jORPcJXKZWH1YSILAUPprJZgfuEQay3rfRYuUggUcmp8MbrgL/DFPs7KVM7aMDgpnj4ZN4jC2YnOSOHWPILH7u7S1NT0LXcKfhT17Htb+be53Fq2E4xHBrN+y5rOimAZBWHAc1h/ZiE4SBPVLpMg+AD0xzHjrsoV2emGTI7ueri9y+4uYWFhIxoaw5ZV3TVjRtPs2XgyCEtwg1gZLFfM5wposV9nrWfNYLn6e9JY97C2sX7OsrJUEaML/gJ97dazay3Ii2/dzdYCJmej2s/ch58hiZrCXis8suVBfj60kOgib2Fhs8x/WCksT4EXPIb1DetGVnt9mMV6mvUGC+N5B8Togr9AKKrm9w8TcYaAZTxgdIWwsOh/7zjwB342hMom2O5UWslZrE9ZnjB7FAut7wJWH9zhQa5lzWdhh18rxOiCv/CQOz1HWW0dvbxzf1gjpukdGc+ay3LX7Hi/3Vlvsf7Bwoy6N0BPASsZzRcqBTG6INgpq6unCv3gG2x9/ZLlfCmgNRim3M9aw0Kra8h3mKOIi4ygpKhIsraJIXDCUBa68uf/U8BdVYWQAd3WTSzVCaR3xwygsWmqw81WWNgIKdmZHhmnw+TjP1hAu0oQdq/LXtadrGUsrGurgRfUiYVJNkT/9bLf55QuCbF0bV4XuqxbNmXGWCnSEk5V9Q10sLScXt91iJYfO6UsGzoBG3jwe/+LEzG64C8Czujgw/1HaNaCNVTXCJ/ogqg6jNv/xsLEHTbLYPyNF431cMQHXMrCrL0hEvi9/N/IATSzby6lIKhHBYwqDrDhH1m7jT46cITqG3VXA7F82ZNVKUYX/EVAGr2BjfPEpnx6bP12ZyZqBgkusJ6NLbZYHotj4YW7NCzOS4qnOVPG0vAOxjbW4UL09JY9iuGdXJR+yfqnSx1/QfAgWENG91d17XhG5w6UE6u5LHyecO7WIjLOU0bHuHhsVjpZwsNpxfEiI9Ez8FBzqCpiA7AuaPjF4Pdd2rUjzb1iAvVIajV/pouF/9/orDRE99HKwtN6r7Mf61mZjBOENljCw+g3w/rS70cNoMh2BuPokcHj7+cnjqR3Lh1H6VbXE9/A7HiduDDp0IU1VIwuCCo0m+jlyaMpMcr98Fo18NxXde9M626YqozHo7hX4i7RFgvNHj3Q2QVpshhdEDRAt/raHl1o/lUXK5ti2gueb2RmmtJNf2PqBZQVayz6zxlo0dtu2GnDRWJ0QdABg+2hGSm0asZUumNAD7IajdhrQTS32JM6Z9IHl4+nhdMn0bQu2co+e0+B55rWBVGwmnSVyTjBXwTkZJwWMPi0rh1pZh+snGH7a52ylq01CYbuPmbQb+rTjV66ZDTdzheJXsmJSrfdGxSUV9L8w4X2MwfqvPvXEQRtAnJ5zShYejtVVU2bi0roYGkFVdTVKQktoG7czR+UlqyMvdFd9wXv7i2gWQtW288cqBCjC/6iXUZHPPrWc+W0paySstPTaGrXLGUWO1R5evNuun/VZvuZA0UyRreBmQxsOOjPQt8MyRA8M1MieJyaxka6f9t+unrVVvr91n30o8Vrqc/r8+jJTbuMRLQFJVvOnLUfqXIoVI2OhAfI5oGdRKgMgvDFfSxs4N/PwmCnOUfXUta/WT9iIfhALo5+5oOjRfTekZPcqtvvYCrrG+h3q7fQdV98Q+WuZYU1PWW19fSV9vgcHAy1Ly0WRBHof5D1IQub/hGLjCFMW+Fvg00JF7FuZyH5wA5WEesDFjYraGZIEbxDA3fZ32eTa02CfV1wgqZ+vJhOVSIiNTRYcKSQzupvctkQSkbPYyFlzwsszfTCBkAwMrYavsfCZRSpgCazvJVuSGhBLTfjFQ1aG8ZsbCoqoYkfLqLdznehmZ7i6lp6YNUW5QKoAcYy74aK0ZFVcxULSfg8CWKbb2YhWwj2Gn+PFbozQj4B0d3OwZbOaZ8sUUwfrGDr6k+WrqeCMow8NUHjdjgUjD6chTK87WnFjYDf8zbrW9YPWFK108+c5O77lZ8to5WFGG0FF+iq37lkPX12ENNImuCa+BwOgt3oGGNjPO3LgviYuUdN7i9YyCIaSsOjgONMdQ1d+/k39FVBoaGegBnAfvSr+T29t/ewsj9dByysv4mDYP4SYkLtMRbqbOmCB1oRYcWKDA9TztsJnmISC1k+/8DyZAZRwUXO1dbRTV+told3HtAbywY8iB1YcvQkXfbJUlp7QjeNO8DsHPaiKxMaHvhOByzDWCtZmmPmiLAwujAjmb6Xk0mdYqKVKKaahkaqbmykU9w12lNWSbtZeytr6DS3DG4u2+CbhbTByDiCiIZgaVjai1sBM1UNDXTlyq3KZ+MqCD+9e3BvemjUALdi1v0JElc+sWkXPbNltzI2dwIe8BDrfC34YDb6qyyMlVVJjoygh/rl0tWdMhTDaxFpjabI1BQ6Wl5J28+co7f3HKLVfDXFbKeL4BL8MxaGEk4/qRDA50YH+KS/k9uJnr94FKVZ1dM1BRJKBOCZs3TP8o20hr93BloJPATVae9mnf+eBavRMSZHAIxqvi4Y++WRfWlihvMedVKHdIpqEVqJP/yx8ir6/PAxennHAdpZfM6V7iDyjD3FQnfevW+q+2DNH9lLkSEUwwpMTmKpEBGAiCvIZ21nbWAdY3n7YuQXowN86QfzZ4/NJv1SncfT+4uiqhp6YmM+UlAb7U1iKe0d1g9ZrQIJgtXoY1nI0KmaMeD7XbLoLwOxrK6PJcK+YUJjS2E1f+kwZnpozTbawVddg3bHh4Ek+zNZyDXmbXCx+z7rLhaMrpevCG8B61EYaiBA6DOWt4oPesvo+NyxjKpedbEFadxb+93I/jSrX3dX0yl7lcr6evr80HH+Xm2lQ6W6S2ctQSPyFxaqzDiUgw7WybgclqrJMQ7/eY/O9jN9sDNKy+QAX47LunakZddcQv/l1iE30VBOfvzNUTET1TBRO8tb4MU8yIJp0YtAumFnScnwZtHKI385yvsg9mAqy0zBQEtYV7OcrqlhRv7XKzbRNZ9/QxuLSpTemj9Buum5+44oKadvXbDGFZPj4nwLCz1F1ZrvwWp0zZn2jjFRysSbEYxW6IzlC8L3e3ej1dfbkhMYzDMGMyEM1xtmR4rfhSysOrhabKAZvImBLLTq2BPgtIUMINCqT2PpLjIDDLvQK5vy0WK6a+l62n+u3Oezpdju+vaewzTmva9p5oLVSplnF4aDmODFdwlzP5o7eoLV6A61p5pJdaG8briLM7OoqPHkhGH06pQxlGHsYoIa2Ajm8ZTZ8Xlisw5a4tEsTwzNMGN1HQtxAZp/1wAEwwLsU0AAk1PQXZ6Tf5DGvv81/YDNtu7kGar3YguPTTgoxHDrwjU05K0v6YeL1tC+c2Wu9CowG/wvFqI+0WvT/Y/BanRNh7qSCMCdFXUs4VyTl0NLr51MF2TrZudsZhwLtbIMJ/rXAJNtWE7BZIyhX+wC+ENg3gM7+YyNewKDAyyYHfMNhvavYhnr/b0FNOXjxTTm3a/oyU35Shgtll3bA1podMURuPPAqs008M3P6YrPltI73JIrmWpcu6ZghyX2W2Bm/RzucIYnrviByDMsLGU5MCQ5gT4dh4A15ySkppA1wf2kgBhz/WblJno1/4CRDxJX5e+wnHY324CLNXoGGIfjjXn7M13BwiYe1bGgC3hrMu5h1iO2w/Pgwo89Cf9kuTzNHsVDsRRrFI3OSqdRmanUPzWZcuJjKSEqgmIjWDx0Q7AVLgYIzim1C8cIw13KQ4Mlx07S6aoa5THtmAvAm8bSGYZkuhvQ2yJG16G9Rgf4YO9js/93x34jHzCWBC+z3zoDn11f1gOsG1iGxiT4Tzn8nvqlJipDDdxTWFFF+SXnlOUcg6Aa6L0st7+xjC+N3gySimD3IiYY3Qa9QizR4hYdRPT8MGeLPwY+Y6iBT5qPPQC6E8tZKLeMrdIuP2mwdt0DBmQA/dv4oXTnwB5Ghg09WBtZv2KpGoDBmBmz9qjqCaOgpXJqcvzuS7tm0/LrptC2my6nuZdPoFenjFXmE764aiLtuuVKenvaOBqYZmjO7RcsdOXNBuIFrmDdykLCEbeAeWsbG5XlVUSpYXyPdW704HCOi3s9/9wDJscTrGNh3mUKC3EObj2pGN0HoOv3lwuG0M8H9zJidiyBPcnCOOwJFtbAsf0VGVPnsA6zMBOOWWVDoV1ouV+dPEYx94gOqcrrafk6MK8QG2Ghq/M684VgMt03vB9F6K8c4IcIsXT6ZgIQRJ4ganIAC135MlYgspZ1JesCFoo5tittjhjdR2DJ7Y9jB9M9Q/sYSfmLB2CGG91j7D7C8hbGZgiyQQJvw59b75REWnbtZJrRs4uRi4wSG/DwqIH0+LghzsyO7q+n9/f7EqyzY9NHbxa2chpetPYiGDthYhZVWGHwz1keiVAUo/sQGPyR0QPpgRH9jZi9JS63nDD1rL7daQV31WF2V8BLQzxAcw5zDfCaMGY0O8gS9FMW3uz9LLfGwO0Avwthx/ewsK36u6yvWO2b5m+DGN3HwIAPjuxPj4wZ5NFqHS3pmhBHn3znQnru4pEUH+leUBteJy5KTuIBJrC88yZ8D1r4x1mYqcWSJ1r5PSxvmB5x6Fi9QLgqgpJGsjDBiZBor1xkxOh+AM64l7vwz00cSUnRxgN4nIGCez8Z2JO+/d6lNDknq90OTGeT3zUIkbOaIALPTEE0RkBLioQNaOXRrUca8B+zkBsQLS/G9HgMDNmstjTfj8eh632C9THrNyx0ybGcgIskQpR90oMQo/uRW7hrvP6GS5V4eRe78ufB/8JaLrrZ335vGv19wjC3W3E1MFOPlQMd8MUNZg6xEHCD+ZERLCxLoJt/CesaFrZCYykX3f5fs7B5CLP6V7GwUxDBSwhDxsw5JldxEXF5j3N7EaP7GQReoPjem9MuoIs7Z1KMgbBbmBvm65WcQI+OHUQbuAV/cdIolwrpGyWXhwG4kOjgzY05gQha6QIWNs+glUZLj1BUdPuxWoJJU6yOYGVkK8ulwBZvIUYPADAeRr3sL747Uana+Rib99oeOdQnJZFSoqMo1RpFWbFW6svn3+vVlf7FXf4l10xWuuj3Du2r1PryFnGRkc7mEsy02SVkae8wLlBpd2RcdUMjWbiFTE1K9GvaIQRioFuP1+CPDwsljvLmfKoXNYetkbNthy7hj8i4kEVa9DbUNTXRfw4eo+tWb6Oxny5TNjd8uP+IUj3TH2C8je68v67IZ6prnW3oQDdWCHDE6C3ADqOn9hTQn/MPK5U6T3Er9u2pYpq1YA39ZOk6V2LBg4Z9Z8uULZU6GInLF/yMGL0FyPz6yqFCh33I6L6+sesQXfLRItp8Ongrf7QFfwVso0Tctgb4AdaahQBHjN6CI5U1VK7Teu3l1u2qz5YrSQlCgfzic/TePt2eObKbYI1YCHDE6C3ABJwzkPZn+ufLacXx4Cvz0xJMAt77zUYlEYMOSIXln8kLwSXE6G6AnO6ow73smNs7HQMabLX85fINtOy47vtD0IdS7kcIfMToboLsIdd/uULJ+xVMIAvKTV+vUpIVOtlOjaAQRI0JJkCM3g6QLiiYWnbMQSCP2fxDx50lTUDVGWS2EUyCGL2dlPFYFmN2tIBmBaaed/AYTf14MW097bQQBSYyECATGjOSQYIY3QNgTHv7orX0yLptfguscRcMQX71zUa68auVdKKyVRUfLZCE8kXboWAWxOgeAsE2j2/IV3KCY5wb6OByhJWDiXMX0n+27zN6gUIq6d+yvF2XTfAwYnTj4Mutu9aELjDCZVEEYPHRk/Z7A4+CskqlcMClnyyhXSWlRtbH8JCXWLNYun8DITARoxsHifKvt9/qghLLV89bruR0R32vQKGYX8tfN+ykoW9/Se/uOWy07A/eAPZa32E/FkyIGN01sAcZxQucTrMjbPbZLXuUcjv/2b7f2cYQr3KMLzy/W72Fer0+jx5eu01JT2wQ7KVGBlokTJDuuokRo7sOanmhzI+hafbT3IrevfxbGvnufHpp534l97cvQGv9zfFTdMfiddT3jc/pyU27XP3dK1nIqILkCoaafiFwEaO7xy4WTPC1cmYArFH/bOm33Kp+RrPXbKXtZ8553D3oie/g58Xz9+HWe+rHS+i1XQeV3oULoHuOPeZIlYTc8kIQIEZ3HwSNoGLKoyzD3VqEzz6+MV9p4Qe9+YXSpV545IQyU49WGGZ1dgHAYzDxBwOjzO8rOw/QrIWrKe+1T2kEPy+eH/MELoJfi6ogqM6JdXIZjwcRkmGmBcuLztLN65CUU5ViFjKCqk3GoVwOcoXh5279TcPCwqibvSZaZmwMdYiNpswYK0VawqmOx/coAVTLt0gEcbC0nA6wwXGLzSceAHMOyMyCmXVfJS6UDDM+RIzegnYYHSAzI9L3oi5ZDO4wAUhd/AYLvRIUMvAlYnQfIl13zwHTIP57PGsZy+cpfV2glPUsaxgL6Yl9bXLBx4jRPQ+qoWIJDgXyUI0jUAyPGTnMK/ydhXzjKKckaaBCBDG6d8DAGTPyk1gwPGppOQ208RL4vaitfQsLYxYUbjzAEkIIMbp3QbgoDI/Z+VEsdO2xNOfylLgLYPYcXfNtLBTuw++9mIWKrNJFD1HE6L4B3WYkUfwLazhrDOsnLLT0R1ntMT6W9pDXagsLk5AoBYQ1/ubCffi9/gvLEwICMbrvganR2r7Auow1hIVJMSzRIab8PRbWs2Hcnay9LHS1YVic4370ElAG6G4WivVhzA1j4xylgPB/ZB1cOI8Y3b+gm40EDrtZC1mo33UDazQLrTJaf1wEIBxDuH8aC8uHaMFRtO8YS3aVCZqI0QMXTOghE0Q5CxNquMW5b4LlhaBCjC4IIYAYXRBCADG6IIQAYnRBCAHE6IIQAojRBSEEEKMLQgggRheEEECMLgghgBhdEEIAMboghABidEEIAcToghACiNEFIQQQowtCCCBGF4QQQIwuCCGAGF0QQgAxuiCEAGJ0QQgBxOiCEAKI0QUhBBCjCyYjzNmXVtJhqyBGF0yF1RJOmdZo+5kqqLkutEGMLpiKMNbMrlkUGY4jB/azUDlWaIMYXTAdkzqk0K965lCMxWK/RwFlrW5koaKN0AYxumA6LGFh9NMeObR20gj674h+hd3jrSg0idrv65UHCA6I0QVTgo57clQETctKKVt92ejNfFqr/EBQRYwuCCGAGF0QQgAxuiCEAGJ0QQgBxOiCEAKI0QUhBBCjC0IIIEYXTE1VY1P4qlNnI+ynggZidMGUFFbX0P9t30/TV2zJuXb51k/4rh+zrMoPBQfE6ILpgMlvWruDXj98gnaUVkQ3NjVdyHc/z/oHq1UAvGBDjC6Yjhf2H6N95VX2s/Pgu3wbq49yJrRCjC6YirrGJtpYUmY/cyCKdZHtUGiJGF1wFUx8xbKSWUmsGJbPusv1TY1U1dhoP1Mlw34rtECMLmiRxhrOuob1KOtzFvZ877Pf7mTlt7hvBwuPmc26goVto6ksIQAQowvNoKWGOe9mLWbtYq1izWX9jnU5qxerK6szK9uuHFY3Vj8WHvMw6zPWWhYuBPNYt7B6s2QZzE+I0QUYFUtTG1gw5z9ZF7PSWRjzugO2i2OpqwMLrfsc1kYWnv8mFnoLgg8Ro4cueaxnWOhyv8BCa+6tdWgYH+P6YazXWOjuP8KSpTAfIUYPPdDthrG3sX7GSmCpZlr0EvjOoUW/nhWJOwTvI0YPHZAjGcZGC34HC7PlQoggRg8NhrCQOPFpViLuEEILMXpwg88Xrfca1kCWW130lKhIGpwcT9O7daR7h/ah2aMG0KNjBtFfxw2hJ8YPpXv4vut7dqHxHTOoW2IchYf5ciQgGCFYPxFMMqGb6sCQ5AT6dBzmnRxZXnSWbl6Hnq0qxazurHPKWeATz8JY/Psslz7nOIuFRqUl0qSMFJqalUadEuIoMT2FIqKidJ+oCWpqosKKavqq4DgtOnKSVhYW0cnKatsDXODdMQNobBricVpT1dBAV67cSnvKKu33OIDlPUz0CS2QFj04wWTXFywsZRkyOR40PCWB/jW0N22aOormjOxHs3I7Ul5mOqVld6BIJyYH+Dla807xMXRbvzx6c9oFtHfmlfQW347LzpCW3o+I0YOPTiwEvKCogVMi2HxXZKfTRxcMog9ZV3ZMJ2t4OFkiIykpM4PiknlI3w6DRvJzTc/LoQXTJ9HK66bQjb26UoR6OaVWJEVKbI0nEaMHFx1ZMLn62KQFsNoQHnd/MHYgPT+sNw3j1rzZftb4OEpBKx7tbryMI8rv46HAy5PH0IKrJ9GwDqma149OMdHUMwHL7oKnEKMHD4hk+5iFMFVdUqMi6Y8D8mju2EGKwZsJY+fFJSdRQlqKcuwtxmSl05Lpl9DfJwynNGt0qyFBcnQkvXDhcIrinoDgOeSvGRzArW+yRipnGsBQmD3/hLvoN7epSApjx6cmU2zS/4zvTaIs4XTngB608cZL6c8XDKFb+uTS7FEDadWMqTSZu/oJ6al4UfZHC+1FjG5+EEb6GGuKcqYBxuI35GTSO6MHUNe41pGuislTkpQuu6/pEGOlXwzpTf+eNIp+O6If5SZisYAoOjaGEtPQvRezewIxurmBC65j3Wk/VgUt9wN9u9FfB/WguAjH8HJMuFkTbAYLJKLjYpRehtB+xOjmpicL0W6as2aR3CLe37sb/Si3o+qVwBofSzEBaPJm0MuI8UNPI9gQo5sXmPtJFraCqoLu+m96d6Xbu6ubHAEw8SncYgZ49ziOhxWeXAEIRcTo5uU7rGm2Q3Vuzc2mH+d1UjU5xr4JackUZoLZbbzGBIzXZSbebeQvZ06QoulPLM1tniNTE+nXvbpqfsCYXUeLbhYskREUm+jrHbXBgxjdnNzM0lwvT4uKpKcG96QYi/rHa4mIoBjFNOYiJiGOLPzeBNcRo5sP7PS4i6XatGFp/OH+uZQTq50sBrPsZly2Qtcdy4DSpruOGN18ICurZms+NDmBLsvSTsmG7np0nHnDS/H6w7lHIriGGN1coJlGIkfVRk1ZL+/TTTd8NNYekGJW0BGRIBrXEaObi1wWcq2rMiE9uVXselssERZTt+aC+4jRzQOasVks1dkoC7dyd/fMUdbOtYiWwJOQRYxuHtBtR450VXLjrNTXydZOa6y05qGKGN08ZLL62g4dQfKIGIt2mvSIqEhlLVoITfxtdPQzkRFlBAvVQa5iYY0YE04o4zOdhV1Zo1lZrFCehZnMUv28YPAZnTUjYRUird6qzSCYAV8bHRFdWB76I+sr1ilWAWsdaxHrI9brrBdZqOiBul943GrWMVYRC497goUQ0FBJXYzPaZLt0JGc2Gjq4CQWPMqKtO5CqOILo6O2F7ZRLmAVsmDeB1lTWciKgteAlrpZLWl5Px6HBWJ84e9loZAfLhR43p+zgrlcLvrcSNesSs/4WLJqRMEphIVxiy5GD2W8ZXQ871gWTH2A9TwLXU9PB1fj24vnxVZN9AzQGxjH8tb78hcwOiqWqjIh3TEtcksiIiJk7TnE8bQh8IVE1/wbFkru4thXM0AYhGJ8v4J1G+4IIpD0UTXSBctpI1L0RzDhKskmhNDCU0bH8yCQA+NntOIXsPxJsM089bHfOpAYGUHJUfrXUjG64AmjYzYcFUEwYXYh7hA8juaUOsbmyJ2uh8Xiq06VEKi0x+j4vxgfo7j97Sy39g8iogtf1kRulZD6t2NcjKLMWCulx0RTanQU/yzSUNL/IEazbx7Ff5coJ+Pv8ND+2wmMu98AlNy9n/VblkvTuSjLk8hdyU6x0UptrzEZqdQpPYXSE+IohY2eFB2pPKa2oYGq6xupmm8r6uvpcGkFfXuqmJYdO0k7i0upuLqWavhnrmLS2msPsVTrifVOiKXPxw/W3ciC1MnWIIlxr+TvwoQPFvJ3QPNjkNprKrhjdCxjvcFCIIvh/48SOxemJ9OMnA7KclA2t9YxsbEUn5pE4ToRXWqU1dbRDv6gX8k/QPMPFVJRdTU1ocKfAUxq9L+y7rMdtmZgUjzNY6PrfRCJGWlK+uRgoKKOjT53IeVrGx1Lt3+2HQrNuNp1x+wv1q+xBu7U5HgAEiDc06uL0uo8O6w3TeRWPIeNnsytTCK35q6aHCRwVx7VPl64eBStuX4qPT9xFA3l58UwwBnIimpCquy3DjTyFQ7SxehV0AQ08Hupb2y0n6lSar8VWuCK0bFFEhU6EY7qlHTugj/cvzt9wQb/Zc8c6sKGh8WiuGVJzsrwyHZJPF82j+d/0DeXFk+/hF6YNIq68BBAjx7xpmzZNL+8dY38xXdiZJQyDhYa+P3WNuga/az9VmiBUaMjHn0ea7BypgPGild1zKB54wbTrd2y/1cVk1tSJCRM5JYcOcs8jZXH/Tf37kbLr51Mdw3sSfEqGzgwqXd7Xmf7manQNHptUyO3cPpGbtRvAU1FHb9fJ3MzZqlf71OMGB2ZDDAm76ec6YAqmG+M7kdPDelJHfm4GURlIdcXCvh5O0ILs/V/Gz+UFl9zCU3pkqXM5GOCb0SHVJp35UU0PLczhZlvFvqM/daBsroGqnAyKdlYX28/Mj+V/H7P1tbZz1Q5ab8VWuDsG4+QVayRI+GB7mPHpCbxGLyXw+YKm8mTyeqkS+0NMJYrqalTxrCo0hltnw+oraqm0qIzDl3aAJ6M68/abjtsDdJHfT1hKOXpDEmiYqyU1AHbCszP8uOnaNrHS+xnDtSyENdRopwJ59Fr0WHsX7Bm2o9VwVIYKnO+Nqqf6g4qVNnwh8lBBA8jMrhngVa+2eQAX3zMRJso/vswq9p22BqM0fdXaM7VKTTWu74MGahsPa07BD/BqrEdCi3RMzrG4//H0pwWh8nv792VHu3fXXX3FGp6BWpdL5gdFyGTgL4qNu2osviUfgNWX18XFBNy6JktOarbMz/O0u3XhypaRkcT/BxL0wloC+/K60R3dO+ouqwVGR0d8EaKiY83SyAJBtk7bYeObCwppRq9mWj2eF2N+Ru6Uh6b5xfrrp7tZYnRVVAzOlyL/d1jlDMNbumaTff26qK06m1RamWlpwR+15hfHsryRkQGfPUP9L2X2w4dOVpVQ2f0J6iortr8Rj9SXkkFZRX2M1U+sd8KbVAzOhJF/Jql6dJLs9Jodr9czQAVzLB7YwnNGyjVP9JMcFEi+pql2v8u5zH4lyc0J+YVMAFpZvDGX8s/qATMaFDJWmY7FNrS1ug4/w1Ls9RHtjWKHh/UQ5ntVQO5yVDT2kygJK8J8p0fskuVucdOUa3Oenk9t/gNJl5mK+fXP/8wEhRpsodVZjsU2tLW6F1YSMqoCpIcPDYgj5J1sokidt2MoB5ZuF46Jv+DFmuh7dCR3WWVtK9cf/a9pgJPYU5WnzhN+87p+hg9Hplx16DlNxvH2JGm6dSrOmXQpA4p9jNHrPGxZhjvqoKY+wDviaDP+pL91gEssz21t0A37r1Kf3wbsKCn8uSmXfYzVTAu+bftUFCjpdGTWTNsh45kcPf293276W4ciU0yZ2vejAkypSJoRnP2fWnRWTpcqd2oNTY0UE2lfqsfiGw8VUwrjiMBsCZbWEdsh4IaLY2OHOqaY3PkDU/VqU2NbZCo7SV4FTTJb9sOHaluaKQ/6k9YUaV+9zfgQGs+e802Zzv00JojKk7QoNnocDAi4FSBwW/LzbafqWPGwvomBV9qBIaosvBUCS3RCaCpr63lVt08Y/X3eTiCsFcd9rOQp1DQodnoiOHWTOh4dccMpeuuBUr9YOZa8AmnWa/aDh1By/fwzoN0tk57hr3ibKkpIuVOVFbT79dstZ+pgjfxJEt2rDmh2eioeqI6lR7P3fFbuTXXW2WOjgmO7CUmAV/uf7E0W/UCNsj9W/cpE3RqNPBFoKq03H4WmNRxl/3OxeuoUD+OH6255lBG+B8wOnSRcqZCtzirsnauR3S8VOn0MTD5YyzNhfP5J87Qy4eOq0/RM5WlpcraeiCCzsYTG3fRVwW66+bosvyeJYkmDACTY3yu2W2f3CFVN/EglqXMuqRmcuaw1tgOHYHBn9hdQJ9qzFY3cWtfVlwScF14vJo3dh+kP32ruV24GdTk+9B2KDgDDkZNL9XZdkS/TcvSnIhXQDlewS9gRu2XLM1dHjXc/b1/637Nybn6mlqqKAms4e2nB47S3cs2OMsLh6sXwrRlpt0gMPpQ26EjmdFRlNMiU4waMgnnV75lIbWx5obzyoYG+umm3Zqx8FXlFYr8DXoW7+w5TD9ctFZJ8a0DxhvYPr1bORMMAaNjxl0VzLQn6IS7AmnR/Qp6upiY+1Q50wCbXn6xeQ+9cfiE43o0n1cUn6UaJ8krvAkm3p7dupfuWLJOSeesA148hixYdQisMUeAA6Pn2Q4dyY2zZW7VwyLjc3+DULi7WKqppppBMM1DOw7Qg9sPUGmbzS1oTTFe98cOt5LqWrpz8Xp6YNVmZ9ldwXoWNl3JnnMX0W3R85zMpmNrpzt52QWPgxRK17GQckoTpIV+q+AEXb96O20/13p5rYlb1dLTxT4LpkHPYs2J03TxR4vorT2HdKP57GB32o0smWV3AxgdyfRUcZYDHdlUA34Xd+iAMSvKVOsGhYOdpRV0HZv9sfyDVNJiiQ1mLztdQlVlfBFwbjy3OVFZRXcv30CXf7qUdpcYqreANFoI0UatfcENYHTV2TQY2Nn6uS1Zg1g9gNjI+i5LdwEaYJLuPweO07RvNtOcw4XnI+nQjS/nMbuy9KY/8+0yJyur6W8b82nku1/RSzv2U5WxpJXHWLiAaW7mEZwDo6vOtuF67qwCCDs9lHxulskfrK1fwkLUmC54Qyd4jPwQj9snL9tEz+w7quxpR0BddXklnT1RRHU17VvBQpccmVsRyjr8nfk0m29PVxneNo5eyiTWBuVMcBvYFNuZVFO1vj6qH12Uob3/HDHuqR01e/6m47ODx+j6L1fYzxw4yurLCuzY0f+BlGDY7DFSOTNIdHg49UuMo+mdMmhYSgL1Soij1OQEiklKpHCdwKmWlHPvANVOVxWeprd2H6LdZ0uNTLS1ZRXrapbToYjgHBgdX1zVjAsvDO9Dl+sEzCAvnGL0IGnVX965n366FEvTqqB1QcyBmTZ0Y5Llb6yfsIy5tAXIKBQbYaE+CbHUn80+tFMmZcbFUCxf4GP5s2/if+h+V7KxT3IrvY1b7i08xs/ncXdVfb3TUlEaYNLgaRbWyiVjjIeARQ+yuilnbXhycE9lH7oWmHFP6wSjB4fT/7JhJz2ydpv9zAF0HxEqbLZoLHw4GOMifbf2h2kQPBnmZpo/cVgZ43oPjWuQPOJW1mKWh55SALjKa+6COlOjv1yJyZpg+jSKKnXXkRE+ZsaSJ/iI0IXHsONlVrveA54MS2MYe0M49sB3AC33M6wBrEUsMbmH0TX6eidLH7iSIz1RsHBKf5IIQxzPTkP7FtSO+xELvZKVuCMAgKEXsIazUP7L0Fqb4Dq6RscMbJWTSRTsbQ4GUOnkiH7yREwKmb2lwetfx5rAmsxCUQh/vCd8aRC2O441jYWtatKKexEYXXNzQHFtnSI9kJooGCivq6N9baLF2gCDBAswFbrIE1kwG7LL+mIbGxqVf7IGsa5irWaJwX0AjI5lDFVKubUudFLKp73rrIHCnpIyOqP9XjE+QRcz2IDJYDZ06Tuyvs96iwVD4j23x4T4v2i597GQ524KqysLW2vzWYIPweQp9qEiVhrpnh14sE83ujOvk/3MkfAIzLzrJ440A4+t305/XK+Z7AAhmNi3HypjSDQAmLzDeL4Pq7f9Fh80vjP4eauJdxYuDJg1RwJ2CMneMBegWQVW8B3NHxqqXCCayoGZXbPpsQGa+14UUjpmmjrLDLZJXvnZMlp2TDPbKCrvo0UKnplH90AUJWIumgUwsYGdMBj3BMeETRACk2O2TbM4nbONLaCm3LylfsCh0gpaq1+kcCkr1E0OYGSM5dG1R4liCMfYUSYmD2BgdPAiy2H2PSc2mi7P1k8lBWpMXKkTfc6Xdx7Qy2qCH3xhOxQEc9JsdPRZkfIZ0V/nuD9/dlhKQv2Lw/tSBwOpohrq6kxbaB9VOufu0x1GYrwpk0eCqWk2OtjEGssaGRVNIz4YP+TLAYnGiw4Gep5wLeYdOq4U2NcBqYv8n1RNENpBS6MDLJrv5cZ5v9UagaSDhtfOkIbIbPW3S7k1x2y7Dhi4S4EAwfS0Nfp5sk81bgm3WDAJZQiEw1aeNdfq0z8276ID+kEyeP8OcxeCYDY0jR62bFl9mCXiAT4yPKVeXVkVsNU/2oKi+k9v1s0YjDfyFMvM8e2CoKBpdNBx0ITNlsjw9+ynzuFWveJs4Ne7Q1z7L5dvpEr9VEYIEQ2msFchhGmObtKk4LpJncKq69Y1NTUiRNIQCWkpZI03PpHnS7Ccdt/KTfTsFiQV1QRjEESFOa0LJAhmQLdFB10+WHwsIiLqDj40PDGHVj1Qt6++snM/PbcVcR6a4FqAuAJJRigEDU6NDrIGj//CEhnxChyArauLThXTqjPn6JzGFtVG7hojRzgm6AKJpUdP0q++2ehYraQ1yI3+BCuwXrwgtAOnXfdmXrlocPLKI6d3vXm4MBNVP8LDwijLGkVPDOpJ49KT7I9qTWxSAsUlq//M18w7eIxmLljtLMUwJuBmst5RzgQhSDBsdOZ61pusVumhUXH1ob65NLNbtuOT8cUgITXZ7+P1V/IP0C+WbVA2r+iAHyIp4b32Y0EIGlypp/QCyyGJJBJ9Li0qoWLuxk9ITyZLm0SRddU1Sn02f+xuQ4rhxzfupAdWbXGeo942y4592eZYHxQEFzDaouOCgHjvnsqZBhdmJNPTQ3pRapsKq8gampCeStGxznfCeQoEwqA658rjRUYG2yh2gPRKTiucCIIZMdqiwyvIaa5ZSx0crqymd4+eVMotIxe4rWSTDYTIIj10RJR366kjM+mcXQfphi9XOEsN1Qy2WCKtke56myCYGVfG6EgDhOoG6cqZDnjSUamJ9NiAPOrNhj8P/yA2MYFikxJbXQQ8AWbSFx05qcSurz95xuiU+WnWlSyUMRKEoMVVtw1mIXtnF+XMCZioQ2kfZKkZmBR//pdFxVgpIS2VW3hDq3u6wOCLuReBNFBrT5x2ZU0MMezIQKq7q0UQggF3mlXkDfuAhcgxQ+CXDE1JYMNn0bTMNIphg1siLJSQkszjdm7xXXgVMHJDY5NS2+uDfQU0d98ROuD6Fll00y9loUqNIAQ97hgdoCgjSvzcxHKpWbayyQckxtNwNv6YtCQanZ1OGWkpFBkVqazNQ5ggR/0P2y0py2J7SkppQ1EJbWatLiyiXXzuQuvdDJbNvmTdxtJMECcIwYa7RgeYyLuP9TtWi4G4a+AFxEdGUHpMNMtKKdFRVM/Grqyvp/I6WwE/FM53sgHFCNhbjtf7CsuNa4QghDYYt2MNGuvPMFCgCXG681n6qWwFQXAKFs5vZCFOXM1s/hAMjrX/m1mtovkEQWgfWHr7KwvjX4yH1QzobcHgmElH1ZHA3CsrCEECZuZ/zNrCQnpYNUN6Wsh4sZY1gyUGFwQfgpjX8az3WSjX42nTl7EQxIN6Xr1Y0kUXBBXaM+vuCvg9qazOrItZl7NQzwvVITBjb+R1IPEFItkwLNjMQslf1PY6xAqOSo+C4CV8ZfS24PemsLBZHUZHFUdE20EdWIiAQQx6if0WRfyx8aT5XHaYCYIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgBCtE/w+1YThIU6fbawAAAABJRU5ErkJggg==';

                composeView.on('composeFormChanged', function (details) {
                    sdk.log('compose form changed')
                });

                composeView.on('composeViewChanged', function (details) {
                    sdk.log('compose view changed')
                });


                if (!SuppressBeatsPopup) {
                    composeView.on('attachmentAdded', function (attachment) {
                        console.log('attachment added: ' + attachment.filename);
                        DriveAccessCounter = 0;
                        var ext = attachment.filename.split('.').slice(-1)[0].toLowerCase();
                        var audioFormats = ['mp3', 'wav', 'wma', 'aac', 'm4a', 'ogg'];


                        if (audioFormats.includes(ext)) {
                            sdk.log('attachment added: ' + attachment.filename);

                            var existingLink = composeView.getContentDiv().querySelector('.gmass-music-link[data-filename="' + attachment.filename + '"]');
                            if (existingLink) {
                                sdk.log('Already prompted for attachment ' + attachment.filename);
                                return;
                            }
                            composeView.insertIntoBodyAtCursor(`<span class="gmass-music-link" data-filename="${attachment.filename}"></span>`, true, false);
                            composeView.saveDraft();
                            sdk.log('added span for attachment ' + attachment.filename);

                            var div = document.createElement('div');
                            div.innerHTML = `
                        <p style="text-align:center">
                            <img src="${musicNoteImage}">
                        </p>
                        <p>
                            GMass has detected that you've attached a music file (${attachment.filename}).
                            Would you like GMass to convert this into a trackable link so you can get better stats?
                        </p>
                        <p>
                            <a href="https://www.gmass.co/g/beats" target="_blank">Tell me more</a>
                        </p>
                        <p>
                            <a href="http://app.gmass.co/dashboard/auth?gmasskey=${encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()))}&s=other" target="_blank">Disable popup</a>
                        </p>						
                        `;



                            sdk.log('Showing modal for attachment ' + attachment.filename);
                            var modal = sdk.Widgets.showModalView({
                                el: div,
                                title: 'Want Better Music Stats?',
                                buttons: [
                                    {
                                        text: 'No thanks',
                                        type: 'SECONDARY',
                                        onClick: function () {
                                            modal.close();
                                        }
                                    },
                                    {
                                        text: 'Yes please!',
                                        type: 'PRIMARY_ACTION',
                                        onClick: function () {
                                            modal.close();
                                            convertAttachmentToLink(attachment);
                                        }
                                    }
                                ]
                            });
                        }
                    });
                }

                function convertAttachmentToLink(attachment) {

                    var div = document.createElement('div');
                    div.innerHTML = `
                        <style>
                            .g2_music_slide {
	                            animation: g2_music_slide 2s ease-in-out infinite;
                            }
                            @keyframes g2_music_slide {
	                            0% {
		                            transform: translateX(-330px) scale(0.75);
		                            opacity:0.8;
	                            }
	                            50% {
		                            transform: scale(1);
		                            opacity:1;
	                            }
	                            100% {
		                            transform: translateX(330px) scale(0.75);
		                            opacity:0.8;
	                            }
                            }

                            </style>

                            <div style="width:400px; height:250px; text-align:center; overflow:hidden">
	                            <img src="${musicNoteImage}" class="g2_music_slide" >
                            </div>
                        `;



                    var modal = sdk.Widgets.showModalView({
                        el: div,
                        title: 'Generating Music URL...',
                    });

                    sdk.log('Showing convert music link modal for attachment ' + attachment.filename);

                    var data = {
                        emailaddress: sdk.User.getEmailAddress(),
                        draftid: ComposeDraftID,
                        attachmentfile: attachment.filename
                    };
                    if (attachment.div) {
                        data.divHtml = attachment.div.outerHTML;
                        $.getJSON(BaseURL + 'music/convertDriveLinkToListeningLink', data, function (ret) {
                            if (!ret.success) {
                                div.innerHTML = `<div>Could not get file from Drive</div><div><a target="_oauth" href="` + BaseURL + `oauth/login?emailaddress=` + sdk.User.getEmailAddress() + `">Please give GMass permission to Google Drive</a></div>`;
                                if (!ret.thoughtWeHaveAccess) {
                                    modal.close();

                                    LaunchAuth(sdk.User.getEmailAddress(), 6, false);

                                    setTimeout(function () {
                                        CheckDriveAccessForMusic(attachment);
                                    }, 1000);
                                }
                                else {
                                    sdk.ButterBar.showMessage({ text: "GMass thought it had access to your Google Drive, but apparently it doesn't. Please manually give access." });
                                }
                            }
                            else {
                                composeView.insertIntoBodyAtCursor(`<p><a class="gmass-music-link" data-filename="${attachment.filename}" href="${ret.url}">${attachment.filename}</a></p>`, true, false);
                                composeView.removeAttachment(attachment.filename);
                                modal.close();
                                sdk.ButterBar.showMessage({ text: "GMass has successfully converted your Google Drive file into a trackable music link." });
                            }
                        });
                    }
                    else {
                        $.getJSON(BaseURL + 'music/convertAttachmentToListeningLink', data, function (ret) {
                            if (!ret.success) {
                                alert('There was an error.');
                            }
                            else {
                                composeView.insertIntoBodyAtCursor(`<p><a class="gmass-music-link" data-filename="${attachment.filename}" href="${ret.url}">${attachment.filename}</a></p>`, true, false);
                                sdk.log('Removing attachment ' + attachment.filename);

                                composeView.removeAttachment(attachment.filename);
                                modal.close();
                            }
                        });
                    }
                }
                function CheckDriveAccessForMusic(attachment) {

                    console.log("starting CheckDriveAccessForMusic and DriveAccessCounter=" + DriveAccessCounter);

                    DriveAccessCounter = DriveAccessCounter + 1;
                    var xmlhttpUser = new XMLHttpRequest();
                    xmlhttpUser.open("GET", BaseURL + "music/checkUserDriveAccess?emailaddress=" + sdk.User.getEmailAddress());
                    xmlhttpUser.send();
                    xmlhttpUser.onreadystatechange = function () {
                        if (xmlhttpUser.readyState == 4) {
                            UserResult = JSON.parse(xmlhttpUser.responseText);

                            if (UserResult.success || (DriveAccessCounter >= 60)) {

                                if (UserResult.success) {




                                    sdk.ButterBar.showMessage({ text: "GMass now has access to read music files from your Google Drive." });

                                    convertAttachmentToLink(attachment);

                                }
                                else {

                                    sdk.ButterBar.showMessage({ text: "You waited too long to give GMass access to Google Drive. Delete the attachment from the Message area and start over." });
                                }


                            }
                            else {
                                setTimeout(function () {
                                    CheckDriveAccessForMusic(attachment);
                                }, 1000);
                            }

                        }
                    }

                }


                if (!(App == "Inbox" && isComposeInlineReply)) {

                    var FromHandlerCount = 0;
                    var ComposeLaunchTime = new Date().getTime();



                    composeView.on('fromContactChanged', function (event) {
                        var today = new Date();
                        if (FromHandlerCount >= 1 || (today - ComposeLaunchTime) > 5000) {
                            var CurrentSubject = composeView.getSubject();
                            composeView.setSubject(CurrentSubject + " ");
                        }

                        FromHandlerCount++;
                    });

                    composeView.on('destroy', function (event) {
                        if (document.getElementById(settingsID) != null) {
                            document.getElementById(settingsID).remove();
                        }
                        sdk.log("compose destroyed");
                        clearInterval(composeView.ComposeMonitorInterval1);
                        clearInterval(composeView.ComposeMonitorInterval2);
                        ComposeInterval1Running = false;
                        ComposeInterval2Running = false;
                        clearInterval(composeView.RC1);
                        clearInterval(composeView.SMTPSettingsInterval);
                        clearInterval(composeView.saveProgressInterval);
                        clearInterval(composeView.MultiSendInterval);
                    });

                    composeView.on('presending', function (event) {
                        if (composeView.getToRecipients().length >= 10 || (composeView.getToRecipients().length > 0 && composeView.getToRecipients()[0].emailAddress.includes("recipients") && composeView.getToRecipients()[0].emailAddress.includes("@gmass.co"))) {
                            if (!confirm("Did you really mean to press the blue Gmail Send button instead of the red GMass button?\n\nPress CANCEL to stop this send.\n\nPress OK if you really did mean to press the blue Gmail Send button.")) {
                                event.cancel();
                            }
                        }

                    });

                    var SendButtonHidden = false;
                    var DisplayedToOptionsAlready = false;

                    var sendSave = localStorage.getItem("mySendSave");
                    var draftSaveSpeed = localStorage.getItem("DraftSaveSpeed");
                    var smtpServerId = localStorage.getItem("SmtpServerId");
                    var SMTP = localStorage.getItem("GMassSMTP");
                    var myNewReply = "new";
                    var myOpenTracking = localStorage.getItem("myOpenTracking");
                    var myClickTracking = localStorage.getItem("myClickTracking");
                    var SkipWeekends = localStorage.getItem("SkipWeekends");
                    if (SkipWeekends == "on") {
                        SkipWeekends = "off";
                        localStorage.setItem("SkipWeekends", "off");
                    }
                    var SkipHolidays = localStorage.getItem("SkipHolidays");
                    var myDelay = localStorage.getItem("myDelay");
                    var GMassPauseSeconds = localStorage.getItem("GMassPauseSeconds")

                    var myTestAddresses = localStorage.getItem("myTestAddresses");

                    var GMassTestSendOrDraft = localStorage.getItem("GMassTestSendOrDraft");
                    var GMassTestSequence = localStorage.getItem("GMassTestSequence");

                    var myReplyTo = localStorage.getItem("myReplyTo");
                    var myFriendlyName = "";
                    var GMassPreviewText = "";
                    var GMassImages = localStorage.getItem("GMassImages");
                    var GMassVerify = localStorage.getItem("GMassVerify");
                    var GMassAutoSpintax = localStorage.getItem("GMassAutoSpintax");
                    if (localStorage.getItem("fastSMTP")) {
                        localStorage.removeItem("fastSMTP");
                    }

                    var GMassSkipSent = localStorage.getItem("GMassSkipSent");

                    var SuppressionAggressive = localStorage.getItem("GMassSuppressionAggressive");

                    var GMassReplyMessage = 0;
                    var TriggerOpenCampaignID = localStorage.getItem("TriggerOpenCampaignID") ?? 0;
                    var TriggerClickCampaignID = localStorage.getItem("TriggerClickCampaignID") ?? 0;
                    var TriggerReplyCampaignID = localStorage.getItem("TriggerReplyCampaignID") ?? 0;

                    var TriggerOpenThreadedValue = localStorage.getItem("TriggerOpenThreaded") ?? "off";
                    var TriggerClickThreadedValue = localStorage.getItem("TriggerClickThreaded") ?? "off";
                    var TriggerReplyThreadedValue = localStorage.getItem("TriggerReplyThreaded") ?? "off";

                    var TriggerOpenDelayValue = localStorage.getItem("TriggerOpenDelay") ?? "0";
                    var TriggerClickDelayValue = localStorage.getItem("TriggerClickDelay") ?? "0";
                    var TriggerReplyDelayValue = localStorage.getItem("TriggerReplyDelay") ?? "0";

                    var GMassTriggerReplyPhrases = localStorage.getItem("TriggerReplyPhrases") ?? "";

                    var MultiSendBox = "off";
                    var MultiSendTokenIds = localStorage.getItem("GMassMultiSend") ?? "";
                    var SendDaysValue = localStorage.getItem("SendDaysValue") ?? "";
                    var SendDaysOn = localStorage.getItem("SendDaysOn") ?? "off";
                    var EndTimeBox = localStorage.getItem("GMassEndTimeBox") ?? "off";
                    var EndTime    = localStorage.getItem("GMassEndTime")    ?? "";
                    if (localStorage.getItem("GMassMultiSendUserExcludedPrimary") == "true") {
                    }
                    else {
                        var numbersArray = MultiSendTokenIds.split(',');
                        if (!numbersArray.includes('1')) {
                            MultiSendTokenIds += ",1";
                        }
                    }

                    var resultHTTPDraft;
                    var resultHTTPApplyLabel;
                    var counterMessageIDCheck;
                    var bb;
                    var GetDraftIDCounter = 0;
                    var boolForceShowSend = false;
                    var GMassDateDropdown = "Now";
                    var GMassDateTextBox = "";
                    var myListName = "";
                    var GMassPersonalization = [];
                    GMassPersonalization.push("FirstName|Friend");
                    GMassPersonalization.push("LastName");
                    GMassPersonalization.push("EmailAddress");

                    var SheetsOnlyPersonalization = [];
                    var ShowSheetRecurringOptions = false;
                    var myMaxEmails = "";
                    var myRecurEvery = "1";
                    var mySuppressionDays = "0";
                    var GMassSuppression = "";
                    var GMassRecur = "off";
                    var GMassRecurDH = "d";

                    var AdvancedStatus = "";
                    var ScheduleStatus = "";
                    var AFStatus = "";
                    var loadedSettings;

                    var ABTest;
                    var ABDecision = localStorage.getItem("ABDecision");
                    var ABPercentage = localStorage.getItem("ABPercentage");
                    var ABTimeAfter = localStorage.getItem("ABTimeAfter");
                    var ABFactor = localStorage.getItem("ABFactor");

                    var Triggers;
                    setTemplateStorage();


                    var GMassBumpSuppression = "";


                    var resultCampaigns;
                    var xmlTestAddresses = new XMLHttpRequest();
                    xmlTestAddresses.open("GET", BaseURL + "gmass/gettestaddresses?emailaddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                    sdk.log("about to fetch test addresses");
                    xmlTestAddresses.send();
                    var resultTestAddresses;

                    xmlTestAddresses.onreadystatechange = function () {
                        if (xmlTestAddresses.readyState == 4) {
                            sdk.log("DONE fetching test addresses");
                            resultTestAddresses = JSON.parse(xmlTestAddresses.responseText);


                        }
                    }
                    if (!isComposeInlineReply) {
                        var xmlReplyToAddresses = new XMLHttpRequest();
                        xmlReplyToAddresses.open("GET", BaseURL + "gmass/getreplytoaddresses?emailaddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                        sdk.log("about to fetch replyto addresses");
                        xmlReplyToAddresses.send();
                        var resultReplyToAddresses;

                        xmlReplyToAddresses.onreadystatechange = function () {
                            if (xmlReplyToAddresses.readyState == 4) {
                                sdk.log("DONE fetching replyto addresses");
                                resultReplyToAddresses = JSON.parse(xmlReplyToAddresses.responseText);
                            }
                        }
                    }
                    var AccountStatus = null;

                    var xmlAS = new XMLHttpRequest();
                    xmlAS.open("GET", BaseURL + "gmass/getaccountstatusbyemail?emailAddress=" + sdk.User.getEmailAddress(), true);
                    xmlAS.send();
                    xmlAS.onreadystatechange = function () {
                        if (xmlAS.readyState == 4) {
                            AccountStatus = JSON.parse(xmlAS.responseText);
                        }
                    }

                    if (!isComposeInlineReply && composeView.getToRecipients().length > 0) {

                        var HelperMessage = "";

                        if ((composeView.getToRecipients()[0].emailAddress.substr(composeView.getToRecipients()[0].emailAddress.length - 8) == "gmass.co") && (composeView.getToRecipients()[0].emailAddress.indexOf("-big-") == -1)) {
                            GMassLaunchedCompose = true;
                            var xmlhttpSearch = new XMLHttpRequest();
                            sdk.log("***about to call fetchemailaddresses: " + "gmass/fetchemailaddresses?alias=" + composeView.getToRecipients()[0].emailAddress);

                            xmlhttpSearch.open("GET", BaseURL + "gmass/fetchemailaddresses?alias=" + composeView.getToRecipients()[0].emailAddress + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                            xmlhttpSearch.send();
                            xmlhttpSearch.onreadystatechange = function () {
                                if (xmlhttpSearch.readyState == 4) {
                                    var SearchResults = JSON.parse(xmlhttpSearch.responseText);
                                    if (SearchResults.success) {

                                        if (sdk.User.getEmailAddress().indexOf("gmail.com") > 0) {
                                            if (Number(composeView.getToRecipients().length) > 500) {
                                                HelperMessage = " Since you're using a regular Gmail account, your sending limit is 500 emails/day, so GMass will send these emails over multiple days until they're all sent."
                                            }
                                        }
                                        else {
                                            if (Number(composeView.getToRecipients().length) > 2000) {
                                                HelperMessage = " Since you're using a Google Apps account, your sending limit is 2000 emails/day, so GMass will send these emails over multiple days until they're all sent."
                                            }
                                        }
                                        if (HelperMessage != "") {
                                            var BBDocsInfo = sdk.ButterBar.showMessage({ text: HelperMessage, time: 25000 });
                                        }

                                    }
                                    else {
                                        if (SearchResults.reason == "BadKey") {
                                            sdk.ButterBar.showMessage({ text: "We couldn't expand your alias address into the actual recipient addresses in the Compose box, but that's okay -- it will still work. You just can't see the actual addresses for now.", time: 25000 });
                                        }
                                    }
                                }
                            }
                        }
                        else if ((composeView.getToRecipients()[0].emailAddress.substr(composeView.getToRecipients()[0].emailAddress.length - 8) == "gmass.co") && (composeView.getToRecipients()[0].emailAddress.indexOf("-big-") > 0)) {


                            if (sdk.User.getEmailAddress().indexOf("gmail.com") > 0) {
                                if (Number(AliasSize(composeView.getToRecipients()[0].emailAddress)) > 500) {
                                    HelperMessage = " Since you're using a regular Gmail account, your sending limit is 500 emails/day, so GMass will send these emails over multiple days until they're all sent."
                                }
                            }
                            else {
                                if (Number(AliasSize(composeView.getToRecipients()[0].emailAddress)) > 2000) {
                                    HelperMessage = " Since you're using a G Suite account, your sending limit is 2000 emails/day, so GMass will send these emails over multiple days until they're all sent."
                                }
                            }

                        }
                        else {
                            sdk.log("***fetchemailaddresses NOT BEING CALLED");
                        }

                    }
                    else {
                        sdk.log("***fetchemailaddresses NOT BEING CALLED because to field length is " + composeView.getToRecipients().length);
                    }

                    var GotState = false;
                    var IsScheduled = false;
                    var IsSaved = false;
                    var HasCampaign = false;
                    var IsProcessing = false;
                    var IsPaused = false;
                    var IsEdited = false;
                    var AllDone = false;
                    var ComposeDraftID = "";
                    var NuclearBB;
                    var PersonalizedAttachments = false;
                    var PersonalizedAttachmentFields = "";
                    composeView.getCurrentDraftID().then(function (draftID) {
                        if (ComposeTagger == "x" && (draftID == null || draftID == undefined)) {
                            sdk.log("block 1");

                            sdk.log("GM: getCurrentDraftID resolved to NULL, meaning blank compose. gotstate=true");
                            GotState = true;

                            if (ToFieldMonitor == false) {
                                MonitorToFieldForListAddress();
                            }

                            composeView.getDraftID().then(function (draftID) {

                                ComposeDraftID = draftID;
                                sdk.log("GM: Draft ID retrieved after user typed stuff =" + ComposeDraftID);

                            });

                            MonitorToFieldForHidingSend(composeView, GMassLaunchedCompose);
                        }
                        else {

                            if (ComposeTagger != "x") {
                                var objFlag = { done: false };
                                if (Array.isArray(ComposeTagger)) {
                                    composeView.setToRecipients(ComposeTagger, objFlag);
                                }
                                else {
                                    composeView.setToRecipients([ComposeTagger], objFlag);
                                }
                                sdk.log("***TO address set");
                            }
                            var setToCheck = setInterval(function () {
                                if (ComposeTagger == "x" || objFlag.done == true) {
                                    clearInterval(setToCheck);
                                    if (ToFieldMonitor == false) {
                                        MonitorToFieldForListAddress();

                                    }
                                }
                                if (LogIntervals) { sdk.log("setToCheck composetagger interval run"); }
                            }, 1000);




                            console.log("block 2");

                            if (draftID == null || draftID == undefined) {
                                composeView.getDraftID().then(function (draftID) {


                                    ComposeDraftID = draftID;
                                    sdk.log("GM: Draft ID retrieved after promise met =" + ComposeDraftID);
                                });
                            }
                            else {
                                ComposeDraftID = draftID;
                                sdk.log("GM: Draft ID retrieved just cause it's new gmail/inbox" + ComposeDraftID);
                            }

                            var WaitForDraftIDCounter = 0;
                            var WaitForDraftID = setInterval(function () {

                                console.log("running once");
                                WaitForDraftIDCounter++;


                                if (WaitForDraftIDCounter % 20 == 0) {
                                    console.log("going nuclear, putting text in Subject to trigger draft id");
                                    NuclearBB = sdk.ButterBar.showMessage({ text: "Wait a few more seconds please. The GMass button won't work yet on this Compose window. Fixing it...", time: 10000 });
                                    if (composeView.getSubject().includes("Replace this Subject with your own!")) {
                                        composeView.setSubject(composeView.getSubject() + " :)");
                                    }
                                    else {
                                        composeView.setSubject("Replace this Subject with your own!");
                                    }
                                }

                                if (WaitForDraftIDCounter == 20) {
                                }

                                if (ComposeDraftID != "") {

                                    if (typeof NuclearBB != "undefined") {
                                        NuclearBB.destroy();
                                        sdk.ButterBar.showMessage({ text: "Fixed! You may proceed...", time: 10000 });
                                    }

                                    clearInterval(WaitForDraftID);
                                    GetDraftState('', true);
                                }

                                if (LogIntervals) { sdk.log("composedraftid interval run"); }
                            }, 500);
                        }




                    });




                    composeView.SMTPSettingsInterval = setInterval(function () {

                        if (composeView.getToRecipients().length == 1 && composeView.getToRecipients()[0].emailAddress.toLowerCase() == "smtp@gmass.co" && composeView.getSubject().substring(0, 3) == "set") {
                            composeView.setBodyHTML("SMTP Server: <br>Port: 25<br>Username: <br>Password: <br>");
                            clearInterval(composeView.SMTPSettingsInterval);
                        }

                        if (LogIntervals) { sdk.log("smtp form interval run"); }

                    }, 3000);
                    var SettingsFormed = false;
                    var TestButton;
                    var SettingsBox = document.createElement("div");

                    SettingsBox.id = settingsID;
                    sdk.log("settings box created with id " + settingsID);
                    CreateSettingsBox();

                    function Reposition(timer) {
                        var x = 0;
                        var intervalID = setInterval(function () {
                            if (SettingsBox.dropdown) {
                                SettingsBox.dropdown.reposition();
                                if (++x >= timer / 10) {
                                    window.clearInterval(intervalID);
                                }
                            }
                            if (LogIntervals) { sdk.log("Reposition interval run"); }
                        }, 10);

                        composeView.on('destroy', () => clearInterval(intervalID));
                    }

                    var showSendButton = composeView.addButton({
                        html: '&#8942;',
                        type: "SHOW_SEND",
                        style: "",
                        title: 'Show send button',
                        beforeSendButton: true,
                        classList: ["GmassShowSend"],
                        onClick: function (event2) {
                            showSendButton.style.display = 'none';
                            composeView.showSendButton();
                            boolForceShowSend = true;
                        }
                    });

                    showSendButton.style.display = 'none';
                    composeView.sendButtonToggle = showSendButton;
                    composeView.addButton({
                        title: "GMass Settings",
                        type: "SEND_ACTION",
                        style: 'border-left: 1px solid #a10000',
                        orderHint: 1,
                        iconClass: 'inboxsdk__button_icon ' + (App.includes("Gmail") ? "GmailClassSettings2" : "InboxClassSettings"),
                        hasDropdown: true,
                        onClick: function (event2) {

                            sdk.log("***settings arrow clicked");
                            if (document.getElementById(settingsID) && SettingsFormed == true && AccountStatus) {
                            }
                            event2.dropdown.on('destroy', () => {
                                sdk.log("***settings DESTROY called");
                                saveFormData();
                                saveProgress();

                                clearInterval(clickedSettings);
                            });
                            var clickedSettings = setInterval(function CheckGotState() {
                                if (SettingsFormed == true && AccountStatus) {
                                    sdk.log("settingsformed is true and AccountStatus loaded");
                                    sdk.log("about to clear interval for settings box");
                                    clearInterval(clickedSettings);
                                    var gmassSettings = SettingsBox.getElementsByClassName('g2_settings');
                                    if (gmassSettings.length > 0)
                                        gmassSettings[0].style.display = '';

                                    event2.dropdown.el.appendChild(SettingsBox);
                                    SettingsBox.dropdown = event2.dropdown;
                                    if (LoadedCampaigns == false) {
                                        LoadedCampaigns = true;
                                        LoadCampaigns();
                                    }

                                    if (!isComposeInlineReply && !LoadedMultiSendAccounts) {
                                        LoadMultiSendAccounts(true);
                                    }

                                    sdk.log('settings box added to document ***************');

                                }

                                if (LogIntervals) { sdk.log("clicked settings interval run, SettingsFormed = " + SettingsFormed.toString() + "  AccountStatusRetrieved = " + (AccountStatus != null)); }
                            }, 100);
                        }
                    });
                    function getBumpSettings() {
                        
                        const ret = [];
                        const ordinals = ['First', 'Second', 'Third', 'Fourth',
                            'Fifth', 'Sixth', 'Seventh', 'Eighth'];

                        let bump = 1;
                        while ($(SettingsBox).find(`#${settingsID}${bump}BumpBox`).prop('checked')) {
                            let days = parseInt($(SettingsBox).find(`#${settingsID}${bump}BumpDays`).val(), 10);
                            if (isNaN(days)) days = 0;

                            const campaignId = $(SettingsBox)
                                                .find(`#${settingsID}${bump}BumpCustom`)
                                                .val() ?? '0';

                            const bumpAction = $(SettingsBox).find(`#${settingsID}${bump}BumpAction`).val();
                            const hasSetTime = $(SettingsBox).find(`#${settingsID}${bump}bump`).hasClass('set-time');
                            const bumpTime = true
                                ? $(SettingsBox).find(`#${settingsID}${bump}BumpTime`).val()
                                : null;

                            const addedText = $(SettingsBox).find(`#${settingsID}${bump}BumpAddedText`).val();
                            const sameNew = $(SettingsBox).find(`#${settingsID}${bump}SameNew`).val();

                            let bumpChoice = 't';
                            if ($(SettingsBox).find(`#${settingsID}${bump}BumpChoicec`).prop('checked')) {
                                bumpChoice = 'c';
                            }

                            ret.push({
                                bump,
                                enabled: true,
                                sameNew,
                                addedText,
                                days,
                                campaignId,
                                action: bumpAction,
                                choice: bumpChoice,
                                time: bumpTime,
                                ordinal: ret.length < ordinals.length ? ordinals[ret.length] : null
                            });

                            bump++;
                        }
                        return ret;
                    }
                    function ensureBumps(min) {
                        if (typeof (min) == 'undefined')
                            min = 1;
                        var wrapper = $(SettingsBox).find('.bumps-wrapper');
                        var enabledBumps = wrapper.find('.gmass-enable-bump:checked');
                        var existingBumps = wrapper.find('.gmass-bump-stage');
                        if (typeof GMASS_MAX_FOLLOWUP_STAGES !== 'undefined' && existingBumps.length >= GMASS_MAX_FOLLOWUP_STAGES) {
                            if (typeof sdk !== 'undefined' && sdk.ButterBar && sdk.ButterBar.showMessage) {
                                sdk.ButterBar.showMessage({ html: 'You can only add up to ' + GMASS_MAX_FOLLOWUP_STAGES + ' auto follow-up stages at this time.', time: 8000, className: 'redbb' });
                            } else {
                                alert('You can only add up to ' + GMASS_MAX_FOLLOWUP_STAGES + ' auto follow-up stages at this time.');
                            }
                            return;
                        }

                        var requiredCount = Math.max(min, enabledBumps.length + 1);
                        if (existingBumps.length >= requiredCount)
                            return;

                        var addedCampaignSelects = [];
                        for (var i = 0; i < requiredCount - existingBumps.length; i++) {

                            var index = existingBumps.length;
                            var bump = index + 1;

                            var template = `
                                            <div class="gmass-bump" data-bump="${bump}" id="${settingsID}${bump}bump">
                                                <div class="gmass-bump-stage">Stage ${bump}:</div>
                                                <label class="g2_checkbox" style="float:left; margin-right:3px; padding-top:2px">
                                                    <input type="checkbox" class="gmass-enable-bump" id="${settingsID}${bump}BumpBox" data-oval="stage ${bump}">
                                                    <span></span>
                                                </label>
                                                If
                                                <select class="g_bump_action" name="${bump}BumpAction" id="${settingsID}${bump}BumpAction">
                                                <option value="r">No Reply</option>
                                                <option value="o">No Open</option>
                                                <option value="c">No Click</option>
                                                <option value="s">No Reply or Click</option>
                                                <option value="a">Everyone</option>
                                                </select>
                                                <span>after</span>
                                                <input type=text size=2 class="g_bump_days" id="${settingsID}${bump}BumpDays" name="${bump}BumpDays" value="">
                                                days
                                                    <a href=# class="g_bump_set_time">(set time)</a>
                                                    <a href=# class="g_bump_dont_set_time">(don\'t set time)</a>
                                                <div class="gmass-follow-up-settings">
                                                    <div class="g_bump_set_time">
                                                        at
                                                        <input type=text class="g_bump_time" data-time="12:00pm" id="${settingsID}${bump}BumpTime" name="${bump}BumpTime">
                                                    </div>
                                                    <label class="g_radio">
                                                        <input type="radio" id="${settingsID}${bump}BumpChoicet" name="${settingsID}${bump}BumpChoice" value="t" checked>
                                                        <span style="font-size:8pt">Send text above original:</span>
                                                    </label>
                                                <br />
                                                <textarea name="${settingsID}${bump}BumpAddedText" id="${settingsID}${bump}BumpAddedText" class="g_bump_add_text" cols=34 rows=7></textarea>
                                                <div>
                                                    <label class="g_radio">
                                                        <input type="radio" id="${settingsID}${bump}BumpChoicec" name="${settingsID}${bump}BumpChoice" value="c">
                                                        <span id="${settingsID}CM${index}" style="font-size:8pt">
                                                            Send rich-text email in
                                                            <select name="${bump}SameNew" id="${settingsID}${bump}SameNew" class="g_discreet_select">
                                                                <option value="same">same</option>
                                                                <option value="new">new</option>
                                                            </select>
                                                            thread
                                                        </span>
                                                    </label>
                                                    <button class="g2_add_message" data-stage="${index + 1}" title="Create a new message"></button>
                                                    <div class="BumpCustomDiv" style="margin-top: 10px;">
                                                        <select style="width: 258px; display:inline-block; font-size:8pt" class="g-campaign-select" id="${settingsID}${bump}BumpCustom" name="${bump}BumpCustom">
                                                            <option></option>
                                                        </select>
                                                        <button class="g2_view_message" title="View the selected message" style="display:none"></button>
                                                        <button class="g2_edit_message" title="Edit the selected message" style="display:none"></button>
                                                        <button class="g2_refresh_messages" title="Refresh the message list"></button>
                                                    </div>
                                                </div>`;
                            if (IsScheduled && HasCampaign) {
                                template += `<div style="text-align: right; margin-top: 15px;"><button style="color: white; background-color: #4837a1; padding: 6px;" type="button" class="send-test g2_bump_ondemand" data-stage=${bump}>Send Stage ${bump} Now</button></div>`;
                            }
                            template += `</div></div>`;

                            wrapper.append(template);
                            var bumpDiv = wrapper.find(`[data-bump="${bump}"]`);

                            var enableCheckbox = bumpDiv.find('.gmass-enable-bump');
                            enableCheckbox.on('change', function () {
                                if (this.checked)
                                    bumpDiv.find('.gmass-follow-up-settings').slideDown('fast');
                                else
                                    bumpDiv.find('.gmass-follow-up-settings').slideUp('fast');
                                if (this.checked) {
                                    if (index == 0 && !isComposeInlineReply) {
                                        document.getElementById(settingsID + 'send-test-sequence').disabled = false;
                                    }

                                    ensureBumps();
                                }
                                else {

                                    if (!isComposeInlineReply) {
                                        document.getElementById(settingsID + 'send-test-sequence').disabled = true;
                                    }
                                }
                            });
                            var campaignSelect = bumpDiv.find('select[name$="BumpCustom"]');
                            addedCampaignSelects.push(campaignSelect);
                            convertCampaignSelectToSelect2(campaignSelect, settingsID, {
                                templateResult: formatCampaignDropDownItem,
                                templateSelection: formatCampaignTextResult,
                                placeholder: "Select message"
                            });

                            campaignSelect.on('change', function () {
                                var div = $(this).parent('div');
                                var viewButton = div.find('.g2_view_message');
                                viewButton.toggle($(this).val() != '');

                                var editButton = div.find('.g2_edit_message');
                                editButton.toggle($(this).val() != '');
                            });
                            var radioT = bumpDiv.find('[name$="BumpChoice"][value="t"]');
                            var radioC = bumpDiv.find('[name$="BumpChoice"][value="c"]');
                            var customDiv = bumpDiv.find('.BumpCustomDiv')[0];
                            var addedText = bumpDiv.find('.g_bump_add_text')[0];
                            radioT.on('change', function () {
                                if (this.checked) {
                                    customDiv.style.display = 'none';
                                    addedText.style.display = 'block';
                                }
                            }).trigger('change');
                            radioC.on('change', function () {
                                if (this.checked) {
                                    addedText.style.display = 'none';
                                    customDiv.style.display = 'flex';
                                }
                            });
                            var defaults = getBumpDefaults();
                            var d = defaults[index];
                            if (d) {
                                bumpDiv.find('.g_bump_days').val(d.days)
                                bumpDiv.find('.g_bump_add_text').val(d.addedText);
                                if (d.time) {
                                    bumpDiv.find('.g_bump_time').val(d.time);
                                    bumpDiv.addClass('set-time');
                                }
                                else {
                                    bumpDiv.removeClass('set-time');
                                }

                                if (d.action)
                                    bumpDiv.find('.g_bump_action').val(d.action);

                                    if (d.campaignId && d.campaignId > 0) {
                                        const startTime  = Date.now();
                                        const intervalId = setInterval(() => {
                                            if (resultCampaigns && resultCampaigns.campaigns) {
                                                const currentVal = campaignSelect.val();
                                                if (!currentVal) {
                                                    ensureCampaignSelectOptions();
                                                    campaignSelect.val(d.campaignId);
                                                };
                                                clearInterval(intervalId);
                                                return;
                                            }
                                            if (Date.now() - startTime >= 60_000) {
                                                clearInterval(intervalId);
                                                sdk.log('Polling aborted after 1 minute with no data.');
                                                return;
                                            }

                                            if (LogIntervals) {sdk.log('***bump custom dropdown interval run***');}
                                        }, 100);
                                        composeView.on('destroy', () => clearInterval(intervalId));
                                        
                                    }


                                if (d.sameNew) {
                                    var ddSameNew = bumpDiv.find('select[name$="SameNew"]');
                                    ddSameNew.val(d.sameNew);
                                }
                                if (d.choice == 'c') {
                                    radioC.prop('checked', true).trigger('change');
                                }
                            }

                            const $timeField = $(SettingsBox).find(`#${settingsID}${bump}BumpTime`).first();
                            if ($timeField.length) {
                                GMass.timePicker($timeField[0], {
                                    message: '<p>Use the arrows to select a time. Times are in your local timezone.</p>'
                                });
                            }


                            const $addTextField = $(SettingsBox).find(`#${settingsID}${bump}BumpAddedText`).first();
                            if ($addTextField.length) {
                                GMass.snippets($addTextField[0], {
                                    snippets: (GMassPersonalization.length > 0
                                        ? GMassPersonalization
                                        : ['FirstName|Friend', 'LastName', 'EmailAddress']),
                                    helpUrl: 'https://www.gmass.co/g/personalization',
                                    codes: (GMassPersonalization.length > 0
                                        ? ConditionalLogicAlter(GMassPersonalization)
                                        : snippetsDefaultCodeMenu),
                                    codeHelpUrl: 'https://www.gmass.co/g/cl'
                                });
                            }

                        }
                        ensureCampaignSelectOptions(addedCampaignSelects);
                    }

                    var cachedCampaignOptionsHtml = null;
                    function ensureCampaignSelectOptions(addedSelects, doReplyMessage) {
                        if (resultCampaigns == null || resultCampaigns.campaigns == null)
                            return;
                        if (cachedCampaignOptionsHtml == null) {
                            var tmp = document.createElement('select');
                            for (i = 0; i < resultCampaigns.campaigns.length; i++) {
                                tmp.add(sentCampaignToOption(resultCampaigns.campaigns[i]));
                            }
                            cachedCampaignOptionsHtml = tmp.innerHTML;
                        }

                        var campaignOptionsHtml = cachedCampaignOptionsHtml;
                            if (typeof (addedSelects) != 'undefined') {
                            addedSelects.forEach(dd => {
                                var currentValue = $(dd).val();
                                $(dd)[0].innerHTML = campaignOptionsHtml;
                                $(dd).val(currentValue);
                            });
                            return;
                        }

                        $(SettingsBox).find('.g-campaign-select, [name$="BumpCustom"]').each(function () {
                            const $el          = $(this);
                            const currentValue = $el.val();
                            if ($el[0].name == 'ReplyMessage') {
                                if (doReplyMessage) {
                                    this.innerHTML += campaignOptionsHtml;
                                }
                            }
                            else {
                            this.innerHTML = campaignOptionsHtml;
                            }
                            $el.val(currentValue);
                            const stage = parseInt($el.attr('name'), 10);
                            if (!isNaN(stage)) {
                                displayEyeAFDropdown(stage);
                            }
                        });


                        var additionalSelects = [
                            document.getElementById(settingsID + "TriggerOpenCampaign"),
                            document.getElementById(settingsID + "TriggerClickCampaign"),
                        ];
                        additionalSelects.forEach(dd => {
                            if (dd != null && dd.options.length < 2) {
                                dd.innerHTML += campaignOptionsHtml;
                            }
                        })

                        if (!isComposeInlineReply) {
                            var ddSuppression = document.getElementById(settingsID + "suppression");
                            if (ddSuppression != null && ddSuppression.options.length < 2) {
                                ddSuppression.innerHTML += campaignOptionsHtml;
                            }
                        }
                        sdk.log("done populating campaign dropdowns");

                    }
                    function sentCampaignToOption(campaign) {
                        var CampaignNameSubject = campaign.campaignName;
                        var CampaignNameFriendly = campaign.friendlyName;

                        var myoption = document.createElement("option");
                        myoption.text = (CampaignNameFriendly == null ? "" : "[" + CampaignNameFriendly + "] ") + (CampaignNameSubject || "NO SUBJECT AVAILABLE");
                        myoption.value = campaign.campaignID;
                        myoption.setAttribute("subjectName", (CampaignNameSubject || "NO SUBJECT AVAILABLE"));
                        myoption.setAttribute("friendlyName", (CampaignNameFriendly || ""));
                        myoption.setAttribute("theCount", campaign.Count);
                        myoption.setAttribute("HasBumps", campaign.HasBumps);
                        myoption.setAttribute("IsShared", campaign.IsShared);
                        return myoption;
                    }

                    function ConditionalLogicAlter(arraySheetsFields) {
                        var arrayClone = arraySheetsFields.map((x) => x.replace('|Friend', ''));

                        var arrayFinal = arrayClone.map((x) => '<span>If Then</span>If ' + (x.includes(" ") ? 'var("' + x + '")' : x) + '="X" Then');

                        var arrayIfThenElse = arrayClone.map((x) => 'IfThenElse(' + x + '="X", "You are X.", "You are not X.")');

                        arrayFinal.push("<span>Else</span>Else");
                        arrayFinal.push('<span>Else If</span>Else If ' + arraySheetsFields[0] + '="X" Then');
                        arrayFinal.push("<span>End If</span>End If");

                        arrayFinal.push("<span>A/B Test</span>spin}}Hi{{variation}}Hello{{variation}}Hey{{end spin");
                        return arrayFinal;
                    }

                    function CreateSettingsBox() {

                        var defaultSmtpServerIdFromServer = 0;

                        SettingsFormed = false;

                        loadFormData();

                        sdk.log("CreateSettingsBox called");
                        clearInterval(composeView.RC1);
                        var SettingsInterval = setInterval(function () {

                            if (GotState == true) {
                                if (document.getElementById(settingsID) == null) {
                                    document.body.appendChild(SettingsBox);
                                }

                                if (LogIntervals) { sdk.log("about to clear interval and start forming settings box"); }
                                clearInterval(SettingsInterval);

                                var FriendlyNamePreviewSections = `<div style="margin-top:1em">
                                            Preview Text:
                                            <br>
                                            <input size="32" maxlength="278" class="g_friendly_name" placeholder="${(IsScheduled ? "none" : "Set optional preview text")}" value="${GMassPreviewText}" type="search" data-oval="preview text set" id="{settingsID}PreviewText">
                                        </div>
                                        <div style="margin-top:1em">
                                            Friendly Name:
                                            <br>
                                            <input size="32" class="g_friendly_name" placeholder="${(IsScheduled ? "none" : "Choose a friendly campaign name")}" value="${myFriendlyName}" type="search" data-oval="friendly name set" id="{settingsID}friendlyname">
                                        </div>`;


                                var OptionsBox = '<div class="g2_settings" id="' + settingsID + 'bigdiv" style="display:none; background: #FFFFFF; overflow-y: auto;">'

                                OptionsBox += '<div id="topstatusarea" style="padding-right: 10px; display: flex;background-color:  rgb(25, 0, 63);flex; justify-content: flex-end"> \
									<div class="g2_status" id="' + settingsID + 'AccountStatusDiv" style="display: inline-block; padding-bottom: 2px; padding-left: 6px; padding-right: 6px; border-radius: 8px; font-size: 8pt;">'
                                OptionsBox += 'Please wait...' + '</div><div class="g2_guide"><a style="text-decoration: none" href="http://www.gmass.co/blog/users-guide-to-the-gmass-settings-box/" target="_gmass">?</a></div></div>';

                                if (!isComposeInlineReply) {
                                    OptionsBox += '<div class="g2_tools">';
                                    OptionsBox += '<button type="button" class="GMassFieldWordzen" id="' + settingsID + 'SeedListButton"><span>Spam Solver</span></button><button type="button" class="" id="' + settingsID + 'LinkChecker"><span>Link Checker</button><button type="button" class="" id="' + settingsID + 'Analyzer"><span>Email Analyzer</button></div>';
                                }
                                if (!isComposeInlineReply) {
                                    OptionsBox = OptionsBox + `
                                        <div class="g2_send_test">
                                                <span>Send Test Email:</span>
                                                <div style="display: flex;">
                                                    <select style="width: 100%" multiple="multiple" id="${settingsID}TestEmailValue"></select>
                                                    <div style="display: flex;position: relative;" id="twopartbutton">
													<button style="padding-left: 6px;padding-right:  6px; width:110px;" type="button" class="send-test" id="${settingsID}TestEmailButton">Send Test</button>
                                                    <button type="button" class="send-test-options" ></button>
											
														<div class="g_send_test_options">

															<label style="display: block" class="">
																<input type="radio" [SENDTESTSEND] value="send"  name="${settingsID}send-test-type" id="${settingsID}send-test-type-send">
																<span>Send email</span>
															</label>
															<label style="display: block" class="">
																<input type="radio" [SENDTESTDRAFT] value="draft" name="${settingsID}send-test-type" id="${settingsID}send-test-type-draft">
																<span>Create Draft</span>
															</label>
															<hr>
															<label style="display: block" class="">
																<input type="checkbox" [SENDTESTSEQUENCE] value="on" name="${settingsID}send-test-sequence" id="${settingsID}send-test-sequence">
																<span>Send all stages</span>
															</label>


														</div>
													</div>
                                                </div>

                                        </div>
                                    `;

                                }

                                if (isComposeInlineReply) {
                                    OptionsBox = OptionsBox + '<div class="g_tools_reply"><p>You can use the "GMass" button, instead of "Send", on individual emails and replies, to take advantage of scheduling/tracking.</p></div>'
                                }

                                OptionsBox = OptionsBox + `
                                        <div class="g_prior_content">
                                            <div style="display:flex; justify-content: space-between; align-items:center; margin:0;">
                                                <div style="margin:0">Templates:</div>
                                                <div style="display:flex; gap: 1em;">
                                                    <a class="g_message_gpt" title="Create a message with ChatGPT" href="#">
                                                        <img width=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBUExURbDkznLPqEXAjSe2exivce3384HUsie4fBewcRe1dBi6dxi8eRi+eqDexBeychi7eBnCfRnDfRavcGLKnxexcRm/e1PSnozhvqjoznDarv7//+L378Xw3v///+H37zfLjTbLjcTw3hrDfXHarlTSnnPPqP7//kbAjSi2fBmvcgAAAJu4iLMAAAArdFJOU////////////////////////////////////////////////////////wAjyafQAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABiElEQVQ4T4VT13bCMAx1WA4hEMTwQHYrKF35/w+sZJlxTh/Qg8e9srbNeBfTTKaz2XTSPGN1ny9su+xWfb/qlq1dzCtc6bXdDFuosh02dq240s2uq1SVbtcUotD7Q1/hu/SH/Y1uDkfFnA9RTwDHg7xner3Tt+6EKWR05cLvd+zfjHNb/b4lXhzmjPgu987OmV5s5Ax0Thcgn5OnGJTfLJi2gxx9zh+8VNMeZR3saEwr+Ybs8xWyB4iiQidR27bGfC5FMTv4ugICpeR8DvTGigDLxnxLYJGjEtpjYpzOmEuC3cT8rHgPSrNx8sgKXtwArKbmV5K+vRaMTVxrbP1MaWLfMSmGEPEiQKGLcdZ+2BUakjhn4yU0SZtLwQpY6UyMcmiaWEAO17uUCAods6CcmJYlstuIUrPy2pfEpCxaVNJMuCMYpbblJkWtLWHekUtFK4WLQNqS2lA6Zw5PAgrcOhFt6H0cgAgxcPDatToOT8ME3Gqv5GOYXo3iq0F+9Q1efSKR/19wHP8ApGpQLT6eEuAAAAAASUVORK5CYII=">
                                                    </a>
                                                    <a style="text-decoration: none;font-size: 12px;padding-top: 3px;" class="g_edit_html" href="#">HTML</a>
                                                </div>
                                            </div>
                                                <div style="overflow: hidden">
                                                    <select data-placeholder="Select Past Email" class="g-campaign-select" id="` + settingsID + `ContentDD"><option></option></select>
                                                </div>
                                         </div>`;
                                if (GMassPersonalization.length > 0) {

                                    OptionsBox = OptionsBox + '<div class="g_personalize"><div>Personalize:</div> <select id="' + settingsID + 'Personalize"><option></option>';
                                    var arrayFields = GMassPersonalization;
                                    if (arrayFields.length > 0) {
                                        for (i = 0; i < (arrayFields.length); i++) {
                                            OptionsBox = OptionsBox + '<option value="{' + arrayFields[i] + '}" class="GMassField">' + arrayFields[i] + '</option>';
                                        }
                                    }
                                    OptionsBox = OptionsBox + '</select></div>';

                                }
                                var composeViewElement = composeView.getElement();
                                $(composeViewElement).find('[name="subjectbox"], [contenteditable="true"]').each(function () {
                                    GMass.snippets(this, {
                                        snippets: (GMassPersonalization.length > 0 ? GMassPersonalization : ['FirstName|Friend', 'LastName', 'EmailAddress']),
                                        helpUrl: 'https://www.gmass.co/g/personalization',
                                        codes: (GMassPersonalization.length > 0 ? ConditionalLogicAlter(GMassPersonalization) : snippetsDefaultCodeMenu),
                                        codeHelpUrl: 'https://www.gmass.co/g/cl'
                                    });
                                });
                                var modal;
                                var btnSheets = $('<div></div>')
                                    .addClass('pick-recipients-button pick-sheets')
                                    .attr('title', "Connect to an email list in a Google Sheet.")
                                    .html('<img src="' + BaseURLCDN + 'Extension2019Images/google_sheet_1.png"><span>From a Google Sheet</span>')
                                    .on('click', function () {
                                        modal.close();
                                        importComposeView = composeView;
                                        sdk.ButterBar.showMessage({ text: "Checking Google Sheets permissions...", time: 5000 });
                                        CheckAuthSheets(true);
                                    });

                                var btnCampaign = $('<div></div>')
                                    .addClass('pick-recipients-button pick-campaign')
                                    .attr('title', "Connect to a previous campaign.")
                                    .html('<img src="' + BaseURLCDN + 'Extension2019Images/campaign.png"><span>From another campaign</span>')
                                    .on('click', function () {
                                        modal.close();
                                        importComposeView = composeView;
                                        LaunchFollowup();
                                    });

                                var btnLists = $('<div></div>')
                                    .addClass('pick-recipients-button pick-list')
                                    .attr('title', "Select a list from your account.")
                                    .html('<img src="' + BaseURLCDN + 'Extension2019Images/from_list2.png"><span>From a List</span>')
                                    .on('click', function () {
                                        modal.close();
                                        importComposeView = composeView;
                                        ShowListSelector();
                                    });

                                var modalDiv = document.createElement('div');

                                $(modalDiv).css({
                                    "display": "flex",
                                    "flex-wrap": "wrap",
                                    "justify-content": "center",
                                    "gap": "1em"
                                });

                                $(modalDiv)
                                    .append(btnSheets)
                                    .append(btnCampaign)
                                    .append(btnLists);
                                var toTextBox = $(composeViewElement).find('textarea, [name="to"] input').first();
                                var recipientNode = toTextBox.parent().find('span[data-tooltip], .aIa.aFw').first();
                                if (recipientNode.length == 0) {
                                    var fromDrop = $(composeViewElement).find('div[role="button"][aria-haspopup="true"]').first();
                                    var tr = fromDrop.parents('tr');
                                    recipientNode = tr.find('span[data-tooltip]').first();
                                }
                                if (recipientNode.length > 0) {
                                    var form = recipientNode.parents('form').first();

                                    var svgicon = `<svg fill="gray" version="1.0" xmlns="http://www.w3.org/2000/svg"
                                     width="20px" height="20px" viewBox="0 0 103.000000 103.000000"
                                     preserveAspectRatio="xMidYMid meet">
                                     <style>

                                    svg:hover {
                                    	cursor: pointer;
                                      fill: #c42329;
                                    }</style>
                                    <g transform="translate(0.000000,103.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path d="M159 1016 c-57 -20 -97 -53 -126 -104 l-28 -47 0 -350 c0 -339 1
                                    -351 22 -390 24 -46 54 -75 103 -101 32 -17 66 -19 365 -22 240 -2 342 0 374
                                    9 59 17 135 90 150 144 14 51 15 666 1 715 -13 47 -63 106 -113 133 -41 21
                                    -52 22 -377 24 -257 2 -343 0 -371 -11z m438 -208 c70 -69 81 -103 37 -114
                                    -21 -6 -34 1 -73 40 l-47 46 -82 -83 -82 -82 83 -83 82 -82 64 64 64 65 -73 3
                                    c-76 3 -100 17 -87 52 9 24 272 24 281 0 12 -31 7 -349 -6 -362 -18 -18 -123
                                    -15 -139 4 -19 23 1 48 42 54 l34 5 3 93 c1 50 -1 92 -5 92 -5 0 -44 -36 -88
                                    -80 -44 -44 -84 -80 -90 -80 -6 0 -46 36 -90 80 -44 44 -82 80 -85 80 -3 0 -4
                                    -42 -2 -94 l3 -95 37 -3 c40 -3 54 -27 32 -53 -15 -18 -121 -20 -138 -3 -8 8
                                    -12 63 -12 182 l0 171 122 122 c68 68 129 123 138 123 8 0 43 -28 77 -62z"/>
                                    </g>
                                    </svg>`;

                                    var importButton = $('<div style="line-height: 0px; float: none; display: inline-block; vertical-align: middle;"></div>')
                                        .html(svgicon)
                                        .attr('title', "Connect to an email list in a Google Sheet or past campaign.")
                                        .attr('id', "recipbutton")
                                        .on('click', function () {
                                            modal = sdk.Widgets.showModalView({
                                                el: modalDiv,
                                                title: 'How do you want to add recipients?',
                                                buttons: [
                                                    {
                                                        text: 'Cancel',
                                                        type: 'SECONDARY',
                                                        onClick: function () {
                                                            modal.close();
                                                        }
                                                    },
                                                    {
                                                        text: 'What is this?',
                                                        type: 'SECONDARY',
                                                        onClick: function () {
                                                            window.open("https://www.gmass.co/g/workflow");
                                                        }
                                                    }
                                                ]
                                            });
                                        });

                                    if (form.find('#recipbutton').length == 0) {
                                        importButton.addClass('inline-reply');
                                        if (form.find('div[name="to"]').length == 1) {
                                            importButton.css({ float: 'right', 'margin-right': '5px', 'margin-top': '8px' });
                                            form.find('div[name="to"]').prepend(importButton);
                                            form.find('div[name="to"] input').focus();
                                        } else {
                                            recipientNode.next().after(importButton);
                                        }
                                    }
                                    else {
                                        form.find('[name="subjectbox"]').focus();
                                        form.find('[name="to"]').focus();
                                    }
                                } else {
                                    console.log('could not find recipients node');
                                    console.log(composeViewElement);
                                }
                                OptionsBox += `
                                <div class="g_unsubscribe">
                                    <a class="GMassFieldUnsub">Unsubscribe Link</a>
                                    <a id="unsubcopy">
                                        <img style="vertical-align: middle;" src="${BaseURLCDN}images/page_white_copy.png" alt="Copy to clipboard">
                                    </a>
                                </div>`;
                                OptionsBox = OptionsBox + (hideSomeSettings ? "<div style='display: none' id='{settingsID}most_settings'>" : "") +
                                    '<div class="g2_settings_accordions">Settings:</div>';
                                OptionsBox += `
                                <div class="g2_tracking g_accordian">
                                    <div class="g_accordian_title">
                                        <span>
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExUReDh4p+jpouPk7S3usrMzklQV19la3V6f9/g4fb29vX19UpRWMnMzmBmbAAAANp0qb4AAAAPdFJOU///////////////////ANTcmKEAAAAJcEhZcwAADsIAAA7CARUoSoAAAAC6SURBVChTXZELbsMwDEP1MeU623L/45aUUhQYgQT2sygrjN0jc49cn02/HaPy3graBravlUH8GmhanhaPRQk3YhBljn0RJvZDjkWx1gmBNcgL9NhPXbYe8wzA841fS7hYgnXdyJEWSME/HE6h5YLzOrVk4TkFHSeCPWXn+LS3R3ZTo9Ql1c1P4EVYqwsHcSRcGr5OVDuljZzPfIqkmM/8FwgmEEVXwehcETbg8w2ZYUgDb7MM9/kd9/0GmTILpGn7b0QAAAAASUVORK5CYII=">
                                            <span style="padding: 3px;">Tracking</span>
                                        </span>
                                        <span id="zjDCLmainspread" style="font-weight: normal"></span>
                                    </div>
                                    <div class="g_accordian_content">
                                        <div class="g_show_on_collapse"></div>
                                        <div class="g_hide_on_collapse">
                                            <label class="g2_checkbox">
                                                <input type=checkbox name="OpenTracking" id="{settingsID}OpenTracking" [OPENON] data-oval="opens">
                                                <span>Opens</span>
                                            </label>
                                            <label class="g2_checkbox">
                                                <input type=checkbox name="ClickTracking" id="{settingsID}ClickTracking" [CLICKON] data-oval="clicks">
                                                <span>Clicks</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>`;
                                OptionsBox += `
                                <div class="g2_action g_accordian">
                                    <div class="g_accordian_title">
                                        <span>
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAnUExUReDh4nV6f4uPk0lQV5+jprS3ul9la8nMzsrMzt/g4fX19UpRWAAAAMAYAr0AAAANdFJOU////////////////wA96CKGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAjElEQVQoU13QURKEIAwD0EJA0e39z7tpAEX60+F1SBXzvSylHS0D2LCQkD9Yg75oiVAOoD5oulkj8pwoQlPA1bHxEnC0Fg13oMJoZurZbYQByb0PieMzXkN1U1qMxy4ud9N/cep9CetiJkOPthjuQNWMUdDEsYT1ov147APGL9j6Y54rFvUSbWKWqdz/ZI4LGyoM/FYAAAAASUVORK5CYII=">
                                            <span style="padding: 3px;">Action</span>
                                        </span>
                                    </div>
                                    <div class="g_accordian_content">
                                        <div class="g_show_on_collapse"></div>
                                        <div class="g_hide_on_collapse">
                                            <label class="g_radio">
                                                <input type=radio name="{settingsID}SendSave" value="send" data-oval="send emails">
                                                <span>Send emails</span>
                                            </label>
                                            <label class="g_radio">
                                                <input type=radio name="{settingsID}SendSave" value="save" data-oval="create drafts">
                                                <span>Create Drafts</span>
                                            </label>
                           
                                            <div style="margin-top:1rem; display:none" class="g2_smtp_settings">
                                                <div style="margin-left: 25px;"> 
                                                    <div>How do you want to send those emails?</div>
                                                    <span>Send with:</span>
                                                    <select name="SmtpServerId">
                                                        <option value="0">Gmail</option>
                                                    </select>
                                                </div> 
                                            </div>

                                            <div style="margin-top:1rem; display:none" class="g2_draft_settings">
                                                <div style="margin-left: 25px;"> 
                                                    <div>How fast do you want the Drafts created?</div>
                                                    <span>Create Drafts:</span>
                                                    <label class="g_radio">
                                                        <input data-oval="per sending limits" type="radio" name="{settingsID}DraftSaveSpeed" checked value="limited">
                                                        <span>per sending limits</span>
                                                    </label>
                                                    <label class="g_radio">
                                                        <input data-oval="all at once" type="radio" name="{settingsID}DraftSaveSpeed" value="all">
                                                        <span>all at once</span>
                                                    </label>
                                                </div> 
                                            </div>

                                        </div>
                                    </div>
                                </div>`;



                                OptionsBox += `
                                <div class="g2_auto_follow_up g_accordian">
                                    <div id="{settingsID}oa">
                                        <div class="g_accordian_title">
                                            <span>
                                                <img src="${BaseURLCDN}Extension2019Images/fa-share.png">
                                                <span style="padding: 3px;">Auto Follow-up</span>
                                            </span>
                                            <span id="{settingsID}mainauto"></span>
                                        </div>
                                        <div class="g_accordian_content">
                                        <div id="{settingsID}afstatus" class="g_show_on_collapse"></div>
                                        <div id="{settingsID}GMassAFDisplay" class="g_hide_on_collapse gmass-auto-follow-ups">
                                    `;

                                if (IsScheduled && (loadedSettings != null && loadedSettings['1BumpDays'] > 0 )) {
                                    OptionsBox += `
                                    <div id="{settingsID}autoclear">
                                        <div id="{settingsID}ac" style="overflow: auto">
                                            <div style="float:left; margin-right:3px; padding-top:2px; margin-bottom:1em;">
                                                <button class="autoclear2_btn" type="button" id="{settingsID}ClearBumps">
                                                    Clear all auto follow-ups
                                                </button>
                                            </div>
                                        </div>
                                    </div>`;
                                }

                                OptionsBox += '<div class="bumps-wrapper"></div>';

                                OptionsBox = OptionsBox + '</div>';
                                OptionsBox = OptionsBox + '</div></div></div>'
                                OptionsBox += `
                                <div class="g2_schedule g_accordian">
                                    <div class="g_accordian_title">
                                        <span>
                                            <img src="${BaseURLCDN}Extension2019Images/fa-calendar.png">
                                            <span style="padding: 3px;">Schedule</span>
                                        </span>
                                        <span id="{settingsID}mainspread" style="font-weight: normal"></span>
                                    </div>
                                    <div class="g_accordian_content">
                                        <div id="{settingsID}schedulestatus" class="g_show_on_collapse"></div>
                                        <div id="{settingsID}spreadfloater" class="g_hide_on_collapse">

                                            <div style="display:flex">
                                                <div class="g_col_label" style="float:none">Time:</div>
                                                <div>
                                                    <select id="{settingsID}GMassDateDropdown" style="margin-bottom:5px;">
                                                        <option selected disabled hidden value=""></option> 
                                                        <option value="Now" [NOW]>Now</option> 
									                    <option value="FiveMinutes" [FIVEMINUTES]>In 5 minutes</option> 
                                                        <option value="OneHour" [ONEHOUR]>In 1 hour</option> 
                                                        <option value="ThreeHours" [THREEHOURS]>In 3 hours</option> 
                                                        <option value="TomorrowMor" [TOMRROWMOR]>Tomorrow morning at 8am</option> 
                                                        <option value="TomorrowAft" [TOMORROWAFT]>Tomorrow afternoon at 1pm</option> 
                                                        <option value="TomorrowEve" [TOMORROWEVE]>Tomorrow evening at 7pm</option> 
                                                        <option value="Custom" [CUSTOM]>Custom date/time</option> 
                                                    </select>
                                                    <div class="gmass-expand-field">
                                                        <input size="30" type="text" id="{settingsID}GMassDateTime" value="[CUSTOMTIME]" data-oval="schedule set" />
                                                    </div>
                                                    <div style="margin-top: 5px" id="{settingsID}SkipWeekendsDiv" class="not-inline-reply-form">
                                                        <label class="g2_checkbox">
                                                            <input type="checkbox" name="SkipWeekends" id="{settingsID}SkipWeekends" [SKIPWEEKENDSON] data-oval="skip weekends">
                                                            <span>Skip weekends</span>
                                                        </label>
                                                    </div>
                                                    <div style="margin-top: 5px" class="not-inline-reply-form">
                                                        <label class="g2_checkbox">
                                                            <input type="checkbox" name="SkipHolidays" id="{settingsID}SkipHolidays" [SKIPHOLIDAYSON] data-oval="skip holidays">
                                                            <span>Skip holidays</span>
                                                        </label>
                                                    </div>
                                                    <div style="margin-top: 5px" class="not-inline-reply-form">
                                                        <label class="g2_checkbox">
                                                            <input type="checkbox" [SENDDAYSON] name="SendDaysOn" value="true" id="{settingsID}SendDaysOn" data-oval="send days">
                                                            <span>Choose specific days</span>
                                                        </label>
                                                        <div class="g_senddays" style="margin-top:1em">
                                                            <select name="SendDays" id="{settingsID}SendDays" multiple>
                                                            	<option value="weekdays" data-group="true">Select weekdays only</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    

                                                    <div class="not-inline-reply-form" style="height: 30px;margin-top:5px;display:flex;align-items:center">

                                                        <div>
                                                            <label class="g2_checkbox"
                                                                    for="{settingsID}EndTimeBox"
                                                                    style="cursor:pointer;">
                                                                <input type="checkbox"
                                                                name="EndTimeBox"
                                                                value="true"
                                                                id="{settingsID}EndTimeBox"
                                                                data-oval="end time">
                                                                    <span>Set end time</span>
                                                            </label>


                                                        </div>



                                                            <div class="g_endtime" style="margin-left: 5px;">
                                                                <input type="text"
                                                                    class="g_endtime_input"
                                                                    data-time="5:00pm"
                                                                    id="{settingsID}EndTime"
                                                                    name="EndTime"
                                                                    value="5:00pm">
                                                            </div>

                                                            <span id="new-badge-endtime" style="background:#ff0; color:#000; font-size:10px; font-weight:bold; padding:2px 4px; border-radius:3px; margin-left:5px;">NEW</span>

                                                    </div>




                                                </div>
                                            </div>

                                            <div class="g_border_top not-inline-reply-form" style="display:flex">
                                                <div class="g_col_label" style="float:none">Speed:</div>
                                                <div>
                                                    <span style="padding-top:0px;">
                                                <span>Send</span>
                                                <input type=text placeholder=max size=4 id="{settingsID}MaxEmails" name=MaxEmails value="[MAXEMAILS]" data-oval="daily limit">
                                                <span>emails/day</span>
                                                <button type="button" id="{settingsID}checkusage">Show usage</button>
                                                    </span>
                                                <div style="margin-top:4px;margin-left: 32px;">
                                                    <label class="g2_checkbox with-select">
                                                        <input type="checkbox" id="{settingsID}DelayCheckbox" name="DelayCheckbox" [DELAYOFF] data-oval="pause between emails">
                                                        <span>
                                                            Pause
                                                            <select id="{settingsID}PauseSeconds" name="PauseSeconds">
                                                                <option value="1">5-10 seconds</option>
                                                                <option value="2">10-60 seconds</option>
                                                                <option value="3">1-5 minutes</option>
                                                                <option value="5">5-10 minutes</option>
                                                            </select>
                                                            between emails
                                                        </span>
                                                    </label>
                                                </div>
                                                </div>
                                            </div>

                                            <div class="g_border_top not-inline-reply-form" style="display:flex; margin-top: 5px" id="{settingsID}RecurDiv">
                                                <div class="g_col_label" style="float:none">Repeat:</div>
                                           <div style="display: flex;">
                                            <label class="g2_checkbox">
                                                <input type="checkbox" style="position: relative;" name="Recur" id="{settingsID}Recur" [RECURON] data-oval="repeat">
                                                <span></span>
                                            </label>
                                            <div style="display: flex; align-items: center;" class="g_recur_interval">
                                            <span id="{settingsID}RecurEveryLabel" style="font-size: 13px; margin-right: 3px;">Every</span>
                                                <input type="number" style="width: 50px; margin-right: 2px;" type=text id="{settingsID}RecurEvery" name=RecurEvery value="[RECUREVERY]">
                                            </div>
                                            <select name="repeatdh" id="{settingsID}repeatdh">
                                                <option value="d">Day</option>
                                                <option value="h">Hour</option>
                                                <option value="w">Week</option>
                                                <option value="m">Month</option>
                                                <option value="i">Instantly</option>
                                            </select>
                                                    <span id="{settingsID}repeatmode" style="visibility: hidden;">
                                                <span id="{settingsID}RecurToLabel" style="margin-left: 2px;">to</span>
                                                <select name="repeatneworall" id="{settingsID}repeatneworall">
                                                    <option value="n">new</option>
                                                    <option value="a">all</option>
                                                </select>
                                                <span id="{settingsID}RecurSheetLabel">rows</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                            </div>
                               `;
                                OptionsBox += `
                                <div class="g2_advanced g_accordian not-inline-reply-form">
                                        <div class="g_accordian_title">
                                            <span>
                                                <img src="${BaseURLCDN}Extension2019Images/fa-message.png">
                                                <span style="padding: 3px;">Advanced</span>
                                            </span>
                                            <span id="{settingsID}mainadvanced" style="font-weight: normal"></span>
                                        </div>
                                        <div class="g_accordian_content">
                                        <div id="{settingsID}advancedstatus" class="g_show_on_collapse"></div>
                                        <div class="advanced-box2 g_hide_on_collapse" id="{settingsID}advanceddiv">
                                        <table class="g2_settings_table">
                                            <tr>
                                                <td>Send as:</td>
                                                <td>
                                                    <label class="g_radio">
                                                        <input type=radio [NEW] id="{settingsID}NewRadio" name="{settingsID}NewReplyRadio" value=x>
                                                        <span>New messages</span>
                                                    </label>
                                                    <label class="g_radio">
                                                        <input type=radio [REPLY] id="{settingsID}ReplyRadio" name="{settingsID}NewReplyRadio" value=y data-oval="send as replies">
                                                        <span>Replies</span>
                                                    </label>

                                                    <div class="reply-message">
                                                        <span style="display:block;margin-bottom:4px;">Choose campaign to reply to:</span>
                                                        <select id="{settingsID}ReplyMessage" name="ReplyMessage" style="width:100%" class="g-campaign-select">
                                                            <option value="0" subjectname="Last conversation with recipient">Last conversation with recipient</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span>MultiSend:</span></td>
                                                <td>
                                                    <label class="g2_checkbox">
                                                        <input type="checkbox" [MULTISENDON] style="position: relative;" name="MultiSend" value="true" id="{settingsID}MultiSend" data-oval="multisend">
                                                        <span>Send from multiple accounts</span>
                                                    </label>
                                                    <div class="g_multi_send" style="margin-top:1em">
                                                        <div style="display:flex; ">
                                                            <div style="flex-grow:1">
                                                                <select name="MultiSendTokenIds" id="{settingsID}MultiSendTokenIds" multiple></select>
                                                            </div>
                                                            <button class="g2_refresh_accounts" title="Refresh the account list"></button>
                                                        </div>
                                                        <div style="display:flex; justify-content: space-between; margin:2px 0">
                                                            <a href=# class="link-multi-send">Link new account
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr id="spintax-feature-row">
                                                <td><span>SpinMax:</span></td>
                                                <td>
                                                    <label class="g2_checkbox">
                                                        <input type="checkbox"
                                                            style="position: relative;"
                                                            name="AutoSpintax"
                                                            value="true"
                                                            [SPINTAXON]
                                                            id="{settingsID}AutoSpintax"
                                                            data-oval="autospintax">
                                                        <span>Spin text automatically</span>
                                                        <span id="new-badge-spinmax" style="background:#ff0; color:#000; font-size:10px; font-weight:bold; padding:2px 4px; border-radius:3px; margin-left:5px;">NEW</span>
                                                    </label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span>Verify:</span></td>
                                                <td>
                                                    <label class="g2_checkbox">
                                                        <input type="checkbox" style="position: relative;" name="Verify" value="true" [VERIFYON] id="{settingsID}Verify" data-oval="verify">
                                                        <span>Verify emails before sending</span>
                                                    </label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span>A/B Test:</span></td>
                                                <td>
                                                    <label class="g2_checkbox">
                                                        <input type="checkbox" [ABTESTON] style="position: relative;" name="ABTest" value="true" id="{settingsID}ABTest" data-oval="a/b test">
                                                        <span>Send different emails to see what works best</span>
                                                    </label>
                                                    <div class="g_ab_test">
                                                        <div style="margin-bottom: 15px; margin-right:6px;">
                                                            <div style="margin-top:1em;">Percentage to send before making a decision:</div>
                                                            <input type="range" class="ab_send_percent" id="{settingsID}ABPercentage" name="ABPercentage" value="[ABPERCENTAGE]" min="0" max="100" step="1"><span class="ab_send_percent_value">0%</span>
                                                        </div>
                                                        <div class="ab_test_settings">
                                                            <div style="margin-bottom: 15px; margin-right:6px;">
                                                                Decide when?
                                                                <input type="number" min="0" style="width:4em; margin-left: 6px;" id="{settingsID}ABTimeAfter" name="{settingsID}ABTimeAfter" value="[ABTIMEAFTER]">  hours after sending test
                                                            </div>
                                                            <div style="margin-bottom: 15px; margin-right:6px;">
                                                                Decide how?
                                                                <label class="g_radio" style="margin-left:1em"><input type="radio" [ABDECISIONAUTOMATIC] name="{settingsID}ABDecision" value="a"> <span>Automatic</span></label>
                                                                <label class="g_radio"><input type="radio" [ABDECISIONMANUAL] name="{settingsID}ABDecision" value="m"> <span>Manual</span></label>
                                                            </div>
                                                            <div class="g_ab_how" style="margin-bottom: 15px; margin-right:6px; margin-left:90px;">
                                                                Based on:
                                                                <select id="{settingsID}ABFactor" name="{settingsID}ABFactor" style="margin-left:1em">
                                                                <option value="o">Opens</option>
                                                                <option value="c">Clicks</option>
                                                                <option value="r">Replies</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="ab_test_settings_overlay" style="display: none; color: darkgray;">
                                                            Collect stats only. Nothing to decide.
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span>Triggers:</span></td>
                                                <td>
                                                    <label class="g2_checkbox">
                                                        <input type="checkbox" [TRIGGERSON] style="position: relative;" name="Triggers" value="true" id="{settingsID}Triggers" data-oval="triggers">
                                                        <span>Send triggered emails when recipient...</span>
                                                    </label>

                                                    <div class="g_triggers">
                                                        <div class="trigger_settings">
                                                            <div style="margin-top: 10px;">
                                                                <div style="display: flex; width: 230px;">
                                                                <div style="font-weight: bold">Opens:</div>
                                                                <div id="{settingsID}TriggerOpenClear" class="g2_trigger_clear" style="display: none; margin-left: auto;"><a href="#">clear</a></div>
                                                                </div>
                                                                <div style="display:flex;align-items:center">

                                                                    <select id="{settingsID}TriggerOpenCampaign" name="TriggerOpenCampaign" style="width: 230px; display:inline-block; font-size:8pt" class="g-campaign-select">
                                                                        <option></option>
                                                                    </select>
                                                                    <button class="g2_view_message" title="View the selected message" style="display:none"></button>
                                                                    <button class="g2_edit_message" data-type="trigger" title="Edit the selected message" style="display:none"></button>
                                                                    <button class="g2_refresh_messages" title="Refresh the message list"></button>
                                                                                                                                    </div>


                                                                    <div style="margin-top: 6px;"><label><input type="checkbox" name="TriggerOpenThreaded" id="{settingsID}TriggerOpenThreaded" [TRIGGERSOPENTHREADEDON] value="on"> Thread with existing conversation</label></div>

                                                                    <div style="margin-top: 6px;"><label><input type="checkbox" id="{settingsID}TriggerOpenInstantly" class="TriggerOpenInstantly" checked> <span id="{settingsID}TriggerOpenSendInstantlyText">Send instantly</span></label></div>
                                                                    <div style="margin-top: 6px;display:none;" class="TriggerOpenDelayWrap">Send after <input type="number" name="TriggerOpenDelay" style="width:4em" min="0" id="{settingsID}TriggerOpenDelay" value="[TRIGGERSOPENDELAY]"> minutes</div>

                                                                <div style="display: flex; width: 230px; margin-top: 15px;">
                                                                    <div style="font-weight: bold">Clicks:</div>
                                                                    <div id="{settingsID}TriggerClickClear" class="g2_trigger_clear" style="display: none; margin-left: auto;"><a href="#">clear</a></div>
                                                                </div>
                                                                <div style="display:flex;align-items:center;">
                                                                    <select id="{settingsID}TriggerClickCampaign" name="TriggerClickCampaign" style="width: 230px; display:inline-block; font-size:8pt"  class="g-campaign-select">
                                                                        <option></option>
                                                                    </select>
                                                                    <button class="g2_view_message" title="View the selected message" style="display:none"></button>
                                                                    <button class="g2_edit_message" data-type="trigger" title="Edit the selected message" style="display:none"></button>
                                                                    <button class="g2_refresh_messages" title="Refresh the message list"></button>
                                                                </div>

                                                                <div style="margin-top: 6px;"><label><input type="checkbox" name="TriggerClickThreaded" id="{settingsID}TriggerClickThreaded" [TRIGGERSCLICKTHREADEDON] value="on"> Thread with existing conversation</label></div>

                                                                <div style="margin-top: 6px;"><label><input type="checkbox" id="{settingsID}TriggerClickInstantly" class="TriggerClickInstantly" checked> <span id="{settingsID}TriggerClickSendInstantlyText">Send instantly</span></label></div>
                                                                <div style="margin-top: 6px;display:none;" class="TriggerClickDelayWrap">Send after <input type="number" name="TriggerClickDelay" style="width:4em" min="0" id="{settingsID}TriggerClickDelay" value="[TRIGGERSCLICKDELAY]"> minutes</div>

                                                                <div style="display: flex; width: 230px; margin-top: 15px;">
                                                                    <div style="font-weight: bold">Replies:</div>
                                                                    <div id="{settingsID}TriggerReplyClear" class="g2_trigger_clear" style="display: none; margin-left: auto;"><a href="#">clear</a></div>
                                                                </div>
                                                                <div style="display:flex;align-items:center;">
                                                                    <select id="{settingsID}TriggerReplyCampaign" name="TriggerReplyCampaign" style="width: 230px; display:inline-block; font-size:8pt"  class="g-campaign-select">
                                                                        <option></option>
                                                                    </select>
                                                                    <button class="g2_view_message" title="View the selected message" style="display:none"></button>
                                                                    <button class="g2_edit_message" data-type="trigger" title="Edit the selected message" style="display:none"></button>
                                                                    <button class="g2_refresh_messages" title="Refresh the message list"></button>
                                                                </div>

                                                                <div style="margin-top: 6px;"><label><input type="checkbox" name="TriggerReplyThreaded" id="{settingsID}TriggerReplyThreaded" [TRIGGERSREPLIESTHREADEDON] value="on"> Thread with existing conversation</label></div>

                                                                <div style="margin-top: 6px;"><label><input type="checkbox" id="{settingsID}TriggerReplyInstantly" class="TriggerReplyInstantly" checked> <span id="{settingsID}TriggerReplySendInstantlyText">Send instantly</span></label></div>
                                                                <div style="margin-top: 6px;display:none;" class="TriggerReplyDelayWrap">Send after <input type="number" name="TriggerReplyDelay" style="width:4em" min="0" id="{settingsID}TriggerReplyDelay" value="[TRIGGERSREPLIESDELAY]"> minutes</div>

                                                                <div style="margin-top: 5px; margin-bottom: 8px;">
                                                                    <div>Reply must contain:</div>
                                                                    <div><select style="width: 100%" multiple name="TriggerReplyPhrases" id="{settingsID}TriggerReplyPhrases" size="3"><option value=""></option></select></div>
                                                                </div>



                                                                <div style="margin-top: 12px; font-weight: bold">Create a trigger email: <button class="g2_add_message" data-stage="-1" title="Create a new message" style="vertical-align: middle;"></button></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span>Reply-To:</span></td>
                                                <td>
                                                    <select style="width: 317px;" id="{settingsID}replyto" data-oval="reply-to set">
                                                        <option></option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span>Suppression:</span></td>
                                                <td>
                                                    <label class="g2_chevron">
                                                        <input type="checkbox" [SUPPRESSIONON] style="position: relative;" name="SuppressionOn" value="true" id="{settingsID}SuppressionOn">
                                                        <span>Don't send to:</span>
                                                    </label>
                                                    <div class="g_suppression_settings" style="margin-top:1em;">
                                                        <div style="padding: 3px;margin-bottom: 8px;"><select style="width: 100%" multiple name="suppression" id="{settingsID}suppression" size="5" data-oval="suppression campaigns set"></select>
                                                        <div style="text-align: right;"><label><input type="checkbox" value="true" name="SuppressionAggressive" [SUPPRESSIONAGGRESSIVEON] id="{settingsID}SuppressionAggressive" style="
                                                            vertical-align: middle;"> <span style="vertical-align: middle" id="{settingsID}SuppressionAggressiveText">Aggressive</span></label></div>
                                                        </div>
                                                        <div style="padding: 3px;margin-bottom: 8px;"><select style="width: 100%" multiple name="AutoSuppress" id="{settingsID}AutoSuppress" size="5" data-oval="suppression addresses set"><option value=""></option></select></div>
                                                    <div class="receive-past-wrap" style="padding: 3px;">
                                                        <span class="receive receive-past">People I've emailed in the past</span>
                                                        <input class="receive-input" type="text" placeholder="0" size="3" id="{settingsID}SuppressionDays" value="[SUPPRESSIONDAYS]" data-oval="supression days set">
                                                        <span class="receive">days</span>
                                                    </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span>Skip Sent:</span></td>
                                                <td>
                                                    <label class="g2_checkbox">
                                                        <input type="checkbox" style="position: relative;" name="SkipSent" value="true" [SKIPSENTON] id="{settingsID}SkipSent" data-oval="skip sent">
                                                        <span>Skip logging emails to Sent folder</span>
                                                    </label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Images:</td>
                                                <td>
                                                    <label class="g_radio">
                                                        <input type="radio" [DEFAULT] id="{settingsID}ImageRadioDefault" name="{settingsID}Images" value="default">
                                                        <span>Default</span>
                                                    </label>
                                                    <label class="g_radio">
                                                        <input type="radio" [REFERENCED] id="{settingsID}ImageRadioReferenced" name="{settingsID}Images" value="hosted" data-oval="images hosted"">
                                                        <span>Hosted</span>
                                                    </label>
                                                    <label class="g_radio">
                                                        <input type="radio" [EMBEDDED] id="{settingsID}ImageRadioEmbedded" name="{settingsID}Images" value="embedded" data-oval="images embedded">
                                                        <span>Embedded</span>
                                                    </label>
                                                <td>
                                            </tr>
                                            <tr>
                                            <td>Poll:</td>
                                                <td>
                                                    <a href="#" class="g_add_poll" >Simple email poll</a>
                                                </td>
                                            </tr>
                                            <tr>
                                            <td>Timer:</td>
                                                <td>
                                                    <a href="#" class="g_add_timer" >Simple countdown timer</a>
                                                </td>
                                            </tr>
                                        </table>`;

                                if (!hideSomeSettings) {
                                    OptionsBox = OptionsBox + FriendlyNamePreviewSections;
                                }

                                OptionsBox = OptionsBox + `
                                    </div>
                                </div>`;



                                OptionsBox = OptionsBox + `</div>`;

                                OptionsBox = OptionsBox + (hideSomeSettings ? '</div>' + '<div style="padding-left: 10px;">' + FriendlyNamePreviewSections + '</div>' : "")


                                if (IsScheduled) {

                                    OptionsBox += '<div class="g2_campaigns" overflow: hidden;><div style="overflow: hidden;">';

                                    if (1 == 1) {
                                        OptionsBox += '<button type="button" id="' + settingsID + 'savecampaign">SAVE Changes</button><button type="button" id="' + settingsID + 'pauseresumecampaign">';
                                        if (IsPaused) {
                                            OptionsBox += 'Resume Campaign';
                                        }
                                        else {
                                            OptionsBox += 'Pause Campaign';
                                        }
                                        OptionsBox += '</button><button type="button" id="' + settingsID + 'cancelcampaign">Cancel Campaign</button><br> ';

                                    }
                                    OptionsBox += '<a href="javascript:void(0)"><span id="' + settingsID + 'getcampaignstatus">Get campaign status</span></a></div></div>';

                                }
                                if (isComposeInlineReply) {
                                    OptionsBox += '<div class="g_draft_free" id="' + settingsID + 'BreakDraftFreeLink"><a id="' + settingsID + 'BDFText">Break Draft Free</a></div>';
                                }

                                if (sdk.debug) {
                                    OptionsBox += `<div style="padding-top: 6px; float: right; margin-right: 4px;">
                                        <span>${(isComposeInlineReply ? 'INLINE' : 'DIALOG')}</span>
                                        <span id="${settingsID}ComposeFill">Fill</span>&nbsp;&nbsp;&nbsp;
                                        <span id="${settingsID}Debug" >Debug</span>
                                        <select class="test-gmass-actions">
                                            <option></option>
                                            <option value="get-subject">Get Subject</option>
                                            <option value="set-subject">Set Subject</option>
                                            <option value="get-to">Get Recipients</option>
                                            <option value="set-to">Set Recipients</option>
                                            <option value="get-cc">Get CC Recipients</option>
                                            <option value="set-cc">Set CC Recipients</option>
                                            <option value="get-bcc">Get BCC Recipients</option>
                                            <option value="set-bcc">Set BCC Recipients</option>
                                            <option value="clear-recipients">Clear Recipients</option>
                                            <option value="get-body-html">Get Html</option>
                                            <option value="set-body-html">Set Html</option>
                                            <option value="insert-html">Insert Html</option>
                                            <option value="insert-text">Insert Text</option>
                                            <option value="save-draft">Force draft save</option>
                                            <option value="butter-bar">Butter Bar</option>
                                            <option value="hide-send">Hide Send Button</option>
                                            <option value="show-send">Show Send Button</option>
                                            <option value="open-compose">Open new compose with recipients</option>
                                            <option value="close">Close compose</option>
                                            <option value="goto-inbox">Goto inbox</option>
                                            <option value="get-attachments">Get attachments</option>
                                            <option value="clear-attachments">Clear attachments</option>
                                            <option value="launch-auth">Launch auth</option>
                                        </select>
                                        </div>`;
                                }

                                OptionsBox += '</div>';
                                if (GMassDateDropdown == "Now") {
                                    OptionsBox = OptionsBox.replace("[NOW]", "selected");
                                }
                                if (GMassDateDropdown == "FiveMinutes") {
                                    OptionsBox = OptionsBox.replace("[FIVEMINUTES]", "selected");
                                }
                                if (GMassDateDropdown == "OneHour") {
                                    OptionsBox = OptionsBox.replace("[ONEHOUR]", "selected");
                                }
                                if (GMassDateDropdown == "ThreeHours") {
                                    OptionsBox = OptionsBox.replace("[THREEHOURS]", "selected");
                                }
                                if (GMassDateDropdown == "TomorrowMor") {
                                    OptionsBox = OptionsBox.replace("[TOMRROWMOR]", "selected");
                                }
                                if (GMassDateDropdown == "TomorrowAft") {
                                    OptionsBox = OptionsBox.replace("[TOMORROWAFT]", "selected");
                                }
                                if (GMassDateDropdown == "TomorrowEve") {
                                    OptionsBox = OptionsBox.replace("[TOMORROWEVE]", "selected");
                                }
                                if (GMassDateDropdown == "Custom") {
                                    OptionsBox = OptionsBox.replace("[CUSTOM]", "selected");
                                }


                                if (GMassDateTextBox !== null) {

                                    OptionsBox = OptionsBox.replace("[CUSTOMTIME]", GMassDateTextBox);

                                }

                                if (myMaxEmails !== null) {

                                    OptionsBox = OptionsBox.replace("[MAXEMAILS]", myMaxEmails);

                                }

                                if (myRecurEvery !== null) {

                                    OptionsBox = OptionsBox.replace("[RECUREVERY]", myRecurEvery);

                                }
                                else {
                                    OptionsBox = OptionsBox.replace("[RECUREVERY]", "1");
                                }

                                if (mySuppressionDays !== null) {

                                    OptionsBox = OptionsBox.replace("[SUPPRESSIONDAYS]", mySuppressionDays);

                                }
                                else {
                                    OptionsBox = OptionsBox.replace("[SUPPRESSIONDAYS]", "0");
                                }



                                if (SMTP == "on") {
                                    OptionsBox = OptionsBox.replace("[SMTP]", "checked")
                                }
                                else if (SMTP == "off") {
                                    OptionsBox = OptionsBox.replace("[GMAIL]", "checked")
                                }


                                if (myNewReply == "new" || myNewReply == "default") {

                                    OptionsBox = OptionsBox.replace("[NEW]", "checked")

                                }
                                else if (myNewReply == "reply") {

                                    OptionsBox = OptionsBox.replace("[REPLY]", "checked")

                                }

                                if (GMassImages == "d") {
                                    OptionsBox = OptionsBox.replace("[DEFAULT]", "checked")
                                }
                                else if (GMassImages == "r") {
                                    OptionsBox = OptionsBox.replace("[REFERENCED]", "checked")
                                }
                                else if (GMassImages == "e") {
                                    OptionsBox = OptionsBox.replace("[EMBEDDED]", "checked")

                                }
                                if (GMassVerify == "true") {
                                    OptionsBox = OptionsBox.replace("[VERIFYON]", "checked")
                                }
                                if (GMassAutoSpintax == "true") {
                                    OptionsBox = OptionsBox.replace("[SPINTAXON]", "checked");
                                }

                                if (GMassSkipSent == "true") {
                                    OptionsBox = OptionsBox.replace("[SKIPSENTON]", "checked")
                                }

                                if (SuppressionAggressive == "true") {
                                    OptionsBox = OptionsBox.replace("[SUPPRESSIONAGGRESSIVEON]", "checked")
                                }

                                if (ABTest == "true") {
                                    OptionsBox = OptionsBox.replace("[ABTESTON]", "checked");
                                }
                                if (MultiSendBox == "on") {
                                    OptionsBox = OptionsBox.replace("[MULTISENDON]", "checked");
                                }
                                if (SendDaysOn == "on") {
                                    OptionsBox = OptionsBox.replace("[SENDDAYSON]", "checked");
                                }


                                if (Triggers == true || Triggers == "true") {
                                    OptionsBox = OptionsBox.replace("[TRIGGERSON]", "checked");
                                }

                                if (TriggerOpenThreadedValue == "on") {
                                    OptionsBox = OptionsBox.replace("[TRIGGERSOPENTHREADEDON]", "checked");
                                }

                                OptionsBox = OptionsBox.replace("[TRIGGERSOPENDELAY]", TriggerOpenDelayValue);
                                OptionsBox = OptionsBox.replace("[TRIGGERSCLICKDELAY]", TriggerClickDelayValue);
                                OptionsBox = OptionsBox.replace("[TRIGGERSREPLIESDELAY]", TriggerReplyDelayValue);

                                if (TriggerClickThreadedValue == "on") {
                                    OptionsBox = OptionsBox.replace("[TRIGGERSCLICKTHREADEDON]", "checked");
                                }
                                if (TriggerReplyThreadedValue == "on") {
                                    OptionsBox = OptionsBox.replace("[TRIGGERSREPLIESTHREADEDON]", "checked");
                                }

                                if (GMassBumpSuppression.length > 0 || GMassSuppression.length > 0 || mySuppressionDays != 0) {
                                    OptionsBox = OptionsBox.replace('[SUPPRESSIONON]', 'checked');
                                }
                                OptionsBox = OptionsBox.replace("[ABPERCENTAGE]", ABPercentage);
                                OptionsBox = OptionsBox.replace("[ABTIMEAFTER]", ABTimeAfter);

                                if (ABDecision == "a") {
                                    OptionsBox = OptionsBox.replace("[ABDECISIONAUTOMATIC]", "checked");
                                }
                                else {
                                    OptionsBox = OptionsBox.replace("[ABDECISIONMANUAL]", "checked");
                                }


                                if (myDelay == "on") {

                                    OptionsBox = OptionsBox.replace("[DELAYOFF]", "checked")
                                }

                                if (myOpenTracking == "on" || myOpenTracking == "default") {

                                    OptionsBox = OptionsBox.replace("[OPENON]", "checked")

                                }
                                else if (myOpenTracking == "off") {

                                    OptionsBox = OptionsBox.replace("[OPENOFF]", "checked")

                                }
                                if (myClickTracking == "on" || myClickTracking == "default") {

                                    OptionsBox = OptionsBox.replace("[CLICKON]", "checked")

                                }


                                if (SkipWeekends == "on") {
                                    OptionsBox = OptionsBox.replace("[SKIPWEEKENDSON]", "checked")
                                }
                                if (SkipHolidays == "on") {
                                    OptionsBox = OptionsBox.replace("[SKIPHOLIDAYSON]", "checked")
                                }

                                if (GMassTestSendOrDraft == "send") {
                                    OptionsBox = OptionsBox.replace("[SENDTESTSEND]", "checked")
                                }
                                else if
                                    (GMassTestSendOrDraft == "draft") {
                                    OptionsBox = OptionsBox.replace("[SENDTESTDRAFT]", "checked")
                                }

                                if (GMassTestSequence == "on") {
                                    OptionsBox = OptionsBox.replace("[SENDTESTSEQUENCE]", "checked")
                                }
                                OptionsBox = OptionsBox.replace(/{settingsID}/g, settingsID);
                                OptionsBox = OptionsBox.replace(/\[(A-Z)+\]/g, '');

                                sdk.log("about to set HTML for options box");
                                SettingsBox.innerHTML = OptionsBox;
                                
                                ensureBumps();
                                if (loadedSettings != null) {
                                    var bump = 1;
                                    while (loadedSettings[bump + 'BumpDays'] > 0) {
                                        ensureBumps(bump);

                                        var days = loadedSettings[bump + 'BumpDays'];
                                        var action = loadedSettings[bump + 'BumpAction'];
                                        var campaignId = loadedSettings[bump + 'BumpCampaignID'];
                                        var addedText = loadedSettings[bump + 'BumpAddedText'];
                                        var choice = loadedSettings[bump + 'BumpChoice'];
                                        var time = loadedSettings[bump + 'BumpTime'];
                                        var NOT = loadedSettings['BNOT' + bump];

                                        $(SettingsBox).find(`#${settingsID}${bump}BumpBox`).prop('checked', true);
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpAction`).val(action);
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpDays`).val(days);
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpTime`).val(time);
                                        if (time != null && time !== '') {
                                            $('#' + settingsID + bump + 'bump').addClass('set-time');
                                        }
                                        else {
                                            $('#' + settingsID + bump + 'bump').removeClass('set-time');
                                        }
                                        
                                        if (choice == 't') {
                                            $(SettingsBox).find(`#${settingsID}${bump}BumpChoicet`).prop('checked', true).trigger('change');
                                        }
                                        else {
                                            $(SettingsBox).find(`#${settingsID}${bump}BumpChoicec`).prop('checked', true).trigger('change');
                                            displayEyeAFDropdown(bump);
                                        }
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpAddedText`).val(addedText);
                                        $(SettingsBox).find(`#${settingsID}${bump}SameNew`).val(NOT);

                                        var ddCampaign = $(SettingsBox).find(`#${settingsID}${bump}BumpCustom`);
                                        var campaignOption = ddCampaign.find(`option[value="${campaignId}"]`);
                                        if (campaignOption.length == 0) {
                                            ddCampaign.append(`<option value="${campaignId}">Campaign ${campaignId}`);
                                        }

                                        ddCampaign.val(campaignId);

                                        bump++;                                    

                                    }
                                    ensureBumps(bump);
                                }
                                if (BumpSettingsSavedForDuringListSwitch && BumpSettingsSavedForDuringListSwitch.length) {
                                    
                                    let bump = 1;
                                    BumpSettingsSavedForDuringListSwitch.forEach(stage => {
                                        if (!stage.enabled) { bump++; return; }

                                        ensureBumps(bump);

                                        const {
                                            days,
                                            action,
                                            campaignId,
                                            addedText,
                                            choice,
                                            time,
                                            sameNew
                                        } = stage;
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpBox`).prop('checked', true);
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpAction`).val(action);
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpDays`).val(days);
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpTime`).val(time);
                                        if (time != null && time !== '') {
                                            $(`#${settingsID}${bump}bump`).addClass('set-time');
                                        } else {
                                            $(`#${settingsID}${bump}bump`).removeClass('set-time');
                                        }
                                        if (choice === 't') {
                                            $(SettingsBox).find(`#${settingsID}${bump}BumpChoicet`)
                                                .prop('checked', true)
                                                .trigger('change');
                                        } else {
                                            $(SettingsBox).find(`#${settingsID}${bump}BumpChoicec`)
                                                .prop('checked', true)
                                                .trigger('change');
                                            displayEyeAFDropdown(bump);
                                        }
                                        $(SettingsBox).find(`#${settingsID}${bump}BumpAddedText`).val(addedText);
                                        $(SettingsBox).find(`#${settingsID}${bump}SameNew`).val(sameNew);
                                        const ddCampaign = $(SettingsBox).find(`#${settingsID}${bump}BumpCustom`);
                                        if (campaignId && ddCampaign.find(`option[value="${campaignId}"]`).length === 0) {
                                            ddCampaign.append(`<option value="${campaignId}">Campaign ${campaignId}</option>`);
                                        }
                                        ddCampaign.val(campaignId);

                                        bump++;
                                    });
                                    ensureBumps(BumpSettingsSavedForDuringListSwitch.length + 1);

                                    BumpSettingsSavedForDuringListSwitch = null;
                                }
                                if (EndTimeBox == "on") {
                                    document.getElementById(settingsID + 'EndTimeBox').checked = true;
                                }
                                if (EndTime && EndTime.length) {
                                    $('#' + settingsID + 'EndTime').val(EndTime);
                                }
                                (function () {
                                    const today = new Date();
                                    const cutoff = new Date("2025-05-10");

                                    if (today >= cutoff) {
                                        $(SettingsBox).find('#new-badge-spinmax').remove();
                                    }
                                })();

                                (function () {
                                    const today = new Date();
                                    const cutoff = new Date("2025-05-31");

                                    if (today >= cutoff) {
                                        $(SettingsBox).find('#new-badge-endtime').remove();
                                    }
                                })();                                

                                $(SettingsBox).find('[name="' + settingsID + 'SendSave"]').on('click', function () {
                                    if ($(this).val() == 'send') {
                                        if (AccountStatus && AccountStatus.SMTPServers && AccountStatus.SMTPServers.length > 0)
                                            $(SettingsBox).find('.g2_smtp_settings').show();
                                        $(SettingsBox).find('.g2_draft_settings').hide();
                                    }
                                    else {
                                        $(SettingsBox).find('.g2_draft_settings').show();
                                        $(SettingsBox).find('.g2_smtp_settings').hide();
                                        sdk.ButterBar.showMessage({ html: "Just FYI, this will cause no emails to send when you hit the GMass button. Instead DRAFTS will be created which you can then review for accuracy and then send by clicking a link. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/no-more-fear-preview-your-emails-as-drafts-then-send-them-with-one-click/\" target=\"_blog\">More information.</a>", time: 10000 });
                                    }
                                });
                                if (composeView.isInlineReplyForm())
                                    $(SettingsBox).find('.not-inline-reply-form').remove();
                                else
                                    $(SettingsBox).find('.inline-reply-form').remove();
                                $(SettingsBox).find('.TriggerOpenInstantly').prop('checked', TriggerOpenDelayValue <= 0);
                                $(SettingsBox).find('.TriggerClickInstantly').prop('checked', TriggerClickDelayValue <= 0);
                                $(SettingsBox).find('.TriggerReplyInstantly').prop('checked', TriggerReplyDelayValue <= 0);

                                $(SettingsBox).find(`[name="${settingsID}SendSave"][value="${sendSave}"]`).prop('checked', true).trigger('click');
                                $(SettingsBox).find(`[name="${settingsID}DraftSaveSpeed"][value="${draftSaveSpeed}"]`).prop('checked', true);
                                $(SettingsBox).find('[name="SmtpServerId"]').val(smtpServerId);

                                sdk.log("DONE to set HTML for options box");

                                var composeViewElement = composeView.getElement();

                                sdk.log(document.getElementById(settingsID + "afstatus"));

                                if (sdk.debug) {
                                    $(SettingsBox).find('.test-gmass-actions').on('change', function () {
                                        var action = $(this).val();
                                        switch (action) {
                                            case "get-subject": alert(composeView.getSubject()); break;
                                            case "set-subject": composeView.setSubject('new subject: ' + (new Date())); break;

                                            case "get-to": alert(composeView.getToRecipients().map(x => x.emailAddress).join(', ')); break;
                                            case "set-to":
                                                var rand = '' + new Date().getTime();
                                                composeView.setToRecipients(['a' + rand + '@b.com', 'c' + rand + '@d.com', 'e' + rand + '@f.com']); break;

                                            case "get-cc": alert(composeView.getCcRecipients().map(x => x.emailAddress).join(', ')); break;
                                            case "set-cc": composeView.setCcRecipients(['a@b.com', 'c@d.com', 'e@f.com']); break;

                                            case "get-bcc": alert(composeView.getBccRecipients().map(x => x.emailAddress).join(', ')); break;
                                            case "set-bcc": composeView.setBccRecipients(['a@b.com', 'c@d.com', 'e@f.com']); break;

                                            case "clear-recipients": composeView.clearRecipients(); break;
                                            case "get-body-html": alert(composeView.getHTMLContent()); break;
                                            case "set-body-html": composeView.setBodyHTML('<p><strong>new</strong> html' + (new Date())); break;

                                            case "insert-html": composeView.insertHTMLIntoBodyAtCursor('<p><a class="gmass-music-link" data-filename="filename" href="#">Click here to listen to my music</a></p>'); break;
                                            case "insert-text": composeView.insertTextIntoBodyAtCursor('lorem ipsum'); break;
                                            case "save-draft": composeView.saveDraft(); break;
                                            case "hide-send": composeView.hideSendButton(); break;
                                            case "show-send": composeView.showSendButton(); break;
                                            case "butter-bar":
                                                var butterbarbuttons = [];
                                                butterbarbuttons.push({
                                                    title: "Expand address", onClick: function () {
                                                        alert('button1');
                                                    }
                                                });
                                                butterbarbuttons.push({
                                                    title: "Download addresses", onClick: function () {
                                                        alert('button2');
                                                    }
                                                });
                                                sdk.ButterBar.showMessage({ html: 'this is the message this is the message this is the message this is the message this is the message this is the message ', time: 600000, buttons: butterbarbuttons });
                                                break;

                                            case "open-compose":
                                                sdk.Compose.openNewComposeView().then(function (composeView) {
                                                    composeView.setToRecipients(['test@test.com', 'a@b.com']);
                                                });
                                                break;
                                            case "close": composeView.close(); break;
                                            case "launch-auth": LaunchAuth(sdk.User.getEmailAddress(), 1); break;
                                            case "get-attachments":
                                                alert(JSON.stringify(composeView.getAttachments()));
                                                break;
                                            case "clear-attachments":
                                                composeView.clearAttachments();
                                                break;
                                        }
                                        this.selectedIndex = 0;
                                    });
                                }
                                $(SettingsBox).off('click.setTime').on('click.setTime', 'a.g_bump_set_time, a.g_bump_dont_set_time', function (e) {
                                    e.preventDefault();
                                    var bump = $(this).parents('.gmass-bump');
                                    bump.toggleClass('set-time');
                                    var tb = bump.find('.g_bump_time');
                                    if (bump.hasClass('set-time')) {
                                        tb.val(tb.data('time'));
                                    }
                                    else {
                                        var curTime = tb.val();
                                        if (curTime.length > 0) {
                                            tb.data('time', curTime);
                                        }
                                        tb.val('');
                                    }

                                    tb[0].dispatchEvent(new Event('change'));
                                });

                                $(SettingsBox).find('.TriggerOpenInstantly').on('change', function () {
                                    $(SettingsBox).find('.TriggerOpenDelayWrap').toggle(!this.checked);
                                    if (this.checked) {
                                        $(SettingsBox).find('[name="TriggerOpenDelay"]').val(0);
                                        document.getElementById(settingsID + 'TriggerOpenSendInstantlyText').style.color = "black";
                                    }
                                    else {
                                        document.getElementById(settingsID + 'TriggerOpenSendInstantlyText').style.color = "gray";
                                    }
                                }).trigger('change');

                                $(SettingsBox).find('.TriggerClickInstantly').on('change', function () {
                                    $(SettingsBox).find('.TriggerClickDelayWrap').toggle(!this.checked);
                                    if (this.checked) {
                                        $(SettingsBox).find('[name="TriggerClickDelay"]').val(0);
                                        document.getElementById(settingsID + 'TriggerClickSendInstantlyText').style.color = "black";
                                    }
                                    else {
                                        document.getElementById(settingsID + 'TriggerClickSendInstantlyText').style.color = "gray";
                                    }
                                }).trigger('change');

                                $(SettingsBox).find('.TriggerReplyInstantly').on('change', function () {
                                    $(SettingsBox).find('.TriggerReplyDelayWrap').toggle(!this.checked);
                                    if (this.checked) {
                                        $(SettingsBox).find('[name="TriggerReplyDelay"]').val(0);
                                        document.getElementById(settingsID + 'TriggerReplySendInstantlyText').style.color = "black";
                                    }
                                    else {
                                        document.getElementById(settingsID + 'TriggerReplySendInstantlyText').style.color = "gray";
                                    }
                                }).trigger('change');
                                $(SettingsBox).off('click.refreshBumps refresh.refreshBumps').on('click.refreshBumps refresh.refreshBumps', '.gmass-enable-bump', function (e) {
                                    var af = $(this).parents('.gmass-auto-follow-ups');
                                    var bump = $(this).parents('.gmass-bump');
                                    var bumpNumber = bump.data('bump');
                                    var nextBumpNumber = bumpNumber + 1;
                                    var nextBump = af.find('[data-bump="' + nextBumpNumber + '"]');
                                    if (this.checked) {
                                        nextBump.show();
                                        bump.addClass('enabled');
                                    }
                                    else {
                                        bump.removeClass('enabled');
                                        for (var i = nextBumpNumber; i <= 999; i++) {
                                            nextBump = af.find('[data-bump="' + i + '"]');
                                            if (nextBump.length == 0)
                                                break;
                                            nextBump.find('.gmass-enable-bump').prop('checked', false);
                                            nextBump.removeClass('enabled');
                                            nextBump.hide();
                                        }
                                    }
                                });

                                $(SettingsBox).find('.g_accordian_title').on('click', function () {
                                    var acc = $(this).parents('.g_accordian');
                                    acc.toggleClass('open');
                                    setAllOvals();

                                    acc[0].scrollIntoView({
                                        behavior: "smooth",
                                        block: "start"
                                    });
                                    SettingsBox.dropdown.reposition();
                                });

                                $(SettingsBox).find('[name="SuppressionOn"]').on('change', function () {
                                    var supOptions = $(SettingsBox).find('.g_suppression_settings');
                                    if (this.checked) {
                                        supOptions.slideDown('fast');
                                        setTimeout(function () {
                                            supOptions[0].scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            });
                                        }, 100);
                                    }
                                    else
                                        supOptions.slideUp('fast');
                                }).trigger('change');

                                $(SettingsBox).find('[name="SuppressionAggressive"]').on('change', function () {

                                    if (this.checked) {
                                        document.getElementById(settingsID + 'SuppressionAggressiveText').style.color = "black";
                                    }
                                    else {
                                        document.getElementById(settingsID + 'SuppressionAggressiveText').style.color = "gray";
                                    }
                                }).trigger('change');
                                $(SettingsBox).find('[name="SuppressionAggressive"]').on('change', function () {

                                    if (this.checked) {
                                        sdk.ButterBar.showMessage({ html: "Aggressive mode will suppress everyone that has received the campaign PLUS everyone who is still scheduled to receive the campaign in the future. <a style='color: #99FFFF' href='https://www.gmass.co/g/aggressive' target='_gmassblog'>More information.</a>", time: 10000 });
                                    }

                                });
                                $(SettingsBox).find('[name="SendDaysOn"]').on('change', function () {
                                    var msOptions = $(SettingsBox).find('.g_senddays');
                                    if (this.checked) {
                                        SendDaysOn = "on";
                                        msOptions.slideDown('fast');
                                        setTimeout(function () {
                                            msOptions[0].scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            });
                                        }, 100);
                                    }
                                    else {
                                        SendDaysOn = "off";
                                        msOptions.slideUp('fast');
                                    }
                                }).trigger('change');
                                $(SettingsBox)
                                    .find('.g_endtime_input')
                                    .each(function () {
                                        GMass.timePicker(this, {
                                            message: '<p>Use the arrows to select a time. Times are in your local timezone.</p>'
                                        });
                                    });

                                $(SettingsBox)
                                    .find('[name="EndTimeBox"]')
                                    .on('change', function () {
                                        var msOptions = $(SettingsBox).find('.g_endtime');

                                        if (this.checked) {
                                            EndTimeBox = "on";
                                            msOptions.show();
                                        } else {
                                            EndTimeBox = "off";
                                            msOptions.hide();
                                        }
                                    })
                                    .trigger('change');



                                $(SettingsBox).find('[name="ABTest"]').on('change', function () {
                                    var abOptions = $(SettingsBox).find('.g_ab_test');
                                    if (this.checked) {
                                        abOptions.slideDown('fast');
                                        setTimeout(function () {
                                            abOptions[0].scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            });
                                        }, 100);
                                    }
                                    else
                                        abOptions.slideUp('fast');
                                }).trigger('change');
                                $(SettingsBox).find('[name="MultiSend"]').on('change', function () {
                                    var msOptions = $(SettingsBox).find('.g_multi_send');
                                    if (this.checked) {
                                        MultiSendBox = "on";
                                        msOptions.slideDown('fast');
                                        setTimeout(function () {
                                            msOptions[0].scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            });
                                        }, 100);
                                    }
                                    else {
                                        MultiSendBox = "off";
                                        msOptions.slideUp('fast');
                                    }
                                }).trigger('change');

                                $(SettingsBox).find(`[name="${settingsID}ABDecision"]`).on('change', function () {
                                    var abHow = $(SettingsBox).find('.g_ab_how');
                                    var value = $(SettingsBox).find(`[name="${settingsID}ABDecision"]:checked`).val();
                                    if (value == 'a') {
                                        abHow.slideDown('fast');
                                        setTimeout(function () {
                                            abHow[0].scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            });
                                        }, 100);
                                    }
                                    else
                                        abHow.slideUp('fast');
                                }).trigger('change');


                                $(SettingsBox).find('[name="Triggers"]').on('change', function () {
                                    var settingDiv = $(SettingsBox).find('.g_triggers');
                                    if (this.checked) {
                                        settingDiv.slideDown('fast');
                                        setTimeout(function () {
                                            settingDiv[0].scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            });
                                        }, 100);
                                    }
                                    else
                                        settingDiv.slideUp('fast');
                                }).trigger('change');

                                var initialWidth = -1;
                                $(SettingsBox).find('[name="repeatdh"]').on('change', function (event, calledManually) {
                                    var repeatInterval = $(this).val();
                                    var elements = $(SettingsBox).find('.g_recur_interval');
                                    if (repeatInterval == 'i') {

                                        var bbMessage = '';

                                        if (initialWidth == -1) {
                                            initialWidth = elements.css('width');
                                        }
                                        elements.animate({
                                            width: 0
                                        });

                                        var newOrAll = document.getElementById(settingsID + 'repeatneworall');
                                        if (newOrAll.value == 'a') {
                                            newOrAll.value = 'n';
                                            bbMessage += 'We forced it to NEW rows. '
                                        }

                                        if (!calledManually)
                                            sdk.ButterBar.showMessage({ html: bbMessage + "In order for GMass to be able to detect new rows in your Google Sheet instantly, you must add a script to your Google Sheet. The exact instructions will be emailed to you after you launch your campaign. You can also see instructions here: <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/g/sheetinstant/\" target=\"_blog\">Add script to Google Sheet.</a>", time: 10000 });
                                    }
                                    else if (initialWidth != -1) {

                                        elements.animate({
                                            width: (initialWidth == '0px' ? '90px' : initialWidth)
                                        });
                                    }
                                });

                                var heightToSet = 0;
                                $(SettingsBox).find('.ab_send_percent').on('change input', function () {
                                    var val = $(this).val();
                                    $(SettingsBox).find('.ab_send_percent_value').text(val + '%');

                                    var testSettings = $(SettingsBox).find('.ab_test_settings');
                                    var overlay = $(SettingsBox).find('.ab_test_settings_overlay');

                                    if (val == 100) {
                                        if (heightToSet == 0) {
                                            heightToSet = testSettings.height();
                                        }
                                        testSettings.hide();
                                        overlay.height(heightToSet);
                                        overlay.show();
                                    } else {
                                        testSettings.show();
                                        overlay.hide();
                                    }

                                }).trigger('change');
                                $(SettingsBox)
                                    .off('click.addMessage')
                                    .on('click.addMessage', '.g2_add_message', function (e) {
                                        e.preventDefault();
                                        var stage = $(e.currentTarget).attr('data-stage');
                                        var AFTemplateToAddress = "";
                                        var AFTemplateCreator = new XMLHttpRequest();

                                        AFTemplateCreator.open(
                                            "GET",
                                            BaseURL + "gmass/generateaftemplate?"
                                            + "DraftID="      + ComposeDraftID
                                            + "&emailAddress=" + sdk.User.getEmailAddress()
                                            + "&GMassKey="     + encodeURIComponent(
                                                                localStorage.getItem(
                                                                    "GMassKey-" + sdk.User.getEmailAddress()))
                                            + (stage == -1 ? "&istrigger=true" : ""),
                                            true
                                        );

                                        AFTemplateCreator.send();
                                        AFTemplateCreator.onreadystatechange = function () {

                                            if (AFTemplateCreator.readyState == 4) {

                                                var AFResult = JSON.parse(AFTemplateCreator.responseText);
                                                if (AFResult.success) {
                                                    LaunchComposeCustomAF(AFResult.ToAddress, stage);
                                                }
                                            }
                                        };
                                    });
                                    $(SettingsBox)
                                        .off('click.refreshMessages')
                                        .on('click.refreshMessages', '.g2_refresh_messages', function (e) {
                                            e.preventDefault();
                                            var btn = $(this);
                                            var dd = $(this).parent().find('select');
                                            btn.prop('disabled', true);

                                            LoadCampaigns(function () {
                                                btn.prop('disabled', false);
                                                if (LoadedCampaigns) {
                                                    dd.find('option[value]').remove();

                                                    for (var i = 0; i < resultCampaigns.campaigns.length; i++) {
                                                        var op = sentCampaignToOption(resultCampaigns.campaigns[i]);
                                                        dd.append(op);
                                                    }
                                                    convertCampaignSelectToSelect2(dd, settingsID, {
                                                        templateResult:     formatCampaignDropDownItem,
                                                        templateSelection:  formatCampaignTextResult,
                                                        placeholder:        "Select message"
                                                    });
                                                }
                                            });
                                        });


                                $(SettingsBox).find('.g2_bump_ondemand').on('click', function (e) {
                                    e.preventDefault();
                                    var btn = $(this);
                                    var onDemandStage = btn.data('stage');
                                    var commonAncestor = btn.closest('.gmass-bump');
                                    var bumpAction = commonAncestor.find('.g_bump_action').val();

                                    var englishExplanationOfAction = turnIntoPlainEnglish(bumpAction);

                                    GMass.confirm({
                                        title: "Are you sure you want to do this?",
                                        message: "Proceeding will re-save your campaign (in case you made any changes) and then start sending auto follow-up stage " + onDemandStage + " to everyone who has received the prior stage and " + englishExplanationOfAction + `.<BR><BR>Using this function will ignored the timing properties (Stage Days and Time) that you have set for Stage ${onDemandStage} and send to the contacts that match the aforementioned behaviors now.<BR><BR><a href="https://www.gmass.co/blog/auto-follow-up-on-demand/" target="_blog">More information on this feature.</a>`,
                                        buttons: [
                                            {
                                                html: "Yes, I'm sure",
                                                class: 'success',
                                                result: 'yes'
                                            },
                                            {
                                                html: 'Cancel',
                                                class: 'danger',
                                                result: 'cancel'
                                            }
                                        ],
                                        callback: function (result) {
                                            if (result == 'yes') {
                                                ClickGMassButton(e, false, onDemandStage);

                                            }

                                        }
                                    });
                                });

                                $(SettingsBox).find('[name="DelayCheckbox"]').on('change', function () {
                                    $(SettingsBox).find('[name="PauseSeconds"]').prop('disabled', !this.checked);
                                }).trigger('change');

                                $(SettingsBox).find('.g_edit_html').on('click', function (e) {
                                    e.preventDefault();

                                    var html = composeView.getHTMLContent()

                                    var div = document.createElement('div');

                                    var textarea = document.createElement('textarea');
                                    textarea.style.width = 'calc(100vw - 200px)';
                                    textarea.style.height = 'calc(100vh - 400px)';
                                    textarea.style.padding = '10px';
                                    textarea.value = html;
                                    div.appendChild(textarea);
                                    var modal = sdk.Widgets.showModalView({
                                        el: div,
                                        title: 'Edit message HTML',
                                        buttons: [
                                            {
                                                text: 'Okay',
                                                type: 'PRIMARY_ACTION',
                                                onClick: function () {
                                                    composeView.setBodyHTML(textarea.value);
                                                    modal.close();
                                                }
                                            },
                                            {
                                                text: 'Cancel',
                                                type: 'SECONDARY',
                                                onClick: function () {
                                                    modal.close();
                                                }
                                            }
                                        ]
                                    });
                                });


                                $(SettingsBox).find('.g_message_gpt').on('click', function (e) {
                                    e.preventDefault();
                                    var div = document.createElement('div');
                                    const storedPrompt = localStorage.getItem("GMassCampaignPrompt") ?? '';
                                    const storedSentences = localStorage.getItem("GMassCampaignSentenceCount") ?? '7';
                                    const storedIncludeFollowups = (localStorage.getItem("GMassCampaignIncludeFollowups") === 'true');
                                    const storedStageCount = localStorage.getItem("GMassCampaignStageCount") ?? '5';
                                    const storedVariationText = localStorage.getItem("GMassVariationText") ?? '';
                                    const storedVariationCount = localStorage.getItem("GMassVariationCount") ?? '5';

                                    div.innerHTML = `
        <!-- Tabs navs -->
        <ul class="gmass-tabs" id="gchat-tabs" >
            <li class="gmass-tab-link" role="presentation">
                <a class="" id="gchat-tab-1" href="#gchat-tabs-1">Campaign Text</a>
            </li>
            <li class="gmass-tab-link" role="presentation">
                <a class="" id="gchat-tab-2" href="#gchat-tabs-2">Variations</a>
            </li>
        </ul>
        <!-- Tabs content -->
        <div class="gmass-tab-content">
            <div class="gmass-tab-pane" id="gchat-tabs-1">
                <p>
                    What is your campaign about?<br>
                    <textarea style="width:500px" placeholder="Selling SEO services to SaaS company owners">${storedPrompt}</textarea>
                </p>
                <p style="margin-top:2em;">
                    How many sentences should it be?<br>
                    <input id="numbersentences" type="number" max="30" min="1" value="${storedSentences}">
                </p>
                <p style="margin-top:2em;">
                    <div style="display:flex; gap:1em; align-items: center;">
                        <label class="g2_checkbox">
                            <input type="checkbox" ${storedIncludeFollowups ? 'checked' : ''}>
                            <span>Create a full email sequence of</span>
                        </label>
                        <input id="numberstages" type="number" max="25" min="1" value="${storedStageCount}">
                        <span>stages</span>
                    </div>
                </p>
            </div>
            <div class="gmass-tab-pane" id="gchat-tabs-2">
                <p>
                    What text do you want to vary?<br>
                    <textarea style="width:500px" placeholder="Hey there, I found your profile on LinkedIn">${storedVariationText}</textarea>
                </p>
                <p style="margin-top:2em;">
                    How many variations do you want?<br>
                    <input id="numbervariations" type="number" max="10" min="1" value="${storedVariationCount}">
                </p>
            </div>
        </div>
        <!-- Tabs content -->
    `;

                                    var pending = false;
                                    var modal = sdk.Widgets.showModalView({
                                        el: div,
                                        title: 'Generate content with AI',
                                        buttons: [
                                            {
                                                text: 'Okay',
                                                type: 'PRIMARY_ACTION',
                                                onClick: function () {

                                                    if ($('#gchat-tab-1').hasClass('active')) {
                                                        const wrap = $('#gchat-tabs-1');
                                                        var prompt = wrap.find('textarea').val();
                                                        if (pending || prompt.length == 0) return;

                                                        pending = true;
                                                        localStorage.setItem("GMassCampaignPrompt", prompt);
                                                        localStorage.setItem("GMassCampaignSentenceCount", wrap.find('#numbersentences').val());
                                                        localStorage.setItem("GMassCampaignIncludeFollowups", wrap.find('.g2_checkbox input[type="checkbox"]').prop('checked'));
                                                        localStorage.setItem("GMassCampaignStageCount", wrap.find('#numberstages').val());

                                                        this.innerHTML = 'Generating...';
                                                        $.post(`${BaseURL}/gmass/getcampaigntextfromchatgpt`,
                                                            {
                                                                emailaddress: sdk.User.getEmailAddress(),
                                                                gmasskey: localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()),
                                                                includeFollowups: wrap.find('.g2_checkbox input[type="checkbox"]').prop('checked'),
                                                                prompt: prompt,
                                                                sentencecount: wrap.find('#numbersentences').val(),
                                                                stagecount: wrap.find('#numberstages').val()
                                                            },
                                                            function (json) {
                                                                composeView.setSubject(json.Subject);
                                                                composeView.setBodyHTML(json.Message);

                                                                json.FollowUps.forEach((f, i) => {
                                                                    ensureBumps(i + 1);

                                                                    var followupsDiv = $(SettingsBox).find('.gmass-auto-follow-ups');
                                                                    var checkboxes = followupsDiv.find('.gmass-enable-bump');
                                                                    var textareas = followupsDiv.find('.g_bump_add_text');
                                                                    var radios = followupsDiv.find('[type="radio"][value="t"]');

                                                                    checkboxes.eq(i).prop('checked', true).parents('.gmass-bump').addClass('enabled').show();
                                                                    checkboxes[i].dispatchEvent(new Event('change'));
                                                                    textareas.eq(i).val(f);
                                                                    textareas[i].dispatchEvent(new Event('change'));
                                                                    radios.eq(i).trigger('click');
                                                                    radios[i].dispatchEvent(new Event('change'));
                                                                });

                                                                updateOvals($(SettingsBox).find('.g2_auto_follow_up'));
                                                                modal.close();
                                                            }, 'json');
                                                    } else {
                                                        const wrap = $('#gchat-tabs-2');
                                                        var prompt = wrap.find('textarea').val();
                                                        if (pending || prompt.length == 0) return;

                                                        pending = true;
                                                        localStorage.setItem("GMassVariationText", prompt);
                                                        localStorage.setItem("GMassVariationCount", wrap.find('#numbervariations').val());

                                                        this.innerHTML = 'Generating...';
                                                        $.post(`${BaseURL}/gmass/generatespintax`,
                                                            {
                                                                emailaddress: sdk.User.getEmailAddress(),
                                                                gmasskey: localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()),
                                                                text: prompt,
                                                                variationCount: wrap.find('#numbervariations').val(),
                                                            },
                                                            function (json) {
                                                                const spin = '{{spin}}' + json.join('{{variation}}') + '{{end spin}}';
                                                                composeView.insertTextIntoBodyAtCursor(spin);
                                                                modal.close();
                                                            }, 'json');
                                                    }
                                                }
                                            },
                                            {
                                                text: 'Cancel',
                                                type: 'SECONDARY',
                                                onClick: function () { modal.close(); }
                                            }
                                        ]
                                    });

                                    GMass.tabstrip(document.getElementById('gchat-tabs'));
                                    $('.gmasssdk__modal_content textarea').focus();
                                });


                                $(SettingsBox).find('.g_add_poll').on('click', function (e) {

                                    var div = document.createElement('div');

                                    var answers = [];
                                    var prompt = '';
                                    var composeDiv = composeView.getContentDiv();
                                    if (composeDiv.querySelector('.g_poll') != null) {
                                        var existingPoll = $(composeDiv.querySelector('.g_poll'));
                                        prompt = existingPoll.find('.g_prompt').text();
                                        existingPoll.find('.g_poll_response').each(function () {
                                            answers.push(this.innerHTML);
                                        });
                                    }

                                    if (answers.length == 0)
                                        answers = ['Yes', 'No'];

                                    div.innerHTML = `
                                        <p>
                                            What should the prompt be?
                                            <input type=text class="g_prompt" value="${prompt}" placeholder="Type a poll question" style="display:block; width:100%;">
                                        </p>
                                        <p style="margin-top:2em;">
                                            Now add some answers. We've provided yes/no as defaults.
                                        </p>
                                        <ul class="g_poll_responses">
                                        </ul>
                                    `;

                                    var ul = $(div).find('ul');
                                    ul.html('');
                                    answers.forEach(a => {
                                        ul.append(`
                                            <li style="display:flex; gap: 1em; margin-bottom:1em; justify-content: space-between; lign-items: center;">
                                                <input type=text style="width:100%; display:block" placeholder="Type a response" value="${a}">
                                                <div class="g_poll_buttons Kj-JD-Jl">
                                                    <button data-add="true" class="J-at1-auR" style="min-width:30px;padding:0; height: 32px;" href="#">+</a>
                                                    <button class="J-at1-auR" style="min-width:30px;padding:0; height: 32px;" href="#">-</a>
                                                </div>
                                            </li>
                                        `);
                                    });

                                    ul.on('click', 'button', function () {
                                        var add = $(this).data('add');
                                        var li = $(this).parents('li');

                                        if (add) {
                                            var ul = li.parent();
                                            var newLi = li.clone();
                                            ul.append(newLi);
                                            newLi.find('input').val('').focus();
                                        } else {
                                            li.remove();
                                        }
                                    });

                                    var modal = sdk.Widgets.showModalView({
                                        el: div,
                                        title: 'Add a poll to your email',
                                        buttons: [
                                            {
                                                text: 'Add the poll',
                                                type: 'PRIMARY_ACTION',
                                                onClick: function () {
                                                    prompt = $(div).find('.g_prompt').val();
                                                    var pollHtml = `<p class="g_prompt">${prompt}</p>                                                        `;

                                                    ul.find('input').each(function () {
                                                        var response = this.value;
                                                        if (response.length == 0)
                                                            return;

                                                        pollHtml += `<p><a class="g_poll_response" href="https://www.gpolls.net/poll/?e=${sdk.User.getEmailAddress()}&a=${encodeURIComponent(response)}">${response}</a></p>`;
                                                    });

                                                    var finalPollHtml = '<div class="g_poll">' + pollHtml + '</div>';
                                                    var composeDiv = composeView.getContentDiv();
                                                    if (composeDiv.querySelector('.g_poll') == null)
                                                        composeView.insertHTMLIntoBodyAtCursor(finalPollHtml);
                                                    else
                                                        composeDiv.querySelector('.g_poll').innerHTML = pollHtml;

                                                    modal.close();
                                                }
                                            },
                                            {
                                                text: 'Cancel',
                                                type: 'SECONDARY',
                                                onClick: function () {
                                                    modal.close();
                                                }
                                            }
                                        ]
                                    });
                                });


                                $(SettingsBox).find('.g_add_timer').on('click', function (e) {

                                    var div = document.createElement('div');

                                    let now = new Date();
                                    let offsetMinutes = AccountStatus.TimeZoneOffset || -now.getTimezoneOffset();
                                    let utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);
                                    let adjustedNow = new Date(utcNow.getTime() + offsetMinutes * 60 * 1000);
                                    adjustedNow.setDate(adjustedNow.getDate() + 1);
                                    let formattedDate = adjustedNow.toLocaleString('en-US', { hour12: false }).replace(',', '');
                                    let offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
                                    let offsetSign = offsetMinutes < 0 ? '-' : '+';
                                    let offset = offsetSign + ('00' + offsetHours).slice(-2) + ':' + ('00' + Math.abs(offsetMinutes % 60)).slice(-2);
                                    let tomorrow = formattedDate + ' ' + offset;

                                    console.log(tomorrow);

                                    div.innerHTML = `
                                        <p>
                                            How many hours?<br>
                                            <input type=text class="g_prompt" placeholder="Example: 24" style="display:block; width:100%;">
                                        </p>
                                        <p style="margin-top:2em;">
                                            Or specify end time:<br>
                                            <input type=text class=g_datetime value="${tomorrow}"  style="width:260px;">
                                        </p>
                                    `;

                                    var hourField = div.querySelector('.g_prompt');
                                    var datetimeField = div.querySelector('.g_datetime');



                                    var modal = sdk.Widgets.showModalView({
                                        el: div,
                                        title: 'Add a countdown',
                                        buttons: [
                                            {
                                                text: 'Add the countdown',
                                                type: 'PRIMARY_ACTION',
                                                onClick: function () {

                                                    $.getJSON(BaseURL + 'timer/addtimer',
                                                        {
                                                            emailaddress: sdk.User.getEmailAddress(),
                                                            hours: parseInt(hourField.value) || '0',
                                                            timeuntil: datetimeField.value,
                                                            GMassKey: localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())
                                                        },
                                                        function (ret) {
                                                            var timerGuid = ret.timerGuid;
                                                            var timerHtml = `<div class="g_timer"><img src="https://www.gmass.co/timer/getimage?uniqueid=${timerGuid}"></div>`;
                                                            composeView.insertHTMLIntoBodyAtCursor(timerHtml);
                                                            modal.close();

                                                        });



                                                }
                                            },
                                            {
                                                text: 'Cancel',
                                                type: 'SECONDARY',
                                                onClick: function () {
                                                    modal.close();
                                                }
                                            }
                                        ]
                                    });
                                    var minDate = new Date();
                                    minDate.setDate(minDate.getDate() - 1);
                                    var maxDate = new Date();
                                    maxDate.setMonth(maxDate.getMonth() + 3);
                                    GMass.dateTimePicker(datetimeField, {
                                        minDate: new Date(),
                                        maxDate: maxDate,
                                        message: '<p>Use the calendar and arrows to select a date and time. Times are in your local timezone.</p>'
                                    });

                                });


                                var newReplyRadios = $(SettingsBox).find('[name="' + settingsID + 'NewReplyRadio"]');
                                newReplyRadios.on('change', function () {
                                    var replies = newReplyRadios.filter(':checked').val() == 'y';
                                    $(SettingsBox).toggleClass('send-replies', replies);
                                    Reposition(300);
                                }).trigger('change');


                                $('#' + settingsID + 'Personalize').select2({
                                    dropdownParent: $('#' + settingsID + 'bigdiv'),
                                    width: "resolve",
                                    placeholder: ((GMassPersonalization.length > 0) ? "Select Field" : "Select Field")
                                });

                                $('#' + settingsID + 'Personalize').on('change', function (e) {
                                    var PersonalizationToken = document.getElementById(settingsID + "Personalize").value;
                                    CopyClipboard(PersonalizationToken);
                                    sdk.ButterBar.showMessage({ html: "The  personalization variable, <span style='color: #BFFFC5'>" + PersonalizationToken + "</span>, has been copied to your clipboard. Now you can PASTE it in your <span style='color: #BFFFC5'>Subject</span> or <span style='color: #BFFFC5'>Message</span>.", time: 10000 });

                                });
                                $(SettingsBox).find('#' + settingsID + 'TriggerOpenClear').on('click', function () {
                                    $('#' + settingsID + 'TriggerOpenCampaign').val(null).trigger('change');
                                });


                                $(SettingsBox).find('#' + settingsID + 'TriggerClickClear').on('click', function () {
                                    $('#' + settingsID + 'TriggerClickCampaign').val(null).trigger('change');
                                });
                                $(SettingsBox).find('#' + settingsID + 'TriggerReplyClear').on('click', function () {
                                    $('#' + settingsID + 'TriggerReplyCampaign').val(null).trigger('change');
                                });

                                $(SettingsBox).find('.g2_refresh_accounts').on('click', function (e) {
                                    e.preventDefault();
                                    LoadMultiSendAccounts(true)
                                });

                                $(SettingsBox).find('.link-multi-send').on('click', function (e) {
                                    e.preventDefault();

                                    if (composeView.MultiSendInterval > 10) {
                                        clearInterval(composeView.MultiSendInterval);
                                    }

                                    var url = BaseURL + "oauth/login?authlink=multisend&multisendaccountlink=" + sdk.User.getEmailAddress();

                                    var wLeft = window.screenLeft ? window.screenLeft : window.screenX;
                                    var wTop = window.screenTop ? window.screenTop : window.screenY;

                                    var left = wLeft + (window.innerWidth / 2) - (600 / 2);
                                    var top = wTop + (window.innerHeight / 2) - (800 / 2);

                                    window.open(url, 'MultiSendLinkAccount', 'width=600, height=800, top=' + top + ', left=' + left);
                                    var MultiSendIntervalCounter = 0;
                                    composeView.MultiSendInterval = setInterval(function () {
                                        if (MultiSendIntervalCounter == 60) {
                                            console.log('multisendinterval STOPPED');
                                            clearInterval(composeView.MultiSendInterval);
                                        }
                                        LoadMultiSendAccounts();
                                        MultiSendIntervalCounter++;
                                        console.log('multisendinterval RAN');
                                    }, 1000);

                                });
                                $(SettingsBox)
                                    .off('click.viewMessage')
                                    .on('click.viewMessage', '.g2_view_message', function () {

                                        var div             = $(this).parent('div');
                                        var messageSelect   = div.find('select');
                                        var messageId       = $(messageSelect).val();
                                        if (messageId == '' || !Number.isInteger(Number(messageId)))
                                            return;

                                        var div = document.createElement('div');
                                        div.innerHTML = 'Loading message content...' + messageId;
                                        $.get(
                                            BaseURL + 'gmass/ShowCustomAFFromExtension',
                                            {
                                                GMassKey:    encodeURIComponent(
                                                            localStorage.getItem(
                                                                'GMassKey-' + sdk.User.getEmailAddress())),
                                                campaignId:  messageId,
                                                emailAddress: sdk.User.getEmailAddress()
                                            },
                                            function (ret) {
                                                div.innerHTML = ret;
                                            }
                                        );

                                        sdk.Widgets.showModalView({
                                            el:    div,
                                            title: messageSelect.find('option:selected').text()
                                        });
                                    });


                                $(SettingsBox).off('click.editMessage').on('click.editMessage', '.g2_edit_message', function (e) {

                                    var div = $(this).parent('div');
                                    var messageSelect = div.find('select');

                                    var editType = $(e.currentTarget).attr('data-type');

                                    var messageId = $(messageSelect).val();
                                    if (messageId == '' || !Number.isInteger(Number(messageId)))
                                        return;

                                    sdk.ButterBar.showMessage({ html: "Loading your auto follow-up template...", time: 20000 });
                                    var xmlhttpHTMLEditAllowed = new XMLHttpRequest();
                                    xmlhttpHTMLEditAllowed.open("GET", BaseURL + "gmass/edittemplateallowed?emailAddress=" + sdk.User.getEmailAddress() + "&campaignId=" + messageId + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                                    xmlhttpHTMLEditAllowed.send();
                                    xmlhttpHTMLEditAllowed.onreadystatechange = function () {

                                        if (xmlhttpHTMLEditAllowed.readyState == 4) {

                                            var templateEditPermission = JSON.parse(xmlhttpHTMLEditAllowed.responseText);

                                            if (templateEditPermission.success) {
                                                var xmlhttpHTML = new XMLHttpRequest();
                                                xmlhttpHTML.open("GET", BaseURL + "gmass/gethtml?emailAddress=" + sdk.User.getEmailAddress() + "&campaignId=" + messageId + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                                                xmlhttpHTML.send();
                                                xmlhttpHTML.onreadystatechange = function () {

                                                    if (xmlhttpHTML.readyState == 4) {
                                                        var AFTemplateToAddress = "";
                                                        var AFTemplateCreator = new XMLHttpRequest();

                                                        AFTemplateCreator.open("GET", BaseURL + "gmass/generateaftemplate?" + "campaignid=" + messageId + "&DraftID=" + ComposeDraftID + "&emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + (editType == "trigger" ? "&istrigger=true" : ""), true);
                                                        AFTemplateCreator.send();
                                                        AFTemplateCreator.onreadystatechange = function () {

                                                            if (AFTemplateCreator.readyState == 4) {

                                                                var AFResult = JSON.parse(AFTemplateCreator.responseText);
                                                                if (AFResult.success) {
                                                                    var ContentStuff = JSON.parse(xmlhttpHTML.responseText);
                                                                    var toAFEditAddress = AFResult.ToAddress;
                                                                    sdk.Compose.openNewComposeView().then(function (composeviewobject) {
                                                                        composeviewobject.setSubject(ContentStuff.Subject);
                                                                        composeviewobject.setBodyHTML(ContentStuff.HTML);

                                                                        var attachmentsReminder = (ContentStuff.attachments != "" ? "<BR><BR><span style='color: #BFFFC5'>REMEMBER:</span> This campaign had <span style='color: #BFFFC5'>attachments</span> last time, and GMass can't automatically re-attach those files, but you can do it manually. Remember to attach: <span style='color: #BFFFC5'>" + ContentStuff.attachments + "</span>" : "");

                                                                        sdk.ButterBar.showMessage({ html: "You are now <span style='color: #BFFFC5'>editing</span> an existing " + (editType == "trigger" ? "trigger" : "auto followup") + " template. After you make your changes, <span style='color: #BFFFC5'>click the GMass button to save it</span>." + attachmentsReminder, time: 20000 });


                                                                    });
                                                                    ComposeTagger = toAFEditAddress;
                                                                }
                                                            }
                                                        };




                                                    }


                                                }
                                            }

                                            else {
                                                sdk.ButterBar.showMessage({ html: "You can't edit this auto followup template because you don't own it. It's being shared with you.", time: 20000 });

                                            }

                                        }
                                    }



                                });
                                $('#' + settingsID + 'PauseSeconds').val(GMassPauseSeconds);


                                var Debug = document.getElementById(settingsID + "Debug");
                                var ComposeFill = document.getElementById(settingsID + "ComposeFill");
                                var BreakDraftFree = document.getElementById(settingsID + "BreakDraftFreeLink");
                                var BDFText = document.getElementById(settingsID + "BDFText");
                                var RepeatDH = document.getElementById(settingsID + "repeatdh");
                                var RepeatNewOrAll = document.getElementById(settingsID + "repeatneworall");
                                var RepeatMode = document.getElementById(settingsID + "repeatmode");
                                var RecurEvery = document.getElementById(settingsID + "RecurEvery");
                                var RecurEveryLabel = document.getElementById(settingsID + "RecurEveryLabel");
                                var RecurToLabel = document.getElementById(settingsID + "RecurToLabel");
                                var RecurSheetLabel = document.getElementById(settingsID + "RecurSheetLabel");
                                var mainadvanced = document.getElementById(settingsID + "mainadvanced");
                                var mainspread = document.getElementById(settingsID + "mainspread");
                                var spreadfloater = document.getElementById(settingsID + "spreadfloater");
                                var advanceddiv = document.getElementById(settingsID + "advanceddiv");

                                var mainauto = document.getElementById(settingsID + "mainauto");
                                var floater = document.getElementById(settingsID + "GMassAFDisplay");
                                var overflow = document.getElementById(settingsID + "oa");
                                var divsmtp = document.getElementById(settingsID + "smtp");
                                var PreviewTextBox = document.getElementById(settingsID + "PreviewText");
                                var AccountStatusDiv = document.getElementById(settingsID + "AccountStatusDiv");

                                var VerifyBox = document.getElementById(settingsID + "Verify");
                                var AutoSpintaxBox = document.getElementById(settingsID + "AutoSpintax");

                                var SkipSentBox = document.getElementById(settingsID + "SkipSent");
                                var SuppressionAggressiveBox = document.getElementById(settingsID + "SuppressionAggressive");

                                var ABBox = document.getElementById(settingsID + "ABTest");
                                var TriggersBox = document.getElementById(settingsID + "Triggers");
                                var MultiSendCheckBox = document.getElementById(settingsID + 'MultiSend');

                                var ABFactorElement = document.getElementById(settingsID + "ABFactor");

                                if (ABFactorElement) {
                                    ABFactorElement.value = ABFactor;
                                }

                                if (MultiSendTokenIds != null) {
                                    MultiSendSetOptions(MultiSendTokenIds);
                                }

                                const accountStatusInterval = setInterval(function () {
                                    if (!AccountStatus)
                                        return;
                                    clearInterval(accountStatusInterval);
                                    AccountStatusDiv.innerHTML = AccountStatus.AccountStatus;
                                    if (AccountStatus.SMTPServer == null || AccountStatus.SMTPServer == '')
                                        AccountStatus.SMTPServer = 'SMTP Service';
                                    if (sdk.User.getEmailAddress() == "ajaygoel999@gmail.com" || sdk.User.getEmailAddress() == "meredithlawler@gmail.com") {
                                        AccountStatusDiv.innerHTML = "<a style=\"color: #e4e4e4\" href=\"http://www.ilovesmyhoney.com\">I love my wife</a>";
                                        AccountStatusDiv.style.backgroundColor = "red";
                                        AccountStatusDiv.style.color = "#f9ecec";
                                    }
                                    else if (AccountStatus.AccountStatus == "Premium") {
                                        AccountStatusDiv.style.backgroundColor = "gold";
                                        AccountStatusDiv.style.color = "black";
                                    }
                                    else if (AccountStatus.AccountStatus == "Standard") {
                                        AccountStatusDiv.style.backgroundColor = "green";
                                        AccountStatusDiv.style.color = "#f0fbf0";
                                    }
                                    else if (AccountStatus.AccountStatus == "Minimal") {
                                        AccountStatusDiv.style.backgroundColor = "blue";
                                        AccountStatusDiv.style.color = "#f8f8ff";
                                    }
                                    else if (AccountStatus.AccountStatus == "Comp") {
                                        AccountStatusDiv.style.backgroundColor = "purple";
                                        AccountStatusDiv.style.color = "#ffedff";
                                    }
                                    else if (AccountStatus.AccountStatus == "Free") {
                                        AccountStatusDiv.innerHTML = "<a style=\"color: #e4e4e4\" href=\"https://www.gmass.co/pricing?email=" + sdk.User.getEmailAddress() + "\">Free</a>";
                                        AccountStatusDiv.style.backgroundColor = "gray";
                                        AccountStatusDiv.style.color = "#e4e4e4";

                                    }
                                    else if (AccountStatus.AccountStatus == "Disconnected") {
                                        AccountStatusDiv.style.backgroundColor = "red";
                                        AccountStatusDiv.style.color = "#f9ecec";
                                        AccountStatusDiv.addEventListener('click', function () {
                                            LaunchAuth(sdk.User.getEmailAddress(), 1);
                                        });
                                    }

                                    if (AccountStatus.SMTPSendOption) {

                                        if (AccountStatus.SMTPServers && AccountStatus.SMTPServers.length > 0) {
                                            defaultSmtpServerIdFromServer = AccountStatus.DefaultSmtpServerId;
                                            if ((smtpServerId == null || !AccountStatus.SMTPServers.some(s => s.Id === Number(smtpServerId || NaN)))
                                                && SMTP == 'on'
                                                && smtpServerId != 0
                                                && defaultSmtpServerIdFromServer != 0) {
                                                smtpServerId = defaultSmtpServerIdFromServer;
                                            }

                                            const dd = $(SettingsBox).find('[name="SmtpServerId"]');
                                            AccountStatus.SMTPServers.forEach(s => {
                                                dd.append(`<option ${(smtpServerId == s.Id ? "selected" : "")} value="${s.Id}">${s.Name}  ${s.DefaultServer ? " (Default)" : ""}</option>`);
                                            });
                                        }

                                        if (SMTP == "notset") {
                                            SMTP = "on";
                                        }

                                        loadedSmtpDropdown = true;
                                    }

                                    setAllOvals();

                                    if (LogIntervals) { sdk.log("accountStatusInterval interval run"); }
                                }, 250);
                                var firstbumpbox = document.getElementById(settingsID + "1BumpBox");

                                var AutoSuppress = document.getElementById(settingsID + "AutoSuppress");
                                var ClearBumps = document.getElementById(settingsID + "ClearBumps");

                                if (!isComposeInlineReply) {
                                    var ContentDDSuppression = document.getElementById(settingsID + "suppression");
                                }
                                if (!isComposeInlineReply) {
                                    var arraySuppression = GMassSuppression.split(',');
                                }


                                var ContentDD = document.getElementById(settingsID + "ContentDD");
                                var ReplyDD = document.getElementById(settingsID + "ReplyMessage");

                                if (!isComposeInlineReply) {
                                    if (!(SkipWeekends == "on")) {
                                        document.getElementById(settingsID + 'SkipWeekendsDiv').style.display = 'none';
                                    }

                                    var ReplyToInterval = setInterval(function () {
                                        if (typeof resultReplyToAddresses != 'undefined' && GotState) {

                                            if (1 == 1) {
                                                sdk.log("about to start populating replyto addresses dropdown");
                                                clearInterval(ReplyToInterval);

                                                var arrayReplyToAddressesLength = resultReplyToAddresses.addresses.length;

                                                var FoundCurrentReplyToInDB = false;
                                                myreplytoaddressoption = document.createElement("option");
                                                myreplytoaddressoption.text = "None";
                                                myreplytoaddressoption.value = "0";
                                                ReplyToInput.add(myreplytoaddressoption);

                                                for (i = 0; i < (resultReplyToAddresses.addresses.length); i++) {

                                                    myreplytoaddressoption = document.createElement("option");

                                                    myreplytoaddressoption.text = resultReplyToAddresses.addresses[i].EmailAddress;
                                                    myreplytoaddressoption.value = resultReplyToAddresses.addresses[i].EmailAddress;

                                                    if (ValidateEmail(myReplyTo) && resultReplyToAddresses.addresses[i].EmailAddress == myReplyTo) {
                                                        FoundCurrentReplyToInDB = true;
                                                    }

                                                    if (ReplyToInput != null) {
                                                        ReplyToInput.add(myreplytoaddressoption);
                                                    }

                                                }
                                                if (ValidateEmail(myReplyTo) && !FoundCurrentReplyToInDB) {
                                                    myreplytoaddressoption = document.createElement("option");

                                                    myreplytoaddressoption.text = myReplyTo;
                                                    myreplytoaddressoption.value = myReplyTo;

                                                    if (ReplyToInput != null) {
                                                        ReplyToInput.add(myreplytoaddressoption);
                                                    }
                                                }
                                                if (ValidateEmail(myReplyTo)) {
                                                    $('#' + settingsID + 'replyto').val(myReplyTo);
                                                }

                                                $('#' + settingsID + 'replyto').select2({
                                                    dropdownParent: $('#' + settingsID + 'bigdiv'),
                                                    width: "style",
                                                    selectOnClose: true,
                                                    tags: true,
                                                    allowClear: true,
                                                    placeholder: "Enter a reply-to address",
                                                    createTag: function (params) {
                                                        if (params.term.indexOf('@') === -1) {
                                                            return null;
                                                        }

                                                        return {
                                                            id: params.term,
                                                            text: params.term
                                                        }
                                                    }
                                                });

                                                setAllOvals();

                                            }
                                        }

                                        if (LogIntervals) { sdk.log("reply to interval run"); }

                                    }, 100);
                                }

                                var RT1 = setInterval(function () {
                                    if (typeof resultTestAddresses != 'undefined') {
                                        if (1 == 1) {
                                            sdk.log("about to start populating test addresses dropdowns");
                                            clearInterval(RT1);

                                            var arrayTestAddressesLength = resultTestAddresses.testaddresses.length;

                                            for (i = 0; i < (resultTestAddresses.testaddresses.length); i++) {

                                                mytestaddressoption = document.createElement("option");

                                                mytestaddressoption.text = resultTestAddresses.testaddresses[i].EmailAddress;
                                                mytestaddressoption.value = resultTestAddresses.testaddresses[i].EmailAddress;


                                                if (TestAddressesField != null) {
                                                    TestAddressesField.add(mytestaddressoption);
                                                }


                                            }
                                            sdk.log("done populating test addresses dropdowns");

                                            $('#' + settingsID + 'TestEmailValue').val(myTestAddresses.split(','));

                                            const $emailSelect = $('#' + settingsID + 'TestEmailValue');
                                            $('#' + settingsID + 'TestEmailValue').select2({
                                                dropdownParent: $('#' + settingsID + 'bigdiv'),
                                                width: "style",
                                                selectOnClose: true,
                                                tags: true,
                                                tokenSeparators: [',', ' ', ';'],
                                                placeholder: "Enter a test address",
                                                createTag: function (params) {
                                                    const term = params.term.trim()
                                                                        .replace(/^[<>"']+|[<>"']+$/g, '');
                                                    if (!ValidateEmail(term)) return null;
                                                    const $existing = $emailSelect.find('option').filter(function () {
                                                        return this.value.toLowerCase() === term.toLowerCase();
                                                    });

                                                    if ($existing.length) {
                                                        const selected = ($emailSelect.val() || []).some(
                                                            v => v.toLowerCase() === term.toLowerCase()
                                                        );
                                                        if (!selected) {
                                                            $existing.prop('selected', true);
                                                            $emailSelect.trigger('change');
                                                        }
                                                        return null;
                                                    }
                                                    return { id: term, text: term };
                                                }
                                            });

                                        }
                                    }
                                    if (LogIntervals) { sdk.log("test addresses interval run"); }
                                }, 100);
                                composeView.RC1 = setInterval(function () {
                                    if (typeof resultCampaigns != 'undefined' && document.getElementById(settingsID)) {
                                        if (resultCampaigns.success) {
                                            sdk.log("about to start populating campaign dropdowns");
                                            clearInterval(composeView.RC1);

                                            SetCampaignDropDowns();

                                        }
                                        else {


                                        }
                                    }
                                    if (LogIntervals) { sdk.log("populate campaign dropdown interval run"); }
                                }, 100);

                                function turnIntoPlainEnglish(bumpAction) {
                                    switch (bumpAction) {
                                        case 'r':
                                            return "has NOT YET REPLIED";
                                        case 'o':
                                            return "has NOT YET OPENED";
                                        case 'c':
                                            return "has NOT YET CLICKED";
                                        case 's':
                                            return "has NEITHER REPLIED NOR CLICKED";
                                        case 'a':
                                            return "is a part of the campaign";
                                        default:
                                            return "[Unknown action]";
                                    }
                                }



                                var campaignOptionsHtml;
                                function SetCampaignDropDowns() {
                                    ensureCampaignSelectOptions(undefined, true);

                                    if (GMassReplyMessage !== null) {
                                        $('#' + settingsID + 'ReplyMessage').val(GMassReplyMessage);
                                    }

                                    if (TriggerOpenCampaignID != 0) {
                                        $('#' + settingsID + 'TriggerOpenCampaign').val(TriggerOpenCampaignID);
                                        $('#' + settingsID + 'TriggerOpenCampaign').trigger('change');
                                    }

                                    if (TriggerClickCampaignID != 0) {
                                        $('#' + settingsID + 'TriggerClickCampaign').val(TriggerClickCampaignID);
                                        $('#' + settingsID + 'TriggerClickCampaign').trigger('change');
                                    }

                                    if (TriggerReplyCampaignID != 0) {
                                        $('#' + settingsID + 'TriggerReplyCampaign').val(TriggerReplyCampaignID);
                                        $('#' + settingsID + 'TriggerReplyCampaign').trigger('change');
                                    }
                                    $(SettingsBox).find('.g-campaign-select').each(function () {
                                        var dd = $(this);
                                        var placeholder = dd.data('placeholder');
                                        convertCampaignSelectToSelect2(dd, settingsID, {
                                            templateResult: formatCampaignDropDownItem,
                                            templateSelection: formatCampaignTextResult,
                                            placeholder: placeholder
                                        });
                                    });

                                    $('#' + settingsID + 'ContentDD').on('change', function (e) {
                                        if (ContentDD.value != "0" && Number.isInteger(Number(ContentDD.value))) {
                                            var OldSelectedText = ContentDD[ContentDD.selectedIndex].text;
                                            var OldSelectedValue = ContentDD[ContentDD.selectedIndex].value;

                                            var xmlhttpHTML = new XMLHttpRequest();
                                            xmlhttpHTML.open("GET", BaseURL + "gmass/gethtml?emailAddress=" + sdk.User.getEmailAddress() + "&campaignId=" + ContentDD.value + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                                            xmlhttpHTML.send();
                                            ContentDD[ContentDD.selectedIndex].text = "Loading..."

                                            xmlhttpHTML.onreadystatechange = function () {

                                                if (xmlhttpHTML.readyState == 4) {

                                                    var NumberAFS = 0;
                                                    var SubjectMessageSet = false;

                                                    var ContentStuff = JSON.parse(xmlhttpHTML.responseText);

                                                    if (ContentStuff.success == false && ContentStuff.reason == "BadKey") {

                                                        sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                                        LaunchAuth(sdk.User.getEmailAddress(), 2);
                                                    }
                                                    if (ContentStuff.FirstBumpDays > 0 || ContentStuff.ScheduledData != null) {

                                                        var confirmMessage = "Which parts of this campaign do you want loaded?<BR><BR><input name='subjectmessage' id='subjectmessage' type='checkbox' value='subjectmessage' " + (localStorage.getItem("GMassSetSubjectMessage") == "true" ? "checked" : "") + ">&nbsp;<label for='subjectmessage'>Subject/Message</label>";

                                                        if (ContentStuff.FirstBumpDays > 0) {
                                                            confirmMessage += "&nbsp;&nbsp;&nbsp;<input name='afs' id='afs' type='checkbox' value='afs' " + (localStorage.getItem("GMassSetAFs") == "true" ? "checked" : "") + ">&nbsp;<label for='afs'>Auto Followups</label>";
                                                        }
                                                        if (ContentStuff.ScheduledData != null) {
                                                            confirmMessage += "&nbsp;&nbsp;&nbsp;<input name='settings' id='settings' type='checkbox' value='settings' " + (localStorage.getItem("GMassSetSettings") == "true" ? "checked" : "") + ">&nbsp;<label for='settings'>Settings</label>";
                                                        }


                                                        GMass.confirm({
                                                            title: "Load Campaign Template",
                                                            message: confirmMessage,
                                                            buttons: [{ html: 'Go!', result: 'go' }],
                                                            callback: function (result) {
                                                                if (result == undefined) {
                                                                    return;
                                                                }

                                                                var oneThingSet = false;

                                                                if (document.getElementById('subjectmessage').checked) {
                                                                    oneThingSet = true;
                                                                    localStorage.setItem("GMassSetSubjectMessage", "true");

                                                                    composeView.setBodyHTML(ContentStuff.HTML);
                                                                    composeView.setSubject(ContentStuff.Subject);
                                                                    if (PreviewTextBox) {
                                                                        PreviewTextBox.value = ContentStuff.PreviewText;
                                                                        FriendlyNameInput.value = ContentStuff.FriendlyName;
                                                                    }
                                                                    SubjectMessageSet = true;

                                                                    setAllOvals();

                                                                }
                                                                else {
                                                                    localStorage.setItem("GMassSetSubjectMessage", "false");
                                                                }
                                                                if (document.getElementById('settings') && document.getElementById('settings').checked) {
                                                                    oneThingSet = true;
                                                                    localStorage.setItem("GMassSetSettings", "true");

                                                                    var CampaignSettings = ContentStuff.ScheduledData;
                                                                    setSettingsFromDraftState(CampaignSettings, true, true)
                                                                    if (myOpenTracking == "on") {

                                                                        OpenTrackingCheckbox.checked = true;

                                                                    }
                                                                    else {
                                                                        OpenTrackingCheckbox.checked = false;
                                                                    }

                                                                    if (myClickTracking == "on") {

                                                                        ClickTrackingCheckbox.checked = true;
                                                                    }
                                                                    else {
                                                                        ClickTrackingCheckbox.checked = false;
                                                                    }
                                                                    const dropdown = $(SettingsBox).find('[name="SmtpServerId"]');
                                                                    const matchingOption = dropdown.find(`option[value="${smtpServerId ?? 0}"]`);
                                                                    if (matchingOption.length > 0) {
                                                                        dropdown.val(smtpServerId ?? 0);
                                                                    } else {
                                                                        console.warn('No matching option found for SmtpServerId:', smtpServerId);
                                                                        dropdown.val(defaultSmtpServerIdFromServer);
                                                                    }
                                                                    $(SettingsBox).find(`[name="${settingsID}DraftSaveSpeed"][value="${draftSaveSpeed}"]`).prop('checked', true);
                                                                    $(SettingsBox).find(`[name="${settingsID}SendSave"][value="${sendSave}"]`).prop('checked', true).trigger('click');
                                                                    if (!composeView.isInlineReplyForm()) {
                                                                        SkipWeekendsCheckbox.checked = SkipWeekends == "on";
                                                                        SkipHolidaysCheckbox.checked = SkipHolidays == "on"

                                                                        document.getElementById(settingsID + "MaxEmails").value = myMaxEmails;

                                                                        if (myDelay == "on") {
                                                                            DelayCheckbox.checked = true;

                                                                            PauseSeconds.value = GMassPauseSeconds;
                                                                        }
                                                                        else {
                                                                            DelayCheckbox.checked = false;
                                                                        }
                                                                        $(SettingsBox).find('[name="DelayCheckbox"]').trigger('change');


                                                                        if (GMassRecur == "on") {
                                                                            RecurCheckbox.checked = true;
                                                                            RepeatDH.value = RepeatTranslateToFrequency(GMassRecurDH);
                                                                            RepeatNewOrAll.value = RepeatTranslateToNewOrAll(GMassRecurDH);
                                                                            if (RepeatMode.style.visibility != "visible") {
                                                                                RepeatNewOrAll.value = "a";
                                                                            }

                                                                            RecurEvery.value = myRecurEvery;

                                                                            RepeatDH.disabled = false;
                                                                            RepeatNewOrAll.disabled = false;
                                                                            RecurEvery.style.color = "black";
                                                                            RecurEvery.disabled = false;
                                                                            RecurEveryLabel.style.color = "black";
                                                                            RecurToLabel.style.color = "black";
                                                                            RecurSheetLabel.style.color = "black";

                                                                        }
                                                                        else {
                                                                            RecurCheckbox.checked = false;

                                                                            RepeatDH.disabled = true;
                                                                            RepeatNewOrAll.disabled = true;
                                                                            RecurEvery.style.color = "gray";
                                                                            RecurEvery.disabled = true;
                                                                            RecurEveryLabel.style.color = "gray";
                                                                            RecurToLabel.style.color = "gray";
                                                                            RecurSheetLabel.style.color = "gray";
                                                                        }
                                                                        if (GMassSkipSent == "true") {
                                                                            SkipSentBox.checked = true;
                                                                        }
                                                                        else {
                                                                            SkipSentBox.checked = false;
                                                                        }

                                                                        if (SuppressionAggressive == "true") {
                                                                            SuppressionAggressiveBox.checked = true;
                                                                        }
                                                                        else {
                                                                            SuppressionAggressiveBox.checked = false;
                                                                        }

                                                                        if (GMassVerify == "true") {
                                                                            VerifyBox.checked = true;
                                                                        }
                                                                        else {
                                                                            VerifyBox.checked = false;
                                                                        }

                                                                        if (GMassAutoSpintax == "true") {
                                                                            AutoSpintaxBox.checked = true;
                                                                        } else {
                                                                            AutoSpintaxBox.checked = false;
                                                                        }

                                                                        if (GMassImages == "d") {
                                                                            ImageRadioDefault.checked = true;
                                                                        }
                                                                        else if (GMassImages == "r") {
                                                                            ImageRadioReferenced.checked = true;
                                                                        }
                                                                        else if (GMassImages == "e") {
                                                                            ImageRadioEmbedded.checked = true;
                                                                        }

                                                                        if (myReplyTo != "") {
                                                                            $('#' + settingsID + 'replyto').val(myReplyTo);
                                                                        }
                                                                        else {
                                                                            $('#' + settingsID + 'replyto').val("0");
                                                                        }
                                                                        $('#' + settingsID + 'replyto').select2().trigger('change');

                                                                        if (GMassBumpSuppression.length > 0) {

                                                                            var arrAutoSuppress = GMassBumpSuppression.split(',');
                                                                            for (var i = 0; i < arrAutoSuppress.length; i++) {
                                                                                if ($('#' + settingsID + 'AutoSuppress').find("option[value='" + arrAutoSuppress[i] + "']").length) {
                                                                                } else {
                                                                                    var newOption = new Option(arrAutoSuppress[i], arrAutoSuppress[i], true, true);
                                                                                    $('#' + settingsID + 'AutoSuppress').append(newOption).trigger('change');
                                                                                }
                                                                            }

                                                                            $('#' + settingsID + 'AutoSuppress').val(arrAutoSuppress);
                                                                        }
                                                                        else {
                                                                            $('#' + settingsID + 'AutoSuppress').empty();
                                                                        }
                                                                        $('#' + settingsID + 'AutoSuppress').trigger('change');

                                                                        if (mySuppressionDays > 0) {
                                                                            SuppressionDaysField.value = mySuppressionDays;
                                                                        }
                                                                        else {
                                                                            SuppressionDaysField.value = 0;
                                                                        }
                                                                        $('#' + settingsID + 'suppression').val(GMassSuppression.split(','));
                                                                        $('#' + settingsID + 'suppression').trigger('change');
                                                                        if (mySuppressionDays > 0 || GMassSuppression.length > 0 || GMassBumpSuppression.length > 0){
                                                                            $(SettingsBox)
                                                                            .find('[name="SuppressionOn"]')
                                                                            .prop('checked', true)
                                                                            .trigger('change');
                                                                        }
                                                                        else{
                                                                            $(SettingsBox)
                                                                            .find('[name="SuppressionOn"]')
                                                                            .prop('checked', false)
                                                                            .trigger('change');
                                                                        }



                                                                        if (GMassTriggerReplyPhrases.length > 0) {
                                                                            var dd = $('#' + settingsID + 'TriggerReplyPhrases');
                                                                            var arr = GMassTriggerReplyPhrases.split('|');
                                                                            arr.forEach(phrase => {
                                                                                var op = dd.find("option[value='" + phrase + "']");
                                                                                if (op.length) {
                                                                                    op.prop('selected', true);
                                                                                } else {
                                                                                    dd.append(new Option(phrase, phrase, true, true));
                                                                                }
                                                                            });

                                                                            $('#' + settingsID + 'TriggerReplyPhrases').val(arr);
                                                                        }
                                                                        else {
                                                                            $('#' + settingsID + 'TriggerReplyPhrases').empty();
                                                                        }

                                                                        if (myNewReply == "new") {
                                                                            NewRadio.checked = true;
                                                                        }
                                                                        else {
                                                                            ReplyRadio.checked = true;
                                                                            $('#' + settingsID + 'ReplyMessage').val(GMassReplyMessage);
                                                                            $('#' + settingsID + 'ReplyMessage').trigger('change');
                                                                        }
                                                                        newReplyRadios.trigger('change');
                                                                        if (ABTest == "true") {
                                                                            ABBox.checked = true;
                                                                            ABFactorElement.value = ABFactor;
                                                                            $(SettingsBox).find('.ab_send_percent').val(ABPercentage);
                                                                            $(SettingsBox).find(`[name="${settingsID}ABDecision"][value="${ABDecision}"]`).prop('checked', true);
                                                                            document.getElementById(settingsID + "ABTimeAfter").value = ABTimeAfter;
                                                                        }
                                                                        else {
                                                                            ABBox.checked = false;
                                                                        }
                                                                        $(SettingsBox).find('[name="ABTest"]').trigger('change');
                                                                        $(SettingsBox).find('.ab_send_percent').trigger('change');
                                                                        $(SettingsBox).find(`[name="${settingsID}ABDecision"]`).trigger('change');
                                                                        if (MultiSendBox == "on") {
                                                                            MultiSendSetOptions(MultiSendTokenIds);
                                                                            document.getElementById(settingsID + 'MultiSend').checked = true;
                                                                            LoadMultiSendAccounts(true);
                                                                        }
                                                                        else {
                                                                            document.getElementById(settingsID + 'MultiSend').checked = false;
                                                                            MultiSendSetOptions('');
                                                                            LoadMultiSendAccounts(true);
                                                                        }

                                                                        if (SendDaysOn == 'on') {
                                                                            document.getElementById(settingsID + 'SendDaysOn').checked = true;
                                                                            LoadWeekdays(true);
                                                                        }
                                                                        else {
                                                                            document.getElementById(settingsID + 'SendDaysOn').checked = false;
                                                                        }

                                                                        if (EndTimeBox == "on") {
                                                                            document.getElementById(settingsID + 'EndTimeBox').checked = true;
                                                                            $('#' + settingsID + 'EndTime').val(EndTime);
                                                                        }
                                                                        else{
                                                                            document.getElementById(settingsID + 'EndTimeBox').checked = false;
                                                                        }
                                                                        if (Triggers == true || Triggers == "true") {
                                                                            document.getElementById(settingsID + 'Triggers').checked = true;
                                                                            $('#' + settingsID + 'TriggerOpenCampaign').val(TriggerOpenCampaignID == 0 ? null : TriggerOpenCampaignID);
                                                                            $('#' + settingsID + 'TriggerClickCampaign').val(TriggerClickCampaignID == 0 ? null : TriggerClickCampaignID);
                                                                            $('#' + settingsID + 'TriggerReplyCampaign').val(TriggerReplyCampaignID == 0 ? null : TriggerReplyCampaignID);

                                                                            $('#' + settingsID + 'TriggerOpenThreaded')[0].checked = (TriggerOpenThreadedValue == "on");
                                                                            $('#' + settingsID + 'TriggerClickThreaded')[0].checked = (TriggerClickThreadedValue == "on");
                                                                            $('#' + settingsID + 'TriggerReplyThreaded')[0].checked = (TriggerReplyThreadedValue == "on");

                                                                            $('#' + settingsID + 'TriggerOpenDelay').val(TriggerOpenDelayValue);
                                                                            $('#' + settingsID + 'TriggerClickDelay').val(TriggerClickDelayValue);
                                                                            $('#' + settingsID + 'TriggerReplyDelay').val(TriggerReplyDelayValue);

                                                                        }
                                                                        else {
                                                                            document.getElementById(settingsID + 'Triggers').checked = false;
                                                                            $('#' + settingsID + 'TriggerOpenCampaign').val(null);
                                                                            $('#' + settingsID + 'TriggerClickCampaign').val(null);
                                                                            $('#' + settingsID + 'TriggerReplyCampaign').val(null);

                                                                            $('#' + settingsID + 'TriggerOpenThreaded')[0].checked = false;
                                                                            $('#' + settingsID + 'TriggerClickThreaded')[0].checked = false;
                                                                            $('#' + settingsID + 'TriggerReplyThreaded')[0].checked = false;

                                                                            $('#' + settingsID + 'TriggerOpenDelay').val(0);
                                                                            $('#' + settingsID + 'TriggerClickDelay').val(0);
                                                                            $('#' + settingsID + 'TriggerReplyDelay').val(0);
                                                                        }
                                                                        $('#' + settingsID + 'Triggers').trigger('change');
                                                                        $('#' + settingsID + 'TriggerOpenCampaign').trigger('change');
                                                                        $('#' + settingsID + 'TriggerClickCampaign').trigger('change');
                                                                        $('#' + settingsID + 'TriggerReplyCampaign').trigger('change');
                                                                        $(SettingsBox).find('.TriggerOpenInstantly').prop('checked', TriggerOpenDelayValue <= 0);
                                                                        $(SettingsBox).find('.TriggerClickInstantly').prop('checked', TriggerClickDelayValue <= 0);
                                                                        $(SettingsBox).find('.TriggerReplyInstantly').prop('checked', TriggerReplyDelayValue <= 0);
                                                                        $('#' + settingsID + 'TriggerOpenInstantly').trigger('change');
                                                                        $('#' + settingsID + 'TriggerClickInstantly').trigger('change');

                                                                        $(SettingsBox).find('[name="MultiSend"]').trigger('change');
                                                                        $(SettingsBox).find('[name="SendDaysOn"]').trigger('change');
                                                                        $(SettingsBox).find('[name="EndTimeBox"]').trigger('change');

                                                                    }

                                                                }
                                                                else {
                                                                    localStorage.setItem("GMassSetSettings", "false");
                                                                }



                                                                if (document.getElementById('afs') && document.getElementById('afs').checked) {
                                                                    oneThingSet = true;
                                                                    localStorage.setItem("GMassSetAFs", "true");
                                                                    if (ContentStuff != null) {
                                                                        var ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];
                                                                        ordinals.forEach((o, i) => {
                                                                            Object.keys(ContentStuff).forEach(k => {
                                                                                if (k.indexOf('Bump') < 0)
                                                                                    return;
                                                                                ContentStuff[k.replace(o, i + 1)] = ContentStuff[k];
                                                                            });
                                                                        });

                                                                        let bump = 1;
                                                                        while (ContentStuff[bump + 'BumpDays'] > 0) {

                                                                            ensureBumps(bump);

                                                                            const days = ContentStuff[bump + 'BumpDays'];
                                                                            const action = ContentStuff[bump + 'BumpAction'];
                                                                            const campaignId = ContentStuff[bump + 'BumpCampaignID'];
                                                                            const addedText = ContentStuff[bump + 'BumpAddedText'];
                                                                            const choice = ContentStuff[bump + 'BumpChoice'];
                                                                            const time = ContentStuff[bump + 'BumpTime'];
                                                                            const NOT = ContentStuff['BNOT' + bump];
                                                                            $(SettingsBox).find(`#${settingsID}${bump}BumpBox`).prop('checked', true);
                                                                            $(SettingsBox).find(`#${settingsID}${bump}BumpAction`).val(action);
                                                                            $(SettingsBox).find(`#${settingsID}${bump}BumpDays`).val(days);
                                                                            $(SettingsBox).find(`#${settingsID}${bump}BumpTime`).val(time);
                                                                            if (time != null && time !== '') {
                                                                                $('#' + settingsID + bump + 'bump').addClass('set-time');
                                                                            }
                                                                            else {
                                                                                $('#' + settingsID + bump + 'bump').removeClass('set-time');
                                                                            }

                                                                            if (choice === 't') {
                                                                                $(SettingsBox)
                                                                                    .find(`#${settingsID}${bump}BumpChoicet`)
                                                                                    .prop('checked', true)
                                                                                    .trigger('change');
                                                                            } else {
                                                                                $(SettingsBox)
                                                                                    .find(`#${settingsID}${bump}BumpChoicec`)
                                                                                    .prop('checked', true)
                                                                                    .trigger('change');
                                                                                displayEyeAFDropdown(bump);
                                                                            }

                                                                            $(SettingsBox).find(`#${settingsID}${bump}BumpAddedText`).val(addedText);
                                                                            $(SettingsBox).find(`#${settingsID}${bump}SameNew`).val(NOT);
                                                                            const ddCampaign = $(SettingsBox).find(`#${settingsID}${bump}BumpCustom`);
                                                                            const campaignEntry = ddCampaign.find(`option[value="${campaignId}"]`);
                                                                            if (campaignEntry.length === 0) {
                                                                                ddCampaign.append(`<option value="${campaignId}">Campaign ${campaignId}</option>`);
                                                                            }
                                                                            ddCampaign.val(campaignId);

                                                                            bump++;
                                                                        }
                                                                        ensureBumps(bump);
                                                                    }
                                                                    $('#' + settingsID + 'bigdiv .gmass-enable-bump').trigger('refresh');
                                                                    var acc = $(firstbumpbox).parents('.g_accordian');
                                                                    if (!$(acc).attr("class").includes("open")) {
                                                                        $(acc).addClass("open");
                                                                    }

                                                                }
                                                                else {
                                                                    localStorage.setItem("GMassSetAFs", "false");
                                                                }

                                                                var setSettings = document.getElementById('settings') && document.getElementById('settings').checked;

                                                                if (oneThingSet) {
                                                                    sdk.ButterBar.showMessage({ html: LoadCampaignBBMessage(SubjectMessageSet, NumberAFS, ContentStuff, setSettings), time: 10000 });
                                                                }
                                                                else {
                                                                    sdk.ButterBar.showMessage({ html: "You didn't choose anything.", time: 10000 });
                                                                }
                                                                setAllOvals();

                                                            }


                                                        });




                                                    }
                                                    else {
                                                        composeView.setBodyHTML(ContentStuff.HTML);
                                                        composeView.setSubject(ContentStuff.Subject);
                                                        if (PreviewTextBox) {
                                                            PreviewTextBox.value = ContentStuff.PreviewText;
                                                            FriendlyNameInput.value = ContentStuff.FriendlyName;
                                                        }
                                                        SubjectMessageSet = true;
                                                        sdk.ButterBar.showMessage({ html: LoadCampaignBBMessage(SubjectMessageSet, NumberAFS, ContentStuff, false), time: 10000 });

                                                        setAllOvals();
                                                    }


                                                }

                                            }
                                        }
                                    });

                                    if (!isComposeInlineReply) {

                                        $('#' + settingsID + 'suppression').val(GMassSuppression.split(','));
                                        convertCampaignSelectToSelect2($('#' + settingsID + 'suppression'), settingsID, {
                                            templateResult: formatCampaignText,
                                            templateSelection: formatCampaignTextResultSuppress,
                                            placeholder: "People in these campaigns"
                                        });
                                        $('#' + settingsID + 'AutoSuppress').select2({
                                            tags: true,
                                            minimumResultsForSearch: Infinity,
                                            dropdownCssClass: 'suppress-select2 :all:',
                                            selectionCssClass: 'suppress-select2 :all:',
                                            multiple: true,
                                            placeholder: 'These domains and email addresses',
                                            tokenSeparators: [',', ' ', ';', '\t'],
                                            createTag: function (params) {

                                                params.term = params.term.trim();
                                                if (params.term.length > 0 && params.term[0] == '@')
                                                    params.term = params.term.substring(1);
                                                if (!ValidateEmail(params.term) && !ValidateDomain(params.term))
                                                    return null;

                                                return {
                                                    id: params.term,
                                                    text: params.term
                                                }
                                            },
                                            insertTag: function (data, tag) {
                                                data.push(tag);
                                            }
                                        });

                                        $('#' + settingsID + 'TriggerReplyPhrases').select2({
                                            tags: true,
                                            minimumResultsForSearch: Infinity,
                                            dropdownCssClass: 'suppress-select2 :all:',
                                            selectionCssClass: 'suppress-select2 :all:',
                                            multiple: true,
                                            placeholder: 'These specific phrases',
                                            tokenSeparators: ['\n', '\t'],
                                            createTag: function (params) {
                                                params.term = params.term.trim();
                                                return {
                                                    id: params.term,
                                                    text: params.term
                                                }
                                            },
                                            insertTag: function (data, tag) {
                                                data.push(tag);
                                            }
                                        });

                                        $('#' + settingsID + 'AutoSuppress').on('change', function () {
                                            GMassBumpSuppression = $(this).val();
                                            if ($.isArray(GMassBumpSuppression))
                                                GMassBumpSuppression = GMassBumpSuppression.join(',');
                                            if (GMassBumpSuppression == null) { GMassBumpSuppression = ""; }
                                        });

                                        $('#' + settingsID + 'TriggerOpenCampaign').on('change', function (e) {
                                            TriggerOpenCampaignID = $('#' + settingsID + 'TriggerOpenCampaign').val();
                                            if (TriggerOpenCampaignID == null) {
                                                TriggerOpenCampaignID = 0;
                                            }

                                            displayEyeTriggerDropdown('Open');
                                        }).trigger('change');

                                        $('#' + settingsID + 'TriggerClickCampaign').on('change', function (e) {
                                            TriggerClickCampaignID = $('#' + settingsID + 'TriggerClickCampaign').val();
                                            if (TriggerClickCampaignID == null) {
                                                TriggerClickCampaignID = 0;
                                            }

                                            displayEyeTriggerDropdown('Click');
                                        }).trigger('change');

                                        $('#' + settingsID + 'TriggerReplyCampaign').on('change', function (e) {
                                            TriggerReplyCampaignID = $('#' + settingsID + 'TriggerReplyCampaign').val();
                                            if (TriggerReplyCampaignID == null) {
                                                TriggerReplyCampaignID = 0;
                                            }

                                            displayEyeTriggerDropdown('Reply');
                                        }).trigger('change');
                                        $('#' + settingsID + 'suppression').on('change', function (e) {
                                            GMassSuppression = $('#' + settingsID + 'suppression').val().join(",");
                                            if (GMassSuppression == null) { GMassSuppression = ""; }

                                        });
                                    }
                                }



                                function updateOvals(div) {
                                    var ovalDiv = div.find('.g_show_on_collapse');
                                    var arr = [];

                                    div.find('input[data-oval][type="radio"]:checked').each(function () {
                                        arr.push($(this).attr('data-oval'));
                                    });
                                    div.find('input[data-oval][type="checkbox"]:checked').each(function () {
                                        arr.push($(this).data('oval'));
                                    });
                                    div.find('select[data-oval]').each(function () {
                                        var v = $(this).val();
                                        if ((v && v.length && v != '0') || (this.name == 'suppression' && GMassSuppression != ''))
                                            arr.push($(this).data('oval'));
                                    });
                                    div.find('input[data-oval][type="text"], input[data-oval][type="number"], input[data-oval][type="search"]').each(function () {
                                        var v = $(this).val();
                                        if (v && v.length && v != '0' && v != 'max')
                                            arr.push($(this).data('oval'));
                                    });

                                    if (div.hasClass('g2_action')) {
                                        saveFormData();
                                        arr = [];
                                        if (formData['SendSave'] == 'send') {
                                            arr.push('send emails');
                                            if (formData.SmtpServerId > 0)
                                                arr.push('with ' + $(SettingsBox).find('[name="SmtpServerId"] option:checked').text())
                                        }
                                        else {
                                            arr.push('create drafts');
                                            if (formData.DraftSaveSpeed == 'limited')
                                                arr.push('per sending limits');
                                            else
                                                arr.push('all at once');
                                        }


                                    }

                                    ovalDiv.html(arr.filter(x => x && x.length).map(x => `<span class="g_oval">${x}</span>`).join(''));
                                }




                                function setAllOvals() {
                                    var div = $('#' + settingsID + 'bigdiv');

                                    if (!composeView.isInlineReplyForm()) {
                                        updateOvals(div.find('.g2_advanced'));
                                    }

                                    updateOvals(div.find('.g2_auto_follow_up'));
                                    updateOvals(div.find('.g2_tracking'));
                                    updateOvals(div.find('.g2_action'));
                                    updateOvals(div.find('.g2_schedule'));

                                }

                                if (Debug != null) {

                                    Debug.addEventListener('click', function () {
                                        saveFormData();
                                        sdk.ButterBar.showMessage({ html: '<a href="' + GenerateSendURL().replace("https://extsend.gmass.us", "http://localhost:47540") + '">here</a>' });

                                    });

                                }
                                if (ComposeFill != null) {
                                    ComposeFill.addEventListener('click', function () {

                                        composeView.setToRecipients(["briansmith8477@gmail.com", "ajaygoel999@gmail.com", "ajaygoel8477@gmail.com", "ianziering8477@gmail.com"]);
                                        composeView.setSubject("Test Message: " + Date());

                                    });
                                }

                                if (BreakDraftFree != null) {

                                    BreakDraftFree.addEventListener('click', function () {

                                        if (ComposeDraftID != "") {
                                            BDFText.innerHTML = "Breaking...";

                                            var xmlBF = new XMLHttpRequest();
                                            xmlBF.open("GET", BaseURL + "gmass/breakdraftfree?emailaddress=" + sdk.User.getEmailAddress() + "&draftid=" + ComposeDraftID);
                                            xmlBF.send();

                                            xmlBF.onreadystatechange = function () {
                                                if (xmlBF.readyState == 4) {

                                                    if (xmlBF.status == 200 && JSON.parse(xmlBF.responseText).success) {

                                                        BDFText.innerHTML = "Done!";
                                                        sdk.ButterBar.showMessage({ html: 'Success! Your DRAFT has been broken free of this thread. Please click your DRAFTS folder to reload everything.' });

                                                    }
                                                    else if (xmlBF.responseText.includes("Not Found")) {
                                                        var DraftToRecips = composeView.getToRecipients();
                                                        var DraftCcRecips = composeView.getCcRecipients();
                                                        var emailToRecips = DraftToRecips.map(function (item) {
                                                            return item['emailAddress'];
                                                        });
                                                        var emailCcRecips = DraftCcRecips.map(function (item) {
                                                            return item['emailAddress'];
                                                        });
                                                        LaunchCompose(emailToRecips.concat(emailCcRecips));

                                                        sdk.ButterBar.showMessage({ html: "Success! We've launched a new Compose for you with everyone in the To line." });
                                                        BDFText.innerHTML = "Done!";

                                                    }
                                                    else {
                                                        sdk.ButterBar.showMessage({ html: 'Sorry! For some reason we could not break your DRAFT free from this thread.' });
                                                        BDFText.innerHTML = "Break Draft Free";
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            sdk.ButterBar.showMessage({ html: 'Oops! Please type a few characters in the Message area, wait about 3 seconds, and then try again.' });
                                        }


                                    });

                                }

                                if (IsScheduled && getBumpSettings().length > 0) {
                                    ClearBumps.addEventListener('click', function () {
                                        $(SettingsBox).find('.gmass-enable-bump').prop('checked', false);
                                        $('#' + settingsID + 'bigdiv .gmass-enable-bump').first().trigger('refresh');
                                        sdk.ButterBar.showMessage({ html: "Your auto follow-up settings have been cleared. You still need to hit the GMass button to save these settings.", time: 10000 });
                                    });
                                }
                                if (GMassBumpSuppression != "" && AutoSuppress != null) {
                                    var tags = GMassBumpSuppression.split(',');
                                    tags.forEach(tag => {
                                        $('#' + settingsID + 'AutoSuppress').append('<option value="' + tag + '">' + tag + '</option>')
                                    });
                                    $('#' + settingsID + 'AutoSuppress').val(tags).trigger('change');
                                }
                                if (GMassTriggerReplyPhrases != "") {
                                    var tags = GMassTriggerReplyPhrases.split('|');
                                    tags.forEach(tag => {
                                        $('#' + settingsID + 'TriggerReplyPhrases').append('<option selected value="' + tag + '">' + tag + '</option>')
                                    });
                                }
                                setAllOvals();
                                $(SettingsBox).off('change.modifyAction').on('change.modifyAction', '.g_bump_action', function () {

                                    if (this.value == 'a') {
                                        sdk.ButterBar.showMessage({ html: "Keep in mind that choosing 'Everyone' will send the follow-up to everyone in the original campaign, not just the people who didn't reply/open/click.<BR><BR>Additionally, if you're using custom content, and you're sending a series of training emails that should be sent regardless of any action the recipient takes, you may want to set the email to go as a NEW thread. <a style='color: #99FFFF' href='https://www.gmass.co/blog/auto-follow-up-emails-until-reply/#behavior' target='_gmassblog'>More information.</a>", time: 10000 });
                                    }
                                    else if (this.value == 'c' || this.value == 's') {

                                        var chkClickTracking = $(SettingsBox).find('[name$="ClickTracking"]');

                                        if (!chkClickTracking.prop('checked')) {
                                            chkClickTracking.prop('checked', true);
                                            myClickTracking = "on";
                                            var ForceClickTrack = true;
                                        }
                                        var BBClick = "Before using this option, make sure you have at least one trackable link in your email. <a style='color: #99FFFF' href='http://www.gmass.co/blog/weve-changed-how-click-tracking-works-to-avoid-false-phishing-detection/' target='_gmassblog'>Not all links are trackable.</a>";
                                        if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                        sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                    }
                                });
                                $('.gmass-enable-bump').trigger('refresh');
                                $('#' + settingsID + 'bigdiv').prop('scrollTop', 0);


                                var RecurCheckbox = document.getElementById(settingsID + "Recur");

                                if (RepeatDH != null) {
                                    RepeatDH.value = RepeatTranslateToFrequency(GMassRecurDH);
                                    $(RepeatDH).trigger('change', [false]);

                                    RepeatDH.addEventListener('change', function () {
                                        GMassRecurDH = RepeatTranslateToCharacter(RepeatDH.value, RepeatNewOrAll.value);

                                    });
                                }

                                if (RepeatNewOrAll != null) {

                                    RepeatNewOrAll.value = RepeatTranslateToNewOrAll(GMassRecurDH);

                                    RepeatNewOrAll.addEventListener('change', function () {
                                        if (RepeatNewOrAll.value == 'a' && RepeatDH.value == 'i') {
                                            RepeatNewOrAll.value = 'n';
                                            sdk.ButterBar.showMessage({ html: "You can't choose the ALL ROWS option with the Instantly option. You must choose NEW ROWS with the Instantly option.", time: 10000 });

                                        }
                                        GMassRecurDH = RepeatTranslateToCharacter(RepeatDH.value, RepeatNewOrAll.value);

                                    });
                                }

                                if (RecurCheckbox != null) {

                                    if (GMassRecur == "on") {
                                        RecurCheckbox.checked = true;
                                        RepeatDH.disabled = false;
                                        RepeatNewOrAll.disabled = false;
                                        RecurEvery.style.color = "black";
                                        RecurEvery.disabled = false;
                                        RecurEveryLabel.style.color = "black";
                                        RecurToLabel.style.color = "black";
                                        RecurSheetLabel.style.color = "black";
                                    }
                                    else if (GMassRecur == "off" || GMassRecur == "default") {
                                        RecurCheckbox.checked = false;
                                        RepeatDH.disabled = true;
                                        RepeatNewOrAll.disabled = true;
                                        RecurEvery.style.color = "gray";
                                        RecurEvery.disabled = true;
                                        RecurEveryLabel.style.color = "gray";
                                        RecurToLabel.style.color = "gray";
                                        RecurSheetLabel.style.color = "gray";
                                    }

                                    RecurCheckbox.addEventListener('click', function () {

                                        if (RecurCheckbox.checked) {
                                            if (RepeatNewOrAll.value == "a") {
                                                sdk.ButterBar.showMessage({ html: "Use the 'Repeat' setting to <span style='color: #BFFFC5'>repeat this campaign</span> to the <span style='color: #BFFFC5'>same set of people</span> at your chosen time interval. This is used for 'reminder' emails. <span style='color: #BFFFC5'>Example:</span> an apartment building sending a <span style='color: #BFFFC5'>reminder to all tenants to pay rent</span> on the 1st of every month. <a style='color: #99FFFF' href='https://www.gmass.co/blog/recurring-reminder-emails/' target='_blog'>More information.</a>", time: 10000 });
                                            }
                                            else if (RepeatNewOrAll.value == "n") {
                                                sdk.ButterBar.showMessage({ html: "Use the 'Repeat' setting with <span style='color: #BFFFC5'>'just new'</span> to have GMass <span style='color: #BFFFC5'>check your Sheet for new rows</span>, at your chosen time interval, and <span style='color: #BFFFC5'>send this email to those new addresses</span>. Alternately, choose <span style='color: #BFFFC5'>'all'</span> and this campaign will <span style='color: #BFFFC5'>send to the same set of people</span> at your chosen time interval, for 'reminder' campaigns. <a style='color: #99FFFF' href='https://www.gmass.co/blog/new-feature-recurring-automated-email-campaigns-with-gmail-and-google-sheets/' target='_blog'>More information.</a>", time: 10000 });
                                            }
                                            GMassRecur = "on";
                                            RepeatDH.disabled = false;
                                            RepeatNewOrAll.disabled = false;
                                            RecurEvery.style.color = "black";
                                            RecurEvery.disabled = false;
                                            RecurEveryLabel.style.color = "black";
                                            RecurToLabel.style.color = "black";
                                            RecurSheetLabel.style.color = "black";
                                        }
                                        else {
                                            GMassRecur = "off";
                                            RepeatDH.disabled = true;
                                            RepeatNewOrAll.disabled = true;
                                            RecurEvery.style.color = "gray";
                                            RecurEvery.disabled = true;
                                            RecurEveryLabel.style.color = "gray";
                                            RecurToLabel.style.color = "gray";
                                            RecurSheetLabel.style.color = "gray";
                                        }

                                    });


                                    if (ShowSheetRecurringOptions) {
                                        if (!IsScheduled && !IsSaved) {
                                            RepeatNewOrAll.value = "n";
                                            GMassRecurDH = RepeatTranslateToCharacter(RepeatDH.value, RepeatNewOrAll.value);
                                        }
                                        RepeatMode.style.visibility = "visible";


                                    }
                                    else {
                                        if (!IsScheduled && !IsSaved) {
                                            RepeatNewOrAll.value = "a";
                                            GMassRecurDH = RepeatTranslateToCharacter(RepeatDH.value, RepeatNewOrAll.value);
                                        }

                                        document.getElementById(settingsID + 'repeatdh').remove(4);
                                    }
                                }

                                var OpenTrackingCheckbox = document.getElementById(settingsID + "OpenTracking");
                                OpenTrackingCheckbox.addEventListener('click', function () {

                                    if (OpenTrackingCheckbox.checked) {
                                        myOpenTracking = "on";
                                    }
                                    else {
                                        myOpenTracking = "off";
                                    }

                                });

                                var ClickTrackingCheckbox = document.getElementById(settingsID + "ClickTracking");
                                ClickTrackingCheckbox.addEventListener('click', function () {

                                    if (ClickTrackingCheckbox.checked) {
                                        myClickTracking = "on";
                                    }
                                    else {
                                        myClickTracking = "off";
                                    }

                                });

                                if (!isComposeInlineReply) {

                                    VerifyBox.addEventListener('click', function () {
                                        if (VerifyBox.checked) {
                                            sdk.ButterBar.showMessage({ html: "With Verify ON, we will attempt to make sure each email address is valid before we send to it. If an address isn't valid we'll skip it. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/email-verification-service/\" target=\"_blog\">More information.</a>", time: 10000 });
                                        }
                                    });

                                    AutoSpintaxBox.addEventListener('click', function () {
                                        if (AutoSpintaxBox.checked) {
                                            sdk.ButterBar.showMessage({
                                                html: "With SpinMax ON, GMass will spin your email subject and message automatically to create unique variations for each recipient. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/g/spinmax\" target=\"_blog\">More information on SpinMax.</a>",
                                                time: 10000
                                            });
                                        }
                                    });

                                    document.getElementById(settingsID + 'EndTimeBox').addEventListener('click', function () {
                                        if (document.getElementById(settingsID + 'EndTimeBox').checked) {
                                            sdk.ButterBar.showMessage({
                                                html: "By setting a campaign end time, GMass will pause your campaign at the designated 'end time' and resume sending on the next allowable day. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/g/endtime\" target=\"_blog\">More information on End Times.</a>",
                                                time: 10000
                                            });
                                        }
                                    });

                                    ABBox.addEventListener('click', function () {
                                        if (ABBox.checked) {
                                            sdk.ButterBar.showMessage({ html: "Looks like you want to A/B test your campaign. Super! <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/ab-test/\" target=\"_blog\">Here's a guide if you need help.</a>", time: 10000 });

                                        }

                                    });

                                    TriggersBox.addEventListener('click', function () {
                                        if (TriggersBox.checked) {
                                            sdk.ButterBar.showMessage({ html: "Looks like you want to set triggers for your campaign. This is a new GMass feature as of July 2023. A trigger email is an additional email that is sent immediately when your recipient opens or clicks or replies to your campaign. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/triggered-emails/\" target=\"_blog\">Our full guide to triggers.</a>", time: 10000 });

                                        }

                                    });

                                    MultiSendCheckBox.addEventListener('click', function () {
                                        if (MultiSendCheckBox.checked) {
                                            sdk.ButterBar.showMessage({ html: "MultiSend, also called Inbox Rotation, is an advanced feature that distributes your campaign over multiple Gmail accounts. It allows you to send higher volume campaigns. <a style='color: #99FFFF' href='https://www.gmass.co/blog/multisend-distributed-campaigns/' target='_gmassblog'>More information.</a>", time: 10000 });

                                        }

                                    });

                                    SkipSentBox.addEventListener('click', function () {
                                        if (SkipSentBox.checked) {
                                            sdk.ButterBar.showMessage({ html: "Checking this box will prevent logging your emails to your Sent folder. It is not recommended that you do this, but in certain situations, it is useful to keep your Sent folder tidy. Make sure you understand the consequences first. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/skip-logging-emails-to-sent-folder/\" target=\"_blog\">More information.</a>", time: 15000 });

                                        }

                                    });

                                    PreviewTextBox.addEventListener('click', function () {

                                        sdk.ButterBar.showMessage({ html: "Setting preview text is a way to show your recipient some text next to your Subject line as they're scrolling through their Inbox. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/preview-text/\" target=\"_blog\">Learn about preview text</a>", time: 15000 });

                                    });

                                    var ReplyToInput = document.getElementById(settingsID + "replyto");


                                    var FriendlyNameInput = document.getElementById(settingsID + "friendlyname");


                                    FriendlyNameInput.addEventListener('change', function () {

                                        FriendlyNameInput.value = FriendlyNameInput.value.trim();

                                        myFriendlyName = FriendlyNameInput.value;
                                        sdk.log("myFriendlyName=" + myFriendlyName);




                                    });

                                    var SkipWeekendsCheckbox = document.getElementById(settingsID + "SkipWeekends");
                                    if (SkipWeekendsCheckbox != null) {
                                        SkipWeekendsCheckbox.addEventListener('click', function () {

                                            if (SkipWeekendsCheckbox.checked) {
                                                SkipWeekends = "on";
                                                sdk.ButterBar.showMessage({ html: "Curious? Read more about how the <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/skip-weekends/\" target=\"_blog\">Skip Weekends</a> setting works.", time: 10000 });
                                            }
                                            else {
                                                SkipWeekends = "off";
                                            }

                                        });
                                    }
                                    var SkipHolidaysCheckbox = document.getElementById(settingsID + "SkipHolidays");
                                    if (SkipHolidaysCheckbox != null) {
                                        SkipHolidaysCheckbox.addEventListener('click', function () {
                                            SkipHolidays = SkipHolidaysCheckbox.checked ? "on" : "off";

                                            if (SkipHolidaysCheckbox.checked) {
                                                sdk.ButterBar.showMessage({ html: "GMass defines certain holidays as standard holidays, but you can also fully customize which days are considered holidays in your dashboard. Read more about how the <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/skip-holidays/\" target=\"_blog\">Skip Holidays</a> setting works.", time: 10000 });
                                            }
                                        });
                                    }
                                    LoadWeekdays();
                                    var NewRadio = document.getElementById(settingsID + "NewRadio");
                                    NewRadio.addEventListener('click', function () {
                                        myNewReply = "new";
                                    });
                                    var ReplyRadio = document.getElementById(settingsID + "ReplyRadio");
                                    ReplyRadio.addEventListener('click', function () {
                                        myNewReply = "reply";
                                        sdk.ButterBar.showMessage({ html: "<span style=\"color: red\">WARNING:</span> Are you sure this is what you want? This will cause your email to go out as part of last conversation you had with each recipient. The Subject you have entered will be ignored and the Subject of the most recent conversation will be used instead. <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/blog/send-email-campaign-as-reply-to-recent-conversation/\" target=\"_blog\">More information.</a>", time: 10000 });
                                    });

                                    $('#' + settingsID + 'ReplyMessage').on('change', function (e) {
                                        GMassReplyMessage = $('#' + settingsID + 'ReplyMessage').val();
                                    });
                                    var ImageRadioDefault = document.getElementById(settingsID + "ImageRadioDefault");
                                    ImageRadioDefault.addEventListener('click', function () {
                                        GMassImages = "d";
                                    });
                                    var ImageRadioReferenced = document.getElementById(settingsID + "ImageRadioReferenced");
                                    ImageRadioReferenced.addEventListener('click', function () {
                                        GMassImages = "r";
                                    });
                                    var ImageRadioEmbedded = document.getElementById(settingsID + "ImageRadioEmbedded");
                                    ImageRadioEmbedded.addEventListener('click', function () {
                                        GMassImages = "e";
                                    });


                                    var DelayCheckbox = document.getElementById(settingsID + "DelayCheckbox");
                                    DelayCheckbox.addEventListener('click', function () {

                                        if (DelayCheckbox.checked) {
                                            myDelay = "on";
                                        }
                                        else {
                                            myDelay = "off";
                                        }

                                    });

                                    var PauseSeconds = document.getElementById(settingsID + "PauseSeconds");
                                    PauseSeconds.addEventListener('change', function () {

                                        GMassPauseSeconds = PauseSeconds.value;

                                    });


                                    TestButton = document.getElementById(settingsID + "TestEmailButton");
                                    TestButton.addEventListener('click', function () {
                                        saveFormData();
                                        if (composeView.getSubject() != "") {

                                            if (document.getElementById(settingsID + "TestEmailValue").value != "") {

                                                if (formData['send-test-type-draft'] == "draft") {
                                                    TestButton.innerHTML = "Drafting...";
                                                    sdk.ButterBar.showMessage({ text: "Creating test DRAFTS...", time: 10000 });
                                                }
                                                else {
                                                    TestButton.innerHTML = "Sending...";
                                                    sdk.ButterBar.showMessage({ text: "Sending test email...", time: 10000 });
                                                }
                                                TestButton.disabled = true;

                                                if (ComposeDraftID != "") {

                                                    var composeSubject = composeView.getSubjectAltMethod();
                                                    composeView.saveDraftAlternate();
                                                    SendTestEmail(ComposeDraftID, myTestAddresses, composeSubject);

                                                }
                                                else {

                                                    sdk.ButterBar.showMessage({ text: "You were a bit too fast. Wait a second and hit that button again.", time: 10000 });
                                                    TestButton.innerHTML = "Send Test Email";
                                                    TestButton.disabled = false;
                                                }

                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Please specify at least one test email address. You may separate multiple test addresses with a comma.", time: 10000, className: "redbb" });

                                            }
                                        }
                                        else {
                                            sdk.ButterBar.showMessage({ html: "You must specify a Subject before sending a test email.", time: 60000, className: "redbb" });
                                        }
                                    });

                                    $(SettingsBox).find('.send-test-options').on('click', function (e) {
                                        $(this).toggleClass('expanded');
                                        var optionsPanel = $(SettingsBox).find('.g_send_test_options');
                                        optionsPanel.toggle($(this).hasClass('expanded'));
                                        e.preventDefault();
                                    });
                                    document.body.addEventListener('click', function (e) {
                                        var optionsPanel = $(SettingsBox).find('.g_send_test_options')[0];
                                        var sendTestOptionsButton = $(SettingsBox).find('button.send-test-options');

                                        if (!sendTestOptionsButton.hasClass('expanded'))
                                            return;

                                        if (e.target == sendTestOptionsButton[0])
                                            return;

                                        if (!optionsPanel.contains(e.target)) {
                                            sendTestOptionsButton.removeClass('expanded');
                                            $(optionsPanel).hide();
                                        }
                                    });

                                    var SeedListButton = document.getElementById(settingsID + "SeedListButton");

                                    if (SeedListButton != null) {
                                        SeedListButton.addEventListener('click', function () {
                                            if (composeView.getSubject() != "") {



                                                if (ComposeDraftID != "") {
                                                    SpamSolver(ComposeDraftID);
                                                }
                                                else {
                                                    sdk.ButterBar.showMessage({ text: "You were a bit too fast. Wait a second and hit that button again.", time: 10000 });
                                                }

                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "You must specify a Subject before sending to the seeds.", time: 60000, className: "redbb" });
                                            }
                                        });
                                    }

                                    var AnalyzerButton = document.getElementById(settingsID + "Analyzer");

                                    if (AnalyzerButton != null) {
                                        AnalyzerButton.addEventListener('click', function () {
                                            if (composeView.getSubject() != "") {



                                                if (ComposeDraftID != "") {
                                                    AnalyzeThis(ComposeDraftID);
                                                }
                                                else {
                                                    sdk.ButterBar.showMessage({ text: "You were a bit too fast. Wait a second and hit that button again.", time: 10000 });
                                                }

                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "You must specify a Subject before analyzing your email.", time: 60000, className: "redbb" });
                                            }
                                        });
                                    }

                                    var LinkCheckerButton = document.getElementById(settingsID + "LinkChecker");

                                    if (LinkCheckerButton != null) {
                                        LinkCheckerButton.addEventListener('click', function () {

                                            openPopupPage(composeView.getHTMLContent());

                                        });
                                    }
                                }


                                var select = document.getElementById(settingsID + "GMassDateDropdown");
                                select.addEventListener('change', DateTimeSelected);
                                DateTimeSelected();

                                var datetimeField = document.getElementById(settingsID + "GMassDateTime");
                                datetimeField.addEventListener('change', UserModifiedDateTime);
                                var minDate = new Date();
                                minDate.setDate(minDate.getDate() - 1);
                                var maxDate = new Date();
                                maxDate.setMonth(maxDate.getMonth() + 3);
                                GMass.dateTimePicker(datetimeField, {
                                    minDate: new Date(),
                                    maxDate: maxDate,
                                    message: '<p>Use the calendar and arrows to select a date and time. Times are in your local timezone.</p>'
                                });

 


                                if (select.value == "Now") {
                                    $(datetimeField).parent().removeClass('expanded');
                                }

                                if (!isComposeInlineReply) {
                                    var SuppressionDaysField = document.getElementById(settingsID + "SuppressionDays");

                                    SuppressionDaysField.addEventListener('blur', function () {
                                        UserModifiedSuppressionDays();
                                    });

                                    var MaxEmailsField = document.getElementById(settingsID + "MaxEmails");

                                    MaxEmailsField.addEventListener('blur', function () {
                                        UserModifiedMaxEmails(sdk.User.getEmailAddress(), MultiSendBox);
                                    });
                                    if (RecurEvery.value == "1") {
                                    }

                                    RecurEvery.addEventListener('blur', function () {
                                        RecurEvery.value = RecurEvery.value.trim();
                                        if (RecurEvery.value == "") {
                                            RecurEvery.value = "1";

                                        }
                                        UserModifiedRecurEvery(RepeatDH);
                                    });

                                    RecurEvery.addEventListener('focus', function () {
                                    });

                                    var TestAddressesField = document.getElementById(settingsID + "TestEmailValue");
                                    $('#' + settingsID + 'TestEmailValue').on('change', function (e) {

                                        myTestAddresses = $('#' + settingsID + 'TestEmailValue').val();
                                        if (myTestAddresses == null) { myTestAddresses = ""; } else { myTestAddresses = myTestAddresses.join(); localStorage.setItem("myTestAddresses", myTestAddresses); }
                                    });
                                }

                                $('#' + settingsID + 'replyto').on('change', function (e) {

                                    myReplyTo = $('#' + settingsID + 'replyto').val().trim();
                                    if (!ValidateEmail(myReplyTo)) {
                                        myReplyTo = "";
                                        localStorage.setItem("myReplyTo", "");
                                    }
                                    else {
                                        localStorage.setItem("myReplyTo", myReplyTo);
                                    }

                                });

                                var unsubel = document.getElementById("unsubcopy");
                                if (unsubel != null) {
                                    unsubel.addEventListener('click', function () {
                                        CopyClipboard("https://www.gmass.co/gmass/u?u=OUTBOUND");
                                        sdk.ButterBar.showMessage({ html: "The GMass unsubscribe URL has been copied to your clipboard. Now you can set any text in your campaign to be your unsubscribe link by highlighting it and clicking the 'Insert link' icon in the Compose toolbar and pasting the URL in.", time: 10000 });

                                    });
                                }

                                var buttons2 = Array.from(document.getElementsByClassName('GMassFieldUnsub'));
                                buttons2.forEach(function (button2) {
                                    button2.addEventListener('click', function () { InsertFieldUnsub(button2, composeView); });
                                });

                                if (IsScheduled) {
                                    var PauseResumeButton = document.getElementById(settingsID + "pauseresumecampaign");
                                    var PauseConfirmMessage = "";
                                    var PauseResumeTitle = "";

                                    PauseResumeButton.addEventListener('click', function () {

                                        var pauseresumebuttons = [];

                                        if (IsPaused && PauseResumeButton.innerHTML.includes("Resume")) {
                                            PauseConfirmMessage = "Are you sure you want to RESUME this GMass campaign? If you click OK, you campaign will continue sending on the schedule you've set.";
                                            PauseResumeTitle = "Resume Campaign";

                                        }
                                        else {
                                            if (getBumpSettings().length > 0) {
                                                PauseConfirmMessage = "Are you sure you want to PAUSE this GMass campaign? You have a choice of pausing just the original campaign, or also pausing auto follow-ups that haven't yet sent to people that have already received the original campaign message.";
                                            }
                                            else {
                                                PauseConfirmMessage = "Are you sure you want to PAUSE this GMass campaign? If you click OK, you campaign will stop sending until you RESUME it.";
                                            }
                                            PauseResumeTitle = "Pause Campaign";

                                        }

                                        pauseresumebuttons.push({
                                            html: PauseResumeTitle,
                                            class: 'danger',
                                            result: 'yes'
                                        });

                                        if ((getBumpSettings().length > 0) && PauseResumeButton.innerHTML.includes("Pause")) {
                                            pauseresumebuttons.push({
                                                html: "Pause campaign and pause auto follow-ups",
                                                class: 'danger',
                                                result: 'af'
                                            });
                                        }

                                        pauseresumebuttons.push({
                                            html: "Cancel"
                                        });

                                        GMass.confirm({
                                            title: PauseResumeTitle,
                                            message: PauseConfirmMessage,
                                            buttons: pauseresumebuttons,
                                            callback: function (result) {
                                                if (result == 'yes' || result == 'af') {

                                                    if (IsPaused) {
                                                        sdk.ButterBar.showMessage({ text: "Resuming GMass campaign...", time: 60000 });
                                                        saveFormData();

                                                        var gmassurlresume = GenerateSendURL(ComposeDraftID) + "&resume=true";
                                                        ConnectToGMass(gmassurlresume);

                                                    }
                                                    else {

                                                        if (result == 'yes') {
                                                            sdk.ButterBar.showMessage({ text: "Pausing GMass campaign...", time: 60000 });
                                                        }
                                                        else if (result == 'af') {
                                                            sdk.ButterBar.showMessage({ text: "Pausing GMass campaign and auto follow-ups...", time: 60000 });
                                                        }

                                                        var xmlPauseResume = new XMLHttpRequest();
                                                        xmlPauseResume.open("GET", BaseURL + "gmass/pauseresumecampaign?pauseresume=" + (IsPaused && PauseResumeButton.innerHTML.includes("Resume") ? "r" : (result == "yes" ? "p" : "q")) + "&emailaddress=" + sdk.User.getEmailAddress() + "&DraftID=" + ComposeDraftID);
                                                        xmlPauseResume.send();

                                                        xmlPauseResume.onreadystatechange = function () {
                                                            if (xmlPauseResume.readyState == 4) {
                                                                var PauseResumeResult = JSON.parse(xmlPauseResume.responseText);
                                                                if (PauseResumeResult.success) {
                                                                    if (!PauseResumeResult.Paused) {
                                                                        IsPaused = false;
                                                                        PauseResumeButton.innerHTML = "Pause Campaign";
                                                                    }
                                                                    else if (PauseResumeResult.Paused) {
                                                                        IsPaused = true;
                                                                        PauseResumeButton.innerHTML = "Resume Campaign";
                                                                    }
                                                                    else {
                                                                        PauseResumeButton.innerHTML = "Error";
                                                                    }
                                                                    sdk.ButterBar.showMessage({ html: PauseResumeResult.PauseResumeMessage, time: 10000 });
                                                                }
                                                                else {
                                                                    PauseResumeButton.innerHTML = "Error";
                                                                    sdk.ButterBar.showMessage({ html: PauseResumeResult.PauseResumeMessage + " Error: " + PauseResumeResult.error, time: 10000, className: "redbb" });
                                                                }
                                                            }

                                                        }
                                                    }
                                                }
                                            }
                                        });




                                    });

                                    var CancelCampaignButton = document.getElementById(settingsID + "cancelcampaign");
                                    CancelCampaignButton.addEventListener('click', function () {

                                        var startTime = new Date().getTime();

                                        $.getJSON(BaseURL + 'gmass/CancelStatus?draftid=' + ComposeDraftID, function (data) {

                                            var cancelbuttons = [];

                                            if (!data.IsCancelledAlready) {

                                                cancelbuttons.push({
                                                    html: 'Cancel campaign',
                                                    class: 'danger',
                                                    result: 'cancel-campaign'
                                                });
                                            }

                                            if (data.HasBumps) {

                                                cancelbuttons.push(
                                                    {
                                                        html: 'Cancel campaign and auto followups',
                                                        class: 'danger',
                                                        result: 'cancel-all'
                                                    });

                                            }


                                            cancelbuttons.push(

                                                {
                                                    html: 'Do nothing'
                                                }
                                            );


                                            GMass.confirm({
                                                title: "Cancel Campaign",
                                                message: "Are you sure you want to cancel this GMass campaign and stop sending this email to your list?" + (getBumpSettings().length > 0 ? "<BR><BR>There are auto follow-ups that are part of this campaign, which you can choose to let either a) continue to send to those that have already received the original campaign message, or b) cancel." : ""),
                                                buttons: cancelbuttons,
                                                callback: function (result) {
                                                    if (result == 'cancel-campaign' || result == 'cancel-all') {

                                                        sdk.ButterBar.showMessage({ text: "Cancelling GMass campaign...", time: 60000 });
                                                        var xmlCancel = new XMLHttpRequest();
                                                        xmlCancel.open("GET", BaseURL + "gmass/cancelcampaign?emailaddress=" + sdk.User.getEmailAddress() + "&DraftID=" + ComposeDraftID + "&CancelAF=" + (result == 'cancel-all' ? "true" : "false"));
                                                        xmlCancel.send();


                                                        xmlCancel.onreadystatechange = function () {
                                                            if (xmlCancel.readyState == 4) {
                                                                var CancelResult = JSON.parse(xmlCancel.responseText);
                                                                if (CancelResult.success) {
                                                                    var CancelMessage = "You've canceled the campaign.";
                                                                    if (CancelResult.AF) {
                                                                        CancelMessage += " Your campaign still has auto follow-up emails that will send to those that already received the campaign. <a style=\"color: #99FFFF\" target=\"_blog\" href=\"https://www.gmass.co/blog/how-to-cancel-or-edit-auto-follow-ups/\">Learn how to cancel the auto follow-ups.</a>"
                                                                    }
                                                                    sdk.ButterBar.showMessage({ html: CancelMessage, time: 10000 });
                                                                    composeView.close();
                                                                    composeView.dispatch('destroy');
                                                                }
                                                                else {
                                                                    sdk.ButterBar.showMessage({ html: "Something went wrong. Your campaign may not have been canceled. Error: " + CancelResult.error, time: 10000, className: "redbb" });
                                                                }
                                                            }

                                                        }
                                                    } else {

                                                        var endTime = new Date().getTime();

                                                        if ((endTime - startTime) < 50) {
                                                            sdk.ButterBar.showMessage({ html: varAlertDisabledMessage, time: 10000, className: "redbb" });
                                                        }
                                                    }
                                                }
                                            });


                                        });






                                    });

                                    var SaveCampaignButton = document.getElementById(settingsID + "savecampaign");
                                    SaveCampaignButton.addEventListener('click', function () {

                                        ClickGMassButton();

                                    });


                                }

                                var GetCampaignStatusLink = document.getElementById(settingsID + "getcampaignstatus");
                                if (GetCampaignStatusLink != null) {
                                    GetCampaignStatusLink.addEventListener('click', function () {

                                        DisplayCampaignSentStatus(ComposeDraftID, composeView);

                                    });
                                }

                                if (!isComposeInlineReply) {
                                    var checkusagelink = document.getElementById(settingsID + "checkusage");
                                    checkusagelink.addEventListener('click', function () {

                                        sdk.ButterBar.showMessage({ text: "Counting how many emails you've sent...", time: 60000 });
                                        var xmlUsage = new XMLHttpRequest();
                                        xmlUsage.open("GET", BaseURL + "gmass/getuser24hourcount?emailaddress=" + sdk.User.getEmailAddress());
                                        xmlUsage.send();
                                        xmlUsage.onreadystatechange = function () {
                                            if (xmlUsage.readyState == 4) {
                                                var UsageResult = JSON.parse(xmlUsage.responseText);
                                                if (sdk.User.getEmailAddress().indexOf("gmail.com") > 0 || sdk.User.getEmailAddress().indexOf("googlemail.com") > 0) {
                                                    var StillAllowed = 500 - parseInt(UsageResult.GmailCount);
                                                }
                                                else {
                                                    var StillAllowed = 2000 - parseInt(UsageResult.GmailCount);
                                                }
                                                if (StillAllowed < 0) {
                                                    StillAllowed == 0;
                                                }
                                                sdk.ButterBar.showMessage({ html: "You've sent " + (parseInt(UsageResult.GmailCount) - 10).toString() + "-" + UsageResult.GmailCount + " total emails over the last 24 hours, and " + UsageResult.GMassCount + " with GMass. This means you can send about " + StillAllowed + " emails right now, if your account has a good reputation with Gmail. See <a style=\"color: #99FFFF\" href=\"https://gmass.co/g/limits\" target=\"_limits\">this article about sending limits</a>.", time: 10000 });
                                            }

                                        }

                                    });
                                }

                                sdk.log("done adding event handling for settings box");

                                SettingsFormed = true;
                            }


                            if (LogIntervals) { sdk.log("settings interval run"); }
                        }, 100);




                    }

                    function GetWeekDayNumeric(Weekday) {
                        if (Weekday == 'Saturday') {
                            return '1';
                        }
                        else if (Weekday == 'Sunday') {
                            return '2';
                        }
                        else if (Weekday == 'Monday') {
                            return '3';
                        }
                        else if (Weekday == 'Tuesday') {
                            return '4';
                        }
                        else if (Weekday == 'Wednesday') {
                            return '5';
                        }
                        else if (Weekday == 'Thursday') {
                            return '6';
                        }
                        else if (Weekday == 'Friday') {
                            return '7';
                        }
                    }

                    function displayEyeAFDropdown(whichBump) {
                        var myThis = $('#' + settingsID + whichBump + 'BumpCustom');
                        var div = myThis.parent('div');
                        var viewButton = div.find('.g2_view_message');
                        var editButton = div.find('.g2_edit_message');
                        viewButton.toggle(myThis.val() != '' && myThis.val() != null);
                        editButton.toggle(myThis.val() != '' && myThis.val() != null);
                    }

                    function displayEyeTriggerDropdown(whichEvent) {
                        var myThis = $('#' + settingsID + 'Trigger' + whichEvent + 'Campaign');
                        var div = myThis.parent('div');
                        var viewButton = div.find('.g2_view_message');
                        var editButton = div.find('.g2_edit_message');
                        viewButton.toggle(myThis.val() != '' && myThis.val() != null);
                        editButton.toggle(myThis.val() != '' && myThis.val() != null);

                        if (whichEvent == 'Click') {
                            var clearButton = $(SettingsBox).find('#' + settingsID + 'TriggerClickClear');
                            clearButton.toggle(myThis.val() != '' && myThis.val() != null);
                        }
                        if (whichEvent == 'Open') {
                            var clearButton = $(SettingsBox).find('#' + settingsID + 'TriggerOpenClear');
                            clearButton.toggle(myThis.val() != '' && myThis.val() != null);
                        }
                        if (whichEvent == 'Reply') {
                            var clearButton = $(SettingsBox).find('#' + settingsID + 'TriggerReplyClear');
                            clearButton.toggle(myThis.val() != '' && myThis.val() != null);
                        }
                    }


                    function saveFormData() {
                        var div = $('#' + settingsID + 'bigdiv');
                        const tmp = {}
                        let foundData = false;
                        div.find('textarea, select, input[type="text"], input[type="search"], input[type="radio"]:checked, input[type="number"], input[type="range"], input[type="checkbox"]:checked').each(function () {
                            let id = this.id;
                            if (id.startsWith(settingsID))
                                id = id.substring(settingsID.length);
                            if (id == '')
                                id = this.name;
                            if (id.startsWith(settingsID))
                                id = id.substring(settingsID.length);
                            if (id) {
                                tmp[id] = $(this).val();
                                foundData = true;
                            }
                        });

                        if (foundData) {
                            formData = tmp;

                            if (loadedSmtpDropdown) {
                                if (typeof formData.SmtpServerId === 'string' && formData.SmtpServerId.length > 0 && formData['SendSave'] == 'send' && formData.SmtpServerId != '0') {
                                    SMTP = 'on';
                                } else {
                                    SMTP = 'off';
                                }
                            }
                        }
                    }

                    function LoadCampaigns(callback) {
                        var xmlContent = new XMLHttpRequest();
                        xmlContent.open("GET", BaseURL + "gmass/getcampaignswithcontent2?emailaddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                        sdk.log("about to fetch campaign data");
                        xmlContent.send();


                        xmlContent.onreadystatechange = function () {
                            if (xmlContent.readyState == 4) {
                                sdk.log("DONE fetching campaign data");
                                resultCampaigns = JSON.parse(xmlContent.responseText);
                                cachedCampaignOptionsHtml = null;

                                if (resultCampaigns.success == false && resultCampaigns.reason == "BadKey") {
                                    LoadedCampaigns = false;
                                    sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                    LaunchAuth(sdk.User.getEmailAddress(), 2);
                                }

                                if (callback) {
                                    callback();
                                }

                            }
                        }
                    }

                    function MultiSendSetOptions(MultiSendPreFill) {
                        var dd = $(SettingsBox).find('[name="MultiSendTokenIds"]');

                        dd.find('option').remove();

                        var arrAccounts = MultiSendPreFill.split(',');

                        arrAccounts.forEach((account) => {
                            var parts = account.split('|');
                            var tokenid = parts[0];
                            var weight = parts.length > 1 ? parts[1] : null;
                            if (!$("#" + settingsID + "MultiSend option[value='" + tokenid + "']").length > 0) {
                                if (weight && weight > 0) {
                                    dd.append(`<option value="${tokenid}" data-value="${weight}" selected>Some account</option>`);
                                } else {
                                    dd.append(`<option value="${tokenid}" selected>Some account</option>`);
                                }
                            }
                        });
                    }

                    function LoadMultiSendAccounts(forceRebuild = false) {
                        var data = {
                            emailaddress: sdk.User.getEmailAddress(),
                            GMassKey: localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()),
                            sleepseconds: 0,
                            includePrimary: true
                        };

                        $.getJSON(BaseURL + "gmass/getmultisendaccounts", data, function (ret) {
                            var oldArray = arrayMultiSendEmails;
                            arrayMultiSendEmails = [];
                            ret.accounts.forEach(a => {
                                arrayMultiSendEmails.push(a.emailaddress)
                            });
                            if (arrayMultiSendEmails.length > oldArray.length || forceRebuild) {
                                var dd = $(SettingsBox).find('[name="MultiSendTokenIds"]');
                                GMass.selectMany(dd, {
                                    setValues: true,
                                    placeholder: 'No additional accounts selected',
                                    selectedText: 'Accounts selected',
                                    onDropDownStopInterval: composeView.MultiSendInterval
                                });
                                var selections = {};
                                dd.find('option').each(function () {
                                    selections[this.value] = { selected: this.selected, weight: $(this).attr('data-value') };
                                });

                                if (composeView.MultiSendInterval > 10) {
                                    clearInterval(composeView.MultiSendInterval);
                                }
                                if (LoadedMultiSendAccounts) {
                                    let difference = arrayMultiSendEmails.filter(x => !oldArray.includes(x));
                                    console.log(difference.join(',') + ' added');
                                    if (difference.length > 0) {
                                        sdk.ButterBar.showMessage({ text: 'Wonderful! You just linked a new sending account: ' + difference.join(','), time: 20000 });
                                    }
                                }
                                dd.html('');
                                ret.accounts.forEach(a => {
                                    var tokenid = a.tokenid;
                                    if (a.emailaddress == sdk.User.getEmailAddress()) {
                                        tokenid = 1;
                                    }
                                    var weight = selections[tokenid] ? selections[tokenid].weight : '';
                                    var weightAttr = weight && weight > 0 ? `data-value="${weight}"` : '';
                                    var isSelected = selections[tokenid] && selections[tokenid].selected ? 'selected' : '';

                                    dd.append(`<option value="${tokenid}" ${weightAttr} ${isSelected}>${(tokenid == 1 ? 'PR: ' : '')}${a.emailaddress}</option>`);

                                });
                                GMass.selectMany(dd, {
                                    setValues: true,
                                    selectedText: 'Accounts selected',
                                    placeholder: ret.accounts.length == 0 ? 'No linked accounts' : 'No additional accounts selected',
                                    onDropDownStopInterval: composeView.MultiSendInterval
                                });
                                const inputs = document.querySelectorAll('input.nospinner');
                                inputs.forEach(input => {
                                    input.addEventListener('change', function () {

                                        enforceMinMax(input);
                                    });

                                });

                                LoadedMultiSendAccounts = true;
                            }
                        });
                    }

                    function enforceMinMax(el) {
                        if (el.value != "") {
                            if (parseInt(el.value) < parseInt(el.min)) {
                                el.value = '';
                            }
                            if (parseInt(el.value) > parseInt(el.max)) {
                                el.value = '';
                            }
                        }
                    }


                    function LoadWeekdays(forceRebuild = false) {


                        var dd = $(SettingsBox).find('[name="SendDays"]');

                        dd.html('');

                        dd.append('<option value="weekdays" data-group="true">Select weekdays only</option>');

                        window.GMass.weekdays.forEach(day => {
                            if (SendDaysValue.includes(GetWeekDayNumeric(day))) {
                                dd.append(`<option value="${GetWeekDayNumeric(day)}" selected>${day}</option>`);
                            }
                            else {
                                dd.append(`<option value="${GetWeekDayNumeric(day)}">${day}</option>`);
                            }
                        });

                        GMass.selectMany(dd, {
                            placeholder: 'Select sending days',
                            selectedText: 'Sending days selected',
                            selectAllLabel: 'Select/Remove all days',
                            ongroupclick: function (chk, wrap) {

                                var checked = chk.checked;
                                wrap.find(':checkbox').prop('checked', false);
                                chk.checked = checked;
                                if (chk.value == 'weekends') {
                                    wrap.find('[value="2"], [value="1"]').prop('checked', chk.checked);
                                }
                                else if (chk.value == 'weekdays') {
                                    wrap.find('[value="3"], [value="4"], [value="5"], [value="6"], [value="7"]').prop('checked', chk.checked);
                                }

                            },
                            onitemclick: function (chk, wrap) {
                                wrap.find('li[data-group] :checkbox').prop('checked', false);
                            }
                        });

                    }


                    function GenerateSendURL(BackupDraftID) {
                        saveFormData();

                        var d = new Date();
                        var gmassurl = "";
                        gmassurl = BaseURLSend + "gmass/send?emailaddress="
                            + sdk.User.getEmailAddress() + "&subject=" + encodeURIComponent(composeView.getSubjectAltMethod())
                            + "&tzo="
                            + (-AccountStatus.TimeZoneOffset || d.getTimezoneOffset()) + "&gu=" + (App == "oldGmail" ? encodeURIComponent(document.location.href) : "")
                            + "&draftId=" + ComposeDraftID;

                        if (BackupDraftID != undefined) {
                            gmassurl += "&backupdraftId=" + BackupDraftID;
                        }
                        if (isComposeInlineReply) {
                            gmassurl = gmassurl + "&appendToThread=false&isReply=true";
                        }
                        else if ((myNewReply == "reply")) {
                            gmassurl = gmassurl + "&appendToThread=true";
                            if (GMassReplyMessage != 0) {
                                gmassurl = gmassurl + "&CampaignIDToReplyTo=" + GMassReplyMessage;
                            }
                        }

                        if (GMassImages == "r") {
                            gmassurl = gmassurl + "&Images=r";
                        }
                        else if (GMassImages == "e") {
                            gmassurl = gmassurl + "&Images=e";
                        }

                        if (formData['SendSave'] == "save" && !isComposeInlineReply) {
                            gmassurl = gmassurl + "&saveAsDraft=true";
                            gmassurl += "&DraftSaveSpeed=" + formData.DraftSaveSpeed;
                        }
                        else if (formData['SendSave'] == 'send') {
                            gmassurl = gmassurl + "&SmtpServerId=" + formData.SmtpServerId;
                        }

                        if (SMTP == "on" || (formData.DraftSaveSpeed == 'all' && formData['SendSave'] == 'save')) {
                            gmassurl = gmassurl + "&UseSMTP=true";
                        }
                        else if (SMTP == "off") {
                            gmassurl = gmassurl + "&UseSMTP=false";
                        }
                        else if (SMTP == "notset") {
                            gmassurl = gmassurl + "&UseSMTP=notset";
                        }

                        if (GMassRecur == "on") {
                            gmassurl = gmassurl + "&Recur=" + GMassRecurDH;
                            gmassurl = gmassurl + "&RecurEvery=" + myRecurEvery;
                        }
                        if (myOpenTracking == "on") {
                            gmassurl = gmassurl + "&OpenTracking=true";
                        }
                        if (myClickTracking == "on") {
                            gmassurl = gmassurl + "&ClickTracking=true";
                        }
                        if (SkipWeekends == "on") {
                            gmassurl = gmassurl + "&SkipWeekends=true";
                        }
                        if (SkipHolidays == "on") {
                            gmassurl = gmassurl + "&SkipHolidays=true";
                        }

                        if ($(SettingsBox).find('[name="SendDaysOn"]').prop('checked')) {
                            gmassurl = gmassurl + "&AllowedDays=" + $(SettingsBox).find('[name="SendDays"]').val().join(',');
                        }

                        if ($(SettingsBox).find('[name="EndTimeBox"]').prop('checked')) {
                            gmassurl = gmassurl + "&EndTime=" + $(SettingsBox).find('[name="EndTime"]').val();
                        }

                        if (myDelay == "on") {
                            gmassurl = gmassurl + "&Delay=true";
                            gmassurl = gmassurl + "&DelayLength=" + GMassPauseSeconds;
                        }

                        if (!isComposeInlineReply) {

                            gmassurl += "&ReplyTo=" + encodeURIComponent(myReplyTo);
                            gmassurl += "&FriendlyName=" + encodeURIComponent(myFriendlyName)
                            gmassurl += "&PreviewText=" + encodeURIComponent(formData.PreviewText)

                            if (mySuppressionDays != "" && mySuppressionDays != "0") {
                                gmassurl = gmassurl + "&SuppressionDays=" + mySuppressionDays;
                            }
                            if (GMassSuppression != "") {
                                gmassurl = gmassurl + "&Suppression=" + encodeURIComponent(GMassSuppression);
                            }
                        }
                        let urlObj = new URL(gmassurl);
                        var bumpSettings = getBumpSettings();
                        bumpSettings.forEach(b => {
                            var ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];

                            var prefix = b.bump;
                            if (b.bump < 9) {
                                prefix = ordinals[b.bump - 1];
                            }
                            urlObj.searchParams.append(`${prefix}Bump`, 'y');
                            urlObj.searchParams.append(`${prefix}BumpDays`, b.days);
                            urlObj.searchParams.append(`BNOT${b.bump}`, b.sameNew);
                            urlObj.searchParams.append(`${prefix}BumpAddedText`, b.addedText);
                            urlObj.searchParams.append(`${prefix}BumpCampaignID`, b.campaignId);
                            urlObj.searchParams.append(`${prefix}BumpAction`, b.action);
                            urlObj.searchParams.append(`${prefix}BumpChoice`, b.choice);
                            urlObj.searchParams.append(`${prefix}BumpTime`, b.time);
                        });
                        gmassurl = urlObj.toString();

                        if (GMassBumpSuppression !== "") {
                            gmassurl += "&BumpSuppression=" + encodeURIComponent(GMassBumpSuppression);
                        }


                        if (myMaxEmails != "" && myMaxEmails != "max") {
                            gmassurl = gmassurl + "&SplitFactor=" + myMaxEmails;
                        }

                        if (GMassDateDropdown != "Now") {
                            gmassurl = gmassurl + "&futureSendDateTime=" + encodeURIComponent(GMassDateTextBox);
                        }

                        var FromContact = composeView.getFromContact();
                        gmassurl = gmassurl + "&FromName=" + encodeURIComponent(FromContact.name);

                        if (formData.Verify == "true") {
                            gmassurl = gmassurl + "&Verify=true";
                        }

                        if (formData.AutoSpintax == "true") {
                            gmassurl = gmassurl + "&AutoSpintax=true";
                        }

                        if (formData.SkipSent == "true") {
                            gmassurl = gmassurl + "&SkipSent=true";
                        }

                        if (formData.SuppressionAggressive == "true") {
                            gmassurl = gmassurl + "&SuppressionAggressive=true";
                        }

                        if (formData.ABTest == "true") {
                            gmassurl = gmassurl + "&ABTest=true";
                            gmassurl = gmassurl + "&ABDecision=" + formData.ABDecision;
                            gmassurl = gmassurl + "&ABPercentage=" + formData.ABPercentage;
                            gmassurl = gmassurl + "&ABTimeAfter=" + formData.ABTimeAfter;
                            gmassurl = gmassurl + "&ABFactor=" + formData.ABFactor;
                        }

                        if (formData.Triggers == "true") {
                            gmassurl = gmassurl + "&Triggers=true";
                            gmassurl = gmassurl + "&TriggerOpenCampaign=" + TriggerOpenCampaignID;
                            gmassurl = gmassurl + "&TriggerClickCampaign=" + TriggerClickCampaignID;
                            gmassurl = gmassurl + "&TriggerReplyCampaign=" + TriggerReplyCampaignID;
                            gmassurl = gmassurl + "&TriggerOpenThread=" + (formData.TriggerOpenThreaded == "on");
                            gmassurl = gmassurl + "&TriggerClickThread=" + (formData.TriggerClickThreaded == "on");
                            gmassurl = gmassurl + "&TriggerReplyThread=" + (formData.TriggerReplyThreaded == "on");
                            gmassurl = gmassurl + "&TriggerOpenDelayMinutes=" + formData.TriggerOpenDelay;
                            gmassurl = gmassurl + "&TriggerClickDelayMinutes=" + formData.TriggerClickDelay;
                            gmassurl = gmassurl + "&TriggerReplyDelayMinutes=" + formData.TriggerReplyDelay;
                            gmassurl = gmassurl + "&TriggerReplyPhrases=" + encodeURIComponent($(SettingsBox).find('[name="TriggerReplyPhrases"]').val().join('|'));
                        }

                        gmassurl = gmassurl + "&deleteDraft=true";

                        gmassurl = gmassurl + "&version=" + JSVersion;

                        if (window.GMass.tour.active) {
                            gmassurl = gmassurl + "&ontour=true";
                        }

                        if ($(SettingsBox).find('[name="MultiSend"]').prop('checked')) {

                            var selectElement = $(SettingsBox).find('[name="MultiSendTokenIds"]');
                            var multiSendTokenData = [];

                            var primaryAccountWeightParameter = '';

                            var isPrimarySelected = false;
                            selectElement.find('option:selected').each(function () {
                                var option = $(this);
                                var value = option.val();
                                var dataValue = option.attr('data-value');
                                if (dataValue == 'undefined' || dataValue === undefined || dataValue === null || dataValue.trim() === '') {
                                    dataValue = '0';
                                }
                                if (value == 1) {
                                    isPrimarySelected = true;
                                    primaryAccountWeightParameter = '&multisendprimarymaxallowed=' + dataValue;
                                }
                                else {
                                    multiSendTokenData.push({
                                        value: value,
                                        dataValue: dataValue
                                    });
                                }
                            });

                            var formattedMultiSendString = multiSendTokenData.map(function (item) {
                                return item.value + "|" + item.dataValue;
                            }).join(',');

                            if (isPrimarySelected) {

                                gmassurl = gmassurl + "&multisend=" + formattedMultiSendString + "&multisendskipprimary=0" + primaryAccountWeightParameter;
                            }
                            else {
                                gmassurl = gmassurl + "&multisend=" + formattedMultiSendString + "&multisendskipprimary=1";
                            }

                        }

                        if (sdk.debug) {
                            console.log(gmassurl);
                        }

                        return gmassurl;
                    }
                    composeView.addButton({
                        title: "Click this GMass button instead of Send, and individual emails will be sent to each address in the To field.",
                        type: "SEND_ACTION",
                        orderHint: 0,
                        iconClass: (App.includes("Gmail") ? "GmailClass" : "InboxClass") + (SmallButton ? "Mini" : ""),
                        hasDropdown: false,
                        onClick: function (event) {

                            ClickGMassButton(event);


                        }

                    });

                    function GetDraftState(AliasEmailAddress, composeJustLaunched = false, toAliasRemoved = false) {
                        var xmlstate = new XMLHttpRequest();

                        var ChangedListAddress = false;
                        var SettingListAddress = false;

                        if (ToList.length == 0 && IsAddressAlias(AliasEmailAddress)) {
                            SettingListAddress = true;
                        }

                        ToList = composeView.getToRecipients();

                        if (AliasEmailAddress == '' && (IsAddressAlias(ComposeTagger) || IsAddressAFTemplate(ComposeTagger))) {
                            GMassLaunchedCompose = true;
                            xmlstate.open("GET", BaseURL + "gmass/getdraftstate6?draftId=" + ComposeDraftID + "&composejustlaunched=" + composeJustLaunched + "&FirstTo=" + ComposeTagger + "&emailAddress=" + sdk.User.getEmailAddress() + "&AllAliasesCommaSep=" + GetAllAliasAddressesCommaSep(composeView), true);
                        }
                        else if (IsAddressAlias(AliasEmailAddress)) {
                            xmlstate.open("GET", BaseURL + "gmass/getdraftstate6?draftId=" + ComposeDraftID + "&composejustlaunched=" + composeJustLaunched + "&FirstTo=" + AliasEmailAddress + "&ToChanged=true" + "&emailAddress=" + sdk.User.getEmailAddress() + "&AllAliasesCommaSep=" + GetAllAliasAddressesCommaSep(composeView), true);
                        }

                        else if (ComposeFirstAddressAlias(composeView) || ComposeFirstAddressAFTemplate(composeView)) {
                            xmlstate.open("GET", BaseURL + "gmass/getdraftstate6?draftId=" + ComposeDraftID + "&composejustlaunched=" + composeJustLaunched + "&FirstTo=" + composeView.getToRecipients()[0].emailAddress + "&emailAddress=" + sdk.User.getEmailAddress() + "&AllAliasesCommaSep=" + GetAllAliasAddressesCommaSep(composeView), true);
                        }
                        else if (toAliasRemoved) {
                            xmlstate.open("GET", BaseURL + "gmass/getdraftstate6?draftId=" + ComposeDraftID + "&composejustlaunched=" + composeJustLaunched + "&ToChanged=true" + "&emailAddress=" + sdk.User.getEmailAddress() + "&AllAliasesCommaSep=" + GetAllAliasAddressesCommaSep(composeView), true);

                        }
                        else {
                            xmlstate.open("GET", BaseURL + "gmass/getdraftstate6?draftId=" + ComposeDraftID + "&composejustlaunched=" + composeJustLaunched + "&emailAddress=" + sdk.User.getEmailAddress() + "&AllAliasesCommaSep=" + GetAllAliasAddressesCommaSep(composeView), true);
                        }

                        var OldComposeTagger = ComposeTagger;
                        ComposeTagger = "x";

                        sdk.log("***getdraftstate just called");
                        xmlstate.send();

                        xmlstate.onreadystatechange = function () {
                            if (xmlstate.readyState == 4) {

                                if (xmlstate.responseText != "") {

                                    varDraftState = JSON.parse(xmlstate.responseText);
                                    console.log("GM: Draft ID state retrieved from GM =" + ComposeDraftID);

                                    if (varDraftState.ToAddressNotFound != true) {

                                        if (1 == 1) {
                                            if (!varDraftState.NoScheduledFound && varDraftState.ToAddressChangedButAlreadyScheduled != true) {
                                                IsScheduled = varDraftState.IsScheduled;

                                                sdk.log("isscheduled set");
                                                HasCampaign = varDraftState.HasCampaign;


                                            }
                                            if (varDraftState.WorksheetColumns.length > 0) {
                                                GMassPersonalization = varDraftState.WorksheetColumns;
                                                SheetsOnlyPersonalization = GMassPersonalization.slice();
                                                if (HasFreeHandAddresses(composeView)) {
                                                    GMassPersonalization = AddThreeColumns(GMassPersonalization);
                                                }
                                                sdk.log("personalization set from getdraftstate");
                                                var arrayFields = GMassPersonalization;
                                                if (arrayFields.length > 0) {
                                                    for (i = 0; i < (arrayFields.length); i++) {
                                                        if (arrayFields[i].toLowerCase().startsWith("attachment")) {
                                                            PersonalizedAttachments = true;
                                                            PersonalizedAttachmentFields += ", " + arrayFields[i];
                                                        }
                                                    }
                                                    if (PersonalizedAttachmentFields.startsWith(", ")) {
                                                        PersonalizedAttachmentFields = PersonalizedAttachmentFields.substring(2);
                                                    }
                                                }
                                            }

                                            IsEdited = varDraftState.IsEdited;
                                            IsPaused = varDraftState.IsPaused;
                                            IsProcessing = varDraftState.IsProcessing;
                                            AllDone = varDraftState.AllDone;
                                            hideSomeSettings = varDraftState.HideSomeSettings;
                                        }
                                        if (varDraftState.ToAddressChangedButAlreadyScheduled == true && ChangedListAddress) {

                                            if (BypassConfirmationOnToChangeWhenScheduled == false) {
                                                var PriorAliasCopy = PriorAlias;
                                                sdk.log("to address changed but already scheduled, ask user if they really want to");

                                                GMass.confirm({
                                                    title: "Are you sure about this change?",
                                                    message: "You just changed the list associated with a campaign that has already been scheduled. Are you sure you want to do this?",
                                                    buttons: [
                                                        {
                                                            html: "Yes, I'm sure",
                                                            class: 'success',
                                                            result: 'sendit'
                                                        },
                                                        {
                                                            html: 'Undo it',
                                                            class: 'danger',
                                                            result: 'undo'
                                                        }
                                                    ],
                                                    callback: function (result) {
                                                        if (result == 'undo') {
                                                            BypassConfirmationOnToChangeWhenScheduled = true;
                                                            composeView.SkipTContactRemoved = true;
                                                            var NewToLine = ReplaceFirstAddress(composeView.getToRecipients(), PriorAliasCopy);
                                                            composeView.setToRecipients(NewToLine);
                                                        }

                                                    }
                                                });
                                            }
                                            else {
                                                BypassConfirmationOnToChangeWhenScheduled = false;
                                            }
                                        }

                                    }
                                    else {
                                        GMassPersonalization = [];
                                        GMassPersonalization.push("FirstName|Friend");
                                        GMassPersonalization.push("LastName");
                                        GMassPersonalization.push("EmailAddress");
                                        arrayFields = "";
                                        PersonalizedAttachments = false;
                                        PersonalizedAttachmentFields = "";

                                        hideSomeSettings = varDraftState.HideSomeSettings;
                                        if (!isEmpty(varDraftState.PreviewText)) {

                                            GMassPreviewText = varDraftState.PreviewText;

                                        }
                                        else if (!isEmpty(GMassPreviewText)) {
                                        }
                                        else {
                                            GMassPreviewText = "";

                                        }

                                        if (!isEmpty(varDraftState.FriendlyName)) {

                                            myFriendlyName = varDraftState.FriendlyName;

                                        }
                                        else if (!isEmpty(myFriendlyName)) {
                                        }
                                        else {
                                            myFriendlyName = "";

                                        }


                                    }

                                    if (varDraftState.IsSaved) {
                                        IsSaved = true;
                                    }

                                    if (varDraftState.ShowSheetRecurringOptions) {
                                        ShowSheetRecurringOptions = true;
                                    }
                                    setSettingsFromDraftState(varDraftState, false, false);
                                }
                                var FinalMessage = "";
                                var DidWeHideIt = HideSendButton(composeView, GMassLaunchedCompose, boolForceShowSend);

                                if (PersonalizedAttachmentFields != "") {
                                    FinalMessage += "Looks like you're sending <a style='color: #99FFFF' href='https://www.gmass.co/blog/mass-email-with-personalized-attachments/' target='_blog'>personalized attachments</a>, since your Sheet has these attachment fields: <span style='color: #BFFFC5'>" + PersonalizedAttachmentFields + "</span>. The files will be attached when you hit the GMass button. You don't need to manually attach any files.<br><br>";
                                }

                                if (DidWeHideIt > 0) { FinalMessage += "We've collapsed the Send button to prevent you from making a dastardly mistake!<br><br>"; }

                                var bbmsgToField = "";
                                if (IsAddressAlias(AliasEmailAddress)) {
                                    if (!varDraftState.MultipleLists) {
                                        if (ChangedListAddress) {
                                            bbmsgToField += "Looks like you changed the recipient list for this DRAFT. Great, we've adjusted the Settings box to contain the new personalization fields based on this list.<BR><BR>";
                                        }
                                        else if (SettingListAddress) {
                                            bbmsgToField += "Looks like you SET a recipient list for this DRAFT. Great, we've adjusted the Settings box to contain the new personalization fields based on this list.<BR><BR>";

                                        }
                                        bbmsgToField += "The TO field includes the list address: <span style='color: #BFFFC5'>" + AliasEmailAddress + "</span> and represents" + (varDraftState.SpreadsheetName != null ? " <span style='color: #BFFFC5'>(" + varDraftState.SpreadsheetName + "-->" + varDraftState.WorksheetName + ")</span>" : "") + ", but you can also see the individual addresses if you like.<BR><BR>";
                                    }
                                    else {
                                        if (varDraftState.SubListCount == 0) {
                                            bbmsgToField += "The TO field contains multiple list addresses:<BR><BR><span style='color: #BFFFC5'>" + varDraftState.AliasAddressList.replaceAll(",", "<BR>") + "</span><BR><BR>These addresses represent your various list sources.<BR><BR>Personalization will work seamlessly across all list sources.<BR><BR><a target='_blog' style='color: #99FFFF' href='https://www.gmass.co/blog/multiple-lists-multi-merge/'>More information</a>";
                                        }
                                        else {
                                            bbmsgToField += "The TO field represents lists from multiple sources.<BR><BR>Personalization will work seamlessly across all list sources.<BR><BR><a target='_blog' style='color: #99FFFF' href='https://www.gmass.co/blog/multiple-lists-multi-merge/'>More information</a>";
                                        }
                                    }
                                }
                                else if (IsAddressAlias(OldComposeTagger)) {
                                    bbmsgToField += "The TO field is set to: <span style='color: #BFFFC5'>" + OldComposeTagger + "</span> and represents your list" + (varDraftState.SpreadsheetName != null ? " <span style='color: #BFFFC5'>(" + varDraftState.SpreadsheetName + "-->" + varDraftState.WorksheetName + ")</span>" : "") + ". You can copy/paste this address into the To field if it's not already there.<BR><BR>";
                                }

                                var butterbarbuttons = [];
                                if (IsScheduled) {
                                    var PriorAliasCopy = PriorAlias;
                                    fetch(BaseURL + "gmass/GetDraftSentStatus2?draftId=" + ComposeDraftID + "&emailAddress=" + sdk.User.getEmailAddress() + "&AllAliasesCommaSep=" + GetAllAliasAddressesCommaSep(composeView))
                                        .then((resp) => resp.json())
                                        .then(function (data) {
                                            FinalMessage += data.StatusMessage;

                                            if (ComposeFirstAddressAlias(composeView)) {


                                                FinalMessage += "<BR><BR>" + bbmsgToField;

                                            }
                                            SetDraftStateMessage(butterbarbuttons, varDraftState, PriorAliasCopy, AliasEmailAddress, FinalMessage, ChangedListAddress, SettingListAddress);



                                        })
                                        .catch(function (error) {
                                            sdk.log(error);
                                        });

                                }
                                else
                                {
                                    var PriorAliasCopy = PriorAlias;

                                    if (ComposeFirstAddressAlias(composeView)) {
                                        FinalMessage += bbmsgToField;
                                        SetDraftStateMessage(butterbarbuttons, varDraftState, PriorAliasCopy, AliasEmailAddress, FinalMessage, ChangedListAddress, SettingListAddress);


                                    }
                                    else if (bbmsgToField != "" && !window.GMass.tour.active) {
                                        sdk.ButterBar.showMessage({ html: bbmsgToField, time: 20000 });
                                    }
                                }
                                GotState = true;

                                sdk.log("GM: GotState=true because Draft ID state retrieved");
                                if (!(ComposeInterval1Running && ComposeInterval2Running)) {
                                    MonitorToFieldForHidingSend(composeView, GMassLaunchedCompose);
                                    if (LogIntervals) { sdk.log("both ComposeMonitor intervals started again at end of getdraftstate"); }

                                }
                                if (!composeView.saveProgressInterval) {
                                    composeView.saveProgressInterval = setInterval(saveProgress, 1000);
                                }


                            }
                        }

                    }

                    function SetDraftStateMessage(butterbarbuttons, varDraftState, PriorAlias, AliasEmailAddress, FinalMessage, ChangedListAddress, SettingListAddress) {
                        if (!varDraftState.MultipleLists) {
                            butterbarbuttons.push({
                                title: "Expand address", onClick: function () {
                                    ExpandToAddress(composeView);

                                }
                            });
                            butterbarbuttons.push({
                                title: "Download addresses", onClick: function () {
                                    DownloadToAddress(composeView);
                                }

                            });
                        }
                        if (varDraftState.ToAddressChangedButAlreadyScheduled == true) {
                            if (ChangedListAddress) {
                                FinalMessage += "FYI you're changing the list associated with a campaign that has already been scheduled.";
                            }
                        }
                        if (varDraftState.ToAddressNotFound == true) {
                            var bbmessageoldalias = "a list address that there is no Google Sheet info associated with in our system. You can still send to this list, but it won't be associated with personalization columns from a Google Sheet.";
                            if (ChangedListAddress) {
                                FinalMessage += "Looks like you've changed to " + bbmessageoldalias;

                            }
                            else if (SettingListAddress) {
                                FinalMessage += "Looks like you've set " + bbmessageoldalias;



                            }
                        }
                        if (FinalMessage != "" && !window.GMass.tour.active) {
                            sdk.ButterBar.showMessage({ html: FinalMessage, time: 20000, buttons: butterbarbuttons });
                            sdk.log("final message - just displayed;");
                        }
                    }

                    function ClickGMassButton(event, closeWindow = true, onDemandStage = 0) {
                        sdk.log("gmass button clicked!!!!!!!!!!!!!!!!");

                        if (MainButtonPressed == false) {

                            var checkSettingsFormed = setInterval(function IsSettingsFormed() {

                                if (SettingsFormed) {

                                    sdk.log("settings have formed so it's okay to save the form data now");
                                    clearInterval(checkSettingsFormed);
                                    saveFormData();


                                    MainButtonPressed = true;
                                    CheckAuth(true);
                                    var startTime = new Date().getTime();
                                    if ((!isComposeInlineReply && composeView.getSubject() == "") && !(composeView.getToRecipients().length > 0 && composeView.getToRecipients()[0].emailAddress.substr(composeView.getToRecipients()[0].emailAddress.length - 8) == "gmass.co")) {
                                        sdk.ButterBar.showMessage({ html: "You may not leave the Subject blank when using the GMass button.<BR><BR>If you actually do have a Subject set, make a small change to it, like typing a SPACE at the end, and then removing it, and then try again.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        ErrorHandler(sdk.User.getEmailAddress() + " subject blank");
                                        return;
                                    }
                                    var bumpSettings = getBumpSettings();
                                    var priorBump = null;
                                    var bumpError = false;
                                    bumpSettings.some(b => {

                                        if (b.days > 720 || b.days <= 0) {
                                            sdk.ButterBar.showMessage({ html: `Stage ${b.bump} Days must be a number between 1 and 720. Uncheck the box to cancel this Stage.`, time: 10000, className: "redbb" });
                                            bumpError = true;
                                            return true;
                                        }
                                        else if (priorBump != null && b.days <= priorBump.days) {
                                            sdk.ButterBar.showMessage({ html: `Stage ${b.bump} Days must be a number between 1 and 720 and greater than Stage ${b.bump-1}'s Days. Uncheck the box to cancel this Stage.`, time: 10000, className: "redbb" });
                                            bumpError = true;
                                            return true;
                                        }
                                        else if (b.action != "r" && b.action != "s" && b.action != "o" && b.action != "c" && b.action != "a") {
                                            sdk.ButterBar.showMessage({ html: `The Stage ${b.bump} Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All`, time: 10000, className: "redbb" });
                                            bumpError = true;
                                            return true;
                                        }
                                        else if (b.choice == "c" && b.campaignId == "0") {
                                            sdk.ButterBar.showMessage({ html: `You chose to use a custom message for Stage ${b.bump}, but didn't select an actual message.`, time: 10000, className: "redbb" });
                                            bumpError = true;
                                            return true;
                                        }
                                        else if (b.choice == "t" && b.addedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: `You chose follow-up text for Stage ${b.bump}, but didn't specify any text.`, time: 10000, className: "redbb" });
                                            bumpError = true;
                                            return true;
                                        }

                                        priorBump = b;
                                        return false;
                                    });


                                    if (bumpError) {
                                        MainButtonPressed = false;
                                        return;
                                    }


                                    if (!IsScheduled) {
                                        if ((!ccCheckByPass && !isComposeInlineReply) && ((composeView.getCcRecipients().length >= 1) || (composeView.getBccRecipients().length >= 1))) {


                                            GMass.confirm({
                                                title: "Are you sure about your Cc/Bcc lines?",
                                                message: "You have specified either Cc or Bcc addresses. Are you sure this is what you want?<BR><BR>In most cases, your email addresses should all be in the To field, NOT the Cc or Bcc fields. The GMass button sends individual, personalized email messages to each address in the To field, and if you specify a Cc/Bcc address, then that Cc/Bcc address will receive a copy of every single email sent to each address in the To field.<BR><BR>For example, if you have 100 addresses in the To field, and 5 addresses in Cc, then each of those 5 Cc addresses will receive all 100 email messages, one for each person in the To field.<BR><BR><a target='_blog' href='https://www.gmass.co/blog/clearing-up-the-confusion-between-the-to-and-the-ccbcc-address-fields/'>More information.</a><BR><BR>Are you sure this is what you want?",
                                                buttons: [
                                                    {
                                                        html: "Yes, I'm sure",
                                                        class: 'success',
                                                        result: 'sendit'
                                                    },
                                                    {
                                                        html: 'Cancel',
                                                        class: 'danger',
                                                        result: 'cancel'
                                                    }
                                                ],
                                                callback: function (result) {
                                                    if (result == 'sendit') {
                                                        MainButtonPressed = false;
                                                        ccCheckByPass = true;
                                                        ClickGMassButton(event, closeWindow, onDemandStage);
                                                    }
                                                    else {
                                                        MainButtonPressed = false;
                                                        return;
                                                    }
                                                }
                                            });

                                        }
                                        else if (!sizeCheckByPass && !isComposeInlineReply && (composeView.getToRecipients().length > 25 || ComposeFirstAddressAliasBig(composeView)) && formData['SendSave'] == "send") {
                                            GMass.confirm({
                                                title: "Are you sure?",
                                                message: "You are about to " + (GMassDateDropdown != "Now" ? "schedule" : "send") + " a campaign to a large number of addresses" + (mySuppressionDays != 0 || GMassSuppression != "" ? ", minus any suppression addresses." : ".") + " Just confirming...are you sure?",
                                                buttons: [
                                                    {
                                                        html: (GMassDateDropdown != "Now" ? "Schedule it!" : "Send it!"),
                                                        class: 'success',
                                                        result: 'sendit'
                                                    },
                                                    {
                                                        html: 'Cancel',
                                                        class: 'danger',
                                                        result: 'cancel'
                                                    }
                                                ],
                                                callback: function (result) {
                                                    if (result == 'sendit') {
                                                        MainButtonPressed = false;
                                                        sizeCheckByPass = true;
                                                        ClickGMassButton(event, closeWindow, onDemandStage);
                                                    }
                                                    else {
                                                        MainButtonPressed = false;
                                                        return;
                                                    }
                                                }
                                            });
                                        }
                                        else if (!replytoCheckByPass && !isComposeInlineReply && ValidateEmail(myReplyTo) && (myReplyTo != sdk.User.getEmailAddress()) && getBumpSettings().length > 0 && getBumpSettings()[0].action == 'r') {

                                            GMass.confirm({
                                                title: "Are you sure about your Reply-To address?",
                                                message: `You have auto follow-ups set to send to people who don't reply, but your campaign's replies will come to an address that's different <strong>(${myReplyTo})</strong> than this Google account <strong>(${sdk.User.getEmailAddress()})</strong>.<BR><BR>If emails that come to <strong>${myReplyTo}</strong> also land in this account, then you can proceed. Otherwise, there's a risk that GMass never sees replies to your campaign and GMass sends auto follow-ups to people that have already replied.<BR><BR>How would you like to proceed?`,
                                                buttons: [
                                                    {
                                                        html: "I know what I'm doing, so let's send",
                                                        class: 'success',
                                                        result: 'sendit'
                                                    },
                                                    {
                                                        html: 'Cancel so I can make changes',
                                                        class: 'danger',
                                                        result: 'cancel'
                                                    }
                                                ],
                                                callback: function (result) {
                                                    if (result == 'sendit') {
                                                        MainButtonPressed = false;
                                                        replytoCheckByPass = true;
                                                        ClickGMassButton(event, closeWindow, onDemandStage);
                                                    }
                                                    else {
                                                        MainButtonPressed = false;
                                                        return;
                                                    }
                                                }
                                            });
                                        }
                                        else {

                                            GMassPressCallBack(composeView, closeWindow, onDemandStage);
                                        }
                                    }
                                    else {
                                        GMassPressCallBack(composeView, closeWindow, onDemandStage);
                                    }
                                }

                                if (LogIntervals) { sdk.log("checkSettingsFormed interval run"); }
                            }, 250);

                        }
                        else {
                            sdk.ButterBar.showMessage({ html: "You already clicked the GMass button. Please wait while that first request is processed...", time: 10000, className: "redbb" });
                        }


                    }

                    function setSettingsFromDraftState(varDraftState, skipAF, fromCampaignDropdown) {

                        if (varDraftState.setSettings || fromCampaignDropdown) {

                            sdk.log("settings are being set from GetDraftState");
                            var ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];
                            ordinals.forEach((o, i) => {
                                Object.keys(varDraftState).forEach(k => {
                                    if (k.indexOf('Bump') < 0)
                                        return;
                                    varDraftState[k.replace(o, i + 1)] = varDraftState[k];
                                });
                            });

                            loadedSettings = varDraftState;
                            if (!fromCampaignDropdown) {
                                if (varDraftState.FutureSendDateTime == null) {
                                    GMassDateTextBox = "";
                                    GMassDateDropdown = "Now";
                                }
                                else {
                                    GMassDateTextBox = varDraftState.FutureSendDateTime;
                                    GMassDateDropdown = "Custom";
                                }
                            }


                            if (varDraftState.OpenTracking) {
                                myOpenTracking = "on";
                            }
                            else {
                                myOpenTracking = "off";
                            }

                            if (varDraftState.ClickTracking) {
                                myClickTracking = "on";
                            }
                            else {
                                myClickTracking = "off";
                            }

                            if (varDraftState.SkipWeekends) {
                                SkipWeekends = "on";
                            }
                            else {
                                SkipWeekends = "off";
                            }
                            SkipHolidays = varDraftState.SkipHolidays ? "on" : "off";

                            if (varDraftState.Suppression && varDraftState.Suppression.length > 3) {
                                GMassSuppression = varDraftState.Suppression;
                                GMassSuppression = GMassSuppression.replace(/,\s*$/, "");
                            }
                            else {
                                GMassSuppression = "";
                            }
                            if (varDraftState.Delay) {
                                myDelay = "on";
                            }
                            else {
                                myDelay = "off";
                            }

                            GMassPauseSeconds = varDraftState.DelayLength;

                            if (varDraftState.Recur == "d" || varDraftState.Recur == "h" || varDraftState.Recur == "w" || varDraftState.Recur == "m" || varDraftState.Recur == "i" || varDraftState.Recur == "1" || varDraftState.Recur == "2" || varDraftState.Recur == "3" || varDraftState.Recur == "4" || varDraftState.Recur == "5") {
                                GMassRecur = "on";
                                GMassRecurDH = varDraftState.Recur;
                                myRecurEvery = varDraftState.RecurEvery;

                            }
                            else {
                                GMassRecur = "off";
                            }

                            sendSave = varDraftState.SaveAsDraft ? "save" : "send";
                            smtpServerId = varDraftState.SmtpServerId;
                            draftSaveSpeed = varDraftState.DraftSaveSpeed || 'limited';
                            SMTP = varDraftState.UseSMTP == "true" ? "on" : "off";

                            if (varDraftState.AppendToThread) {

                                myNewReply = "reply";
                                GMassReplyMessage = varDraftState.CampaignIDToReplyTo;
                            }
                            else {
                                myNewReply = "new";
                            }
                            GMassImages = varDraftState.Images;
                            GMassVerify = ((varDraftState.Verify == "on" || varDraftState.Verify == "true" || varDraftState.Verify == true) ? "true" : "false");
                            GMassAutoSpintax = (
                                (varDraftState.AutoSpintax == "on" ||
                                    varDraftState.AutoSpintax == "true" ||
                                    varDraftState.AutoSpintax == true)
                                    ? "true"
                                    : "false"
                            );
                            GMassSkipSent = ((varDraftState.SkipSent || varDraftState.FastSMTP) ? "true" : "false");
                            SuppressionAggressive = (varDraftState.SuppressionAggressive ? "true" : "false");

                            if ((varDraftState.SplitFactor != "0") && (varDraftState.SplitFactor != null)) {

                                myMaxEmails = varDraftState.SplitFactor;


                            }
                            else {
                                myMaxEmails = "";
                            }

                            if (varDraftState.SuppressionDays != "0" && varDraftState.SuppressionDays != null) {
                                mySuppressionDays = varDraftState.SuppressionDays;
                                
                            }
                            else {
                                mySuppressionDays = 0;
                            }

                            if (varDraftState.ABTest) {
                                ABTest = "true";
                                ABDecision = varDraftState.ABDecision;
                                ABFactor = varDraftState.ABFactor;
                                ABPercentage = varDraftState.ABPercentage;
                                ABTimeAfter = varDraftState.ABTimeAfter;
                            }
                            else {
                                ABTest = "false";
                            }

                            MultiSendTokenIds = varDraftState.MultiSend;
                            if (varDraftState.MultiSend != null && MultiSendTokenIds.length > 0) {
                                MultiSendBox = "on";
                            }
                            else {
                                MultiSendBox = "off";
                            }

                            if (varDraftState.MultiSendSkipPrimary == 0 || varDraftState.MultiSendSkipPrimary == -1) {
                                MultiSendTokenIds += ',1|' + varDraftState.MultiSendPrimaryMaxAllowed;
                            }

                            if (varDraftState.AllowedDays && varDraftState.AllowedDays.length) {
                                SendDaysOn = "on";
                                SendDaysValue = varDraftState.AllowedDays;
                            }
                            else {
                                SendDaysOn = "off";
                            }

                            if (varDraftState.EndTime && varDraftState.EndTime.length) {
                                EndTimeBox = "on";
                                EndTime = varDraftState.EndTime;
                            }
                            else {
                                EndTimeBox = "off";
                            }

                            if (varDraftState.Triggers) {
                                Triggers = true;
                                TriggerOpenCampaignID = varDraftState.TriggerOpenCampaign;
                                TriggerClickCampaignID = varDraftState.TriggerClickCampaign;
                                TriggerReplyCampaignID = varDraftState.TriggerReplyCampaign;
                            }
                            else {
                                Triggers = false;
                                TriggerOpenCampaignID = 0;
                                TriggerClickCampaignID = 0;
                                TriggerReplyCampaignID = 0;
                            }
                            TriggerOpenThreadedValue = (varDraftState.TriggerOpenThread ? "on" : "off");
                            TriggerClickThreadedValue = (varDraftState.TriggerClickThread ? "on" : "off");
                            TriggerReplyThreadedValue = (varDraftState.TriggerReplyThread ? "on" : "off");

                            TriggerOpenDelayValue = varDraftState.TriggerOpenDelayMinutes ?? 0;
                            TriggerClickDelayValue = varDraftState.TriggerClickDelayMinutes ?? 0;
                            TriggerReplyDelayValue = varDraftState.TriggerReplyDelayMinutes ?? 0;

                            if (varDraftState.BumpSuppression && varDraftState.BumpSuppression != "") {
                                GMassBumpSuppression = varDraftState.BumpSuppression;
                            }
                            else {
                                GMassBumpSuppression = "";
                            }

                            GMassTriggerReplyPhrases = varDraftState.TriggerReplyPhrases || '';

                            if (!isEmpty(varDraftState.ReplyTo)) {

                                myReplyTo = varDraftState.ReplyTo.trim();

                            }
                            else {
                                myReplyTo = "";
                            }
                            if (!fromCampaignDropdown) {

                                if (!isEmpty(varDraftState.FriendlyName)) {

                                    myFriendlyName = varDraftState.FriendlyName;

                                }
                                else {
                                    myFriendlyName = "";

                                }

                                if (!isEmpty(varDraftState.PreviewText)) {

                                    GMassPreviewText = varDraftState.PreviewText;

                                }
                                else {
                                    GMassPreviewText = "";

                                }
                            }
                        }
                    }

                    function GMassPressCallBack(composeView, closeWindow = true, onDemandStage = 0) {

                        saveFormData();
                        if ((isComposeInlineReply) || !((composeView.getToRecipients().length > 4000) && formData['SendSave'] == "send")) {

                            counterMessageIDCheck = 0;

                            var xmlhttp2
                            var gmassurl
                            var bb;

                            if (!window.GMass.tour.active) {
                                bb = sdk.ButterBar.showMessage({ text: "Please wait for GMass...", time: 60000 });
                            }

                            document.dispatchEvent(new CustomEvent("gmass-sending"));


                            var clickedGMButton = setInterval(function IsDraftIDReady() {

                                if (ComposeDraftID != "") {

                                    sdk.log("gmass button clicked and also draft ID is ready, so no more waiting");
                                    clearInterval(clickedGMButton);
                                    if (ComposeDraftID != null) {

                                        gmassurl = GenerateSendURL(ComposeDraftID);

                                        if (composeView.getToRecipients().length > 0 && composeView.getToRecipients()[0].emailAddress.substr(composeView.getToRecipients()[0].emailAddress.length - 8) == "gmass.co") {
                                            setTimeout(function () { ConnectToGMass(gmassurl, closeWindow, onDemandStage); }, 3000);
                                        }
                                        else {
                                            ConnectToGMass(gmassurl, closeWindow, onDemandStage);
                                        }

                                    }
                                    else {
                                        if (!window.GMass.tour.active) {
                                            sdk.ButterBar.showMessage({ html: "You were too fast for us! Please wait just a second and then hit the button again.\n\nIf this error persists after a few more seconds, try re-loading Gmail in Chrome. That usually fixes it.", time: 10000, className: "redbb" });
                                            bb.destroy();
                                        }
                                        MainButtonPressed = false;
                                    }

                                }
                                else {

                                    sdk.log("GM: draft id apparently not ready, trying in a sec");

                                }
                                if (LogIntervals) { sdk.log("main button click interval run"); }
                            }, 1000);

                        }
                        else {
                            MainButtonPressed = false;
                            sdk.ButterBar.showMessage({ html: "You can't have more than 4,000 email addresses in the To field, but you can send to more than 4,000 email addresses using the Google Sheets integration. Copy/paste your email addresses into a Google Sheets spreadsheet.", time: 10000, className: "redbb" });
                        }

                    }

                    function setLocalStorageAB(ABDecision, ABFactor, ABPercentage, ABTimeAfter) {
                        if (ABPercentage != undefined) {
                            localStorage.setItem("ABDecision", ABDecision);
                            localStorage.setItem("ABFactor", ABFactor);
                            localStorage.setItem("ABPercentage", ABPercentage);
                            localStorage.setItem("ABTimeAfter", ABTimeAfter);
                        }
                    }

                    function setLocalStorageBasicStuff() {

                        saveFormData();
                        localStorage.setItem("mySendSave", (formData['SendSave'] == "send" ? "send" : "save"));
                        localStorage.setItem('DraftSaveSpeed', formData.DraftSaveSpeed)
                        localStorage.setItem('SmtpServerId', formData.SmtpServerId)
                        localStorage.setItem("GMassImages", GMassImages);
                        localStorage.setItem("myOpenTracking", myOpenTracking);
                        localStorage.setItem("myClickTracking", myClickTracking);
                        localStorage.setItem("SkipWeekends", SkipWeekends);
                        localStorage.setItem("SkipHolidays", SkipHolidays);

                        localStorage.setItem("myDelay", myDelay);
                        localStorage.setItem("GMassPauseSeconds", GMassPauseSeconds);

                        if (!isComposeInlineReply) {
                            localStorage.setItem("TriggerOpenCampaignID", TriggerOpenCampaignID);
                            localStorage.setItem("TriggerClickCampaignID", TriggerClickCampaignID);
                            localStorage.setItem("TriggerReplyCampaignID", TriggerReplyCampaignID);


                            localStorage.setItem("TriggerOpenThreaded", (formData.TriggerOpenThreaded == "on" ? "on" : "off"));
                            localStorage.setItem("TriggerClickThreaded", (formData.TriggerClickThreaded == "on" ? "on" : "off"));
                            localStorage.setItem("TriggerReplyThreaded", (formData.TriggerReplyThreaded == "on" ? "on" : "off"));

                            localStorage.setItem("TriggerOpenDelay", formData.TriggerOpenDelay);
                            localStorage.setItem("TriggerClickDelay", formData.TriggerClickDelay);
                            localStorage.setItem("TriggerReplyDelay", formData.TriggerReplyDelay);

                            localStorage.setItem("TriggerReplyPhrases", formData.TriggerReplyPhrases.join('|'));
                        }

                        localStorage.setItem("GMassVerify", (formData.Verify == "true" ? "true" : "false"));
                        localStorage.setItem(
                            "GMassAutoSpintax",
                            formData.AutoSpintax == "true" ? "true" : "false"
                        );
                        localStorage.setItem("GMassSkipSent", (formData.SkipSent == "true" ? "true" : "false"));
                        localStorage.setItem("GMassSuppressionAggressive", (formData.SuppressionAggressive == "true" ? "true" : "false"));
                        var multiSendTokenData = [];
                        var isPrimarySelected;
                        $(SettingsBox).find('[name="MultiSendTokenIds"]').find('option:selected').each(function () {
                            var option = $(this);
                            var value = option.val();
                            var dataValue = option.attr('data-value');
                            if (dataValue == 'undefined' || dataValue === undefined || dataValue === null || dataValue.trim() === '') {
                                dataValue = '0';
                            }
                            if (value == 1) {
                                isPrimarySelected = true;
                            }
                            multiSendTokenData.push({
                                value: value,
                                dataValue: dataValue
                            });

                        });

                        var formattedMultiSendString = multiSendTokenData.map(function (item) {
                            return item.value + "|" + item.dataValue;
                        }).join(',');

                        if (!isPrimarySelected) {
                            localStorage.setItem("GMassMultiSendUserExcludedPrimary", "true");
                        }

                        localStorage.setItem("GMassMultiSend", formattedMultiSendString);

                        var daysValue = $(SettingsBox).find('[name="SendDays"]').val().join(',');

                        localStorage.setItem("SendDaysOn", SendDaysOn);
                        localStorage.setItem("SendDaysValue", (daysValue.length > 0 ? daysValue : ''));

                        localStorage.setItem(
                            "GMassEndTimeBox",
                            formData.EndTimeBox == "true" ? "on" : "off"
                        );
                        localStorage.setItem("GMassEndTime", formData.EndTime);

                    }

                    function ConnectToGMass(URL, closeWindow = true, onDemandStage = 0) {

                        composeView.saveDraftAlternate();

                        if (!URL.includes("OverridePersErrors")) {
                            URL += "&OverridePersErrors=false"
                        }
                        if (!URL.includes("OverrideCLErrors")) {
                            URL += "&OverrideCLErrors=false"
                        }

                        var d = new Date();

                        xmlhttp2 = new XMLHttpRequest();

                        xmlhttp2.open("GET", URL, true);
                        xmlhttp2.send();
                        xmlhttp2.onreadystatechange = function () {
                            if (xmlhttp2.readyState == 4) {
                                resultHTTPApplyLabel = JSON.parse(xmlhttp2.responseText);
                                if (resultHTTPApplyLabel.success) {
                                    if (resultHTTPApplyLabel.ExtensionKey != "n") { localStorage.setItem("GMassKey-" + sdk.User.getEmailAddress(), resultHTTPApplyLabel.ExtensionKey) }

                                    varSuccessMessage = "";

                                    if (resultHTTPApplyLabel.UIMessage != "") {
                                        if (resultHTTPApplyLabel.UIMessage.includes("SMTP Success")) {
                                            localStorage.setItem("GMassSMTP", "on");
                                        }
                                        else if (resultHTTPApplyLabel.UIMessage.includes("SMTP Cleared")) {
                                            localStorage.setItem("GMassSMTP", "notset");
                                        }
                                        else {
                                            localStorage.setItem("GMassSMTP", (resultHTTPApplyLabel.UseSMTP ? "on" : (localStorage.getItem("GMassSMTP") == "notset" ? "notset" : "off")));

                                        }
                                        varSuccessMessage = resultHTTPApplyLabel.UIMessage
                                    }

                                    if (closeWindow) {
                                        if (!window.GMass.tour.active) {
                                            sdk.ButterBar.showMessage({ html: varSuccessMessage, time: 20000 });
                                        }
                                    }
                                    else if (onDemandStage > 0) {
                                        sdk.ButterBar.showMessage({ html: "Your campaign has been saved...now sending your auto follow-up stage...", time: 20000 });

                                        $.get(`${BaseURL}/bumper/ondemand`, {
                                            emailAddress: sdk.User.getEmailAddress(),
                                            stage: onDemandStage,
                                            draftId: ComposeDraftID,
                                            GMassKey: encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()))
                                        }).done(function (json) {
                                            if (json.success) {
                                                sdk.ButterBar.showMessage({ html: "Your auto follow-up stage " + onDemandStage + " will be sent momentarily.", time: 10000 });
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Error:<BR><BR>" + json.errorMessage, time: 10000 });
                                            }
                                        }).fail(function (jqXHR, textStatus, errorThrown) {
                                            sdk.ButterBar.showMessage({ text: "Error: " + textStatus + " - " + errorThrown, time: 10000 });
                                        }).always(function () {
                                        });


                                    }

                                    setLocalStorageAB(formData.ABDecision, formData.ABFactor, formData.ABPercentage, formData.ABTimeAfter);

                                    setLocalStorageBasicStuff();

                                    SetLocalStorageAF();

                                    EverSent = true;
                                    MainButtonPressed = false;

                                    document.dispatchEvent(new CustomEvent("gmass-sent"));
                                }
                                else {
                                    if (resultHTTPApplyLabel.error.includes("personalization")) {
                                        var r = confirm(resultHTTPApplyLabel.error);

                                        if (r) {
                                            sdk.ButterBar.showMessage({ html: "Sounds good! Please wait for GMass...", time: 60000 });
                                            if (resultHTTPApplyLabel.error.includes("conditional")) {
                                                ConnectToGMass(URL.replace("OverrideCLErrors=false", "OverrideCLErrors=true"));
                                            }
                                            else {
                                                ConnectToGMass(URL.replace("OverridePersErrors=false", "OverridePersErrors=true"));
                                            }
                                        }
                                        else {

                                            sdk.ButterBar.showMessage({ html: "Sending has been cancelled. If you need help understanding personalization, see our <a style=\"color: #99FFFF\" target=\"_blog\" href=\"https://www.gmass.co/blog/why-your-gmail-mail-merge-personalization-failed/\">personalization troubleshooter</a>.", time: 10000 });
                                        }
                                    }
                                    else if (resultHTTPApplyLabel.NeedsToPay) {
                                        sdk.ButterBar.showMessage({ html: resultHTTPApplyLabel.error, className: "redbb" });
                                        if (resultHTTPApplyLabel.ExtensionKey != "n") { localStorage.setItem("GMassKey-" + sdk.User.getEmailAddress(), resultHTTPApplyLabel.ExtensionKey) }
                                        LaunchUpgrade(resultHTTPApplyLabel.isPast7Days);
                                    }
                                    else {
                                        if (resultHTTPApplyLabel.SpecialCommand) {
                                            sdk.ButterBar.showMessage({ html: "Uh oh, something went wrong. Here is the detailed error: " + resultHTTPApplyLabel.error, className: "redbb" });
                                        }
                                        else {
                                            sdk.ButterBar.showMessage({ html: "Uh oh, something went wrong while sending. Here is the detailed error:<BR><BR>" + resultHTTPApplyLabel.error, className: "redbb" });
                                        }
                                    }
                                    MainButtonPressed = false;
                                }
                                if (resultHTTPApplyLabel.success && resultHTTPApplyLabel.ErrorsByRecipientString == null) {
                                    if (closeWindow) {
                                        composeView.close();
                                        composeView.dispatch('destroy');
                                        if (isComposeInlineReply) { sdk.Router.goto(sdk.Router.NativeRouteIDs.INBOX); }
                                    }
                                }
                            }
                        }
                    }

                    function UserModifiedTestAddresses() {
                        var inputbox = document.getElementById(settingsID + "TestEmailValue");
                        myTestAddresses = inputbox.value;
                        localStorage.setItem("myTestAddresses", inputbox.value);
                    }



                    function SendTestEmail(intDraftID, strTestEmails, composeSubject) {


                        var campaignId;
                        if (strTestEmails == "") {
                            strTestEmails = "zzz";
                        }

                        var xmlTest = new XMLHttpRequest();

                        var URLParams = "gmass/send?emailAddress=" + sdk.User.getEmailAddress() + "&draftId=" + intDraftID + "&subject=" + encodeURIComponent(composeSubject) + "&gu=" + encodeURIComponent(document.location.href) + "&deleteDraft=false" + "&ReplyTo=" + encodeURIComponent(myReplyTo) + "&TestAddresses=" + encodeURIComponent(strTestEmails.replace(" ", ""));

                        if (formData['send-test-type-draft'] == "draft") {
                            URLParams = URLParams + "&saveAsDraft=true";
                        }

                        if (myOpenTracking == "on") {
                            URLParams = URLParams + "&OpenTracking=true";
                        }
                        if (myClickTracking == "on") {
                            URLParams = URLParams + "&ClickTracking=true";
                        }
                        if ((myNewReply == "reply")) {
                            URLParams = URLParams + "&appendToThread=true";
                            if (GMassReplyMessage != 0) {
                                URLParams = URLParams + "&CampaignIDToReplyTo=" + GMassReplyMessage;
                            }
                        }

                        if (GMassImages == "r") {
                            URLParams = URLParams + "&Images=r";
                        }
                        else if (GMassImages == "e") {
                            URLParams = URLParams + "&Images=e";
                        }

                        if (formData.AutoSpintax == "true") {
                            URLParams = URLParams + "&AutoSpintax=true";
                        }

                        if ((SMTP == "on")) {
                            URLParams = URLParams + "&UseSMTP=true";
                        }
                        else if ((SMTP == "off")) {
                            URLParams = URLParams + "&UseSMTP=false";
                        }
                        else if ((SMTP == "notset")) {
                            URLParams = URLParams + "&UseSMTP=notset";
                        }

                        URLParams = URLParams + "&SmtpServerId=" + formData.SmtpServerId;

                        if (formData.PreviewText) {
                            URLParams += "&PreviewText=" + encodeURIComponent(formData.PreviewText);
                        }

                        if (formData.Triggers == "true") {
                            URLParams = URLParams + "&Triggers=true";
                            URLParams = URLParams + "&TriggerOpenCampaign=" + TriggerOpenCampaignID;
                            URLParams = URLParams + "&TriggerClickCampaign=" + TriggerClickCampaignID;
                            URLParams = URLParams + "&TriggerReplyCampaign=" + TriggerReplyCampaignID;
                            URLParams = URLParams + "&TriggerOpenThread=" + (formData.TriggerOpenThreaded == "on");
                            URLParams = URLParams + "&TriggerClickThread=" + (formData.TriggerClickThreaded == "on");
                            URLParams = URLParams + "&TriggerReplyThread=" + (formData.TriggerReplyThreaded == "on");
                        }

                        var FromContact = composeView.getFromContact();
                        URLParams = URLParams + "&FromName=" + encodeURIComponent(FromContact.name);

                        xmlTest.open("GET", BaseURLSend + URLParams, true);
                        xmlTest.send();
                        xmlTest.onreadystatechange = function () {
                            if (xmlTest.readyState == 4) {

                                var resultHTTPApplyLabel = JSON.parse(xmlTest.responseText);

                                if ((resultHTTPApplyLabel.success) && (resultHTTPApplyLabel.sentCount > 0)) {

                                    campaignId = resultHTTPApplyLabel.CampaignID;

                                    setLocalStorageBasicStuff();

                                    SetLocalStorageAF();

                                    setLocalStorageAB(formData.ABDecision, formData.ABFactor, formData.ABPercentage, formData.ABTimeAfter);

                                    localStorage.setItem("GMassTestSendOrDraft", (formData['send-test-type-send'] == "send" ? "send" : "draft"));
                                    localStorage.setItem("GMassTestSequence", (formData['send-test-sequence'] == "on" ? "on" : "off"));
                                    localStorage.setItem("GMassSMTP", (resultHTTPApplyLabel.UseSMTP ? "on" : (localStorage.getItem("GMassSMTP") == "notset" ? "notset" : "off")));


                                    if (formData['send-test-sequence'] == "on" && getBumpSettings().length > 0) {

                                        sdk.ButterBar.showMessage({ html: resultHTTPApplyLabel.UIMessage + " Now sending test emails for each auto followup stage...", time: 30000 });

                                        SendTestSequence(campaignId, 1, strTestEmails, campaignId);



                                    }
                                    else if (formData['send-test-sequence'] == undefined && getBumpSettings().length > 0) {



                                        sdk.ButterBar.showMessage({ html: resultHTTPApplyLabel.UIMessage + " You have auto followups (sequences) set, so if you want to test the whole sequence choose the option in the Send Test button options panel.", time: 10000 });




                                    }
                                    else {
                                        sdk.ButterBar.showMessage({ html: resultHTTPApplyLabel.UIMessage, time: 10000 });
                                    }



                                }
                                else {
                                    if ((resultHTTPApplyLabel.sentCount == 0) && (resultHTTPApplyLabel.success)) {
                                        var SendError = resultHTTPApplyLabel.ErrorsByRecipientString;
                                        var BBMessage = "Error: Your test email to " + strTestEmails + " was NOT sent. It might be on your account's Unsubscribe or Bounce list."
                                        if (SendError != null) {
                                            BBMessage += " There was an error:<BR><BR>" + SendError;
                                        }
                                        sdk.ButterBar.showMessage({ html: BBMessage, time: 25000, className: "redbb" });
                                    }
                                    else {
                                        sdk.ButterBar.showMessage({ html: "There was a PROBLEM sending your test email to " + strTestEmails + ": " + resultHTTPApplyLabel.error, time: 25000, className: "redbb" });
                                    }
                                }
                                TestButton.innerHTML = "Send Test";
                                TestButton.disabled = false;
                            }

                        }
                    }

                    function SendTestSequence(campaignId, stage, testAddresses, priorBumpCampaignId) {
                        var bumpSettings = getBumpSettings();
                        if (stage > bumpSettings.length)
                                return;

                        if (stage > 1) {
                            sdk.ButterBar.showMessage({ html: "DONE sending a test for Stage " + (stage - 1) + ". Now sending a test for Stage " + stage + "...", time: 30000 });
                        }
                        var querystring = GenerateSendURL("xxx");
                        if (querystring.includes('UseSMTP=true') && SMTP == 'off'){
                            querystring = querystring.replace('&UseSMTP=true', '&UseSMTP=false');
                        }
                        querystring = querystring.replace('&saveAsDraft=true', '');
                        if (formData['send-test-type-draft'] == "draft") {
                            querystring += "&saveAsDraft=true";
                        }

                        querystring += '&originalcampaignid=' + campaignId + '&whichbump=' + stage;
                        querystring += "&TestAddresses=" + encodeURIComponent(testAddresses.replace(" ", ""));
                        querystring += "&priorBumpCampaignId=" + priorBumpCampaignId;

                        querystring = querystring.replace(BaseURLSend, '');
                        querystring = querystring.replace('gmass/send', 'bumper/sendtest');
                        var serverDomain = BaseURL;

                        var xmlTest = new XMLHttpRequest();


                        xmlTest.open("GET", serverDomain + querystring, true);

                        xmlTest.send();
                        xmlTest.onreadystatechange = function () {
                            if (xmlTest.readyState == 4) {

                                var resultHTTPApplyLabel = JSON.parse(xmlTest.responseText);

                                if (resultHTTPApplyLabel.success) {

                                    var campaignIdNewStage = resultHTTPApplyLabel.CampaignID;
                                    if (stage < bumpSettings.length) {
                                        SendTestSequence(campaignId, stage + 1, testAddresses, campaignIdNewStage);
                                    }
                                    else {
                                        sdk.ButterBar.showMessage({ html: "DONE sending a test for Stage " + stage + "! This completes the test." + (resultHTTPApplyLabel.threadedDraftsWarning ? "<BR><BR>Warning: You chose to create DRAFTS to see your sequence, and your DRAFTS have been threaded into the same conversation, but currently the Gmail interface doesn't support the viewing of DRAFTS grouped together in a conversation, so opening the DRAFTS may produce a strange view." : "") + (!resultHTTPApplyLabel.allowed ? "<BR><BR>FYI, while you were able to send a test sequence, you do not actually have sequences enabled on your account. You need to <a style='color: #99FFFF' href='https://app.gmass.co/dashboard/auth?s=account&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + "'>upgrade</a> to get access to sequences." : ""), time: 30000 });
                                    }
                                }
                                else{

                                        sdk.ButterBar.showMessage({ html: "There was an ERROR while sending Stage " + stage + "! The error is: " + resultHTTPApplyLabel.errordescription, time: 30000 });

                                }

                            }

                        }
                    }

                    function SetLocalStorageAF() {
                        var bumpSettings = getBumpSettings();
                        bumpSettings.forEach(b => {
                            var prefix = b.ordinal || b.bump;
                            
                            localStorage.setItem(`GMass${prefix}BumpDays`, b.days);
                            localStorage.setItem(`GMass${prefix}BumpAddedText`, b.addedText);
                            localStorage.setItem(`GMass${prefix}BumpTime`, b.time);  
                            localStorage.setItem(`GMass${prefix}BumpAction`, b.action);
                            localStorage.setItem(`GMass${prefix}BumpCustom`, b.campaignId);
                            localStorage.setItem(`GMass${prefix}BumpChoice`, b.choice);
                            localStorage.setItem(`GMass${prefix}BumpNOT`, b.sameNew);
                            
                        });
                    }

                    function SpamSolver(intDraftID) {

                        saveFormData();
                        GMass.confirm({
                            title: "Spam Solver",
                            message: "<p>The Spam Solver shows you whether your emails are landing in the Inbox, Spam, or Promotions folder. Then, you can vary your message until you get higher Inbox placement.\n\nClick <strong>Go!</strong> to watch the magic happen.</p><p>Note that 15-20 emails will be sent from your account, mostly to ajay@domain addresses.</p>",
                            buttons: [
                                {
                                    html: 'Go!',
                                    class: 'success',
                                    result: 'launch-spamsolver'
                                },
                                {
                                    html: 'Cancel',
                                    class: 'danger',
                                    result: 'cancel'
                                }
                            ],
                            callback: function (result) {
                                if (result == 'launch-spamsolver') {

                                    sdk.ButterBar.showMessage({ text: "Launching the Spam Solver...", time: 30000 });
                                    var xmlOuter = new XMLHttpRequest();
                                    xmlOuter.open("GET", "https://www.gmass.co/inbox/seeds", true);
                                    xmlOuter.send();
                                    xmlOuter.onreadystatechange = function () {
                                        if (xmlOuter.readyState == 4) {
                                            var resultSeedsJSON = JSON.parse(xmlOuter.responseText);

                                            var URLParams = "gmass/send?SeedTest=true&emailAddress=" + sdk.User.getEmailAddress() + "&draftId=" + intDraftID + "&gu=" + encodeURIComponent(document.location.href) + "&deleteDraft=false" + "&ReplyTo=" + encodeURIComponent(myReplyTo) + "&TestAddresses=" + resultSeedsJSON.Seeds.toString();

                                            if (myOpenTracking == "on") {
                                                URLParams = URLParams + "&OpenTracking=true";
                                            }
                                            if (myClickTracking == "on") {
                                                URLParams = URLParams + "&ClickTracking=true";
                                            }

                                            if (GMassImages == "r") {
                                                URLParams = URLParams + "&Images=r";
                                            }
                                            else if (GMassImages == "e") {
                                                URLParams = URLParams + "&Images=e";
                                            }

                                            if ((SMTP == "on")) {
                                                URLParams = URLParams + "&UseSMTP=true";
                                            }
                                            else if ((SMTP == "off")) {
                                                URLParams = URLParams + "&UseSMTP=false";
                                            }
                                            else if ((SMTP == "notset")) {
                                                URLParams = URLParams + "&UseSMTP=notset";
                                            }

                                            URLParams = URLParams + "&SmtpServerId=" + formData.SmtpServerId;

                                            if (formData.PreviewText != '') {
                                                URLParams += "&PreviewText=" + encodeURIComponent(formData.PreviewText);
                                            }

                                            var FromContact = composeView.getFromContact();
                                            URLParams = URLParams + "&FromName=" + encodeURIComponent(FromContact.name);
                                            window.open("https://www.gmass.co/" + "spamsolver?url=" + encodeURIComponent(BaseURLSend + URLParams));

                                            setLocalStorageAB(formData.ABDecision, formData.ABFactor, formData.ABPercentage, formData.ABTimeAfter);

                                            setLocalStorageBasicStuff();
                                            localStorage.setItem("GMassSMTP", (SMTP == "on" ? "on" : (localStorage.getItem("GMassSMTP") == "notset" ? "notset" : "off")));


                                        }
                                    }
                                } else {
                                }
                            }
                        });

                    }

                    function setTemplateStorage() {
                        if (localStorage.getItem("GMassSetSubjectMessage") == null) {
                            localStorage.setItem("GMassSetSubjectMessage", "true");
                        }
                        if (localStorage.getItem("GMassSetAFs") == null) {
                            localStorage.setItem("GMassSetAFs", "true");
                        }
                        if (localStorage.getItem("GMassSetSettings") == null) {
                            localStorage.setItem("GMassSetSettings", "true");
                        }
                    }

                    function getBumpDefaults() {
                        var bumpDefaults =
                            [
                                { days: 2, addedText: "Just making sure you saw this." },
                                { days: 5, addedText: "I've reached out a couple times, but I haven't heard back. I'd appreciate a response to my email below." },
                                { days: 8, addedText: "I'm sure you're busy, but if you could respond to my email below, I can cross this off my list."},
                                { days: 11, addedText: "Should I stop bothering you?" },
                                { days: 14, addedText: "I have not heard from you.Let me know please." },
                                { days: 17, addedText: "Can I please get a response?" },
                                { days: 20, addedText: "Hello?" },
                                { days: 23, addedText: "I'm marking you down as being not interested." }
                            ];


                        var ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];
                        for (var i = 9; i < 100; i++) {
                            ordinals.push(i);
                            bumpDefaults.push({ days: 23 + i, text: "Hello?" });
                        }
                        ordinals.forEach((b, i) => {

                            if (localStorage.getItem(`GMass${b}BumpDays`) != null)
                                bumpDefaults[i].days = localStorage.getItem(`GMass${b}BumpDays`);

                            if (localStorage.getItem(`GMass${b}BumpTime`) != null && localStorage.getItem(`GMass${b}BumpTime`) != 'null')
                                bumpDefaults[i].time = localStorage.getItem(`GMass${b}BumpTime`);

                            if (localStorage.getItem(`GMass${b}BumpAddedText`) != null)
                                bumpDefaults[i].addedText = localStorage.getItem(`GMass${b}BumpAddedText`);

                            if (localStorage.getItem(`GMass${b}BumpAction`) != null)
                                bumpDefaults[i].action = localStorage.getItem(`GMass${b}BumpAction`);

                            if (localStorage.getItem(`GMass${b}BumpCustom`) != null)
                                bumpDefaults[i].campaignId = localStorage.getItem(`GMass${b}BumpCustom`);

                            if (localStorage.getItem(`GMass${b}BumpNOT`) != null && localStorage.getItem(`GMass${b}BumpNOT`) != "null")
                                bumpDefaults[i].sameNew = localStorage.getItem(`GMass${b}BumpNOT`);

                            if (localStorage.getItem(`GMass${b}BumpChoice`) != null)
                                bumpDefaults[i].choice = localStorage.getItem(`GMass${b}BumpChoice`);
                        });

                        return bumpDefaults;
                    }

                    function AnalyzeThis(intDraftID) {

                        saveFormData();
                        sdk.ButterBar.showMessage({ text: "Sending your email for analysis...", time: 30000 });
                        var xmlOuter = new XMLHttpRequest();
                        xmlOuter.open("GET", "https://www.gmass.co/analyze?calledFromExtension=1", true);
                        xmlOuter.send();
                        xmlOuter.onreadystatechange = function () {
                            if (xmlOuter.readyState == 4) {
                                var resultRandomJSON = JSON.parse(xmlOuter.responseText);

                                var xmlTest = new XMLHttpRequest();

                                var URLParams = "gmass/send?SeedTest=true&emailAddress=" + sdk.User.getEmailAddress() + "&draftId=" + intDraftID + "&gu=" + encodeURIComponent(document.location.href) + "&deleteDraft=false" + "&ReplyTo=" + encodeURIComponent(myReplyTo) + "&TestAddresses=" + resultRandomJSON.emailaddress.toString();

                                if (myOpenTracking == "on") {
                                    URLParams = URLParams + "&OpenTracking=true";
                                }
                                if (myClickTracking == "on") {
                                    URLParams = URLParams + "&ClickTracking=true";
                                }

                                if (GMassImages == "r") {
                                    URLParams = URLParams + "&Images=r";
                                }
                                else if (GMassImages == "e") {
                                    URLParams = URLParams + "&Images=e";
                                }

                                if ((SMTP == "on")) {
                                    URLParams = URLParams + "&UseSMTP=true";
                                }
                                else if ((SMTP == "off")) {
                                    URLParams = URLParams + "&UseSMTP=false";
                                }
                                else if ((SMTP == "notset")) {
                                    URLParams = URLParams + "&UseSMTP=notset";
                                }

                                URLParams = URLParams + "&SmtpServerId=" + formData.SmtpServerId;


                                if (formData.PreviewText != '') {
                                    URLParams += "&PreviewText=" + encodeURIComponent(formData.PreviewText);
                                }

                                var FromContact = composeView.getFromContact();
                                URLParams = URLParams + "&FromName=" + encodeURIComponent(FromContact.name);

                                xmlTest.open("GET", BaseURLSend + URLParams, true);

                                xmlTest.send();
                                xmlTest.onreadystatechange = function () {
                                    if (xmlTest.readyState == 4) {

                                        var resultHTTPApplyLabel = JSON.parse(xmlTest.responseText);

                                        if ((resultHTTPApplyLabel.success) && (resultHTTPApplyLabel.sentCount > 0)) {
                                            sdk.ButterBar.showMessage({ html: "Done! Launching the results in a popup...", time: 30000 });
                                            window.open("https://www.gmass.co/analyze?emailaddress=" + encodeURIComponent(resultRandomJSON.emailaddress.toString()) + "&alreadySent=true", "analyzer", "width=1300, height=900, left=100, top=100, resizable=yes, scrollbars=yes");

                                            setLocalStorageAB(formData.ABDecision, formData.ABFactor, formData.ABPercentage, formData.ABTimeAfter);

                                            setLocalStorageBasicStuff();

                                            localStorage.setItem("GMassSMTP", (resultHTTPApplyLabel.UseSMTP ? "on" : (localStorage.getItem("GMassSMTP") == "notset" ? "notset" : "off")));

                                        }
                                        else {
                                            if ((resultHTTPApplyLabel.sentCount == 0) && (resultHTTPApplyLabel.success)) {
                                                var SendError = resultHTTPApplyLabel.ErrorsByRecipientString;
                                                var BBMessage = "Error: Your email could not be sent for analysis."
                                                if (SendError != null) {
                                                    BBMessage += " There was an error: " + SendError;
                                                }
                                                sdk.ButterBar.showMessage({ text: BBMessage, time: 15000, className: "redbb" });
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ text: "There was a PROBLEM analyzing your email: " + resultHTTPApplyLabel.error, time: 5000, className: "redbb" });
                                            }
                                        }

                                    }

                                }

                            }
                        }
                    }


                    function UserModifiedMaxEmails(TheEmail, MultiSendBox) {
                        var inputbox = document.getElementById(settingsID + "MaxEmails");
                        if ((isNaN(inputbox.value)) && (inputbox.value != "") && (inputbox.value != "max")) {
                            sdk.ButterBar.showMessage({ html: "The 'Spread Out' field needs a valid number or must be left blank.", time: 10000, className: "redbb" });
                            inputbox.value = myMaxEmails;
                            if (myMaxEmails == "max") { inputbox.style.color = "gray"; }
                        }
                        else if ((inputbox.value != "" && !isNaN(inputbox.value)) && (inputbox.value < 0)) {
                            sdk.ButterBar.showMessage({ html: "The 'Spread Out' field must be a number of at least 1.", time: 10000, className: "redbb" });
                            inputbox.value = myMaxEmails;
                            if (myMaxEmails == "max") { inputbox.style.color = "gray"; }
                        }
                        else {
                            myMaxEmails = inputbox.value;
                        }
                    }

                    function UserModifiedRecurEvery(DropDown) {
                        var inputbox = document.getElementById(settingsID + "RecurEvery");
                        if ((isNaN(inputbox.value)) && (inputbox.value != "")) {
                            sdk.ButterBar.showMessage({ html: "The 'Repeat Every' field needs a valid number or must be left blank.", time: 10000, className: "redbb" });
                            inputbox.value = myRecurEvery;

                        }
                        else if (!isNaN(inputbox.value) && (inputbox.value < 1 || inputbox.value > 365)) {
                            sdk.ButterBar.showMessage({ html: "The 'Repeat Every' field needs to be a number between 1 and 365.", time: 10000, className: "redbb" });
                            inputbox.value = myRecurEvery;
                        }
                        else {
                            if (inputbox.value != myRecurEvery) {
                                myRecurEvery = inputbox.value;
                                var i;
                                for (i = 0; i < DropDown.length; i++) {
                                    if (myRecurEvery > 1) {
                                        if (!DropDown.options[i].text.includes("s")) {
                                            DropDown.options[i].text += "s";
                                        }
                                    }
                                    else {
                                        DropDown.options[i].text = DropDown.options[i].text.replace("s", "");
                                    }
                                }
                            }
                        }
                    }

                    function UserModifiedSuppressionDays() {
                        var inputbox = document.getElementById(settingsID + "SuppressionDays");
                        if (isNaN(inputbox.value) && (inputbox.value != "")) {
                            sdk.ButterBar.showMessage({ html: "The 'Suppression by Days' field needs a valid number or must be left blank.", time: 10000, className: "redbb" });
                            inputbox.value = mySuppressionDays;

                        }
                        else {
                            mySuppressionDays = inputbox.value;
                        }
                    }
                    function DateTimeSelected(event) {
                        var option = document.getElementById(settingsID + "GMassDateDropdown").value;
                        var datetimeField = document.getElementById(settingsID + "GMassDateTime");
                        if (event) {
                            var date = new Date();
                            var userTimeZoneOffset = AccountStatus.TimeZoneOffset != null ? AccountStatus.TimeZoneOffset : -date.getTimezoneOffset();
                            var clearMinSecMs = function (date) {
                                date.setMinutes(0);
                                date.setSeconds(0);
                                date.setMilliseconds(0);
                            };
                            date = applyTimeZoneOffset(date, userTimeZoneOffset);

                            switch (option) {
                                case 'Now':
                                    GMassDateDropdown = "Now";
                                    break;
                                case 'FiveMinutes':
                                    date.setTime(date.getTime() + 1000 * 300);
                                    GMassDateDropdown = "FiveMinutes";
                                    break;
                                case 'OneHour':
                                    date.setTime(date.getTime() + 1000 * 60 * 60);
                                    GMassDateDropdown = "OneHour";
                                    break;
                                case 'ThreeHours':
                                    date.setTime(date.getTime() + 1000 * 3 * 60 * 60);
                                    GMassDateDropdown = "ThreeHours";
                                    break;
                                case 'TomorrowMor':
                                    date.setDate(date.getDate() + 1);
                                    date.setHours(8);
                                    clearMinSecMs(date);
                                    GMassDateDropdown = "TomorrowMor";
                                    break;
                                case 'TomorrowAft':
                                    date.setDate(date.getDate() + 1);
                                    date.setHours(13);
                                    clearMinSecMs(date);
                                    GMassDateDropdown = "TomorrowAft";
                                    break;
                                case 'TomorrowEve':
                                    date.setDate(date.getDate() + 1);
                                    date.setHours(19);
                                    clearMinSecMs(date);
                                    GMassDateDropdown = "TomorrowEve";
                                    break;
                                case 'Custom':
                                    GMassDateDropdown = "Custom";
                                    break;
                                default:
                                    break;
                            }
                        }

                        if (option != 'Now') {
                            $(datetimeField).parent().addClass('expanded');
                            if (date) {
                                datetimeField.value = FormatDate(date, AccountStatus);
                            }
                        } else {
                            $(datetimeField).parent().removeClass('expanded');
                            datetimeField.value = '';
                        }

                        GMassDateTextBox = datetimeField.value;
                        Reposition(300);
                    }
                    function applyTimeZoneOffset(date, timeZoneOffset) {
                        var localOffset = -date.getTimezoneOffset();
                        var offsetDifference = timeZoneOffset - localOffset;
                        return new Date(date.getTime() + offsetDifference * 60 * 1000);
                    }
                    function UserModifiedDateTime() {
                        var select = document.getElementById(settingsID + "GMassDateDropdown");
                        select.value = 'Custom';
                        var datetimeField = document.getElementById(settingsID + "GMassDateTime");
                        GMassDateDropdown = "Custom";
                        GMassDateTextBox = datetimeField.value;
                    }
                    function loadFormData() {
                        if (!(JSON.stringify(formData) === '{}')) {

                            LoadedMultiSendAccounts = false;
                            if (formData.Verify != undefined) {
                                GMassVerify = "true";
                            }
                            else {
                                GMassVerify = "false";
                            }

                            if (formData.AutoSpintax != undefined) {
                                GMassAutoSpintax = "true";
                            } else {
                                GMassAutoSpintax = "false";
                            }

                            if (formData.SkipSent != undefined) {
                                GMassSkipSent = "true";
                            }
                            else {
                                GMassSkipSent = "false";
                            }

                            if (formData.SuppressionAggressive != undefined) {
                                SuppressionAggressive = "true";
                            }
                            else {
                                SuppressionAggressive = "false";
                            }

                            if (formData.ABTest != undefined) {
                                ABTest = (formData.ABTest == "true" ? "true" : "false");
                                ABPercentage = formData.ABPercentage;
                                ABTimeAfter = formData.ABTimeAfter;
                                ABDecision = formData.ABDecision;
                                ABFactor = formData.ABFactor;
                            }
                            if (formData.Triggers != undefined) {
                                Triggers = (formData.Triggers == "true" ? "true" : "false");
                                TriggerOpenThreadedValue = formData.TriggerOpenThreaded;
                                TriggerClickThreadedValue = formData.TriggerClickThreaded;
                                TriggerReplyThreadedValue = formData.TriggerReplyThreaded;
                                TriggerOpenDelayValue = formData.TriggerOpenDelay;
                                TriggerClickDelayValue = formData.TriggerClickDelay;
                                TriggerReplyDelayValue = formData.TriggerReplyDelay;
                                GMassTriggerReplyPhrases = formData.TriggerReplyPhrases.join('|');
                            }
                            if (formData['1SameNew'] != undefined) {
                                GMassFirstBumpNOT = formData.FirstSameNew;
                                GMassSecondBumpNOT = formData.SecondSameNew;
                                GMassThirdBumpNOT = formData.ThirdSameNew;
                                GMassFourthBumpNOT = formData.FourthSameNew;
                                GMassFifthBumpNOT = formData.FifthSameNew;
                                GMassSixthBumpNOT = formData.SixthSameNew;
                                GMassSeventhBumpNOT = formData.SeventhSameNew;
                                GMassEighthBumpNOT = formData.EighthSameNew;
                            }

                            if (formData.PreviewText != undefined) {
                                GMassPreviewText = formData.PreviewText;
                            }
                            if (formData.MultiSendTokenIds != undefined) {
                                MultiSendTokenIds = formData.MultiSendTokenIds.join(',');
                            }
                            if (formData.MultiSend != undefined) {
                                MultiSendBox = "on";

                            }
                            else {
                                MultiSendBox = "off";
                            }

                            if (formData.SendDaysOn != undefined) {
                                SendDaysOn = "on";
                            }
                            else {
                                SendDaysOn = "off";
                            }
                            if (formData.EndTimeBox != undefined) {
                                EndTimeBox = "on";
                            }
                            else {
                                EndTimeBox = "off";
                            }  
                            if (formData.EndTime != undefined) {
                                EndTime = formData.EndTime;
                            }
 
                            if (formData.SendDays != undefined) {
                                SendDaysValue = formData.SendDays;
                            }

                            if (formData.SmtpServerId != undefined) {
                                smtpServerId = formData.SmtpServerId;
                            }

                            if (formData.DraftSaveSpeed != undefined) {
                                draftSaveSpeed = formData.DraftSaveSpeed;
                            }

                            if (formData['SendSave'] != undefined) {
                                sendSave = formData['SendSave'];
                            }
                        }

                    }

                    function saveProgress() {

                        saveFormData();
                        var sendUrl = GenerateSendURL('x');
                        if (sendUrlCurrent == '') {
                            sendUrlCurrent = sendUrl;
                        }
                        if (SettingsFormed == true && GotState == true && sendUrl != sendUrlCurrent) {

                            sendUrlCurrent = sendUrl;

                            sdk.log("save to DB")
                            sdk.log(ComposeDraftID);
                            sdk.log(sdk.User.getEmailAddress());

                            var xmlhttpUser = new XMLHttpRequest();
                            xmlhttpUser.open("GET", sendUrlCurrent.replace("gmass/send", "gmass/savecampaign2"));
                            xmlhttpUser.send();

                            xmlhttpUser.onreadystatechange = function () {
                                if (xmlhttpUser.readyState == 4) {
                                    sdk.log("SAVED TO DB");
                                }
                            }
                        }
                    }

                    function AddThreeColumns(existingColumns) {

                        if (!existingColumns.includes("FirstName|Friend") && !existingColumns.includes("FirstName")) {
                            existingColumns.push("FirstName|Friend");
                            PersonalizationItemsChanged = true;
                        }
                        if (!existingColumns.includes("LastName")) {
                            existingColumns.push("LastName");
                            PersonalizationItemsChanged = true;
                        }
                        if (!existingColumns.includes("EmailAddress")) {
                            existingColumns.push("EmailAddress");
                            PersonalizationItemsChanged = true;
                        }

                        if (PersonalizationItemsChanged) {
                            sdk.ButterBar.showMessage({ text: "We adjusted the personalization columns for this campaign to include FirstName, LastName, and EmailAddress.", time: 20000 });
                        }

                        return existingColumns;
                    }
                    function RemoveThreeColumns(existingColumns) {
                        if (existingColumns.includes("FirstName|Friend") && !(SheetsOnlyPersonalization.includes("FirstName") || SheetsOnlyPersonalization.includes("FirstName|Friend"))) {
                            PersonalizationItemsChanged = true;
                            existingColumns = existingColumns.filter(x => x !== "FirstName|Friend");
                        }
                        if (existingColumns.includes("LastName") && !SheetsOnlyPersonalization.includes("LastName")) {
                            PersonalizationItemsChanged = true;
                            existingColumns = existingColumns.filter(x => x !== "LastName");
                        }
                        if (existingColumns.includes("EmailAddress") && !SheetsOnlyPersonalization.includes("EmailAddress")) {
                            PersonalizationItemsChanged = true;
                            existingColumns = existingColumns.filter(x => x !== "EmailAddress");
                        }

                        if (existingColumns.length == 0) {
                            PersonalizationItemsChanged = false;
                            existingColumns.push("FirstName|Friend");
                            existingColumns.push("LastName");
                            existingColumns.push("EmailAddress");
                        }

                        if (PersonalizationItemsChanged) {
                            sdk.ButterBar.showMessage({ text: "We adjusted the personalization columns for this campaign and removed FirstName, LastName, and EmailAddress.", time: 20000 });
                        }

                        return existingColumns;
                    }

                    function HasFreeHandAddresses(composeView) {
                        var toList = composeView.getToRecipients();
                        if (toList.filter(e => !e.emailAddress.includes("gmass.co")).length > 0) {
                            return true;

                        }
                        else {
                            return false;
                        }

                    }
                    function MonitorToFieldForListAddress() {

                        sdk.log('xxxx started monitoring To field for new/deleted addresses xxxxxx');

                        var NumberToAdded = 0;

                        composeView.on('toContactAdded', function ToAddressAdded(event) {
                            NumberToAdded++;
                            if (NumberToAdded < 250) {
                                clearInterval(composeView.ComposeMonitorInterval1);
                                clearInterval(composeView.ComposeMonitorInterval2);
                                ComposeInterval1Running = false;
                                ComposeInterval2Running = false;

                                if (LogIntervals) { sdk.log("both ComposeMonitor intervals cleared"); }

                                sdk.log('!!!!!!!@@@@@@@@@@@@@@@ to address added: ' + event.contact.emailAddress);
                                if (IsAddressAlias(event.contact.emailAddress) && (!ToList.some(e => e.emailAddress === event.contact.emailAddress))) {
                                    var DraftIDInterval = setInterval(function () {
                                        if (ComposeDraftID != '') {
                                            GotState = false;
                                            GetDraftState(event.contact.emailAddress);
                                            BumpSettingsSavedForDuringListSwitch = getBumpSettings();
                                            CreateSettingsBox();
                                            clearInterval(DraftIDInterval);
                                        }
                                        if (LogIntervals) { sdk.log("DraftIDInterval interval run"); }
                                    }, 1000);
                                }
                                else {
                                    if (!IsAddressAlias(event.contact.emailAddress)) {
                                        GMassPersonalization = AddThreeColumns(GMassPersonalization);
                                        if (PersonalizationItemsChanged == true) {
                                            PersonalizationItemsChanged = false;
                                            BumpSettingsSavedForDuringListSwitch = getBumpSettings();
                                            CreateSettingsBox();
                                        }


                                    }

                                    if (!(ComposeInterval1Running && ComposeInterval2Running)) {
                                        MonitorToFieldForHidingSend(composeView, GMassLaunchedCompose);
                                        if (LogIntervals) { sdk.log("both ComposeMonitor intervals started again at end of MonitorToFieldForListAddress"); }
                                    }

                                }
                            }
                            else {
                                sdk.log("over 250 addresses added, not taking action anymore");
                            }

                            if (composeView.SkipTContactRemoved == true) { composeView.SkipTContactRemoved = false; }


                        });
                        composeView.on('toContactRemoved', function ToAddressRemoved(event) {
                            if (!composeView.SkipTContactRemoved) {
                                clearInterval(composeView.ComposeMonitorInterval1);
                                clearInterval(composeView.ComposeMonitorInterval2);
                                ComposeInterval1Running = false;
                                ComposeInterval2Running = false;
                                if (LogIntervals) { sdk.log("both ComposeMonitor intervals cleared"); }

                                sdk.log('XXXXXXXX@@@@@@@@@@@@@@@ to address removed: ' + event.contact.emailAddress);

                                if (IsAddressAlias(event.contact.emailAddress)) {
                                    sdk.ButterBar.showMessage({ html: "Looks like you removed a list address from your campaign.", time: 20000 });
                                    var DraftIDInterval = setInterval(function () {
                                        if (ComposeDraftID != '') {
                                            GotState = false;
                                            GetDraftState('', false, true);
                                            BumpSettingsSavedForDuringListSwitch = getBumpSettings();
                                            CreateSettingsBox();
                                            clearInterval(DraftIDInterval);
                                        }
                                        if (LogIntervals) { sdk.log("DraftIDInterval interval run"); }
                                    }, 1000);
                                    if (!(ComposeInterval1Running && ComposeInterval2Running)) {
                                        MonitorToFieldForHidingSend(composeView, GMassLaunchedCompose);
                                        if (LogIntervals) { sdk.log("both ComposeMonitor intervals started again at end of MonitorToFieldForListAddress"); }
                                    }
                                }
                                else {
                                    if (!IsAddressAlias(event.contact.emailAddress) && !HasFreeHandAddresses(composeView)) {
                                        GMassPersonalization = RemoveThreeColumns(GMassPersonalization);
                                        if (PersonalizationItemsChanged == true) {
                                            PersonalizationItemsChanged = false;
                                            BumpSettingsSavedForDuringListSwitch = getBumpSettings();
                                            CreateSettingsBox();
                                        }


                                    }

                                    if (!(ComposeInterval1Running && ComposeInterval2Running)) {
                                        MonitorToFieldForHidingSend(composeView, GMassLaunchedCompose);
                                        if (LogIntervals) { sdk.log("both ComposeMonitor intervals started again at end of MonitorToFieldForListAddress"); }
                                    }
                                }
                            }

                        });




                        ToFieldMonitor = true;
                    }



                    function MonitorToFieldForHidingSend(composeView, GMassLaunchedCompose) {

                        composeView.ComposeMonitorInterval1 = setInterval(function () {


                            ComposeInterval1Running = true;
                            var ShouldWeHide = HideSendButton(composeView, GMassLaunchedCompose, boolForceShowSend);


                            if (ShouldWeHide == 999) {
                                sdk.ButterBar.showMessage({ html: "Oh no! Looks like you're about to cancel your subscription. If there's anything I can do to save you, email our founder at ajay@wordzen.com. Also, just FYI, you can <a style=\"color: #99FFFF\" href=\"https://www.gmass.co/g/transfer\" target=\"_blog\">transfer</a> your subscription to another Gmail account. Lastly, we've collapsed the Send button to make sure you don't press it by mistake.", time: 20000 });
                            }
                            else if (ShouldWeHide == 2) {
                                sdk.ButterBar.showMessage({ html: "Looks like you're about to issue a GMass command, so we've collapsed the Send button to make sure you don't press it by mistake.", time: 10000 });
                                sdk.log("weve hidden send button message - just displayed;");
                            }
                            else if (ShouldWeHide == 1) {
                                sdk.log("weve hidden send button message - just displayed;");
                                sdk.ButterBar.showMessage({
                                    html: "We've collapsed the Send button to prevent you from making a dastardly mistake!", time: 10000, buttons: [{
                                        title: "Show Send Button", onClick: function () {
                                            boolForceShowSend = true;

                                        }
                                    }
                                    ]
                                });
                            }
                            if ((composeView.getToRecipients().length > 0 && composeView.getToRecipients()[composeView.getToRecipients().length - 1].emailAddress.toLowerCase() == "showsend@gmass.co") || boolForceShowSend == true) {
                                boolForceShowSend = true;
                                clearInterval(composeView.ComposeMonitorInterval1);
                                ComposeInterval1Running = false;
                                sdk.log("compose monitor show/hide monitor cleared");
                            }

                            if (LogIntervals) { sdk.log("show/hide send button interval RAN"); }


                        }, 3000);
                        composeView.ComposeMonitorInterval2 = setInterval(function () {
                            ComposeInterval2Running = true;
                            if (composeView.getToRecipients().length > 0) {
                                if (ComposeFirstAddressAlias(composeView) && composeView.getToRecipients()[composeView.getToRecipients().length - 1].emailAddress.toLowerCase() == "expand@gmass.co") {
                                    clearInterval(composeView.ComposeMonitorInterval2);
                                    ComposeInterval2Running = false;
                                    ExpandToAddress(composeView);
                                }

                                if (ComposeFirstAddressAlias(composeView) && composeView.getToRecipients()[composeView.getToRecipients().length - 1].emailAddress.toLowerCase() == "download@gmass.co") {
                                    clearInterval(composeView.ComposeMonitorInterval2);
                                    ComposeInterval2Running = false;
                                    DownloadToAddress(composeView);
                                }
                            }
                            if (LogIntervals) { sdk.log("expand/download @gmass.co command interval run"); }
                        }, 3000);




                    }

                    if (App.includes("Gmail")) {
                        var elements = document.querySelectorAll('.inboxsdk__compose_sendButton');
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].style.backgroundColor = "transparent";
                            elements[i].style.paddingLeft = "0px";
                            elements[i].style.paddingRight = "6px";
                            elements[i].style.backgroundImage = "none";
                            elements[i].style.borderColor = "transparent";

                            if (App == "newGmail") {

                                elements[i].style.paddingRight = "0px";
                                if (elements[i].getAttribute("aria-label") == "GMass Settings") {
                                    elements[i].style.marginLeft = "0px";
                                }

                            }

                        }

                        var elements2 = document.querySelectorAll('.GmailClass');
                        for (var i = 0; i < elements2.length; i++) {


                            if (App == "newGmail") {
                                elements2[i].style.height = "36px";
                                elements2[i].style.fontSize = "14px";
                                elements2[i].style.width = "55px";
                                elements2[i].style.border = "none";
                                elements2[i].style.padding = "5px 5px 4px 5px";
                                elements2[i].style.alignItems = "center";
                                elements2[i].style.display = "inline-flex";
                                elements2[i].style.justifyContent = "center";
                                elements2[i].style.position = "relative";
                                elements2[i].style.zIndex = "0";
                                elements2[i].style.borderRadius = "4px 0px 0px 4px";
                                elements2[i].style.boxSizing = "border-box";
                                elements2[i].style.letterSpacing = ".15px";
                                elements2[i].style.fontFamily = "'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif";
                                elements2[i].style.backgroundImage = "none";
                                elements2[i].style.backgroundColor = "rgb(196, 35, 41)";
                            }
                            else {
                                elements2[i].style.height = "29px";
                                elements2[i].style.fontSize = "8pt";
                                elements2[i].style.lineHeight = "2.7em";
                            }


                        }

                        var elements3 = document.querySelectorAll('.GmailClassSettings2');
                        for (var i = 0; i < elements3.length; i++) {
                            if (App == "newGmail") {
                                elements3[i].style.height = "36px";
                                elements3[i].style.borderRadius = "0px 4px 4px 0px";
                            }

                            else {
                                elements3[i].style.height = "29px";
                            }

                        }
                    }
                }
            });
            function convertCampaignSelectToSelect2(dd, SettingsID, options) {

                options = options || {};
                options.placeholder = options.placeholder || 'Select message';
                options.templateResult = options.templateResult || formatCampaignText;
                if (dd.hasClass("select2-hidden-accessible"))
                    dd.select2('destroy');

                dd.addClass('campaign-select')

                dd.select2({
                    dropdownParent: (SettingsID == "none" ? options.dropdownParent : $('#' + SettingsID + 'bigdiv')),
                    width: "style",
                    templateResult: options.templateResult,
                    templateSelection: options.templateSelection,
                    placeholder: options.placeholder,
                    matcher: function (params, data) {
                        if (typeof data.text === 'undefined') {
                            return null;
                        }
                        var queryText = $.trim(params.term).toLowerCase();
                        if (queryText === '') {
                            return data;
                        }
                        var searchTerms = queryText.match(/(".*?"|[^"\s]+)(?=\s*|\s*$)/g);
                        searchTerms = searchTerms || [];

                        if (searchTerms.length == 0)
                            return data;
                        var show = true;
                        searchTerms.forEach(term => {

                            if (term.startsWith('"') && term.endsWith('"') && term.length >= 2) {
                                term = term.slice(1, -1);
                            }


                            var count = data.element.getAttribute('thecount');
                            if (count && (+params.term) > 0) {
                                if (parseInt(count) < parseInt(params.term)) {
                                    show = false;
                                }
                            }
                            else if (term === 'is:shared') {
                                if (data.element.getAttribute('IsShared') != 'yes') {
                                    show = false;
                                }
                            }
                            else if (term === 'has:autofollowups') {
                                if (data.element.getAttribute('HasBumps') != 1) {
                                    show = false;
                                }
                            }
                            else if (term === 'is:test') {
                                if (data.element.getAttribute('IsTest') != 1) {
                                    show = false;
                                }
                            }
                            else if (term === 'has:triggers') {
                                if (data.element.getAttribute('HasTriggers') != 1) {
                                    show = false;
                                }
                            }
                            else if (term === 'is:template') {
                                if (data.element.getAttribute('IsTemplate') != 1) {
                                    show = false;
                                }
                            }
                            else {
                                if (data.text.toLowerCase().indexOf(term) < 0) {
                                    show = false;
                                }
                            }


                        });

                        return show ? data : null;
                    }
                }).on('select2:selecting', function (e) {
                    let target = e.params.args.originalEvent.target;
                    if (target.parentNode && target.parentNode.tagName == 'svg')
                        target = target.parentNode;

                    if ($(target).hasClass('gmass-delete-template')) {
                        e.preventDefault();
                        const optionToRemove = e.params.args.data;
                        var li = $(target).parents('li');
                        li.fadeOut(function () {
                            li.remove();
                        });


                        $('select.campaign-select').each(function () {
                            if ($(this).hasClass('select2-hidden-accessible')) {
                                var dd = $(this);
                                const op = dd.find(`option[subjectname][value="${optionToRemove.id}"]`);
                                if (op.length > 0) {
                                    op.remove();
                                    const select2Instance = dd.data('select2');
                                    select2Instance.$element.data('select2', select2Instance);
                                    select2Instance.render();
                                }
                            }
                        });
                        $.post(BaseURL + 'gmass/removemessagetemplate',
                            {
                                emailaddress: sdk.User.getEmailAddress(),
                                GMassKey: localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()),
                                campaignId: + optionToRemove.id
                            }, function () { }, 'json');

                        return false;
                    }
                });
            }

            function LoadCampaignBBMessage(SubjectMessageSet, NumberAFS, ContentStuff, Settings) {

                return ((SubjectMessageSet ? "Your Subject and Message"
                    + (ContentStuff && ContentStuff.PreviewText && ContentStuff.PreviewText.length > 0 ? " and Preview Text" : "")
                    + " have been set." : "")
                    + (NumberAFS > 0 ? " " + NumberAFS + " auto follow-up stages have been set." : "")
                    + (Settings == true ? " Campaign settings have been set." : "")
                    + (ContentStuff && ContentStuff.attachments != "" ? " <span style='color: #BFFFC5'>REMEMBER:</span> This campaign had <span style='color: #BFFFC5'>attachments</span> last time, and GMass can't automatically re-attach those files, but you can do it manually. Remember to attach: <span style='color: #BFFFC5'>" + ContentStuff.attachments + "</span>" : ""));
            }
            function LaunchCompose(ToAddress) {

                sdk.Compose.openNewComposeView().then(function (composeviewobject) {
                    sdk.log("***composeview launched");

                    sdk.ButterBar.showMessage({ text: "GMass is configuring this Compose window...", time: 10000 });

                    if (window.GMass.tour.active) {
                        composeviewobject.setSubject('Let\'s do business together');
                        composeviewobject.setBodyHTML(`Hi ,
                            <p>You and I should do business together. When can we talk?</p>
                            <p>Talk soon!</p>`);
                    }

                });

                ComposeTagger = ToAddress;
            }


            function LaunchComposeCustomAF(ToAddress, stage) {

                sdk.Compose.openNewComposeView().then(function (composeviewobject) {
                    sdk.log("***composeview launched");
                    if (stage == -1) {
                        composeviewobject.setSubject("Trigger Template");
                        composeviewobject.setBodyHTML("<p>Replace this entire message (including this line) with your template, and set a Subject to later identify this template.<BR><BR>Compose the message to be used as your trigger email. You can use <strong>fonts, colors, images, attachments, and any personalization variables</strong> from your original campaign message.<BR><BR>The address in the To field is a special address to save trigger email templates, so don't change that.<BR><BR>When you're done, <strong>click the GMass button just to save the trigger template</strong> into your account. No emails will be sent when you hit the GMass button.<BR><BR>Then go back to your original campaign, <strong>refresh the Trigger templates dropdown</strong> and select this message.");
                    }
                    else {
                        composeviewobject.setSubject("Auto Followup Stage " + stage + " Template");
                        composeviewobject.setBodyHTML("<p>Replace this entire message (including this line) with your template, and set a Subject to later identify this template.<BR><BR>Compose the message to be used as your auto follow-up template. You can use <strong>fonts, colors, images, attachments, and any personalization variables</strong> from your original campaign message.<BR><BR>The address in the To field is a special address to save auto follow-up templates, so don't change that.<BR><BR>When you're done, <strong>click the GMass button just to save the auto follow-up template</strong> into your account. No emails will be sent when you hit the GMass button.<BR><BR>Then go back to your original campaign, <strong>refresh the Auto Followup dropdown</strong> and select this message. <a target='_blog' href='https://www.gmass.co/blog/rich-content-auto-follow-up-email-sequence/'>More instructions here</a>, including a <a href='https://youtu.be/zBHzOe0BDf0' target='_blog'>video</a> of this process.</p>");

                    }
                    sdk.ButterBar.showMessage({ html: "<span style='color: #99FFFF'>Now compose your template.</span> When you're done, click the GMass button to save the template. Then go back to your original campaign's settings box, refresh the dropdown menu, and choose the template you just created.", time: 60000 });


                });

                ComposeTagger = ToAddress;

            }
            function LaunchCompose2(ToAddresses, Subject, Body) {

                sdk.Compose.openNewComposeView().then(function (composeviewobject) {
                    sdk.log("composeview launched");

                    composeviewobject.setSubject(Subject);
                    composeviewobject.setBodyHTML(Body);

                });

                ComposeTagger = ToAddresses;
            }


            function CheckAuth(buttonClicked) {

                var xmlhttpUser = new XMLHttpRequest();
                xmlhttpUser.open("GET", BaseURL + "gmass/getuserstatus?emailaddress=" + sdk.User.getEmailAddress() + "&buttonClicked=" + buttonClicked + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())));
                xmlhttpUser.send();
                xmlhttpUser.onreadystatechange = function () {
                    if (xmlhttpUser.readyState == 4) {
                        UserResult = JSON.parse(xmlhttpUser.responseText);
                        EverSent = UserResult.everSent;
                        if ((!UserResult.hasToken || !UserResult.isAuthorized || (!buttonClicked && UserResult.IsKeyValid == false)) && ((parseInt(localStorage.getItem("GMassPopup")) < 2) || buttonClicked)) {
                            localStorage.setItem("GMassPopup", parseInt(localStorage.getItem("GMassPopup")) + 1);
                            var popuptype;
                            if ((UserResult.hasToken && UserResult.isAuthorized) && UserResult.IsKeyValid == false) {
                                popuptype = 2;
                            }
                            else {
                                popuptype = 1;
                            }
                            LaunchAuth(sdk.User.getEmailAddress(), popuptype);
                        }
                        else if (UserResult.isAuthorized && !UserResult.everSent && UserResult.ExtensionLoads <= 2 && !buttonClicked) {
                            sdk.log("extension loaded, launch sample");
                            LaunchGMassSample("reload");
                        }
                    }
                }

            }

            function CheckAuthSheets(buttonClicked) {

                var xmlhttpUser = new XMLHttpRequest();
                xmlhttpUser.open("GET", BaseURL + "data/userhassheetspermission?emailaddress=" + sdk.User.getEmailAddress());
                xmlhttpUser.send();

                xmlhttpUser.onreadystatechange = function () {
                    if (xmlhttpUser.readyState == 4) {
                        UserResult = JSON.parse(xmlhttpUser.responseText);
                        if (!UserResult.hasSheetsPermission) {
                            if (buttonClicked) {
                                if (UserResult.userExists) {
                                    if (UserResult.hasSheetsReadingPermission && UserResult.AdminBlockingDrive) {
                                        LaunchImport(true);
                                    }
                                    else {
                                        LaunchAuth(sdk.User.getEmailAddress(), 4, true);
                                    }
                                }
                                else {
                                    LaunchAuth(sdk.User.getEmailAddress(), 1, true);
                                }
                            }
                        }
                        else {
                            if (buttonClicked) {
                                LaunchImport(false);
                            }
                        }

                    }
                }

            }

            function LaunchUpgrade(isPast7Days) {

                var wLeft = window.screenLeft ? window.screenLeft : window.screenX;
                var wTop = window.screenTop ? window.screenTop : window.screenY;

                var left = wLeft + (window.innerWidth / 2) - (1400 / 2);
                var top = wTop + (window.innerHeight / 2) - (1200 / 2);

                var UpgradeDiv = document.createElement("div");
                UpgradeDiv.style.color = "black";
                UpgradeDiv.style.width = "300px";
                UpgradeDiv.style.height = "300px";
                UpgradeDiv.style.borderColor = "black";
                UpgradeDiv.style.borderStyle = "solid";
                UpgradeDiv.style.backgroundColor = "white";
                UpgradeDiv.style.display = "none";
                UpgradeDiv.setAttribute("id", "UpgradeDiv");
                var HTMLString = "<p style=\"color: #145DC9; text-align: center\"><img width=\"228px\" src=\"" + BaseURLCDN + "Extension2019Images/google_sheet_2.png\">";

                HTMLString = HTMLString + "<span>Please upgrade your account <strong>(" + sdk.User.getEmailAddress() + ")</strong> because " + (isPast7Days ? "your 7-day free trial has expired." : "free accounts are limited to sending 50 emails per rolling 24 hours.") + "<span>Don't worry - you can come right back here to send your campaign afterward.</span></span>";

                HTMLString = HTMLString + "<div id=UpgradeButton>Choose a plan</div></p>";
                HTMLString += "<div style='margin-top: 10px; text-align: center;'><a href='http://app.gmass.co/dashboard/auth?gmasskey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + "&url=/dashboard/recent'>See what I've sent</a></div>";
                UpgradeDiv.innerHTML = HTMLString;
                document.body.appendChild(UpgradeDiv);

                var UpgradeButtonDiv = document.getElementById("UpgradeButton");
                UpgradeButtonDiv.addEventListener("click", function () {
                    TestBPopup.close();
                    window.open('https://www.gmass.co/pricing?email=' + sdk.User.getEmailAddress(), 'PricingWindow', 'width=1400, height=1200, top=' + top + ', left=' + left);

                });

                UpgradeButtonDiv.style.width = "200px";
                UpgradeButtonDiv.style.textAlign = "center";
                UpgradeButtonDiv.style.color = "white";
                UpgradeButtonDiv.style.padding = "9px 5px 9px 12px";
                UpgradeButtonDiv.style.fontWeight = "bold";
                UpgradeButtonDiv.style.fontSize = "14px";
                UpgradeButtonDiv.style.borderRadius = "8px";
                UpgradeButtonDiv.style.margin = "auto";
                UpgradeButtonDiv.style.backgroundColor = "#145DC9";
                UpgradeButtonDiv.style.cursor = "pointer";

                var TestBPopup = $('#UpgradeDiv').bPopup({ opacity: 0.6, });
            }

            function LaunchAuth(emailAddress, messagetouser, triggeredbysheets = false) {

                if (sdk.debug) {
                    console.error('GMASS AUTH: ' + messagetouser);
                }


                if (document.getElementById('AuthDiv')) {
                    document.getElementById('AuthDiv').remove();

                }

                var para = document.createElement("div");
                para.style.color = "black";
                para.style.width = "300px";
                para.style.height = "300px";
                para.style.borderColor = "black";
                para.style.borderStyle = "solid";
                para.style.backgroundColor = "white";
                para.style.display = "none";
                para.setAttribute("id", "AuthDiv");
                var HTMLString = "<p style=\"text-align: center\"><img src=\"" + BaseURLCDN + "images/gmass_logo_auth.gif\">";

                if (messagetouser == 1) {
                    HTMLString = HTMLString + "You must connect GMass to your Google account for this to work.";
                }
                else if (messagetouser == 2) {
                    HTMLString = HTMLString + "This browser isn't connected to your account. Please re-connect.";
                }
                else if (messagetouser == 3) {
                    HTMLString = HTMLString + "Google recently made a change to how Google Sheets work, so we need to re-connect your account to your Sheets.";
                }
                else if (messagetouser == 4) {
                    HTMLString = HTMLString + "In order for GMass to find email lists stored in your Google Sheets, please authorize GMass to access your Sheets.";
                }
                else if (messagetouser == 5) {
                    HTMLString = HTMLString + "In order for GMass to be able to update your Google Sheet with reporting data, it needs permission.";
                }
                else if (messagetouser == 6) {
                    HTMLString = HTMLString + "GMass needs to connect to your Google Drive to retrieve your music file.";
                }

                HTMLString += "</p>";

                HTMLString = HTMLString + "<div id='authbutton'><img src='" + BaseURLCDN + "Extension2019Images/icon_sign_up_google.png'></div>";

                if (messagetouser == 5) {
                    HTMLString += '<p id="skipthisstep" style="text-align: center; font-size: 8pt; color: red; margin-bottom: 5px; text-decoration:underline; cursor: pointer">Skip this step.</p>';
                }
                para.innerHTML = HTMLString;
                document.body.appendChild(para);

                var skipthisstep = document.getElementById("skipthisstep");

                if (skipthisstep != null) {
                    skipthisstep.addEventListener("click", function () {
                        AuthBPopup.close();
                    });
                }

                var elLink = document.getElementById("authbutton");

                elLink.addEventListener("click", function () {
                    AuthBPopup.close();
                    SignupWithGoogle(emailAddress, messagetouser, triggeredbysheets);
                });

                var AuthButton = document.getElementById("authbutton");
                AuthButton.style.textAlign = "center";
                AuthButton.style.cursor = "pointer";

                var AuthBPopup = $('#AuthDiv').bPopup({
                    opacity: 0.6,
                    onClose: function () { }
                });

                document.dispatchEvent(new CustomEvent("gmass-auth-shown", {
                    detail: {
                        message: HTMLString
                    }
                }));
            }

            function SignupWithGoogle(emailAddress, messagetouser = 1, triggeredbysheets = false) {
                var wLeft = window.screenLeft ? window.screenLeft : window.screenX;
                var wTop = window.screenTop ? window.screenTop : window.screenY;
                var left = wLeft + (window.innerWidth / 2) - (600 / 2);
                var top = wTop + (window.innerHeight / 2) - (800 / 2);
                var xmlhttpUser = new XMLHttpRequest();
                xmlhttpUser.open("GET", "https://www.gmass.co/" + "oauth/getgmassdotcocookies");
                xmlhttpUser.withCredentials = true;
                xmlhttpUser.send();
                xmlhttpUser.onreadystatechange = function () {
                    if (xmlhttpUser.readyState == 4) {
                        var CookieResult;
                        var CookieStringForURL;

                        if (xmlhttpUser.status == 200) {

                            try {
                                CookieResult = JSON.parse(xmlhttpUser.responseText);
                                CookieStringForURL = "&GMassReferrer=" + encodeURIComponent(CookieResult.GMassReferrer) + "&GMassLanding=" + encodeURIComponent(CookieResult.GMassLanding) + "&GMassReferrerAlt=" + encodeURIComponent(CookieResult.GMassReferrerAlt) + "&GMassLandingAlt=" + encodeURIComponent(CookieResult.GMassLandingAlt) + "&GMassOptin=" + encodeURIComponent(CookieResult.GMassOptin) + "&GMassDate=" + encodeURIComponent(CookieResult.GMassDate) + "&GMassAffiliateID=" + encodeURIComponent(CookieResult.GMassAffiliateID) + "&GMassUniqueID=" + encodeURIComponent(CookieResult.GMassUniqueID);
                                if (CookieResult.ps_xid && typeof CookieResult.ps_xid === 'string') {
                                    CookieStringForURL += "&ps_xid=" + encodeURIComponent(CookieResult.ps_xid);
                                }

                                if (CookieResult.ps_partner_key && typeof CookieResult.ps_partner_key === 'string') {
                                    CookieStringForURL += "&ps_partner_key=" + encodeURIComponent(CookieResult.ps_partner_key);
                                }
                            }
                            catch (err) {
                                CookieStringForURL = "";
                            }
                        }
                        else {
                            CookieStringForURL = "";
                        }

                        CookieStringForURL += "&version=" + JSVersion
                        var windowUrl;
                        if (triggeredbysheets) {
                            windowUrl = '/oauth/login?authlink=launchauthsheets';
                        }
                        else if (messagetouser == 2) {
                            windowUrl = '/oauth/login?authlink=launchauthbrowserconn';
                        }
                        else if (messagetouser == 5) {
                            windowUrl = '/oauth/login?authlink=launchauthspreadwrite&scopes=spreadwrite';
                        }
                        else if (messagetouser == 6) {
                            windowUrl = '/oauth/login?authlink=none&scopes=drive';
                        }
                        else {
                            windowUrl = '/oauth/login?authlink=launchauthbasic&scopes=min';
                        }

                        windowUrl = BaseURL + windowUrl + '&emailaddress=' + emailAddress + CookieStringForURL;
                        window.open(windowUrl, 'AuthWindow', 'width=600, height=800, top=' + top + ', left=' + left);
                        if (triggeredbysheets) {
                            var checkCount = 0;
                            function checkSheetsGranted() {
                                $.getJSON(BaseURL + "data/userhassheetspermission?emailaddress=" + sdk.User.getEmailAddress(), function (ret) {
                                    if (ret.hasSheetsPermission) {
                                        document.dispatchEvent(new CustomEvent("gmass-sheets-granted"));
                                    } else {
                                        if (checkCount++ < 100)
                                            setTimeout(checkSheetsGranted, 500);
                                    }

                                });
                            }
                            checkSheetsGranted();
                        }
                    }
                }

                AuthCounter = 0;
                if (messagetouser == 1 || messagetouser == 2) {
                    setTimeout(CheckAuthRepeat, 3000);
                }
            }
            window.LaunchGMassSignupWithGoogle = SignupWithGoogle;
            window.LaunchGMassAuth = LaunchAuth;
            function CheckAuthRepeat() {

                AuthCounter = AuthCounter + 1;
                var xmlhttpUser = new XMLHttpRequest();
                xmlhttpUser.open("GET", BaseURL + "gmass/getuserstatus?emailaddress=" + sdk.User.getEmailAddress());
                xmlhttpUser.send();
                xmlhttpUser.onreadystatechange = function () {
                    if (xmlhttpUser.readyState == 4) {
                        UserResult = JSON.parse(xmlhttpUser.responseText);

                        if ((UserResult.hasToken && UserResult.isAuthorized && UserResult.ExtensionKey != "n") || (AuthCounter >= 60)) {
                            if (UserResult.hasToken && UserResult.isAuthorized && UserResult.ExtensionKey != "n") {

                                localStorage.setItem("GMassKey-" + sdk.User.getEmailAddress(), UserResult.ExtensionKey);
                                if (LogIntervals) { sdk.log("Gmass-Connected!"); }
                                document.dispatchEvent(new CustomEvent("gmass-connected"));
                            }
                            else {

                                sdk.ButterBar.showMessage({ text: "You waited too long to login to your Google account. Please try again by clicking any main GMass button." });
                            }


                        }
                        else {
                            setTimeout(CheckAuthRepeat, 3000);
                        }

                    }
                }

            }

            function LaunchGMassSample(reason) {
                var testemaildiv = document.createElement("div");
                testemaildiv.style.color = "black";
                testemaildiv.style.width = "300px";
                testemaildiv.style.height = "300px";
                testemaildiv.style.borderColor = "black";
                testemaildiv.style.borderStyle = "solid";
                testemaildiv.style.backgroundColor = "white";
                testemaildiv.style.display = "none";
                testemaildiv.setAttribute("id", "TestEmailDiv");
                var HTMLString = "<p style=\"color: green; text-align: center\"><img src=\"" + BaseURLCDN + "Extension2019Images/google_sheet_3.png\">";


                HTMLString = HTMLString + "<span>Nice work. You're all set!<span>Click button below to create a sample message. Then click the GMass button to send my staff a mass, personalized email.</span></span>";

                HTMLString = HTMLString + "<div id=TestEmailButton>Show me some magic!</div></p>";
                testemaildiv.innerHTML = HTMLString;
                document.body.appendChild(testemaildiv);

                var MagicButton = document.getElementById("TestEmailButton");
                MagicButton.addEventListener("click", function () {
                    TestBPopup.close();


                    var TestMsgHTTP = new XMLHttpRequest();
                    TestMsgHTTP.open("GET", BaseURL + "gmass/gettestmessageinfo?emailAddress=" + sdk.User.getEmailAddress() + "&reason=" + reason, true);
                    TestMsgHTTP.send();
                    TestMsgHTTP.onreadystatechange = function () {
                        if (TestMsgHTTP.readyState == 4) {
                            var TestMessage = JSON.parse(TestMsgHTTP.responseText);
                            LaunchCompose2(TestMessage.To, TestMessage.Subject, TestMessage.Body);
                        }

                    }



                });

                MagicButton.style.width = "200px";
                MagicButton.style.textAlign = "center";
                MagicButton.style.color = "white";
                MagicButton.style.padding = "9px 5px 9px 12px";
                MagicButton.style.fontWeight = "bold";
                MagicButton.style.fontSize = "14px";
                MagicButton.style.borderRadius = "8px";
                MagicButton.style.margin = "auto";
                MagicButton.style.backgroundColor = "#c42329";
                MagicButton.style.cursor = "pointer";

                var TestBPopup = $('#TestEmailDiv').bPopup({ opacity: 0.6, });
            }
            function GenerateDraft() {

                if ((App == "Inbox" && ((document.location.href.search("search") >= 0) || (document.location.href.search("cluster") >= 0))) ||
                    ((App.includes("Gmail")) && ((document.location.href.search("#search") >= 0) ||
                        (document.location.href.search("#advanced-search") >= 0) || (document.location.href.search("#label") >= 0)))) {

                    if (SearchInput == null) {
                        NotifyMissingElement(App + " search BOX could not find QuerySelector ");
                    }

                    if (SearchInput != null) {

                        var SearchBB = sdk.ButterBar.showMessage({ text: "GMass is searching through your messages to build an email list. Please wait, this may take a minute...", time: 60000 });
                        var SearchID = Math.floor((Math.random() * 10000) + 1);
                        var BuildListIntervalCounter = 0
                        var BuildListStatusInterval = setInterval(function () {

                            var BuildListStatusXML = new XMLHttpRequest();

                            BuildListStatusXML.open("GET", BaseURL + "gmass/generaterecipientlist2status?" + "emailaddress=" + sdk.User.getEmailAddress() + "&SearchID=" + SearchID, true);
                            BuildListStatusXML.send();
                            BuildListStatusXML.onreadystatechange = function () {
                                if (BuildListStatusXML.readyState == 4) {
                                    var SearchStatusBB = sdk.ButterBar.showMessage({ text: JSON.parse(BuildListStatusXML.responseText).StatusMessage + "...", time: 5000 });
                                }

                            }
                            BuildListIntervalCounter++;
                            if (BuildListIntervalCounter == 120) {
                                clearInterval(BuildListStatusInterval);
                            }

                            if (LogIntervals) { sdk.log("build list interval RAN"); }
                        }, 5000);

                        var SearchHTTP = new XMLHttpRequest();
                        SearchHTTP.open("GET", BaseURLGenerate + "gmass/generaterecipientlist2?" + ((1 == 1) ? "CreateDraft=false&" : "") + "emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + "&searchCriteria=" + encodeURIComponent(SearchInput.value) + " -in:drafts" + "&SearchID=" + SearchID, true);
                        SearchHTTP.send();
                        SearchHTTP.onreadystatechange = function () {
                            if (SearchHTTP.readyState == 4) {
                                clearInterval(BuildListStatusInterval);

                                if (JSON.parse(SearchHTTP.responseText).success) {

                                    LaunchCompose(JSON.parse(SearchHTTP.responseText).ToAddress);

                                }
                                else {

                                    if (JSON.parse(SearchHTTP.responseText).reason == "BadKey") {
                                        sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                        LaunchAuth(sdk.User.getEmailAddress(), 2);
                                    }
                                    else if (JSON.parse(SearchHTTP.responseText).reason == "Token not found") {
                                        sdk.ButterBar.showMessage({ text: "You haven't created a GMass account for " + sdk.User.getEmailAddress() + "yet.", time: 60000 });
                                        LaunchAuth(sdk.User.getEmailAddress(), 2);
                                    }
                                    else {
                                        sdk.ButterBar.showMessage({ text: "There was an error, likely caused by too many email addresses being found. Please narrow your search criteria.", className: "redbb" });
                                    }

                                }
                            }
                        }

                    }
                    else {
                        sdk.ButterBar.showMessage({ html: "GMass: Sorry, GMass couldn't determine your search query. This usually happens when Gmail changes its underlying code and breaks parts of GMass. We usually fix this type of issue within hours, and actually, we <em>may</em> have ALREADY fixed it. Please reload Gmail now using Chrome's RELOAD button, and see if the issue persists. If it does, contact us at <a style='color: #99FFFF' target='_support' href='https://www.gmass.co/g/support'>gmass.co/g/support</a>.", time: 10000 });
                    }
                }
                else {
                    sdk.ButterBar.showMessage({ html: "GMass: This button builds an email list from your conversations after you've searched for something. Go ahead, search for something now and then try again!", time: 10000 });
                }
            }

            function BBFunc() {

                if (GMassSearch != null) {
                    if (((App == "Inbox") && ((document.location.href.search("cluster") >= 0) || (document.location.href.search("search") >= 0))) ||
                        ((App.includes("Gmail")) && (((document.location.href.search("#search") >= 0) || (document.location.href.search("#advanced-search") >= 0) ||
                            (document.location.href.search("#label") >= 0))))) {

                        GMassSearch.style.display = "block";
                        GMassSearch.style.backgroundColor = "#c42329";
                        GMassSearch.style.backgroundImage = "url('" + BaseURLCDN + "images/MagnifyingGlassRedFlipped-small.png')";

                    }
                    else {

                        GMassSearch.style.display = "none";
                        GMassSearch.style.backgroundColor = "gray";
                        GMassSearch.style.backgroundImage = "url('" + BaseURLCDN + "images/MagnifyingGlassGrayFlipped-small.png')";

                    }
                }

                if (LogIntervals) { sdk.log("search box interval run"); }
            }


            function removeOptions(selectbox) {
                var i;
                for (i = selectbox.options.length - 1; i >= 0; i--) {
                    selectbox.remove(i);
                }
            }

            function ShowListSelector() {

                var modalDiv = $('<div><div>')
                    .css('min-width', '600px');

                modalDiv.append(`                        
                            <div style="text-align: center">
                                <img width="200px" class="google-sheets-image" src="${BaseURLCDN}Extension2019Images/from_list2.png">
                            </div>
                            <div style="margin-bottom: 20px;font-size:24px; margin:30px; text-align: center">Specify a list below</div>
                            <select></select>
                            `);

                var dd = modalDiv.find('select');

                function templateResult(obj) {
                    if (obj.disabled || obj.id == '')
                        return obj.text;
                    var list = obj.data;
                    var name;
                    var extraInfo;


                    if (list.spreadSheetName) {
                        extraInfo = list.spreadSheetName;
                        if (list.workSheetName) {
                            extraInfo += ' / ' + list.workSheetName;
                        }
                    }
                    else {
                        extraInfo = '';
                    }

                    name = list.aliasAddress;


                    return $(`
                                <div style="height: 50px; display: flex; align-items: center; justify-content: space-between">
                                    <div style="margin-left: 4px; font-size: 12pt;">${name}</div>
                                    <div style="font-size: 8pt; padding: 3px; border-radius: 5px; background: #D1C5F7; color: #333">${extraInfo}</div>
                                </div>
                        `);
                }

                dd.select2({
                    placeholder: "Type a list name",
                    width: '100%',
                    theme: 'gmass select2-container--default',
                    templateResult: templateResult,
                    templateSelection: templateResult,
                    ajax: {
                        url: BaseURL + "api/lists?emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())),
                        cache: true,
                        delay: 100,
                        processResults: function (data, params) {
                            params.page = params.page || 0;

                            var ret = {
                                results: [],
                                pagination: {
                                    more: data.offset + data.count < data.total
                                }
                            };

                            data.lists.forEach(l => {
                                ret.results.push({
                                    id: l.aliasAddress,
                                    text: l.aliasAddress + ' / ' + l.workSheetName + ' / ' + l.spreadSheetName + ' / ' + l.addressCount,
                                    data: l
                                });
                            });


                            return ret;
                        },
                    },
                });

                var modal = sdk.Widgets.showModalView({
                    el: modalDiv[0],
                    title: '',
                    buttons: [
                        {
                            text: 'Okay',
                            type: 'PRIMARY_ACTION',
                            onClick: function () {

                                if (importComposeView != null) {
                                    setImportToAddress([dd.val()]);
                                }
                                else {
                                    LaunchCompose([dd.val()]);
                                }
                                modal.close();
                            }
                        },
                        {
                            text: 'Cancel',
                            type: 'SECONDARY',
                            onClick: function () {
                                modal.close();
                            }
                        }
                    ]
                });
            }

            function LaunchImport(AdminBlock) {

                var bbSheets = sdk.ButterBar.showMessage({ text: "Please wait for your Google Sheets to load.", time: 60000 });
                var elSheets;
                var whichUI;

                var manualLabel = 'Switch to manual entry';
                var selectLabel = 'Switch to dropdown';

                var xmlhttpSheets = new XMLHttpRequest();
                xmlhttpSheets.open("GET", BaseURL + "data/getlistofspreadsheets?emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                xmlhttpSheets.send();
                xmlhttpSheets.onreadystatechange = function () {
                    if (xmlhttpSheets.readyState == 4) {

                        bbSheets.destroy();

                        var resultSheets = JSON.parse(xmlhttpSheets.responseText);
                        if ((resultSheets.success || AdminBlock) && (resultSheets.reason != "BadKey")) {
                            if (document.getElementById('mainsheetsdiv') != null) {
                                document.getElementById('mainsheetsdiv').remove();
                            }
                            var MainSheetsDiv = document.createElement("div");
                            MainSheetsDiv.style.color = "black";
                            MainSheetsDiv.style.width = "600px";
                            MainSheetsDiv.style.borderColor = "black";
                            MainSheetsDiv.style.padding = "8px";
                            MainSheetsDiv.style.borderStyle = "solid";
                            MainSheetsDiv.style.backgroundColor = "white";
                            MainSheetsDiv.style.display = "none";
                            MainSheetsDiv.style.marginTop = "20px";
                            MainSheetsDiv.style.maxHeight = 'calc(100vh - 40px)';

                            MainSheetsDiv.setAttribute("id", "mainsheetsdiv");
                            MainSheetsDiv.innerHTML = "<div><div style=\"text-align: center\"><img width=\"80px\" class=\"google-sheets-image\" src=\"" + BaseURLCDN + "Extension2019Images/google_sheet_1.png\"></div><div style=\"margin-bottom: 20px; text-align: center\">" + "Choose a Google Sheet below." + " <a target=\"_blog\" href=\"https://www.gmass.co/blog/google-sheets-mail-merge/\">Learn more.</a></div><div id='ToggleDivOuter' style='margin-bottom: 6px; float: left; font-size: 10pt'><span id='pickerhelp' style='margin-bottom: 5px; font-size: 10pt'><a target='_blog' href='https://www.gmass.co/blog/enter-your-google-sheet-id-manually/'>Why am I seeing this alternate interface?</a></span><a href='javascript:void(0)'><span id='ToggleDiv'>xxx (will be replaced)</span></a></div><div style='float: right;'><span id='pickerelement' style='font-size: 10pt; display: block; float: right;'><a href='javascript: void (0)'>Launch Spreadsheet Picker</a></span></div><form id=\"SheetsForm\"></form></div>";
                            document.body.appendChild(MainSheetsDiv);
                            var SheetsFormDiv = document.getElementById("SheetsForm");
                            if (document.getElementById('divsheets') != null) {
                                document.getElementById('divsheets').remove();
                            }
                            if (document.getElementById('divworksheets') != null) {
                                document.getElementById('divworksheets').remove();
                            }
                            var divSheets = document.createElement("div");
                            divSheets.id = "divsheets";
                            divSheets.style.padding = '3px';
                            divSheets.style.marbinBottom = "4px";
                            divSheets.innerHTML = ""


                            var WaitingStatus = document.createElement("div");
                            WaitingStatus.id = "waitingstatus";
                            WaitingStatus.style.display = "none";
                            WaitingStatus.style.color = "blue";
                            WaitingStatus.style.padding = "3px";
                            WaitingStatus.innerHTML = "Please wait...";

                            var EverythingButSheetsDD = document.createElement("div");
                            EverythingButSheetsDD.id = "everythingbutsheetsdd";
                            EverythingButSheetsDD.style.display = "none";
                            EverythingButSheetsDD.style.padding = "3px";
                            var elSheetsSelect;
                            var elSheetsInput;

                            elSheetsInput = document.createElement("input");
                            elSheetsInput.style.height = "45px";
                            elSheetsInput.placeholder = "Your-Spreadsheet-ID";

                            elSheetsSelect = document.createElement("select");

                            elSheetsSelect.id = "selectsheets";
                            elSheetsInput.id = "inputsheets"

                            elSheetsSelect.style.width = "550px";
                            elSheetsInput.style.width = "550px";
                            SheetsFormDiv.appendChild(divSheets);
                            SheetsFormDiv.appendChild(WaitingStatus);
                            SheetsFormDiv.appendChild(EverythingButSheetsDD);
                            var divSelectParent = document.createElement("div");
                            divSelectParent.id = "sheetsselectparent";
                            divSelectParent.appendChild(elSheetsSelect);
                            divSheets.appendChild(divSelectParent);
                            divSheets.appendChild(elSheetsInput);

                            var myoption;
                            if (!AdminBlock) {
                                myoption = document.createElement("option");
                                myoption.text = "";
                                myoption.value = "";

                                elSheetsSelect.add(myoption);

                                var arraySheetsLength = resultSheets.spreadsheets.length;

                                for (i = 0; i < (resultSheets.spreadsheets.length); i++) {

                                    myoption = document.createElement("option");
                                    myoption.text = resultSheets.spreadsheets[i].Title;
                                    myoption.value = resultSheets.spreadsheets[i].Id;
                                    myoption.setAttribute("UpdatedTime", resultSheets.spreadsheets[i].UpdatedTime);
                                    elSheetsSelect.add(myoption);

                                }
                            }
                            var divWorksheets = document.createElement("div");
                            divWorksheets.id = "divworksheets";
                            divWorksheets.innerHTML = "Worksheets: ";
                            EverythingButSheetsDD.appendChild(divWorksheets);
                            var divDupes = document.createElement("label");
                            divDupes.id = "divdupes";
                            divDupes.className = 'g2_checkbox';
                            divDupes.innerHTML = '<span style="color: rgb(43, 44, 46);">Keep duplicate emails</span> ';
                            divDupes.style.fontSize = '10pt';
                            divDupes.style.margin = '2em 0 0 0';
                            var checkboxDupes = document.createElement("input");
                            checkboxDupes.type = "checkbox";
                            checkboxDupes.id = "formcheckbox";
                            if (localStorage.getItem("GMassKeepDuplicates") == "true") { checkboxDupes.checked = true; }
                            var divFilter = document.createElement("div");
                            divFilter.id = "divfilter";
                            divFilter.style.fontSize = '10pt';
                            var FilterTextArea = document.createElement("textarea");
                            FilterTextArea.rows = "3";
                            FilterTextArea.cols = "35";
                            FilterTextArea.style.fontFamily = "Courier";
                            FilterTextArea.style.fontSize = "8pt";
                            FilterTextArea.style.color = "gray";
                            FilterTextArea.style.maxWidth = "300px";
                            FilterTextArea.placeholder = "Column1=Value1\nColumn2=Value2";
                            FilterTextArea.id = "filtertextarea";
                            var SelectCompare = document.createElement("select");
                            SelectCompare.id = "CompareSelect";
                            SelectCompare.style.verticalAlign = "top";
                            var CompareOption = document.createElement("option");
                            CompareOption.text = "AND";
                            CompareOption.value = "And";
                            var CompareOption2 = document.createElement("option");
                            CompareOption2.text = "OR";
                            CompareOption2.value = "Or";
                            SelectCompare.add(CompareOption);
                            SelectCompare.add(CompareOption2);
                            var HelpFilter = document.createElement("SPAN");
                            HelpFilter.innerHTML = "<a style='text-decoration: none; vertical-align: top;margin-left:3px' href='https://www.gmass.co/blog/send-mail-merge-to-selected-rows-spreadsheet/' target='_blog'>?</a>";
                            var OptionsOuter = document.createElement("div");
                            OptionsOuter.id = "optionsouter";
                            OptionsOuter.style = "padding: 6px; border: 1px;border-style: solid;border-radius: 8px;border-color: #80808057;width:  450px;";
                            var OptionalDiv = document.createElement("div");
                            OptionalDiv.id = "optionaldiv";
                            OptionalDiv.style.marbinBottom = "4px";
                            OptionalDiv.style.cursor = "pointer";
                            OptionalDiv.innerHTML = '<span style="color: blue;" id="OptionalSettingsExpander">+</span> <span>Optional Settings:</span>';
                            OptionalDiv.style.fontWeight = 'normal';
                            OptionalDiv.style.marginTop = "20px";

                            EverythingButSheetsDD.appendChild(OptionalDiv);

                            var filterLabel = document.createElement('div');
                            filterLabel.innerHTML = "Filter Rows:";

                            OptionsOuter.appendChild(filterLabel);
                            OptionsOuter.appendChild(divFilter);

                            divFilter.appendChild(FilterTextArea);
                            divFilter.appendChild(SelectCompare);
                            divFilter.appendChild(HelpFilter);

                            OptionsOuter.appendChild(divDupes);

                            var divUpdate = document.createElement("label");
                            divUpdate.id = "divUpdate";
                            divUpdate.style.fontSize = "10pt";
                            divUpdate.className = 'g_checkbox';
                            divUpdate.innerHTML = "<span>Update Sheet with reporting data</span> ";
                            var checkboxUpdate = document.createElement("input");
                            checkboxUpdate.type = "checkbox";
                            checkboxUpdate.id = "updatesheetbox";
                            divUpdate.prepend(checkboxUpdate);
                            if (localStorage.getItem("GMassUpdateReportingData") == "true") { checkboxUpdate.checked = true; }

                            OptionsOuter.appendChild(divUpdate);

                            EverythingButSheetsDD.appendChild(OptionsOuter);

                            var picker123 = document.getElementById("pickerelement");
                            picker123.addEventListener("click", function () {
                                var pickerwin = window.open(BaseURL + "picker.html" + "?emailAddress=" + encodeURIComponent(sdk.User.getEmailAddress()) + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), "picker", "width=1300, height=900, left=100, top=100, resizable=yes, scrollbars=yes");
                                SpreadsheetId = "";
                                var SpreadsheetFinder = setInterval(function () {
                                    if (pickerwin.closed) {
                                        clearInterval(SpreadsheetFinder);
                                    }
                                    if (SpreadsheetId != "") {
                                        clearInterval(SpreadsheetFinder);

                                        if (whichUI == 'select') {
                                            $('#selectsheets').val(SpreadsheetId.replace('spreadsheetid---', ''));
                                            $('#selectsheets').trigger('change');
                                        }
                                        else {
                                            $('#inputsheets').val(SpreadsheetId.replace('spreadsheetid---', ''));
                                            $('#inputsheets').trigger('change');
                                        }

                                    }

                                    if (LogIntervals) { sdk.log("SpreadsheetFinder interval run"); }

                                }, 500);

                            });

                            divDupes.prepend(checkboxDupes);

                            var OptionalSettingsExpanderSpan = document.getElementById("OptionalSettingsExpander");
                            if (localStorage.getItem("GMassKeepDuplicates") == "true" || localStorage.getItem("GMassUpdateReportingData") == "true") {
                                OptionsOuter.style.display = "block";
                                OptionalSettingsExpanderSpan.innerHTML = "-";
                            }
                            else {
                                OptionsOuter.style.display = "none";
                                OptionalSettingsExpanderSpan.innerHTML = "+";
                            }
                            var SheetsConnectButton = document.createElement("div");
                            SheetsConnectButton.style.width = "300px";
                            SheetsConnectButton.style.textAlign = "center";
                            SheetsConnectButton.style.color = "white";
                            SheetsConnectButton.style.padding = "9px 5px 9px 12px";
                            SheetsConnectButton.style.fontWeight = "bold";
                            SheetsConnectButton.style.fontSize = "11px";
                            SheetsConnectButton.style.borderRadius = "8px";
                            SheetsConnectButton.style.margin = "auto";
                            SheetsConnectButton.style.backgroundColor = "gray";
                            SheetsConnectButton.style.marginTop = "20px";
                            SheetsConnectButton.style.cursor = "pointer";
                            SheetsConnectButton.innerHTML = "CONNECT TO SPREADSHEET";
                            SheetsConnectButton.id = "ConnectButton";
                            SheetsConnectButton.addEventListener("click", function () {

                                if (elSheets.value != "default" && elSheets.value != "") {

                                    SheetsConnectButton.innerHTML = "PLEASE WAIT...";

                                    var EnsureWorksheetID = setInterval(function () {



                                        if (document.getElementById('WorksheetsSelect').value != "") {

                                            clearInterval(EnsureWorksheetID);
                                            var xmlSubmitWorksheet = new XMLHttpRequest();

                                            var KeepDupes = "false";
                                            if (checkboxDupes.checked) {
                                                KeepDupes = "true";
                                            }
                                            localStorage.setItem("GMassKeepDuplicates", KeepDupes);

                                            var UpdateReportingData = "false";
                                            if (checkboxUpdate.checked) {
                                                UpdateReportingData = "true";
                                            }

                                            localStorage.setItem("GMassUpdateReportingData", UpdateReportingData);


                                            var ActualFC;
                                            ActualFC = encodeURI(FilterTextArea.value);
                                            xmlSubmitWorksheet.open("GET", BaseURLGenerate + "gmass/generaterecipientlistfromgooglesheets2?" + ((1 == 1) ? "CreateDraft=false&" : "") + "emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + "&FilterCriteria=" + ActualFC + "&AndOr=" + SelectCompare.value + "&spreadsheetId=" + elSheets.value + "&worksheetId=" + document.getElementById('WorksheetsSelect').value + "&KeepDuplicates=" + KeepDupes + "&UpdateSheet=" + UpdateReportingData, true);
                                            xmlSubmitWorksheet.send();
                                            xmlSubmitWorksheet.onreadystatechange = function () {

                                                if (xmlSubmitWorksheet.readyState == 4) {

                                                    if (JSON.parse(xmlSubmitWorksheet.responseText).success) {
                                                        myBPopup.close();

                                                        if (JSON.parse(xmlSubmitWorksheet.responseText).NeedUpdatePermission) {
                                                            LaunchAuth(sdk.User.getEmailAddress(), 5, false)
                                                        }

                                                        document.dispatchEvent(new CustomEvent("gmass-sheet-selected"));
                                                        if (1 == 1) {
                                                            if (importComposeView != null) {
                                                                setImportToAddress(JSON.parse(xmlSubmitWorksheet.responseText).ToAddress);
                                                            } else {
                                                                LaunchCompose(JSON.parse(xmlSubmitWorksheet.responseText).ToAddress);
                                                            }
                                                        }
                                                        else if (App == "oldGmail") {
                                                            if (document.location.href.search("compose=") >= 0) {
                                                                document.location.href = document.location.href + "," + JSON.parse(xmlSubmitWorksheet.responseText).messageId;
                                                            }
                                                            else {

                                                                var messageId = JSON.parse(xmlSubmitWorksheet.responseText).messageId;
                                                                document.location.href = document.location.href + "?compose=" + messageId;

                                                            }

                                                        }

                                                    }
                                                    else {
                                                        var SheetsError = JSON.parse(xmlSubmitWorksheet.responseText).error;
                                                        var pos = SheetsError.indexOf(" at ");
                                                        SheetsError = SheetsError.substring(0, pos).replace("System.Exception: ", "");
                                                        sdk.ButterBar.showMessage({ html: "GMass: " + SheetsError, time: 10000, className: "redbb" });
                                                        SheetsConnectButton.innerHTML = "CONNECT TO SPREADSHEET";
                                                    }
                                                }

                                            }
                                        }
                                        if (LogIntervals) { sdk.log("found worksheet id interval RAN"); }
                                    }, 500);
                                }
                                else {
                                    sdk.ButterBar.showMessage({ html: "GMass: You didn't choose a spreadsheet.", time: 10000, className: "redbb" });
                                }

                            });

                            SheetsConnectButton.addEventListener("mouseover", function () {
                                if (SheetsConnectButton.style.backgroundColor != "gray") {
                                    SheetsConnectButton.style.backgroundColor = "blue";
                                }
                            });
                            SheetsConnectButton.addEventListener("mouseout", function () {
                                if (SheetsConnectButton.style.backgroundColor != "gray") {
                                    SheetsConnectButton.style.backgroundColor = "#c42329";
                                }
                            });

                            document.getElementById('mainsheetsdiv').appendChild(SheetsConnectButton);



                            myBPopup = $('#mainsheetsdiv').bPopup({
                                opacity: 0.6,
                            });
                            document.dispatchEvent(new CustomEvent("gmass-sheets-modal-shown"));


                            if (!AdminBlock) {
                                $('#selectsheets').select2({
                                    placeholder: "Select spreadsheet",
                                    dropdownParent: $('#' + 'mainsheetsdiv'),
                                    templateResult: formatSpreadsheets,
                                    templateSelection: formatSpreadsheetsResult,
                                    selectOnClose: true

                                });

                                if (document.getElementById("select2-selectsheets-container")) {
                                    document.getElementById("select2-selectsheets-container").style.fontSize = "12pt";
                                    document.getElementById("select2-selectsheets-container").style.paddingLeft = "8px";
                                }
                                if (document.querySelector('[aria-labelledby="select2-selectsheets-container"]')) {
                                    document.querySelector('[aria-labelledby="select2-selectsheets-container"]').style.height = "50px";
                                    document.querySelector('[aria-labelledby="select2-selectsheets-container"]').style.paddingTop = "15px";
                                }
                                if (document.querySelector('span[aria-labelledby="select2-selectsheets-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                    document.querySelector('span[aria-labelledby="select2-selectsheets-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                                }
                            }


                            $('#selectsheets').on('change', function (e) {

                                UpdateWorkSheets();
                            });

                            $('#inputsheets').on('change', function (e) {

                                UpdateWorkSheets();
                            });

                            function UpdateWorkSheets() {

                                if (elSheets.value != "default" && elSheets.value != '') {

                                    WaitingStatus.style.display = "block";
                                    EverythingButSheetsDD.style.display = "none";
                                    var SelectWorksheets = document.createElement("select");
                                    SelectWorksheets.id = "WorksheetsSelect";
                                    SelectWorksheets.style.width = "450px"
                                    if (divWorksheets != null) {
                                        removeOptions(SelectWorksheets);

                                        while (divWorksheets.hasChildNodes()) {
                                            divWorksheets.removeChild(divWorksheets.firstChild);
                                        }

                                    }

                                    SheetsConnectButton.style.backgroundColor = "#c42329";

                                    var xmlhttpWorksheets = new XMLHttpRequest();
                                    xmlhttpWorksheets.open("GET", BaseURL + "data/getworksheetsinspreadsheet?emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + "&spreadsheetId=" + elSheets.value, true);
                                    xmlhttpWorksheets.send();
                                    xmlhttpWorksheets.onreadystatechange = function () {
                                        if (xmlhttpWorksheets.readyState == 4) {

                                            WaitingStatus.style.display = "none";
                                            EverythingButSheetsDD.style.display = "block";

                                            var resultWorkSheets = JSON.parse(xmlhttpWorksheets.responseText);

                                            for (i = 0; i < (resultWorkSheets.worksheets.length); i++) {

                                                var WSOption = document.createElement("option");
                                                WSOption.text = resultWorkSheets.worksheets[i].Title;
                                                WSOption.value = resultWorkSheets.worksheets[i].Id;
                                                WSOption.setAttribute("Rows", resultWorkSheets.worksheets[i].Rows);
                                                WSOption.setAttribute("Columns", resultWorkSheets.worksheets[i].Columns);
                                                SelectWorksheets.add(WSOption);

                                            }

                                            divWorksheets.appendChild(SelectWorksheets);

                                            $('#WorksheetsSelect').select2({
                                                dropdownParent: $('#' + 'mainsheetsdiv'),
                                                templateResult: formatWorksheets,
                                                templateSelection: formatWorksheetsResult,
                                                disabled: (resultWorkSheets.worksheets.length == 1 ? true : false)
                                            });

                                            if (document.getElementById("select2-WorksheetsSelect-container")) {
                                                document.getElementById("select2-WorksheetsSelect-container").style.fontSize = "12pt";
                                                document.getElementById("select2-WorksheetsSelect-container").style.paddingLeft = "8px";
                                            }
                                            if (document.querySelector('[aria-labelledby="select2-WorksheetsSelect-container"]')) {
                                                document.querySelector('[aria-labelledby="select2-WorksheetsSelect-container"]').style.height = "50px";
                                                document.querySelector('[aria-labelledby="select2-WorksheetsSelect-container"]').style.paddingTop = "15px";
                                            }
                                            if (document.querySelector('span[aria-labelledby="select2-WorksheetsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                                document.querySelector('span[aria-labelledby="select2-WorksheetsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                                            }


                                        }


                                    }
                                }
                                else {
                                    WaitingStatus.style.display = "none";
                                    EverythingButSheetsDD.style.display = "none";
                                    document.getElementById('ConnectButton').style.backgroundColor = "gray";
                                }
                            }

                            $('#optionaldiv').on('click', function (e) {
                                if (OptionalSettingsExpanderSpan.innerHTML == "+") {
                                    OptionsOuter.style.display = "block";
                                    OptionalSettingsExpanderSpan.innerHTML = "-";
                                }
                                else if (OptionalSettingsExpanderSpan.innerHTML == "-") {

                                    OptionsOuter.style.display = "none";
                                    OptionalSettingsExpanderSpan.innerHTML = "+";
                                }
                            });

                            $('#ToggleDiv').on('click', function (e) {

                                if ($('#ToggleDiv').text() == manualLabel) {
                                    UserChoseManual();
                                }
                                else {
                                    UserChoseDropDown();
                                }
                            });

                            function UserChoseDropDown() {
                                $('#ToggleDiv').html(manualLabel);
                                $('#inputsheets').hide();
                                $('#sheetsselectparent').show();

                                elSheets = document.getElementById('selectsheets');
                                $('#selectsheets').trigger('change');

                                document.getElementById("pickerelement").style.display = "block";
                                document.getElementById("pickerhelp").style.display = "none";

                                whichUI = "select";

                            }

                            function UserChoseManual() {
                                $('#ToggleDiv').html(selectLabel);
                                $('#inputsheets').show();
                                $('#sheetsselectparent').hide();

                                elSheets = document.getElementById('inputsheets');
                                $('#inputsheets').trigger('change');

                                document.getElementById("pickerelement").style.display = "block";

                                if (AdminBlock) {
                                    document.getElementById("pickerhelp").style.display = "block";
                                    document.getElementById("ToggleDiv").style.display = "none";
                                    document.getElementById("pickerelement").style.display = "none";
                                }

                                whichUI = "input";
                            }
                            if (!AdminBlock) {
                                UserChoseDropDown();
                            }
                            else {
                                UserChoseManual();
                            }

                        }
                        else {

                            if (resultSheets.success == false && resultSheets.reason == "BadKey") {
                                sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                LaunchAuth(sdk.User.getEmailAddress(), 2);
                            }

                        }


                    }//readystate=4 on getting sheets list

                }//event handler close for xmlhttp getting sheets list

            }

            function LaunchDashboard() {

                var left = (screen.width);
                var top = (screen.height);

                var DashURL = '';
                if (localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()) != null) {
                    DashURL = BaseURL + 'dashboard' + '/auth?GMassKey=' + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress()));
                    popupCenter({ url: DashURL, title: 'GMassDashbaord', w: left - 100, h: top - 150 });
                }
                else {
                    LaunchAuth(sdk.User.getEmailAddress(), 1);
                }

            }

            const popupCenter = ({ url, title, w, h }) => {
                const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
                const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

                const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

                const systemZoom = width / window.screen.availWidth;
                const left = (width - w) / 2 / systemZoom + dualScreenLeft
                const top = (height - h) / 2 / systemZoom + dualScreenTop
                const newWindow = window.open(url, title,
                    `
                  scrollbars=yes,
                  width=${w / systemZoom},
                  height=${h / systemZoom},
                  top=${top},
                  left=${left}
                  `
                )

                if (window.focus) newWindow.focus();
            }

            function LaunchFollowup() {

                var NoCampaignsYet = false;
                var bbFollowup = sdk.ButterBar.showMessage({ text: "Please wait for your campaigns to load.", time: 60000 });

                var xmlhttpCampaigns = new XMLHttpRequest();
                xmlhttpCampaigns.open("GET", BaseURL + "gmass/getcampaigns?emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                xmlhttpCampaigns.send();
                xmlhttpCampaigns.onreadystatechange = function () {
                    if (xmlhttpCampaigns.readyState == 4) {

                        var resultCampaigns = JSON.parse(xmlhttpCampaigns.responseText);
                        bbFollowup.destroy();

                        if (resultCampaigns.success) {
                            if (document.getElementById('maincampaignsdiv') != null) {
                                document.getElementById('maincampaignsdiv').remove();
                            }

                            var MainCampaignsDiv = document.createElement("div");
                            MainCampaignsDiv.style.color = "black";
                            MainCampaignsDiv.style.width = "700px";
                            MainCampaignsDiv.style.borderColor = "black";
                            MainCampaignsDiv.style.padding = "8px";
                            MainCampaignsDiv.style.width = "850px";
                            MainCampaignsDiv.style.borderStyle = "solid";
                            MainCampaignsDiv.style.backgroundColor = "white";
                            MainCampaignsDiv.style.display = "none";
                            MainCampaignsDiv.setAttribute("id", "maincampaignsdiv");

                            MainCampaignsDiv.innerHTML = "<p style=\"text-align: center\"><img width=\"305px\" src=\"" + BaseURLCDN + "Extension2019Images/campaign.png\"><span>Choose a past campaign to send a manual follow-up campaign.</span> <a target=\"_blog\" href=\"https://www.gmass.co/blog/new-feature-send-follow-up-mail-merge-campaigns-in-gmail/\">Learn more.</a><form id=\"CampaignForm\"></form>";
                            document.body.appendChild(MainCampaignsDiv);
                            if (document.getElementById('divcampaigns') != null) {
                                document.getElementById('divcampaigns').remove();
                            }
                            if (document.getElementById('divbehaviors') != null) {
                                document.getElementById('divbehaviors').remove();
                            }
                            var divCampaigns = document.createElement("div");
                            divCampaigns.id = "divcampaigns";
                            divCampaigns.style.marginBottom = "10px";
                            divCampaigns.innerHTML = "<span>Past Campaigns:</span>"
                            var elCampaigns = document.createElement("select");
                            elCampaigns.id = "selectcampaigns";
                            elCampaigns.style.width = "800px";
                            document.getElementById('CampaignForm').appendChild(divCampaigns);
                            document.getElementById('divcampaigns').appendChild(elCampaigns);

                            var myoption;





                            myoption = document.createElement("option");
                            myoption.text = "";
                            myoption.value = "";
                            elCampaigns.add(myoption);

                            var arrayCampaignsLength = resultCampaigns.campaigns.length;

                            if (resultCampaigns.campaigns.length == 0) {
                                NoCampaignsYet = true;
                                MainCampaignsDiv.innerHTML = "<p style=\"text-align: center; color: red;\"><img src=\"" + BaseURLCDN + "images/gmass_logo_auth.gif\"></br>You haven't sent any mass emails with GMass yet. Send one now, and then come back here.</br></br>  <form id=\"CampaignForm\"></form></p>";
                            }

                            for (i = 0; i < (resultCampaigns.campaigns.length); i++) {

                                myoption = document.createElement("option");

                                myoption.text = (resultCampaigns.campaigns[i].friendlyName || "") + " " + (resultCampaigns.campaigns[i].campaignName || "");
                                myoption.setAttribute("subjectName", (resultCampaigns.campaigns[i].campaignName || "NO SUBJECT AVAILABLE"));
                                myoption.setAttribute("friendlyName", (resultCampaigns.campaigns[i].friendlyName || ""));
                                myoption.setAttribute("theCount", resultCampaigns.campaigns[i].Count);
                                myoption.setAttribute("theDate", resultCampaigns.campaigns[i].TheDate);

                                if (resultCampaigns.campaigns[i].HasBumps == 1) {
                                    myoption.setAttribute("af", "true");
                                }
                                else {
                                    myoption.setAttribute("af", "false");
                                }

                                if (resultCampaigns.campaigns[i].IsShared == 'yes') {
                                    myoption.setAttribute("isshared", "true");
                                }
                                else {
                                    myoption.setAttribute("isshared", "false");
                                }

                                myoption.value = resultCampaigns.campaigns[i].campaignID;
                                elCampaigns.add(myoption);



                            }


                            var divBehaviors = document.createElement("div");
                            divBehaviors.id = "divbehaviors";



                            document.getElementById('CampaignForm').appendChild(divBehaviors);

                            var FollowupConnectButton = document.createElement("div");
                            FollowupConnectButton.style.width = "300px";
                            FollowupConnectButton.style.textAlign = "center";
                            FollowupConnectButton.style.color = "white";
                            FollowupConnectButton.style.padding = "9px 5px 9px 12px";
                            FollowupConnectButton.style.fontWeight = "bold";
                            FollowupConnectButton.style.fontSize = "11px";
                            FollowupConnectButton.style.borderRadius = "8px";
                            FollowupConnectButton.style.margin = "auto";
                            FollowupConnectButton.style.backgroundColor = "gray";
                            FollowupConnectButton.style.cursor = "pointer";
                            FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                            FollowupConnectButton.id = "FollowupConnectButton";


                            FollowupConnectButton.addEventListener("click", function () {

                                if (elCampaigns.value != "default" && elCampaigns.value != "") {

                                    FollowupConnectButton.innerHTML = "PLEASE WAIT...";

                                    var behaviorType;
                                    if (document.getElementById('BehaviorsSelect') == null) {
                                        behaviorType = "s";
                                    }
                                    else {
                                        behaviorType = document.getElementById('BehaviorsSelect').value;
                                    }

                                    var xmlSubmitBehavior = new XMLHttpRequest();
                                    xmlSubmitBehavior.open("GET", BaseURLGenerate + "gmass/generaterecipientlistbehavior2?" + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + ((1 == 1) ? "&CreateDraft=false" : "") + "&emailAddress=" + sdk.User.getEmailAddress() + "&campaignId=" + elCampaigns.value + "&behaviorType=" + behaviorType, true);
                                    xmlSubmitBehavior.send();
                                    xmlSubmitBehavior.onreadystatechange = function () {

                                        if (xmlSubmitBehavior.readyState == 4) {

                                            if (JSON.parse(xmlSubmitBehavior.responseText).success) {
                                                myBPopup.close();

                                                if (1 == 1) {
                                                    if (importComposeView != null) {
                                                        setImportToAddress(JSON.parse(xmlSubmitBehavior.responseText).ToAddress);
                                                    }
                                                    else {
                                                        LaunchCompose(JSON.parse(xmlSubmitBehavior.responseText).ToAddress);
                                                    }
                                                }
                                                else if (App == "oldGmail") {
                                                    if (document.location.href.search("compose=") >= 0) {
                                                        document.location.href = document.location.href + "," + JSON.parse(xmlSubmitBehavior.responseText).messageId;
                                                    }
                                                    else {

                                                        var messageId = JSON.parse(xmlSubmitBehavior.responseText).messageId;
                                                        document.location.href = document.location.href + "?compose=" + messageId;

                                                    }
                                                }

                                            }
                                            else {
                                                var CampaignsError = JSON.parse(xmlSubmitBehavior.responseText).error;
                                                sdk.ButterBar.showMessage({ html: "GMass: " + CampaignsError, time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }

                                    }

                                }
                                else {
                                    sdk.ButterBar.showMessage({ html: "GMass: You didn't choose a campaign.", time: 10000, className: "redbb" });
                                }

                            });

                            FollowupConnectButton.addEventListener("mouseover", function () {
                                if (FollowupConnectButton.style.backgroundColor != "gray") {
                                    FollowupConnectButton.style.backgroundColor = "blue";
                                }
                            });
                            FollowupConnectButton.addEventListener("mouseout", function () {
                                if (FollowupConnectButton.style.backgroundColor != "gray") {
                                    FollowupConnectButton.style.backgroundColor = "#c42329";
                                }
                            });


                            var Spacer = document.createElement("div");
                            Spacer.style.height = "25px";

                            document.getElementById('CampaignForm').appendChild(Spacer);
                            if (!NoCampaignsYet) {
                                document.getElementById('CampaignForm').appendChild(FollowupConnectButton);
                            }



                            myBPopup = $('#maincampaignsdiv').bPopup({
                                opacity: 0.6,
                            });


                            convertCampaignSelectToSelect2($(elCampaigns), "none", {
                                placeholder: "Select campaign",
                                dropdownParent: $('#divcampaigns'),
                                templateResult: formatCampaignTextPopup,
                                templateSelection: formatCampaignTextPopupResult,
                                selectOnClose: true
                            });


                            if (document.getElementById("select2-selectcampaigns-container")) {
                                document.getElementById("select2-selectcampaigns-container").style.fontSize = "12pt";
                                document.getElementById("select2-selectcampaigns-container").style.paddingLeft = "8px";
                            }
                            if (document.querySelector('[aria-labelledby="select2-selectcampaigns-container"]')) {
                                document.querySelector('[aria-labelledby="select2-selectcampaigns-container"]').style.height = "50px";
                                document.querySelector('[aria-labelledby="select2-selectcampaigns-container"]').style.paddingTop = "15px";
                            }
                            if (document.querySelector('span[aria-labelledby="select2-selectcampaigns-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                document.querySelector('span[aria-labelledby="select2-selectcampaigns-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                            }

                            $('#selectcampaigns').on('change', function (e) {



                                var theID = "BehaviorsSelect";
                                var SelectBehaviors = document.createElement("select");
                                SelectBehaviors.id = theID;
                                SelectBehaviors.style.width = "300px";

                                var DivCached = document.createElement("div");
                                DivCached.id = "divcached";
                                DivCached.innerHTML = "Stats in dropdown aren't up-to-the-minute."
                                DivCached.style.marginTop = "3px";
                                DivCached.style.color = "red";
                                DivCached.style.fontSize = "10pt";
                                if (divBehaviors != null) {

                                    while (divBehaviors.hasChildNodes()) {
                                        divBehaviors.removeChild(divBehaviors.firstChild);
                                    }

                                    divBehaviors.innerHTML = "<span style='color: blue'>Please wait...</span>";



                                }

                                if (elCampaigns.value != "default") {



                                    document.getElementById('FollowupConnectButton').style.backgroundColor = "#c42329";

                                    var xmlhttpBehaviors = new XMLHttpRequest();
                                    xmlhttpBehaviors.open("GET", BaseURL + "gmass/getcampaignbehaviors?emailAddress=" + sdk.User.getEmailAddress() + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())) + "&campaignId=" + elCampaigns.value, true);
                                    xmlhttpBehaviors.send();
                                    xmlhttpBehaviors.onreadystatechange = function () {

                                        if (xmlhttpBehaviors.readyState == 4) {

                                            var resultBehaviors = JSON.parse(xmlhttpBehaviors.responseText);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Sent";
                                            BOption.value = "s";
                                            BOption.setAttribute("theBehavior", "Sent");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalSent);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Opened";
                                            BOption.value = "o";
                                            BOption.setAttribute("theBehavior", "Opened");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalOpened);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Didn't Open";
                                            BOption.value = "p";
                                            BOption.setAttribute("theBehavior", "Didn't Open");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalSent - resultBehaviors.behaviors[0].TotalOpened);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Clicked";
                                            BOption.value = "c";
                                            BOption.setAttribute("theBehavior", "Clicked");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalClicked);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Didn't Click";
                                            BOption.value = "d";
                                            BOption.setAttribute("theBehavior", "Didn't Click");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalSent - resultBehaviors.behaviors[0].TotalClicked);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Opened but didn't click";
                                            BOption.value = "z";
                                            BOption.setAttribute("theBehavior", "Opened but didn't click");
                                            BOption.setAttribute("theCount", (resultBehaviors.behaviors[0].TotalOpenedNoClicked >= 0 ? resultBehaviors.behaviors[0].TotalOpenedNoClicked : '[Count unavailable]'));
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Replied";
                                            BOption.value = "1";
                                            BOption.setAttribute("theBehavior", "Replied");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalReplies);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Didn't Reply";
                                            BOption.value = "2";
                                            BOption.setAttribute("theBehavior", "Didn't Reply");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalNoReplies);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Opened but Didn't Reply";
                                            BOption.value = "3";
                                            BOption.setAttribute("theBehavior", "Opened but Didn't Reply");
                                            BOption.setAttribute("theCount", (resultBehaviors.behaviors[0].TotalOpenedNoReply >= 0 ? resultBehaviors.behaviors[0].TotalOpenedNoReply : '[Count unavailable]'));
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Exceeded Gmail Limit";
                                            BOption.value = "l";
                                            BOption.setAttribute("theBehavior", "Exceeded Gmail Limit");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalOverLimit);
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Gmail API Errors";
                                            BOption.value = "e";
                                            BOption.setAttribute("theBehavior", "Gmail API Errors");
                                            BOption.setAttribute("theCount", (resultBehaviors.behaviors[0].TotalErrors >= 0 ? resultBehaviors.behaviors[0].TotalErrors : '[Count unavailable]'));
                                            SelectBehaviors.add(BOption);

                                            var BOption = document.createElement("option");
                                            BOption.text = "Blocks";
                                            BOption.value = "b";
                                            BOption.setAttribute("theBehavior", "Blocks");
                                            BOption.setAttribute("theCount", resultBehaviors.behaviors[0].TotalBlocks);
                                            SelectBehaviors.add(BOption);
                                            divBehaviors.innerHTML = "";
                                            divBehaviors.appendChild(SelectBehaviors);

                                            if (resultBehaviors.cached) {
                                                divBehaviors.appendChild(DivCached);
                                            }

                                            $('#' + theID).select2({
                                                dropdownParent: $('#divcampaigns'),
                                                placeholder: "Select behavior",
                                                templateResult: formatCampaignBehaviors,
                                                templateSelection: formatCampaignBehaviorsResult,
                                                selectOnClose: true
                                            });

                                            if (document.getElementById("select2-BehaviorsSelect-container")) {
                                                document.getElementById("select2-BehaviorsSelect-container").style.fontSize = "12pt";
                                                document.getElementById("select2-BehaviorsSelect-container").style.paddingLeft = "8px";
                                            }
                                            if (document.querySelector('[aria-labelledby="select2-BehaviorsSelect-container"]')) {
                                                document.querySelector('[aria-labelledby="select2-BehaviorsSelect-container"]').style.height = "50px";
                                                document.querySelector('[aria-labelledby="select2-BehaviorsSelect-container"]').style.paddingTop = "15px";
                                            }
                                            if (document.querySelector('span[aria-labelledby="select2-BehaviorsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                                document.querySelector('span[aria-labelledby="select2-BehaviorsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                                            }


                                        }


                                    }
                                }

                                else {
                                    document.getElementById('FollowupConnectButton').style.backgroundColor = "gray";
                                }




                            });

                        }
                        else {
                            if (resultCampaigns.success == false && resultCampaigns.reason == "nouser") {
                                sdk.ButterBar.showMessage({ text: "You need to create your GMass account for " + sdk.User.getEmailAddress() + " first.", time: 60000 });
                                LaunchAuth(sdk.User.getEmailAddress(), 1);
                            } else if (resultCampaigns.success == false && resultCampaigns.reason == "BadKey") {
                                sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                LaunchAuth(sdk.User.getEmailAddress(), 2);
                            }

                        }

                    }//readystate=4 on getting sheets list

                }//event handler close for xmlhttp getting sheets list

            }



            function NotifyMissingElement(MissingInfo) {

                if (!(window.location.href.includes("view=btop")) && !(window.location.href.includes("view=pt")) && !(window.location.href.includes("view=cm")) && !(window.location.href.includes("view=lg"))) {
                    if (document.documentElement.innerHTML.length > 200000) {

                        var xmlNotify = new XMLHttpRequest();
                        xmlNotify.open("POST", BaseURL + "gmass/NotifyMissingElement?emailaddress=" + sdk.User.getEmailAddress() + "&info=" + MissingInfo + "&url=" + encodeURIComponent(window.location.href) + "&version=" + JSVersion, true);
                        xmlNotify.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xmlNotify.send("dom=" + encodeURIComponent(document.documentElement.innerHTML));

                        xmlNotify.onreadystatechange = function () {
                            if (xmlNotify.readyState == 4) {

                                if (JSON.parse(xmlNotify.responseText).success) {
                                };

                            }
                        }
                    }
                }
            }

            function DisplayCampaignSentStatus(ComposeDraftID, composeView) {
                var xmlDraftSentStatus = new XMLHttpRequest();
                xmlDraftSentStatus.open("GET", BaseURL + "gmass/getdraftsentstatus2?draftId=" + ComposeDraftID + "&emailAddress=" + sdk.User.getEmailAddress() + "&AllAliasesCommaSep=" + GetAllAliasAddressesCommaSep(composeView), true);
                xmlDraftSentStatus.send();

                sdk.ButterBar.showMessage({ text: "Retrieving the status of this email campaign...", time: 25000 });

                xmlDraftSentStatus.onreadystatechange = function () {
                    if (xmlDraftSentStatus.readyState == 4) {

                        varDraftSentState = JSON.parse(xmlDraftSentStatus.responseText);

                        if (!window.GMass.tour.active) {
                            if (ComposeFirstAddressAlias(composeView)) {

                                sdk.ButterBar.showMessage({
                                    messageKey: "aliasmessage", html: varDraftSentState.StatusMessage + "<br><br>The TO field is set to: " + composeView.getToRecipients()[0].emailAddress + " and represents your list" + (varDraftSentState.SpreadsheetName != null ? " <span style='color: #BFFFC5'>(" + varDraftSentState.SpreadsheetName + "-->" + varDraftSentState.WorksheetName + ")</span>" : "") + ", but you can also see the individual addresses if you like:", time: 10000, buttons: [{
                                        title: "Expand address", onClick: function () {
                                            ExpandToAddress(composeView);

                                        }
                                    },
                                    {
                                        title: "Download addresses", onClick: function () {
                                            DownloadToAddress(composeView);
                                        }
                                    }
                                    ]
                                });
                            }
                            else {

                                sdk.ButterBar.showMessage({ messageKey: "aliasmessage", html: varDraftSentState.StatusMessage, time: 10000 });
                            }
                        }



                    }
                }
            }

            function ExpandToAddress(composeView) {

                composeView.SkipTContactRemoved = true;
                if (AliasSize(composeView.getToRecipients()[0].emailAddress) < 2000) {
                    sdk.ButterBar.showMessage({ messageKey: "aliasmessage", text: "Expanding the email address list in the TO field...", time: 20000 });
                    var xmlhttpSearch = new XMLHttpRequest();

                    xmlhttpSearch.open("GET", BaseURL + "gmass/fetchemailaddresses?alias=" + composeView.getToRecipients()[0].emailAddress + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())), true);
                    xmlhttpSearch.send();
                    xmlhttpSearch.onreadystatechange = function () {
                        if (xmlhttpSearch.readyState == 4) {
                            var SearchResults = JSON.parse(xmlhttpSearch.responseText);
                            if (SearchResults.success) {

                                composeView.setToRecipients(SearchResults.addresses);
                                sdk.ButterBar.showMessage({ messageKey: "aliasmessage", text: "Done!", time: 20000 });

                            }
                            else {
                                if (SearchResults.reason = "BadKey") {
                                    sdk.ButterBar.showMessage({ messageKey: "aliasmessage", text: "We couldn't expand your alias address into the actual recipient addresses in the Compose box, but that's okay -- it will still work. You just can't see the actual addresses for now.", time: 25000 });
                                }
                            }
                        }
                    }
                }
                else {
                    sdk.ButterBar.showMessage({ messageKey: "aliasmessage", text: "Sorry, you can't expand this alias address into the individual addresses, because there are more than 2,000 individual addresses and that would 'freeze' the Gmail Compose window.", time: 20000 });
                }
            }

            function DownloadToAddress(composeView) {

                composeView.SkipTContactRemoved = true;
                var ToList = composeView.getToRecipients();
                var FinalList = [];
                var arrayLength = ToList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (ToList[i].emailAddress.toLowerCase() != "download@gmass.co") {
                        FinalList.push(ToList[i].emailAddress);
                    }
                }
                var objFlag = { done: false };
                composeView.setToRecipients(FinalList, objFlag);

                var downloadCheck = setInterval(function () {
                    if (objFlag.done == true) {
                        clearInterval(downloadCheck);
                        window.open(BaseURL + "gmass/downloadaddresslist?alias=" + composeView.getToRecipients()[0].emailAddress + "&GMassKey=" + encodeURIComponent(localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())));
                    }
                    if (LogIntervals) { sdk.log("downloadCheck interval run"); }
                }, 1000);

            }

            function AliasSize(aliasaddress) {
                aliasaddress = aliasaddress + "";
                return aliasaddress.substr(0, aliasaddress.indexOf("-recipients"));
            }

            function IsAddressAlias(emailAddress) {
                if (emailAddress.includes("recipients") && emailAddress.substr(emailAddress.length - 8) == "gmass.co") {
                    return true;
                }
                else {
                    return false;
                }
            }

            function IsAddressAFTemplate(emailAddress) {
                if ((emailAddress.includes("aftemplate") || emailAddress.includes("af-edit") || emailAddress.includes("triggertemplate") || emailAddress.includes("trigger-edit")) && emailAddress.substr(emailAddress.length - 8) == "gmass.co") {
                    return true;
                }
                else {
                    return false;
                }
            }

            function ReplaceFirstAddress(AddressList, NewAddress) {
                AddressList[0].emailAddress = NewAddress;
                var addresses = AddressList.map(function (address) {
                    return address['emailAddress'];
                });
                return addresses;
            }

            function ComposeFirstAddressAlias(composeView) {
                if (composeView.getToRecipients().length > 0 && IsAddressAlias(composeView.getToRecipients()[0].emailAddress)) {
                    return true;
                }
                else {
                    return false;
                }
            }

            function ComposeFirstAddressAFTemplate(composeView) {
                if (composeView.getToRecipients().length > 0 && IsAddressAFTemplate(composeView.getToRecipients()[0].emailAddress)) {
                    return true;
                }
                else {
                    return false;
                }
            }

            function ComposeFirstAddressAliasBig(composeView) {
                if (composeView.getToRecipients().length > 0 && composeView.getToRecipients()[0].emailAddress.includes("recipients") && composeView.getToRecipients()[0].emailAddress.substr(composeView.getToRecipients()[0].emailAddress.length - 8) == "gmass.co" && AliasSize(composeView.getToRecipients()[0].emailAddress) > 25) {
                    return true;
                }
                else {
                    return false;
                }
            }

            function GetAllAliasAddressesCommaSep(composeView) {

                var recip = composeView.getToRecipients();

                var csvRecip = '';

                for (var i = 0; i < recip.length; i++) {

                    if (IsAddressAlias(recip[i].emailAddress)) {
                        csvRecip += (recip[i].emailAddress + ',');
                    }
                }
                csvRecip = csvRecip.slice(0, -1);

                return csvRecip;
            }

            function setImportToAddress(ToAddress) {
                importComposeView.SkipTContactRemoved = true;
                var x = importComposeView.getToRecipients();
                var y = [];
                for (var i = 0; i < x.length; i++) { y.push(x[i].emailAddress); }
                y.push(ToAddress);
                importComposeView.setToRecipients(y);
            }

            function HideSendButton(composeView, GMassLaunchedCompose, boolForceShowSend) {
                if (((composeView.getToRecipients().length == 1 && composeView.getToRecipients()[0].emailAddress.includes("@gmass.co")) || composeView.getToRecipients().length > 20 || GMassLaunchedCompose || (composeView.getToRecipients().length > 0 && (composeView.getToRecipients()[0].emailAddress.indexOf("-big-") != -1))) && !boolForceShowSend && composeView.getToRecipients().length > 0 && composeView.getToRecipients()[composeView.getToRecipients().length - 1].emailAddress.toLowerCase() != "showsend@gmass.co") {
                    var SendButton = composeView.getSendButton();

                    if (SendButton.style.display != 'none') {

                        composeView.hideSendButton();
                        composeView.sendButtonToggle.style.display = 'flex';
                        if (composeView.getToRecipients().length == 1 && composeView.getToRecipients()[0].emailAddress.includes("@gmass.co") && (!ComposeFirstAddressAlias(composeView))) {
                            if (composeView.getToRecipients()[0].emailAddress.includes("cancel@gmass.co")) {
                                return 999;
                            }
                            else {
                                return 2;
                            }
                        }
                        else {
                            return 1;
                        }

                    }

                }
                else {
                    composeView.showSendButton();
                    composeView.sendButtonToggle.style.display = 'none';


                }

                return 0;



            }





        }

        catch (err) {

            ErrorHandler(sdk.User.getEmailAddress() + ": " + err.message);
        }

        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
        function FormatDate(date, AccountStatus) {
            var year, month, day, hours, minutes, ampm, timeZoneOffset;
            var timeZoneOffsetLocal = date.getTimezoneOffset();
            var timeZoneOffsetUserSpecified = AccountStatus.TimeZoneOffset;

            if (timeZoneOffsetUserSpecified != null) {
                timeZoneOffset = timeZoneOffsetUserSpecified;
            } else {
                timeZoneOffset = -timeZoneOffsetLocal;
            }

            var adjustedDate = new Date(date.getTime());
            year = adjustedDate.getFullYear();
            month = adjustedDate.getMonth() + 1;
            day = adjustedDate.getDate();

            hours = adjustedDate.getHours();
            minutes = adjustedDate.getMinutes();
            ampm = "am";
            if (hours >= 12) ampm = "pm";
            hours = hours % 12;
            if (hours === 0) hours = 12;
            var timeZoneOffsetSign = timeZoneOffset >= 0 ? "+" : "-";
            var absoluteOffset = Math.abs(timeZoneOffset);
            var timeZoneOffsetHours = Math.floor(absoluteOffset / 60);
            var timeZoneOffsetMins = absoluteOffset % 60;
            var pad = function (num) {
                return num < 10 ? "0" + num : num;
            };

            month = pad(month);
            day = pad(day);
            hours = pad(hours);
            minutes = pad(minutes);
            timeZoneOffsetHours = pad(timeZoneOffsetHours);
            timeZoneOffsetMins = pad(timeZoneOffsetMins);
            return (
                month +
                "/" +
                day +
                "/" +
                year +
                " " +
                hours +
                ":" +
                minutes +
                ampm +
                " " +
                timeZoneOffsetSign +
                timeZoneOffsetHours +
                ":" +
                timeZoneOffsetMins
            );
        }


        function InsertFieldUnsub(button, composeView) {

            $.getJSON(BaseURL + 'gmass/getcustomunsubscribelink',
                {
                    emailaddress: sdk.User.getEmailAddress(),
                    gmasskey: localStorage.getItem("GMassKey-" + sdk.User.getEmailAddress())
                }, function (ret) {
                    if (ret.CustomUnsubscribeLink && ret.CustomUnsubscribeLink.length) {
                        composeView.insertHTMLIntoBodyAtCursor(ret.CustomUnsubscribeLink);
                    } else {
                        composeView.insertHTMLIntoBodyAtCursor('You may <a href="https://www.gmass.co/gmass/u?u=OUTBOUND">unsubscribe</a> to stop receiving our emails.');
                    }
                });
        }

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function isEmpty(str) {
            return (!str || 0 === str.length);
        }

        function ValidateEmail(mail) {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
                return (true)
            }

            return (false)
        }

        function ValidateDomain(domain) {
            var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,})$/);
            return domain.match(re);
        }

        function formatCampaignText(campaign) {

            if (campaign.disabled) {
                return $(campaign.text);
            }
            else {
                return $((campaign.element.getAttribute("friendlyName") == "" ? "" : '<span style="font-weight: bold">[' + campaign.element.getAttribute("friendlyName") + ']</span> ') + '<span>' + campaign.element.getAttribute("subjectName") + '</span> <span style="font-size: 8pt; padding: 1px 2px 1px 2px; border-radius: 5px; background: gray; color: white; float: right;">' + numberWithCommas(campaign.element.getAttribute("theCount")) + ' emails</span>');
            }

        }

        function formatCampaignDropDownItem(campaign) {
            if (campaign.disabled) {
                return $(campaign.text);
            }

            const { element } = campaign;
            const hasAttribute = (attr) => element.hasAttribute(attr) && element.getAttribute(attr);
            const friendlyName = hasAttribute("friendlyName")
                ? `<span style="font-weight: bold">[${element.getAttribute("friendlyName")}]</span> `
                : '';
            const emailCount = hasAttribute("theCount")
                ? `<span class="select2-email-count">${numberWithCommas(element.getAttribute("theCount"))}</span>`
                : '';
            const getIcon = (condition, imageName, width, paddingRight = 0) => {
                if (!condition) return '';
                return `<img src="${BaseURLCDN}Extension2019Images/${imageName}" style="width: ${width}px;">`;
            };
            const icons = [
                { condition: element.getAttribute("HasBumps") == 1, image: 'autofollowup.svg', width: 20 },
                { condition: element.getAttribute("HasTriggers") == 1, image: 'trigger.svg', width: 22 },
                { condition: element.getAttribute("IsTest") == 1, image: 'test.svg', width: 18 },
                { condition: element.getAttribute("IsTemplate") == 1, image: 'template.svg', width: 16 },
                { condition: element.getAttribute("IsShared") === 'yes', image: 'people-group-solid.svg', width: 20 }
            ];
            const iconsHtml = icons
                .map(({ condition, image, width, paddingRight }) => getIcon(condition, image, width, paddingRight))
                .join('');


            const deleteIcon = `<svg data-campaignid="${campaign.id}"  xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" class="gmass-delete-template" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>`;
            const html = `
                <div style="display:flex; justify-content: space-between">
                    <div style="flex-grow:1">
                        ${friendlyName}
                        <span>${element.getAttribute("subjectName")}</span> 
                    </div>
                    <div style="display:flex; gap: 2px; align-items: center">
                        ${deleteIcon}
                        ${iconsHtml}
                        ${emailCount}
                    </div>
                </div>
            `.trim();

            return $(html);
        }

        function formatCampaignTextResult(campaign) {

            if (campaign.id == "") {
                return campaign.text;
            }
            else {
                var emailCount = '';
                if (campaign.element.hasAttribute("theCount")) {
                    emailCount = '<span class="select2-email-count">' + numberWithCommas(campaign.element.getAttribute("theCount")) + '</span>';

                }

                return $((!campaign.element.hasAttribute("friendlyName") || campaign.element.getAttribute("friendlyName") == "" ? "" : '<span style="font-weight: bold">[' + campaign.element.getAttribute("friendlyName") + ']</span> ') + '<span>' + campaign.element.getAttribute("subjectName") + '</span> ' + emailCount);
            }


        }

        function formatCampaignTextPopup(campaign) {

            if (campaign.disabled) {
                return $(campaign.text);
            }
            else {
                return $('<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">' + campaign.element.getAttribute("theDate") + '</span> ' + (campaign.element.getAttribute("friendlyName") == "" ? "" : '<strong>[' + campaign.element.getAttribute("friendlyName") + ']</strong> ') + '<span style="font-size: 12pt;">' + campaign.element.getAttribute("subjectName") + '</span> <span style="font-size: 8pt; padding: 1px 2px 1px 2px; border-radius: 5px; background: gray; color: white; float: right;">' + numberWithCommas(campaign.element.getAttribute("theCount")) + ' emails</span>');
            }

        }

        function formatCampaignTextPopupResult(campaign) {

            if (campaign.id == "") {
                return (campaign.text);
            }
            else {
                return $('<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">' + campaign.element.getAttribute("theDate") + '</span> ' + (campaign.element.getAttribute("friendlyName") == "" ? "" : '<span style="font-size: 12pt; font-weight: bold">[' + campaign.element.getAttribute("friendlyName") + ']</span> ') + '<span style="font-size: 12pt;">' + campaign.element.getAttribute("subjectName") + '</span> <span style="font-size: 8pt; padding: 1px 2px 1px 2px; border-radius: 5px; background: gray; color: white; float: right;">' + numberWithCommas(campaign.element.getAttribute("theCount")) + ' emails</span>');
            }

        }

        function formatSpreadsheets(campaign) {

            if (campaign.disabled) {
                return (campaign.text);
            }
            else {
                return $('<div style="height: 50px; display: flex; align-items: center">' + '<div><img height="40px" src="' + BaseURLCDN + 'img2017/google-sheets.png"></div> ' + '<div style="margin-left: 0px; font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">' + campaign.element.getAttribute("UpdatedTime") + '</div>' + '<div style="margin-left: 4px; font-size: 12pt;">' + campaign.element.text + '</div></div>');
            }

        }

        function formatSpreadsheetsResult(campaign) {

            if (campaign.id == "") {
                return (campaign.text);
            }
            else {
                return $('<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">' + campaign.element.getAttribute("UpdatedTime") + '</span> ' + '<span style="font-size: 12pt;">' + campaign.element.text + '</span>');
            }

        }

        function formatWorksheets(campaign) {

            if (campaign.disabled) {
                return (campaign.text);
            }
            else {
                return $('<span style="font-size: 12pt;">' + campaign.element.text + '</span> ' + '<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: green; color: white; float: right;">' + numberWithCommas(campaign.element.getAttribute("Rows")) + ' rows</span> ');
            }

        }

        function formatWorksheetsResult(campaign) {

            if (campaign.id == "") {
                return (campaign.text);
            }
            else {
                return $('<span style="font-size: 12pt;">' + campaign.element.text + '</span> ' + '<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: green; color: white; float: right;">' + numberWithCommas(campaign.element.getAttribute("Rows")) + ' rows</span> ');
            }

        }

        function formatCampaignBehaviors(campaign) {

            if (campaign.disabled) {
                return $(campaign.text);
            }
            else {
                return $('<span style="font-size: 12pt; font-weight: normal;">' + campaign.element.getAttribute("theBehavior") + ':</span> ' + '<span style="color: blue; float: right;">' + numberWithCommas(campaign.element.getAttribute("theCount")) + ' people</span>');
            }

        }

        function formatCampaignBehaviorsResult(campaign) {

            if (campaign.id == "") {
                return $(campaign.text);
            }
            else {
                return $('<span style="font-size: 12pt; font-weight: normal;">' + campaign.element.getAttribute("theBehavior") + ':</span> ' + '<span style="color: blue; float: right;">' + numberWithCommas(campaign.element.getAttribute("theCount")) + ' people</span>');
            }

        }



        function formatCampaignTextResultSuppress(campaign) {

            if (campaign.id == "") {
                return campaign.text;
            }
            else {


                return $('<span class="g_suppression_email_selection">' +
                    '<span class="g_suppression_email_count">'
                    + numberWithCommas(campaign.element.getAttribute("theCount"))
                    + ' emails</span> '
                    + (campaign.element.getAttribute("friendlyName") == "" ? "" : '<span style="font-weight: bold">[' + campaign.element.getAttribute("friendlyName") + ']</span> ')
                    + '<span class="g_suppression_subject">' + campaign.element.getAttribute("subjectName") + '</span>'
                    + '</span>');

            }


        }

        function numberWithCommas(x) {
            if (x == null)
                return '';

            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        function openPopupPage(htmlcontent) {
            var param = { 'html': htmlcontent };
            OpenWindowWithPost("width=1000, height=600, left=100, top=100, resizable=yes, scrollbars=yes", "NewFile", param);
        }


        function OpenWindowWithPost(windowoption, name, params) {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", "https://www.gmass.co/linkchecker/");
            form.setAttribute("target", name);
            for (var i in params) {
                if (params.hasOwnProperty(i)) {
                    var input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = i;
                    input.value = params[i];
                    form.appendChild(input);
                }
            }
            document.body.appendChild(form);
            window.open("https://www.gmass.co", name, windowoption);
            form.submit();
            document.body.removeChild(form);
        }

        function RepeatTranslateToFrequency(thevalue) {

            if (thevalue == "1") {
                return "h";
            }
            if (thevalue == "2") {
                return "d";
            }
            if (thevalue == "3") {
                return "w";
            }
            if (thevalue == "4") {
                return "m";
            }
            if (thevalue == "5") {
                return "i";
            }
            return thevalue;
        }
        function RepeatTranslateToCharacter(frequency, mode) {

            if (mode == "n") {
                return frequency;
            }
            if (mode == "a") {
                if (frequency == "h") {
                    return "1";
                }
                if (frequency == "d") {
                    return "2";
                }
                if (frequency == "w") {
                    return "3";
                }
                if (frequency == "m") {
                    return "4";
                }
                if (frequency == "i") {
                    return "5";
                }
            }
        }

        function RepeatTranslateToNewOrAll(frequency) {

            if (frequency == "h" || frequency == "d" || frequency == "w" || frequency == "m" || frequency == "i") {
                return "n";
            }
            else {
                return "a";
            }

        }

        function CopyClipboard(itemtocopy) {

            var text = itemtocopy;
            navigator.clipboard.writeText(text).then(function () {
                console.log('Async: Copying to clipboard was successful!');
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });

        }

        function StylizeGMassSearch(theDiv) {

            theDiv.style.display = 'none';
            theDiv.style.marginLeft = '2px';
            theDiv.style.backgroundColor = "gray";
            theDiv.style.color = "white";
            theDiv.style.padding = "9px 5px 0px 12px";
            theDiv.style.fontWeight = "bold";
            theDiv.style.fontSize = "11px";
            theDiv.style.backgroundPosition = "center center";
            theDiv.style.backgroundRepeat = "no-repeat";
            theDiv.style.backgroundImage = "url('" + BaseURLCDN + "images/MagnifyingGlassGrayFlipped-small.png')";
            theDiv.style.cursor = "pointer";
            theDiv.title = "Build an email list from Gmail search results.";
        }

        function StylizeGMassSheets(theDiv) {
            theDiv.style.display = 'block';
            theDiv.style.marginLeft = '2px';
            theDiv.style.color = "white";
            theDiv.style.padding = "9px 5px 0px 12px";
            theDiv.style.fontWeight = "bold";
            theDiv.style.fontSize = "11px";
            theDiv.style.backgroundPosition = "center center";
            theDiv.style.backgroundRepeat = "no-repeat";
            theDiv.style.backgroundColor = "#c42329";
            theDiv.style.backgroundImage = "url('" + BaseURLCDN + "images/GMassSheetsIcon-tiny.png')";
            theDiv.style.cursor = "pointer";
            theDiv.title = "Connect to an email list in a Google Sheet.";
        }

        function StylizeCampaignButton(theDiv) {
            theDiv.style.display = 'block';
            theDiv.style.marginLeft = '2px';
            theDiv.style.color = "white";
            theDiv.style.padding = "9px 5px 0px 12px";
            theDiv.style.fontWeight = "bold";
            theDiv.style.fontSize = "11px";
            theDiv.style.backgroundPosition = "center center";
            theDiv.style.backgroundRepeat = "no-repeat";
            theDiv.style.backgroundColor = "#c42329";
            theDiv.style.backgroundImage = "url('" + BaseURLCDN + "images/GMassFollowupIcon.png')";
            theDiv.style.cursor = "pointer";
            theDiv.title = "Send a follow-up campaign based on opens and clicks.";
        }

        function StylizeDashboardButton(theDiv) {
            theDiv.style.display = 'block';
            theDiv.style.marginLeft = '2px';
            theDiv.style.color = "white";
            theDiv.style.padding = "9px 5px 0px 12px";
            theDiv.style.fontWeight = "bold";
            theDiv.style.fontSize = "11px";
            theDiv.style.backgroundPosition = "center center";
            theDiv.style.backgroundRepeat = "no-repeat";
            theDiv.style.backgroundColor = "#c42329";
            theDiv.style.backgroundImage = "url('" + BaseURLCDN + "images/GMassFollowupIcon.png')";
            theDiv.style.cursor = "pointer";
            theDiv.title = "Launch the campaigns dashboard.";
        }

        function SetDefaultSettings() {

            if (localStorage.getItem("GMassTestSendOrDraft") === null || localStorage.getItem("GMassTestSendOrDraft") == "undefined") {
                localStorage.setItem("GMassTestSendOrDraft", "send");
            }

            if (localStorage.getItem("GMassTestSequence") === null || localStorage.getItem("GMassTestSequence") == "undefined") {
                localStorage.setItem("GMassTestSequence", "off");
            }
            if (localStorage.getItem("mySendSave") != "save" && localStorage.getItem("mySendSave") != "send") {
                localStorage.setItem("mySendSave", "send");
            }
            if (localStorage.getItem("GMassSMTP") != "on" && localStorage.getItem("GMassSMTP") != "off") {
                localStorage.setItem("GMassSMTP", "notset");
            }

            if (localStorage.getItem("GMassImages") != "d" && localStorage.getItem("GMassImages") != "e" && localStorage.getItem("GMassImages") != "r") {
                localStorage.setItem("GMassImages", "d");
            }

            if (localStorage.getItem("GMassVerify") != "false" && localStorage.getItem("GMassVerify") != "true") {
                localStorage.setItem("GMassVerify", "false");
            }

            if (
                localStorage.getItem("GMassAutoSpintax") != "false" &&
                localStorage.getItem("GMassAutoSpintax") != "true"
            ) {
                localStorage.setItem("GMassAutoSpintax", "false");
            }

            if (localStorage.getItem("GMassSkipSent") != "false" && localStorage.getItem("GMassSkipSent") != "true") {
                localStorage.setItem("GMassSkipSent", "false");
            }

            if (localStorage.getItem("GMassSuppressionAggressive") != "false" && localStorage.getItem("GMassSuppressionAggressive") != "true") {
                localStorage.setItem("GMassSuppressionAggressive", "false");
            }
            if (localStorage.getItem("ABPercentage") === null || localStorage.getItem("ABPercentage") == "undefined") {
                localStorage.setItem("ABPercentage", "20");
            }

            if (localStorage.getItem("ABTimeAfter") === null || localStorage.getItem("ABTimeAfter") == "undefined") {
                localStorage.setItem("ABTimeAfter", "4");
            }

            if (localStorage.getItem("ABDecision") === null || localStorage.getItem("ABDecision") == "undefined") {
                localStorage.setItem("ABDecision", "m");
            }

            if (localStorage.getItem("ABFactor") === null || localStorage.getItem("ABFactor") == "undefined") {
                localStorage.setItem("ABFactor", "o");
            }
            if (localStorage.getItem("myOpenTracking") != "on" && localStorage.getItem("myOpenTracking") != "off") {
                localStorage.setItem("myOpenTracking", "on");
            }
            if (localStorage.getItem("myClickTracking") != "on" && localStorage.getItem("myClickTracking") != "off") {
                localStorage.setItem("myClickTracking", "on");
            }
            if (localStorage.getItem("SkipWeekends") != "on" && localStorage.getItem("SkipWeekends") != "off") {
                localStorage.setItem("SkipWeekends", "off");
            }
            if (localStorage.getItem("SkipHolidays") != "on" && localStorage.getItem("SkipHolidays") != "off") {
                localStorage.setItem("SkipHolidays", "off");
            }
            if (localStorage.getItem("myDelay") != "on" && localStorage.getItem("myDelay") != "off") {
                localStorage.setItem("myDelay", "off");
            }
            if (localStorage.getItem("GMassPauseSeconds") === null) {
                localStorage.setItem("GMassPauseSeconds", "1");
            }
            if (localStorage.getItem("myTestAddresses") === null) {
                localStorage.setItem("myTestAddresses", sdk.User.getEmailAddress());
            }
            if (localStorage.getItem("myReplyTo") === null) {
                localStorage.setItem("myReplyTo", "");
            }
        }

        function ErrorHandler(errmessage) {

            console.error("GMass Error Message: " + errmessage);
            debugger;

            var xmlNotify = new XMLHttpRequest();
            xmlNotify.open("GET", BaseURL + "gmass/notifyextensionerror?ErrorMessage=" + encodeURIComponent(errmessage) + "&url=" + encodeURIComponent(window.location.href) + "&version=" + JSVersion, true);
            xmlNotify.send();

            xmlNotify.onreadystatechange = function () {
                if (xmlNotify.readyState == 4) {

                    if (JSON.parse(xmlNotify.responseText).success) {
                    };

                }
            }

        }


    }
    else {
        setTimeout(GMassReady, 500);
    }

    window.addEventListener('message', function (event) {
        if (event.data.toString().includes('spreadsheetid---')) {
            SpreadsheetId = event.data.toString();
        }
    });

}

