function doSelectStamp(settings) {
    let stampCount = Object.keys(stampMeta).length;
    let names = [];
    let initialized = $("#stamps").children().length > 0;
    // make the little kitty stamp the default, because why not?
    let selected = settings.stamp === "" ? "littlekitty" : settings.stamp;

    if (!initialized) {
        const l1 = Object.keys(stampMeta).filter((n)=>{ return n == selected });
        const l2 = Object.keys(stampMeta).filter((n)=>{ return n != selected }).sort();
        const ordered = l1.concat(l2);
        console.log(ordered);

        for (let name of ordered) {
            if (!settings.stamp || settings.stamp == "") {
                settings.stamp = name;
            }
            addStamp(name, stampMeta[name]);
        }
    }

    function addStamp(name, stamp) {
        for (let file of stamp) {
            if (file.startsWith("0000_")
                && "png" == file.split('.').pop().toLowerCase()) {
                var fileSpec = "./stamps/" + name + "/" + file;

                let img = new Image();
                img.src = fileSpec;
                img.onload = function () {
                    let index = names.length;
                    names.push(name);
                    let option = $('<option>')
                        .attr('data-img-src', img.src)
                        .attr('value', name)
                        .attr('data-img-class', 'stamp')
                        .addClass('stamp')
                        .text(name)

                    option.appendTo($("#stamps"));

                    if ($("#stamps").children().length == stampCount) {
                        $("#stamp").val(selected);
                        $("select").imagepicker(
                            {
                                changed: (oldValues, newValues, event) => {
                                    // todo handle oldValues
                                    if (newValues.length) {
                                        let name = newValues[0];
                                        settings.stamp = name;
                                        $("#stamp").empty();
                                        for (let file of getStampFiles(name)) {
                                            $("<td>")
                                                .append($("<img>")
                                                    .attr("src", file)
                                                    .addClass("stamp"))
                                                .appendTo($("#stamp"));
                                        }
                                    }
                                }
                            });
                    }
                }
                break;
            }
        }
    }
}