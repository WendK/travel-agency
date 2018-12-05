import $ from 'jquery';
import waypoints from '../../../../node_modules/waypoints/lib/noframework.waypoints';

class RevealOnScroll {
	constructor(elts, offset) {
		this.itemsToReveal = elts;
		this.offsetValue = offset;
		this.hideInitially();
		this.createWaypoints();
	}

	hideInitially() {
		this.itemsToReveal.addClass("reveal-item");
	}

	createWaypoints() {
		var that = this;
		this.itemsToReveal.each(function() {
			var currentItem = this;
			new Waypoint({
				element: currentItem,
				handler: function (direction) {
					if (direction == 'down') {
						$(currentItem).addClass("reveal-item--is-visible");
					} else  {
						$(currentItem).removeClass("reveal-item--is-visible");
					}
					
				},
				offset: that.offsetValue
			});
		});
	}

}

export default RevealOnScroll;