function DoSelectImage(settings) {
    var input = $('#file-chooser');
    let image = $('#image')[0];
    input[0].style.opacity = 0;

    if (!settings.src || settings.src) {
        settings.name = "grid_550x400.png";
        settings.width = 550;
        settings.height = 400;
        setImage("./images/grid_550x400.png", "grid_550x400.png", 550, 400);
    } else {
        setImage(settings.src, settings.name, settings.width, settings.height);
    }

    $("#current_file").text(settings.name);

    input.on("change", () => {
        var reader = new FileReader();

        reader.onload = (e) => {
            settings.src = reader.result;
            setImage(reader.result, settings.name = input[0].files[0].name);
        }
        reader.readAsDataURL(input[0].files[0]);
    });
    
    $("#zoom-in").on("click", () => {
        $("#width").val(settings.width = image.width *= 2); 
        $("#height").val(settings.height = image.height *= 2);
    });

    $("#zoom-out").on("click", () => {
        $("#width").val(settings.width = image.width /= 2); 
        $("#height").val(settings.height = image.height /= 2);
    });

    $("#width").on("change", () => {
        if ($("#maintainAspect")[0].checked) {
            image.height = Math.round(img.width * Number(this.value) / image.width);
            $("#height").val(image.height);
        }
        img.width = this.value;
    });

    $("#height").on("change", () => {
        if ($("#maintainAspect").checked) {
            image.width = Math.round(image.width * Number(this.value) / image.width);
            $("#width").val(image.width);
        }
        image.height = this.value;
    });

    function setImage(src, name, width, height) {
        $('#filename').text(name);
        let img = new Image();
        img.src = src;
        img.onload = function () {
            image.src = img.src;
            image.width = width ? width : img.width;
            image.height = height ? height : img.height;
            $("#width").val(settings.width = image.width);
            $("#height").val(settings.height = image.height);
        }
    }
}