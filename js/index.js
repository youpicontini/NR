
$(document).ready(function(){

// -------- Variables --------------
    var accessToken = "1913881145.cf0499d.3d4d8f229b7d4b518c6c054537dd0700";
    var configTweet = {
        "id": '689192029453156354',
        "domId": 'twitter',
        "maxTweets": 100,
        "enableLinks": false,
        "showUser": false,
        "showTime": false,
        "showInteraction":false
    };
    var textDesktop = 'This is an App designed for mobile: please visit this URL with a mobile to enjoy this experiment';
    var textMobileNotStandAlone = 'This is an App, please use the -Add to home screen- button to enjoy this experiment';

// -------- Initialisation function --------------
    getInstaData();
    checkTwitterUpdate();
    setInterval(checkTwitterUpdate, 10000);


    var isDesktop = (function() {
        return !('ontouchstart' in window) // works on most browsers
            || !('onmsgesturechange' in window); // works on ie10
    })();
    window.isDesktop = isDesktop;

    function isRunningStandalone() {
        //return (window.matchMedia('(display-mode: standalone)').matches);
        return true;
    }

    if( isDesktop ){
        $(".info-text").text(textDesktop);
    }
    else{
        if ((("standalone" in window.navigator) && !window.navigator.standalone) || isRunningStandalone() ){
            setTimeout(function() {
                $('.cover').fadeOut();
            }, 2000 );
        }
        else{
            $(".info-text").text(textMobileNotStandAlone);
        }
    }


    /*GET LAST 3 INSTAGRAM POST*/
    function getInstaData(){
        $.ajax({
            type: 'GET',
            url: "https://api.instagram.com/v1/users/self/media/recent/?access_token="+accessToken+"", //url de récupération du json instagram
            data: { get_param: 'value' },
            dataType: 'jsonp',
            crossDomain: true,
            success: function (data) {
                $.each( data.data, function( i, item ) { // Itère à travers toutes les valeurs du tableaux de données
                    var imagesURL = item.images.standard_resolution.url; // Récupère l'url des images en résolution standard
                    $('#instagram').prepend('<li><img src="'+imagesURL+'"></li>');
                    return i<2;
                });
            },
            error: function() { alert('Failed!'); }
        });
    }

    /*GET LAST TWEETS*/
    function checkTwitterUpdate(){
        twitterFetcher.fetch(configTweet);
    }

    setInterval(function () {
        var vis = $("#cursor").css("visibility");
        vis = (!vis || vis == "visible") ? "hidden" : "visible";
        $("#cursor").css("visibility", vis);
    }, 500);





    /*SWIPE*/

    var supportTouch = $.support.touch,
        scrollEvent = "touchmove scroll",
        touchStartEvent = supportTouch ? "touchstart" : "mousedown",
        touchStopEvent = supportTouch ? "touchend" : "mouseup",
        touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                    start = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ],
                        origin: $(event.target)
                    },
                    stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                    .bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function(event) {
                        $this.unbind(touchMoveEvent, moveHandler);
                        if (start && stop) {
                            if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                            }
                        }
                        start = stop = undefined;
                    });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });


    $('.mask, .twitter').on('swipedown',function(){
        if(!($('#twitter li:first').is(':visible') && $('#twitter li:nth-child(2)').is(':hidden'))){
            $('#twitter li:visible:last').hide();
        }
    } );
    $('.mask, .twitter').on('swipeup',function(){
        $('#twitter li:hidden:first').show();
    } );

    if(window.orientation == 0 || window.orientation == 180) {
        //portrait
        $("body").removeClass('landscape');
    } else {
        $("body").addClass('landscape');
    }

});

$(window).on("orientationchange", function(event) {
    if(window.orientation == 0 || window.orientation == 180) {
        //portrait
        $("body").removeClass('landscape');
    } else {
        $("body").addClass('landscape');
    }
});
