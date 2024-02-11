import WaveSurfer  from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import Spectrogram from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/spectrogram.esm.js'

// Utility function
function el(id) { return document.getElementById(id); }

// Globals
let globalFilters = [];
let wavesurfer = null;

// Once the page is fully loaded, this function create objects and 
// generates audio pipeline.
function init(e) {

    // Create an audio source MediaElementSourceNode from the video.
    // In other words, get audio from video.
    if (el('video') ) { 
        el('video').remove(); 
    }
    // Destroy WaveSUrfer object, if one exists
    if (wavesurfer) {
        wavesurfer.destroy();
        wavesurfer = null;
    }

    // Create a new video element
    // <video id="video" width="500" height="300" autoplay="true" controls playsinline></video>
    let video = document.createElement("video");
    video.id = 'video';
    video.height = '300';
    video.width = '500';
    video.autoplay="true";
    video.controls = true;
    video.playsinline = true;
    el('td_video').appendChild(video);

    // Create Web Audio context
    let audioContext = new AudioContext();
    // audioContext.resume();

    // Create filters for each band in pipeline and store in array.
    // Bands [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
    let filters = [
        new BiquadFilterNode(audioContext, {
            type: 'lowshelf', // node type
            gain: 0.0,        // gain
            Q: 1,             // resonance
            frequency: 32     // frequency 
        }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 64 }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 125 }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 250 }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 500 }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 1000 }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 2000 }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 4000 }),
        new BiquadFilterNode(audioContext, { type: 'peaking', gain: 0.0, Q: 1, frequency: 8000 }),
        new BiquadFilterNode(audioContext, { type: 'highshelf', gain: 0.0, Q: 1, frequency: 16000 })
    ];

    // Create a WaveSurfer waveform to visualize the media element.
    wavesurfer = WaveSurfer.create({
        container:     document.getElementById('div_surfer'),
        waveColor:     'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        media: video //<- this is the important part
    });

    // Initialize the Spectrogram plugin
    wavesurfer.registerPlugin(
        Spectrogram.create({
            labels: true,
            height: 200,
            splitChannels: false,
        }),
    )

    // Build the audio processing pipeline.
    // Connect audioSource to each filter in series so all process audio data.
    // Connect final result to audio context destination.
    let audioSource = audioContext.createMediaElementSource(video);

    let pipeline =
        audioSource
            .connect(filters[0])
            .connect(filters[1])
            .connect(filters[2])
            .connect(filters[3])
            .connect(filters[4])
            .connect(filters[5])
            .connect(filters[6])
            .connect(filters[7])
            .connect(filters[8])
            .connect(filters[9])
            .connect(audioContext.destination);

    el('eq_preset').disabled = false;

    // Init and add event handler for each audio filter.
    el('id_f32').value = filters[0].gain.value;
    el('id_f32').oninput = (e) => {
        filters[0].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('32_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('32_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f64').value = filters[1].gain.value;
    el('id_f64').oninput = (e) => {
        filters[1].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('64_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('64_val').textContent = e.target.value + ' dB';
        }
    };

    el('id_f125').value = filters[2].gain.value;
    el('id_f125').oninput = (e) => {
        filters[2].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('125_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('125_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f250').value = filters[3].gain.value;
    el('id_f250').oninput = (e) => {
        filters[3].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('250_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('250_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f500').value = filters[4].gain.value;
    el('id_f500').oninput = (e) => {
        filters[4].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('500_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('500_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f1000').value = filters[5].gain.value;
    el('id_f1000').oninput = (e) => {
        filters[5].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('1000_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('1000_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f2000').value = filters[6].gain.value;
    el('id_f2000').oninput = (e) => {
        filters[6].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('2000_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('2000_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f4000').value = filters[7].gain.value;
    el('id_f4000').oninput = (e) => {
        filters[7].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('4000_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('4000_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f8000').value = filters[8].gain.value;
    el('id_f8000').oninput = (e) => {
        filters[8].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('8000_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('8000_val').textContent = e.target.value + ' dB';
        }
    }

    el('id_f16000').value = filters[9].gain.value;
    el('id_f16000').oninput = (e) => {
        filters[9].gain.value = e.target.value;
        if(e.target.value >= 0){
            el('16000_val').textContent = '+' + e.target.value + ' dB';
        } else {
            el('16000_val').textContent = e.target.value + ' dB';
        }
    }

    return filters;
}

// Util to enable all sliders
function enableFreqInputs() {
    el('id_f32').disabled = false;
    el('id_f64').disabled = false;
    el('id_f125').disabled = false;
    el('id_f250').disabled = false;
    el('id_f500').disabled = false;
    el('id_f1000').disabled = false;
    el('id_f2000').disabled = false;
    el('id_f4000').disabled = false;
    el('id_f8000').disabled = false;
    el('id_f16000').disabled = false;
}

// Util to disable all sliders
function disableFreqInputs() {
    el('id_f32').disabled = true;
    el('id_f64').disabled = true;
    el('id_f125').disabled = true;
    el('id_f250').disabled = true;
    el('id_f500').disabled = true;
    el('id_f1000').disabled = true;
    el('id_f2000').disabled = true;
    el('id_f4000').disabled = true;
    el('id_f8000').disabled = true;
    el('id_f16000').disabled = true;
}

// Select preset
el('eq_preset').oninput = (e) => {
    if(el('eq_preset').value == '1'){ // Default
        disableFreqInputs(); 
        el('id_f32').value = 0;
        globalFilters[0].gain.value = 0;
        el('32_val').textContent = '+0 dB';

        el('id_f64').value = 0;
        globalFilters[1].gain.value = 0;
        el('64_val').textContent = '+0 dB';

        el('id_f125').value = 0;
        globalFilters[2].gain.value = 0;
        el('125_val').textContent = '+0 dB';

        el('id_f250').value = 0;
        globalFilters[3].gain.value = 0;
        el('250_val').textContent = '+0 dB';

        el('id_f500').value = 0;
        globalFilters[4].gain.value = 0;
        el('500_val').textContent = '+0 dB';

        el('id_f1000').value = 0;
        globalFilters[5].gain.value = 0;
        el('1000_val').textContent = '+0 dB';

        el('id_f2000').value = 0;
        globalFilters[6].gain.value = 0;
        el('2000_val').textContent = '+0 dB';

        el('id_f4000').value = 0;
        globalFilters[7].gain.value = 0;
        el('4000_val').textContent = '+0 dB';

        el('id_f8000').value = 0;
        globalFilters[8].gain.value = 0;
        el('8000_val').textContent = '+0 dB';

        el('id_f16000').value = 0;
        globalFilters[9].gain.value = 0;
        el('16000_val').textContent = '+0 dB';
    } else if(el('eq_preset').value == '2') { // Bass Boost
        disableFreqInputs()

        el('id_f32').value = 0;
        globalFilters[0].gain.value = 6;
        el('32_val').textContent = '+6 dB';

        el('id_f64').value = 0;
        globalFilters[1].gain.value = 4;
        el('64_val').textContent = '+4 dB';

        el('id_f125').value = 0;
        globalFilters[2].gain.value = 2;
        el('125_val').textContent = '+2 dB';

        el('id_f250').value = 0;
        globalFilters[3].gain.value = 0;
        el('250_val').textContent = '+0 dB';

        el('id_f500').value = -2;
        globalFilters[4].gain.value = -2;
        el('500_val').textContent = '-2 dB';

        el('id_f1000').value = -2;
        globalFilters[5].gain.value = -2;
        el('1000_val').textContent = '-2 dB';

        el('id_f2000').value = 0;
        globalFilters[6].gain.value = 0;
        el('2000_val').textContent = '+0 dB';

        el('id_f4000').value = 0;
        globalFilters[7].gain.value = 0;
        el('4000_val').textContent = '+0 dB';

        el('id_f8000').value = 0;
        globalFilters[8].gain.value = 0;
        el('8000_val').textContent = '+0 dB';

        el('id_f16000').value = 0;
        globalFilters[9].gain.value = 0;
        el('16000_val').textContent = '+0 dB';
    } else if(el('eq_preset').value == '3') { // Treble Boost
        disableFreqInputs()

        el('id_f32').value = 0;
        globalFilters[0].gain.value = 0;
        el('32_val').textContent = '+0 dB';

        el('id_f64').value = 0;
        globalFilters[1].gain.value = 0;
        el('64_val').textContent = '+0 dB';

        el('id_f125').value = -2;
        globalFilters[2].gain.value = -2;
        el('125_val').textContent = '-2 dB';

        el('id_f250').value = -2;
        globalFilters[3].gain.value = -2;
        el('250_val').textContent = '-2 dB';

        el('id_f500').value = 0;
        globalFilters[4].gain.value = 0;
        el('500_val').textContent = '+0 dB';

        el('id_f1000').value = 0;
        globalFilters[5].gain.value = 0;
        el('1000_val').textContent = '+0 dB';

        el('id_f2000').value = 2;
        globalFilters[6].gain.value = 2;
        el('2000_val').textContent = '+2 dB';

        el('id_f4000').value = 4;
        globalFilters[7].gain.value = 4;
        el('4000_val').textContent = '+4 dB';

        el('id_f8000').value = 6;
        globalFilters[8].gain.value = 6;
        el('8000_val').textContent = '+6 dB';

        el('id_f16000').value = 6;
        globalFilters[9].gain.value = 6;
        el('16000_val').textContent = '+6 dB';
    } else if(el('eq_preset').value == '4') { // Vocal Boost
        disableFreqInputs()
        el('id_f32').value = -2;
        globalFilters[0].gain.value = -2;
        el('32_val').textContent = '-2 dB';

        el('id_f64').value = -2;
        globalFilters[1].gain.value = -2;
        el('64_val').textContent = '-2 dB';

        el('id_f125').value = 0;
        globalFilters[2].gain.value = 0;
        el('125_val').textContent = '+0 dB';

        el('id_f250').value = 2;
        globalFilters[3].gain.value = 2;
        el('250_val').textContent = '+2 dB';

        el('id_f500').value = 4;
        globalFilters[4].gain.value = 4;
        el('500_val').textContent = '+4 dB';

        el('id_f1000').value = 4;
        globalFilters[5].gain.value = 4;
        el('1000_val').textContent = '+4 dB';

        el('id_f2000').value = 2;
        globalFilters[6].gain.value = 2;
        el('2000_val').textContent = '+2 dB';

        el('id_f4000').value = 2;
        globalFilters[7].gain.value = 2;
        el('4000_val').textContent = '+2 dB';

        el('id_f8000').value = -2;
        globalFilters[8].gain.value = -2;
        el('8000_val').textContent = '-2 dB';

        el('id_f16000').value = -2;
        globalFilters[9].gain.value = -2;
        el('16000_val').textContent = '-2 dB';
    } else { // Custom
        enableFreqInputs();
    }
}

// When the video selected changes
function loadVideo(){

    // Disable graphic EQ slides
    disableFreqInputs();

    // Create filters
    globalFilters = init();

    const fileElem  = el('importInput');    // Gets the file element object
    const videoElem = el('video');          // Get the video element object

    // Load the video and plays it
    if (fileElem.files.length > 0) {
        videoElem.src = URL.createObjectURL(fileElem.files[0]);
        videoElem.onload = () => { URL.revokeObjectURL(videoElem.src); };
        videoElem.play();
    }

    //enableFreqInputs();
}

// When the selected file list changes, load video file and play it
el('importInput').addEventListener("change", loadVideo, false) ;
