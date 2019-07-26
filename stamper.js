(function () {

    function createThumbailCanvas(source, width, height) {
        var result = $("<canvas>")
        .attr("width", width)
        .attr("height", height)[0];
        let ctx = result.getContext("2d")
        ctx.scale(120/source.width, 90/source.height); 
        ctx.drawImage(source, 0, 0);
        return result;
    }

    window.stamper = {
        stamp: function (stampFrames, delay, canvas, target, progress, finished) {
            let stats = {
                totalFrames: 0,
                stampedFrames: 0,
                genTime: 0,
                renderTime: 0,
            };

            let startTime = new Date();
            let startRender = 0;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgb(255,255,255)";
            let gif = new GIF({
                workers: 2,
                quality: 10
            });

            gif.on('finished', function (blob) {
                stats.renderTime = new Date() - startRender;
                finished(blob, Object.assign({}, stats));
            });

            stats.totalFrames = stampFrames.length;
            let index = 1;

            // add the first frame which will be the final canvas state
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(stampFrames[0], 0, 0, canvas.width, canvas.height)
            gif.addFrame(canvas, { delay: delay });
            stats.stampedFrames++;
            stats.genTime = new Date() - startTime
            progress("add", Object.assign({}, stats), createThumbailCanvas(canvas, 120, 96));
            var firstFrameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            (function doStamp() {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(stampFrames[index], 0, 0, canvas.width, canvas.height);
                gif.addFrame(ctx, { delay: delay, copy: true });
                stats.stampedFrames++;
                stats.genTime = new Date() - startTime;
                progress("add", Object.assign({}, stats), createThumbailCanvas(canvas, 120, 96));
                if (++index < stampFrames.length) {
                    // for all frames
                    setTimeout(doStamp, 100);
                }
                else {
                    // content for first frame
                    ctx.putImageData(firstFrameData, 0, 0);
                    startRender = new Date();
                    stats.genTime = startRender - startTime;
                    progress("render", Object.assign({}, stats), null);
                    gif.render();
                }
            })();
        }
    };
})()