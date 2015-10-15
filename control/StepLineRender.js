sap.ui.define("step/control/StepLineRender", function() {
	"use strict";

	/**
	 * @classdesc This class contains customLine renderer for step chart used for Leg representation
	 * @class
	 * @name step.control.StepLineRender
	 */
	var StepLineRender = {
		createStepChart: function(config) {

			var graphic = config.graphic;
			// SVG path element
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

			path.setAttribute("d", outputPath(config.points));
			path.setAttribute("fill", "none");
			path.setAttribute("stroke-width", graphic.width);
			path.setAttribute("stroke", graphic.color);
			path.setAttribute("stroke-linejoin", "round");
			path.setAttribute("stroke-dasharray", graphic.dash);
			
			if (config.filterId) {
				path.setAttribute("filter", 'url(#' + config.filterId + ')');
			}
			return path;
		},
	};
	
	/**
	 * Consider the points with co-ordinates P1(x1, y1), P2(x2, y2), P3(x3, y3) and P4(x4, y4)
	 * To draw a line from P1 -> P2 -> P3 -> P4 (Regular line chart), SVG path expects the "d" attribute as "Mx1,y1Lx2,y2Lx3,y3Lx4,y4"
	 * This method generates a string for the "d" attribute, so that the line is rendered as a step.
	 * 
	 * points is an array of 2 element arrays consisting of the co-ordinates of all the points.
	 * points[i][0] = x co-ordinate of the (i+1)th point on the chart
	 * points[i][1] = y co-ordinate of the (i+1)th point on the chart
	 * 
	 */
	function outputPath(points) {

		var d = "";

		// Flag to indicate if d has to be regenerated from start
		var restart = true;
		
		// Flag to indicate if there is at least one point
		var pointExist = true;
		
		// Half the width between 2 consecutive points.
		var diff = 0;

		for (var i = 0; i < points.length; i++) {
			if (!points[i]) {
				restart = true;
			} else {
				if (pointExist) {
					if (points.length == 1 || points[i + 1] === undefined) {
						// If there is only one point/or if the next point does not exist, diff cannot be determined, and no line is rendered.
						diff = 0;
					} else {
						// The height of the line changes midway between two consecutive points.
						diff = parseFloat((points[i + 1][0] - points[i][0]) / 2);
					}
					pointExist = false;
				}

				// M: Move to ; L: Line to
				// First time the loop is executed, concatenate "M" to d. Every other time, concatenate "L"
				d = d && !restart ? d + "L" : d + "M";
				
				var newX = 0;
				
				// If d need not be regenerated (till all points are plotted)
				if (!restart) {
					// All other points
					// The line is rendered till (x co-ordinate) half way after the previous point
					newX = points[i - 1][0] + diff;
					
					// The line is rendered from half way before the current point.
					var newX2 = points[i][0] - diff;
					
					// Draw horizontal line to the previous point
					d += points[i - 1][0] + "," + points[i - 1][1];
					
					// Draw horizontal line till midway between the current and previous points
					d += "L" + newX + "," + points[i - 1][1];
					
					// Draw vertical line
					d += "L" + newX2 + "," + points[i][1];

					if (i == (points.length - 1)) {
						// Last point
						// Draw horizontal line till half way after the last point
						newX2 = newX2 + diff + diff;
						d += "L" + newX2 + "," + points[i][1];
					}
				} else {
					// First point
					// The line is rendered from (x co ordinate) half way before the first point
					newX = points[i][0] - diff;
					
					// Concatenate the co-ordinates where the line begins to d 
					d += newX + "," + points[i][1];
					restart = false;
				}
			}
		}
		return d;
	}
	return StepLineRender;
});
