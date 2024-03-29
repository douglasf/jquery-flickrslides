/*
 *  Project: jquery-flickrslides
 *  Description: jQuery tabs plugin
 *  Author: Douglas Frisk
 *  License: -
 */


// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than globals
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'flickrSlides',
        defaults = {};

    // The actual plugin constructor
    function FlickrSlidesPlugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or 
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    FlickrSlidesPlugin.prototype.init = function () {
        var jsonCallback,
            apiKey = this.options.api_key,
            photosetId = this.options.photoset_id,
            _this = this.element,
            animationSpeed = 300,
            // Next photo arrow
            rarr = $("<div>").css({"right": 0, "text-align": "right"}).text(">"),
            // Previous photo arrow
            larr = $("<div>").css({"left": 0, "text-align": "left"}).text("<"),
            // The div that holds the photos
            presentationDiv = $("<div>").hide().
                css({
                    "width": "200px",
                    "height": "200px",
                    "position": "fixed",
                    "z-index": 1000,
                    "left": "50%",
                    "top": "50%",
                    "margin-left": "-100px",
                    "margin-top": "-100px",
                    "border": "1px solid #000",
                    "text-align": "center",
                    "background": "#FFF"
                }),
            // Loading spinner
            loading = $("<span>").
                css({
                    "font-family": "'WebSymbolsRegular', Arial, sans-serif",
                    "font-size": "50px",
                    "line-height": "200px"
                }),
            // Faded background
            bg = $("<div>").
                css({
                    "width": "100%",
                    "height": "100%",
                    "position": "fixed",
                    "top": 0,
                    "left": 0,
                    "background": "rgba(0,0,0,0.4)"
                }).
                hide().
                click(function () {
                    presentationDiv.hide();
                    bg.hide();
                }),
            loaderSymbols = ['0', '1', '2', '3', '4', '5', '6', '7'],
            loaderRate = 100,
            loaderIndex = 0,
            loader = function () {
                loading.text(loaderSymbols[loaderIndex]);
                loaderIndex = loaderIndex  < loaderSymbols.length - 1 ? loaderIndex + 1 : 0;
                setTimeout(loader, loaderRate);
            };


        $.map([larr, rarr], function (n) {
            return n.css({
                "cursor": "pointer",
                "font-family": "'WebSymbolsRegular', Arial, sans-serif",
                "font-size": "50px",
                "height": "180px",
                "width": "90px",
                "line-height": "200px",
                "position": "absolute",
                "z-index": 1001,
                "top": 0,
                "color": "white",
                "text-shadow": "2px 2px 5px #000",
                "opacity": 0,
                "padding": "10px"
            }).hover(function () {
                $(this).animate({"opacity": 1}, 0);
            }, function () {
                $(this).animate({"opacity": 0}, 0);
            });
        });


        loader();

        // Clear "no javascript" text
        $(_this).empty();

        jsonCallback = function (data) {
            var thumbs_ul;

            thumbs_ul = $("<ul>");
            $(_this).append(thumbs_ul);
            presentationDiv.append(larr)
                .append(rarr);
            $(_this).append(bg)
                .append(presentationDiv);

            $.each(data.photoset.photo, function (index) {
                var url = "http://farm" + data.photoset.photo[index].farm + ".static.flickr.com/" + data.photoset.photo[index].server + "/" + data.photoset.photo[index].id + "_" + data.photoset.photo[index].secret + "_s.jpg",
                    thumb_li = $("<li>"),
                    thumb_a = $("<a>").attr("href", url),
                    thumb = $("<img>").
                        attr("src", url);
                thumbs_ul.append(thumb_li.append(thumb_a.append(thumb)));
                thumb_a.click(function (event) {
                    event.preventDefault();
                    var putPhoto = function (i) {
                        var photo;
                        presentationDiv.children("img").remove();
                        presentationDiv.show().append(loading);
                        bg.show();
                        if (i <= 0) {larr.hide(); } else {larr.show(); }
                        if (i >= data.photoset.photo.length - 1) {rarr.hide(); } else {rarr.show(); }
                        photo = $("<img>").
                            attr("src", "http://farm" + data.photoset.photo[i].farm + ".static.flickr.com/" + data.photoset.photo[i].server + "/" + data.photoset.photo[i].id + "_" + data.photoset.photo[i].secret + ".jpg").
                            hide().
                            load(function (e) {
                                presentationDiv.append(photo);
                                loading.animate({"line-height": $(photo).height() + "px"}, animationSpeed);
                                $.map([larr, rarr], function (arr) {
                                    return arr.animate({
                                        "width": (($(photo).width() / 2) - 20) + "px",
                                        "height": ($(photo).height() - 20) + "px",
                                        "line-height": ($(photo).height() - 20) + "px"
                                    }, animationSpeed).unbind('click');
                                });
                                larr.click(function () {
                                    putPhoto(i - 1);
                                });
                                rarr.click(function () {
                                    putPhoto(i + 1);
                                });
                                presentationDiv.animate({
                                    "width": $(photo).width(),
                                    "height": $(photo).height(),
                                    "margin-left": -(($(photo).width()) / 2),
                                    "margin-top": -(($(photo).height()) / 2)
                                }, animationSpeed, function () {
                                    loading.remove();
                                    photo.fadeIn();
                                });
                            });
                    };
                    putPhoto(index);
                });
            });
        };

        $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" + apiKey + "&photoset_id=" + photosetId + "&format=json&jsoncallback=?", jsonCallback);


    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new FlickrSlidesPlugin(this, options));
            }
        });
    };

})(jQuery, window);