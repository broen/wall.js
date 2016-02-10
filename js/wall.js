(function($) {

    $.fn.wall = function(options) {

        settings = $.extend({

            size        : 180,                  // size of longest side in pixels
            rows        : 3,                    // number of rows
            angle       : 10,                   // angle between elements
            scale       : 1.1,                  // additional scaling for active element
            variationY  : 0.15,                 // vertical angle variation on mouse movement
            variationX  : 2.0,                  // horizontal angle variation
            depth       : -1200,                // distance to the virtual center point
            perspective : 2000,                 // camera distance
            threshold   : 0,                    // center threshold
            transition  : 0.0,                  // transition duration in seconds
            selector    : 'article',            // wall items
            lightbox    : 'rgba(0,0,0,0.4)'     // lightbox background color

        }, options);

        return this.each(function(){
            // variables
            wall = $(this);
            items = wall.children(settings.selector);
            startLeft = $(window).width() / 2;
            startTop = $(window).height() / 2;
            //cssInactive = 0;
            //cssSaved = 0;
            //init = true;
            moveX = 0;
            moveY = 0;
            // initial center
            wall.css({
                'perspective': settings.perspective + 'px',
                overflow: 'hidden'
            });
            // add lightbox background (collects the cliks for closing the big box)
            $('<div class="lightbox"></div>').appendTo(wall)
            .css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: settings.lightbox,
                display: 'none'
            });
            resetCenter(startLeft, startTop);
            
            recalcPosition();
            // after startup
            //init = false;
            wall.find(settings.selector).css({
                position: 'absolute',
                width: settings.size,
                height: settings.size,
                transition: 'all ' + settings.transition + 's',
                cursor: 'pointer'
            });
            wall.find('article *').css({
                'max-width': settings.size,
                'max-height': settings.size
            });
            // mouse movement
            wall.mousemove(function() {
                x = event.pageX;
                y = event.pageY;

                // x direction
                moveX = x - startLeft;
                if (Math.abs(moveX) <= settings.threshold) {
                    moveX = 0;
                }
                moveX = moveX / startLeft;
                // y direction
                moveY = y - startTop;
                if (Math.abs(moveY) <= settings.threshold) {
                    moveY = 0;
                }
                moveY = moveY / startTop;
                // new position
                recalcPosition();
            });
            // on resize
            $(window).resize(function() {
                startLeft = $(window).width() / 2;
                startTop = $(window).height() / 2;
                resetCenter(startLeft, startTop);
            });
            // click on article
            items.on('click', function() {
                // saved css from previous element
                //cssSaved = cssInactive;
                //save css from active element
                // if(!$(this).hasClass('active')) {
                //     cssInactive = $(this).css(['transform', 'z-index', 'left', 'top']);
                // }
                // not working anymore - close active element
                //closeActive(cssSaved);
                // bring newly active element to the foreground


                $(this).clone().appendTo(wall)
                .css({
                    transition: '1s',
                    'transform': 'rotateY(0deg) translateZ(' + (-settings.depth * settings.scale + 'px'),
                    'z-index': 15,
                    left: startLeft - settings.size / 2,
                    top: startTop - settings.size / 2,
                    cursor: 'default'
                })
                .addClass('active');
                $('.lightbox').fadeIn();
            });
            // click away from foreground to close popup
            $('.lightbox').on('click', function() {
                $('.lightbox').fadeOut();
                $('.active').remove();
            });


        });

        function recalcPosition() {
            // calculate rows and columns
            columns = Math.ceil(items.length / settings.rows);
            items.each(function(index, elem) {
                elem.count = index;
                index++;
                elem.row = Math.ceil(index / columns) - (settings.rows / 2) - 0.5;
                elem.column = (index % columns);
                if (elem.column == 0) {
                    elem.column = columns;
                }
                elem.column = elem.column - (columns / 2) - 0.5;
                // 3D transformations
                rotateY = 'rotateY(' + ((moveX * settings.variationX) + (-elem.column)) * settings.angle + 'deg) ';
                rotateX = 'rotateX(' + ((-moveY * settings.variationY) + (elem.row)) * settings.angle + 'deg) ';
                translateZ = 'translateZ(' + settings.depth + 'px)';
                items.eq(elem.count).css({
                    'transform': rotateY + rotateX + translateZ
                });
            });
        }

        function resetCenter(left, top) {            
            newLeft = left - settings.size / 2;
            newTop = top - settings.size / 2;
            // console.log(newLeft, newTop);
            items.css({
                top: newTop,
                left: newLeft
            });
        }

        // function closeActive(saved) {
        //     $('.active').css({
        //         'transform': saved['transform'],
        //         'z-index': saved['z-index'],
        //         'left': saved['left'],
        //         'top': saved['top'],
        //         cursor: 'pointer'
        //     }).removeClass('active');
        // }
        /*
            TO DO:
                iframe problem: invisible image on top should do the trick 
                    --> bigger image is new instance!
                that onclick stuff is stupid crap
                    --> redo, bigger image is new instance
                no transition on magnification
                    --> bigger image is new instance
                    --> magnifies from mouse position
                click anywhere to close active element
        */
    }
}(jQuery));