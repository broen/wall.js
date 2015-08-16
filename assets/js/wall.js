(function($) {

    $.fn.wall = function(options) {

        settings = $.extend({

            size        : 200,  // size in pixel of longest side
            rows        : 3,    // number of rows
            angle       : 15,   // angle between each element
            depth       : -800, // distance to the virtual center point
            perspective : 1600, // camera distance
            threshold   : 100   // distance to the center where the camera starts moving

        }, options);

        return this.each(function(){

            wall = $(this);
            articles = wall.children('article');
            // startup
            resetCenter(articles); 
            recalcPositions();
            // mouse movement
            wall.mousemove(recalcPositions);
            // on resize
            $(window).resize(resetCenter);
            // click on article
            articles.on('click', function() {
                //-webkit-transform: rotateY(0deg) translateZ(1000px); z-index: 15;
            });

        });

        function recalcPositions() {
            x = event.pageX,
            y = event.pageY;        
            // TO DO 
            // pos = pos - window/2
        }

        function resetCenter() {
            
            newLeft = $(window).width() / 2 - settings.size / 2;
            newTop = $(window).height() / 2 - settings.size / 2;
            // console.log(newLeft, newTop);
            articles.css({
                top: newTop,
                left: newLeft
            });
        }

        /*

            TO DO:
                mouse movement -> camera adjusts, angles change
                maximum movement till center of viewport


        */
    }

}(jQuery));