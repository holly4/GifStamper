function doStamp(settings, stampImage, onComplete) {
    $('.do-stamp .error-text').hide();
    if (stampImage.src=="") {
        $('.do-stamp .error-text')
            .show()
            .text("Select an image before stamping");
        return;
    }
    if (settings.stamp=="") {
        $('.do-stamp .error-text')
            .show()
            .text("Select an stamp before stamping");
        return;
    }

    let canvas = $('.do-stamp canvas')[0];
    canvas.width = stampImage.width;
    canvas.height = stampImage.height;
    {
        let ctx = canvas.getContext('2d');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(stampImage, 0, 0, canvas.width, canvas.height);
    }

    let target = $('#image')[0];
    let stampFiles = getStampFiles(settings.stamp);
    let imgs = [];
    let imagesLoaded = 0;
    let delay = Number(stampFiles[0].split(/[_-]/).pop().split(".", 1)[0]);
    $('#delay').val(delay? delay : 70);

    $('#btn-stamp').off();
    $("#btn-stamp").on('click', () => 
    { 
        let delay = Number($('#delay').val()*10);
        performStamp(settings.stamp, settings.name, delay); 
    });

    for (let i = 0; i < stampFiles.length; i++) {
        let image = new Image();
        image.src = stampFiles[i];
        // use alt to hold index because images may not load in order
        image.alt = i;
        image.classList.add("stamp");

        image.onload = function () {
            let index = Number(image.alt);
            imgs[index] = this;
            if (index == 0) {
                let ctx = canvas.getContext('2d');
                ctx.drawImage(imgs[index], 0, 0, canvas.width, canvas.height);
            }
            if (++imagesLoaded == stampFiles.length) {
                $("#btn-stamp").prop('disabled', false);
            }
        }
    };

    function performStamp(stamp, name, delay) {
        console.log('performStamp: ', stamp, name, delay);
        $('result').hide();
        $('#btn-stamp').prop('disabled', true);
        $('#btn-download').prop('disabled', true);
        $("#frames").empty();
        let rendering = false;
        window.stamper.stamp(imgs, delay, canvas, target,

            // progress
            function (state, stats, canvas1) {
                console.log(stats);
                let text = "Created " 
                    + stats.stampedFrames + " of " + stats.totalFrames
                    + " frames in "  + (stats.genTime / 1000).toFixed(3) + "s"
                let percent = 100*stats.stampedFrames/stats.totalFrames + '%';
                $("#creation-text").text(text);
                $("#creation-bar").css('width', percent);
                if (canvas1) {
                    $("<td>")
                        .append(canvas1)
                        .appendTo($("#frames"));
                }
                if (state=="render") {
                    rendering = true;
                    function timer() {
                        if (rendering) {
                            $("#render-text").toggle();
                            setTimeout(timer, 500);
                        }                   
                    }
                    $("#render-text").text("Rendering GIF");
                    timer();
                }
            },

            // done
            function (gif, stats) {
                rendering = false;
                let text = 
                "Render complete. " 
                + formatBytes(gif.size) + " in " 
                + (stats.renderTime / 1000).toFixed(3) + "s";
                console.log(text);                
                $("#render-text").text(text);
                $("#render-text").show();
                $("#frames").children().show();
                if (onComplete) {
                    onComplete(gif, stamp, name);
                }
            });
    }
}