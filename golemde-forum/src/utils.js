/**
 * linear interpolation between two values a and b
 * @param {number} a
 * @param {number} b
 * @param {number} u controls amount of a/b and is in range [0.0,1.0]
 */
export function lerp(a, b, u) {
    return (1 - u) * a + u * b;
};
  
/**
 * Fades the color of a property on an element over a given period.
 * 
 * @param {*} element the element to alter the property on
 * @param {string} property the css property to change, e.g. 'color'
 * @param {*} start the start color in this format {r:249, g:249, b:249}
 * @param {*} end the end color in this format {r:249, g:249, b:249}
 * @param {number} duration how long in ms the fade should be
 */
export function fade(element, property, start, end, duration) {
    var interval = 10;
    var steps = duration / interval;
    var step_u = 1.0 / steps;
    var u = 0.0;
    var theInterval = setInterval(function() {
      if (u >= 1.0) {
        clearInterval(theInterval)
      }
      var r = parseInt(lerp(start.r, end.r, u));
      var g = parseInt(lerp(start.g, end.g, u));
      var b = parseInt(lerp(start.b, end.b, u));
      var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
      element.style.setProperty(property, colorname);
      u += step_u;
    }, interval);
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * clamp((x * 255), 0, 255)
 * 
 * @param {number} num The number to be clamped
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 */
export function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

/**
 * Inserts the given string as css code into the head of the document.
 * 
 * @param {string} code the css code to insert
 */
export function insertCss( code ) {
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = code;
    } else {
        // Other browsers
        style.innerHTML = code;
    }
    document.getElementsByTagName("head")[0].appendChild( style );
}