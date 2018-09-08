//TinyMusic github link: https://github.com/kevincennis/TinyMusic

var ac = new AudioContext();
var tempo = 120;
var sequencecombo = new TinyMusic.Sequence( ac, tempo, [
    'G2 e', 
  ]);
  sequencecombo.loop = false;
  sequencecombo.gain.gain.value = 0.05;
  var sequencefailcombo = new TinyMusic.Sequence( ac, tempo, [
    'G1 e', 
  ]);
  sequencefailcombo.gain.gain.value = 0.05;
  sequencefailcombo.loop=false;
  var sequencegotscore= new TinyMusic.Sequence( ac, tempo, [
    'A5 e', 
  ]);
  sequencegotscore.loop=false;
  sequencegotscore.gain.gain.value=0.05;
  var sequencekill= new TinyMusic.Sequence( ac, tempo, [
    'G3 e', 
  ]);
  sequencekill.gain.gain.value =0.05;
  sequencekill.loop=false;
  var sequencelose= new TinyMusic.Sequence( ac, tempo, [
    'G1 q', 
  ]);
  sequencelose.loop=false;
  sequencelose.gain.gain.value = 0.05;

