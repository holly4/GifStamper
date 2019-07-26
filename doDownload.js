function updateDownloadPane(gif, stamp, name) {
    let fileName = name.replace(/\.[^/.]+$/, "");
    $('#gif').attr('src', URL.createObjectURL(gif));
    $('#gif-size').text(formatBytes(gif.size));
    $('#gif-name').text(fileName + '-' + stamp + '-stamped.gif');
    $('#gif').show();
    $('#btn-download').attr('disabled', false);   
}

function doDownload(settings, imageData) { 
    if (settings.skipDlWarn) {
        $('.do-download .dl-warn').hide();
    } else {
        $('do-download .dl-warn').show();
    }

    $('#no-dl-warn').prop('checked', settings.skipDlWarn);
    $('#no-dl-warn').on('click', () => {
        settings.skipDlWarn= $('#no-dl-warn').prop('checked');
    });

    $('#btn-download').off();
    $('#btn-download').on('click', () => {
        download(imageData, $('#gif-name').text(), 'image/gif');
    });    
}
