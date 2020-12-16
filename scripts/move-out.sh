#!/bin/bash
# https://superuser.com/questions/713498/how-to-show-overlay-image-in-a-certain-time-span-with-ffmpeg
# disappear enable=between(t\,0\,11)

ffmpeg -threads 2 -loop 1 -i imgs/003.jpeg -t 12  -loop 1 -i imgs/logo.png -t 11 \
-filter_complex \
"color=c=black:r=60:size=800*450:d=20.0[black];\
[0:v]format=yuva420p,scale=8000x4500,zoompan=z='zoom+0.002':d=25*12:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=800*450[bg0];  \
[1:v]format=yuva420p,scale=4000:4000,setsar=1/1,zoompan=z='zoom+0.002':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=125,trim=duration=5[v1];[v1]scale=200:200[logo1]; \
[black][bg0]overlay=eof_action=pass[bg1];\
[bg1][logo1]overlay=x='if(between(t,0,5),-w+(W+w)/2/5*t,if(between(t,8,11),(W-w)/2 - 60*(t-8),(W-w)/2))':y=(H-h)/2:enable=between(t\,0\,11)" \
-ss 1 -t 20 -c:v libx264 -c:a aac move-out.mp4