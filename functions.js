import _ from "lodash";
import * as ss from 'simple-statistics'
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)




const c = new AudioContext;


//Input vars
var SoundType = "acoustic"; // This can be manual, piano, acoustic, edm or organ, when it is manual we use the other params, if it is any of the other we only use duration2, ScaleType, NumTimes and threshold
var ScaleType = "Chromatic";  // Can be any from the object "Scales" defined above


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
var filterTyp = "lowpass"; // can be: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
var filtFreq = 1000; // filter freq reference
var filtQslider = -4; // Some other parameter for the filter that I don't remember, have to be positive
var filtGain = 0; // Other parameter of the filter. can be either negative or positve

//Distortion
var ApplyDist = "false"; // true or false
var DistValue = 0; //Ammount of distortion
var DistOver = "none";//Oversampling after distortion. Valid values are 'none', '2x', or '4x'.

var NumFreqs = 12; //How many frequencies we want to have in total
var NumTimes = 20; //How many time steps we want to have in total 

var detune = true; //Detune the oscilators can only be true or false
var unisonWidth =  1; //Detune value, it can be a low number, from 1 to 20 more or less

var harmonics = [1,0.5,1,0.5,1]; // Weigths for the harmonics, the size of the array is the number of harmonics, and the values are the weigths.

var duration2 = 1; //Duration of notes when preset synth is used

// harmonics values

var harmonic1;
var harmonic2;
var harmonic3;
var harmonic4;
var harmonic5;

//------------------------------------

var duration; // duration when manual
var norm = 0;

var piano = Synth.createInstrument('piano');
var acoustic = Synth.createInstrument('acoustic');
var organ = Synth.createInstrument('organ');
var edm = Synth.createInstrument('edm');

//Scales
const Scales = {
    Chromatic : ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],
    Ionian    : ["C","D","E","F","G","A","B","C"],
    Dorian    : ["D","E","F","G","A","B","C","D"],
    Phrygian  : ["E","F","G","A","B","C","D","E"],
    Lydian    : ["F","G","A","B","C","D","E","F"],
    Mixo      : ["G","A","B","C","D","E","F","G"],
    Aeolian   : ["A","B","C","D","E","F","G","A"],
    Locrian   : ["B","C","D","E","F","G","A","B"],
    Melodic   : ["C","D","D#","F","G","A","B","C"],
    Harmonic  : ["D","E","F","G","A","A#","C#","D"],
    Blues     : ["E","G","A","A#","B","D","E"],
    FPenta    : ["F","G","A","C","D","F"],
    CPenta    : ["C","D","E","G","A","C"],
    GPenta    : ["G","A#","C","D","F","G"],
    APenta    : ["A","C","D","E","G","A"]

};

var W;
var Waux;
var H;
var imageData;
var data2Play;
var A;

// Dial Button
// Duration2 Button

var knobPositionXDuration2;
var knobPositionYDuration2;
var mouseXDuration2;
var mouseYDuration2;
var knobCenterXDuration2;
var knobCenterYDuration2;
var adjacentSideDuration2;
var oppositeSideDuration2;
var currentRadiansAngleDuration2;
var getRadiansInDegreesDuration2;
var finalAngleInDegreesDuration2;
var volumeSettingDuration2;
var tickHighlightPositionDuration2;
var startingTickAngleDuration2 = -135;
var tickContainerDuration2 = document.getElementById("tickContainer-duration2");
var volumeKnobDuration2 = document.getElementById("knob-duration2");
var boundingRectangleDuration2 = volumeKnobDuration2.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// NumTimes

var knobPositionXNumTimes;
var knobPositionYNumTimes;
var mouseXNumTimes;
var mouseYNumTimes;
var knobCenterXNumTimes;
var knobCenterYNumTimes;
var adjacentSideNumTimes;
var oppositeSideNumTimes;
var currentRadiansAngleNumTimes;
var getRadiansInDegreesNumTimes;
var finalAngleInDegreesNumTimes;
var volumeSettingNumTimes;
var tickHighlightPositionNumTimes;
var startingTickAngleNumTimes = -135;
var tickContainerNumTimes = document.getElementById("tickContainer-numTimes");
var volumeKnobNumTimes = document.getElementById("knob-numTimes");
var boundingRectangleNumTimes = volumeKnobNumTimes.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Threshold

var knobPositionXThreshold;
var knobPositionYThreshold;
var mouseXThreshold;
var mouseYThreshold;
var knobCenterXThreshold;
var knobCenterYThreshold;
var adjacentSideThreshold;
var oppositeSideThreshold;
var currentRadiansAngleThreshold;
var getRadiansInDegreesThreshold;
var finalAngleInDegreesThreshold;
var volumeSettingThreshold;
var tickHighlightPositionThreshold;
var startingTickAngleThreshold = -135;
var tickContainerThreshold = document.getElementById("tickContainer-threshold");
var volumeKnobThreshold = document.getElementById("knob-threshold");
var boundingRectangleThreshold = volumeKnobThreshold.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Attack

var knobPositionXAttack;
var knobPositionYAttack;
var mouseXAttack;
var mouseYAttack;
var knobCenterXAttack;
var knobCenterYAttack;
var adjacentSideAttack;
var oppositeSideAttack;
var currentRadiansAngleAttack;
var getRadiansInDegreesAttack;
var finalAngleInDegreesAttack;
var volumeSettingAttack;
var tickHighlightPositionAttack;
var startingTickAngleAttack = -135;
var tickContainerAttack = document.getElementById("tickContainer-attack");
var volumeKnobAttack = document.getElementById("knob-attack");
var boundingRectangleAttack = volumeKnobAttack.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Release

var knobPositionXRelease;
var knobPositionYRelease;
var mouseXRelease;
var mouseYRelease;
var knobCenterXRelease;
var knobCenterYRelease;
var adjacentSideRelease;
var oppositeSideRelease;
var currentRadiansAngleRelease;
var getRadiansInDegreesRelease;
var finalAngleInDegreesRelease;
var volumeSettingRelease;
var tickHighlightPositionRelease;
var startingTickAngleRelease = -135;
var tickContainerRelease = document.getElementById("tickContainer-release");
var volumeKnobRelease = document.getElementById("knob-release");
var boundingRectangleRelease = volumeKnobRelease.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Decay

var knobPositionXDecay;
var knobPositionYDecay;
var mouseXDecay;
var mouseYDecay;
var knobCenterXDecay;
var knobCenterYDecay;
var adjacentSideDecay;
var oppositeSideDecay;
var currentRadiansAngleDecay;
var getRadiansInDegreesDecay;
var finalAngleInDegreesDecay;
var volumeSettingDecay;
var tickHighlightPositionDecay;
var startingTickAngleDecay = -135;
var tickContainerDecay = document.getElementById("tickContainer-decay");
var volumeKnobDecay = document.getElementById("knob-decay");
var boundingRectangleDecay = volumeKnobDecay.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Sustain

var knobPositionXSustain;
var knobPositionYSustain;
var mouseXSustain;
var mouseYSustain;
var knobCenterXSustain;
var knobCenterYSustain;
var adjacentSideSustain;
var oppositeSideSustain;
var currentRadiansAngleSustain;
var getRadiansInDegreesSustain;
var finalAngleInDegreesSustain;
var volumeSettingSustain;
var tickHighlightPositionSustain;
var startingTickAngleSustain = -135;
var tickContainerSustain = document.getElementById("tickContainer-sustain");
var volumeKnobSustain = document.getElementById("knob-sustain");
var boundingRectangleSustain = volumeKnobSustain.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Frequency

var knobPositionXFrequency;
var knobPositionYFrequency;
var mouseXFrequency;
var mouseYFrequency;
var knobCenterXFrequency;
var knobCenterYFrequency;
var adjacentSideFrequency;
var oppositeSideFrequency;
var currentRadiansAngleFrequency;
var getRadiansInDegreesFrequency;
var finalAngleInDegreesFrequency;
var volumeSettingFrequency;
var tickHighlightPositionFrequency;
var startingTickAngleFrequency = -135;
var tickContainerFrequency = document.getElementById("tickContainer-frequency");
var volumeKnobFrequency = document.getElementById("knob-frequency");
var boundingRectangleFrequency = volumeKnobFrequency.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// FiltSlid

var knobPositionXFiltSlid;
var knobPositionYFiltSlid;
var mouseXFiltSlid;
var mouseYFiltSlid;
var knobCenterXFiltSlid;
var knobCenterYFiltSlid;
var adjacentSideFiltSlid;
var oppositeSideFiltSlid;
var currentRadiansAngleFiltSlid;
var getRadiansInDegreesFiltSlid;
var finalAngleInDegreesFiltSlid;
var volumeSettingFiltSlid;
var tickHighlightPositionFiltSlid;
var startingTickAngleFiltSlid = -135;
var tickContainerFiltSlid = document.getElementById("tickContainer-filtSlid");
var volumeKnobFiltSlid = document.getElementById("knob-filtSlid");
var boundingRectangleFiltSlid = volumeKnobFiltSlid.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// FiltGain

var knobPositionXFiltGain;
var knobPositionYFiltGain;
var mouseXFiltGain;
var mouseYFiltGain;
var knobCenterXFiltGain;
var knobCenterYFiltGain;
var adjacentSideFiltGain;
var oppositeSideFiltGain;
var currentRadiansAngleFiltGain;
var getRadiansInDegreesFiltGain;
var finalAngleInDegreesFiltGain;
var volumeSettingFiltGain;
var tickHighlightPositionFiltGain;
var startingTickAngleFiltGain = -135;
var tickContainerFiltGain = document.getElementById("tickContainer-filtGain");
var volumeKnobFiltGain = document.getElementById("knob-filtGain");
var boundingRectangleFiltGain = volumeKnobFiltGain.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// DistValue

var knobPositionXDistValue;
var knobPositionYDistValue;
var mouseXDistValue;
var mouseYDistValue;
var knobCenterXDistValue;
var knobCenterYDistValue;
var adjacentSideDistValue;
var oppositeSideDistValue;
var currentRadiansAngleDistValue;
var getRadiansInDegreesDistValue;
var finalAngleInDegreesDistValue;
var volumeSettingDistValue;
var tickHighlightPositionDistValue;
var startingTickAngleDistValue = -135;
var tickContainerDistValue = document.getElementById("tickContainer-distValue");
var volumeKnobDistValue = document.getElementById("knob-distValue");
var boundingRectangleDistValue = volumeKnobDistValue.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// NumFreqs

var knobPositionXNumFreqs;
var knobPositionYNumFreqs;
var mouseXNumFreqs;
var mouseYNumFreqs;
var knobCenterXNumFreqs;
var knobCenterYNumFreqs;
var adjacentSideNumFreqs;
var oppositeSideNumFreqs;
var currentRadiansAngleNumFreqs;
var getRadiansInDegreesNumFreqs;
var finalAngleInDegreesNumFreqs;
var volumeSettingNumFreqs;
var tickHighlightPositionNumFreqs;
var startingTickAngleNumFreqs = -135;
var tickContainerNumFreqs = document.getElementById("tickContainer-numFreqs");
var volumeKnobNumFreqs = document.getElementById("knob-numFreqs");
var boundingRectangleNumFreqs = volumeKnobNumFreqs.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// UnisonWidth

var knobPositionXUnisonWidth;
var knobPositionYUnisonWidth;
var mouseXUnisonWidth;
var mouseYUnisonWidth;
var knobCenterXUnisonWidth;
var knobCenterYUnisonWidth;
var adjacentSideUnisonWidth;
var oppositeSideUnisonWidth;
var currentRadiansAngleUnisonWidth;
var getRadiansInDegreesUnisonWidth;
var finalAngleInDegreesUnisonWidth;
var volumeSettingUnisonWidth;
var tickHighlightPositionUnisonWidth;
var startingTickAngleUnisonWidth = -135;
var tickContainerUnisonWidth = document.getElementById("tickContainer-unisonWidth");
var volumeKnobUnisonWidth = document.getElementById("knob-unisonWidth");
var boundingRectangleUnisonWidth = volumeKnobUnisonWidth.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// BaseFreq

var knobPositionXBaseFreq;
var knobPositionYBaseFreq;
var mouseXBaseFreq;
var mouseYBaseFreq;
var knobCenterXBaseFreq;
var knobCenterYBaseFreq;
var adjacentSideBaseFreq;
var oppositeSideBaseFreq;
var currentRadiansAngleBaseFreq;
var getRadiansInDegreesBaseFreq;
var finalAngleInDegreesBaseFreq;
var volumeSettingBaseFreq;
var tickHighlightPositionBaseFreq;
var startingTickAngleBaseFreq = -135;
var tickContainerBaseFreq = document.getElementById("tickContainer-baseFreq");
var volumeKnobBaseFreq = document.getElementById("knob-baseFreq");
var boundingRectangleBaseFreq = volumeKnobBaseFreq.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)


//


const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const canv = document.getElementById("bar")
//const context = canv.getContext("2d")

function drawLine(x){
    /*console.log(x,canv.width);
    context.beginPath();
    context.clearRect(0,0,canv.width,canv.height);
    context.moveTo(x,0);
    context.lineTo(x, canv.height);
    context.stroke();    */
    var img = document.getElementById("myImage");
    var imagePercentage = img.width/window.screen.width;
    canv.style.width = x/img.width*imagePercentage*100 + 0.6 + "%";
    canv.style.height = 30 + "px";
    canv.style.backgroundColor = "#F6D0B1";
    canv.style.border = 1 + "px" + " solid black";
    canv.style.borderRadius = 12 + "px";
}

function playButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });

    //--------- Play Code --------//

    document.getElementById('hihi').addEventListener('click',function () {

        // Scales Select

        var e = document.getElementById("ScaleSelect");
        var value = e.options[e.selectedIndex].value;
        ScaleType = value;
        console.log(value);

         // DistOver Select

         var d = document.getElementById("DistOverSelect");
         var distOverValue = d.options[d.selectedIndex].value;
         DistOver = distOverValue;
         console.log(distOverValue);

        // Filter Select

        var f = document.getElementById("FilterSelect");
        var filterValue = f.options[f.selectedIndex].value;
        filterTyp = filterValue;
        console.log(filterTyp);
     
        // Get Armonics
        harmonic1 = document.getElementById('Harmonic1').value;
        harmonic2 = document.getElementById('Harmonic2').value;
        harmonic3 = document.getElementById('Harmonic3').value;
        harmonic4 = document.getElementById('Harmonic4').value;
        harmonic5 = document.getElementById('Harmonic5').value;

        harmonics[0]=harmonic1;
        harmonics[1]=harmonic2;
        harmonics[2]=harmonic3;
        harmonics[3]=harmonic4;
        harmonics[4]=harmonic5;

        if(SoundType == "piano" || SoundType == "acoustic" || SoundType == "organ" || SoundType == "edm" || SoundType == "manual"){
            if(SoundType != "manual"){
                NumFreqs = Scales[ScaleType].length;
            }
        playImage(normalizeImage(horizontalDerivative(medianFilter(data2Play)),NumFreqs,NumTimes));
        }
        else{
            alert("Please select a valid SoundType")
        }
    } 
    );
        

}

function pianoButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Piano').addEventListener('click',function () {
        $(document).ready(function() {
            $('#HideManualParameters1').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDistortion').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideWaveform').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideFilter').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDuration2').delay(1).fadeOut(100); 
          });
          $(document).ready(function() {
            $('#HideScales').delay(1).fadeOut(100); 
          });
        SoundType = "piano";
    } 
    );
}

function acousticButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Acoustic').addEventListener('click',function () {
        $(document).ready(function() {
            $('#HideManualParameters1').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDistortion').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideWaveform').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideFilter').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDuration2').delay(1).fadeOut(100); 
          });
          $(document).ready(function() {
            $('#HideScales').delay(1).fadeOut(100); 
          });
        SoundType = "acoustic";
    } 
    );
}

function edmButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Edm').addEventListener('click',function () {
        $(document).ready(function() {
            $('#HideManualParameters1').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDistortion').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideWaveform').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideFilter').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDuration2').delay(1).fadeOut(100); 
          });
          $(document).ready(function() {
            $('#HideScales').delay(1).fadeOut(100); 
          });
        SoundType = "edm";
    } 
    );
}

function organButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Organ').addEventListener('click',function () {
        $(document).ready(function() {
            $('#HideManualParameters1').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDistortion').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideWaveform').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideFilter').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideDuration2').delay(1).fadeOut(100); 
          });
          $(document).ready(function() {
            $('#HideScales').delay(1).fadeOut(100); 
          });
        SoundType = "organ";
    } 
    );
}

function manualButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Manual').addEventListener('click',function () {
        SoundType = "manual";
        console.log(SoundType);
        $(document).ready(function() {
            $('#HideManualParameters1').delay(1).fadeOut(100); 
          });
          $(document).ready(function() {
            $('#HideDistortion').delay(1).fadeOut(100); 
          });  
          $(document).ready(function() {
            $('#HideWaveform').delay(1).fadeOut(100); 
          });  
        $(document).ready(function() {
            $('#HideFilter').delay(1).fadeOut(100); 
        });
          $(document).ready(function() {
            $('#HideDuration2').delay(1).fadeIn(100); 
          });
          $(document).ready(function() {
            $('#HideScales').delay(1).fadeIn(100); 
          });
          document.getElementById("HideScales").style.display = "flex";
          document.getElementById("HideDuration2").style.display = "flex";
        
    } 
    );
}

function sineButton(){
    document.getElementById('Sine').addEventListener('click',function () {
        oscType = "sine";
        console.log(oscType);
    } 
    );
}

function squareButton(){
    document.getElementById('Square').addEventListener('click',function () {
        oscType = "square";
        console.log(oscType);
    } 
    );
}

function sawtoothButton(){
    document.getElementById('Sawtooth').addEventListener('click',function () {
        oscType = "sawtooth";
        console.log(oscType);
    } 
    );
}

function triangleButton(){
    document.getElementById('Triangle').addEventListener('click',function () {
        oscType = "triangle";
        console.log(oscType);
    } 
    );
}

function playImage(data){
    //console.log(data);
    var durationAux;

    if(SoundType == "manual"){
        durationAux = (attack + release + decay + sustain ) *1000;
        //console.log("aux" + durationAux);
        //console.log("I am in manual");
    } else {
        durationAux = duration2 * 1000;
        //console.log("aux" + durationAux);
        //console.log("I am in other");
    }
    console.log("Aux : " + durationAux);
    for(var j = 0; j <data[0].length; j++){
       
        amps = selectColumn(data,j);
        setTimeout(playOscillators, durationAux*j,amps);
        setTimeout(drawLine,durationAux*j, (j+1)*Waux/NumTimes);
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
    
    // Detune check

    var isDetune = document.getElementById("DetuneCheckBox").checked;
    detune = isDetune;

    norm = 0;
    for(i=0; i< amps.length; i++){
        if(amps[i] > threshold){
            norm = norm + 1;
        }
    }
    for(i=0; i< amps.length; i++){
        if(amps[i] > threshold){
            Synth.setVolume(amps[i]/norm - 0.01);
            console.log(Synth.getVolume());
            n = amps.length - i - 1;
            //console.log(amps[i]);
            f = baseFreq*Math.pow(2,n/12)

            if(SoundType == "manual"){
                harmonicsWeigths = math.multiply(harmonics,amps[i]);
                createHarmonics(f,harmonicsWeigths,detune);}

            if(SoundType == "piano"){
                piano.play(Scales[ScaleType][n], 4, duration2);}

            if(SoundType == "acoustic"){
                acoustic.play(Scales[ScaleType][n], 4, duration2);}
            if(SoundType == "organ"){
                organ.play(Scales[ScaleType][n], 4, duration2);}
                //console.log("volume is " + Synth.getVolume());}
            if(SoundType == "edm"){
                edm.play(Scales[ScaleType][n], 4, duration2);}

       
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

    var isApplyDist = document.getElementById("DistCheckBox").checked;
    ApplyDist = isApplyDist;
    
    if(ApplyDist){
        o.connect(distortion)
        distortion.connect(filter);
        filter.connect(g);
        g.connect(c.destination);
        //console.log("Estoy en el apllyDistTrue");
        }
    else{
        o.connect(filter);
        filter.connect(g);
        g.connect(c.destination);
        //console.log("Estoy en el apllyDistFalse");
        }

    now = c.currentTime;
    
    //Waveform
    g.gain.setValueAtTime(0, now);   
    g.gain.linearRampToValueAtTime(amplitud/(norm*harmonicsWeigths.length), now+attack);
    //console.log(norm);
    g.gain.setTargetAtTime(0.7*amplitud/(norm*harmonicsWeigths.length), now+attack, decay);
    g.gain.setTargetAtTime(0, attack+decay+sustain , release);

    //Start and stop
    duration = (attack + release + decay + sustain );
    o.start(now);
    o.stop(now+duration);
}

function createHarmonics(f, harmonicsWeigths, detune){
    //createOscillators(f,amps[i], 0); 
    
    for(var i=0; i<harmonicsWeigths.length ; i++){
        //console.log(harmonicsWeigths.length);
        createOscillators(f*(i+1),harmonicsWeigths[i], 0);
        if (detune){
            //console.log("DetuneTrue");
            createOscillators(f*(i+1),harmonicsWeigths[i], -unisonWidth); 
            createOscillators(f*(i+1),harmonicsWeigths[i], unisonWidth);
        }
    }
}



//get image from user and plot

function showImage(fileReader) {
    // Reset Time bar
    canv.style.backgroundColor = "transparent";

    var img = document.getElementById("myImage");
    var realImg = document.getElementById("realImage");
    img.onload = () => getImageData(img, realImg);
    canv.style.backgroundColor = "transparent";
    canv.style.border = "0px";
    img.src = fileReader.result;
    realImg.src = fileReader.result;
}

function getImageData(img, realImg) {
    W = realImg.width;
    Waux = img.width;
    H = realImg.height;
    console.log(W,H);
    canvas.width = W;
    canvas.height = H;
    canv.height = 30 + "px";
    canv.width = img.width;
    canv.style.position = "absolute";
    canv.style.marginLeft = img.x - 8  + "px";
    canv.style.marginTop = img.y + img.height + window.scrollY - 5 + "px";
   
    ctx.drawImage(realImg, 0, 0);
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

  // Slider Duration2

  function mainDuration2()
  {
      volumeKnobDuration2.addEventListener(getMouseDownDuration2(), onMouseDownDuration2); //listen for mouse button click
      document.addEventListener(getMouseUpDuration2(), onMouseUpDuration2); //listen for mouse button release

      createTicksDuration2(27, 14);
  }

  //on mouse button down
  function onMouseDownDuration2()
  {
      document.addEventListener(getMouseMoveDuration2(), onMouseMoveDuration2); //start drag
  }

  //on mouse button release
  function onMouseUpDuration2()
  {
      document.removeEventListener(getMouseMoveDuration2(), onMouseMoveDuration2); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveDuration2(event)
  {
      knobPositionXDuration2 = boundingRectangleDuration2.left; //get knob's global x position
      knobPositionYDuration2 = boundingRectangleDuration2.top; //get knob's global y position

      if(detectMobileDuration2() == "desktop")
      {
          mouseXDuration2 = event.pageX; //get mouse's x global position
          mouseYDuration2 = event.pageY; //get mouse's y global position
      } else {
          mouseXDuration2 = event.touches[0].pageX; //get finger's x global position
          mouseYDuration2 = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXDuration2 = boundingRectangleDuration2.width / 2 + knobPositionXDuration2; //get global horizontal center position of knob relative to mouse position
      knobCenterYDuration2 = boundingRectangleDuration2.height / 2 + knobPositionYDuration2; //get global vertical center position of knob relative to mouse position

      adjacentSideDuration2 = knobCenterXDuration2 - mouseXDuration2; //compute adjacent value of imaginary right angle triangle
      oppositeSideDuration2 = knobCenterYDuration2 - mouseYDuration2; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleDuration2 = Math.atan2(adjacentSideDuration2, oppositeSideDuration2);

      getRadiansInDegreesDuration2 = currentRadiansAngleDuration2 * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesDuration2 = -(getRadiansInDegreesDuration2 - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesDuration2 >= 0 && finalAngleInDegreesDuration2 <= 270)
      {
          volumeKnobDuration2.style.transform = "rotate(" + finalAngleInDegreesDuration2 + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingDuration2 = Math.ceil(finalAngleInDegreesDuration2 * (2 / 270)*100 + 0.007 )/100;

          tickHighlightPositionDuration2 = Math.round((volumeSettingDuration2 * 27/2)); //interpolate how many ticks need to be highlighted
          duration2 = volumeSettingDuration2;
          console.log("Dur");
          createTicksDuration2(27, tickHighlightPositionDuration2); //highlight ticks

          document.getElementById("volumeValue-duration2").innerHTML = volumeSettingDuration2 + " sec"; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksDuration2(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerDuration2.firstChild)
      {
          tickContainerDuration2.removeChild(tickContainerDuration2.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickDuration2 = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickDuration2.className = "tick activetick";
          } else {
              tickDuration2.className = "tick";
          }

          tickContainerDuration2.appendChild(tickDuration2);
          tickDuration2.style.transform = "rotate(" + startingTickAngleDuration2 + "deg)";
          startingTickAngleDuration2 += 10;
      }

      startingTickAngleDuration2 = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileDuration2()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownDuration2()
  {
      if(detectMobileDuration2() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpDuration2()
  {
      if(detectMobileDuration2() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveDuration2()
  {
      if(detectMobileDuration2() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  // Slider NumTimes

  function mainNumTimes()
  {
      volumeSettingNumTimes = 1;
      volumeKnobNumTimes.addEventListener(getMouseDownNumTimes(), onMouseDownNumTimes); //listen for mouse button click
      document.addEventListener(getMouseUpNumTimes(), onMouseUpNumTimes); //listen for mouse button release

      createTicksNumTimes(27, 1);
  }

  //on mouse button down
  function onMouseDownNumTimes()
  {
      document.addEventListener(getMouseMoveNumTimes(), onMouseMoveNumTimes); //start drag
  }

  //on mouse button release
  function onMouseUpNumTimes()
  {
      document.removeEventListener(getMouseMoveNumTimes(), onMouseMoveNumTimes); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveNumTimes(event)
  {
      knobPositionXNumTimes = boundingRectangleNumTimes.left; //get knob's global x position
      knobPositionYNumTimes = boundingRectangleNumTimes.top; //get knob's global y position

      if(detectMobileNumTimes() == "desktop")
      {
          mouseXNumTimes = event.pageX; //get mouse's x global position
          mouseYNumTimes = event.pageY; //get mouse's y global position
      } else {
          mouseXNumTimes = event.touches[0].pageX; //get finger's x global position
          mouseYNumTimes = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXNumTimes = boundingRectangleNumTimes.width / 2 + knobPositionXNumTimes; //get global horizontal center position of knob relative to mouse position
      knobCenterYNumTimes = boundingRectangleNumTimes.height / 2 + knobPositionYNumTimes; //get global vertical center position of knob relative to mouse position

      adjacentSideNumTimes = knobCenterXNumTimes - mouseXNumTimes; //compute adjacent value of imaginary right angle triangle
      oppositeSideNumTimes = knobCenterYNumTimes - mouseYNumTimes; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleNumTimes = Math.atan2(adjacentSideNumTimes, oppositeSideNumTimes);

      getRadiansInDegreesNumTimes = currentRadiansAngleNumTimes * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesNumTimes = -(getRadiansInDegreesNumTimes - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesNumTimes >= 0 && finalAngleInDegreesNumTimes <= 270)
      {
          volumeKnobNumTimes.style.transform = "rotate(" + finalAngleInDegreesNumTimes + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingNumTimes = Math.ceil(finalAngleInDegreesNumTimes * (499 / 270) + 0.7 );

          tickHighlightPositionNumTimes = Math.round((volumeSettingNumTimes * 27/500)); //interpolate how many ticks need to be highlighted
          NumTimes = volumeSettingNumTimes;
          createTicksNumTimes(27, tickHighlightPositionNumTimes); //highlight ticks

          document.getElementById("volumeValue-numTimes").innerHTML = volumeSettingNumTimes; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksNumTimes(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerNumTimes.firstChild)
      {
          tickContainerNumTimes.removeChild(tickContainerNumTimes.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickNumTimes = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickNumTimes.className = "tick activetick";
          } else {
              tickNumTimes.className = "tick";
          }

          tickContainerNumTimes.appendChild(tickNumTimes);
          tickNumTimes.style.transform = "rotate(" + startingTickAngleNumTimes + "deg)";
          startingTickAngleNumTimes += 10;
      }

      startingTickAngleNumTimes = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileNumTimes()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownNumTimes()
  {
      if(detectMobileNumTimes() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpNumTimes()
  {
      if(detectMobileNumTimes() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveNumTimes()
  {
      if(detectMobileNumTimes() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  // Slider Threshold

  function mainThreshold()
  {
      volumeKnobThreshold.addEventListener(getMouseDownThreshold(), onMouseDownThreshold); //listen for mouse button click
      document.addEventListener(getMouseUpThreshold(), onMouseUpThreshold); //listen for mouse button release

      createTicksThreshold(27, 11);
  }

  //on mouse button down
  function onMouseDownThreshold()
  {
      document.addEventListener(getMouseMoveThreshold(), onMouseMoveThreshold); //start drag
  }

  //on mouse button release
  function onMouseUpThreshold()
  {
      document.removeEventListener(getMouseMoveThreshold(), onMouseMoveThreshold); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveThreshold(event)
  {
      knobPositionXThreshold = boundingRectangleThreshold.left; //get knob's global x position
      knobPositionYThreshold = boundingRectangleThreshold.top; //get knob's global y position

      if(detectMobileThreshold() == "desktop")
      {
          mouseXThreshold = event.pageX; //get mouse's x global position
          mouseYThreshold = event.pageY; //get mouse's y global position
      } else {
          mouseXThreshold = event.touches[0].pageX; //get finger's x global position
          mouseYThreshold = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXThreshold = boundingRectangleThreshold.width / 2 + knobPositionXThreshold; //get global horizontal center position of knob relative to mouse position
      knobCenterYThreshold = boundingRectangleThreshold.height / 2 + knobPositionYThreshold; //get global vertical center position of knob relative to mouse position

      adjacentSideThreshold = knobCenterXThreshold - mouseXThreshold; //compute adjacent value of imaginary right angle triangle
      oppositeSideThreshold = knobCenterYThreshold - mouseYThreshold; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleThreshold = Math.atan2(adjacentSideThreshold, oppositeSideThreshold);

      getRadiansInDegreesThreshold = currentRadiansAngleThreshold * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesThreshold = -(getRadiansInDegreesThreshold - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesThreshold >= 0 && finalAngleInDegreesThreshold <= 270)
      {
          volumeKnobThreshold.style.transform = "rotate(" + finalAngleInDegreesThreshold + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingThreshold = Math.round(finalAngleInDegreesThreshold * (1 / 270)*100)/100;

          tickHighlightPositionThreshold = Math.round((volumeSettingThreshold * 27/1)); //interpolate how many ticks need to be highlighted
          threshold = volumeSettingThreshold;
          createTicksThreshold(27, tickHighlightPositionThreshold); //highlight ticks

          document.getElementById("volumeValue-threshold").innerHTML = volumeSettingThreshold; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksThreshold(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerThreshold.firstChild)
      {
          tickContainerThreshold.removeChild(tickContainerThreshold.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickThreshold = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickThreshold.className = "tick activetick";
          } else {
              tickThreshold.className = "tick";
          }

          tickContainerThreshold.appendChild(tickThreshold);
          tickThreshold.style.transform = "rotate(" + startingTickAngleThreshold + "deg)";
          startingTickAngleThreshold += 10;
      }

      startingTickAngleThreshold = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileThreshold()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownThreshold()
  {
      if(detectMobileThreshold() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpThreshold()
  {
      if(detectMobileThreshold() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveThreshold()
  {
      if(detectMobileThreshold() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }

  // Slider Attack
  
  function mainAttack()
  {
      volumeKnobAttack.addEventListener(getMouseDownAttack(), onMouseDownAttack); //listen for mouse button click
      document.addEventListener(getMouseUpAttack(), onMouseUpAttack); //listen for mouse button release

      createTicksAttack(27, 4);
  }

  //on mouse button down
  function onMouseDownAttack()
  {
      document.addEventListener(getMouseMoveAttack(), onMouseMoveAttack); //start drag
  }

  //on mouse button release
  function onMouseUpAttack()
  {
      document.removeEventListener(getMouseMoveAttack(), onMouseMoveAttack); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveAttack(event)
  {
      knobPositionXAttack = boundingRectangleAttack.left; //get knob's global x position
      knobPositionYAttack = boundingRectangleAttack.top; //get knob's global y position

      if(detectMobileAttack() == "desktop")
      {
          mouseXAttack = event.pageX; //get mouse's x global position
          mouseYAttack = event.pageY; //get mouse's y global position
      } else {
          mouseXAttack = event.touches[0].pageX; //get finger's x global position
          mouseYAttack = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXAttack = boundingRectangleAttack.width / 2 + knobPositionXAttack; //get global horizontal center position of knob relative to mouse position
      knobCenterYAttack = boundingRectangleAttack.height / 2 + knobPositionYAttack; //get global vertical center position of knob relative to mouse position

      adjacentSideAttack = knobCenterXAttack - mouseXAttack; //compute adjacent value of imaginary right angle triangle
      oppositeSideAttack = knobCenterYAttack - mouseYAttack; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleAttack = Math.atan2(adjacentSideAttack, oppositeSideAttack);

      getRadiansInDegreesAttack = currentRadiansAngleAttack * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesAttack = -(getRadiansInDegreesAttack - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesAttack >= 0 && finalAngleInDegreesAttack <= 270)
      {
          volumeKnobAttack.style.transform = "rotate(" + finalAngleInDegreesAttack + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingAttack = Math.round(finalAngleInDegreesAttack * (1 / 270)*100)/100;

          tickHighlightPositionAttack = Math.round((volumeSettingAttack * 27/1)); //interpolate how many ticks need to be highlighted
          attack = volumeSettingAttack;
          createTicksAttack(27, tickHighlightPositionAttack); //highlight ticks

          document.getElementById("volumeValue-attack").innerHTML = volumeSettingAttack; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksAttack(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerAttack.firstChild)
      {
          tickContainerAttack.removeChild(tickContainerAttack.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickAttack = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickAttack.className = "tick activetick";
          } else {
              tickAttack.className = "tick";
          }

          tickContainerAttack.appendChild(tickAttack);
          tickAttack.style.transform = "rotate(" + startingTickAngleAttack + "deg)";
          startingTickAngleAttack += 10;
      }

      startingTickAngleAttack = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileAttack()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownAttack()
  {
      if(detectMobileAttack() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpAttack()
  {
      if(detectMobileAttack() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveAttack()
  {
      if(detectMobileAttack() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  
  // Release Button

  function mainRelease()
  {
      volumeKnobRelease.addEventListener(getMouseDownRelease(), onMouseDownRelease); //listen for mouse button click
      document.addEventListener(getMouseUpRelease(), onMouseUpRelease); //listen for mouse button release

      createTicksRelease(27, 0);
  }

  //on mouse button down
  function onMouseDownRelease()
  {
      document.addEventListener(getMouseMoveRelease(), onMouseMoveRelease); //start drag
  }

  //on mouse button release
  function onMouseUpRelease()
  {
      document.removeEventListener(getMouseMoveRelease(), onMouseMoveRelease); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveRelease(event)
  {
      knobPositionXRelease = boundingRectangleRelease.left; //get knob's global x position
      knobPositionYRelease = boundingRectangleRelease.top; //get knob's global y position

      if(detectMobileRelease() == "desktop")
      {
          mouseXRelease = event.pageX; //get mouse's x global position
          mouseYRelease = event.pageY; //get mouse's y global position
      } else {
          mouseXRelease = event.touches[0].pageX; //get finger's x global position
          mouseYRelease = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXRelease = boundingRectangleRelease.width / 2 + knobPositionXRelease; //get global horizontal center position of knob relative to mouse position
      knobCenterYRelease = boundingRectangleRelease.height / 2 + knobPositionYRelease; //get global vertical center position of knob relative to mouse position

      adjacentSideRelease = knobCenterXRelease - mouseXRelease; //compute adjacent value of imaginary right angle triangle
      oppositeSideRelease = knobCenterYRelease - mouseYRelease; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleRelease = Math.atan2(adjacentSideRelease, oppositeSideRelease);

      getRadiansInDegreesRelease = currentRadiansAngleRelease * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesRelease = -(getRadiansInDegreesRelease - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesRelease >= 0 && finalAngleInDegreesRelease <= 270)
      {
          volumeKnobRelease.style.transform = "rotate(" + finalAngleInDegreesRelease + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingRelease = Math.round(finalAngleInDegreesRelease * (1 / 270)*100)/100;

          tickHighlightPositionRelease = Math.round((volumeSettingRelease * 27/1)); //interpolate how many ticks need to be highlighted
          release = volumeSettingRelease;
          createTicksRelease(27, tickHighlightPositionRelease); //highlight ticks

          document.getElementById("volumeValue-release").innerHTML = volumeSettingRelease; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksRelease(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerRelease.firstChild)
      {
          tickContainerRelease.removeChild(tickContainerRelease.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickRelease = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickRelease.className = "tick activetick";
          } else {
              tickRelease.className = "tick";
          }

          tickContainerRelease.appendChild(tickRelease);
          tickRelease.style.transform = "rotate(" + startingTickAngleRelease + "deg)";
          startingTickAngleRelease += 10;
      }

      startingTickAngleRelease = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileRelease()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownRelease()
  {
      if(detectMobileRelease() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpRelease()
  {
      if(detectMobileRelease() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveRelease()
  {
      if(detectMobileRelease() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  
  // Decay Button

  function mainDecay()
  {
      volumeKnobDecay.addEventListener(getMouseDownDecay(), onMouseDownDecay); //listen for mouse button click
      document.addEventListener(getMouseUpDecay(), onMouseUpDecay); //listen for mouse button decay

      createTicksDecay(27, 1);
  }

  //on mouse button down
  function onMouseDownDecay()
  {
      document.addEventListener(getMouseMoveDecay(), onMouseMoveDecay); //start drag
  }

  //on mouse button decay
  function onMouseUpDecay()
  {
      document.removeEventListener(getMouseMoveDecay(), onMouseMoveDecay); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveDecay(event)
  {
      knobPositionXDecay = boundingRectangleDecay.left; //get knob's global x position
      knobPositionYDecay = boundingRectangleDecay.top; //get knob's global y position

      if(detectMobileDecay() == "desktop")
      {
          mouseXDecay = event.pageX; //get mouse's x global position
          mouseYDecay = event.pageY; //get mouse's y global position
      } else {
          mouseXDecay = event.touches[0].pageX; //get finger's x global position
          mouseYDecay = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXDecay = boundingRectangleDecay.width / 2 + knobPositionXDecay; //get global horizontal center position of knob relative to mouse position
      knobCenterYDecay = boundingRectangleDecay.height / 2 + knobPositionYDecay; //get global vertical center position of knob relative to mouse position

      adjacentSideDecay = knobCenterXDecay - mouseXDecay; //compute adjacent value of imaginary right angle triangle
      oppositeSideDecay = knobCenterYDecay - mouseYDecay; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleDecay = Math.atan2(adjacentSideDecay, oppositeSideDecay);

      getRadiansInDegreesDecay = currentRadiansAngleDecay * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesDecay = -(getRadiansInDegreesDecay - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesDecay >= 0 && finalAngleInDegreesDecay <= 270)
      {
          volumeKnobDecay.style.transform = "rotate(" + finalAngleInDegreesDecay + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingDecay = Math.round(finalAngleInDegreesDecay * (1 / 270)*100)/100;

          tickHighlightPositionDecay = Math.round((volumeSettingDecay * 27/1)); //interpolate how many ticks need to be highlighted
          decay = volumeSettingDecay;
          createTicksDecay(27, tickHighlightPositionDecay); //highlight ticks

          document.getElementById("volumeValue-decay").innerHTML = volumeSettingDecay; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksDecay(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerDecay.firstChild)
      {
          tickContainerDecay.removeChild(tickContainerDecay.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickDecay = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickDecay.className = "tick activetick";
          } else {
              tickDecay.className = "tick";
          }

          tickContainerDecay.appendChild(tickDecay);
          tickDecay.style.transform = "rotate(" + startingTickAngleDecay + "deg)";
          startingTickAngleDecay += 10;
      }

      startingTickAngleDecay = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileDecay()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownDecay()
  {
      if(detectMobileDecay() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpDecay()
  {
      if(detectMobileDecay() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveDecay()
  {
      if(detectMobileDecay() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }

    // Sustain Button

    function mainSustain()
    {
        volumeKnobSustain.addEventListener(getMouseDownSustain(), onMouseDownSustain); //listen for mouse button click
        document.addEventListener(getMouseUpSustain(), onMouseUpSustain); //listen for mouse button sustain
  
        createTicksSustain(27, 4);
    }
  
    //on mouse button down
    function onMouseDownSustain()
    {
        document.addEventListener(getMouseMoveSustain(), onMouseMoveSustain); //start drag
    }
  
    //on mouse button sustain
    function onMouseUpSustain()
    {
        document.removeEventListener(getMouseMoveSustain(), onMouseMoveSustain); //stop drag
    }
  
    //compute mouse angle relative to center of volume knob
    //For clarification, see my basic trig explanation at:
    //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
    function onMouseMoveSustain(event)
    {
        knobPositionXSustain = boundingRectangleSustain.left; //get knob's global x position
        knobPositionYSustain = boundingRectangleSustain.top; //get knob's global y position
  
        if(detectMobileSustain() == "desktop")
        {
            mouseXSustain = event.pageX; //get mouse's x global position
            mouseYSustain = event.pageY; //get mouse's y global position
        } else {
            mouseXSustain = event.touches[0].pageX; //get finger's x global position
            mouseYSustain = event.touches[0].pageY; //get finger's y global position
        }
  
        knobCenterXSustain = boundingRectangleSustain.width / 2 + knobPositionXSustain; //get global horizontal center position of knob relative to mouse position
        knobCenterYSustain = boundingRectangleSustain.height / 2 + knobPositionYSustain; //get global vertical center position of knob relative to mouse position
  
        adjacentSideSustain = knobCenterXSustain - mouseXSustain; //compute adjacent value of imaginary right angle triangle
        oppositeSideSustain = knobCenterYSustain - mouseYSustain; //compute opposite value of imaginary right angle triangle
  
        //arc-tangent function returns circular angle in radians
        //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
        currentRadiansAngleSustain = Math.atan2(adjacentSideSustain, oppositeSideSustain);
  
        getRadiansInDegreesSustain = currentRadiansAngleSustain * 180 / Math.PI; //convert radians into degrees
  
        finalAngleInDegreesSustain = -(getRadiansInDegreesSustain - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
  
        //only allow rotate if greater than zero degrees or lesser than 270 degrees
        if(finalAngleInDegreesSustain >= 0 && finalAngleInDegreesSustain <= 270)
        {
            volumeKnobSustain.style.transform = "rotate(" + finalAngleInDegreesSustain + "deg)"; //use dynamic CSS transform to rotate volume knob
  
            //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
            volumeSettingSustain = Math.round(finalAngleInDegreesSustain * (1 / 270)*100)/100;
  
            tickHighlightPositionSustain = Math.round((volumeSettingSustain * 27/1)); //interpolate how many ticks need to be highlighted
            sustain = volumeSettingSustain;
            createTicksSustain(27, tickHighlightPositionSustain); //highlight ticks
  
            document.getElementById("volumeValue-sustain").innerHTML = volumeSettingSustain; //update volume text
        }
    }
  
    //dynamically create volume knob "ticks"
    function createTicksSustain(numTicks, highlightNumTicks)
    {
        //reset first by deleting all existing ticks
        while(tickContainerSustain.firstChild)
        {
            tickContainerSustain.removeChild(tickContainerSustain.firstChild);
        }
  
        //create ticks
        for(var i=0;i<numTicks;i++)
        {
            var tickSustain = document.createElement("div");
  
            //highlight only the appropriate ticks using dynamic CSS
            if(i < highlightNumTicks)
            {
                tickSustain.className = "tick activetick";
            } else {
                tickSustain.className = "tick";
            }
  
            tickContainerSustain.appendChild(tickSustain);
            tickSustain.style.transform = "rotate(" + startingTickAngleSustain + "deg)";
            startingTickAngleSustain += 10;
        }
  
        startingTickAngleSustain = -135; //reset
    }
  
    //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
    function detectMobileSustain()
    {
        var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
  
        if(result !== null)
        {
            return "mobile";
        } else {
            return "desktop";
        }
    }
  
    function getMouseDownSustain()
    {
        if(detectMobileSustain() == "desktop")
        {
            return "mousedown";
        } else {
            return "touchstart";
        }
    }
  
    function getMouseUpSustain()
    {
        if(detectMobileSustain() == "desktop")
        {
            return "mouseup";
        } else {
            return "touchend";
        }
    }
  
    function getMouseMoveSustain()
    {
        if(detectMobileSustain() == "desktop")
        {
            return "mousemove";
        } else {
            return "touchmove";
        }
    }

        // Frequency Button

        function mainFrequency()
        {
            volumeKnobFrequency.addEventListener(getMouseDownFrequency(), onMouseDownFrequency); //listen for mouse button click
            document.addEventListener(getMouseUpFrequency(), onMouseUpFrequency); //listen for mouse button frequency
      
            createTicksFrequency(27, 0);
        }
      
        //on mouse button down
        function onMouseDownFrequency()
        {
            document.addEventListener(getMouseMoveFrequency(), onMouseMoveFrequency); //start drag
        }
      
        //on mouse button frequency
        function onMouseUpFrequency()
        {
            document.removeEventListener(getMouseMoveFrequency(), onMouseMoveFrequency); //stop drag
        }
      
        //compute mouse angle relative to center of volume knob
        //For clarification, see my basic trig explanation at:
        //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
        function onMouseMoveFrequency(event)
        {
            knobPositionXFrequency = boundingRectangleFrequency.left; //get knob's global x position
            knobPositionYFrequency = boundingRectangleFrequency.top; //get knob's global y position
      
            if(detectMobileFrequency() == "desktop")
            {
                mouseXFrequency = event.pageX; //get mouse's x global position
                mouseYFrequency = event.pageY; //get mouse's y global position
            } else {
                mouseXFrequency = event.touches[0].pageX; //get finger's x global position
                mouseYFrequency = event.touches[0].pageY; //get finger's y global position
            }
      
            knobCenterXFrequency = boundingRectangleFrequency.width / 2 + knobPositionXFrequency; //get global horizontal center position of knob relative to mouse position
            knobCenterYFrequency = boundingRectangleFrequency.height / 2 + knobPositionYFrequency; //get global vertical center position of knob relative to mouse position
      
            adjacentSideFrequency = knobCenterXFrequency - mouseXFrequency; //compute adjacent value of imaginary right angle triangle
            oppositeSideFrequency = knobCenterYFrequency - mouseYFrequency; //compute opposite value of imaginary right angle triangle
      
            //arc-tangent function returns circular angle in radians
            //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
            currentRadiansAngleFrequency = Math.atan2(adjacentSideFrequency, oppositeSideFrequency);
      
            getRadiansInDegreesFrequency = currentRadiansAngleFrequency * 180 / Math.PI; //convert radians into degrees
      
            finalAngleInDegreesFrequency = -(getRadiansInDegreesFrequency - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
      
            //only allow rotate if greater than zero degrees or lesser than 270 degrees
            if(finalAngleInDegreesFrequency >= 0 && finalAngleInDegreesFrequency <= 270)
            {
                volumeKnobFrequency.style.transform = "rotate(" + finalAngleInDegreesFrequency + "deg)"; //use dynamic CSS transform to rotate volume knob
      
                //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
                volumeSettingFrequency = Math.round(finalAngleInDegreesFrequency * (99999 / 270) + 0.7);
      
                tickHighlightPositionFrequency = Math.round((volumeSettingFrequency * 27/100000)); //interpolate how many ticks need to be highlighted
                filtFreq = volumeSettingFrequency;
                createTicksFrequency(27, tickHighlightPositionFrequency); //highlight ticks
      
                document.getElementById("volumeValue-frequency").innerHTML = volumeSettingFrequency + " Hz"; //update volume text
            }
        }
      
        //dynamically create volume knob "ticks"
        function createTicksFrequency(numTicks, highlightNumTicks)
        {
            //reset first by deleting all existing ticks
            while(tickContainerFrequency.firstChild)
            {
                tickContainerFrequency.removeChild(tickContainerFrequency.firstChild);
            }
      
            //create ticks
            for(var i=0;i<numTicks;i++)
            {
                var tickFrequency = document.createElement("div");
      
                //highlight only the appropriate ticks using dynamic CSS
                if(i < highlightNumTicks)
                {
                    tickFrequency.className = "tick activetick";
                } else {
                    tickFrequency.className = "tick";
                }
      
                tickContainerFrequency.appendChild(tickFrequency);
                tickFrequency.style.transform = "rotate(" + startingTickAngleFrequency + "deg)";
                startingTickAngleFrequency += 10;
            }
      
            startingTickAngleFrequency = -135; //reset
        }
      
        //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
        function detectMobileFrequency()
        {
            var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
      
            if(result !== null)
            {
                return "mobile";
            } else {
                return "desktop";
            }
        }
      
        function getMouseDownFrequency()
        {
            if(detectMobileFrequency() == "desktop")
            {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }
      
        function getMouseUpFrequency()
        {
            if(detectMobileFrequency() == "desktop")
            {
                return "mouseup";
            } else {
                return "touchend";
            }
        }
      
        function getMouseMoveFrequency()
        {
            if(detectMobileFrequency() == "desktop")
            {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }

                // FiltSlid Button

        function mainFiltSlid()
        {
            volumeKnobFiltSlid.addEventListener(getMouseDownFiltSlid(), onMouseDownFiltSlid); //listen for mouse button click
            document.addEventListener(getMouseUpFiltSlid(), onMouseUpFiltSlid); //listen for mouse button filtSlid
      
            createTicksFiltSlid(27, 0);
        }
      
        //on mouse button down
        function onMouseDownFiltSlid()
        {
            document.addEventListener(getMouseMoveFiltSlid(), onMouseMoveFiltSlid); //start drag
        }
      
        //on mouse button filtSlid
        function onMouseUpFiltSlid()
        {
            document.removeEventListener(getMouseMoveFiltSlid(), onMouseMoveFiltSlid); //stop drag
        }
      
        //compute mouse angle relative to center of volume knob
        //For clarification, see my basic trig explanation at:
        //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
        function onMouseMoveFiltSlid(event)
        {
            knobPositionXFiltSlid = boundingRectangleFiltSlid.left; //get knob's global x position
            knobPositionYFiltSlid = boundingRectangleFiltSlid.top; //get knob's global y position
      
            if(detectMobileFiltSlid() == "desktop")
            {
                mouseXFiltSlid = event.pageX; //get mouse's x global position
                mouseYFiltSlid = event.pageY; //get mouse's y global position
            } else {
                mouseXFiltSlid = event.touches[0].pageX; //get finger's x global position
                mouseYFiltSlid = event.touches[0].pageY; //get finger's y global position
            }
      
            knobCenterXFiltSlid = boundingRectangleFiltSlid.width / 2 + knobPositionXFiltSlid; //get global horizontal center position of knob relative to mouse position
            knobCenterYFiltSlid = boundingRectangleFiltSlid.height / 2 + knobPositionYFiltSlid; //get global vertical center position of knob relative to mouse position
      
            adjacentSideFiltSlid = knobCenterXFiltSlid - mouseXFiltSlid; //compute adjacent value of imaginary right angle triangle
            oppositeSideFiltSlid = knobCenterYFiltSlid - mouseYFiltSlid; //compute opposite value of imaginary right angle triangle
      
            //arc-tangent function returns circular angle in radians
            //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
            currentRadiansAngleFiltSlid = Math.atan2(adjacentSideFiltSlid, oppositeSideFiltSlid);
      
            getRadiansInDegreesFiltSlid = currentRadiansAngleFiltSlid * 180 / Math.PI; //convert radians into degrees
      
            finalAngleInDegreesFiltSlid = -(getRadiansInDegreesFiltSlid - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
      
            //only allow rotate if greater than zero degrees or lesser than 270 degrees
            if(finalAngleInDegreesFiltSlid >= 0 && finalAngleInDegreesFiltSlid <= 270)
            {
                volumeKnobFiltSlid.style.transform = "rotate(" + finalAngleInDegreesFiltSlid + "deg)"; //use dynamic CSS transform to rotate volume knob
      
                //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
                volumeSettingFiltSlid = Math.round(finalAngleInDegreesFiltSlid * (99999 / 270) + 0.7);
      
                tickHighlightPositionFiltSlid = Math.round((volumeSettingFiltSlid * 27/100000)); //interpolate how many ticks need to be highlighted
                filtFreq = volumeSettingFiltSlid;
                createTicksFiltSlid(27, tickHighlightPositionFiltSlid); //highlight ticks
      
                document.getElementById("volumeValue-filtSlid").innerHTML = volumeSettingFiltSlid + " Hz"; //update volume text
            }
        }
      
        //dynamically create volume knob "ticks"
        function createTicksFiltSlid(numTicks, highlightNumTicks)
        {
            //reset first by deleting all existing ticks
            while(tickContainerFiltSlid.firstChild)
            {
                tickContainerFiltSlid.removeChild(tickContainerFiltSlid.firstChild);
            }
      
            //create ticks
            for(var i=0;i<numTicks;i++)
            {
                var tickFiltSlid = document.createElement("div");
      
                //highlight only the appropriate ticks using dynamic CSS
                if(i < highlightNumTicks)
                {
                    tickFiltSlid.className = "tick activetick";
                } else {
                    tickFiltSlid.className = "tick";
                }
      
                tickContainerFiltSlid.appendChild(tickFiltSlid);
                tickFiltSlid.style.transform = "rotate(" + startingTickAngleFiltSlid + "deg)";
                startingTickAngleFiltSlid += 10;
            }
      
            startingTickAngleFiltSlid = -135; //reset
        }
      
        //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
        function detectMobileFiltSlid()
        {
            var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
      
            if(result !== null)
            {
                return "mobile";
            } else {
                return "desktop";
            }
        }
      
        function getMouseDownFiltSlid()
        {
            if(detectMobileFiltSlid() == "desktop")
            {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }
      
        function getMouseUpFiltSlid()
        {
            if(detectMobileFiltSlid() == "desktop")
            {
                return "mouseup";
            } else {
                return "touchend";
            }
        }
      
        function getMouseMoveFiltSlid()
        {
            if(detectMobileFiltSlid() == "desktop")
            {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }
        // FiltSlid Button

        function mainFiltSlid()
        {
            volumeKnobFiltSlid.addEventListener(getMouseDownFiltSlid(), onMouseDownFiltSlid); //listen for mouse button click
            document.addEventListener(getMouseUpFiltSlid(), onMouseUpFiltSlid); //listen for mouse button filtSlid
      
            createTicksFiltSlid(27, 0);
        }
      
        //on mouse button down
        function onMouseDownFiltSlid()
        {
            document.addEventListener(getMouseMoveFiltSlid(), onMouseMoveFiltSlid); //start drag
        }
      
        //on mouse button filtSlid
        function onMouseUpFiltSlid()
        {
            document.removeEventListener(getMouseMoveFiltSlid(), onMouseMoveFiltSlid); //stop drag
        }
      
        //compute mouse angle relative to center of volume knob
        //For clarification, see my basic trig explanation at:
        //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
        function onMouseMoveFiltSlid(event)
        {
            knobPositionXFiltSlid = boundingRectangleFiltSlid.left; //get knob's global x position
            knobPositionYFiltSlid = boundingRectangleFiltSlid.top; //get knob's global y position
      
            if(detectMobileFiltSlid() == "desktop")
            {
                mouseXFiltSlid = event.pageX; //get mouse's x global position
                mouseYFiltSlid = event.pageY; //get mouse's y global position
            } else {
                mouseXFiltSlid = event.touches[0].pageX; //get finger's x global position
                mouseYFiltSlid = event.touches[0].pageY; //get finger's y global position
            }
      
            knobCenterXFiltSlid = boundingRectangleFiltSlid.width / 2 + knobPositionXFiltSlid; //get global horizontal center position of knob relative to mouse position
            knobCenterYFiltSlid = boundingRectangleFiltSlid.height / 2 + knobPositionYFiltSlid; //get global vertical center position of knob relative to mouse position
      
            adjacentSideFiltSlid = knobCenterXFiltSlid - mouseXFiltSlid; //compute adjacent value of imaginary right angle triangle
            oppositeSideFiltSlid = knobCenterYFiltSlid - mouseYFiltSlid; //compute opposite value of imaginary right angle triangle
      
            //arc-tangent function returns circular angle in radians
            //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
            currentRadiansAngleFiltSlid = Math.atan2(adjacentSideFiltSlid, oppositeSideFiltSlid);
      
            getRadiansInDegreesFiltSlid = currentRadiansAngleFiltSlid * 180 / Math.PI; //convert radians into degrees
      
            finalAngleInDegreesFiltSlid = -(getRadiansInDegreesFiltSlid - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
      
            //only allow rotate if greater than zero degrees or lesser than 270 degrees
            if(finalAngleInDegreesFiltSlid >= 0 && finalAngleInDegreesFiltSlid <= 270)
            {
                volumeKnobFiltSlid.style.transform = "rotate(" + finalAngleInDegreesFiltSlid + "deg)"; //use dynamic CSS transform to rotate volume knob
      
                //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
                volumeSettingFiltSlid = Math.round(finalAngleInDegreesFiltSlid * (7 / 270) - 3.7);
      
                tickHighlightPositionFiltSlid = Math.round(((volumeSettingFiltSlid + 4) * 27/7)); //interpolate how many ticks need to be highlighted
                filtQslider = 10^(volumeSettingFiltSlid);
                createTicksFiltSlid(27, tickHighlightPositionFiltSlid); //highlight ticks
      
                document.getElementById("volumeValue-filtSlid").innerHTML = volumeSettingFiltSlid; //update volume text
            }
        }
      
        //dynamically create volume knob "ticks"
        function createTicksFiltSlid(numTicks, highlightNumTicks)
        {
            //reset first by deleting all existing ticks
            while(tickContainerFiltSlid.firstChild)
            {
                tickContainerFiltSlid.removeChild(tickContainerFiltSlid.firstChild);
            }
      
            //create ticks
            for(var i=0;i<numTicks;i++)
            {
                var tickFiltSlid = document.createElement("div");
      
                //highlight only the appropriate ticks using dynamic CSS
                if(i < highlightNumTicks)
                {
                    tickFiltSlid.className = "tick activetick";
                } else {
                    tickFiltSlid.className = "tick";
                }
      
                tickContainerFiltSlid.appendChild(tickFiltSlid);
                tickFiltSlid.style.transform = "rotate(" + startingTickAngleFiltSlid + "deg)";
                startingTickAngleFiltSlid += 10;
            }
      
            startingTickAngleFiltSlid = -135; //reset
        }
      
        //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
        function detectMobileFiltSlid()
        {
            var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
      
            if(result !== null)
            {
                return "mobile";
            } else {
                return "desktop";
            }
        }
      
        function getMouseDownFiltSlid()
        {
            if(detectMobileFiltSlid() == "desktop")
            {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }
      
        function getMouseUpFiltSlid()
        {
            if(detectMobileFiltSlid() == "desktop")
            {
                return "mouseup";
            } else {
                return "touchend";
            }
        }
      
        function getMouseMoveFiltSlid()
        {
            if(detectMobileFiltSlid() == "desktop")
            {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }

        // FiltGain

        function mainFiltGain()
        {
            volumeKnobFiltGain.addEventListener(getMouseDownFiltGain(), onMouseDownFiltGain); //listen for mouse button click
            document.addEventListener(getMouseUpFiltGain(), onMouseUpFiltGain); //listen for mouse button filtGain
      
            createTicksFiltGain(27, 14);
        }
      
        //on mouse button down
        function onMouseDownFiltGain()
        {
            document.addEventListener(getMouseMoveFiltGain(), onMouseMoveFiltGain); //start drag
        }
      
        //on mouse button filtGain
        function onMouseUpFiltGain()
        {
            document.removeEventListener(getMouseMoveFiltGain(), onMouseMoveFiltGain); //stop drag
        }
      
        //compute mouse angle relative to center of volume knob
        //For clarification, see my basic trig explanation at:
        //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
        function onMouseMoveFiltGain(event)
        {
            knobPositionXFiltGain = boundingRectangleFiltGain.left; //get knob's global x position
            knobPositionYFiltGain = boundingRectangleFiltGain.top; //get knob's global y position
      
            if(detectMobileFiltGain() == "desktop")
            {
                mouseXFiltGain = event.pageX; //get mouse's x global position
                mouseYFiltGain = event.pageY; //get mouse's y global position
            } else {
                mouseXFiltGain = event.touches[0].pageX; //get finger's x global position
                mouseYFiltGain = event.touches[0].pageY; //get finger's y global position
            }
      
            knobCenterXFiltGain = boundingRectangleFiltGain.width / 2 + knobPositionXFiltGain; //get global horizontal center position of knob relative to mouse position
            knobCenterYFiltGain = boundingRectangleFiltGain.height / 2 + knobPositionYFiltGain; //get global vertical center position of knob relative to mouse position
      
            adjacentSideFiltGain = knobCenterXFiltGain - mouseXFiltGain; //compute adjacent value of imaginary right angle triangle
            oppositeSideFiltGain = knobCenterYFiltGain - mouseYFiltGain; //compute opposite value of imaginary right angle triangle
      
            //arc-tangent function returns circular angle in radians
            //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
            currentRadiansAngleFiltGain = Math.atan2(adjacentSideFiltGain, oppositeSideFiltGain);
      
            getRadiansInDegreesFiltGain = currentRadiansAngleFiltGain * 180 / Math.PI; //convert radians into degrees
      
            finalAngleInDegreesFiltGain = -(getRadiansInDegreesFiltGain - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
      
            //only allow rotate if greater than zero degrees or lesser than 270 degrees
            if(finalAngleInDegreesFiltGain >= 0 && finalAngleInDegreesFiltGain <= 270)
            {
                volumeKnobFiltGain.style.transform = "rotate(" + finalAngleInDegreesFiltGain + "deg)"; //use dynamic CSS transform to rotate volume knob
      
                //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
                volumeSettingFiltGain = Math.round(finalAngleInDegreesFiltGain * (80 / 270) - 39.7);
      
                tickHighlightPositionFiltGain = Math.round(((volumeSettingFiltGain + 40) * 27/80)); //interpolate how many ticks need to be highlighted
                filtGain = volumeSettingFiltGain;
                createTicksFiltGain(27, tickHighlightPositionFiltGain); //highlight ticks
      
                document.getElementById("volumeValue-filtGain").innerHTML = volumeSettingFiltGain +" dB"; //update volume text
            }
        }
      
        //dynamically create volume knob "ticks"
        function createTicksFiltGain(numTicks, highlightNumTicks)
        {
            //reset first by deleting all existing ticks
            while(tickContainerFiltGain.firstChild)
            {
                tickContainerFiltGain.removeChild(tickContainerFiltGain.firstChild);
            }
      
            //create ticks
            for(var i=0;i<numTicks;i++)
            {
                var tickFiltGain = document.createElement("div");
      
                //highlight only the appropriate ticks using dynamic CSS
                if(i < highlightNumTicks)
                {
                    tickFiltGain.className = "tick activetick";
                } else {
                    tickFiltGain.className = "tick";
                }
      
                tickContainerFiltGain.appendChild(tickFiltGain);
                tickFiltGain.style.transform = "rotate(" + startingTickAngleFiltGain + "deg)";
                startingTickAngleFiltGain += 10;
            }
      
            startingTickAngleFiltGain = -135; //reset
        }
      
        //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
        function detectMobileFiltGain()
        {
            var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
      
            if(result !== null)
            {
                return "mobile";
            } else {
                return "desktop";
            }
        }
      
        function getMouseDownFiltGain()
        {
            if(detectMobileFiltGain() == "desktop")
            {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }
      
        function getMouseUpFiltGain()
        {
            if(detectMobileFiltGain() == "desktop")
            {
                return "mouseup";
            } else {
                return "touchend";
            }
        }
      
        function getMouseMoveFiltGain()
        {
            if(detectMobileFiltGain() == "desktop")
            {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }

                // DistValue

        function mainDistValue()
        {
            volumeKnobDistValue.addEventListener(getMouseDownDistValue(), onMouseDownDistValue); //listen for mouse button click
            document.addEventListener(getMouseUpDistValue(), onMouseUpDistValue); //listen for mouse button distValue
      
            createTicksDistValue(27, 0);
        }
      
        //on mouse button down
        function onMouseDownDistValue()
        {
            document.addEventListener(getMouseMoveDistValue(), onMouseMoveDistValue); //start drag
        }
      
        //on mouse button distValue
        function onMouseUpDistValue()
        {
            document.removeEventListener(getMouseMoveDistValue(), onMouseMoveDistValue); //stop drag
        }
      
        //compute mouse angle relative to center of volume knob
        //For clarification, see my basic trig explanation at:
        //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
        function onMouseMoveDistValue(event)
        {
            knobPositionXDistValue = boundingRectangleDistValue.left; //get knob's global x position
            knobPositionYDistValue = boundingRectangleDistValue.top; //get knob's global y position
      
            if(detectMobileDistValue() == "desktop")
            {
                mouseXDistValue = event.pageX; //get mouse's x global position
                mouseYDistValue = event.pageY; //get mouse's y global position
            } else {
                mouseXDistValue = event.touches[0].pageX; //get finger's x global position
                mouseYDistValue = event.touches[0].pageY; //get finger's y global position
            }
      
            knobCenterXDistValue = boundingRectangleDistValue.width / 2 + knobPositionXDistValue; //get global horizontal center position of knob relative to mouse position
            knobCenterYDistValue = boundingRectangleDistValue.height / 2 + knobPositionYDistValue; //get global vertical center position of knob relative to mouse position
      
            adjacentSideDistValue = knobCenterXDistValue - mouseXDistValue; //compute adjacent value of imaginary right angle triangle
            oppositeSideDistValue = knobCenterYDistValue - mouseYDistValue; //compute opposite value of imaginary right angle triangle
      
            //arc-tangent function returns circular angle in radians
            //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
            currentRadiansAngleDistValue = Math.atan2(adjacentSideDistValue, oppositeSideDistValue);
      
            getRadiansInDegreesDistValue = currentRadiansAngleDistValue * 180 / Math.PI; //convert radians into degrees
      
            finalAngleInDegreesDistValue = -(getRadiansInDegreesDistValue - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
      
            //only allow rotate if greater than zero degrees or lesser than 270 degrees
            if(finalAngleInDegreesDistValue >= 0 && finalAngleInDegreesDistValue <= 270)
            {
                volumeKnobDistValue.style.transform = "rotate(" + finalAngleInDegreesDistValue + "deg)"; //use dynamic CSS transform to rotate volume knob
      
                //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
                volumeSettingDistValue = Math.round(finalAngleInDegreesDistValue * (80 / 270) - 39.7);
      
                tickHighlightPositionDistValue = Math.round(((volumeSettingDistValue + 40) * 27/80)); //interpolate how many ticks need to be highlighted
                distValue = volumeSettingDistValue;
                createTicksDistValue(27, tickHighlightPositionDistValue); //highlight ticks
      
                document.getElementById("volumeValue-distValue").innerHTML = volumeSettingDistValue +" dB"; //update volume text
            }
        }
      
        //dynamically create volume knob "ticks"
        function createTicksDistValue(numTicks, highlightNumTicks)
        {
            //reset first by deleting all existing ticks
            while(tickContainerDistValue.firstChild)
            {
                tickContainerDistValue.removeChild(tickContainerDistValue.firstChild);
            }
      
            //create ticks
            for(var i=0;i<numTicks;i++)
            {
                var tickDistValue = document.createElement("div");
      
                //highlight only the appropriate ticks using dynamic CSS
                if(i < highlightNumTicks)
                {
                    tickDistValue.className = "tick activetick";
                } else {
                    tickDistValue.className = "tick";
                }
      
                tickContainerDistValue.appendChild(tickDistValue);
                tickDistValue.style.transform = "rotate(" + startingTickAngleDistValue + "deg)";
                startingTickAngleDistValue += 10;
            }
      
            startingTickAngleDistValue = -135; //reset
        }
      
        //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
        function detectMobileDistValue()
        {
            var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
      
            if(result !== null)
            {
                return "mobile";
            } else {
                return "desktop";
            }
        }
      
        function getMouseDownDistValue()
        {
            if(detectMobileDistValue() == "desktop")
            {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }
      
        function getMouseUpDistValue()
        {
            if(detectMobileDistValue() == "desktop")
            {
                return "mouseup";
            } else {
                return "touchend";
            }
        }
      
        function getMouseMoveDistValue()
        {
            if(detectMobileDistValue() == "desktop")
            {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }

        // DistValue

        function mainDistValue()
        {
            volumeKnobDistValue.addEventListener(getMouseDownDistValue(), onMouseDownDistValue); //listen for mouse button click
            document.addEventListener(getMouseUpDistValue(), onMouseUpDistValue); //listen for mouse button distValue
      
            createTicksDistValue(27, 0);
        }
      
        //on mouse button down
        function onMouseDownDistValue()
        {
            document.addEventListener(getMouseMoveDistValue(), onMouseMoveDistValue); //start drag
        }
      
        //on mouse button distValue
        function onMouseUpDistValue()
        {
            document.removeEventListener(getMouseMoveDistValue(), onMouseMoveDistValue); //stop drag
        }
      
        //compute mouse angle relative to center of volume knob
        //For clarification, see my basic trig explanation at:
        //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
        function onMouseMoveDistValue(event)
        {
            knobPositionXDistValue = boundingRectangleDistValue.left; //get knob's global x position
            knobPositionYDistValue = boundingRectangleDistValue.top; //get knob's global y position
      
            if(detectMobileDistValue() == "desktop")
            {
                mouseXDistValue = event.pageX; //get mouse's x global position
                mouseYDistValue = event.pageY; //get mouse's y global position
            } else {
                mouseXDistValue = event.touches[0].pageX; //get finger's x global position
                mouseYDistValue = event.touches[0].pageY; //get finger's y global position
            }
      
            knobCenterXDistValue = boundingRectangleDistValue.width / 2 + knobPositionXDistValue; //get global horizontal center position of knob relative to mouse position
            knobCenterYDistValue = boundingRectangleDistValue.height / 2 + knobPositionYDistValue; //get global vertical center position of knob relative to mouse position
      
            adjacentSideDistValue = knobCenterXDistValue - mouseXDistValue; //compute adjacent value of imaginary right angle triangle
            oppositeSideDistValue = knobCenterYDistValue - mouseYDistValue; //compute opposite value of imaginary right angle triangle
      
            //arc-tangent function returns circular angle in radians
            //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
            currentRadiansAngleDistValue = Math.atan2(adjacentSideDistValue, oppositeSideDistValue);
      
            getRadiansInDegreesDistValue = currentRadiansAngleDistValue * 180 / Math.PI; //convert radians into degrees
      
            finalAngleInDegreesDistValue = -(getRadiansInDegreesDistValue - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
      
            //only allow rotate if greater than zero degrees or lesser than 270 degrees
            if(finalAngleInDegreesDistValue >= 0 && finalAngleInDegreesDistValue <= 270)
            {
                volumeKnobDistValue.style.transform = "rotate(" + finalAngleInDegreesDistValue + "deg)"; //use dynamic CSS transform to rotate volume knob
      
                //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
                volumeSettingDistValue = Math.round(finalAngleInDegreesDistValue * (400 / 270));
      
                tickHighlightPositionDistValue = Math.round(((volumeSettingDistValue) * 27/400)); //interpolate how many ticks need to be highlighted
                DistValue = volumeSettingDistValue;
                createTicksDistValue(27, tickHighlightPositionDistValue); //highlight ticks
      
                document.getElementById("volumeValue-distValue").innerHTML = volumeSettingDistValue; //update volume text
            }
        }
      
        //dynamically create volume knob "ticks"
        function createTicksDistValue(numTicks, highlightNumTicks)
        {
            //reset first by deleting all existing ticks
            while(tickContainerDistValue.firstChild)
            {
                tickContainerDistValue.removeChild(tickContainerDistValue.firstChild);
            }
      
            //create ticks
            for(var i=0;i<numTicks;i++)
            {
                var tickDistValue = document.createElement("div");
      
                //highlight only the appropriate ticks using dynamic CSS
                if(i < highlightNumTicks)
                {
                    tickDistValue.className = "tick activetick";
                } else {
                    tickDistValue.className = "tick";
                }
      
                tickContainerDistValue.appendChild(tickDistValue);
                tickDistValue.style.transform = "rotate(" + startingTickAngleDistValue + "deg)";
                startingTickAngleDistValue += 10;
            }
      
            startingTickAngleDistValue = -135; //reset
        }
      
        //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
        function detectMobileDistValue()
        {
            var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
      
            if(result !== null)
            {
                return "mobile";
            } else {
                return "desktop";
            }
        }
      
        function getMouseDownDistValue()
        {
            if(detectMobileDistValue() == "desktop")
            {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }
      
        function getMouseUpDistValue()
        {
            if(detectMobileDistValue() == "desktop")
            {
                return "mouseup";
            } else {
                return "touchend";
            }
        }
      
        function getMouseMoveDistValue()
        {
            if(detectMobileDistValue() == "desktop")
            {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }

// NumFreqs

function mainNumFreqs()
{
    volumeKnobNumFreqs.addEventListener(getMouseDownNumFreqs(), onMouseDownNumFreqs); //listen for mouse button click
    document.addEventListener(getMouseUpNumFreqs(), onMouseUpNumFreqs); //listen for mouse button numFreqs

    createTicksNumFreqs(27, 12);
}

//on mouse button down
function onMouseDownNumFreqs()
{
    document.addEventListener(getMouseMoveNumFreqs(), onMouseMoveNumFreqs); //start drag
}

//on mouse button numFreqs
function onMouseUpNumFreqs()
{
    document.removeEventListener(getMouseMoveNumFreqs(), onMouseMoveNumFreqs); //stop drag
}

//compute mouse angle relative to center of volume knob
//For clarification, see my basic trig explanation at:
//https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
function onMouseMoveNumFreqs(event)
{
    knobPositionXNumFreqs = boundingRectangleNumFreqs.left; //get knob's global x position
    knobPositionYNumFreqs = boundingRectangleNumFreqs.top; //get knob's global y position

    if(detectMobileNumFreqs() == "desktop")
    {
        mouseXNumFreqs = event.pageX; //get mouse's x global position
        mouseYNumFreqs = event.pageY; //get mouse's y global position
    } else {
        mouseXNumFreqs = event.touches[0].pageX; //get finger's x global position
        mouseYNumFreqs = event.touches[0].pageY; //get finger's y global position
    }

    knobCenterXNumFreqs = boundingRectangleNumFreqs.width / 2 + knobPositionXNumFreqs; //get global horizontal center position of knob relative to mouse position
    knobCenterYNumFreqs = boundingRectangleNumFreqs.height / 2 + knobPositionYNumFreqs; //get global vertical center position of knob relative to mouse position

    adjacentSideNumFreqs = knobCenterXNumFreqs - mouseXNumFreqs; //compute adjacent value of imaginary right angle triangle
    oppositeSideNumFreqs = knobCenterYNumFreqs - mouseYNumFreqs; //compute opposite value of imaginary right angle triangle

    //arc-tangent function returns circular angle in radians
    //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
    currentRadiansAngleNumFreqs = Math.atan2(adjacentSideNumFreqs, oppositeSideNumFreqs);

    getRadiansInDegreesNumFreqs = currentRadiansAngleNumFreqs * 180 / Math.PI; //convert radians into degrees

    finalAngleInDegreesNumFreqs = -(getRadiansInDegreesNumFreqs - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

    //only allow rotate if greater than zero degrees or lesser than 270 degrees
    if(finalAngleInDegreesNumFreqs >= 0 && finalAngleInDegreesNumFreqs <= 270)
    {
        volumeKnobNumFreqs.style.transform = "rotate(" + finalAngleInDegreesNumFreqs + "deg)"; //use dynamic CSS transform to rotate volume knob

        //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
        volumeSettingNumFreqs = Math.round(finalAngleInDegreesNumFreqs * (25 / 270) + 0.7);

        tickHighlightPositionNumFreqs = Math.round(((volumeSettingNumFreqs) * 27/26)); //interpolate how many ticks need to be highlighted
        NumFreqs = volumeSettingNumFreqs;
        createTicksNumFreqs(27, tickHighlightPositionNumFreqs); //highlight ticks

        document.getElementById("volumeValue-numFreqs").innerHTML = volumeSettingNumFreqs; //update volume text
    }
}

//dynamically create volume knob "ticks"
function createTicksNumFreqs(numTicks, highlightNumTicks)
{
    //reset first by deleting all existing ticks
    while(tickContainerNumFreqs.firstChild)
    {
        tickContainerNumFreqs.removeChild(tickContainerNumFreqs.firstChild);
    }

    //create ticks
    for(var i=0;i<numTicks;i++)
    {
        var tickNumFreqs = document.createElement("div");

        //highlight only the appropriate ticks using dynamic CSS
        if(i < highlightNumTicks)
        {
            tickNumFreqs.className = "tick activetick";
        } else {
            tickNumFreqs.className = "tick";
        }

        tickContainerNumFreqs.appendChild(tickNumFreqs);
        tickNumFreqs.style.transform = "rotate(" + startingTickAngleNumFreqs + "deg)";
        startingTickAngleNumFreqs += 10;
    }

    startingTickAngleNumFreqs = -135; //reset
}

//detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
function detectMobileNumFreqs()
{
    var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

    if(result !== null)
    {
        return "mobile";
    } else {
        return "desktop";
    }
}

function getMouseDownNumFreqs()
{
    if(detectMobileNumFreqs() == "desktop")
    {
        return "mousedown";
    } else {
        return "touchstart";
    }
}

function getMouseUpNumFreqs()
{
    if(detectMobileNumFreqs() == "desktop")
    {
        return "mouseup";
    } else {
        return "touchend";
    }
}

function getMouseMoveNumFreqs()
{
    if(detectMobileNumFreqs() == "desktop")
    {
        return "mousemove";
    } else {
        return "touchmove";
    }
}

// UnisonWidth

function mainUnisonWidth()
{
    volumeKnobUnisonWidth.addEventListener(getMouseDownUnisonWidth(), onMouseDownUnisonWidth); //listen for mouse button click
    document.addEventListener(getMouseUpUnisonWidth(), onMouseUpUnisonWidth); //listen for mouse button unisonWidth

    createTicksUnisonWidth(27, 0);
}

//on mouse button down
function onMouseDownUnisonWidth()
{
    document.addEventListener(getMouseMoveUnisonWidth(), onMouseMoveUnisonWidth); //start drag
}

//on mouse button unisonWidth
function onMouseUpUnisonWidth()
{
    document.removeEventListener(getMouseMoveUnisonWidth(), onMouseMoveUnisonWidth); //stop drag
}

//compute mouse angle relative to center of volume knob
//For clarification, see my basic trig explanation at:
//https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
function onMouseMoveUnisonWidth(event)
{
    knobPositionXUnisonWidth = boundingRectangleUnisonWidth.left; //get knob's global x position
    knobPositionYUnisonWidth = boundingRectangleUnisonWidth.top; //get knob's global y position

    if(detectMobileUnisonWidth() == "desktop")
    {
        mouseXUnisonWidth = event.pageX; //get mouse's x global position
        mouseYUnisonWidth = event.pageY; //get mouse's y global position
    } else {
        mouseXUnisonWidth = event.touches[0].pageX; //get finger's x global position
        mouseYUnisonWidth = event.touches[0].pageY; //get finger's y global position
    }

    knobCenterXUnisonWidth = boundingRectangleUnisonWidth.width / 2 + knobPositionXUnisonWidth; //get global horizontal center position of knob relative to mouse position
    knobCenterYUnisonWidth = boundingRectangleUnisonWidth.height / 2 + knobPositionYUnisonWidth; //get global vertical center position of knob relative to mouse position

    adjacentSideUnisonWidth = knobCenterXUnisonWidth - mouseXUnisonWidth; //compute adjacent value of imaginary right angle triangle
    oppositeSideUnisonWidth = knobCenterYUnisonWidth - mouseYUnisonWidth; //compute opposite value of imaginary right angle triangle

    //arc-tangent function returns circular angle in radians
    //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
    currentRadiansAngleUnisonWidth = Math.atan2(adjacentSideUnisonWidth, oppositeSideUnisonWidth);

    getRadiansInDegreesUnisonWidth = currentRadiansAngleUnisonWidth * 180 / Math.PI; //convert radians into degrees

    finalAngleInDegreesUnisonWidth = -(getRadiansInDegreesUnisonWidth - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

    //only allow rotate if greater than zero degrees or lesser than 270 degrees
    if(finalAngleInDegreesUnisonWidth >= 0 && finalAngleInDegreesUnisonWidth <= 270)
    {
        volumeKnobUnisonWidth.style.transform = "rotate(" + finalAngleInDegreesUnisonWidth + "deg)"; //use dynamic CSS transform to rotate volume knob

        //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
        volumeSettingUnisonWidth = Math.round(finalAngleInDegreesUnisonWidth * (19 / 270) + 0.7);

        tickHighlightPositionUnisonWidth = Math.round(((volumeSettingUnisonWidth) * 27/20)); //interpolate how many ticks need to be highlighted
        unisonWidth = volumeSettingUnisonWidth;
        createTicksUnisonWidth(27, tickHighlightPositionUnisonWidth); //highlight ticks

        document.getElementById("volumeValue-unisonWidth").innerHTML = volumeSettingUnisonWidth; //update volume text
    }
}

//dynamically create volume knob "ticks"
function createTicksUnisonWidth(numTicks, highlightNumTicks)
{
    //reset first by deleting all existing ticks
    while(tickContainerUnisonWidth.firstChild)
    {
        tickContainerUnisonWidth.removeChild(tickContainerUnisonWidth.firstChild);
    }

    //create ticks
    for(var i=0;i<numTicks;i++)
    {
        var tickUnisonWidth = document.createElement("div");

        //highlight only the appropriate ticks using dynamic CSS
        if(i < highlightNumTicks)
        {
            tickUnisonWidth.className = "tick activetick";
        } else {
            tickUnisonWidth.className = "tick";
        }

        tickContainerUnisonWidth.appendChild(tickUnisonWidth);
        tickUnisonWidth.style.transform = "rotate(" + startingTickAngleUnisonWidth + "deg)";
        startingTickAngleUnisonWidth += 10;
    }

    startingTickAngleUnisonWidth = -135; //reset
}

//detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
function detectMobileUnisonWidth()
{
    var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

    if(result !== null)
    {
        return "mobile";
    } else {
        return "desktop";
    }
}

function getMouseDownUnisonWidth()
{
    if(detectMobileUnisonWidth() == "desktop")
    {
        return "mousedown";
    } else {
        return "touchstart";
    }
}

function getMouseUpUnisonWidth()
{
    if(detectMobileUnisonWidth() == "desktop")
    {
        return "mouseup";
    } else {
        return "touchend";
    }
}

function getMouseMoveUnisonWidth()
{
    if(detectMobileUnisonWidth() == "desktop")
    {
        return "mousemove";
    } else {
        return "touchmove";
    }
}

        // BaseFreq

        function mainBaseFreq()
        {
            volumeKnobBaseFreq.addEventListener(getMouseDownBaseFreq(), onMouseDownBaseFreq); //listen for mouse button click
            document.addEventListener(getMouseUpBaseFreq(), onMouseUpBaseFreq); //listen for mouse button baseFreq
      
            createTicksBaseFreq(27, 2);
        }
      
        //on mouse button down
        function onMouseDownBaseFreq()
        {
            document.addEventListener(getMouseMoveBaseFreq(), onMouseMoveBaseFreq); //start drag
        }
      
        //on mouse button baseFreq
        function onMouseUpBaseFreq()
        {
            document.removeEventListener(getMouseMoveBaseFreq(), onMouseMoveBaseFreq); //stop drag
        }
      
        //compute mouse angle relative to center of volume knob
        //For clarification, see my basic trig explanation at:
        //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
        function onMouseMoveBaseFreq(event)
        {
            knobPositionXBaseFreq = boundingRectangleBaseFreq.left; //get knob's global x position
            knobPositionYBaseFreq = boundingRectangleBaseFreq.top; //get knob's global y position
      
            if(detectMobileBaseFreq() == "desktop")
            {
                mouseXBaseFreq = event.pageX; //get mouse's x global position
                mouseYBaseFreq = event.pageY; //get mouse's y global position
            } else {
                mouseXBaseFreq = event.touches[0].pageX; //get finger's x global position
                mouseYBaseFreq = event.touches[0].pageY; //get finger's y global position
            }
      
            knobCenterXBaseFreq = boundingRectangleBaseFreq.width / 2 + knobPositionXBaseFreq; //get global horizontal center position of knob relative to mouse position
            knobCenterYBaseFreq = boundingRectangleBaseFreq.height / 2 + knobPositionYBaseFreq; //get global vertical center position of knob relative to mouse position
      
            adjacentSideBaseFreq = knobCenterXBaseFreq - mouseXBaseFreq; //compute adjacent value of imaginary right angle triangle
            oppositeSideBaseFreq = knobCenterYBaseFreq - mouseYBaseFreq; //compute opposite value of imaginary right angle triangle
      
            //arc-tangent function returns circular angle in radians
            //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
            currentRadiansAngleBaseFreq = Math.atan2(adjacentSideBaseFreq, oppositeSideBaseFreq);
      
            getRadiansInDegreesBaseFreq = currentRadiansAngleBaseFreq * 180 / Math.PI; //convert radians into degrees
      
            finalAngleInDegreesBaseFreq = -(getRadiansInDegreesBaseFreq - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
      
            //only allow rotate if greater than zero degrees or lesser than 270 degrees
            if(finalAngleInDegreesBaseFreq >= 0 && finalAngleInDegreesBaseFreq <= 270)
            {
                volumeKnobBaseFreq.style.transform = "rotate(" + finalAngleInDegreesBaseFreq + "deg)"; //use dynamic CSS transform to rotate volume knob
      
                //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
                volumeSettingBaseFreq = Math.round(finalAngleInDegreesBaseFreq * (4950 / 270) + 49.7);
      
                tickHighlightPositionBaseFreq = Math.round(((volumeSettingBaseFreq - 49.7) * 27/5000)); //interpolate how many ticks need to be highlighted
                baseFreq = volumeSettingBaseFreq;
                createTicksBaseFreq(27, tickHighlightPositionBaseFreq); //highlight ticks
      
                document.getElementById("volumeValue-baseFreq").innerHTML = volumeSettingBaseFreq + " Hz"; //update volume text
            }
        }
      
        //dynamically create volume knob "ticks"
        function createTicksBaseFreq(numTicks, highlightNumTicks)
        {
            //reset first by deleting all existing ticks
            while(tickContainerBaseFreq.firstChild)
            {
                tickContainerBaseFreq.removeChild(tickContainerBaseFreq.firstChild);
            }
      
            //create ticks
            for(var i=0;i<numTicks;i++)
            {
                var tickBaseFreq = document.createElement("div");
      
                //highlight only the appropriate ticks using dynamic CSS
                if(i < highlightNumTicks)
                {
                    tickBaseFreq.className = "tick activetick";
                } else {
                    tickBaseFreq.className = "tick";
                }
      
                tickContainerBaseFreq.appendChild(tickBaseFreq);
                tickBaseFreq.style.transform = "rotate(" + startingTickAngleBaseFreq + "deg)";
                startingTickAngleBaseFreq += 10;
            }
      
            startingTickAngleBaseFreq = -135; //reset
        }
      
        //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
        function detectMobileBaseFreq()
        {
            var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
      
            if(result !== null)
            {
                return "mobile";
            } else {
                return "desktop";
            }
        }
      
        function getMouseDownBaseFreq()
        {
            if(detectMobileBaseFreq() == "desktop")
            {
                return "mousedown";
            } else {
                return "touchstart";
            }
        }
      
        function getMouseUpBaseFreq()
        {
            if(detectMobileBaseFreq() == "desktop")
            {
                return "mouseup";
            } else {
                return "touchend";
            }
        }
      
        function getMouseMoveBaseFreq()
        {
            if(detectMobileBaseFreq() == "desktop")
            {
                return "mousemove";
            } else {
                return "touchmove";
            }
        }

  // Slider Button

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/

  mainDuration2();
  mainNumTimes();
  mainThreshold();
  mainAttack();
  mainRelease();
  mainDecay();
  mainSustain();
  mainFrequency();
  mainFiltSlid();
  mainFiltGain();
  mainDistValue();
  mainNumFreqs();
  mainUnisonWidth();
  mainBaseFreq();

export { showImage, playButton, pianoButton, acousticButton, edmButton, organButton, manualButton, sineButton, squareButton, sawtoothButton, triangleButton};
