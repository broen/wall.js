# jQuery 3D-Wall
A 3D wall gallery plugin for jQuery

## Setup
Include the script

‘<script src="js/wall.js"></script>‘


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

