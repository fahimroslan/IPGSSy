window.addEventListener("load", myMain, !1);
var isFileLoaded = false;
var liveCountdownTimer = false;
var recordingState = "stop";
var fde_recording = true;
var fde_time_limit = 60;
var fde_video_count_limit = 50;
var fde_popup_breakups = 45;
var fde_countdown_timer = false;
var tooltipInter;
var getMessageBefore = 5;
var eventActionObjData = {};
var gmailViewsId = true;
function contentJs(recordingState = "stop") {
    Helper.log("Content Js Loaded");
    isFileLoaded = true;
    var mediaRecorderState = recordingState;
    var htmlFramsObj = {};
    var socialStreamStatus = false;
    var selectedStreamName = null;
    var tabChangesStatus = false;
    var recordingFinishAuto = false;

    var msgPopupHtml = `<div class="fl-pause">
    <img src="${chrome.extension.getURL('images/cc-clear11.png')}" class="clr" id="removePopupId">
    <div id="fde-resume-video">
        <p class="rp"><img src="${chrome.extension.getURL('images/fl-info.png')}" style="vertical-align:middle; margin:0 10px 0 0;">Recording Paused</p>
        <p class="cpb">Click the Play button<img src="${chrome.extension.getURL('images/fl-play.png')}">or click anywhere in this box to resume recording.</p>
        <p class="hint"><b>Note:</b> You can visit any page and resume recording from there.</p>
    </div>
    </div>`; //pause message popup

    var msgAutoClosePopupHtml = `<div class="fde-popup">
        <div class="fde-popup-container">
            <p>Your recording will automatically end in <span id="timerUpdate">05:00</span> minutes.
                <br>
                Upgrade now to create recordings without any limitations. </p>
            <ul class="fde-buttons">
                <li id="limitDismiss">Dismiss</li>
                <li id="limitUpgrade">Upgrade</li>
            </ul> 
        </div>
    </div>`; // message popup with timer

    //Set object for Usage Measurement
    let operating_system;
    if (navigator.appVersion.indexOf("Win") != -1) {
        operating_system = "windows";
    } else if (navigator.appVersion.indexOf("Mac") != -1) {
        operating_system = "mac";
    } else if (navigator.appVersion.indexOf("Linux") != -1){ 
        operating_system = "linux";
    } else {
        operating_system = "other";
    };
    eventActionObjData['operating_system'] = operating_system;
    eventActionObjData['app_name'] = 'chrmext';
    eventActionObjData['domain'] = window.location.origin;
    Helper.setEventActionObj(eventActionObjData);
    //End

    // Send Message to the Camera Iframe
    let sendMsgToIframe = (msg, obj = {}) => {
        let iframeHtmlElem = document.querySelector("#vidcor-ff-cam");
        if (iframeHtmlElem) {
            let msgPacket = { "msg": msg, ...obj };
            iframeHtmlElem.contentWindow.postMessage(msgPacket, "*")
        } else {
            Helper.error("Error in Sending Message to iframe", msg)
        };
    };

    // The logic to make Camera portion draggable is here
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var ffCamContainer = document.querySelector(".cc-ffcam-view-wrap");
        elmnt.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            let newBottom = ((elmnt.offsetTop - pos2) > 0) ? (elmnt.offsetTop - pos2) : 0;
            let newLeft = (elmnt.offsetLeft - pos1) ? (elmnt.offsetLeft - pos1) : 0;

            if (newBottom < 0) {
                newBottom = 0;
            }
            if (newLeft < 0) {
                newLeft = 0;
            }
            if ((newBottom + ffCamContainer.offsetHeight + 25) > window.innerHeight) {
                newBottom = window.innerHeight - (ffCamContainer.offsetHeight + 25);
            }
            if ((newLeft + ffCamContainer.offsetWidth + 25) > window.innerWidth) {
                newLeft = window.innerWidth - (ffCamContainer.offsetWidth + 25);
            };

            if ((newBottom + ffCamContainer.offsetHeight) > window.innerHeight) {
                newBottom = (ffCamContainer.offsetHeight + newBottom) - window.innerHeight;
            } else if ((newBottom + ffCamContainer.offsetHeight) < window.innerHeight) {
                newBottom = window.innerHeight - (ffCamContainer.offsetHeight + newBottom);
            } else {
                newBottom = 20;
            }

            if (elmnt) {
                elmnt.style.bottom = newBottom + "px";
                elmnt.style.left = newLeft + "px";
            }

            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let advanceOpt = status.advanceSettingStatus;
                advanceOpt['camFrameBottom'] = newBottom + "px";
                advanceOpt['camFrameLeft'] = newLeft + "px";
                Helper.setAdvanceSetting(advanceOpt); //Set data for local storge into view
            }).catch(error => {
                console.error('Cam frame move ' + error);
            });
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null
        }
    };

    function dragMenuElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown

        function dragMouseDown(e) {
            if (e.target.closest("#pen-size")) {
                return;
            }
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            let newTop = ((elmnt.offsetTop - pos2) > 0) ? (elmnt.offsetTop - pos2) : 0;
            let newLeft = (elmnt.offsetLeft - pos1) ? (elmnt.offsetLeft - pos1) : 0;

            if (newTop < 0) {
                newTop = 0;
            }
            if (newLeft < 0) {
                newLeft = 0;
            }
            if ((newTop + elmnt.offsetHeight + 25) > window.innerHeight) {
                newTop = window.innerHeight - (elmnt.offsetHeight + 25);
            }
            if ((newLeft + elmnt.offsetWidth + 25) > window.innerWidth) {
                newLeft = window.innerWidth - (elmnt.offsetWidth + 25);
            }

            if (elmnt) {
                elmnt.style.top = newTop + "px";
                elmnt.style.left = newLeft + "px";
            };

            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let advanceOpt = status.advanceSettingStatus;
                advanceOpt['menuFrameTop'] = newTop + "px";
                advanceOpt['menuFrameLeft'] = newLeft + "px";
                Helper.setAdvanceSetting(advanceOpt); //Set data for local storge into view
            }).catch(error => {
                console.error('manu frame move ' + error);
            });
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null
        }
    };

    let hideShowVideoLoder = (loaderStatus) => {
        //loader hide
        let flLoaderBg = $("#fde-video-loader");
        if (flLoaderBg) {
            if (loaderStatus) {
                flLoaderBg.animate({opacity : 1}, 0);
            } else {
                flLoaderBg.animate({opacity : 0}, 700);
            }

        }
    }

    // The HTML of camera and buttons from templates/start-recording.html is rendered here
    function appendVidcorContainer() {
        try {
            //Append new html file.
            var elem = document.createElement('div');
            elem.id = 'vidcor-container';

            if (document.querySelector('.punch-full-window-overlay')) {
                document.querySelector('.punch-full-window-overlay').appendChild(elem)
            } else {
                document.getElementsByTagName('body')[0].parentNode.appendChild(elem);
            }

            Helper.loadText("start-recording.html", (html) => {
                html = html.replace(/ROOT_PATH#/g, chrome.extension.getURL("/"));
                document.getElementById("vidcor-container").innerHTML = html;
                loadStartRecordingEventListeners();
                //grag for video frame
                let ccRecordingBlock = document.querySelector("#cc-recording-block");
                if (ccRecordingBlock) {
                    dragElement(ccRecordingBlock);
                }//end

                //drag for menu btn
                let actionMenuItems = document.querySelector("#fde-action-menu-items");
                if (actionMenuItems) {
                    dragMenuElement(actionMenuItems);
                }//end

                showActionBtn();
                Helper.sendMsgToBgScript("load_video_iframe", {}, () => { });
            });

            Helper.getAppIntegrations().then((res) => {
                addExtenBtnView(res);
            }).catch((error) => {
                console.log(error, "<======Errer");
            })

            let addExtenBtnView = (res) => {
                let appIntegrations = res.appIntegrations
                //Jira button add for
                // if (window.location.href.indexOf('.atlassian.net') > -1 && appIntegrations['jira']) {
                //     console.log("<====Jira 1");
                //     //Add new button into jira
                //     var addBtnJira = document.createElement('button');
                //     var fluvidId = document.createTextNode("Open Fluvid");
                //     addBtnJira.setAttribute("style", "cursor: pointer;width: 134px;margin-top: 10px;color: rgb(255, 255, 255) !important;background: rgb(0, 82, 204) !important;border-color: transparent;height: 30px;border-radius: 3px;font-weight: 800;font-size: 14px;");
                //     addBtnJira.id = 'vcc-jira-btn-id';
                //     addBtnJira.appendChild(fluvidId);
                //     if (!document.getElementById('vcc-jira-btn-id')) {
                //         console.log("<====Jira 2");
                //         document.querySelectorAll('[data-test-id="issue.views.issue-base.foundation.status.status-field-wrapper"]')[0].appendChild(addBtnJira);
                //     }
                //     //End
                //     openPopupIfFunCall(1);
                // }
                //End
                //For gogole mmet button
                if (window.location.href.indexOf('meet.google.com/') > -1 && appIntegrations['meet']) {
                    if (!document.getElementById('vcc-jira-btn-id')) {
                        let interCount = 0;
                        let G_meetInter = setInterval(() => {
                            interCount++;
                            let meetCamOn = document.querySelectorAll('[aria-label="Leave call"]');
                            let addBtnG_MeetHtml = `<span class="flu-tip">
                                <span>
                                    <div id="vcc-jira-btn-id" style="cursor: pointer;">
                                        <div
                                            style="align-items: center;border-radius: 50%;box-sizing: border-box;display: flex;height: 40px;justify-content: center;width: 40px;background-color:#3c4043;margin-right: 10px;">
                                            <img src="${chrome.extension.getURL(" ./../images/icon48.png")}" style="width:25px">
                                        </div>
                                    </div>
                                </span>
                                <div class="flu-tooltip">
                                    <div class="flu-tooltip-arrow"></div>
                                    <div class="flu-tooltip-info">
                                        Record your Google Meet call with Fluvid for FREE
                                    </div>
                                </div>
                                <div class="flu-tooltip hoverTooltip">
                                    <div class="flu-tooltip-arrow"></div>
                                    <div class="flu-tooltip-info">
                                        Record call with Fluvid
                                    </div>
                                </div>
                            </span>`;
                            if (meetCamOn) {
                                let vccJiraBtnId = document.getElementById("vcc-jira-btn-id");
                                if(vccJiraBtnId) {
                                    clearInterval(G_meetInter);
                                    return;
                                };

                                if(!vccJiraBtnId) meetCamOn[0].insertAdjacentHTML('beforebegin', addBtnG_MeetHtml);
                                openPopupIfFunCall(2);
                                
                            }
                            // else if (meetCamOff && meetCamOff.length > 0 && meetingPageType && meetingPageType.length == 2) {
                            //     clearInterval(G_meetInter);
                            //     setTimeout(() => {
                            //         meetCamOff[0].parentElement.parentElement.parentElement.insertAdjacentHTML('beforeend', addBtnG_MeetHtml);
                            //         openPopupIfFunCall(2);
                            //     }, 1000);
                            // };

                            tooltipInter = setTimeout(() => {
                                let fluTooltip = document.getElementsByClassName("flu-tooltip");
                                if (fluTooltip) {
                                    fluTooltip[0].style.display = 'block';
                                    setTimeout(() => {
                                        fluTooltip[0].style.display = 'none';
                                    }, 3000);
                                };
                            }, 6000)

                            if (interCount >= 500) {
                                clearInterval(G_meetInter);
                            };

                        }, 1000);
                    }
                }
                //End
                //Zoom view
                if (window.location.href.indexOf('zoom.us/wc/') > -1 && appIntegrations['zoom']) {
                    if (!document.getElementById('vcc-jira-btn-id')) {
                        let zoomMeetHtml =
                            `<div class="flu-tip">
                                <span>
                                    <button id="vcc-jira-btn-id" tabindex="0" class="footer-button__button ax-outline" type="button" aria-label="open the chat pane">
                                        <div class="footer-button__img-layer">
                                            <img src="${chrome.extension.getURL("./../images/icon48.png")}" style="width:20px">
                                        </div>
                                        <span class="footer-button__button-label">Fluvid</span>
                                    </button>
                                </span>
                                <div class="flu-tooltip">
                                    <div class="flu-tooltip-arrow"></div>
                                    <div class="flu-tooltip-info">
                                        Record your Zoom call with Fluvid for FREE
                                    </div>
                                </div>
                            </div>`;
                        let zoomMeetingId = document.querySelectorAll('[class="more-button"]');
                        zoomMeetingId[0].parentElement.insertAdjacentHTML('beforeend', zoomMeetHtml);
                        setTimeout(() => {
                            openPopupIfFunCall(3);
                        }, 10);

                        tooltipInter = setTimeout(() => {

                            let fluTooltip = document.getElementsByClassName("flu-tooltip");
                            if (fluTooltip) {
                                fluTooltip[0].style.display = 'block';
                            };

                            setTimeout(() => {
                                fluTooltip[0].style.display = 'none';
                            }, 3000);
                        }, 8000);

                    }
                }

                //Outlook integration
                if (window.location.href.indexOf('outlook.live.com/mail/') > -1 && appIntegrations['outlook']) {
                    let outlookNewMesage = document.getElementsByClassName("ms-Button  ms-Button--commandBar");
                    if (outlookNewMesage) {
                        let fluvidIcon =
                            `<span id="openMailPopup" class="ms-OverflowSet-item" title="Create and Insert Fluvid videos" style="cursor: pointer;height: 32px;width: 32px;text-align: center;">
                                <img src="${chrome.extension.getURL("./../images/icon48.png")}" style="width: 15px;height: 15px;margin-top: 8px;">
                            </span>`;
                        outlookNewMesage[1].addEventListener("click", () => {
                            let interCount = 0;
                            let loadIconIntrv = setInterval(() => {
                                interCount++;
                                let outlookMenu = document.getElementById("compose_ellipses_menu");
                                if (outlookMenu) {
                                    outlookMenu.parentElement.parentElement.insertAdjacentHTML('beforebegin', fluvidIcon);
                                    clearInterval(loadIconIntrv);

                                    let openMailPopup = document.getElementById("openMailPopup");
                                    openMailPopup && openMailPopup.addEventListener("click", () => {
                                        appendGmailVideoSearch();
                                    })
                                };
                                if (interCount >= 500) {
                                    clearInterval(loadIconIntrv);
                                }
                            }, 1000);
                        });

                    }
                }
            }

        } catch (e) {
            Helper.error("Error while appending Vidcor Container Dom", e.message)
        }
    };

    // Click event on White overlay is added here
    let bindOverlayClick = () => {
        let overlay = document.querySelector("#white-overly");
        if (overlay) {
            overlay.addEventListener("click", function () {
                cancelRecordingMethod();
                shortCutsList(0);
            })
        }
    };

    // White Overlay over the screen is added here
    let whiteOverlay = () => {
        return new Promise((resolve, reject) => {
            try {
                Helper.log("White Overlay added");
                Helper.getRecordingStatus().then((status) => {
                    Helper.log("Recording Status While Setting White Overlay")
                    if (["stop"].indexOf(mediaRecorderState) !== -1) {
                        let overlayElem = document.querySelector("#white-overly");
                        if (!overlayElem) {
                            var elem = document.createElement('div');
                            elem.id = 'white-overly';
                            document.querySelector('body').prepend(elem);
                            defaultViewInit();
                        } else if (overlayElem.style.display === "none") {
                            overlayElem.style.display = "block";
                            defaultViewInit();
                        };
                        bindOverlayClick();
                        resolve()
                    } else {
                        resolve()
                    }
                }).catch((e) => {
                    Helper.error("Error in Setting White Overlay", e.message)
                    resolve()
                })
            } catch (e) {
                Helper.error("Error while appending White Overlay Container Dom", e.message)
                resolve()
            }
        })
    };

    // Logout Code is written here, it hides the recording block and white overlay
    let logout = () => {
        stopStream();
        let ccRecordingBlock = document.querySelector('#cc-recording-block');//video frame id
        if (ccRecordingBlock) {
            //add animation for video frame
            //ccRecordingBlock.classList.add('video-frame-css');
            ccRecordingBlock.classList.remove('show-extation');
            ccRecordingBlock.style.display = "none";
        };
        //action menu btn frame
        let actionMenuItems = document.querySelector('#fde-action-menu-items');
        if (actionMenuItems) actionMenuItems.style.display = "none";
        defaultViewInit();
    };

    let defaultMessageFun = () => {
        messageViewHideFun(0);
        commonConfirmationPopup();
        Helper.setPopupSetting({ popupStatus: false, popupType: 'open_0' });
    };

    //Default initiator for default ui
    let defaultViewInit = () =>{
        defaultMessageFun(); //message default view
        zoomF1F2F3Option(1);//Default views and show zoom option

        //Set camera/Menu list defaoult position
        let ccRecordingBlock = document.getElementById("cc-recording-block");
        if(ccRecordingBlock) ccRecordingBlock.style.left = '100px', ccRecordingBlock.style.bottom = '20px'; 
        let fdeActionMenuItems = document.getElementById("fde-action-menu-items");
        if(fdeActionMenuItems) fdeActionMenuItems.style.left = '0px', fdeActionMenuItems.style.top = '144px';
        //Set default action/camera frame
        Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
            let advanceOpt = status.advanceSettingStatus;
            advanceOpt['camFrameBottom'] = "20px";
            advanceOpt['camFrameLeft'] = "100px";
            advanceOpt['menuFrameTop'] = "144px";
            advanceOpt['menuFrameLeft'] = "0px";
            advanceOpt['camZoom'] = 1;
            advanceOpt['toolMenu'] = 'close';
            advanceOpt['penMenuOption'] = 'close';
            advanceOpt['canvasTool'] = "enableClick";
            advanceOpt['recordingStart'] = false;
            Helper.setAdvanceSetting(advanceOpt); //Set data for local storge into view
            Helper.log(advanceOpt, "<===data for console lososs");
        }).catch(error => {
            console.error('Cam frame move ' + error);
        });
        htmlFramsObj.camraIconType = 'show';
        Helper.setCrossStatus(htmlFramsObj);
        //set default icon
        const cancelRecordingOption = document.querySelector("#open-cancel-option");
        if(cancelRecordingOption)cancelRecordingOption.src = chrome.extension.getURL("images/icons/flu-close-ico.png");
    }

    //Append message into toster
    let noInternetUI = (textColor, bgColor, textMsg) => { //set text-color, background color, text message
        Helper.log(textColor, bgColor, textMsg, "<===getting internet status");
        let fdeAddTosterWeb = document.getElementById("fde-add-toster-web")
        var generateToster = document.createElement("div");
        generateToster.id = "tosterMessageId";
        generateToster.className = "noIntToster";
        generateToster.style.color = textColor;
        generateToster.style.backgroundColor = bgColor;
        generateToster.innerText = textMsg;
        let tosterMessageId = document.getElementById("tosterMessageId");
        if (!tosterMessageId) fdeAddTosterWeb.appendChild(generateToster);
    }

    //uppend right side action option and other changes
    let appendRecordAction = () => {
        hideShowVideoLoder(1);
        var iframeCont = document.getElementById('cc-recording-web');
        if (iframeCont) {
            iframeCont.style.display = 'none';
            iframeCont.innerHTML = '';
        }
        let vcc_draw_elem = document.querySelector("#vcc-draw-elem");
        if (vcc_draw_elem) vcc_draw_elem.style.display = 'none';
        let overlay = document.getElementById('white-overly');
        if (!overlay || (overlay && overlay.style.display == 'none')) {
            whiteOverlay();
        }
        var iframe2 = document.createElement('iframe');
        iframe2.src = "chrome-extension://hfadalcgppcbffdnichplalnmhjbabbm/template/web-extension.html";
        iframe2.id = 'cc-iframe-id';
        iframe2.className = 'vcc-iframe-css';
        iframe2.setAttribute("allow", "camera; microphone");
        iframe2.setAttribute("allowfullscreen", true);
        iframe2.setAttribute("frameBorder", "0");
        iframe2.style.height = "485px";
        iframe2.style.width = "355px";
        iframe2.style.visibility = 'hidden';
        if (iframeCont && !document.getElementById('cc-iframe-id')) {
            iframeCont.style.display = 'block';
            iframeCont.appendChild(iframe2);
        }
        iframe2.style.visibility = 'visible';
        // let isPause = document.getElementById("vcc-pause-btn");
        // if (isPause) isPause.style.display = "none";
        shortCutsList(1); //Shortcut function call
        Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
            let advanceSetting = status.advanceSettingStatus;
            Helper.setAdvanceSetting(advanceSetting);
        });

        //show extenstion action frame with animation
        if (iframeCont) iframeCont.classList.add('show-extation');
        Helper.setPopupSetting({ popupStatus: false, popupType: 'open_0' })

        //End
        setTimeout(() => {
            advanceOptionVcc() //check saved 
        }, 500);
    }
    //End

    //html branding logo add into browser
    let updateBrandingLogoFun = (status = null) => {
        var brandingId = document.getElementById('fde-add-brading-logo');
        if (status) {
            let bradingHtml = `<img src="${status.logo}" class="${status.pos}">`;
            if (brandingId && status.logo && status.pos) {
                brandingId.innerHTML = bradingHtml;
            } else {
                if (brandingId) brandingId.innerHTML = '';
            }
        } else {
            if (brandingId) brandingId.innerHTML = '';
        }
    };

    //Check video Upload status with error message 
    let appendVideoUploadProcess = () => {
        let overlay = document.getElementById('white-overly');
        if (!overlay) {
            whiteOverlay();
        }
        var iframeCont = document.getElementById('cc-recording-web');
        var iframeMessage = document.createElement('iframe');
        iframeMessage.src = "chrome-extension://hfadalcgppcbffdnichplalnmhjbabbm/template/videoUploadMsg.html";
        iframeMessage.id = 'cc-iframe-id';
        iframeMessage.className = 'vcc-iframe-css';
        iframeMessage.setAttribute("allow", "camera; microphone");
        iframeMessage.setAttribute("allowfullscreen", true);
        iframeMessage.setAttribute("frameBorder", "0");
        iframeMessage.style.visibility = 'hidden';
        if (iframeCont && !document.getElementById('cc-iframe-id')) {
            iframeCont.style.display = 'block';
            iframeCont.appendChild(iframeMessage);
        }
        iframeMessage.style.visibility = 'visible';
        if (iframeCont) iframeCont.classList.add('show-extation');
        Helper.sendMsgToBgScript("fde_chunk_data", {}, () => { });
    }
    //End

    //Cam hide/show with tab click and save localstorage
    let videoFrameRemoveFun = (camraFrameStatus) => {
        let videoFrameContainer = document.querySelector(".cc-ffcam-view-wrap");
        let camVideoFrameHide = document.getElementById("vcc-cam-hide-setting-btn");
        let camVideoFrameShow = document.getElementById("vcc-cam-setting-btn");
        let ccRecordingBlock = document.getElementById("cc-recording-block");
        if (camraFrameStatus == '1') {
            if(ccRecordingBlock && ccRecordingBlock.style.display == "none"){
                ccRecordingBlock.style.display = "block";
            }
            if (videoFrameContainer) videoFrameContainer.style.display = 'inline-block';
            if (camVideoFrameHide) camVideoFrameHide.style.display = 'inline-block';
            if (camVideoFrameShow) camVideoFrameShow.style.display = 'none';
        } else {
            if (videoFrameContainer) videoFrameContainer.style.display = 'none';
            if (camVideoFrameHide) camVideoFrameHide.style.display = 'none';
            if (camVideoFrameShow) camVideoFrameShow.style.display = 'none';
        }
    }

    let _runWebCamRecordingOnScreen = (options) => {
        try {
            let vidcorContainer = document.getElementById("vidcor-container");
            if (!vidcorContainer) {
                appendVidcorContainer()
            }
            let overlay = document.getElementById('white-overly');
            if (["start", "pause", "resume"].indexOf(mediaRecorderState) === -1 && !overlay) {
                whiteOverlay();
            }
            //Check video frame load with 50 video restriction
            let ccRecordingBlock = document.querySelector("#cc-recording-block");
            let actionMenuItems = document.querySelector('#fde-action-menu-items');//action btn frame id
            Helper.getChrUserProfile().then((response) => {
                let videos_count = response['vcc_chrome_userprofile'].videos_count;
                if (ccRecordingBlock && fde_recording && fde_video_count_limit && (videos_count >= fde_video_count_limit)) {
                    if (ccRecordingBlock) {
                        ccRecordingBlock.style.display = "none";
                        ccRecordingBlock.remove();
                    };
                    if (actionMenuItems) {
                        actionMenuItems.style.display = "none";
                        actionMenuItems.remove();
                    }
                } else {
                    if (ccRecordingBlock) {
                        ccRecordingBlock.style.display = "block";
                        //show extenstion action frame with animation
                        //ccRecordingBlock.classList.remove('video-frame-css');
                    };
                }
                //End
            }).catch((err) => {
                if (ccRecordingBlock) ccRecordingBlock.style.display = "none";
                console.log(err, 'Error get into video frame');
            });

            let isFFCamTemplateRendered = document.getElementById("vcc-ffcam-container");
            if (isFFCamTemplateRendered) {

                isFFCamTemplateRendered.style.display = "block";
                let cameraFlip = document.querySelector("#vcc-flip-camera");
                let ccCameraTypeBlk = document.querySelector(".cc-camera-type-blk");
                if (options && options.indexOf("video") === -1) {
                    profilePicLoader();
                    stopStream();
                    if(cameraFlip) cameraFlip.style.display = "none";
                    if(ccCameraTypeBlk) ccCameraTypeBlk.style.display = "none";
                } else {
                    videoContainer();
                    if(cameraFlip) cameraFlip.style.display = "block";
                    if(ccCameraTypeBlk) ccCameraTypeBlk.style.display = "block";
                }
            }
            else {
                Helper.loadText("start-recording.html", (html) => {
                    html = html.replace(/ROOT_PATH#/g, chrome.extension.getURL("/"));
                    document.getElementById("vidcor-container").innerHTML = html;
                    loadStartRecordingEventListeners();
                    if (options.indexOf("video") === -1) {
                        profilePicLoader();
                        stopStream();
                    } else {
                        videoContainer();
                    }
                    //Video and action btn frame
                    let ccRecordingBlock = document.querySelector("#cc-recording-block");
                    if (ccRecordingBlock) dragElement(ccRecordingBlock);
                    if (actionMenuItems) dragMenuElement(actionMenuItems);

                    Helper.sendMsgToBgScript("load_video_iframe", {}, () => { });
                })
            }
        } catch (e) {
            Helper.log("Error While Playing Webcam on Screen", e.message)
        }
    };

    // This Function load the user profile pic if camera is not allowed or any error occurs
    let profilePicLoader = (e) => {
        let imgElem = document.querySelector("#vidcor-ff-img");
        imgElem.onerror = function () {
            this.src = chrome.extension.getURL("images/user.jpeg");
        };
        Helper.getUserImage().then((profilePic) => {
            Helper.log("profilePic in content js", profilePic['vcc-userimage'])
            if (profilePic && profilePic['vcc-userimage']) {
                imgElem.src = profilePic['vcc-userimage'];
            } else {
                imgElem.src = chrome.extension.getURL("images/user.jpeg");
            }
        }).catch(() => {
            imgElem.src = chrome.extension.getURL("images/user.jpeg");
        });

        if (imgElem) imgElem.style.display = "block";
        let vidcor_ff_cam = document.querySelector("#vidcor-ff-cam");
        if (vidcor_ff_cam) vidcor_ff_cam.style.display = "none";
        //loader hide
        hideShowVideoLoder(0);

        let retryVideoFrmae = document.getElementById("retryVideoFrmae");
        if(retryVideoFrmae) retryVideoFrmae.addEventListener("click", ()=>{
            hideShowVideoLoder(1);
            let vidcor_ff_cam = document.querySelector("#vidcor-ff-cam");
            if (vidcor_ff_cam && vidcor_ff_cam.getAttribute("src") == 'about:blank') {
                vidcor_ff_cam.src = chrome.runtime.getURL('template/iframe.html');
                //loader hide
                //hideShowVideoLoder(0);
            };
            setTimeout(() => {
                Helper.getCrossStatus().then((status) => {
                    if (status.crossStatus && status.crossStatus.camraFrameType != '3') {
                        sendMsgToIframe("vcc_capture_media", {});
                    }
                }).catch(() => {
                    sendMsgToIframe("vcc_capture_media", {});
                })
            }, 1000);
        });
    };

    // This functions shows the Video Camera Container on Bottom Left of screen
    let videoContainer = () => {
        let vidcorIframe = document.querySelector('#vidcor-ff-cam');
        if (vidcorIframe) vidcorIframe.style.display = "block";

        let vidcor_ff_img = document.querySelector("#vidcor-ff-img");
        if (vidcor_ff_img) vidcor_ff_img.style.display = "none";
        //loader hide
        hideShowVideoLoder(0);
    };

    // This function is used to show the countdown timer before starting recording
    let startTimer = () => {
        var countdownNum = 0;
        Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
            if (status.advanceSettingStatus['countdownView'] || fde_countdown_timer) {
                countdownNum = status.advanceSettingStatus['countdownNum'];
                try {
                    Helper.log("Start Timer Function Called")
                    let pauseCount = true;
                    let timerTemplate = document.querySelector("#vidcor-recording-overlay");
                    if (!timerTemplate) {
                        Helper.log("Appending Timer Template" + countdownNum);
                        //Check countdown timer html set
                        var elem = document.createElement('div');
                        elem.id = 'vidcor-recording-overlay';
                        elem.className = 'recording-overly';
                        document.querySelector('body').prepend(elem);
                        var d1 = document.querySelector('#vidcor-recording-overlay');
                        Helper.log("Appending Timer Template Afterend");
                        d1.innerHTML = `<div class="vid-loader-position"> 
                            <p>${liveCountdownTimer ? 'You will go live in...' : 'Your recording will start in...'}</p>
                            <h1 id="dro">${countdownNum}</h1> 
                            <p  id="pauseCountId" class="skipBtn pauseBtn"><span id="pauseCountText">Pause Countdown</span></p> 
                            <p  id="skipCountId" class="skipBtn" sty><span>Skip Countdown</span></p>`;

                    } else {
                        Helper.log("Timer Template")
                    }
                    let interval = null;
                    let overlay = document.querySelector("#vidcor-recording-overlay");
                    if (overlay) overlay.style.display = "block";
                    let timerElem = document.querySelector('#dro');
                    if (timerElem) {
                        timerElem.innerText = countdownNum;
                        interval = setInterval(coundownFun, 1000);
                    } else {
                        Helper.log("Timer Elem Not Found")
                    }

                    //pause/resume counter
                    let pauseCountId = document.getElementById("pauseCountId");
                    pauseCountId.addEventListener("click", () => {
                        pauseCount = !pauseCount;
                        let pauseCountText = document.getElementById("pauseCountText");

                        if (pauseCountText) {
                            pauseCountText.innerText = pauseCount ? 'Pause Countdown' : 'Resume Countdown';
                        };

                        if (pauseCount) {
                            interval = setInterval(coundownFun, 1000);
                        } else {
                            clearInterval(interval);
                        }
                    });

                    //Skip countdown option
                    let skipCountId = document.getElementById("skipCountId");
                    skipCountId.addEventListener("click", () => {
                        timerElem.innerText = 0;
                        coundownFun();
                    })

                    function coundownFun() {
                        let currentValue = parseInt(timerElem.innerText);
                        if (currentValue <= 1) {
                            clearInterval(interval);
                            if (overlay) {
                                overlay.style.display = "none";
                                timerElem.innerText = countdownNum.toString();
                            } else {
                                Helper.error("Start Timer Template not found");
                            }
                            advanceOptionVcc();
                            setTimeout(() => {
                                Helper.sendMsgToBgScript("bg_start_media_recording", {}, () => {
                                });
                                Helper.broadcastMessage("fde_recording_start", { streamName: selectedStreamName });
                            }, 800);

                            Helper.getCrossStatus().then((status) => {
                                if (status.crossStatus && status.crossStatus.camraFrameType != '3') {
                                    getCrossStatusData();
                                }
                            });

                            return
                        };
                        timerElem.innerText = (currentValue - 1);
                    }


                } catch (e) {
                    Helper.error("Start Timer Template not found", e.message)
                }
            } else {
                Helper.getCrossStatus().then((status) => {
                    if (status.crossStatus && status.crossStatus.camraFrameType != '3') {
                        getCrossStatusData();
                    }
                });
                setTimeout(()=>{
                    Helper.sendMsgToBgScript("bg_start_media_recording", {}, () => { });
                    Helper.broadcastMessage("fde_recording_start", { streamName: selectedStreamName });
                    advanceOptionVcc();
                }, 1000);
            };
            //End
        });
    };

    //Show camra Fame
    let camaraFramShow = () => {
        let cameraContainer = document.querySelector(".cc-ffcam-view-wrap");
        let showCameraBtn = document.querySelector("#vcc-cam-setting-btn");
        let hideCameraBtn = document.querySelector("#vcc-cam-hide-setting-btn");
        if (cameraContainer && (cameraContainer.style.display != "inline-block" || cameraContainer.style.display == "none")) {
            cameraContainer.style.display = "inline-block";
            showCameraBtn.style.display = "none";
            hideCameraBtn.style.display = 'inline-block';
        }
        htmlFramsObj.camraIconType = 'show';
        Helper.setCrossStatus(htmlFramsObj);
    }

    let camaraFramHide = () => {
        let cameraContainer = document.querySelector(".cc-ffcam-view-wrap");
        let showCameraBtn = document.querySelector("#vcc-cam-setting-btn");
        let hideCameraBtn = document.querySelector("#vcc-cam-hide-setting-btn");
        if (cameraContainer && cameraContainer.style.display != "none") {
            cameraContainer.style.display = "none";
            showCameraBtn.style.display = "inline-block";
            hideCameraBtn.style.display = 'none';
        }
        htmlFramsObj.camraIconType = 'hide';
        Helper.setCrossStatus(htmlFramsObj);
    }

    // All buttons events are binded here
    let loadStartRecordingEventListeners = () => {
        const startRecording = document.getElementById("vcc-init-btn");
        const stopRecording = document.getElementById("vcc-stop-btn");
        const pauseRecording = document.getElementById("vcc-pause-btn");
        const resumeRecording = document.getElementById("vcc-resume-btn");
        const hideMenuBtn = document.getElementById("vcc-hide-menu-btn");
        const showMenuBtn = document.getElementById("fde-show-tool");
        const hideCameraBtn = document.getElementById("vcc-cam-hide-setting-btn");
        const cancelRecordingOption = document.querySelector("#open-cancel-option");
        const cancelRecordingBtn = document.querySelector("#vcc-cancel-btn");
        const showCameraBtn = document.querySelector("#vcc-cam-setting-btn");
        const fdeRountClick = document.querySelector("#fde-rount-click");
        const fdeSquareClick = document.getElementById("fde-square-click");
        const camZoom1Btn = document.querySelector(".vcc-cam-zoom1");
        const camZoom2Btn = document.querySelector(".vcc-cam-zoom2");
        const camZoom3Btn = document.querySelector(".vcc-cam-zoom3");
        const flipVideoId = document.querySelector("#vcc-flip-camera");
        const drawingToolsOpen = document.getElementById("drawing-tools-open");
        const drawingToolsClose = document.getElementById("drawing-tools-close");
        const drawingToolsList = document.getElementById("drawing-tools-list");
        //tool open/close fun
        if (drawingToolsOpen) drawingToolsOpen.addEventListener("click", () => {
            if (drawingToolsClose) drawingToolsClose.style.display = "block";
            drawingToolsOpen.style.display = "none";
            if (drawingToolsList) drawingToolsList.style.display = "grid";
            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let newAdvanceObj = status.advanceSettingStatus;
                newAdvanceObj['toolMenu'] = 'open';
                Helper.setAdvanceSetting(newAdvanceObj);
            }).catch(error => {
                console.log(error, '<==advanceSettingStatus From shortcut list');
            });
        });
        if (drawingToolsClose) drawingToolsClose.addEventListener("click", () => {
            drawingToolsClose.style.display = "none";
            if (drawingToolsOpen) drawingToolsOpen.style.display = "block";
            if (drawingToolsList) drawingToolsList.style.display = "none"
            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let newAdvanceObj = status.advanceSettingStatus;
                newAdvanceObj['toolMenu'] = 'close';
                Helper.setAdvanceSetting(newAdvanceObj);
            }).catch(error => {
                console.log(error, '<==advanceSettingStatus From shortcut list');
            });
        })
        var flipStatus = false;
        if (camZoom1Btn) camZoom1Btn.addEventListener("click", () => {
            zoomF1F2F3Option(1);
        });
        if (camZoom2Btn) camZoom2Btn.addEventListener("click", () => {
            zoomF1F2F3Option(2);
        });
        if (camZoom3Btn) camZoom3Btn.addEventListener("click", () => {
            zoomF1F2F3Option(3);
        });

        //change video frame ui square to circle
        if (fdeRountClick) fdeRountClick.addEventListener("click", () => {
            setcircleSquare(0);
            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let advanceOpt = status.advanceSettingStatus;
                advanceOpt['videoFrameUIType'] = '0';
                Helper.setAdvanceSetting(advanceOpt);//Set data for local storge into view
            }).catch((err) => {
                Helper.log('circle error', err);
            });
        });

        //change video frame ui circle to square 
        if (fdeSquareClick) fdeSquareClick.addEventListener("click", () => {
            setcircleSquare(1);
            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let advanceOpt = status.advanceSettingStatus;
                advanceOpt['videoFrameUIType'] = '1';
                Helper.setAdvanceSetting(advanceOpt);//Set data for local storge into view
            }).catch((err) => {
                Helper.log('square error', err);
            });
        });


        if (startRecording) startRecording.addEventListener("click", () => {
            startRecordingMethod();
        });
        if (stopRecording) stopRecording.addEventListener("click", () => {
            let penEditor = document.getElementById('cc-pen-editor');
            if (penEditor) penEditor.style.display = 'none';

            stopRecordingMethod();
            Helper.sendMsgToBgScript('vcc_click_stop', null, () => { });
            Helper.broadcastMessage("fde_recording_end", { streamName: selectedStreamName });
            currentTabInfo();
        });
        if (pauseRecording) pauseRecording.addEventListener("click", () => {
            Helper.getRecordingStatus().then((status) => {
                if (status && ["start", "resume"].indexOf(mediaRecorderState) !== -1) {
                    Helper.log("Pause Recording Clicked");
                    if (pauseRecording) pauseRecording.style.display = "none";
                    if (resumeRecording) {
                        resumeRecording.style.display = "inline-block";
                        Helper.getCrossStatus().then((status) => {
                            if (status.crossStatus && status.crossStatus.camraFrameType != '3') {
                                messageViewHideFun(1);
                            }
                        })
                    };
                    Helper.setRecordingStatus("pause");
                    Helper.sendMsgToMain("main_pause_recording", {}, () => {
                    })
                } else {
                    Helper.log("Pause Btn Status", status.recordingStatus)
                }
            }).catch((err) => {
                Helper.log('Pause Recoring Error', err);
            });
            Helper.sendMsgToBgScript('vcc_click_pause', null, () => { });
            commonConfirmationPopup();
        });
        if (resumeRecording) resumeRecording.addEventListener("click", () => {
            Helper.getRecordingStatus().then((status) => {
                Helper.log("Resume Btn Clicked", mediaRecorderState)
                if (status && ["pause"].indexOf(mediaRecorderState) !== -1) {
                    Helper.log("Resume Recording Clicked");
                    if (resumeRecording) resumeRecording.style.display = "none";
                    if (pauseRecording) pauseRecording.style.display = "inline-block";
                    messageViewHideFun(0);
                    Helper.setRecordingStatus("resume");
                    Helper.sendMsgToMain("main_resume_recording", {}, () => {
                    })
                } else {
                    Helper.log("Resume Btn Status", status.recordingStatus)
                }
            }).catch((err) => {
                Helper.log('Pause Recoring Error', err);
            });

            Helper.sendMsgToBgScript('vcc_click_resume', null, () => { })
        });

        //hide Menu Btn
        if (hideMenuBtn) hideMenuBtn.addEventListener("click", () => {
            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let shortCutObj = status.advanceSettingStatus;
                shortCutObj['controlMenu'] = false;
                Helper.setAdvanceSetting(shortCutObj);
            });
            showMenuBtn.style.display = 'block';
            let fullActionBtn = document.getElementById("fullActionBtn");
            if (fullActionBtn) {
                fullActionBtn.style.display = 'none';
            }
        });

        //show menu Btn
        if (showMenuBtn) showMenuBtn.addEventListener("click", () => {
            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let shortCutObj = status.advanceSettingStatus;
                shortCutObj['controlMenu'] = true;
                Helper.setAdvanceSetting(shortCutObj);
            });
            showMenuBtn.style.display = 'none';
            let fullActionBtn = document.getElementById("fullActionBtn");
            if (fullActionBtn) {
                fullActionBtn.style.display = 'block';
            };
        });

        //Camra Screen Show function
        if (hideCameraBtn) hideCameraBtn.addEventListener("click", () => {
            camaraFramHide();
            Helper.sendMsgToBgScript('vcc_click_hide_cam', null, () => { })
        });

        //Camra Screen hide function
        if (showCameraBtn) showCameraBtn.addEventListener("click", () => {
            camaraFramShow();
            Helper.sendMsgToBgScript('vcc_click_show_cam', null, () => { })
        });

        //Flicp video click open
        if (flipVideoId) flipVideoId.addEventListener("click", () => {
            flipStatus = !flipStatus;
            htmlFramsObj.flipFrame = flipStatus;
            Helper.setCrossStatus(htmlFramsObj);
            let ffcam_iframe_container = document.querySelector(".cc-ffcam-iframe-container");
            if (ffcam_iframe_container) {
                if (flipStatus === true) {
                    ffcam_iframe_container.classList.add("flicp180");
                } else if (flipStatus === false) {
                    ffcam_iframe_container.classList.remove("flicp180");
                } else {
                    ffcam_iframe_container.classList.remove("flicp180");
                };
            };
            Helper.sendMsgToBgScript('vcc_click_flip_video', null, () => { })
        });

        //Cancel option click Btn
        let cancelOptionList = document.getElementById("cancel-option-list");
        cancelOptionList.style.display = "none";
        if(cancelRecordingOption) cancelRecordingOption.addEventListener("click", (e)=>{
            if(cancelOptionList && cancelOptionList.style.display == "none"){
                cancelOptionList.style.display = "block";
                cancelRecordingOption.src = chrome.extension.getURL("images/icons/flu-close-ico-blu.png");
            } else {
                cancelOptionList.style.display = "none";
                cancelRecordingOption.src = chrome.extension.getURL("images/icons/flu-close-ico.png");
            }
        });


        if (cancelRecordingBtn) cancelRecordingBtn.addEventListener("click", () => {
            let cancelOptionList = document.getElementById("cancel-option-list");
            if(cancelOptionList)cancelOptionList.style.display = "none";
            cancelRecordingMethod();
            shortCutsList(0);
            let penEditor = document.getElementById('cc-pen-editor');
            if (penEditor) penEditor.style.display = 'none';
            Helper.sendMsgToBgScript('vcc_click_cancel_recording', null, () => { });
        });


        let fdeRestart = document.getElementById("fde-restart");
        if(fdeRestart) fdeRestart.addEventListener("click", ()=>{
            const option = { screen: !0, camera: !0, audio: !0, fullDesktop: !0 };

            let vidcor_ff_cam = document.querySelector("#vidcor-ff-cam");
            if (vidcor_ff_cam) vidcor_ff_cam.style.display = 'none';
            hideShowVideoLoder(1);
            Helper.sendMsgToMain("main_cancel_recording", {}, () => {}); //Old recording cancel

            //Set option for recording views and shows
            Helper.getCrossStatus().then((status) => {
                if (status.crossStatus && status.crossStatus.camraFrameType == '1') {
                    option.screen = !0;
                    option.camera = !0;
                }
                if (status.crossStatus && status.crossStatus.camraFrameType == '2' ) {
                    option.screen = !0;
                    option.camera = !1;
                };
                Main.enableCorrectOption(option);
            })

            setTimeout(() => {
                _captureCamAudio();//Cam load
                startRecordingMethod();
                Main.communicateWithContentScript("start");
                overlayFun();//Countdown load
            }, 1000);
            let cancelOptionList = document.getElementById("cancel-option-list");
            if(cancelOptionList)cancelOptionList.style.display = "none";
            const cancelRecordingOption = document.querySelector("#open-cancel-option");
            cancelRecordingOption.src = chrome.extension.getURL("images/icons/flu-close-ico.png");
        });

        //Show/Hide background blur option
        let fdeBgBlurList = document.getElementById("fde-bg-blur-list");
        let fdeBgBlurClick = document.getElementById("fde-bg-blur-click");
        if (fdeBgBlurClick) fdeBgBlurClick.addEventListener("click", () => {
            let bgBlurStatus = fdeBgBlurList.style.display;
            if (bgBlurStatus == 'none') {
                fdeBgBlurList.style.display = 'block';
            } else {
                fdeBgBlurList.style.display = 'none';
            }
        })
        //End

        let currentTabInfo = () => {
            chrome.tabs.query({ active: !0, windowType: "popup", currentWindow: !0 }, (tab) => {
                if (tab && tab[0].url.indexOf("template/camOnly.html") > -1) {
                    window.close();
                    defaultViewInit();
                }
            });
        }
    };

    //html message view/hide for common use
    let messageViewHideFun = (status) => {
        const resumePopup = document.getElementById("fde-popup-message");
        const resumeRecording = document.getElementById("vcc-resume-btn");
        if (status == 1) {
            if (resumePopup) resumePopup.innerHTML = msgPopupHtml;
            let fdeResumeVideo = document.getElementById("fde-resume-video");
            if (fdeResumeVideo) fdeResumeVideo.addEventListener("click", () => {
                resumeRecording.click();
            });
            //remove popup with pause state
            let removePopup = document.getElementById("removePopupId");
            if (removePopup) removePopup.addEventListener("click", (e) => {
                messageViewHideFun(0);
            })
        } else {
            if (resumePopup) resumePopup.innerHTML = '';
            let tosterMessageId = document.getElementById("tosterMessageId");
            if (tosterMessageId) tosterMessageId.remove();
        }
    }



    //add comformation popup
    let commonConfirmationPopup = (status = 0, htmlMessage = '') => {
        const interstHtmlId = document.getElementById("fde-common-popup-message");
        let InnerHtmlLen = interstHtmlId.innerHTML.length;
        if (status == 1) {
            // if (InnerHtmlLen < 10) {
            if (interstHtmlId) interstHtmlId.innerHTML = htmlMessage;
            //popup event for action/redirection
            let limitDismiss = document.getElementById("limitDismiss");
            let limitUpgrade = document.getElementById("limitUpgrade");
            if (limitDismiss) {
                limitDismiss.addEventListener("click", () => {
                    commonConfirmationPopup();
                    Helper.setPopupSetting({ popupStatus: false, popupType: 'open_0' });
                });
            };

            if (limitUpgrade) {
                limitUpgrade.addEventListener("click", () => {
                    commonConfirmationPopup();
                    window.open("https://fluvid.com/plans", "_blank");
                    Helper.setPopupSetting({ popupStatus: false, popupType: 'open_0' });
                });

            };
            // }
        } else {
            if (interstHtmlId) interstHtmlId.innerHTML = '';
        }
    }




    //common zoom video frame option
    let zoomF1F2F3Option = (frameType) => {
        const camZoom1Btn = document.querySelector(".vcc-cam-zoom1");
        const camZoom2Btn = document.querySelector(".vcc-cam-zoom2");
        const camZoom3Btn = document.querySelector(".vcc-cam-zoom3");
        //hideShowVideoLoder(1);
        if (frameType == 2) {
            if (camZoom1Btn) camZoom1Btn.classList.remove("active");
            if (camZoom3Btn) camZoom3Btn.classList.remove("active");
            let camContainer = document.querySelector(".cc-ffcam-view");
            if (camContainer) camContainer.classList.remove("size-1", "size-2", "size-3");
            if (camContainer) camContainer.classList.add("size-2");
            let iframeContainer = document.querySelector("#vidcor-ff-cam");
            camZoom2Btn.classList.add("active");
            if (iframeContainer) iframeContainer.classList.remove("cc-zoom1", "cc-zoom2", "cc-zoom3");
            if (iframeContainer) iframeContainer.classList.add("cc-zoom2");
            sendMsgToIframe("size_frame_2");
            Helper.sendMsgToBgScript('vcc_cam_medium', null, () => { });
        } else if (frameType == 3) {
            if (camZoom1Btn) camZoom1Btn.classList.remove("active");
            if (camZoom2Btn) camZoom2Btn.classList.remove("active");
            let camContainer = document.querySelector(".cc-ffcam-view");
            if (camContainer) camContainer.classList.remove("size-1", "size-2", "size-3");
            if (camContainer) camContainer.classList.add("size-3");
            let iframeContainer = document.querySelector("#vidcor-ff-cam");
            if (camZoom3Btn) camZoom3Btn.classList.add("active");
            if (iframeContainer) iframeContainer.classList.remove("cc-zoom1", "cc-zoom2", "cc-zoom3");
            if (iframeContainer) iframeContainer.classList.add("cc-zoom3");
            sendMsgToIframe("size_frame_3");
            Helper.sendMsgToBgScript('vcc_cam_large', null, () => { });
        } else {
            if (camZoom2Btn) camZoom2Btn.classList.remove("active");
            if (camZoom3Btn) camZoom3Btn.classList.remove("active");
            let camContainer = document.querySelector(".cc-ffcam-view");
            if (camContainer) camContainer.classList.remove("size-1", "size-2", "size-3");
            if (camContainer) camContainer.classList.add("size-1");
            let iframeContainer = document.querySelector("#vidcor-ff-cam");
            if (camZoom1Btn) camZoom1Btn.classList.add("active");
            if (iframeContainer) iframeContainer.classList.remove("cc-zoom1", "cc-zoom2", "cc-zoom3");
            Helper.getCrossStatus().then((status) => {
                if (status.crossStatus && status.crossStatus.camraFrameType != '3') {
                    if (iframeContainer) iframeContainer.classList.add("cc-zoom1");
                }
            }).catch(() => {
                if (iframeContainer) iframeContainer.classList.add("cc-zoom1");
            });
            Helper.sendMsgToBgScript('vcc_cam_small', null, () => { });
        }
        //Set views and other data show
        Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
            let advanceOpt = status.advanceSettingStatus;
            advanceOpt['camZoom'] = frameType;
            Helper.setAdvanceSetting(advanceOpt);//Set data for local storge into view
        }).catch((err) => {
            Helper.log('Zoom 2 error', err);
        });
    }

    // Triggers when start recording button is clicked
    let stopRecordingMethod = (t = 10000) => {
        Helper.log("Stop Recording Clicked");
        stopStream();
        defaultViewInit();
        const startRecording = document.getElementById("vcc-init-btn");
        const stopRecording = document.getElementById("vcc-stop-btn");
        const pauseRecording = document.getElementById("vcc-pause-btn");
        const resumeRecording = document.getElementById("vcc-resume-btn");
        if (stopRecording) stopRecording.style.display = "none";
        if (startRecording) startRecording.style.display = "inline-block";
        Helper.setRecordingStatus("stop");
        let whiteOverlay = document.querySelector('#white-overly');
        if (whiteOverlay) {
            whiteOverlay.parentNode.removeChild(whiteOverlay)
        };
        let counterHtml = document.querySelector('#vidcor-recording-overlay');
        if (counterHtml) {
            counterHtml.parentNode.removeChild(counterHtml)
        }
        if (startRecording) startRecording.style.display = "inline-block";

        if (stopRecording) stopRecording.style.display = "none";

        // if (pauseRecording) pauseRecording.style.display = "none";

        if (resumeRecording) resumeRecording.style.display = "none";

        let ccRecordingBlock = document.querySelector("#cc-recording-block");
        if (ccRecordingBlock) {
            ccRecordingBlock.style.display = "none";
            document.getElementById('cc-recording-web').style.display = 'none';
            document.getElementById('cc-recording-web').src = "about:blank";
            //remove/add extenstion action frame with animation
            //ccRecordingBlock.classList.add('video-frame-css');
            setTimeout(() => {
                ccRecordingBlock.classList.remove('show-extation');
            }, 10);
        };
        let actionMenuItems = document.querySelector('#fde-action-menu-items');//action btn frame id
        if (actionMenuItems) actionMenuItems.style.display = "none";
        Helper.sendMsgToMain("main_stop_recording", { stopTime: t }, () => { });
        // Helper.getRecordingStatus().then((status) => {
        //     Helper.log("status['recordingStatus'] in stop recording", status)
        //     if (status && ["start", "pause", "resume"].indexOf(mediaRecorderState) !== -1) {
        //         Helper.sendMsgToMain("main_stop_recording", { stopTime: t }, () => { });
        //     } else {
        //         Helper.log("Stop Btn Status", status.recordingStatus)
        //     };
        //     camaraFramShow();
        // })
    }

    // Triggers when cancel recording button triggers
    let cancelRecordingMethod = () => {
        Helper.log("Cancel Recording");
        Helper.setRecordingStatus("stop");
        defaultViewInit();
        updateBrandingLogoFun();
        setTimeout(() => {
            stopStream();
        }, 700)// timeout for animation 
        let whiteOverlay = document.querySelector('#white-overly');
        if (whiteOverlay) {
            whiteOverlay.parentNode.removeChild(whiteOverlay);
        }
        let counterHtml = document.querySelector('#vidcor-recording-overlay');
        if (counterHtml) {
            counterHtml.parentNode.removeChild(counterHtml)
        }
        const startRecording = document.getElementById("vcc-init-btn");
        const stopRecording = document.getElementById("vcc-stop-btn");
        const pauseRecording = document.getElementById("vcc-pause-btn");
        const resumeRecording = document.getElementById("vcc-resume-btn");

        if (startRecording) startRecording.style.display = "inline-block";

        if (stopRecording) stopRecording.style.display = "none";

        //if (pauseRecording) pauseRecording.style.display = "none";

        if (resumeRecording) resumeRecording.style.display = "none";
        let ccRecordingBlock = document.querySelector("#cc-recording-block");
        if (ccRecordingBlock) {
            //for extion video frame animation
            //ccRecordingBlock.classList.add('video-frame-css');
            ccRecordingBlock.classList.remove('show-extation');
            ccRecordingBlock.style.display = "none";
        }
        let actionMenuItems = document.querySelector('#fde-action-menu-items');//action btn frame id
        if (actionMenuItems) actionMenuItems.style.display = "none";

        let cc_iframe_id = document.getElementById('cc-iframe-id');
        let ccRecordingWeb = document.getElementById('cc-recording-web');
        if (cc_iframe_id) {
            //remove extenstion action frame with animation
            ccRecordingWeb.classList.remove('show-extation');
            setTimeout(() => {
                cc_iframe_id.remove();
            }, 1000)

        }
        camaraFramShow();
        Helper.sendMsgToMain("main_cancel_recording", {}, () => {
        });
    };

    let startRecordingMethod = () => {
        Helper.log("Start Recording Clicked");
        //Remove action iframe
        let ccIframeId = document.getElementById('cc-iframe-id');
        let ccRecordingWeb = document.getElementById('cc-recording-web');
        const startRecording = document.getElementById("vcc-init-btn");
        const stopRecording = document.getElementById("vcc-stop-btn");
        if (ccIframeId) {
            //remove extenstion action frame with animation
            ccRecordingWeb.classList.remove('show-extation');
            setTimeout(() => {
                ccIframeId.remove();
            }, 1000)
        }
        //End
        Helper.getRecordingStatus().then((status) => {
            Helper.log("Record Status", status);
            if (["stop"].indexOf(mediaRecorderState) !== -1) {
                if (startRecording) startRecording.style.display = "none";
                if (stopRecording) stopRecording.style.display = "inline-block";
                let white_overly = document.querySelector("#white-overly");
                if (white_overly) white_overly.style.display = "none";
                Helper.setRecordingStatus("start");
                let currentUrlTitle = document.title || "Untitled Video";
                Helper.sendMsgToMain("main_init_recording", { title: currentUrlTitle }, () => {
                });
                Helper.getChrUserProfile().then((response) => {
                    let userProfileData = response.vcc_chrome_userprofile;
                    let branding = userProfileData['branding'] ? userProfileData['branding'] : null;
                    updateBrandingLogoFun(branding);
                }).catch((error) => {
                    updateBrandingLogoFun();
                });
            } else {
                Helper.log("Start Btn Status", status.recordingStatus)
            }
        }).catch((err) => {
            Helper.log('Start Recoring Error', err);
        });

        Helper.sendMsgToBgScript('vcc_click_start_btn_cam', null, () => { })

        //Set default data views and other set 
        Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
            Helper.setAdvanceSetting(status.advanceSettingStatus);
        });

        Helper.getCrossStatus().then((status) => {
            if (status.crossStatus && status.crossStatus.camraFrameType == '3') {
                var left = (screen.width - 900) / 2;
                var top = (screen.height - 600) / 4;
                window.open(chrome.runtime.getURL('template/camOnly.html'), 'Fluvid Cam Only Recording', `width=900,height=600,top=${top},left=${left},scrollbars=no,resizable=no`);
            }
        })
    }

    // It decides what to show video camera or user profle pic on bottom left
    let _captureCamAudio = (mediaConstraints) => {
        Helper.setMediaConstraints(mediaConstraints);
        let vidcorContainer = document.getElementById("vidcor-container");
        if (!vidcorContainer) {
            appendVidcorContainer()
        }
        if (mediaConstraints && !mediaConstraints.video) {
            _runWebCamRecordingOnScreen([])
        } else {
            let options = [];
            if (mediaConstraints && mediaConstraints.video) {
                options.push("video")
            };
            let vidcor_ff_cam = document.querySelector("#vidcor-ff-cam");
            if (vidcor_ff_cam && vidcor_ff_cam.getAttribute("src") == 'about:blank') {
                vidcor_ff_cam.src = chrome.runtime.getURL('template/iframe.html');
                //loader hide
                //hideShowVideoLoder(0);
            };
            setTimeout(() => {
                Helper.getCrossStatus().then((status) => {
                    let camraFrameType = status.crossStatus && status.crossStatus.camraFrameType;
                    if (camraFrameType == '1') {
                        sendMsgToIframe("vcc_capture_media", {});
                    }
                }).catch(() => {
                    sendMsgToIframe("vcc_capture_media", {});
                })
            }, 1000)

        }
    };

    let listnersDebug = (request) => {
        Helper.log("Content Script Received Message ===> " + request.type)
    };

    // This functions get called for every message that content script recieved, and it fetches current tab informationa
    // along with some other information related to user login and recoding status from background js
    let parseRequest = (request, sender, cb) => {
        if (cb) {
            chrome.runtime.sendMessage({ type: "get_current_tab_info" }, data => {
                if (data && typeof data === "object") {
                    let recordingTabId = 0;
                    let recordingWindowId = 0;
                    if (data.recordingWindowId != "null") {
                        recordingWindowId = Helper.parseJSON(data.recordingWindowId);
                        if (recordingWindowId) {
                            recordingWindowId = recordingWindowId.windowId
                        } else {
                            recordingWindowId = 0
                        }
                    }
                    if (data.recordingTabId != "null") {
                        let recordingTabInfo = Helper.parseJSON(data.recordingTabId);
                        if (recordingTabInfo) {
                            recordingTabId = recordingTabInfo.tabId || 0;
                            recordingWindowId = recordingTabInfo.windowId || 0
                        }
                    }
                    Helper.log('My tabId is', data);
                    Helper.log("recordingWindowIdInfo =", recordingWindowId, ", recordingTabId = ", recordingTabId, ", recordingType = ", data.recordingType, ", tabId = ", data.tab.id, ", tabUrl =", data.tab.url, ", windowId = ", data.tab.windowId, 'TabID=', data.tab.id, 'mediaRecorderState', mediaRecorderState);
                    if (!data.recordingType || !recordingWindowId || (data.recordingType && recordingWindowId == data.tab.windowId && (([2, 4, 6, 8, 10, 12].indexOf(data.recordingType) !== -1 && recordingTabId == data.tab.id) || ([1, 2, 3, 5, 7, 9, 11].indexOf(data.recordingType) > -1)))) {
                        let recordingInfo = { recordingWindowId: recordingWindowId, recordingTabId: recordingTabId }
                        let mainObj = { ...request, ...sender, ...data, ...recordingInfo };
                        cb(mainObj)
                    }
                    else {
                        Helper.log("Message not related to current tab or window, Message = ", request.type)
                    }
                    //check tab recording or window recording
                    if (recordingTabId && (recordingTabId != data.tab.id) && (mediaRecorderState == "start" || mediaRecorderState == "recording" || mediaRecorderState == "stop") && (data.recordingType == 2 || data.recordingType == 6)) {
                        tabChangesStatus = true;
                    } else {
                        tabChangesStatus = false;
                    }
                }
            })
        }
    };

    //convert hrs/mint/sec into minut
    let minuteData = (hrs = 0, min = 0, sec = 0) => {
        let hrToMint = +hrs * 60; //hr to min
        let secToMint = +sec / 60; //sec to min
        return +min + hrToMint + secToMint//total mint
    }

    // It listens for every message content script recieves
    const listners = (request, sender, sendResponse) => {
        listnersDebug(request);
        if (request.greeting === "hello") {
            sendResponse({ message: "hi" });
        } //Message Exchange bg<=>Content 
        let timerElemClass = document.querySelector("#vcc-timer-elem");
        parseRequest(request, sender, function (requestObj) {

            if (requestObj) {
                if (request.type === "vcc-finish-stream" && requestObj.recordingStatus) {
                    var stopbtn = document.getElementById('vcc-stop-btn');
                    setTimeout(function () {
                        stopbtn.click();
                    }, 100);
                }

                //Check background call function
                if ((request.type === "cs_open_action_btn" || request.greeting === "hello") && !requestObj.recordingStatus) { // request.greeting === "hello"
                    //let vccIframeId = document.getElementById("cc-iframe-id");
                    let vcc_draw_elem = document.getElementById("vcc-draw-elem");
                    if (vcc_draw_elem) vcc_draw_elem.style.display = 'none';

                    if (request.receivedCounter > 0 && request.sentCounter > 0 && request.receivedCounter < request.sentCounter && request.receivedCounter != request.sentCounter) {
                        appendVideoUploadProcess();
                    }
                    // else {
                        //if (!vccIframeId || vccIframeId && (vccIframeId.src.indexOf('videoUploadMsg.html') > -1)) appendRecordAction();
                    // }
                }
                if (request.type == 'vcc-open-extension-web' && !requestObj.recordingStatus) {
                    let vccIframeId = document.getElementById("cc-iframe-id");
                    if (!vccIframeId || vccIframeId && (vccIframeId.src.indexOf('videoUploadMsg.html') > -1)) appendRecordAction();
                    if (window.location.origin.indexOf("outlook") > -1) {
                        Helper.setEventActionFun('initiator', 'outlook');
                    } else if (window.location.origin.indexOf("mail.google") > -1) {
                        Helper.setEventActionFun('initiator', 'gmail');
                    }
                }

                Helper.log("Content Script Request Parsed ====> ", requestObj, requestObj.mediaRecorderState);
                mediaRecorderState = requestObj.mediaRecorderState === "recording" ? "start" : requestObj.mediaRecorderState == "paused" ? "pause" : "stop";
                Helper.log("Current mediaRecorderState ============> ", request.type, mediaRecorderState);
                if (!requestObj.recordingStatus) {
                    Draw.cleanupCanvas();
                }
                let cc_iframe_id = document.getElementById('cc-iframe-id')
                let ccRecordingWeb = document.getElementById('cc-recording-web');
                if (requestObj.isLoggedIn) {
                    if (requestObj.tab.active) {
                        Helper.log("User is Logged IN ANd Tab is active", requestObj, requestObj.recordingType)
                        if (requestObj.recordingStatus) {
                            //Remove action btn when recording running
                            let white_overly = document.querySelector("#white-overly");
                            if (white_overly) {
                                white_overly.style.display = "none";
                                if (cc_iframe_id) {
                                    ccRecordingWeb.classList.remove('show-extation');
                                    setTimeout(() => {
                                        cc_iframe_id.remove();
                                    }, 1000)

                                }
                            };

                            Draw.init(true);


                            if (requestObj.type === "updateTimer") {
                                if (cc_iframe_id) {
                                    ccRecordingWeb.classList.remove('show-extation');
                                    setTimeout(() => {
                                        cc_iframe_id.remove();
                                    }, 1000)
                                };
                                let t = requestObj.recordingTime;
                                let h = t.h;
                                let m = (t.m.toString().length < 2) ? `0${t.m}` : t.m;
                                let s = (t.s.toString().length < 2) ? `0${t.s}` : t.s;
                                if (timerElemClass && socialStreamStatus == false) {
                                    timerElemClass.innerHTML = h + ":" + m + ":" + s;
                                    Helper.sendMsgToMain(
                                        "updateTimerMain",
                                        {timeDuration : h + ":" + m + ":" + s},
                                        () => { }
                                    );
                                    Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                                        let advanceSetting = status.advanceSettingStatus;
                                        advanceSetting['recordingStart'] = true;
                                        Helper.setAdvanceSetting(advanceSetting);
                                    });
                                };

                                if (socialStreamStatus == true) {
                                    timerElemClass.style.display = "none";
                                    timerElemClass.innerHTML = "0:00:00";
                                }

                                //Check timer for finish recording
                                if (fde_recording && fde_time_limit && (minuteData(+h, +m, +s) >= fde_time_limit) && (mediaRecorderState == "start")) {
                                    recordingFinishAuto = true;
                                    let finishBtn = document.getElementById("vcc-stop-btn");
                                    if (finishBtn) {
                                        commonConfirmationPopup();
                                        finishBtn.click();
                                    }
                                }
                                //End

                                //add message popup for recording-alert
                                if (fde_recording && fde_time_limit && (minuteData(+h, +m, +s) == (fde_time_limit - getMessageBefore))) {
                                    Helper.sendMsgToBgScript("fde_timer_start");
                                    Helper.getPopupSetting('popupStatus').then((status) => {
                                        let popupStatusObj = status.popupStatus;
                                        if (popupStatusObj['popupType'] == 'open_1') {
                                            htmlMessageView(1);
                                        } else {
                                            htmlMessageView(2);
                                        }
                                        popupStatusObj['popupStatus'] = true;
                                        Helper.setPopupSetting(popupStatusObj);
                                    });
                                    commonConfirmationPopup(1, msgAutoClosePopupHtml);
                                }

                                //check internet and show toster
                                var connection = window.navigator.onLine;
                                if (connection) {
                                    Helper.log(connection, "<===getting internet status222");
                                    let tosterMessageId = document.getElementById("tosterMessageId");
                                    if (tosterMessageId) tosterMessageId.remove();
                                } else {
                                    let msg = 'Connection lost! You are not connected to internet';
                                    noInternetUI('#fff', 'red', msg);
                                }
                                //End

                                return
                            }

                            if (requestObj.type === "socialStream") {
                                socialStreamStatus = requestObj.status;
                                Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                                    let advanceSetting = status.advanceSettingStatus;
                                    advanceSetting['socialStream'] = requestObj.status;
                                    Helper.setAdvanceSetting(advanceSetting);
                                });
                            } //Set stream ui for login couser show/hide for social stream

                            if ([1, 3, 5, 7, 11].indexOf(requestObj.recordingType) !== -1 && requestObj.type == "bg_plan_details") {
                                showActionBtn(requestObj.constraints);
                            }
                            Helper.log("Current tab recording ====> ", requestObj.recordingType, requestObj.recordingWindowId, requestObj.recordingTabId)
                            if ([2, 4, 6, 8, 10, 12].indexOf(requestObj.recordingType) !== -1 && requestObj.recordingWindowId == requestObj.tab.windowId && requestObj.recordingTabId == requestObj.tab.id) {
                                showActionBtn(requestObj.constraints);
                            } else {
                                Helper.log("Current tab recording is not this", requestObj.tab.windowId, requestObj.tab.id)
                            };

                            //Check Ping
                            if (requestObj.type === "ping") {
                                Draw.cleanupCanvas();
                            }
                        }
                        if (mediaRecorderState === "stop") {
                            Draw.cleanupCanvas();
                            if (timerElemClass) {
                                timerElemClass.style.display = "none";
                                timerElemClass.innerHTML = '0:00:00';
                            }
                        }
                    }
                    else if (requestObj.recordingStatus && [2, 4, 6, 8, 10, 12].indexOf(requestObj.recordingType) !== -1) {
                    }
                    else {
                        let ccRecordingBlock = document.querySelector("#cc-recording-block")
                        if (ccRecordingBlock) {
                            //set animation for video frame
                            //ccRecordingBlock.classList.add('video-frame-css');
                            ccRecordingBlock.classList.remove('show-extation');
                            ccRecordingBlock.style.display = "none";
                            if (cc_iframe_id) {
                                ccRecordingWeb.classList.remove('show-extation');
                                setTimeout(() => {
                                    cc_iframe_id.remove();
                                }, 1000)
                            }

                            stopStream();
                            let white_overly = document.querySelector("#white-overly")
                            if (white_overly) white_overly.style.display = "none";
                            //End
                            messageViewHideFun(0);
                        } else {
                            Helper.error("stop_inactive_tab_recording Error ")
                        };

                        let actionMenuItems = document.querySelector('#fde-action-menu-items');//action btn frame id
                        if (actionMenuItems) actionMenuItems.style.display = "none";
                    }

                    if (request.type === "cs_capture_cam_audio") {
                        Helper.log("Content Js Rcvd capture camera msg", request.mediaConstraints);
                        setTimeout(() => {
                            Helper.getCrossStatus().then((status) => {
                                if (status.crossStatus && status.crossStatus.camraFrameType != '3') {
                                    _captureCamAudio(request.mediaConstraints);
                                }
                            }).catch(() => {
                                _captureCamAudio(request.mediaConstraints);
                            })
                            Helper.sendMsgToMain(
                                "fde_camra_Clear_Load_intervel",
                                null,
                                () => { }
                            );
                        }, 500);
                    }

                    if (request.type === "cs_start_recording_timer") {
                        startTimer(request.options);
                    }
                    let vcc_init_btn = document.querySelector("#vcc-init-btn");
                    let vcc_stop_btn = document.querySelector("#vcc-stop-btn");

                    if (request.type === "popup_init_recording") {
                        //Event call for start recording
                        if (vcc_init_btn) vcc_init_btn.click();
                        //Remove action iframe
                        if (cc_iframe_id) {
                            ccRecordingWeb.classList.remove('show-extation');
                            setTimeout(() => {
                                cc_iframe_id.remove();
                            }, 1000)
                        };
                    }



                    if (request.type === "popup_stop_recording") {
                        Helper.log("Popup Recording");
                        if (vcc_stop_btn) vcc_stop_btn.click();
                    }

                    if (request.type === "popup_cancel_recording") {
                        cancelRecordingMethod();
                        shortCutsList(0);
                    }

                    if (request.type === "cs_user_logout") {
                        logout()
                    }

                    if (request.type === "cs_user_logged_in") {
                        showActionBtn(request.recordingStatus);
                        //Load camera UI  first time load 
                        let overlay = document.getElementById('white-overly');
                        if(!gmailViewsId) return;
                        if ((!overlay || (overlay && overlay.style.display == 'none')) && gmailViewsId) {
                            whiteOverlay();
                        };
                        let ccRecordingBlock = document.getElementById("cc-recording-block");
                        if (ccRecordingBlock && ccRecordingBlock.style.display === "none") {
                            hideShowVideoLoder(1);
                            ccRecordingBlock.style.display = "block";
                        }
                    }

                    if (request.type === "get_available_media_devices") {
                        let vidcor_ff_cam = document.querySelector("#vidcor-ff-cam")
                        if (vidcor_ff_cam && vidcor_ff_cam.getAttribute("src") == 'about:blank') {
                            vidcor_ff_cam.src = chrome.runtime.getURL('template/iframe.html');
                            //loader hide
                            hideShowVideoLoder(0);
                        }
                        Helper.log("get_available_media_devices called");
                        setTimeout(() => {
                            sendMsgToIframe("fetch_media_devices")
                        }, 100)

                    }



                    //Check Extesion iframe height-Set
                    if (request.type === "cs_iframe_height") {
                        if (cc_iframe_id && cc_iframe_id.style.height == "485px") {
                            cc_iframe_id.style.height = "615px";
                        } else {
                            if (cc_iframe_id) {
                                cc_iframe_id.style.height = "485px";
                            }
                        }
                    }

                    //close loader popup
                    if (request.type === "cs_close_loader_popup") {
                        var iframeCont = document.getElementById('cc-recording-web');
                        if (iframeCont && document.getElementById('cc-iframe-id')) {
                            iframeCont.style.display = 'none';
                            iframeCont.innerHTML = '';
                            let whiteOverlay = document.querySelector('#white-overly');
                            if (whiteOverlay) {
                                whiteOverlay.parentNode.removeChild(whiteOverlay);
                            }
                        }
                    }
                    //Check live counter/off live counter
                    if (request.type === "click_onLive_tab") {
                        selectedStreamName = request.streamName
                        liveCountdownTimer = true;
                        htmlMessageView(1);
                    };
                    if (request.type === "click_offLive_tab") {
                        selectedStreamName = '';
                        liveCountdownTimer = false;
                        htmlMessageView(2);
                    };

                    //Check oot platform
                    if (request.type === 'cs_pause_ott_platform') {
                        if (document.getElementById('vcc-stop-btn').style.display != 'none') {
                            let pauseId = document.querySelector("#vcc-pause-btn");
                            let resumeId = document.querySelector("#vcc-resume-btn");
                            pauseId.click();
                            setTimeout(() => {
                                if (vcc_init_btn) vcc_init_btn.style.display = "none";
                                if (vcc_stop_btn) vcc_stop_btn.style.display = "inline-block";
                                if (pauseId) pauseId.style.display = "none";
                                if (resumeId) resumeId.style.display = "inline-block";
                            }, 1000);
                        }
                    }
                    //restart recording view
                    if (request.type === 'bg-prev-record-in-progress') {
                        if (vcc_init_btn) vcc_init_btn.style.display = "inline-block";
                        if (vcc_stop_btn) vcc_stop_btn.style.display = "none";
                    }
                    //restart recording view
                    if (request.type === 'bg-force-start-recording') {
                        if (vcc_init_btn) vcc_init_btn.click();
                    }

                    //cancel recording from bg
                    if (request.type === 'bg_cancel_recording') {
                        cancelRecordingMethod();
                        shortCutsList(0);
                    }

                    if (request.type === 'click_recording_btn') {
                        hideShowVideoLoder(1);
                        let vidcorFFImg = document.getElementById("vidcor-ff-img");
                        if(vidcorFFImg) vidcorFFImg.style.display = "none";
                        if (request.camraFrameType == '2') {
                            videoFrameRemoveFun();
                            stopStream();
                        } else if (request.camraFrameType == '3') {
                            stopStream();
                            let ccRecordingBlock = document.getElementById("cc-recording-block");
                            if (ccRecordingBlock) ccRecordingBlock.style.display = "none";
                            let actionMenuItems = document.querySelector('#fde-action-menu-items');//action btn frame id
                            if (actionMenuItems) actionMenuItems.style.display = "none";
                        }
                        else {
                            videoFrameRemoveFun('1');
                        };
                        htmlFramsObj.camraFrameType = request.camraFrameType;
                        Helper.setCrossStatus(htmlFramsObj);
                    }

                } else {
                    Helper.log("User is NOT Logged IN")
                }

                //Close gmail serch option
                if (request.type === 'close_gmail_search') {
                    document.getElementById('cc-gmail-id').remove();
                    let iframeCont = document.getElementById('cc-video-search');
                    if (iframeCont) iframeCont.style.display = "none";
                    gmailViewsId = true;
                }

                //set Timer views intoHTML
                if (request.type === 'fde_timer_set') {
                    let timerUpdate = document.getElementById("timerUpdate");
                    if (timerUpdate) {
                        timerUpdate.innerText = request.timerData;
                    }
                }

                //check and add 2fa login popup
                if (request.type === 'fde-2f-login-token') {
                    Helper.append2FLoginAuth(request.data);
                }

                //check and remove 2fa login popup
                if (request.type === 'fde-finish-googleAuth-popup') {
                    Helper.remove2FLoginAuth();
                }
            }
        });

        //Get plans for tools
        if (request.type === 'bg_plan_details') {
            let penEditor = document.getElementById('cc-pen-editor');
            let vcc_draw_elem = document.querySelector("#vcc-draw-elem");
            let plansDetails = request.plans;


            if (plansDetails) {
                //Drawing Tools "false";
                Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                    shortCutObj = status.advanceSettingStatus;
                }).catch((error) => {
                    console.log(error, "<===Show views and other");
                })

                if (!plansDetails.fde_drawing_tools) {
                    if (penEditor) penEditor.style.display = "none", penEditor.remove();
                    if (vcc_draw_elem) vcc_draw_elem.innerHTML = '', vcc_draw_elem.style.display = 'none';

                    Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                        let shortCutObj = status.advanceSettingStatus;
                        shortCutObj['drawingMouseTools'] = false;
                        Helper.setAdvanceSetting(shortCutObj);
                    }).catch((error) => {
                        console.log(error, "<===Show views and other");
                    })
                }

                //Counter section check
                fde_Recording_timer = !plansDetails.fde_recording_timer
                if (!plansDetails.fde_recording_timer) {
                    if (timerElemClass) {
                        timerElemClass.style.display = "none";
                        timerElemClass.innerHTML = '0:00:00';
                    };
                    Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                        let shortCutObj = status.advanceSettingStatus;
                        shortCutObj['recordingTimer'] = false;
                        Helper.setAdvanceSetting(shortCutObj);
                    }).catch((error) => {
                        console.logo(error, "<===Show views and other");
                    })
                };

                //coundow timer
                fde_countdown_timer = !plansDetails.fde_countdown_timer;

                //time limit for video duration in minute
                fde_time_limit = plansDetails.fde_time_limit ? (+plansDetails.fde_time_limit) / 1000 / 60 : null;

                //video count limit
                fde_video_count_limit = plansDetails.fde_video_count_limit;

                //video duration breakups
                fde_popup_breakups = plansDetails.fde_popup_breakups;

                //stop Recording after 1hr
                fde_recording = !plansDetails.fde_recording;
            }
            //Set for social stream validation
            Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
                let advanceSetting = status.advanceSettingStatus;
                if (advanceSetting && advanceSetting.hasOwnProperty('socialStream')) {
                    socialStreamStatus = advanceSetting['socialStream'];
                }
            });
            //Check tab changes and error handling

            setTimeout(() => {
                if (tabChangesStatus) {
                    Helper.sendMsgToBgScript("fde_tab_changes_message", { status: true });
                } else {
                    Helper.sendMsgToBgScript("fde_tab_changes_message", { status: false });
                }
            }, 1500);

            //message popup handling
            Helper.getPopupSetting('popupStatus').then((status) => {
                let popupStatusObj = status.popupStatus;
                if (popupStatusObj['popupStatus'] == true && popupStatusObj['popupType'] == 'open_1') {
                    htmlMessageView(1);
                    commonConfirmationPopup(1, msgAutoClosePopupHtml);
                } else if (popupStatusObj['popupStatus'] == true && popupStatusObj['popupType'] == 'open_2') {
                    htmlMessageView(2);
                    commonConfirmationPopup(1, msgAutoClosePopupHtml);
                } else {
                    commonConfirmationPopup();
                }
            }).catch(() => {
                commonConfirmationPopup();
            });
        }

        //tab changes only
        if (request.type === 'bg_tab_change') {
            if (["start", "pause", "resume", "recording"].indexOf(mediaRecorderState) > -1) {
                Helper.getChrUserProfile().then((response) => {
                    let userProfileData = response.vcc_chrome_userprofile;
                    let branding = userProfileData['branding'] ? userProfileData['branding'] : null;
                    updateBrandingLogoFun(branding);
                    hideShowVideoLoder(1); //Loader true
                }).catch((error) => {
                    updateBrandingLogoFun();
                })
            } else {
                updateBrandingLogoFun();
            };
        }

        //check auto finish stream and no redirection
        Helper.log("Initial Msg ===> ", request);
        if (request.type === "streamStopOpenPopup" && recordingFinishAuto == true) {
            htmlMessageView(3);
            commonConfirmationPopup(1, msgAutoClosePopupHtml);
        }

        if (request.type === 'vcc-compose-mail' && window.location.href.indexOf('outlook.live.com/mail/') > -1) {
            let videoIds = request.videoIds;
            let fluvidVideoUrl = '';
            for (let m = 0; m < videoIds.length; m++) {
                fluvidVideoUrl += `
                    <img src="${request.thumbnails[m]}" style="width: 300px;">
                    <br>
                    <span>Checkout my Fluvid recording:  </span> 
                    <a href="https://fluvid.com/videos/detail/${videoIds[m]}">
                        https://fluvid.com/videos/detail/${videoIds[m]}
                    </a>
                    <br><br><br>`;
            }

            let outLookMessageArea = document.querySelectorAll('[aria-label="Message body"]');
            fluvidVideoUrl = `<div>${fluvidVideoUrl}</div>`;
            if (outLookMessageArea) outLookMessageArea[0].insertAdjacentHTML('afterbegin', fluvidVideoUrl);

            let cc_gmail_id = document.getElementById('cc-gmail-id');
            let iframeCont = document.getElementById('cc-video-search');
            if (cc_gmail_id) {
                cc_gmail_id.remove();
                if (iframeCont) iframeCont.style.display = "none";
            }
        }

        sendResponse(!0)
    };

    let htmlMessageView = (status) => {
        if (status == 1) {
            msgAutoClosePopupHtml = `<div class="fde-popup">
                <div class="fde-popup-container">
                    <p>Your stream will automatically end in <span id="timerUpdate">05:00</span> minutes.
                        <br>
                        Upgrade now to run and manage streams without any limitations.</p>
                    <ul class="fde-buttons">
                        <li id="limitDismiss">Dismiss</li>
                        <li id="limitUpgrade">Upgrade</li>
                    </ul> 
                </div>
            </div>`; // message popup with timer
        }
        else if (status == 2) {
            msgAutoClosePopupHtml = `<div class="fde-popup">
                <div class="fde-popup-container">
                    <p>Your recording will automatically end in <span id="timerUpdate">05:00</span> minutes.
                        <br>
                        Upgrade now to create recordings without any limitations. </p>
                    <ul class="fde-buttons">
                        <li id="limitDismiss">Dismiss</li>
                        <li id="limitUpgrade">Upgrade</li>
                    </ul> 
                </div>
            </div>`; // message popup with timer
        }
        else if (status == 3) {
            msgAutoClosePopupHtml = `<div class="fde-popup">
                <div class="fde-popup-container">
                    <h4 style="margin-top: 0px;">We know you wanted to stream more!</h4>
                    <p>Your stream reached the 60 minutes duration limit for Basic plan users.
                    <br>
                    Upgrade Now to Fluvid Pro to remove any stream limitations and access exclusive features.</p>
                    <ul class="fde-buttons">
                        <li id="limitDismiss">Dismiss</li>
                        <li id="limitUpgrade">Upgrade</li>
                    </ul> 
                </div>
            </div>`; // message popup with timer
        }
    }

    //Get data for advance control option and set into video iframe
    let advanceOptionVcc = () => {
        //Shortcut key override of advance option
        Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
            let advSettingGetOption = status.advanceSettingStatus;
            //Timer check
            if (typeof advSettingGetOption == 'object' && advSettingGetOption !== null) {
                let timerElemId = document.querySelector("#vcc-timer-elem");
                if (timerElemId && advSettingGetOption['recordingTimer']) {
                    timerElemId.style.display = "block";
                } else {
                    timerElemId.style.display = "none";
                }
                //End

                //Tools hide/show
                let vcc_draw_elem = document.querySelector("#vcc-draw-elem");
                if (!advSettingGetOption['drawingMouseTools']) {
                    if (vcc_draw_elem) vcc_draw_elem.style.display = "none";
                } else {
                    if (vcc_draw_elem && mediaRecorderState != "stop") vcc_draw_elem.style.display = "block";
                }

                //Control Menu
                let fullActionBtn = document.getElementById("fullActionBtn");
                let showMenuItem = document.getElementById("fde-show-tool");
                if (fullActionBtn) {
                    if (advSettingGetOption['controlMenu']) {
                        fullActionBtn.style.display = 'block';
                        showMenuItem.style.display = 'none';
                    } else {
                        fullActionBtn.style.display = 'none';
                        showMenuItem.style.display = 'block';
                    }
                }

                //cam zoom option
                if (advSettingGetOption && advSettingGetOption['camZoom']) {
                    const camZoom1Btn = document.querySelector(".vcc-cam-zoom1");
                    const camZoom2Btn = document.querySelector(".vcc-cam-zoom2");
                    const camZoom3Btn = document.querySelector(".vcc-cam-zoom3");
                    if (advSettingGetOption['camZoom'] == 2) {
                        if (camZoom2Btn) zoomF1F2F3Option(2);
                    } else if (advSettingGetOption['camZoom'] == 3) {
                        if (camZoom3Btn) zoomF1F2F3Option(3);
                    } else {
                        if (camZoom1Btn) zoomF1F2F3Option(1);
                    }
                } else {
                    const camZoom1Btn = document.querySelector(".vcc-cam-zoom1");
                    if (camZoom1Btn) zoomF1F2F3Option(1);
                };

                //menu open close views
                let drawingToolsOpen = document.getElementById("drawing-tools-open");
                let drawingToolsClose = document.getElementById("drawing-tools-close");
                let drawingToolsList = document.getElementById("drawing-tools-list");
                if (advSettingGetOption && advSettingGetOption['toolMenu']) {
                    if (advSettingGetOption['toolMenu'] == 'open') {
                        if (drawingToolsClose) drawingToolsClose.style.display = "block";
                        if (drawingToolsOpen) drawingToolsOpen.style.display = "none";
                        if (drawingToolsList) drawingToolsList.style.display = "grid";
                    } else if (advSettingGetOption['toolMenu'] == 'close') {
                        if (drawingToolsClose) drawingToolsClose.style.display = "none";
                        if (drawingToolsOpen) drawingToolsOpen.style.display = "block";
                        if (drawingToolsList) drawingToolsList.style.display = "none";
                    }
                }

                //Set videoFrameUIType
                if (advSettingGetOption && advSettingGetOption['videoFrameUIType']) {
                    if (advSettingGetOption['videoFrameUIType'] == 0) {
                        setcircleSquare(0);
                    } else if (advSettingGetOption['videoFrameUIType'] == 1) {
                        setcircleSquare(1);
                    }
                } else {
                    setcircleSquare(0);
                }


                //Camra frame Position
                if (advSettingGetOption && (advSettingGetOption['camFrameBottom'] || advSettingGetOption['camFrameLeft'])) {
                    let ccRecordingBlock = document.querySelector("#cc-recording-block");
                    if (ccRecordingBlock) {
                        ccRecordingBlock.style.bottom = advSettingGetOption['camFrameBottom'];
                        ccRecordingBlock.style.left = advSettingGetOption['camFrameLeft'];
                    }
                }

                //Action Menu Btn popup position
                if (advSettingGetOption && (advSettingGetOption['menuFrameTop'] || advSettingGetOption['menuFrameLeft'])) {
                    let fdeActionMenuItems = document.querySelector("#fde-action-menu-items");
                    if (fdeActionMenuItems) {
                        fdeActionMenuItems.style.top = advSettingGetOption['menuFrameTop'];
                        fdeActionMenuItems.style.left = advSettingGetOption['menuFrameLeft'];
                    }
                }

                //Pen tool click
                if (advSettingGetOption && advSettingGetOption['canvasTool'] == 'pen') {
                    // const element = document.querySelector("#vcc-draw-active");
                    // let isClass = element.classList.contains("active");
                    let int = setInterval(() => {
                        if (document.querySelector('#vcc-draw-pen')) {
                            clearInterval(int);
                            setTimeout(()=>{
                                Draw.penActionFun();
                                //Pen tool editor 
                                let penEditor = document.getElementById('cc-pen-editor');
                                if(advSettingGetOption['penMenuOption'] && advSettingGetOption['penMenuOption'] == 'open'){
                                    if (penEditor) {
                                        penEditor.style.display = 'flex';
                                    };
                                } else {
                                    if(penEditor){
                                        penEditor.style.display = 'none';
                                    };
                                }
                            }, 1000);
                        };
                    }, 500);

                    document.body.classList.add("fde-pen-ico");
                }
                

                //eraser tool click
                if (advSettingGetOption && advSettingGetOption['canvasTool'] == 'eraser') {
                    setTimeout(() => {
                        Draw.eraserActionFun();
                    }, 1000);
                }
                //enableClick tool click
                if (advSettingGetOption && advSettingGetOption['canvasTool'] == 'enableClick') {
                    setTimeout(() => {
                        Draw.enableClickElem();
                    }, 1000);
                }
                //highlighter tool click
                if (advSettingGetOption && advSettingGetOption['canvasTool'] == 'highlighter') {
                    setTimeout(() => {
                        Draw.highlighterActionFun();
                    }, 1000);
                }
                //focusMouse tool click
                if (advSettingGetOption && advSettingGetOption['canvasTool'] == 'focusMouse') {
                    setTimeout(() => {
                        Draw.focusActionFun();
                    }, 1000);
                }
            }

            //End
        }).catch(error => {
            console.log(error, '<==Error advanceSettingStatus');
        });

    }

    //set video frame circle/square function
    let setcircleSquare = (getType) => {
        const fdeRountClick = document.querySelector("#fde-rount-click");
        const fdeSquareClick = document.getElementById("fde-square-click");
        const vccVideoFrame = document.getElementById('vcc-video-frame');
        if (getType == 0) {
            if (vccVideoFrame) vccVideoFrame.classList.add('cc-round');
            if (fdeRountClick) fdeRountClick.classList.add("act");
            if (fdeSquareClick) fdeSquareClick.classList.remove("act");
            if (vccVideoFrame) vccVideoFrame.parentElement.classList.add("cc-round-shadow");
        }
        else if (getType == 1) {
            if (vccVideoFrame) vccVideoFrame.classList.remove('cc-round');
            if (fdeRountClick) fdeRountClick.classList.remove("act");
            if (fdeSquareClick) fdeSquareClick.classList.add("act");
            if (vccVideoFrame) vccVideoFrame.parentElement.classList.remove("cc-round-shadow");
        }

    }

    let stopStream = () => {
        let vidcor_ff_cam = document.querySelector("#vidcor-ff-cam")
        if (vidcor_ff_cam && vidcor_ff_cam.getAttribute("src") !== 'about:blank') {
            vidcor_ff_cam.src = 'about:blank';
        };
        sendMsgToIframe("vcc_stop_stream");
    };

    let vidcorContainer = document.getElementById("vidcor-container");
    if (!vidcorContainer) {
        appendVidcorContainer()
    };

    //Check for google  slider button click and full width 100vh
    if (document.getElementById('punch-start-presentation-left')) {
        document.getElementById('punch-start-presentation-left').addEventListener('click', () => {
            // document.getElementById('vidcor-container').remove();
            setTimeout(() => {
                appendVidcorContainer();
            }, 1000);
        })
    }
    //End

    chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
        listners(request, sender, sendResponse)
    });

    // This fucntion control the buttons show/hide according to recording status
    let controlBtns = (status = null) => {
        var intervalCounter = setInterval(function () {
            if (document.querySelector("#vidcor-ff-cam")) document.querySelector("#vidcor-ff-cam").classList.remove("flicp180");
            var isFFCamTemplateRendered = document.querySelector("#vcc-ffcam-container");
            if (isFFCamTemplateRendered) {
                clearInterval(intervalCounter);
                advanceOptionVcc();
                let whiteOverly = document.querySelector("#white-overly");
                if (whiteOverly) whiteOverly.style.display = "none";

                if (status === "start") {
                    document.querySelector("#vcc-init-btn").style.display = "none";
                    document.querySelector("#vcc-stop-btn").style.display = "inline-block";
                    document.querySelector("#vcc-pause-btn").style.display = "inline-block";
                    document.querySelector("#vcc-resume-btn").style.display = "none";
                    messageViewHideFun(0);
                }
                else if (status === "pause") {
                    let resumeRecording = document.querySelector("#vcc-resume-btn");
                    document.querySelector("#vcc-init-btn").style.display = "none";
                    document.querySelector("#vcc-stop-btn").style.display = "inline-block";
                    document.querySelector("#vcc-pause-btn").style.display = "none";
                    resumeRecording.style.display = "inline-block";
                    Helper.getCrossStatus().then((status) => {
                        if (status.crossStatus && status.crossStatus.camraFrameType != '3') {
                            messageViewHideFun(1);
                        }
                    });
                }
                else if (status === "resume") {
                    document.querySelector("#vcc-init-btn").style.display = "none";
                    document.querySelector("#vcc-stop-btn").style.display = "inline-block";
                    document.querySelector("#vcc-pause-btn").style.display = "inline-block";
                    document.querySelector("#vcc-resume-btn").style.display = "none";
                    messageViewHideFun(0);
                } else {
                    Helper.log("Recording Status default case = ", status);
                    document.querySelector("#vcc-init-btn").style.display = "inline-block";
                    document.querySelector("#vcc-stop-btn").style.display = "none";
                    document.querySelector("#vcc-pause-btn").style.display = "inline-block";
                    document.querySelector("#vcc-resume-btn").style.display = "none";
                    defaultMessageFun();
                }
                document.querySelector("#vcc-cancel-btn").style.display = "inline-block";
            };

            getCrossStatusData();
        }, 0);
    };

    getCrossStatusData = () => {
        //Check click event validation frames validation
        Helper.getCrossStatus().then((status) => {
            //Check camra fram
            let cameraContainer = document.querySelector(".cc-ffcam-view-wrap");
            let showCameraBtn = document.querySelector("#vcc-cam-setting-btn");
            let hideCameraBtn = document.querySelector("#vcc-cam-hide-setting-btn");
            let ccRecordingBlock = document.getElementById("cc-recording-block");
            let actionMenuItems = document.querySelector('#fde-action-menu-items');//action btn frame id
            if (status.crossStatus && status.crossStatus.camraFrameType == '1') {
                if (ccRecordingBlock) ccRecordingBlock.style.display = "block";
                if (actionMenuItems) actionMenuItems.style.display = "inline-flex";
                if(status.crossStatus.camraIconType == "show"){
                    cameraContainer.style.display = "inline-block";
                    showCameraBtn.style.display = "none";
                    hideCameraBtn.style.display = "inline-block";
                } else if(status.crossStatus.camraIconType == "hide"){
                    cameraContainer.style.display = "none";
                    showCameraBtn.style.display = "inline-block";
                    hideCameraBtn.style.display = "none";
                }
            } else if (status.crossStatus && status.crossStatus.camraFrameType == '3') {
                if (ccRecordingBlock) ccRecordingBlock.style.display = "none";
                if (actionMenuItems) actionMenuItems.style.display = "none";
            } else if (status.crossStatus && status.crossStatus.camraFrameType == '2') {
                if (ccRecordingBlock) ccRecordingBlock.style.display = "none";
                if (actionMenuItems) actionMenuItems.style.display = "inline-flex";
                cameraContainer.style.display = "none";
                showCameraBtn.style.display = "none";
                hideCameraBtn.style.display = "none";
                let camSettingBtn = document.getElementById("vcc-cam-setting-btn");
                if (camSettingBtn && camSettingBtn.style.display != "none") camSettingBtn.style.display = "none";
            }

            //Check flip/mirror camera
            let ffcam_iframe_container = document.querySelector(".cc-ffcam-iframe-container");
            if (ffcam_iframe_container) {
                if (status.crossStatus && status.crossStatus.hasOwnProperty('flipFrame') && status.crossStatus.flipFrame === true) {
                    ffcam_iframe_container.classList.add("flicp180");
                } else if (status.crossStatus && status.crossStatus.hasOwnProperty('flipFrame') && status.crossStatus.flipFrame === false) {
                    ffcam_iframe_container.classList.remove("flicp180");
                } else {
                    ffcam_iframe_container.classList.remove("flicp180");
                };
            };

        });
    }

    //Shortcut for action btn and other function call
    let shortCutsList = (status) => {
        //Shortcut key override of advance option
        var shortcutGetOption = {};
        let shortcutType = 0;
        //Get shortcut saved data for shortcuts
        Helper.getAdvanceSetting('advanceSettingStatus').then((status) => {
            shortcutGetOption = status.advanceSettingStatus;
        }).catch(error => {
            console.log(error, '<==advanceSettingStatus From shortcut list');
        });
        //Shrtcuts call from here
        document.onkeyup = function (event) {
            event = (event || window.event);
            let pressKey = event.key.toLowerCase();

            //Start Recording: [Alt] + [s];
            if (event.altKey && pressKey == 's' && (status == 1 || status == 2)) {
                let initItnId = document.getElementById("vcc-init-btn");
                if (initItnId) {
                    initItnId.click();
                }
            }

            //Finish Recording: [Alt] + [w]
            else if (event.altKey && pressKey == 'w' && (status == 1 || status == 2)) {
                let stopBtnId = document.getElementById("vcc-stop-btn");
                if (stopBtnId) {
                    stopBtnId.click();
                }
            }

            //Cancel Recording: [Alt] + [q]
            else if (event.altKey && pressKey == 'q' && (status == 1 || status == 2)) {
                let cancelBtn = document.getElementById("vcc-cancel-btn");
                if (cancelBtn) {
                    cancelBtn.click();
                }
            }

            //Clear Paint: [Alt] + [z]
            else if (event.altKey && pressKey == 'z' && status == 2) {
                if (shortcutGetOption['drawingMouseTools']) {
                    document.getElementById("vcc-clear-draw").click();
                }
                shortcutType = 1;
            }

            //Hide/Show Recording Timer: [Alt] + [t]
            else if (event.altKey && pressKey == 't' && status == 2) {
                let timer = document.getElementById('vcc-timer-elem');
                if (timer && timer.style.display != 'none') {
                    timer.style.display = 'none';
                    shortcutGetOption['recordingTimer'] = false;
                } else {
                    if (timer) {
                        timer.style.display = 'block';
                        shortcutGetOption['recordingTimer'] = true;
                    }
                }
                shortcutType = 1;
                Helper.setAdvanceSetting(shortcutGetObj); //Set shortcut fun
            };
        }
        //End
    };

    function showActionBtn(constraints = null) {
        Helper.getRecordingStatus().then((status) => {
            Helper.log("Recording Status on page refresh", status, constraints);
            status = status.recordingStatus || 'stop';
            if (mediaRecorderState === "start" || mediaRecorderState === "pause") {
                if (!constraints) {
                    constraints = { video: !0, audio: !1 }
                } else {
                    constraints.audio = !1
                }
                let ccRecordingBlock = document.getElementById("cc-recording-block");
                if (ccRecordingBlock && ccRecordingBlock.style.display === 'none') {
                    _captureCamAudio(constraints);
                }
                controlBtns(status);
            }
        });

        //popupStatusLocal('action');//check html popup open/close


        shortCutsList(2);
    };

    // This messages listen messages from iframe
    function receiveMessage(event) {
        let msg = Helper.parseJSON(event.data);
        if (msg && msg.hasOwnProperty("msg") && msg.msg) {
            switch (msg.msg) {
                case "vcc_available_media":
                    Helper.sendMsgToMain("main_available_media_devices", { devices: msg.availableTracks })
                    break;
                case "cs_show_cam_recording":
                    _runWebCamRecordingOnScreen(["video"]);
                    break;
                case "cs_show_profile_pic":
                    _runWebCamRecordingOnScreen([]);
                    break;
                case "ff-cam-iframe-loaded":
                    Helper.sendMsgToBgScript("ping_background_js", {}, () => {
                    })
                    break;
                case "video_loader_none":
                    setTimeout(()=>{
                        hideShowVideoLoder(0);
                    }, 500);


            }
        }
    }

    window.addEventListener("message", receiveMessage, !1);

    //Click jira fluvid button action
    let openPopupIfFunCall = (btn_type) => { //1 = jira, 2 = meet, 3=zoom
        if (document.getElementById("vcc-jira-btn-id")) {
            document.getElementById("vcc-jira-btn-id").addEventListener('click', () => {
                let fluTooltip = document.getElementsByClassName("flu-tooltip");
                if (fluTooltip) fluTooltip[0].style.display = 'none';
                clearTimeout(tooltipInter);
                appendRecordAction();
                if (btn_type == 2 || btn_type == 3) {
                    setTimeout(() => {
                        Helper.sendMsgToMain("click_screen_only", {}, () => { });
                    }, 1000);
                };
                if(btn_type == 1) Helper.setEventActionFun('initiator', 'jira');
                if(btn_type == 2) Helper.setEventActionFun('initiator', 'gMeet');
                if(btn_type == 3) Helper.setEventActionFun('initiator', 'zoom');
            });
        };
    }


    return { shortCutsList: shortCutsList, whiteOverlay: whiteOverlay, startTimer: startTimer, cancelRecordingMethod: cancelRecordingMethod, startRecordingMethod: startRecordingMethod, advanceOptionVcc: advanceOptionVcc }
};

// Used to remove the events binded with camera container
function cleanup() {
    if (document.querySelector("#vidcor-container")) {
        document.querySelector("#vidcor-container").remove();
    }
    //window.removeEventListener('message', receiveMessage, !1);
}

// Used to load the content js once
function myMain(recordingState = "stop") {
    var jsInitChecktimer = setInterval(checkForJS_Finish, 100);

    function checkForJS_Finish() {
        Helper.log("typeof isFileLoaded", typeof isFileLoaded, isFileLoaded)
        if (document.querySelector("body")) {
            clearInterval(jsInitChecktimer);
            contentJs(recordingState)
        } else {
            Helper.log("Content Script already loaded");
            //clearInterval(jsInitChecktimer);
        }
    }
}

//add gmail search box
let appendGmailVideoSearch = () => {
    Helper.sendMsgToBgScript("is_user_logged_for_gmail", {}, () => { });
    let iframeCont = document.getElementById('cc-video-search');
    let iframe3 = document.createElement('iframe');
    iframe3.src = "chrome-extension://hfadalcgppcbffdnichplalnmhjbabbm/template/gmail-search.html";
    iframe3.id = 'cc-gmail-id';
    iframe3.className = 'vcc-iframe-css';
    iframe3.setAttribute("allowfullscreen", true);
    iframe3.setAttribute("frameBorder", "0");
    iframe3.style.height = "500px";
    iframe3.style.width = "800px"
    iframe3.style.marginTop = '5%';
    iframe3.style.marginLeft = '20%';
    iframe3.style.visibility = 'hidden';
    if (!document.getElementById('cc-gmail-id')) {
        iframeCont.style.display = 'block';
        iframeCont.appendChild(iframe3);
    }
    iframe3.style.visibility = 'visible';
}

//Call gmail page loade and other functionality
try {
    let url = window.location.href;
    if (url.indexOf('https://mail.google.com') > -1) {
        InboxSDK.load('2', 'sdk_fluvid_c1b034722d').then(function (sdk) {
            // the SDK has been loaded, now do something with it!
            sdk.Compose.registerComposeViewHandler(function (composeView) {
                // a compose view has come into existence, do something with it!
                composeView.addButton({
                    title: "Create and Insert Fluvid videos",
                    iconUrl: chrome.extension.getURL('images/icon16.png'),
                    onClick: function (event) {
                        gmailViewsId = false;
                        appendGmailVideoSearch();
                        let IsComposeView = 0;
                        chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
                            if (request.type === 'vcc-compose-mail') {
                                IsComposeView++;
                                if (IsComposeView === 1) {
                                    let videoIds = request.videoIds;
                                    let fluvidVideoUrl = '';
                                    for (let m = 0; m < videoIds.length; m++) {
                                        fluvidVideoUrl += `
                                    <img src="${request.thumbnails[m]}">
                                    <br>
                                    <span>Checkout my Fluvid recording:  </span> 
                                    <a href="https://fluvid.com/videos/detail/${videoIds[m]}">
                                        https://fluvid.com/videos/detail/${videoIds[m]}
                                    </a>
                                    <br><br><br>`;
                                    }
                                    event.composeView.insertHTMLIntoBodyAtCursor(fluvidVideoUrl);
                                    let cc_gmail_id = document.getElementById('cc-gmail-id');
                                    let iframeCont = document.getElementById('cc-video-search');
                                    if (cc_gmail_id) {
                                        cc_gmail_id.remove();
                                        if (iframeCont) iframeCont.style.display = "none";

                                    }
                                }

                            }
                        });
                    },
                });

            });

        });
    }
}
catch (err) {
    console.log(err, '<==Error into gmail login')
}
