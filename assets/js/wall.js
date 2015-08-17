(function($) {

    $.fn.wall = function(options) {

        settings = $.extend({

            size        : 180,  // size in pixel of longest side
            rows        : 3,    // number of rows
            angle       : 10,   // angle between each element
            scale       : 1.1,  // additional scaling for active element
            variation   : 1.1,  // angle variation vertical
            depth       : -1200, // distance to the virtual center point
            perspective : 2000, // camera distance
            threshold   : 100   // distance to the center where the camera starts moving

        }, options);

        return this.each(function(){
            // variables
            wall = $(this);
            articles = wall.children('article');
            startLeft = $(window).width() / 2;
            startTop = $(window).height() / 2;
            cssInactive = 0;
            cssSaved = 0;
            //index = 1;
            init = true;
            // initial center
            wall.css({
                '-webkit-perspective': settings.perspective + 'px',
                overflow: 'hidden'
            });
            resetCenter(startLeft, startTop);
            // calculate rows and columns
            columns = Math.ceil(articles.length / settings.rows);
            articles.each(function(index, elem) {
                elem.count = index;
                index++;
                elem.row = Math.ceil(index / columns) - (settings.rows / 2) - 0.5;
                elem.column = (index % columns);
                if (elem.column == 0) {
                    elem.column = columns;
                }
                elem.column = elem.column - (columns / 2) - 0.5;
                recalcPosition(elem, init);
                
            });
            // after startup
            init = false;
            //recalcPosition();
            wall.find('article').css({
                position: 'absolute',
                width: settings.size,
                height: settings.size,
                transition: 'all 0.4s',
                cursor: 'pointer'
            });
            wall.find('article *').css({
                'max-width': settings.size,
                'max-height': settings.size
            });
            // mouse movement
            wall.mousemove(function() {
                //TO DO what happens when the mouse moves
            });
            // on resize
            $(window).resize(function() {
                startLeft = $(window).width() / 2;
                startTop = $(window).height() / 2;
                resetCenter(startLeft, startTop);
            });
            // click on article
            articles.on('click', function() {
                // saved css from previous element
                cssSaved = cssInactive;
                //save css from active element
                if(!$(this).hasClass('active')) {
                    cssInactive = $(this).css(['-webkit-transform', 'z-index', 'left', 'top']);
                }
                // close active element
                closeActive(cssSaved);
                // bring newly active element to the foreground
                $(this).css({
                    '-webkit-transform': 'rotateY(0deg) translateZ(' + (-settings.depth * settings.scale + 'px'),
                    'z-index': 15,
                    left: startLeft - settings.size / 2,
                    top: startTop - settings.size / 2,
                    cursor: 'default'
                }).addClass('active');
            });
            // click away from foreground to close popup
            // TODO


        });

        function recalcPosition(elem, init) {
            if (init) {
                x = startLeft;
                y = startTop;
            }
            else {
                x = event.pageX;
                y = event.pageY; 
            }
            //console.log(elem);
            rotateY = 'rotateY(' + (-elem.column * settings.angle) + 'deg) ';
            rotateX = 'rotateX(' + (elem.row * settings.angle) + 'deg) ';
            translateZ = 'translateZ(' + settings.depth + 'px)';
            articles.eq(elem.count).css({
                '-webkit-transform': rotateY + rotateX + translateZ
            }); 
            // TO DO 
            // pos = pos - window/2
        }

        function resetCenter(left, top) {
            
            newLeft = left - settings.size / 2;
            newTop = top - settings.size / 2;
            // console.log(newLeft, newTop);
            articles.css({
                top: newTop,
                left: newLeft
            });
        }

        function closeActive(saved) {
            $('.active').css({
                '-webkit-transform': saved['-webkit-transform'],
                'z-index': saved['z-index'],
                'left': saved['left'],
                'top': saved['top'],
                cursor: 'pointer'
            }).removeClass('active');
        }

        /*

            TO DO:
                mouse movement -> camera adjusts, angles change
                maximum movement till center of viewport
                iframe problem: invisible image on top should do the trick 
                click somehwere to close active element

        */
    }

}(jQuery));