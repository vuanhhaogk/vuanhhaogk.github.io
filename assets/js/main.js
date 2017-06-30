document.addEventListener('DOMContentLoaded', function(){
    var md = new MobileDetect(window.navigator.userAgent);
    if (!md.mobile() && !md.tablet()){ // desktop browser
        var ls = []
        var as = document.getElementsByTagName('a')
        for (var i = 0; i < as.length; i++)
            ls.push(as[i])
        var fs = document.getElementsByTagName('form') || []
        for (var i = 0; i < fs.length; i++)
            ls.push(fs[i])
        var item, r;
        console.log(ls);
        for (var i = 0; i < ls.length; i++){
            item = ls[i].href || ls[i].action;
            r = (/\/\/(.+?)\/.*/g).exec(item);
            console.log(r && r[1] !== location.host);
            if (r && r[1] !== location.host)
                ls[i].setAttribute('target', '_blank');
        }
    };
});
