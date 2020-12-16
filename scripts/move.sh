#!/bin/bash
# Does not rely on zoompan

ffmpeg -threads 2 -i imgs/003.jpeg -i imgs/logo.png \
-filter_complex \
"[0:v]format=yuva420p,scale=8000x4500,zoompan=z='zoom+0.002':d=25*14:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=800*450[bg0];  \
[1:v]format=yuva420p[logo1]; \
[bg0][logo1]overlay=x='if(between(t,0,4),-300+700*(2*t/4-pow(t/4,2)),400)':y=(H-h)/2:enable='between(t,2,10)'" \
-ss 1 -t 20 -c:v libx264 -c:a aac move.mp4