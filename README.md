
CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Installation
 * Using the App

INTRODUCTION
------------

Sonify is an image sonification web app that was created in January 2022. 
Originally, the application was intended to create sonic representations
for data sets so as to aid the visually impaired and/or add a dimension to
interpreting data.

It has evolved into an image sonification app purely. It serves the same
purposes that the original app intended but with the aim to help visual 
impaired people to visualize in some way different type of images.

This is the fruit of these labors.

INSTALLATION
------------

To be able to open and use the Sonfiy app properly, first start by opening
your terminal app. Then open the path to the application's source folder.
Then proceed by typing in
	
	npm install
	npm install --save-dev parcel
	npx parcel index.html

The first command will install all the necessary function files which will
be scanned from the JSON file found in the source folder.

The second command will install parcel which will allow us to run the app.

The third command will run the app's index file providing a localhost server
address which can run the app in any browser.

USING THE APP
-------------

Once you open the app you will find an image input button where you can upload 
the image you would like to sonify. You have five different synthesized sounds 
to choose from (Acoustic, Piano, EDM, Organ and Manual). You then have Parameters you  
can control such as the duration of each note, the number of stime steps you want your 
image to have and, finally, the threshold value which is going to decide if a 
pixel is played or not. If its value is 0, all the pixels are going to be played 
but if it is 1, no pixel will be played. Besides the scale that is being played 
can change depending on the interest of the user.

You can also choose the Manual Mode option instead of a Synthesized sound and 
create your own custom sound. You can choose one of four waveforms, (Sine, 
Triangle, Sawtooth or Triangle) and control different parameters such as the 
wave envelope. As well as a variety of other controls that can be found in a synthesizer:

	Filter: 	you can apply a variety of filters to the image you want 
			to sonify by selecting its frequency location as well as other 
			filter parameters.

	Wave envelope : with this parameters you can custom the wave envelope

	Distortion: 	You can turn distortion on and off and also vary it's 
			ammount

	Musical parameters: You can choose from a wide range of scales to be 
			    used. Also you can add harmonics to the base notes
		            so you can create different types of sounds and try
			    to synthesize your own instrument 
		


Brief parameters description:

//Input vars
SoundType = "acoustic"; // This can be manual, piano, acoustic, edm or organ, when it is manual we use the other params, if it is any of the other we only use duration2, ScaleType, NumTimes and threshold
ScaleType = "Chromatic";  // Can be any from the object "Scales" defined above


// All this are in seconds, they are to parametrize the waveform
attack = 0.06; 
release = 0.1;
decay = 0.05;
sustain = 0.15;
//----------------
oscType = "square"; // can be sine, square, sawtooth, triangle
baseFreq = 440; // Base note freq
threshold = 0.4; //Value from 0 to 1, it is a threshold to decide if a pixel is played or not, when 0 all pixels are played, higher values means only very edgy objets are played

//Filter
filterTyp = "lowpass"; // can be: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
filtFreq = 1000; // filter freq reference
filtQslider = -4; // Some other parameter for the filter that I don't remember, have to be positive
filtGain = 0; // Other parameter of the filter. can be either negative or positve

//Distortion
ApplyDist = "false"; // true or false
DistValue = 0; //Ammount of distortion
DistOver = "none";//Oversampling after distortion. Valid values are 'none', '2x', or '4x'.

NumFreqs = 12; //How many frequencies we want to have in total
NumTimes = 20; //How many time steps we want to have in total 

detune = true; //Detune the oscilators can only be true or false
unisonWidth =  1; //Detune value, it can be a low number, from 1 to 20 more or less

harmonics = [1,0.5,1,0.5,1]; // Weigths for the harmonics, the size of the array is the number of harmonics, and the values are the weigths.

duration = 1; //Duration of notes when preset synth is used