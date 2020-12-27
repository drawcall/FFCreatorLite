'use strict';

/**
 * FFCreatorCenter - A global FFCreator task scheduling center.
 * You don’t have to use it, you can easily implement a task manager by yourself.
 *
 * ####Example:
 *
 *     FFCreatorCenter.addTask(()=>{
 *       const creator = new FFCreator;
 *       return creator;
 *     });
 *
 *
 * ####Note:
 *     On the server side, you only need to start FFCreatorCenter,
 *     remember to add error logs to the events in it
 *
 * @object
 */

const EventEmitter = require('events');
const forEach = require('lodash/forEach');
const Utils = require('../utils/utils');
const FFmpegUtil = require('../utils/ffmpeg');

/**
 * TaskQueue - Task queue, representing a production task
 * @class
 */
class TaskQueue {
  constructor() {
    this.queue = [];
  }

  /**
   * Add a subtask to the end of the task queue
   * @param {function} task - a task handler function
   * @return {string} task id
   * @public
   */
  push(task) {
    const id = Utils.uid();
    this.queue.push({id, task, state: 'waiting'});
    return id;
  }

  /**
   * Delete a task from the task queue
   * @param {object} taskObj - a task config object
   * @return {number} the task index
   * @public
   */
  remove(taskObj) {
    const index = this.queue.indexOf(taskObj);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
    return index;
  }

  /**
   * Clear all tasks in the queue
   * @public
   */
  clear() {
    // clear object after 15s
    forEach(this.queue, taskObj => {
      setTimeout(() => {
        Utils.destroyObj(taskObj);
      }, 15 * 1000);
    });
    this.queue.length = 0;
  }

  getLength() {
    return this.queue.length;
  }

  /**
   * Get the status of a task by id
   * @public
   */
  getTaskState(id) {
    forEach(this.queue, taskObj => {
      if (id == taskObj.id) return taskObj.state;
    });

    return 'unknown';
  }

  /**
   * Get a task by index
   * @public
   */
  getTaskByIndex(index) {
    if (index < this.queue.length) {
      return this.queue[index];
    }

    return null;
  }
}

/**
 * Progress - A class used to calculate the production progress
 * @class
 */
class Progress {
  constructor(max) {
    this.id = -1;
    this.ids = [];
    this.percent = 0;
    this.max = max || 20;
  }

  add(id) {
    this.ids.push(id);
    if (this.ids.length > this.max) this.ids.shift();
  }

  getPercent(id) {
    if (this.id == id) {
      return this.percent;
    } else if (this.ids.indexOf(id) > -1) {
      return 1;
    } else {
      return 0;
    }
  }
}

/**
 * FFCreatorCenter - A global FFCreator task scheduling center.
 * @object
 */
const FFCreatorCenter = {
  cursor: 0,
  delay: 500,
  state: 'free',
  progressLog: false,
  progress: new Progress(),
  event: new EventEmitter(),
  taskQueue: new TaskQueue(),

  /**
   * Add a production task
   * @param {function} task - a production task
   * @public
   */
  addTask(task) {
    const id = this.taskQueue.push(task);
    if (this.state == 'free') this.start();
    return id;
  },

  /**
   * Listen to production task events
   * @param {string} id - a task id
   * @param {strint} eventName - task name
   * @param {function} func - task event handler
   * @public
   */
  onTask(id, eventName, func) {
    const handler = result => {
      if (result.id === id) {
        this.event.removeListener(eventName, handler);
        // this.removeTaskObj(eventName, result);
        func(result);
      }
    };

    this.event.on(eventName, handler);
  },

  removeTaskObj(eventName, result) {
    // remove taskObj after 5s
    if (eventName == 'single-error' || eventName == 'single-complete') {
      setTimeout(() => {
        const {taskObj} = result;
        this.taskQueue.remove(taskObj);
      }, 5000);
    }
  },

  /**
   * Listen to production task Error events
   * @param {string} id - a task id
   * @param {function} func - task event handler
   * @public
   */
  onTaskError(id, func) {
    this.onTask(id, 'single-error', func);
  },

  /**
   * Listen to production task Complete events
   * @param {string} id - a task id
   * @param {function} func - task event handler
   * @public
   */
  onTaskComplete(id, func) {
    this.onTask(id, 'single-complete', func);
  },
  /**
   * Listen to production task Complete events
   * @param {string} id - a task id
   * @param {function} func - task event handler
   * @public
   */
  onTaskProgress(id, func) {
    const eventName = 'single-progress';
    this.progressLog = true;

    this.onTask(id, eventName, () => {
      const handler = result => {
        if (result.id === id) {
          if (result.progress >= 1) this.event.removeListener(eventName, handler);
          func(result);
        }
      };

      this.event.on(eventName, handler);
    });
  },

  /**
   * Start a task
   * @async
   * @public
   */
  async start() {
    const taskObj = this.taskQueue.getTaskByIndex(this.cursor);
    this.execTask(taskObj);
  },

  /**
   * Get the status of a task by id
   * @public
   */
  getTaskState(id) {
    return this.taskQueue.getTaskState(id);
  },

  getProgress(id) {
    return this.progress.getPercent(id);
  },

  async execTask(taskObj) {
    this.state = 'busy';
    try {
      this.cursor++;
      const creator = await taskObj.task(taskObj.id);
      if (!creator) {
        this.handlingError({
          taskObj,
          error: 'execTask: await taskObj.task(taskObj.id) return null',
        });
      } else {
        this.initCreator(creator, taskObj);
      }
    } catch (error) {
      console.error(error);
      this.handlingError({taskObj, error});
    }
  },

  initCreator(creator, taskObj) {
    creator.inCenter = true;
    creator.taskid = taskObj.id;
    creator.generateOutput();

    // event listeners
    creator.on('start', () => {
      const result = {id: taskObj.id, taskObj};
      this.event.emit('single-start', result);
    });

    creator.on('error', event => {
      this.handlingError({taskObj, error: event});
    });

    creator.on('progress', progress => {
      this.progress.id = taskObj.id;
      this.progress.state = progress.state;
      this.progress.percent = progress.percent;
      if (this.progressLog) {
        this.event.emit('single-progress', this.progress);
      }
    });

    creator.on('complete', () => {
      this.progress.add(taskObj.id);
      const result = {id: taskObj.id, file: creator.getFile(), taskObj};
      taskObj.state = 'complete';
      this.event.emit('single-complete', result);
      setTimeout(this.nextTask.bind(this), this.delay);
    });
  },

  handlingError({taskObj, error = 'normal'}) {
    const result = {id: taskObj.id, taskObj, error};
    taskObj.state = 'error';
    this.event.emit('single-error', result);
    setTimeout(this.nextTask.bind(this), this.delay);
  },

  nextTask() {
    if (this.cursor >= this.taskQueue.getLength()) {
      this.resetTasks();
      this.event.emit('all-complete');
      return;
    }

    const taskObj = this.taskQueue.getTaskByIndex(this.cursor);
    this.execTask(taskObj);
  },

  resetTasks() {
    this.cursor = 0;
    this.state = 'free';
    this.taskQueue.clear();
  },

  /**
   * Set the installation path of the current server ffmpeg.
   * If not set, the ffmpeg command of command will be found by default.
   *
   * @param {string} path - installation path of the current server ffmpeg
   * @public
   */
  setFFmpegPath(path) {
    FFmpegUtil.setFFmpegPath(path);
  },

  /**
   * Set the installation path of the current server ffprobe.
   * If not set, the ffprobe command of command will be found by default.
   *
   * @param {string} path - installation path of the current server ffprobe
   * @public
   */
  setFFprobePath(path) {
    FFmpegUtil.setFFprobePath(path);
  },

  openProgressLog() {
    this.progressLog = true;
  },
};

module.exports = FFCreatorCenter;
