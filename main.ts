import {
  genSaltSync,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export class BcryptSalt {
  maxHashTime: number;
  logs: boolean;
  timeBefore: number;
  hashTime = 0;
  saltRounds = 0;
  nextHashTime = 0;
  nextSaltRounds = 4;
  password = "my plain text password";

  /**
   * constructor
   * @param {Number}  args.maxHashTime - max allowed bcrypt hash time in milliseconds
   * @param {Boolean} args.logs        - show / hide logs in the console
   */
  constructor(args?: { maxHashTime?: number; logs?: boolean }) {
    const { maxHashTime, logs } = args || {};

    this.maxHashTime =
      typeof maxHashTime === "number" && maxHashTime > 0 ? maxHashTime : 500;

    this.logs = typeof logs === "boolean" && logs === false ? false : true;

    if (this.maxHashTime > 10000) {
      console.warn(
        "warning: maxHashTime greater than 10 seconds, this may take a long time"
      );
    }

    this.timeBefore = performance.now();
    this.run();
  }

  log() {
    this.logs &&
      console.log(
        `saltRounds: ${this.saltRounds < 10 ? " " : ""}${
          this.saltRounds
        }, hashTime: ${this.hashTime}ms`
      );
  }

  nextLog() {
    this.logs &&
      console.log(
        `saltRounds: ${this.nextSaltRounds < 10 ? " " : ""}${
          this.nextSaltRounds
        }, hashTime: ${this.nextHashTime}ms`
      );
  }

  endLog() {
    this.logs &&
      console.log(
        `\nRecommended bcrypt saltRounds for this hardware is ${this.saltRounds} running in ${this.hashTime}ms.\n1 higher exceeds max hash time (${this.maxHashTime}ms)\n`
      );
  }

  run() {
    const salt = genSaltSync(this.nextSaltRounds);
    hashSync(this.password, salt);
    this.nextHashTime = performance.now() - this.timeBefore;
    if (this.nextHashTime < this.maxHashTime) {
      this.hashTime = this.nextHashTime;
      this.saltRounds = this.nextSaltRounds;
      this.nextSaltRounds += 1;
      this.log();
      this.run();
    } else {
      this.nextLog();
      this.endLog();
    }
  }
}
