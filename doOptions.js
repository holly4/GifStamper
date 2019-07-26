Array.prototype.unique = function () {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

function doOptions(settings) {
    fill();

    function fill() {
        $('#settings').empty();
        $('#settings').append('<tr><th>name</th><th>value</th></tr>');
        $('#no-save').prop("checked", settings.noStorage);
        for (const key of settings.keys) {
            const value = settings[key];
            console.log(key);
            console.log(settings[key]);
            if (value.hasOwnProperty(length) && value.length > 100) {
                text = formatBytes(value.length);
            } else {
                text = value;
            }
            $("<tr>")
                .append($("<td>").text(key))
                .append($("<td>").text(text))
                .appendTo($('#settings'));
        }
    }

    $('#btn-clear-all').off();
    $('#btn-clear-all').on('click', () => {
        settings.clear();
        fill();
    });

    $('#no-save').off();
    $('#no-save').on('click', () => {
        settings.noStorage = $('#no-save').prop('checked');
        if (settings.noStorage) {
            // retain properties
            var _skipIntro = settings.skipIntro;
            var _noStorage = settings.noStorage;
            var _skipDlWarn = settings.skipDlWarn;
            settings.clear();
            settings.skipIntro = _skipIntro;
            settings.noStorage = _noStorage;
            settings.skipDlWarn = _skipDlWarn;
            console.log("cleared storage", settings.keys);
        }
        fill();
    });
}