(function($) {

    $.fn.wall = function(options) {

        settings = $.extend({

            size        : 200,
            rows        : 3,
            angle       : 15,
            depth       : -800,
            perspective : 1600

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
            console.log(newLeft, newTop);
            articles.css({
                top: newTop,
                left: newLeft
            });
        }
    }

}(jQuery));