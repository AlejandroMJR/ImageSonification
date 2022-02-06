import _ from "lodash";
import * as ss from 'simple-statistics'
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)




const c = new AudioContext;

var attack = 0.1;
var release = 0.2;
var decay = 0.1;
var sustain = 0.3;

var filtFreq = 500;
var Qslider = 4;

var detune = false;
var unisonWidth =  10;

var duration = (attack + release + decay + sustain ) *1000;

var harmonics = [1,2,1,2,1];


var W;
var H;
var imageData;
var data2Play;
var A;


const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const canv = document.getElementById("bar")
const context = canv.getContext("2d")

function drawLine(x){
    context.beginPath();
    context.clearRect(0,0,canv.width,canv.height);
    context.moveTo(x,0);
    context.lineTo(x, canv.height);
    context.stroke();    
}

function playButton(){
    document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
}

function playImage(data){
    //console.log(data[0].length);
    for(var j = 0; j <data[0].length; j++){
        amps = selectColumn(data,j);
        setTimeout(playOscillators, duration*j,amps);
        setTimeout(drawLine, duration*j, (j+ 1/2)*W/20);
    }
}

function image2OneChannel(imgData, height, width){
    var data = [];
    for(var i=0; i<height; i++) {
        data[i] = new Array(width);
    }
    for(var y = 0; y< height; y++) {
        for(var x = 0; x< width; x++) {
            var pos = (y*width + x)*4;
            data[y][x] = Math.floor((imgData[pos] + imgData[pos+1] + imgData[pos+2] ) / 3) ;
            
        }
    } 
    return data;   
}

function selectColumn(array, number) {
    var col = array.map(function(value,index) { return value[number]; });
    return col; 
}

// function generateImg(width, height){
//     var buffer = new Uint8ClampedArray(width* height* 4);
//     for(var y = 0; y< height; y++) {
//         for(var x = 0; x< width; x++) {
//             var pos = (y*width + x)*4;
//             buffer[pos] = Math.floor(Math.random() * 256);
//             buffer[pos+1] = Math.floor(Math.random() * 256);
//             buffer[pos+2] = Math.floor(Math.random() * 256);
//             buffer[pos+3] = 255;
//         }
//     }
//     return buffer;
// }

function playOscillators(amps){
    //console.log(amps.length);
    for(i=0; i< amps.length; i++){
        if(amps[i] > 80){
            
            f = 440*Math.pow(2,i/12)
            harmonicsWeigths = math.multiply(harmonics,amps[i]);
            console.log(amps[i]);
            
            createHarmonics(f,harmonicsWeigths,detune);

            //createOscillators(f,amps[i], 0); 
            //createOscillators(f,amps[i], -unisonWidth); 
            //createOscillators(f,amps[i], unisonWidth); 

        
        }    
    }
}

function createOscillators(f, amplitud, detune){


    var o = c.createOscillator();
    var g = c.createGain();

    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filtFreq;
    filter.Q.value = Qslider;

    o.type = "sawtooth";
    o.frequency.value = f;
    o.detune.value = detune;
    o.connect(filter);
    filter.connect(g);
    g.connect(c.destination);

    now = c.currentTime;
    g.gain.setValueAtTime(0, now);
    //console.log(f)    
    g.gain.linearRampToValueAtTime(amplitud/(255*12), now+attack);
    g.gain.setTargetAtTime(sustain, now+attack, decay);
    g.gain.linearRampToValueAtTime(0, now+attack+release+decay+sustain);
    o.start(now);
    o.stop(now+attack+release+decay+sustain);
}

function createHarmonics(f, harmonicsWeigths, detune){
    //createOscillators(f,amps[i], 0); 
    
    for(var i=0; i<harmonicsWeigths.length ; i++){
        //console.log(harmonicsWeigths.length);
        createOscillators(f*(i+1),harmonicsWeigths[i], 0);
        if (detune == true){
            createOscillators(f*(i+1),harmonicsWeigths[i], -unisonWidth); 
            createOscillators(f*(i+1),harmonicsWeigths[i], unisonWidth);
        }
    }
}



//get image from user and plot

function showImage(fileReader) {
    var img = document.getElementById("myImage");
    img.onload = () => getImageData(img);
    img.src = fileReader.result;
}

function getImageData(img) {
    W = img.width;
    H = img.height;
    canvas.width = W;
    canvas.height = H;
    canv.height = 50;
    canv.width = W;
    canv.style.left = img.x;
    canv.style.top = img.y + img.height + 30;
    canv.style.position = "absolute";
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, W, H).data;
    data2Play =  image2OneChannel(imageData, H, W );
    data2Play = math.abs(math.add(data2Play, -modeOfMatrix(data2Play)));
    //console.log(data2Play);
    //console.log("image data:", imageData);
    //getRGB(imageData);
 }

 function reduceImage(matrix){
     y_len = matrix.length;
     x_len = matrix[0].length;
     //console.log(y_len);
     A = new Array(12).fill(0);
     temp = new Array(y_len);
     for (var i = 0; i < A.length ;i++){
        A[i] = new Array(20).fill(0);
    }
    for (var i = 0; i < temp.length ;i++){
        temp[i] = new Array(20).fill(0);
    }
     for (var j = 0; j < y_len ; j++){
        for (var i = 0;i  < 20 ; i++){
            avg_row = matrix[j].slice(i*Math.floor(x_len/20),(i+1)*Math.floor(x_len/20)).reduce((a,b) => a + b, 0) / Math.floor(x_len/20);
            temp[j][i] = avg_row;   
        }
        //console.log(j);
     }
     for (var i = 0; i < 20; i++){
         for (var j = 0 ; j < 12 ; j++){
            avg_col = selectColumn(temp, i).slice(j*Math.floor(y_len/12),(j+1)*Math.floor(y_len/12)).reduce((a,b) => a + b, 0) / Math.floor(y_len/12);
            A[j][i] = avg_col;
         }
    }
    return A;
 }

 function modeOfMatrix(matrix){
    a1d = [].concat(...matrix);
    mode = ss.mode(a1d);
    return mode;
 }
// function getRGB(imgData) {
//     for (var i=0;i<imgData.length;i+=4) {
//         R[i/4] = imgData[i];
//         G[i/4] = imgData[i+1];
//         B[i/4] = imgData[i+2];
//     }
// }

export { showImage, playButton};
