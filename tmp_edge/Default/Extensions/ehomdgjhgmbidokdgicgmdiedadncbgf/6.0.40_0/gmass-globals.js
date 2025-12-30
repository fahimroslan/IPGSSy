// global namespace for all functionality
window.GMass = window.GMass || { };

window.GMass.selectMany = function(el, opts)
{
	opts = opts || {};
	opts.placeholder = opts.placeholder || 'Select';
	opts.selectAllLabel = opts.selectAllLabel || 'Select/Remove All';

	el = $(el);
	el.hide();

	// if already wrapped, remove the old one and recreate
	if (el[0].wrap)
		el[0].wrap.remove();
	
	var wrap = $(`
		<div class="gmass-select-many">
			<div class="gmass-select-many-list">
			<input type="text"></input>
			<ul>
				<li>
					<label class="g2_checkbox ">
						<input type=checkbox class="select-all">
						<span>${opts.selectAllLabel}</span>
					<label>
				</li>
			</ul>
			</div>
		</div>`);
	
	el.after(wrap);

	// remember the wrap for this select so we can destroy it later
	el[0].wrap = wrap;


	var inputbox = '';
	if (opts.setValues) {
		inputbox = `
			<div>
				<input type="number" class="nospinner" min="1" max="2000" style="width:2.1em; padding:0; height:1.75em; text-align:center;" placeholder="num" />
			</div>`;

	}
	
	var ul = wrap.find('ul');
	el.find('option').each(function() {
		var op = $(this);
		var li = $(`
			<li>
				<div style="display:flex; width:100%; justify-content: space-between">
					<label class="g2_checkbox">
						<input type=checkbox value="${this.value}" ${this.selected ? 'checked' : ''}>
						<span>${(this.innerText.includes('PR:') ? '<B>' + this.innerText.replace('PR:', '') + '</B>' : this.innerText)}</span>
					</label>
					${inputbox}
				</div>
			</li>`);

		// copy group attribute
		if (this.hasAttribute('data-group'))
			li.attr('data-group', 'true');
		li.attr('data-value', this.value);

		if (opts.setValues) {
			var v = op.data('value');
			li.find('[type="number"]')
				.val(v)
				.on('change', function() {
					op.attr('data-value', this.value);
				});
		}

		ul.append(li);
	});

	var label = $('<div class="select-many-label"><span></span></div>');
	label.append('<span class="select-arrow"></span>');
	
	wrap.prepend(label);
	

	
	var items = wrap.find('li:gt(0):not([data-group])');
	items.on('click', function () {
		if (opts.onitemclick)
			opts.onitemclick($(this).find(':checkbox')[0], wrap);

		updateLabel();
	});

	var groups = wrap.find('li[data-group]');
	groups.on('click', function () {
		if (opts.ongroupclick)
			opts.ongroupclick($(this).find(':checkbox')[0], wrap);
		updateLabel();
	});

	wrap.find('.select-all').on('click', function () {
		groups.find(':checkbox:visible').prop('checked', false);
		items.find(':checkbox:visible').prop('checked', this.checked);
		updateLabel();
	});
	
	wrap.find('.select-many-label').on('click', function() {
		wrap.toggleClass('open');
		wrap.find('input[type="text"]').val('').trigger('keyup');
		clearInterval(opts.onDropDownStopInterval);
	});
	
	wrap.find('input[type="text"]').on('keyup', function() {
		
		wrap.find('.select-all').prop('checked', false);
			
		var q =  this.value.toLowerCase();
		if (q == '') {
			items.show();
		}
		else {
			items.each(function() {
				var text = $(this).text();
				$(this).toggle(text.toLowerCase().indexOf(q) >= 0);
			});
		}
		
	});
	
	function updateLabel()
	{
		var label = wrap.find('.select-many-label span').first();
		var arr = [];
		el.find('option').prop('selected', false);
		items.find(':checked').each(function() {
			var val = this.value;
			el.find('option[value="' + val + '"]').prop('selected', true);
			arr.push($(this).parent().text().trim());
		});

		if (arr.length == items.length) {
			// all items are selected
			wrap.find('.select-all').prop('checked', true);
		} else {
			wrap.find('.select-all').prop('checked', false);
		}
		
		if (arr.length == 0) {
			label.text(opts.placeholder);	
			label.removeClass('has-selections');
		}
		else {
			if (opts.selectedText)
				label.text(opts.selectedText + ' (' + arr.length + ')');
			else
				label.text(arr.join(', '));
			label.addClass('has-selections');
		}

		//ajay adding so i have a change event i can listen to anytime a checkbox is checked/unchecked
		el.trigger('change');			
	}
	
	updateLabel();
	
	$(document).on('click', function(e) {
		if (!wrap[0].contains(e.target) && !wrap[0].contains(document. activeElement))
			wrap.removeClass('open');

		//console.log('a clicked');
	});
}


window.GMass.confirm = function(opts) {

	var wrap = $('<div></div>')
		.addClass('gmass-overlay-box-wrap');

	var dialog = $('<div></div>')
		.addClass('gmass-dialog-box');

	if (opts.title) {
		var title = $('<div></div>')
			.addClass('gmass-dialog-box-title')
			.html('<div class="gmass-dialog-close"></div>' + opts.title);

		dialog.append(title);
	}

	if (opts.message) {
		var msg = $('<div></div>')
			.addClass('gmass-dialog-box-message')
			.html(opts.message);

		dialog.append(msg);
	}


	var buttons = $('<div></div>')
		.addClass('gmass-dialog-box-buttons');
	dialog.append(buttons);


	for(var i = 0; i < opts.buttons.length; i++) {
		var btn = $('<button></button>')
			.addClass(opts.buttons[i].class)
			.html(opts.buttons[i].html);


		btn.data('result', opts.buttons[i].result);
		buttons.append(btn);
	}

	dialog.find('button, .gmass-dialog-close').on('click', function(e) {
		e.preventDefault();
		var result = $(this).data('result');
		opts.callback(result);
		GMass.cancelOverlay();
	});


	wrap.append(dialog);

	var appendTo = opts.appendTo || document.body;
	if (typeof appendTo == 'string')
		appendTo = $(appendTo);

	$(appendTo).append(wrap);
	setTimeout(function() { 	wrap.addClass('open'); }, 1);

}

window.GMass.cancelOverlay = function() {
	$('.gmass-overlay-box-wrap').removeClass('open');
	setTimeout(function() { $('.gmass-overlay-box-wrap').remove(); }, 180);
}

window.GMass.getTimeZone = function(str) {
	var re = /(\+|\-)\d{1,2}:\d{2}/;
	var m = re.exec(str);
	if (m)
		return m[0];
	else
		return null;
}

window.GMass.parseDate = function (str, ignoreTimeZone) {


	// ensure space preceeds am/pm
	str = str.replace(/(am|pm)/, ' $1');

	if (ignoreTimeZone)
	{
		var tz = window.GMass.getTimeZone(str);
		if (tz)
			str = str.replace(tz, '');
	}

	if (!isNaN(Date.parse(new Date(str))))
	{
		return new Date(str);
	}

	console.log('invalid date: ' + str);
	// date was invalid. use now instead
	return new Date();
}

window.GMass.toLocalTime = function(str) {
		var d = new Date('1/1/2000 ' + str);
		var offset = new Date().getTimezoneOffset();
		d.setMinutes(d.getMinutes() - offset);
		var hour = d.getHours();
		var ampm = 'am';
		if (hour > 12) {
			hour -= 12;
			ampm = 'pm';
		}
		var minutes = d.getMinutes();
		if (minutes < 10) minutes = '0' + minutes;
		return hour + ':' + minutes + ampm;
}

window.GMass.createCalendarControl = function (opts) {
	opts.minDate = opts.minDate || new Date(2000, 0, 0);
	opts.maxDate = opts.maxDate || new Date(2100, 0, 0);
	opts.date = opts.date || new Date();

	if (typeof (opts.minDate) == 'string')
		opts.minDate = GMass.parseDate(opts.minDate);
	if (typeof (opts.maxDate) == 'string')
		opts.maxDate = GMass.parseDate(opts.maxDate);
	if (typeof (opts.date) == 'string')
		opts.date = GMass.parseDate(opts.date);


	var date = opts.date;
	var selectedDate = date;
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


	function getDaysInMonth(month, year) {
		return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}
	function isLeapYear(year) {
		return year % 100 === 0 ? year % 400 === 0 ? true : false : year % 4 === 0;
	}
	function getWeekDay(date, month, year) {
		return new Date(year, month, date).getDay();
	}
	function formatDate(date) {
		return (1 + date.getMonth()) + '/' + date.getDate() + '/' + date.getFullYear();
	}
	function formatTimezone(date) {
		var offset = -1 * date.getTimezoneOffset();
		if (offset == 0)
			return '';
		var hours = parseInt(offset / 60);
		var minutes = (offset - 60 * hours).toString();
		if (minutes.length < 2) minutes = '0' + minutes;
		return ' ' + hours + ':' + minutes;
	}

	var tbl = $('<table></table>')
		.addClass('gmass-calendar');
	tbl.append('<thead></thead>');
	tbl.append('<tbody></tbody>');

	// add month/year line
	var s = [];
	s.push('<tr class="gmass-calendar-month-year">');
	s.push('<td colspan=7>');

	s.push('<div>');

	s.push('<button class="change-month" data-dir="-1">&lt;</button>');
	s.push('<span class="month-name">March 2020</span>');
	s.push('<button class="change-month" data-dir="1">&gt;</button>');

	s.push('</div>');

	s.push('</td>');
	s.push('</tr>');
	tbl.find('thead').append(s.join(''));


	// add day labels
	s = [];
	s.push('<tr class="gmass-calendar-days">');
	for(var i = 0; i < days.length; i++) {
		s.push('<th>' + days[i] + '</th>');
	}
	s.push('</tr>');
	tbl.find('thead').append(s.join(''));


	function rebuildCalendar() {
		tbl.data('date', formatDate(selectedDate));
		tbl.data('timezone', opts.timezone || formatTimezone(selectedDate));

		var startWeekDay = getWeekDay(1, date.getMonth(), date.getFullYear());
		var firstDayOfMonth = startWeekDay;
		var daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear());

		// set the month/year label
		tbl.find('.month-name').html(months[date.getMonth()] + ' ' + date.getFullYear());

		var s = [];
		s.push('<tr>');
		var rows = 0;
		var index = firstDayOfMonth;
		var d = new Date(date.getFullYear(), date.getMonth(), 1);
		var minDateOnly = opts.minDate;
		minDateOnly.setHours(0,0,0,0);
		for(var day = 0; day < daysInMonth; day++) {
			var dayDate = formatDate(d);
			
			var isSelected = formatDate(d) == formatDate(selectedDate);
			var isDisabled = d < minDateOnly || d > opts.maxDate;

			if (day == 0) {
				// pad to first day of month
				for(var j = 0; j < firstDayOfMonth; j++) {
						s.push('<td></td>');
					}
			}

			s.push('<td><span data-date="' + dayDate + '" class="gmass-calendar-day'
				+ (isSelected ? ' selected' : '')
				+ (isDisabled ? ' disabled' : '')
				+ '">' + (day + 1) + '</span></td>')
			index++;

			if (index == 7 && day < daysInMonth - 1) {
				s.push('</tr>');
				s.push('<tr>');
				index = 0;
				rows++;
			}
			d = new Date(d.setDate(d.getDate() + 1));
		}

		while (rows < 5) {
			s.push('</tr>');
			s.push('<td><span class=gmass-calendar-day>&nbsp;</span></td>')
			s.push('<tr>');
			rows++;
		}

		s.push('</tr>');
		tbl.find('tbody').html(s.join(''));

		// handle clicking on a date
		tbl.find('.gmass-calendar-day[data-date]:not(.disabled)').on('click', function () {
			selectedDate = new Date($(this).data('date'));
			rebuildCalendar();
		});
	}

	tbl.find('.change-month').on('click', function (e) {
		e.preventDefault();

		var dir = $(this).data('dir');
		var newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() + dir);
		if (newDate < opts.minDate || newDate > opts.maxDate)
			return;

		date = newDate;
		rebuildCalendar();
	});


	rebuildCalendar();


	return tbl;
}

window.GMass.createTimeControl = function (opts) {
	opts.date = opts.date || new Date();

	if (typeof (opts.date) == 'string')
		opts.date = GMass.parseDate(opts.date);
	var date = opts.date;

	var tbl = $('<table class="gmass-time-picker"></table>')

	var s = [];

	// arrows up
	s.push('<tr>');
	for (var i = 0; i < 4; i++) {
		s.push('<td>');
		if (i != 1)
			s.push('<button class="time-arrow time-arrow-up" data-which=' + i + '></button>');
		s.push('</td>');
	}
	s.push('</tr>');

	// the inputs
	s.push('<tr>');
	s.push('<td><input type=text maxlength=2 class="time-picker-input time-picker-hour"></td>');
	s.push('<td>:</td>');
	s.push('<td><input type=text maxlength=2 class="time-picker-input time-picker-minute"></td>');
	s.push('<td><input type=text maxlength=2 class="time-picker-input time-picker-ampm"></td>');
	s.push('</tr>');


	// arrows down
	s.push('<tr>');
	for (var i = 0; i < 4; i++) {
		s.push('<td>');
		if (i != 1)
			s.push('<button class="time-arrow time-arrow-down" data-which=' + i + '></button>');
		s.push('</td>');
	}
	s.push('</tr>');

	tbl.html(s.join(''));


	// set the time inputs
	var hours = date.getHours() <= 12 ? date.getHours() : date.getHours() - 12;
	if (hours == 0) hours = 12;
	tbl.find('.time-picker-hour').val(hours);
	tbl.find('.time-picker-minute').val(date.getMinutes() < 10 ?'0' + date.getMinutes() : date.getMinutes());
	tbl.find('.time-picker-ampm').val(date.getHours() < 12 ? 'AM' : 'PM');

	function checkEnabled()
	{
		var hour = tbl.find('.time-picker-hour').val();
		var minute = tbl.find('.time-picker-minute').val();

		tbl.find('.time-arrow-up[data-which="0"]').prop('disabled', hour == 12);
		tbl.find('.time-arrow-down[data-which="0"]').prop('disabled', hour == 1);
		tbl.find('.time-arrow-up[data-which="2"]').prop('disabled', minute == 59);
		tbl.find('.time-arrow-down[data-which="2"]').prop('disabled', minute == 0);

	}

	function arrowPress(arrow)
	{
		var which = arrow.data('which');
		var dir = arrow.hasClass('time-arrow-down') ? -1 : 1;

		if (which == 0 || which == 2) {


			var c = tbl.find(which == 0 ? '.time-picker-hour' : '.time-picker-minute');
			var v = parseInt(c.val());
			v += dir;

			if (which == 0 && v > 12) v = 12;
			if (which == 0 && v < 1) v = 1;

			if (which == 2 && v > 59) v = 59;
			if (which == 2 && v < 0) v = 0;

			if (which == 2 && v < 10) v = '0' + v;

			c.val(v);
			checkEnabled();
			if (arrow.prop('disabled')) {
				arrow.trigger('mouseup');
			}
		}
		else if (which == 3) {
			var a = tbl.find('.time-picker-ampm').val();
			a = a == 'AM' ? 'PM' : 'AM';
			tbl.find('.time-picker-ampm').val(a);
		}

		setTimeData();

	}

	tbl.find('.time-arrow').on('click', function (e) {
		e.preventDefault();
		if (this.ignoreNextClick)
		{
			this.ignoreNextClick = false;
			return;
		}
		arrowPress($(this));
	}).on('mousedown', function(e) {
		var arrow = $(this);
		var which = arrow.data('which');

		if (which == 3)
			return;

		this.timeout = setTimeout(function() {

			arrow[0].downinterval = setInterval(function ( ) {
				arrowPress(arrow);
				arrow[0].ignoreNextClick = true;
			}, 100);
		}, 300);

	}).on('mouseup', function(e) {
		if (this.timeout)
			clearTimeout(this.timeout);
		if (this.downinterval)
			clearInterval(this.downinterval);
	});

	tbl.find('.time-picker-hour, .time-picker-minute').on('blur', function () {
		var min = $(this).hasClass('time-picker-minute') ? 0 : 1;
		var max = $(this).hasClass('time-picker-minute') ? 59 : 12;
		var v = parseInt(this.value);

		if (isNaN(v)) v = min;
		v = Math.min(max, Math.max(min, v));

		if (v < 10 && $(this).hasClass('time-picker-minute'))
			v = '0' + v;

		this.value = v;
		checkEnabled();
		setTimeData();
	});

	// ensure am/pm is valid
	tbl.find('.time-picker-ampm').on('keypress', function (e) {
		if (e.key && e.key.toLowerCase() == 'a')
			this.value = 'AM';
		else if (e.key && e.key.toLowerCase() == 'p')
			this.value = 'PM';
		else
			e.preventDefault();
	}).on('blur', function () {
		this.value = this.value.toUpperCase();
		if (this.value != 'AM' && this.value != 'PM')
			this.value = 'AM';
		setTimeData();
	});

	function setTimeData() {
		var hour = parseInt(tbl.find('.time-picker-hour').val());
		var minute = parseInt(tbl.find('.time-picker-minute').val());
		if (minute < 10) minute = '0' + minute;
		var ampm = tbl.find('.time-picker-ampm').val();
		tbl.data('time', hour + ':' + minute + ampm.toLowerCase());
	}

	checkEnabled();
	setTimeData();
	return tbl;
}

window.GMass.dateTimePicker = function(el, opts) {

	opts = opts || {};
	// add calendat icon to text box
	var icon = $('<div></div>').addClass('gmass-calendar-icon');
	icon.css('height', ($(el).outerHeight() - 2)+ 'px');
	$(el).after(icon);


	icon.on('click', function () {

		// parse the date ignoring the timezone
		opts.date = GMass.parseDate($(el).val(), true);

		// parse the date with timezone so we can extract it
		opts.timezone = GMass.getTimeZone($(el).val());

		var message = opts.message;

		message = message || 'Use the calendar and arrows to select a date and time.';

		if (opts.timezone)
			message += ' Enter a time in time zone ' + opts.timezone + 'GMT';


		var title = opts.title || 'Select a date and time';
		title = '<div class="gmass-dialog-close"></div>' + title;

		// show the date time picker
		var calendar = GMass.createCalendarControl(opts);
		var timePicker = GMass.createTimeControl(opts);

		var wrap = $('<div></div>')
			.addClass('gmass-overlay-box-wrap');

		var dialog = $('<div></div>')
			.addClass('gmass-dialog-box');

		var titlediv = $('<div></div>')
			.addClass('gmass-dialog-box-title')
			.html(title);

		dialog.append(titlediv);

		var msg = $('<div></div>')
			.addClass('gmass-dialog-box-message')
			.append(message)
			.append('<div class="cal-time-wrap"></div>');

		msg.find('.cal-time-wrap').append(calendar);
		msg.find('.cal-time-wrap').append('<div style="width:50px;"></div>');

		msg.find('.cal-time-wrap').append(timePicker);

		dialog.append(msg);


		var buttons = $('<div></div>')
			.addClass('gmass-dialog-box-buttons');
		dialog.append(buttons);

		var ok = $('<button></button>').html('Okay');
		var cancel = $('<button></button>').html('Cancel');
		cancel.on('click', GMass.cancelOverlay);


		ok.on('click', function (e) {
			e.preventDefault();
			var newDate = calendar.data('date') + ' ' + timePicker.data('time') + ' ' + calendar.data('timezone');
			newDate = newDate.replace(/  /g, ' '); // remove any double spaces
			//$(el).val(newDate).trigger('change');
            //3/21/2020 - ajay changing - normal way of triggering change doesn't work, https://stackoverflow.com/questions/3179385/val-doesnt-trigger-change-in-jquery
            $(el).val(newDate);
            el.dispatchEvent(new Event('change'));
			GMass.cancelOverlay();
		});

		buttons.append(ok, cancel);

		wrap.append(dialog);

		dialog.find('.gmass-dialog-close').on('click', GMass.cancelOverlay);

		var appendTo = opts.appendTo || document.body;
		if (typeof appendTo == 'string')
			appendTo = $(appendTo);

		$(appendTo).append(wrap);
		setTimeout(function() { 	wrap.addClass('open'); }, 1);

	});

	if (opts.autoOpen)
		icon.trigger('click');
}



window.GMass.timePicker = function(el, opts) {

	opts = opts || {};
	// add calendat icon to text box
	var icon = $('<div></div>').addClass('gmass-clock-icon');
	icon.css('height', ($(el).outerHeight() - 2)+ 'px');
	$(el).after(icon);

	icon.on('click', function () {

		opts.date = '2000-01-01 ' + $(el).val();
		var title = opts.title || 'Select a time';
		title = '<div class="gmass-dialog-close"></div>' + title;

		var message = opts.message;
		var timezone = GMass.getTimeZone($(el).val());

		message = message || 'Use the arrows to select a time.'
		if (timezone)
			message += '	Enter a time in time zone ' + timezone;

		// show the date time picker
		var timePicker = GMass.createTimeControl(opts);

		var wrap = $('<div></div>')
			.addClass('gmass-overlay-box-wrap');

		var dialog = $('<div></div>')
			.addClass('gmass-dialog-box');

		var titlediv = $('<div></div>')
			.addClass('gmass-dialog-box-title')
			.html(title);

		dialog.append(titlediv);

		var msg = $('<div></div>')
			.addClass('gmass-dialog-box-message')
			.append(message)


		dialog.append(msg);

		dialog.append(timePicker);

		var buttons = $('<div></div>')
			.addClass('gmass-dialog-box-buttons');
		dialog.append(buttons);

		var ok = $('<button></button>').html('Okay');
		var cancel = $('<button></button>').html('Cancel');
		cancel.on('click', GMass.cancelOverlay);


		ok.on('click', function (e) {
			e.preventDefault();
			//$(el).val(timePicker.data('time')).trigger('change');
			$(el).val(timePicker.data('time'));
			el.dispatchEvent(new Event('change'));
			GMass.cancelOverlay();
		});

		buttons.append(ok, cancel);

		wrap.append(dialog);

		dialog.find('.gmass-dialog-close').on('click', GMass.cancelOverlay);

		var appendTo = opts.appendTo || document.body;
		if (typeof appendTo == 'string')
			appendTo = $(appendTo);

		$(appendTo).append(wrap);
		setTimeout(function() { 	wrap.addClass('open'); }, 1);

	});

	if (opts.autoOpen)
		icon.trigger('click');
}

window.GMass.getSelectionCoords = function (element)
{
	if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') {
		var position = element.selectionEnd;
		var properties = [
			'boxSizing', 'width', 'height', 'overflowX',
			'overflowY', 'borderTopWidth', 'borderRightWidth',
			'borderBottomWidth', 'borderLeftWidth', 'paddingTop',
			'paddingRight', 'paddingBottom', 'paddingLeft',
			'fontStyle', 'fontVariant', 'fontWeight',
			'fontStretch', 'fontSize', 'lineHeight',
			'fontFamily', 'textAlign', 'textTransform',
			'textIndent', 'textDecoration',	'letterSpacing',
			'wordSpacing'
		];

		var isFirefox = !(window.mozInnerScreenX == null);
		var mirrorDiv, computed, style;

		// mirrored div
		mirrorDiv = document.getElementById(element.nodeName + '--mirror-div');
		if (!mirrorDiv) {
			mirrorDiv = document.createElement('div');
			mirrorDiv.id = element.nodeName + '--mirror-div';
			document.body.appendChild(mirrorDiv);
		}

		style = mirrorDiv.style;
		computed = getComputedStyle(element);

		// default textarea styles
		style.whiteSpace = 'pre-wrap';
		if (element.nodeName !== 'INPUT')
			style.wordWrap = 'break-word';  // only for textarea-s

		// position off-screen
		style.position = 'absolute';  // required to return coordinates properly
		style.top = element.offsetTop + parseInt(computed.borderTopWidth) + 'px';
		style.left = "0px";
		style.visibility = 'hidden';
		style.display = 'block';

		// transfer the element's properties to the div
		properties.forEach(function (prop) {
			style[prop] = computed[prop];
		});

		if (isFirefox) {
			style.width = parseInt(computed.width) - 2 + 'px'  // Firefox adds 2 pixels to the padding - https://bugzilla.mozilla.org/show_bug.cgi?id=753662
			// Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
			if (element.scrollHeight > parseInt(computed.height))
				style.overflowY = 'scroll';
		} else {
			style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
		}

		mirrorDiv.textContent = element.value.substring(0, position);
		// the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
		if (element.nodeName === 'INPUT')
			mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, "\u00a0");

		var span = document.createElement('span');
		// Wrapping must be replicated *exactly*, including when a long word gets
		// onto the next line, with whitespace at the end of the line before (#7).
		// The  *only* reliable way to do that is to copy the *entire* rest of the
		// textarea's content into the <span> created at the caret position.
		// for inputs, just '.' would be enough, but why bother?
		span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
		span.style.backgroundColor = "lightgrey";
		mirrorDiv.appendChild(span);

		var st = element.tagName == 'TEXTAREA' ? element.scrollTop : 0;
		
		var inputPosition = $(element).offset();
		var coordinates = {
			y: 25 + inputPosition.top + span.offsetTop + parseInt(computed['borderTopWidth']) - st,
			x: inputPosition.left + span.offsetLeft + parseInt(computed['borderLeftWidth'])
		};
		style.display = 'none';
		return coordinates;
	}


	// if content editable, something entirely different
	var sel = document.selection, range, rect;
	var x = 0, y = 0;

	if (sel) {
		if (sel.type != "Control") {
			range = sel.createRange();
			range.collapse(true);
			x = range.boundingLeft;
			y = range.boundingTop;
		}
	} else if (window.getSelection) {
		sel = window.getSelection();
		if (sel.rangeCount) {
			range = sel.getRangeAt(0).cloneRange();
			if (range.getClientRects) {
				range.collapse(true);
				if (range.getClientRects().length > 0) {
					rect = range.getClientRects()[0];
					x = rect.left;
					y = rect.top;
				}
			}
			// Fall back to inserting a temporary element
			if (x == 0 && y == 0) {
				var span = document.createElement("span");
				if (span.getClientRects) {
					// Ensure span has dimensions and position by
					// adding a zero-width space character
					span.appendChild(document.createTextNode("\u200b"));
					range.insertNode(span);
					rect = span.getClientRects()[0];
					x = rect.left;
					y = rect.top;
					var spanParent = span.parentNode;
					spanParent.removeChild(span);

					// Glue any broken text nodes back together
					spanParent.normalize();
				}
			}
		}
	}
	y += 25; // get the bottom of the cursor
	return { x: x, y: y };
}


window.GMass.snippets = function (el, opts) {
	var $el = $(el);
	
	function hideSnippets() {
		//window.GMass.snippetTarget = null;
		if (typeof window.GMass.snippetPanel != 'undefined') {
			setTimeout(function () {
				window.GMass.snippetPanel.hide();
			}, 20);
		}
	}


	function getSnippetProgress()
	{
		var target = window.GMass.snippetTarget;
		if (target == null)
			return null;
		
		var selection = document.getSelection();
		var node = selection.focusNode;
		var text = node.textContent;

		if (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') {
			// get the text
			var text = target.value;
			var leftText = text.substring(0, target.selectionStart);
			if (leftText.lastIndexOf('{') < 0)
				return null;
			var trimFrom = leftText.lastIndexOf('{');
			while (trimFrom > 0 && leftText[trimFrom - 1] == '{')
				trimFrom--;
			leftText = leftText.substring(trimFrom);
			return leftText;
		}
		else if (node.nodeType == 3) // content editable div
		{
			// get the text
			var leftText = text.substring(0, selection.focusOffset);
			if (leftText.lastIndexOf('{') < 0)
				return null;
			
			var trimFrom = leftText.lastIndexOf('{');
			while (trimFrom > 0 && leftText[trimFrom - 1] == '{')
				trimFrom--;
			leftText = leftText.substring(trimFrom);
			
			return leftText;
		}
	}

	function selectSnippet(snippet) {
		window.GMass.snippetPanel.hide();
		
		var insertText = '{' + snippet.html() + '}';
		let regex = /<span.*span>/i;
		insertText = insertText.replace(regex, '');
		
		if (snippet.data('code'))
			insertText += '}';
		var target = window.GMass.snippetTarget;
		window.GMass.snippetTarget = null;

		if (snippet == null || snippet.length == 0)
			return;
		
		setTimeout(function () {
			target.focus();
			var selection = document.getSelection();
			var node = selection.focusNode;
			var text = node.textContent;


			if (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') {
				// get the text
				var text = target.value;
				var leftText = text.substring(0, target.selectionStart);
				var rightText = text.substring(target.selectionStart);
				leftText = leftText.substring(0, leftText.lastIndexOf('{'));

				// calculate what the text should be
				var newText = leftText + insertText + rightText;
				target.value = newText;

				// position the cursor after the inserted text
				var startIndex = (leftText + insertText).length;
				target.setSelectionRange(startIndex, startIndex);
			}
			else if (node.nodeType == 3) // content editable div
			{
				// get the text

				var leftText = text.substring(0, selection.focusOffset);
				var rightText = text.substring(selection.focusOffset);
				leftText = leftText.substring(0, leftText.lastIndexOf('{'));

				// calculate what the text should be
				var newText = leftText + insertText + rightText;
				node.textContent = newText;

				// position the cursor after the inserted text
				var r = document.createRange();
				var startIndex = (leftText + insertText).length;
				r.setStart(node, startIndex);
				r.setEnd(node, startIndex);

				var s = window.getSelection();
				s.removeAllRanges();
				s.addRange(r);
			}



		}, 10);
    }
	
	function snippetsActive()
	{
		if (window.GMass.snippetTarget == null)
			return false;
		if (typeof window.GMass.snippetPanel == 'undefined')
			return false;
		
		if (!window.GMass.snippetPanel.is(':visible'))
			return false;
		
		return true;
	}
	
	function applyStyle(snippetItem){
		//style="background-color: green; color: white; border-radius: 4px; padding: 3px; margin-right: 2px;"
		return snippetItem.replace('<span>', '<span style="background-color: green; color: white; border-radius: 4px; padding: 3px; margin-right: 2px;">');
	}

	function showSnippets(el, codeView) {
		
		window.GMass.snippetTarget = el;
		var helpLink;
		
		if (typeof window.GMass.snippetPanel == 'undefined') {
			window.GMass.snippetPanel = $('<div class="g2_snippet_panel"><ul><li></li></ul></div>');
			window.GMass.snippetPanel.hide();
			$(document.body).append(window.GMass.snippetPanel);
			
			window.GMass.snippetPanel.find('ul').after('<div class=g2_snippet_help_wrap style="background:white"><a class=snippet-help><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/></svg>help</a></div>');
			
			helpLink  = window.GMass.snippetPanel.find('.snippet-help');
			helpLink.on('mousedown', function(e) {
					window.open(this.href);
			});
		}

		helpLink = window.GMass.snippetPanel.find('.snippet-help');
		var helpUrl = codeView ? opts.codeHelpUrl : opts.helpUrl;
		if (!helpUrl)
			helpLink.hide();
		else {
			helpLink.show();
			helpLink.attr('href', helpUrl);
		}

		var s = [];
		var arr = codeView ? opts.codes : opts.snippets;
		
		for (var i = 0; i < arr.length; i++)
			s.push('<li' + (codeView ? ' data-code=true' : '') + '>' + applyStyle(arr[i]) + '</li>');

		window.GMass.snippetPanel.find('ul')
			.css('overflow', 'auto')
			.html(s.join(''));
		window.GMass.snippetPanel.find('li')
		.on('mousedown', function () {
			window.GMass.snippetClick = true;
			selectSnippet($(this));
		}).on('mouseover', function () {
			$(this).parents('ul').find('li.active').removeClass('active');
			$(this).addClass('active');
		});

		var pos = window.GMass.getSelectionCoords(el);
		window.GMass.snippetPanel.show();
		window.GMass.snippetPanel
			.css('left', pos.x + 'px')
			.css('top', pos.y + 'px')
			.show();

			// size the snippet panel to fit within window height
			const viewportHeight = $(window).height();

			const availableHeight = viewportHeight - pos.y;
			const elementHeight = window.GMass.snippetPanel.height() + 20;

			// If element would overflow viewport
			if (elementHeight > availableHeight) {
				// Set maxHeight to available space minus a small buffer (e.g., 20px)
				window.GMass.snippetPanel.find('ul').css('maxHeight', (availableHeight - 40) + 'px');

			} else {
				// Reset maxHeight if not needed
				window.GMass.snippetPanel.find('ul').css('maxHeight', '');
			}
    }

	
	$el
	.off('.snippets')
	.on('blur.snippets', function(e) {
		hideSnippets();
		window.GMass.snippetTarget = null;
	}).on('keypress.snippets', function (e) {
		if (e.key == '{') {
			showSnippets(e.target);
		}
		if (e.key == '}') {
			hideSnippets();
		}		
	}).on('keyup.snippets', function(e) {
	    if (e.keyCode == 8) // backspace
		{ 
		 	var p = getSnippetProgress();
			if (p == null || p.length == 0)
				hideSnippets();			
		}
	})
	.on('keydown.snippets', function (e) {

		if (!snippetsActive())
			return;

		var activeItem = window.GMass.snippetPanel.find('li.active');


		if (e.keyCode == 38 || e.keyCode == 40) {
			// UP or DOWN,  cycle through the menu
			if (activeItem.length == 0) {
				// select the first item
				if (e.keyCode == 40)
					window.GMass.snippetPanel.find('li').first().addClass('active');
				else
					window.GMass.snippetPanel.find('li').last().addClass('active');
			}
			else {
				if (e.keyCode == 40) { // DOWN
					activeItem = activeItem.next();
					if (activeItem.length == 0) {
						activeItem = window.GMass.snippetPanel.find('li').first();
					}
				}
				else { // UP
					activeItem = activeItem.prev();
					if (activeItem.length == 0) {
						activeItem = window.GMass.snippetPanel.find('li').last();
					}
				}
				window.GMass.snippetPanel.find('li').removeClass('active');
				activeItem.addClass('active');
			}
			e.preventDefault();
			return false;
		}
		else if (e.keyCode == 13) { // ENTER
			
			//activeItem.trigger('click');
			selectSnippet(activeItem);
			e.preventDefault();
			return false;
		}
		else if (e.keyCode == 27) { // ESC
			hideSnippets();
			e.preventDefault();
			return false;
		}
		else {
			setTimeout(function() {
				var p = getSnippetProgress();
				if (p == '{{')
				{
					showSnippets(window.GMass.snippetTarget, true);
				}
				else if (p == '{')
				{
					showSnippets(window.GMass.snippetTarget, false);
				}
				else if (p == '{{{')
				{
					hideSnippets();
				}
				
				var matchText = '' + p;
				while (matchText.length > 0 && matchText[0] == '{')
					matchText = matchText.substring(1);
				
				var items = window.GMass.snippetPanel.find('li');
				var matchItem = null;
				items.removeClass('active no-match');
				if (matchText != null && matchText.length > 0)
				{
					items.each(function() {
						var itemText = $(this).text().toLowerCase();
						if (itemText.indexOf(matchText.toLowerCase()) != 0)
							$(this).removeClass('active').addClass('no-match');
						else
							matchItem = $(this);
					});
					
					if (matchItem != null)
						matchItem.addClass('active');
				}
			}, 10);
		}


		// hide upon arrows, non-letters, and everything else except shift and backspace
		if (e.keyCode <= 40 && e.keyCode != 16 && e.keyCode != 8) {
			hideSnippets();
		}
		
	}).on('blur.snippets click.snippets', function () {
		hideSnippets();
	});
}


window.GMass.tabstrip = function (el) {
	const links = $(el).find('.gmass-tab-link a');

	links.on('click', function (e) {
		e.preventDefault();
        links.removeClass('active');

		links.each(function () {
			const href = $(this).attr('href');
			const div = $(href);
            div.removeClass('active');
		});

		$(this).addClass('active');
		$($(this).attr('href')).addClass('active');

	});

	if (links.filter('.active').length == 0) {
		links.first().trigger('click');
	}
}

	