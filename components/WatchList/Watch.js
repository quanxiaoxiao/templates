import _ from 'lodash';

class Watch {
  constructor({
    action,
    params,
    polling = false,
    effects = _.noop,
  }) {
    this.action = action;
    this.params = params;
    this.polling = polling;
    this.effects = effects;
    this.status = 'fulfilled';
    this.changeType = null;
    this.stoped = false;
    if (this.polling) {
      this.poll();
    }
  }

  async start() {
    try {
      this.status = 'pending';
      this.timeStart = Date.now();
      const data = await this.action(this.params);
      this.timeEnd = Date.now();
      this.status = 'fulfilled';
      if (!this.stoped) {
        this.effects(data, this.changeType);
        this.changeType = null;
      }
    } catch (e) {
      this.timeEnd = Date.now();
      this.status = 'rejected';
    }
  }

  end() {
    this.stoped = true;
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  poll() {
    this.timer = setInterval(() => {
      if (this.stoped) {
        clearInterval(this.timer);
        this.timer = null;
      } else if (this.status !== 'pending' &&
        this.timeEnd &&
        this.timeEnd + 60 * 1000 < Date.now()) {
        this.changeType = 'poll';
        this.start();
      }
    }, 100);
  }
}

export default Watch;
