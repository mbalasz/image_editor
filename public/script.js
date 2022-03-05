const fabric = require("fabric").fabric;

var rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red'
});

function containsImages(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            return true;
        }
    }
    return false;
}

async function handleFiles() {
    const files = this.files;
    console.log(files)
    if (!containsImages(files)) {
        return;
    }
    let canvas = await showCanvas();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
            var imageElement = new Image();
            imageElement.src = event.target.result;
            imageElement.onload = function () {
                var imgInstance = new fabric.Image(imageElement, {
                    left: 0,
                    top: 0,
                });
                imgInstance.scaleToHeight(canvas.getHeight())
                imgInstance.scaleToWidth(canvas.getWidth())
                canvas.add(imgInstance);
            }
        }
        reader.readAsDataURL(file)
    }
}
// showCanvas();
async function showCanvas() {
    return fetch('canvas.html')
        .then(response => response.text())
        .then(text => document.getElementById('content').innerHTML = text)
        .then(() => setUpCanvas())
}

function setUpCanvas() {
    let canvas = new fabric.Canvas('canvas');
    const imageSection = document.getElementById('image-section');
    canvas.setWidth(imageSection.clientWidth);
    canvas.setHeight(imageSection.clientHeight);
    const saveElemenet = document.getElementById("save")
    saveElemenet.addEventListener("click", () => {
        let dataURL = canvas.toDataURL({
            format: 'png',
        })
        downloadDataUrl(dataURL);
    })
    const sideImages = document.getElementsByClassName('side-image')
    for (let i = 0; i < sideImages.length; i++) {
        const image = sideImages[i];
        image.addEventListener('click', (e) => {
            onWatermarkClicked(e, canvas);
        })
    }
    setUpKeys(canvas)
    return canvas;
}

const inputElement = document.getElementById("file-upload");
inputElement.addEventListener("change", handleFiles, false);

async function downloadDataUrl(dataUrl) {
    const blob = await fetch(dataUrl).then(response => response.blob())
    const blobUrl = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = blobUrl;
    link.download = "aDefaultFileName.png";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(blobUrl);
    link.remove();
}

function onWatermarkClicked(event, canvas) {
    const element = event.srcElement;
    const imageInstance = new fabric.Image(element, {
        top: 0,
        left: 0
    })
    canvas.add(imageInstance);
}

function setUpKeys(canvas) {
    document.onkeydown = (e) => {
        if (e.key === "Backspace" || e.key === "Delete") {
            console.log(e.key)
            canvas.getActiveObjects().forEach((obj) => {
                canvas.remove(obj)
            });
            canvas.discardActiveObject().renderAll()
        }
    }
}