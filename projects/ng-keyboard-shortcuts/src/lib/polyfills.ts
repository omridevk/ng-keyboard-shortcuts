(function() {
    if (typeof Element === "undefined") {
        return;
    }
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            let el = this;

            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
})();

if (!(Array.prototype as any).flat) {
    (Array.prototype as any).flat = function(depth) {
        var flattend = [];
        (function flat(array, depth) {
            for (let el of array) {
                if (Array.isArray(el) && depth > 0) {
                    flat(el, depth - 1);
                } else {
                    flattend.push(el);
                }
            }
        })(this, Math.floor(depth) || 1);
        return flattend;
    };
}

if (!(Array.prototype as any).flatMap) {
    (Array.prototype as any).flatMap = function() {
        return Array.prototype.map.apply(this, arguments).flat(1);
    };
}

