class Base {
  constructor(text, callback) {
    this.results = [];

    if (callback) {
      this._hook = callback;
    }

    this.search(text);
  }
  done() {
    if (this.normalize) {
      this.results = this.results.map(this.normalize);
    }

    this._hook(this.results);
  }
  static expose() {
    return {
      // expose regex for urls/titles, to attach to
      regex: new RegExp("")
    };
  }
  // normalize 
  static format(obj) {
    if (!obj.type) {
      throw new Error('Missing type on action');
    }
    if (!obj.text) {
      throw new Error('Missing text on action');
    }

    return true;
  }
}

module.exports = Base;
