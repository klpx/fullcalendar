
fcViews.prodmonth = ProductionMonthView;

function ProductionMonthView(element, calendar) {
	var t = this;
	
	
	// exports
	t.render = render;
	
	// imports
	BasicView.call(t, element, calendar, 'prodmonth');
	var opt = t.opt;
	var renderBasic = t.renderBasic;
	var skipHiddenDays = t.skipHiddenDays;
	var getCellsPerWeek = t.getCellsPerWeek;
	var formatDate = calendar.formatDate;
	
	
	function render(date, delta) {
		if (delta) {
			addMonths(date, delta);
			date.setDate(1);
		}

		var firstDay = opt('firstDay');

		var prodmonths	= opt('prodmonths'),
			prodmonth	= null,
			start,
			end;

		if (!prodmonths || !prodmonths[0]) {
			start = cloneDate(date, true);
			start.setDate(1);
			end = addMonths(cloneDate(start), 1);
		}
		else {
			for (var i in prodmonths) {
				var pm = prodmonths[i];
				if (pm.year == date.getFullYear() && pm.month == date.getMonth() + 1) {
					prodmonth = pm;
					break;
				}
			}
			if (!prodmonth) {
				if (date > prodmonths[prodmonths.length - 1].end) {
					prodmonth = prodmonths[prodmonths.length - 1];
				} else {
					prodmonth = prodmonths[0];
				}
				date.setMonth(prodmonth.month - 1);
				date.setYear(prodmonth.year);
			}
			if (date < prodmonth.start) {
				date.setDate(prodmonth.start.getDate());
			} else if (date > prodmonth.end) {
				date.setDate(prodmonth.end.getDate());
			}

			start = cloneDate(prodmonth.start, true);
			end = cloneDate(prodmonth.end, true);
		}

		var visStart = cloneDate(start);
		addDays(visStart, -((visStart.getDay() - firstDay + 7) % 7));
		skipHiddenDays(visStart);

		var visEnd = cloneDate(end);
		addDays(visEnd, (7 - visEnd.getDay() + firstDay) % 7);
		skipHiddenDays(visEnd, -1, true);

		var colCnt = getCellsPerWeek();
		var rowCnt = Math.round(dayDiff(visEnd, visStart) / 7); // should be no need for Math.round


		if (opt('weekMode') == 'fixed') {
			addDays(visEnd, (6 - rowCnt) * 7); // add weeks to make up for it
			rowCnt = 6;
		}

		t.title = formatDate(start, prodmonth.name || opt('titleFormat')) + ' <span class="dates-range">(' + formatDate(start, 'dd MMM').toLowerCase() + ' - ' + formatDate(end, 'dd MMM').toLowerCase() + ')</span>';

		t.start = start;
		t.end = end;
		t.visStart = visStart;
		t.visEnd = visEnd;
		t.prodmonth = prodmonth;

		renderBasic(rowCnt, colCnt, true);
	}
	
}

