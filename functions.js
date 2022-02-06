import _ from "lodash";
import * as ss from 'simple-statistics'
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)




const c = new AudioContext;


//Input vars
var SoundType = "manual"; // This can be manual, piano, acoustic, edm or organ, when it is manual we use the other params, if it is any of the other we only use duration2 and threshold

// All this are in seconds, they are to parametrize the waveform
var attack = 0.06; 
var release = 0.1;
var decay = 0.05;
var sustain = 0.15;
//----------------
var oscType = "square"; // can be sine, square, sawtooth, triangle
var baseFreq = 440; // Base note freq
var threshold = 0.4; //Value from 0 to 1, it is a threshold to decide if a pixel is played or not, when 0 all pixels are played, higher values means only very edgy objets are played

//Filter
var filterTyp = "lowshelf"; // can be: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
var filtFreq = 500; // filter freq reference
var filtQslider = 4; // Some other parameter for the filter that I don't remember, have to be positive
var filtGain = 2; // Other parameter of the filter. can be either negative or positve

//Distortion
var ApplyDist = true; // true or false
var DistValue = 400; //Ammount of distortion
var DistOver = "2x";//Oversampling after distortion. Valid values are 'none', '2x', or '4x'. 

var NumFres = 12; //How many frequencies we want to have in total
var NumTimes = 50; //How many time steps we want to have in total 

var detune = true; //Detune the oscilators can only be true or false
var unisonWidth =  10; //Detune value, it can be a low number, from 1 to 20 more or less

var harmonics = [1,0.5,1,0.5,1]; // Weigths for the harmonics, the size of the array is the number of harmonics, and the values are the weigths.

var duration2 = 2; //Duration of notes when preset synth is used
//------------------------------------

var duration = (attack + release + decay + sustain ) *1000; // duration when manual
var norm = 0;

var piano = Synth.createInstrument('piano');
var acoustic = Synth.createInstrument('acoustic');
var organ = Synth.createInstrument('organ');
var edm = Synth.createInstrument('edm');

var NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

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
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('hihi').addEventListener('click',function () {
        if(SoundType == "piano" || SoundType == "acoustic" || SoundType == "organ" || SoundType == "edm" || SoundType == "manual"){ 
        playImage(normalizeImage(horizontalDerivative(medianFilter(data2Play)),NumFres,NumTimes));}
        else{alert("Please select a valid SoundType")}
    } 
    );
        

}

function playImage(data){
    //console.log(data);
    for(var j = 0; j <data[0].length; j++){
       
        amps = selectColumn(data,j);
        setTimeout(playOscillators, duration*j,amps);
        setTimeout(drawLine, duration*j, (j+ 1/2)*W/NumTimes);
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
    norm = 0;
    for(i=0; i< amps.length; i++){
        if(amps[i] > threshold){
            norm = norm + 1;
        }
    }
    for(i=0; i< amps.length; i++){
        if(amps[i] > threshold){
            norm = norm + 1;
            n = amps.length - i - 1;
            //console.log(n);
            f = baseFreq*Math.pow(2,n/12)

            if(SoundType == "manual"){
                harmonicsWeigths = math.multiply(harmonics,amps[i]);
                createHarmonics(f,harmonicsWeigths,detune);}

            else if(SoundType == "piano"){
                piano.play(NOTES[n], 4, duration2);}

            else if(SoundType == "acoustic"){
                acoustic.play(NOTES[n], 4, duration2);}

            else if(SoundType == "organ"){
                organ.play(NOTES[n], 4, duration2);}

            else if(SoundType == "edm"){
                edm.play(NOTES[n], 4, duration2);}

       
        }   
    }
}

function createOscillators(f, amplitud, detune){


    var o = c.createOscillator();
    var g = c.createGain();

    var filter = c.createBiquadFilter();
    var distortion = c.createWaveShaper();

    //Filter
    filter.type = filterTyp;
    filter.frequency.value = filtFreq;
    filter.Q.value = filtQslider;
    filter.gain.value = filtGain;

    //Distortion
    distortion.curve = makeDistortionCurve(DistValue);
    distortion.oversample = DistOver;       

    //Oscillator
    o.type = oscType;
    o.frequency.value = f;
    o.detune.value = detune;

    
    
    if(ApplyDist==true){
        o.connect(distortion)
        distortion.connect(filter);
        filter.connect(g);
        g.connect(c.destination);}
    else{
        o.connect(filter);
        filter.connect(g);
        g.connect(c.destination);}

    now = c.currentTime;
    
    //Waveform
    g.gain.setValueAtTime(0, now);   
    g.gain.linearRampToValueAtTime(amplitud/(norm), now+attack);
    g.gain.setTargetAtTime(sustain, now+attack, decay);
    g.gain.linearRampToValueAtTime(0, now+attack+release+decay+sustain);

    //Start
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

function normalizeImage(matrix,freqBins,timeStp){
    y_len = matrix.length;
    x_len = matrix[0].length;
    new_y = Math.floor(y_len/freqBins);
    new_x = Math.floor(x_len/timeStp);

    Q = 0;
    var data = [];
    for(var i=0; i<freqBins; i++) {
        data[i] = new Array(timeStp).fill(0);
    }
    //data = data / Math.max(data);
    //console.log(y_len);
    // tengo que definir indices para caminar por imagen
    for( var k = 0 ; k < freqBins; k++){
        for( var m = 0; m < timeStp; m++){
            for (var j = 0 ; j < new_y ; j++){
                for (var i = 0 ; i  < new_x ; i++){
                    data[k][m]+=matrix[k*new_y + j][m*new_x + i]/(new_x*new_y); 
                }
            }
            if (data[k][m]> Q){
                Q=data[k][m]
                //console.log(Q);
            }
        }
    }
    
    for( var k = 0 ; k < freqBins; k++){
        for( var m = 0; m < timeStp; m++){
            data[k][m]/=Q;
        }
    }
    return data;


}

function medianFilter(matrix){
    y_len = matrix.length;
    x_len = matrix[0].length;
    var data = [];
    for(var i=0; i<y_len; i++) {
        data[i] = new Array(x_len);
    }
    var knl = [];
    //console.log(y_len);
    //aca lleno los bordes de la imagen de salida con los bordes de la imagen de entrada
    for (var j = 0 ; j < y_len - 1 ; j++){
        data[j][0]=matrix[j][0]
        data[j][x_len - 1]=matrix[j][x_len - 1]
    }
    
    for (var i = 1 ; i  < x_len - 2 ; i++){
        data[0][i]=matrix[0][i]
        data[y_len - 1][i]=matrix[y_len - 1][i]
    }

    // aca aplico el filtro de mediana
     for (var j = 1 ; j < y_len-1 ; j++){
        for (var i = 1 ; i  < x_len-1 ; i++){
            knl = [matrix[j-1][i-1], matrix[j][i-1], matrix[j+1][i-1], matrix[j-1][i], matrix[j][i], matrix[j+1][i],
            matrix[j-1][i+1], matrix[j][i+1], matrix[j+1][i+1]];
            data[j-1][i-1]= median(knl);  
        }
    }
    return data;
    
}

function horizontalDerivative(matrix){
    y_len = matrix.length;
    x_len = matrix[0].length;
    var data = [];
    for(var i=0; i<y_len-2; i++) {
        data[i] = new Array(x_len-2);
    }
    /*
    var sbl_knl = [-1 , -2 ,-1 ,0, 0, 0, 1, 2, 1];
    //console.log(y_len);
     for (var j = 1 ; j < y_len-2 ; j++){
        for (var i = 1 ; i  < x_len-2 ; i++){
            data[j-1][i-1]=matrix[j-1][i-1]*sbl_knl[0] + matrix[j][i-1]*sbl_knl[1] + matrix[j+1][i-1]*sbl_knl[2] +
            matrix[j-1][i]*sbl_knl[3] + matrix[j][i]*sbl_knl[4] + matrix[j+1][i]*sbl_knl[5] +
            matrix[j-1][i+1]*sbl_knl[6] + matrix[j][i+1]*sbl_knl[7] + matrix[j+1][i+1]*sbl_knl[8]
              
        }

    
        //console.log(j);
     }
     */
    

    var sbl_knl = [-1 , -1 ,1, 1];
    //console.log(y_len);
     for (var j = 1 ; j < y_len-1 ; j++){
        for (var i = 1 ; i  < x_len-1 ; i++){
            data[j-1][i-1]=Math.abs(matrix[j-1][i-1]*sbl_knl[0] + matrix[j][i-1]*sbl_knl[1] + 
            matrix[j-1][i]*sbl_knl[2] + matrix[j][i]*sbl_knl[3]);       
        }
    }
    return data;
    
}

const median = arr => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};




function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };




export { showImage, playButton};
