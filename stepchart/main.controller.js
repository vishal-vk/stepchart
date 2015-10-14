sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/viz/ui5/controls/common/feeds/FeedItem", "sap/viz/ui5/data/FlattenedDataset", "step/control/StepLineRender"
], function(Controller, JSONModel, FeedItem, FlattenedDataset, StepLineRender) {
	"use strict";
	/**
	 * @public
	 * @class Demand forecast report
	 * @name step.stepchart.main
	 * @extends sap.ui.core.Controller
	 */
	Controller.extend("step.stepchart.main", {

		/**
		 * @public
		 * @name step.stepchart.main#onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Can be used to modify the
		 *              View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function() {
			var oStepChart = this.byId("idStepChart");
			var sDataPath = "data/data.json";

			var oModel = new JSONModel(sDataPath);
			var oFlattenedDataset = new FlattenedDataset({
				dimensions: [
					{
						name: "Label",
						value: "{Label}"
					}
				],
				measures: [
					{
						name: "Forecast",
						value: "{Forecast}"
					}, {
						name: "Allocation",
						value: "{Allocation}"
					}, {
						name: "Booking",
						value: "{Booking}"
					}
				],
				data: {
					path: "/d/results"
				}
			});

			oStepChart.setDataset(oFlattenedDataset);
			oStepChart.setModel(oModel);

			oStepChart.setVizProperties({
				general: {
					layout: {
						padding: 0.04
					}
				},
				valueAxis: {
					title: {
						visible: true,
						text: "Seats"
					}
				},
				categoryAxis: {
					title: {
						visible: true,
						text: "Legs"
					}
				},
				plotArea: {
					dataLabel: {
						visible: true
					},
					lineRenderer: StepLineRender.createStepChart,
				},
				title: {
					visible: true,
					text: "Step chart"
				}
			});

			var oFeedValueAxis = new FeedItem({
				'uid': "valueAxis",
				'type': "Measure",
				'values': [
					"Forecast", "Allocation", "Booking"
				]
			});

			var oFeedCategoryAxis = new FeedItem({
				'uid': "categoryAxis",
				'type': "Dimension",
				'values': [
					"Label"
				]
			});

			oStepChart.addFeed(oFeedValueAxis);
			oStepChart.addFeed(oFeedCategoryAxis);
		}
	});
});
