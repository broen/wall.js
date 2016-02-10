# jQuery 3D-Wall
A 3D wall gallery plugin for jQuery

### Setup
Include the script

	<script src="js/wall.js"></script>


Define your content e.g.

	<div class="wall">
		<article>
			<iframe src="something.com"></iframe>
		</article>
		…
	</div>‘


Initialize the plugin on load

	$(document).ready(function(){
		$('.wall').wall();
	});

### Use settings like this:

	.wall({
		size: 180,
		rows: 3
	});

### Possible settings and default values:

Size of longest side in pixels

	size: 180

Number of rows

	rows: 3

Item selector

	selector: 'article'

Angle between elements

	angle: 10

Additional scaling for active element

	scale: 1.1

Vertical and horizontal angle variation on mouse

	variationY: 0.15
	variationX: 2.0

Distance to the virtual center point, camera perspective and threshold

	depth: -1200
	perspective: 2000
	threshold: 0

Movement transition duration

	transition: 0.0

Lightbox background color and transparency

	lightbox: 'rgba(0,0,0,0.1)'

Button text for navigation, leave blank if you don't want buttons

	btnback: '<'
	btnnext: '>'
