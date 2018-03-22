/**
 * Creates a new PubSubClass.
 * @class
 */
class PubSubClass {
	/**
  * @constructs PubSubClass
  */
  constructor() {
  	this.channels = {};
    this.flags = {
      crossTabEnabled: false,
      historyEnabled: false,
      historyLength: 15,
    };
    this.id = this._uuid();
  }

	/**
   * Generate uuid.
   * @function _uuid
   * @returns {string} - returns new uuid
  */
  _uuid() {
  	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Write history to a channel
   * @function _writeHistory
   * @param {object} message - message to write
   * @param {string} channel - the channel to write history to
  */
  _writeHistory(message, channel) {
    // If history is enabled, store message in history.
    if (this.flags.historyEnabled) {
      this.channels[channel].history.push({
        message,
        time: Date.now(),
      });

      if (this.channels[channel].history.length > this.flags.historyLength) {
        this.channels[channel].history.shift();
      }
    }
  }

	/**
   * Set flags
   * @function setFlag
  */
  setFlag(flag, value) {
  	switch (flag) {
    	case 'crossTabEnabled':
      	if (window) this.flags.crossTabEnabled = value;
        break;
      case 'historyEnabled':
      	this.flags.historyEnabled = value;
        break;
      case 'historyLength':
      	this.flags.historyLength = value;
        break;
      default:
       	break;
    }
  }

	/**
   * Join a channel
   * @function join
   * @param {string} channel - the channel to join
   * @param {function} handler - the function to send messages to.
  */
  join(channel, handler) {
  	const uuid = this._uuid();
    handler(false, uuid);

    // If the channel doesn't exist, create it.
    if (!this.channels[channel]) {
    	this.channels[channel] = {
      	clients: {},
        history: []
      };
    }

    // If cross tab is enabled, listen for cross tab messages
    if (this.flags.crossTabEnabled) {
      window.addEventListener('storage', (e) => {
        if (e.key === `PubSub-${channel}`) {
          let payload = JSON.parse(e.newValue);
          if (payload.id != this.id) {
            handler(payload.message, uuid);
            this._writeHistory(payload.message, channel);
          }
        }
      }, false);
    }

    // Add our new client
    this.channels[channel].clients[uuid] = handler;

    return this;
  }

	/**
   * Leave a channel
   * @function leave
   * @param {string} channel - the channel to leave
   * @param {string} uuid - the uuid of the client who should leave
   * @returns {promise} - returns new promise, resolved when client leaves
  */
  leave(channel, uuid) {
    return new Promise(resolve => {
    	// Once we leave a channel, set our handler to a noop.
  		this.channels[channel].clients[uuid] = () => {/*noop*/};
      resolve();
    });
  }

  /**
   * Get history from a channel
   * @function history
   * @param {string} channel - the channel to leave
   * @param {number} limit - how many messages from history
   * @returns {array} - returns history from channel
  */
  history(channel, limit = 15) {
    return this.channels[channel].history.slice(0, limit);
  }

	/**
   * Publish a message to channel
   * @function publish
   * @param {string} channel - the channel to publish to
   * @param {object} message - the message to publish
   * @returns {promise} - returns new promise, resolved when message is sent to all clients
  */
  publish(channel, message) {
    // If crossTab is enabled, dispatch message to app PubSub instances.
  	if (this.flags.crossTabEnabled) {
      localStorage.setItem(
      	`PubSub-${channel}`,
        JSON.stringify({
          message: message,
          time: Date.now(),
          from: this.id,
        })
      );
    }

    this._writeHistory(message, channel);

  	return new Promise(resolve => {
    	// Send message to all subscribers.
    	Object.keys(this.channels[channel].clients).map((client, i) => {

        // Displatch message to client.
        this.channels[channel].clients[client](message, client);

        // Once we're done, resole the promise letting us know.
        if (Object.keys(this.channels[channel].clients).length - 1 === i) {
          resolve();
        }
      });
    });
  }
};

// Bind to global scope for easy access
if (typeof(global) != 'undefined') {
	global.PubSub = new PubSubClass();
} else {
	window.PubSub = new PubSubClass();
}
