/*!
 * Veil.js 0.0.1 - https://github.com/yckart/Veil.js
 * Remake of the iOS7 and Android sliding bars.
 *
 * @see http://stackoverflow.com/q/18604022/
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/01/28
 **/

(function (window, document, $) {

    window.Veil = function (elem, options) {

        var defaults = {
            offset: 0,
            prop: 'top',
            onScroll: function (elem, threshold) {},
            isHidden: function (elem, threshold) {},
            isVisible: function (elem, threshold) {}
        };

        var lastScroll = 0;
        var treshold = 0;

        // merge the defaults with the passed options
        for (var key in options) {
            defaults[key] = options[key];
        }

        // if the defaults.prop is 'top' or 'bottom'
        // we need the height, otherwise the width
        var sizeProp = /to/i.test(defaults.prop) ? 'offsetHeight' : 'offsetWidth';

        Veil.scroll = function () {
            var scrollOffset = document.documentElement.scrollTop || document.body.scrollTop,
                elemSize = elem[sizeProp] + defaults.offset,
                diff = scrollOffset - lastScroll;

            treshold = (treshold + diff > elemSize) ? elemSize : (scrollOffset < 0) ? 0 : treshold + diff;
            treshold = (treshold < 0) ? 0 : treshold;

            elem.style[defaults.prop] = (-treshold) + 'px';
            defaults.onScroll(elem, treshold);
            if (!treshold) defaults.isVisible(elem, treshold);
            if (treshold === elemSize) defaults.isHidden(elem, treshold);

            lastScroll = scrollOffset;
        };

        Veil.scroll();

        // modern browsers
        if (window.addEventListener) return window.addEventListener('scroll', Veil.scroll);

        // ie8 and below
        window.attachEvent('onscroll', Veil.scroll);
    };

    // if jquery or zepto is present,
    // add a function to their prototype
    if ($) $.fn.veil = function (options) {
        return this.each(function () {
            Veil(this, options);
        });
    };

}(this, document, this.jQuery || this.Zepto));