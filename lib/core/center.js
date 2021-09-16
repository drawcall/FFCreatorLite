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

const EventEmitter = require('eventemitter3');
const forEach = require('lodash/forEach');
const cloneDeep = require('lodash/cloneDeep');
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
    this.queue.push({ id, task, state: 'waiting', events: {} });
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
    forEach(this.queue, taskObj => setTimeout(() => Utils.destroyObj(taskObj), 15));
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
    const taskObj = this.getTaskById(id);
    return taskObj ? taskObj.state : 'unknown';
  }

  /**
   * Get a taskObj by id
   * @public
   */
  getTaskById(id) {
    for (let taskObj of this.queue) {
      if (id === taskObj.id) return taskObj;
    }

    return null;
  }

  /**
   * Get a taskObj by index
   * @public
   */
  getHeadTask() {
    if (this.queue.length > 0) return this.queue[0];
    return null;
  }

  addListener(id, name, func) {
    const taskObj = this.getTaskById(id);
    if (taskObj) {
      taskObj.events[name] = func;
    }
  }

  getListener(id, name) {
    const taskObj = this.getTaskById(id);
    if (taskObj) {
      return taskObj.events[name];
    }
    return null;
  }
}

/**
 * Progress - A class used to calculate the production progress
 * @class
 */
class Progress {
  constructor(max = 30) {
    this.id = -1;
    this.ids = [];
    this.percent = 0;
    this.max = max;
  }

  add(id) {
    this.ids.push(id);
    if (this.ids.length > this.max) this.ids.shift();
  }

  getPercent(id) {
    if (this.id === id) {
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
    if (this.state === 'free') this.start();
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
    const { event, taskQueue } = this;
    taskQueue.addListener(id, eventName, func);
    if (event.listenerCount(eventName) <= 0) event.on(eventName, this.eventHandler.bind(this));
  },

  eventHandler(result) {
    let cresult = result;
    const { taskQueue } = this;
    const { id, eventName } = result;
    const taskObj = taskQueue.getTaskById(id);
    if (!taskObj) return;

    const func = taskQueue.getListener(id, eventName);
    if (eventName !== 'single-progress') cresult = cloneDeep(result);
    func(cresult);
  },

  removeTaskObj(id) {
    const { taskQueue } = this;
    const taskObj = taskQueue.getTaskById(id);
    if (!taskObj) return;

    Utils.destroyObj(taskObj['events']);
    Utils.destroyObj(taskObj);
    this.taskQueue.remove(taskObj);
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
   * Listen to production task Start events
   * @param {string} id - a task id
   * @param {function} func - task event handler
   * @public
   */
  onTaskStart(id, func) {
    this.onTask(id, 'single-start', func);
  },
  /**
   * Listen to production task Complete events
   * @param {string} id - a task id
   * @param {function} func - task event handler
   * @public
   */
  onTaskProgress(id, func) {
    this.onTask(id, 'single-progress', func);
  },

  /**
   * Start a task
   * @async
   * @public
   */
  async start() {
    const taskObj = this.taskQueue.getHeadTask();
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
      this.handlingError({ taskObj, error });
    }
  },

  initCreator(creator, taskObj) {
    const { id } = taskObj;
    creator.inCenter = true;
    creator.taskId = id;
    creator.generateOutput();

    // event listeners
    creator.on('start', () => {
      const eventName = 'single-start';
      const result = { id, eventName };
      this.event.emit(eventName, result);
    });

    creator.on('error', event => {
      this.handlingError({ taskObj, error: event });
    });

    creator.on('progress', p => {
      const { progress } = this;
      const eventName = 'single-progress';
      progress.id = id;
      progress.state = p.state;
      progress.percent = p.percent;
      progress.eventName = eventName;
      this.event.emit(eventName, progress);
    });

    creator.on('complete', () => {
      try {
        const eventName = 'single-complete';
        this.progress.add(id);
        taskObj.state = 'complete';
        const file = creator.getFile();
        const result = { id, file, output: file, eventName };
        this.event.emit(eventName, result);
      } catch (e) {}

      setTimeout(id => this.removeTaskObj(id), 50, id);
      setTimeout(this.nextTask.bind(this), this.delay);
    });
  },

  handlingError({ taskObj, error = 'normal' }) {
    const { id } = taskObj;
    const eventName = 'single-error';
    taskObj.state = 'error';
    const result = { id, error, eventName };
    this.event.emit(eventName, result);

    setTimeout(id => this.removeTaskObj(id), 50, id);
    setTimeout(this.nextTask.bind(this), this.delay);
  },

  nextTask() {
    if (this.taskQueue.getLength() <= 0) {
      this.resetTasks();
      this.event.emit('all-complete');
    } else {
      const taskObj = this.taskQueue.getHeadTask();
      this.execTask(taskObj);
    }
  },

  resetTasks() {
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
};

module.exports = FFCreatorCenter;
