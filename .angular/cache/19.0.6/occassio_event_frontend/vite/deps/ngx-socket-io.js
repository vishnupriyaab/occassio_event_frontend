import {
  esm_exports,
  lookup
} from "./chunk-6QJC6ZNB.js";
import {
  InjectionToken,
  NgModule,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-ORMHMKD2.js";
import {
  Observable,
  share
} from "./chunk-ZSY7TSMJ.js";
import {
  __objRest,
  __spreadValues
} from "./chunk-CX3I3NQG.js";

// node_modules/ngx-socket-io/fesm2022/ngx-socket-io.mjs
var WrappedSocket = class _WrappedSocket {
  config;
  subscribersCounter = {};
  eventObservables$ = {};
  namespaces = {};
  ioSocket;
  emptyConfig = {
    url: "",
    options: {}
  };
  constructor(config) {
    this.config = config;
    if (config === void 0) {
      config = this.emptyConfig;
    }
    const url = config.url;
    const options = config.options;
    const ioFunc = lookup ? lookup : esm_exports;
    this.ioSocket = ioFunc(url, options);
  }
  get auth() {
    return this.ioSocket.auth;
  }
  set auth(value) {
    this.ioSocket.auth = value;
  }
  /** readonly access to io manager */
  get io() {
    return this.ioSocket.io;
  }
  /** alias to connect */
  get open() {
    return this.connect;
  }
  /** alias to disconnect */
  get close() {
    return this.disconnect;
  }
  /**
   * Gets a WrappedSocket for the given namespace.
   *
   * @note if an existing socket exists for the given namespace, it will be reused.
   *
   * @param namespace the namespace to create a new socket based on the current config.
   *        If empty or `/`, then the current instance is returned.
   * @returns a socket that is bound to the given namespace. If namespace is empty or `/`,
   *          then `this` is returned, otherwise another instance is returned, creating
   *          it if it's the first use of such namespace.
   */
  of(namespace) {
    if (!namespace || namespace === "/") {
      return this;
    }
    const existing = this.namespaces[namespace];
    if (existing) {
      return existing;
    }
    const _a = this.config, {
      url
    } = _a, rest = __objRest(_a, [
      "url"
    ]);
    const config = __spreadValues({
      url: !url.endsWith("/") && !namespace.startsWith("/") ? `${url}/${namespace}` : `${url}${namespace}`
    }, rest);
    const created = new _WrappedSocket(config);
    this.namespaces[namespace] = created;
    return created;
  }
  on(eventName, callback) {
    this.ioSocket.on(eventName, callback);
    return this;
  }
  once(eventName, callback) {
    this.ioSocket.once(eventName, callback);
    return this;
  }
  connect() {
    this.ioSocket.connect();
    return this;
  }
  disconnect() {
    this.ioSocket.disconnect();
    return this;
  }
  emit(_eventName, ..._args) {
    this.ioSocket.emit.apply(this.ioSocket, arguments);
    return this;
  }
  send(..._args) {
    this.ioSocket.send.apply(this.ioSocket, arguments);
    return this;
  }
  emitWithAck(_eventName, ..._args) {
    return this.ioSocket.emitWithAck.apply(this.ioSocket, arguments);
  }
  removeListener(_eventName, _callback) {
    this.ioSocket.removeListener.apply(this.ioSocket, arguments);
    return this;
  }
  removeAllListeners(_eventName) {
    this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments);
    return this;
  }
  fromEvent(eventName) {
    if (!this.subscribersCounter[eventName]) {
      this.subscribersCounter[eventName] = 0;
    }
    this.subscribersCounter[eventName]++;
    if (!this.eventObservables$[eventName]) {
      this.eventObservables$[eventName] = new Observable((observer) => {
        const listener = (data) => {
          observer.next(data);
        };
        this.ioSocket.on(eventName, listener);
        return () => {
          this.subscribersCounter[eventName]--;
          if (this.subscribersCounter[eventName] === 0) {
            this.ioSocket.removeListener(eventName, listener);
            delete this.eventObservables$[eventName];
          }
        };
      }).pipe(share());
    }
    return this.eventObservables$[eventName];
  }
  fromOneTimeEvent(eventName) {
    return new Promise((resolve) => this.once(eventName, resolve));
  }
  listeners(eventName) {
    return this.ioSocket.listeners(eventName);
  }
  hasListeners(eventName) {
    return this.ioSocket.hasListeners(eventName);
  }
  listenersAny() {
    return this.ioSocket.listenersAny();
  }
  listenersAnyOutgoing() {
    return this.ioSocket.listenersAnyOutgoing();
  }
  off(eventName, listener) {
    this.ioSocket.off(eventName, listener);
    return this;
  }
  offAny(callback) {
    this.ioSocket.offAny(callback);
    return this;
  }
  offAnyOutgoing(callback) {
    this.ioSocket.offAnyOutgoing(callback);
    return this;
  }
  onAny(callback) {
    this.ioSocket.onAny(callback);
    return this;
  }
  onAnyOutgoing(callback) {
    this.ioSocket.onAnyOutgoing(callback);
    return this;
  }
  prependAny(callback) {
    this.ioSocket.prependAny(callback);
    return this;
  }
  prependAnyOutgoing(callback) {
    this.ioSocket.prependAnyOutgoing(callback);
    return this;
  }
  timeout(value) {
    this.ioSocket.timeout(value);
    return this;
  }
  get volatile() {
    const _ = this.ioSocket.volatile;
    return this;
  }
  get active() {
    return this.ioSocket.active;
  }
  get connected() {
    return this.ioSocket.connected;
  }
  get disconnected() {
    return this.ioSocket.disconnected;
  }
  get recovered() {
    return this.ioSocket.recovered;
  }
  get id() {
    return this.ioSocket.id;
  }
  compress(value) {
    this.ioSocket.compress(value);
    return this;
  }
};
function SocketFactory(config) {
  return new WrappedSocket(config);
}
var SOCKET_CONFIG_TOKEN = new InjectionToken("__SOCKET_IO_CONFIG__");
var SocketIoModule = class _SocketIoModule {
  static forRoot(config) {
    return {
      ngModule: _SocketIoModule,
      providers: [{
        provide: SOCKET_CONFIG_TOKEN,
        useValue: config
      }, {
        provide: WrappedSocket,
        useFactory: SocketFactory,
        deps: [SOCKET_CONFIG_TOKEN]
      }]
    };
  }
  static ɵfac = function SocketIoModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SocketIoModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _SocketIoModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SocketIoModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
export {
  SOCKET_CONFIG_TOKEN,
  WrappedSocket as Socket,
  SocketIoModule
};
//# sourceMappingURL=ngx-socket-io.js.map
