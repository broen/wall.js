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
            lightbox    : 'rgba(0,0,0,0.1)',    // lightbox background color
            btnback     : '<',                  // Text for 'back' button
            btnnext     : '>'                   // Text for 'next' button

        }, options);

        return this.each(function(){
            // variables
            wall = $(this);
            items = wall.children(settings.selector);
            startLeft = $(window).width() / 2;
            startTop = $(window).height() / 2;
            moveX = 0;
            moveY = 0;
            itemId = 0;
            initWall();
            resetCenter(startLeft, startTop);
            recalcPosition();
            initItems();
            initMouse();
            
            
            // on resize
            $(window).resize(function() {
                startLeft = $(window).width() / 2;
                startTop = $(window).height() / 2;
                resetCenter(startLeft, startTop);
            });
            //click listeners
            // click on item
            items.on('click', function() {
                // clone item and bring to front
                showItem($(this));
                // show the lightbox
                $('.wall-lightbox').fadeIn();
            });
            // click away from foreground to close item
            $('.wall-lightbox').on('click', function(e) {
                // not for children
                if (e.target !== this) {
                    return;
                }
                $('.wall-lightbox').fadeOut();
                $('.wall-active').remove();
            });
            $('.wall-back').on('click', function() {
                changeItem('back');
            });
            $('.wall-next').on('click', function() {
                changeItem('next');
            });
        });

        function initWall() {
            wall.css({
                'perspective': settings.perspective + 'px',
                overflow: 'hidden'
            });
            // add lightbox background (collects the clicks for closing the big box)
            $('<div class="wall-lightbox"><div class="wall-nav wall-back">'
                + settings.btnback
                + '</div><div class=" wall-nav wall-next">'
                + settings.btnnext
                + '</div></div>').appendTo(wall)
            .css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: settings.lightbox,
                display: 'none'
            });
            $('.wall-nav').css({
                cursor: 'pointer'
            });
        }

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

        function initItems() {
            //give them an id
            items.each(function() {
                $(this).attr('data-wall-id', itemId);
                itemId++;
            });
            items.css({
                position: 'absolute',
                width: settings.size,
                height: settings.size,
                transition: 'all ' + settings.transition + 's',
                cursor: 'pointer',
                overflow: 'hidden'
            });
            items.find('*').css({
                'max-width': settings.size,
                'max-height': settings.size
            });
            $('<div class="wall-overlay"></div>').appendTo(items)
            .css({
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '1000px',
                height: '1000px',
                background: 'rgba(0,0,0,0)',
                'z-index': 10
            });
        }

        function initMouse() {
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
        }

        function showItem(item) {
            item.clone(true).appendTo(wall)
                .css({
                    transition: '1s',
                    'transform': 'rotateY(0deg) translateZ(' + (-settings.depth * settings.scale + 'px'),
                    'z-index': 15,
                    left: startLeft - settings.size / 2,
                    top: startTop - settings.size / 2,
                    cursor: 'default'
                })
                .addClass('wall-active')
                .find('.wall-overlay').remove();
        }

        function changeItem(direction) {
            var changeItemId = $('.wall-active').attr('data-wall-id');
            switch(direction) {
            case 'back':
                changeItemId--;
                if (changeItemId < 0) {
                    changeItemId = items.length - 1;
                }
                break;
            case 'next':
                changeItemId++;
                if (changeItemId >= items.length) {
                    changeItemId = 0;
                }
                break;
            }
            $('.wall-active').remove();
            showItem($('[data-wall-id=' + changeItemId + ']'));

        }

        //Documentation:
            // elements have prefix '.wall-' - consider this
            // Style Buttons yourself: .wall-nav .wall-back / .wall-next


    }
}(jQuery));