var fs = require('fs');
var Midi = require('jsmidgen');
var sh = require('shelljs');

//var scale = [
//    0, 1, 3, 5, 7, 10, 11
//];
var scale = [
    0, 2, 4, 7, 9
];

var goingUp = true;
var file = new Midi.File();
var track = new Midi.Track();
var notes = [];
file.addTrack(track);
track.setInstrument(0, 53);
//for(var t = 3; t < 8; t++)
//for(var i in scale){
//    track.addNote(0, scale[i]+(12*t), 64);
//}
//
//for(var t = 7; t > 2; t--)
//    for(var i = scale.length - 1; i >= 0; i--){
//        track.addNote(0, scale[i]+(12*t), 64);
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
        if (randNum > 12 && current_note > 15){
            current_note--;
        }
        else if (randNum < 8 && current_note < 40){
            current_note++;
        }
        else if (current_note <= 15){
            current_note++;
        }
        else if (current_note >= 40){
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
    //track.addNote(0, calcNote(current_note), 64);
}
var delayTime = 64;
for(var i in notes){
    var prev_note = -1;
    current_note = notes[i];
    if(i > 0)
        prev_note = notes[i-1];
    if(current_note == prev_note){
        delayTime += 64;

    }else{
        delayTime = 64;
    }
    if(notes[i+1] != current_note)
        track.addNote(0, calcNote(current_note), delayTime);

}

track.addNote(0, calcNote(current_note--), 200);
track.addNote(0, calcNote(current_note--), 200);
track.addNote(0, calcNote(current_note--), 204);
track.addNote(0, calcNote(current_note--), 500);
track.addNote(0, calcNote(current_note+2), 1000);
track.addNoteOff(0, calcNote(current_note+2), 100);

fs.writeFileSync('test.mid', file.toBytes(), 'binary');
sh.exec('test.mid');