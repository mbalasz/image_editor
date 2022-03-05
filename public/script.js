const fabric = require("fabric").fabric;

var canvas = new fabric.Canvas('canvas');

var rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red'
});

canvas.add(rect);

function handleFiles() {
    const fileList = this.files;
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.type.startsWith('image/')) {
            continue
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            var imageElement = new Image();
            imageElement.src = event.target.result;
            imageElement.onload = function () {
                var imgInstance = new fabric.Image(imageElement, {
                    left: 100,
                    top: 100,
                    width: 100,
                    height: 100,
                    angle: 30,
                    opacity: 0.85
                });
                canvas.add(imgInstance);
            }
        }
        reader.readAsDataURL(file)
    }
}

const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFiles, false);

const saveElemenet = document.getElementById("save")
saveElemenet.addEventListener("click", () => {
    let dataURL = canvas.toDataURL({
        format: 'png',
    })
    downloadDataUrl(dataURL);
})

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