'use strict';

/**
 * FFmpegUtil - Utility function collection of ffmpeg
 *
 * ####Example:
 *
 *     FFmpegUtil.addDefaultOptions({
 *        command: this.mainCommand,
 *        audio: this.getConf('audio'),
 *     });
 *
 * @object
 */
const isArray = require('lodash/isArray');
const forEach = require('lodash/forEach');
const ffmpeg = require('fluent-ffmpeg');

const FFmpegUtil = {
  getFFmpeg() {
    return ffmpeg;
  },

  setFFmpegPath(path) {
    ffmpeg.setFfmpegPath(path);
  },

  setFFprobePath(path) {
    ffmpeg.setFfprobePath(path);
  },

  createCommand(conf = {}) {
    const { threads = 1 } = conf;
    const command = ffmpeg();
    if (threads > 1) command.addOptions([`-threads ${threads}`]);
    return command;
  },

  concatOpts(opts, arr) {
    if (isArray(arr)) {
      forEach(arr, o => opts.push(o));
    } else {
      opts.push(arr);
    }
  },

  /**
   * get Current ffmpeg version
   * @public
   */
  getVersion() {
    return new Promise(resolve => {
      ffmpeg()
        .addOptions([`-version`])
        .output('./')
        .on('end', (result = '') => {
          result = result.replace(/copyright[\s\S]*/gi, '');
          let version = result.split(' ')[2];
          version = version.split('.').join('');
          resolve(parseInt(version));
        })
        .on('error', () => {
          let version = '4.2.2';
          version = version.split('.').join('');
          resolve(parseInt(version));
        })
        .run();
    });
  },

  /**
   * Add some basic output properties
   * @public
   */
  addDefaultOptions({ command, conf, audio }) {
    const vb = conf.getVal('vb');
    const crf = conf.getVal('crf');
    const preset = conf.getVal('preset');
    const vprofile = conf.getVal('vprofile');
    const upStreaming = conf.getVal('upStreaming');

    let outputOptions = []
      //---- misc ----
      .concat([
        // '-map',
        // '0',
        '-hide_banner', // hide_banner - parameter, you can display only meta information
        '-map_metadata',
        '-1',
        '-map_chapters',
        '-1',
      ])

      //---- video ----
      .concat([
        '-c:v',
        'libx264', // c:v - H.264
        '-profile:v',
        vprofile, // profile:v - main profile: mainstream image quality. Provide I / P / B frames, default
        '-preset',
        preset, // preset - compromised encoding speed
        '-crf',
        crf, // crf - The range of quantization ratio is 0 ~ 51, where 0 is lossless mode, 23 is the default value, 51 may be the worst
        '-movflags',
        'faststart',
        '-pix_fmt',
        'yuv420p',
      ]);

    //---- vb -----
    if (vb) {
      outputOptions = outputOptions.concat(['-vb', vb]);
    }

    //---- audio ----
    if (audio) {
      outputOptions = outputOptions.concat(['-c:a', 'copy', '-shortest']);
    }

    //---- live stream ----
    if (!upStreaming) {
      outputOptions = outputOptions.concat(['-map', '0']);
    }

    command.outputOptions(outputOptions);
    return command;
  },

  /**
   * Add event to ffmpeg command
   * @public
   */
  addCommandEvents({
    command,
    log = false,
    start,
    complete,
    error,
    progress,
    totalFrames,
    type = '',
  }) {
    command
      .on('start', commandLine => {
        if (log) console.log(`${type}: ${commandLine}`);
        const event = { type: `${type}-start`, command: commandLine };
        start && start(event);
      })
      .on('progress', function(p) {
        const frames = p.frames;
        const fpercent = frames / totalFrames;
        const event = { type: `${type}-progress`, fpercent, frames, totalFrames };
        progress && progress(event);
      })
      .on('end', () => {
        const event = { type: `${type}-complete` };
        complete && complete(event);
      })
      .on('error', err => {
        const event = { type: `${type}-error`, error: err };
        console.log('==============');
        console.log(err);
        error && error(event);
      });

    return command;
  },

  destroy(command) {
    try {
      command.removeAllListeners();
      command.kill();
      command._inputs.length = 0;
      command._currentInput = null;
    } catch (e) {}
  },
};

module.exports = FFmpegUtil;
