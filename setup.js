var canvasPos = {}
function createScaledCanvas(canvasScale) {
    var cnv = createCanvas(windowWidth*canvasScale, windowHeight*canvasScale);
    canvasPos.x = (windowWidth - width) / 2;
    canvasPos.y = (windowHeight - height) / 2;
    cnv.position(canvasPos.x, canvasPos.y);
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
}