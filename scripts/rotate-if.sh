#!/bin/bash
# Conditional rotation animation

ffmpeg -i imgs/001.jpeg -loop 1 -t 20  -i imgs/logo.png \
-filter_complex \
"[0:v]format=yuva420p,scale=8000x4500,zoompan=z='zoom+0.002':d=25*14:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=800*450[bg0];  \
[1:v]format=yuva420p,rotate=a='if(lte(t,5),PI*2/10*t)':ow=hypot(iw\,ih):oh=ow:c=black@0[logo1]; \
[logo1]fade=t=in:st=1.0:d=2.0:alpha=1[logo];\
[bg0][logo]overlay=x='400-t*60':y=(H-h)/2" \
-ss 1 -t 20 -c:v libx264 -c:a aac rotateif.mp4