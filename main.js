import { showImage, playButton, pianoButton, acousticButton, edmButton, organButton, manualButton, sineButton, squareButton, sawtoothButton, triangleButton} from "./functions";



document.getElementById('myFile').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage(fr);
        fr.readAsDataURL(files[0]);
    }
}



playButton();
pianoButton();
acousticButton();
edmButton();
organButton();
manualButton();
sineButton();
squareButton();
sawtoothButton();
triangleButton();