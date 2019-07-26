//$(window).on('load', function () {
$(document).ready(function () {
    class Settings {

        init(s) {
            this._keys = [];
            this._storage = s;
            this._width = typeof s.width == "string" ? JSON.parse(s.width) : 0;
            this._height = typeof s.height == "string" ? JSON.parse(s.height) : 0;
            this._src = typeof s.src == "string" ? s.src : "";
            this._stamp = typeof s.stamp == "string" ? s.stamp : "";
            this._name = typeof s.name == "string" ? s.name : "";
            this._skipIntro = typeof s.skipIntro == "string" ? JSON.parse(s.skipIntro) : false;
            this._noStorage = typeof s.noStorage == "string" ? JSON.parse(s.noStorage) : false;
            this._skipDlWarn = typeof s.skipDlWarn == "string" ? JSON.parse(s.skipDlWarn) : false;
        }

        constructor(s) {
            this.init(s);
        }

        get keys() {
            let result = [];
            for (const key in this._storage) {
                if (this._storage.hasOwnProperty(key)) {
                    result.push(key);
                }
            }
            return result;
        }

        get storage() {
            return this._storage;
        }

        get width() {
            return Number(this._width);
        }
        set width(_value) {
            if (_value === "boolean") {
                console.log("set width not boolean", _value);
            }
            this._width = _value;
            !this._noStorage && (this._storage.width = _value);
        }

        get height() {
            return Number(this._height);
        }
        set height(_value) {
            if (_value === "boolean") {
                console.log("set height not boolean", _value);
            }
            this._height = _value;
            !this._noStorage && (this._storage.height = _value);
        }

        get src() {
            return this._src;
        }
        set src(_value) {
            this._src = _value;
            !this._noStorage && (this._storage.src = _value);
        }

        get stamp() {
            return this._stamp;
        }
        set stamp(_value) {
            this._stamp = _value;
            !this._noStorage && (this._storage.stamp = _value);
        }

        get name() {
            return this._name;
        }
        set name(_value) {
            this._name = _value;
            !this._noStorage && (this._storage.name = _value);
        }

        get skipIntro() {
            return Boolean(this._skipIntro);
        }
        set skipIntro(_value) {
            if (_value === "boolean") {
                console.log("set skipIntro not boolean", _value);
            }
            this._skipIntro = _value;
            this._storage.skipIntro = _value;
        }

        get noStorage() {
            return Boolean((this._noStorage));
        }
        set noStorage(_value) {
            if (_value === "boolean") {
                console.log("set noStorage not boolean", _value);
            }
            this._noStorage = _value;
            this._storage.noStorage = _value;
        }

        get skipDlWarn() {
            return Boolean((this._skipDlWarn));
        }
        set skipDlWarn(_value) {
            if (_value === "boolean") {
                console.log("set skipDlWarn not boolean", _value);
            }
            this._skipDlWarn = _value;
            this._storage.skipDlWarn = _value;
        }

        clear() {
            this._storage.clear();
            this.init(this._storage);
        }
    }

    let settings = new Settings(localStorage);
    let stampedGif = "stampedGif";

    if (!settings.skipIntro) {
        show('.home');
    } else {
        show('.select-image');
    }

    function show(pane) {
        console.log('show ' + pane);
        $(".pane").hide();
        $(pane).show();
        $('.side-nav .active').removeClass('active');
        $('.side-nav ' + pane).addClass('active');

        switch (pane) {
            case '.home':
                doIntro(settings);
                break;
            case '.select-image':
                DoSelectImage(settings);
                break;
            case '.select-stamp':
                doSelectStamp(settings);
                break;
            case '.do-stamp':
                doStamp(settings, $("#image")[0], (gif, stamp, name) => {
                    stampedGif = gif;
                    updateDownloadPane(gif, stamp, name);
                });
                break;
            case '.do-download':
                doDownload(settings, stampedGif);
                break;
            case '.options':
                doOptions(settings);
                break;
            case '.tips':
                break;
            case '.qna':
                break;
            case '.credits':
                break;
        }
    }

    $(".side-nav .home").click(() => { show('.home'); });
    $(".side-nav .select-image").click(() => { show('.select-image'); });
    $(".side-nav .select-stamp").click(() => { show('.select-stamp'); });
    $(".side-nav .do-stamp").click(() => { show('.do-stamp'); });
    $(".side-nav .do-download").click(() => { show('.do-download'); });
    $(".side-nav .options").click(() => { show('.options'); });
    $(".side-nav .tips").click(() => { show('.tips'); });
    $(".side-nav .qna").click(() => { show('.qna'); });
    $(".side-nav .credits").click(() => { show('.credits'); });

    function doIntro(settings) {
        $('#no-intro').prop('checked', settings.skipIntro);
        $('#no-intro').on('click', () => {
            settings.skipIntro = $('#no-intro').prop('checked');
        });
    }
});

// and to pollute the global namespace
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}