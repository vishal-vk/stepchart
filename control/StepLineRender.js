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

		updateStepChart: function(node, config) {
			node.setAttribute("d", outputPath(config.points));
		}

	};
	function outputPath(points) {

		var d = "";

		var restart = true;
		var pointExist = true;
		var diff = 0;

		for (var i = 0; i < points.length; i++) {
			if (!points[i]) {
				restart = true;
			} else {
				if (pointExist) {
					// If only one point exists
					if (points.length == 1 || points[i + 1] === undefined) {
						diff = 0;
					} else {
						diff = parseFloat((points[i + 1][0] - points[i][0]) / 2);
					}
					pointExist = false;
				}

				d = d && !restart ? d + "L" : d + "M";
				var newX = 0;
				if (!restart) {

					newX = points[i - 1][0] + diff;
					var newX2 = points[i][0] - diff;
					d += points[i - 1][0] + "," + points[i - 1][1];
					d += "L" + newX + "," + points[i - 1][1];
					d += "L" + newX2 + "," + points[i][1];

					if (i == (points.length - 1)) {
						//Last point
						newX2 = newX2 + diff + diff;
						d += "L" + newX2 + "," + points[i][1];
					}
				} else {
					//First point
					newX = points[i][0] - diff;
					d += newX + "," + points[i][1];
					restart = false;
				}
			}
		}
		return d;
	}
	return StepLineRender;
});
