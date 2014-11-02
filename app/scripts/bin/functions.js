eyelet = {
	init: function (e) {
		$(document).mousemove(function (e) {
			mouse = {
				x: e.pageX,
				y: e.pageY,
			}
			var eyelet = $("svg#eyelet");
			
			var u = "px";
			var ownW = eyelet.width() /2;
			var ownH = eyelet.height() /2;
			
			eyelet.css({
				top: mouse.y - get.h - ownH +u,
				left: mouse.x - ownW + 5 +u,
			});
		});
	}
}
$(function(){
	$("#hero").hover(function(){
		$(eyelet.init());
	});
});
