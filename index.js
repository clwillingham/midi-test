var fs = require('fs');
var Midi = require('jsmidgen');
var sh = require('shelljs');

//var scale = [
//    0, 1, 3, 5, 7, 10, 11
//];
var scale = [
    0, 2, 4, 7, 9
];
var STEP = 32;
var goingUp = true;
var length = 0;
var file = new Midi.File();
var mainTrack = new Midi.Track();
var sideTracks = [
    new Midi.Track(),
    new Midi.Track()
];
//var voiceTrack2 = new Midi.Track();
var notes = [];
file.addTrack(mainTrack);


//voiceTrack2.setInstrument(1, 53);
for(var v = 0; v < sideTracks.length; v++){
    console.log(v+1);
    file.addTrack(sideTracks[v]);
    sideTracks[v].setInstrument(v+1, 74)
}
mainTrack.setInstrument(0, 53);
//for(var t = 3; t < 8; t++)
//for(var i in scale){
//    mainTrack.addNote(0, scale[i]+(12*t), 64);
//}
//
//for(var t = 7; t > 2; t--)
//    for(var i = scale.length - 1; i >= 0; i--){
//        mainTrack.addNote(0, scale[i]+(12*t), 64);
//    }

function calcNote(note){
    var output;
    if(note < scale.length){
        output = scale[note];
    }else{
        var interval = Math.floor(note/scale.length);
        var scalePosition = note - (interval*scale.length);
        console.log(scalePosition);
        output = scale[scalePosition]+(12*interval);
    }
    return output;
}
function getRandom(max) {
    return Math.round(Math.random() * (max));
}



var current_note = 8;
var loops = 0;
while(loops < 1){
    var randNum;
    if (goingUp){
        randNum = getRandom(19);
        if (randNum > 12 && current_note > 12){
            current_note--;
        }
        else if (randNum < 8 && current_note < 30){
            current_note++;
        }
        else if (current_note <= 15){
            current_note++;
        }
        else if (current_note >= 30){
            current_note--;
            goingUp = false;
        }
    }
    else{
        randNum = getRandom(19);
        if (randNum > 8 && current_note > 15){
            current_note--;
        }
        else if (randNum < 6 && current_note < 40){
            current_note++;
        }
        else if (current_note <= 15){
            current_note++;
            goingUp = true;
            loops++;
        }
        else if (current_note >= 40){
            current_note--;
        }
    }
    notes.push(current_note);
    //mainTrack.addNote(0, calcNote(current_note), 64);
}
var delayTime = STEP;
for(var i in notes){
    var prev_note = -1;
    current_note = notes[i];
    if(i > 0)
        prev_note = notes[i-1];
    if(current_note == prev_note){
        delayTime += STEP;
    }else{
        delayTime = STEP;

    }
    if(notes[i+1] != current_note){
        mainTrack.addNote(0, calcNote(current_note), delayTime);
        for(var v=0; v < sideTracks.length; v++){
            console.log(v);
            sideTracks[v].addNote(v+1, calcNote(current_note+(v*2)), delayTime*2);
        }
        //voiceTrack2.addNote(1, calcNote(current_note+2), delayTime*2);
        mainTrack.addNote(0, calcNote(current_note+4), delayTime)
        length += delayTime;
    }
}

//console.log('TRACK LENGTH: ' + Math.round(length/(STEP*12)));
//for(var p = 0; p < length; p += (STEP*10)){
//    voiceTrack2.addNote(1, 60, STEP*10);
//}

mainTrack.addNote(0, calcNote(current_note--), 200);
mainTrack.addNote(0, calcNote(current_note--), 200);
mainTrack.addNote(0, calcNote(current_note--), 204);
mainTrack.addNote(0, calcNote(current_note--), 500);
mainTrack.addNote(0, calcNote(current_note+2), 1000);
mainTrack.addNoteOff(0, calcNote(current_note+2), 100);

fs.writeFileSync('test.mid', file.toBytes(), 'binary');
sh.exec('test.mid');