class Loader {
  constructor(ctx, ms, action) {
    this.loader = setInterval(() => {
      ctx.replyWithChatAction(action);
    }, ms);
  }

  stop() {
    return clearInterval(this.loader);
  }
}

module.exports = Loader;
