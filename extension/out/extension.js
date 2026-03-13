var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/whatwg-fetch/dist/fetch.umd.js
var require_fetch_umd = __commonJS({
  "node_modules/whatwg-fetch/dist/fetch.umd.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? factory(exports2) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global2.WHATWGFetch = {});
    })(exports2, (function(exports3) {
      "use strict";
      var g = typeof globalThis !== "undefined" && globalThis || typeof self !== "undefined" && self || // eslint-disable-next-line no-undef
      typeof global !== "undefined" && global || {};
      var support = {
        searchParams: "URLSearchParams" in g,
        iterable: "Symbol" in g && "iterator" in Symbol,
        blob: "FileReader" in g && "Blob" in g && (function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        })(),
        formData: "FormData" in g,
        arrayBuffer: "ArrayBuffer" in g
      };
      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj);
      }
      if (support.arrayBuffer) {
        var viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];
        var isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      function normalizeName(name) {
        if (typeof name !== "string") {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
          throw new TypeError('Invalid character in header field name: "' + name + '"');
        }
        return name.toLowerCase();
      }
      function normalizeValue(value) {
        if (typeof value !== "string") {
          value = String(value);
        }
        return value;
      }
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return { done: value === void 0, value };
          }
        };
        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }
        return iterator;
      }
      function Headers2(headers) {
        this.map = {};
        if (headers instanceof Headers2) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            if (header.length != 2) {
              throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + header.length);
            }
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }
      Headers2.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value : value;
      };
      Headers2.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers2.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };
      Headers2.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers2.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };
      Headers2.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };
      Headers2.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };
      Headers2.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items);
      };
      Headers2.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items);
      };
      if (support.iterable) {
        Headers2.prototype[Symbol.iterator] = Headers2.prototype.entries;
      }
      function consumed(body) {
        if (body._noBody) return;
        if (body.bodyUsed) {
          return Promise.reject(new TypeError("Already read"));
        }
        body.bodyUsed = true;
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve2, reject) {
          reader.onload = function() {
            resolve2(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
      }
      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
        var encoding = match ? match[1] : "utf-8";
        reader.readAsText(blob, encoding);
        return promise;
      }
      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);
        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join("");
      }
      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0);
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer;
        }
      }
      function Body() {
        this.bodyUsed = false;
        this._initBody = function(body) {
          this.bodyUsed = this.bodyUsed;
          this._bodyInit = body;
          if (!body) {
            this._noBody = true;
            this._bodyText = "";
          } else if (typeof body === "string") {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }
          if (!this.headers.get("content-type")) {
            if (typeof body === "string") {
              this.headers.set("content-type", "text/plain;charset=UTF-8");
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set("content-type", this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
            }
          }
        };
        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as blob");
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };
        }
        this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var isConsumed = consumed(this);
            if (isConsumed) {
              return isConsumed;
            } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
              return Promise.resolve(
                this._bodyArrayBuffer.buffer.slice(
                  this._bodyArrayBuffer.byteOffset,
                  this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                )
              );
            } else {
              return Promise.resolve(this._bodyArrayBuffer);
            }
          } else if (support.blob) {
            return this.blob().then(readBlobAsArrayBuffer);
          } else {
            throw new Error("could not read as ArrayBuffer");
          }
        };
        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }
          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as text");
          } else {
            return Promise.resolve(this._bodyText);
          }
        };
        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode);
          };
        }
        this.json = function() {
          return this.text().then(JSON.parse);
        };
        return this;
      }
      var methods = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method;
      }
      function Request(input, options) {
        if (!(this instanceof Request)) {
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        }
        options = options || {};
        var body = options.body;
        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers2(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }
        this.credentials = options.credentials || this.credentials || "same-origin";
        if (options.headers || !this.headers) {
          this.headers = new Headers2(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || "GET");
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal || (function() {
          if ("AbortController" in g) {
            var ctrl = new AbortController();
            return ctrl.signal;
          }
        })();
        this.referrer = null;
        if ((this.method === "GET" || this.method === "HEAD") && body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        this._initBody(body);
        if (this.method === "GET" || this.method === "HEAD") {
          if (options.cache === "no-store" || options.cache === "no-cache") {
            var reParamSearch = /([?&])_=[^&]*/;
            if (reParamSearch.test(this.url)) {
              this.url = this.url.replace(reParamSearch, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
            } else {
              var reQueryString = /\?/;
              this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
            }
          }
        }
      }
      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };
      function decode(body) {
        var form = new FormData();
        body.trim().split("&").forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split("=");
            var name = split.shift().replace(/\+/g, " ");
            var value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
        return form;
      }
      function parseHeaders(rawHeaders) {
        var headers = new Headers2();
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders.split("\r").map(function(header) {
          return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
        }).forEach(function(line) {
          var parts = line.split(":");
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(":").trim();
            try {
              headers.append(key, value);
            } catch (error) {
              console.warn("Response " + error.message);
            }
          }
        });
        return headers;
      }
      Body.call(Request.prototype);
      function Response(bodyInit, options) {
        if (!(this instanceof Response)) {
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        }
        if (!options) {
          options = {};
        }
        this.type = "default";
        this.status = options.status === void 0 ? 200 : options.status;
        if (this.status < 200 || this.status > 599) {
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        }
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = options.statusText === void 0 ? "" : "" + options.statusText;
        this.headers = new Headers2(options.headers);
        this.url = options.url || "";
        this._initBody(bodyInit);
      }
      Body.call(Response.prototype);
      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers2(this.headers),
          url: this.url
        });
      };
      Response.error = function() {
        var response = new Response(null, { status: 200, statusText: "" });
        response.ok = false;
        response.status = 0;
        response.type = "error";
        return response;
      };
      var redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, { status, headers: { location: url } });
      };
      exports3.DOMException = g.DOMException;
      try {
        new exports3.DOMException();
      } catch (err) {
        exports3.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports3.DOMException.prototype = Object.create(Error.prototype);
        exports3.DOMException.prototype.constructor = exports3.DOMException;
      }
      function fetch2(input, init) {
        return new Promise(function(resolve2, reject) {
          var request = new Request(input, init);
          if (request.signal && request.signal.aborted) {
            return reject(new exports3.DOMException("Aborted", "AbortError"));
          }
          var xhr = new XMLHttpRequest();
          function abortXhr() {
            xhr.abort();
          }
          xhr.onload = function() {
            var options = {
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            if (request.url.indexOf("file://") === 0 && (xhr.status < 200 || xhr.status > 599)) {
              options.status = 200;
            } else {
              options.status = xhr.status;
            }
            options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
            var body = "response" in xhr ? xhr.response : xhr.responseText;
            setTimeout(function() {
              resolve2(new Response(body, options));
            }, 0);
          };
          xhr.onerror = function() {
            setTimeout(function() {
              reject(new TypeError("Network request failed"));
            }, 0);
          };
          xhr.ontimeout = function() {
            setTimeout(function() {
              reject(new TypeError("Network request timed out"));
            }, 0);
          };
          xhr.onabort = function() {
            setTimeout(function() {
              reject(new exports3.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function fixUrl(url) {
            try {
              return url === "" && g.location.href ? g.location.href : url;
            } catch (e) {
              return url;
            }
          }
          xhr.open(request.method, fixUrl(request.url), true);
          if (request.credentials === "include") {
            xhr.withCredentials = true;
          } else if (request.credentials === "omit") {
            xhr.withCredentials = false;
          }
          if ("responseType" in xhr) {
            if (support.blob) {
              xhr.responseType = "blob";
            } else if (support.arrayBuffer) {
              xhr.responseType = "arraybuffer";
            }
          }
          if (init && typeof init.headers === "object" && !(init.headers instanceof Headers2 || g.Headers && init.headers instanceof g.Headers)) {
            var names = [];
            Object.getOwnPropertyNames(init.headers).forEach(function(name) {
              names.push(normalizeName(name));
              xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
            });
            request.headers.forEach(function(value, name) {
              if (names.indexOf(name) === -1) {
                xhr.setRequestHeader(name, value);
              }
            });
          } else {
            request.headers.forEach(function(value, name) {
              xhr.setRequestHeader(name, value);
            });
          }
          if (request.signal) {
            request.signal.addEventListener("abort", abortXhr);
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                request.signal.removeEventListener("abort", abortXhr);
              }
            };
          }
          xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
        });
      }
      fetch2.polyfill = true;
      if (!g.fetch) {
        g.fetch = fetch2;
        g.Headers = Headers2;
        g.Request = Request;
        g.Response = Response;
      }
      exports3.Headers = Headers2;
      exports3.Request = Request;
      exports3.Response = Response;
      exports3.fetch = fetch2;
      Object.defineProperty(exports3, "__esModule", { value: true });
    }));
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode2 = __toESM(require("vscode"));

// src/ui/chatPanel.ts
var vscode = __toESM(require("vscode"));

// node_modules/ollama/dist/index.mjs
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_path = require("node:path");

// node_modules/ollama/dist/browser.mjs
var import_whatwg_fetch = __toESM(require_fetch_umd(), 1);
var defaultPort = "11434";
var defaultHost = `http://127.0.0.1:${defaultPort}`;
var version = "0.5.18";
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var ResponseError = class _ResponseError extends Error {
  constructor(error, status_code) {
    super(error);
    this.error = error;
    this.status_code = status_code;
    this.name = "ResponseError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _ResponseError);
    }
  }
};
var AbortableAsyncIterator = class {
  constructor(abortController, itr, doneCallback) {
    __publicField$1(this, "abortController");
    __publicField$1(this, "itr");
    __publicField$1(this, "doneCallback");
    this.abortController = abortController;
    this.itr = itr;
    this.doneCallback = doneCallback;
  }
  abort() {
    this.abortController.abort();
  }
  async *[Symbol.asyncIterator]() {
    for await (const message of this.itr) {
      if ("error" in message) {
        throw new Error(message.error);
      }
      yield message;
      if (message.done || message.status === "success") {
        this.doneCallback();
        return;
      }
    }
    throw new Error("Did not receive done or success response in stream.");
  }
};
var checkOk = async (response) => {
  if (response.ok) {
    return;
  }
  let message = `Error ${response.status}: ${response.statusText}`;
  let errorData = null;
  if (response.headers.get("content-type")?.includes("application/json")) {
    try {
      errorData = await response.json();
      message = errorData.error || message;
    } catch (error) {
      console.log("Failed to parse error response as JSON");
    }
  } else {
    try {
      console.log("Getting text from response");
      const textResponse = await response.text();
      message = textResponse || message;
    } catch (error) {
      console.log("Failed to get text from error response");
    }
  }
  throw new ResponseError(message, response.status);
};
function getPlatform() {
  if (typeof window !== "undefined" && window.navigator) {
    const nav = navigator;
    if ("userAgentData" in nav && nav.userAgentData?.platform) {
      return `${nav.userAgentData.platform.toLowerCase()} Browser/${navigator.userAgent};`;
    }
    if (navigator.platform) {
      return `${navigator.platform.toLowerCase()} Browser/${navigator.userAgent};`;
    }
    return `unknown Browser/${navigator.userAgent};`;
  } else if (typeof process !== "undefined") {
    return `${process.arch} ${process.platform} Node.js/${process.version}`;
  }
  return "";
}
function normalizeHeaders(headers) {
  if (headers instanceof Headers) {
    const obj = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  } else if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  } else {
    return headers || {};
  }
}
var fetchWithHeaders = async (fetch2, url, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": `ollama-js/${version} (${getPlatform()})`
  };
  options.headers = normalizeHeaders(options.headers);
  const customHeaders = Object.fromEntries(
    Object.entries(options.headers).filter(([key]) => !Object.keys(defaultHeaders).some((defaultKey) => defaultKey.toLowerCase() === key.toLowerCase()))
  );
  options.headers = {
    ...defaultHeaders,
    ...customHeaders
  };
  return fetch2(url, options);
};
var get = async (fetch2, host, options) => {
  const response = await fetchWithHeaders(fetch2, host, {
    headers: options?.headers
  });
  await checkOk(response);
  return response;
};
var post = async (fetch2, host, data, options) => {
  const isRecord = (input) => {
    return input !== null && typeof input === "object" && !Array.isArray(input);
  };
  const formattedData = isRecord(data) ? JSON.stringify(data) : data;
  const response = await fetchWithHeaders(fetch2, host, {
    method: "POST",
    body: formattedData,
    signal: options?.signal,
    headers: options?.headers
  });
  await checkOk(response);
  return response;
};
var del = async (fetch2, host, data, options) => {
  const response = await fetchWithHeaders(fetch2, host, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: options?.headers
  });
  await checkOk(response);
  return response;
};
var parseJSON = async function* (itr) {
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const reader = itr.getReader();
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(chunk);
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      try {
        yield JSON.parse(part);
      } catch (error) {
        console.warn("invalid json: ", part);
      }
    }
  }
  for (const part of buffer.split("\n").filter((p) => p !== "")) {
    try {
      yield JSON.parse(part);
    } catch (error) {
      console.warn("invalid json: ", part);
    }
  }
};
var formatHost = (host) => {
  if (!host) {
    return defaultHost;
  }
  let isExplicitProtocol = host.includes("://");
  if (host.startsWith(":")) {
    host = `http://127.0.0.1${host}`;
    isExplicitProtocol = true;
  }
  if (!isExplicitProtocol) {
    host = `http://${host}`;
  }
  const url = new URL(host);
  let port = url.port;
  if (!port) {
    if (!isExplicitProtocol) {
      port = defaultPort;
    } else {
      port = url.protocol === "https:" ? "443" : "80";
    }
  }
  let auth = "";
  if (url.username) {
    auth = url.username;
    if (url.password) {
      auth += `:${url.password}`;
    }
    auth += "@";
  }
  let formattedHost = `${url.protocol}//${auth}${url.hostname}:${port}${url.pathname}`;
  if (formattedHost.endsWith("/")) {
    formattedHost = formattedHost.slice(0, -1);
  }
  return formattedHost;
};
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var Ollama$1 = class Ollama {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "fetch");
    __publicField(this, "ongoingStreamedRequests", []);
    this.config = {
      host: "",
      headers: config?.headers
    };
    if (!config?.proxy) {
      this.config.host = formatHost(config?.host ?? defaultHost);
    }
    this.fetch = config?.fetch ?? fetch;
  }
  // Abort any ongoing streamed requests to Ollama
  abort() {
    for (const request of this.ongoingStreamedRequests) {
      request.abort();
    }
    this.ongoingStreamedRequests.length = 0;
  }
  /**
   * Processes a request to the Ollama server. If the request is streamable, it will return a
   * AbortableAsyncIterator that yields the response messages. Otherwise, it will return the response
   * object.
   * @param endpoint {string} - The endpoint to send the request to.
   * @param request {object} - The request object to send to the endpoint.
   * @protected {T | AbortableAsyncIterator<T>} - The response object or a AbortableAsyncIterator that yields
   * response messages.
   * @throws {Error} - If the response body is missing or if the response is an error.
   * @returns {Promise<T | AbortableAsyncIterator<T>>} - The response object or a AbortableAsyncIterator that yields the streamed response.
   */
  async processStreamableRequest(endpoint, request) {
    request.stream = request.stream ?? false;
    const host = `${this.config.host}/api/${endpoint}`;
    if (request.stream) {
      const abortController = new AbortController();
      const response2 = await post(this.fetch, host, request, {
        signal: abortController.signal,
        headers: this.config.headers
      });
      if (!response2.body) {
        throw new Error("Missing body");
      }
      const itr = parseJSON(response2.body);
      const abortableAsyncIterator = new AbortableAsyncIterator(
        abortController,
        itr,
        () => {
          const i = this.ongoingStreamedRequests.indexOf(abortableAsyncIterator);
          if (i > -1) {
            this.ongoingStreamedRequests.splice(i, 1);
          }
        }
      );
      this.ongoingStreamedRequests.push(abortableAsyncIterator);
      return abortableAsyncIterator;
    }
    const response = await post(this.fetch, host, request, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Encodes an image to base64 if it is a Uint8Array.
   * @param image {Uint8Array | string} - The image to encode.
   * @returns {Promise<string>} - The base64 encoded image.
   */
  async encodeImage(image) {
    if (typeof image !== "string") {
      const uint8Array = new Uint8Array(image);
      let byteString = "";
      const len = uint8Array.byteLength;
      for (let i = 0; i < len; i++) {
        byteString += String.fromCharCode(uint8Array[i]);
      }
      return btoa(byteString);
    }
    return image;
  }
  /**
   * Generates a response from a text prompt.
   * @param request {GenerateRequest} - The request object.
   * @returns {Promise<GenerateResponse | AbortableAsyncIterator<GenerateResponse>>} - The response object or
   * an AbortableAsyncIterator that yields response messages.
   */
  async generate(request) {
    if (request.images) {
      request.images = await Promise.all(request.images.map(this.encodeImage.bind(this)));
    }
    return this.processStreamableRequest("generate", request);
  }
  /**
   * Chats with the model. The request object can contain messages with images that are either
   * Uint8Arrays or base64 encoded strings. The images will be base64 encoded before sending the
   * request.
   * @param request {ChatRequest} - The request object.
   * @returns {Promise<ChatResponse | AbortableAsyncIterator<ChatResponse>>} - The response object or an
   * AbortableAsyncIterator that yields response messages.
   */
  async chat(request) {
    if (request.messages) {
      for (const message of request.messages) {
        if (message.images) {
          message.images = await Promise.all(
            message.images.map(this.encodeImage.bind(this))
          );
        }
      }
    }
    return this.processStreamableRequest("chat", request);
  }
  /**
   * Creates a new model from a stream of data.
   * @param request {CreateRequest} - The request object.
   * @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or a stream of progress responses.
   */
  async create(request) {
    return this.processStreamableRequest("create", {
      ...request
    });
  }
  /**
   * Pulls a model from the Ollama registry. The request object can contain a stream flag to indicate if the
   * response should be streamed.
   * @param request {PullRequest} - The request object.
   * @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or
   * an AbortableAsyncIterator that yields response messages.
   */
  async pull(request) {
    return this.processStreamableRequest("pull", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  /**
   * Pushes a model to the Ollama registry. The request object can contain a stream flag to indicate if the
   * response should be streamed.
   * @param request {PushRequest} - The request object.
   * @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or
   * an AbortableAsyncIterator that yields response messages.
   */
  async push(request) {
    return this.processStreamableRequest("push", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  /**
   * Deletes a model from the server. The request object should contain the name of the model to
   * delete.
   * @param request {DeleteRequest} - The request object.
   * @returns {Promise<StatusResponse>} - The response object.
   */
  async delete(request) {
    await del(
      this.fetch,
      `${this.config.host}/api/delete`,
      { name: request.model },
      { headers: this.config.headers }
    );
    return { status: "success" };
  }
  /**
   * Copies a model from one name to another. The request object should contain the name of the
   * model to copy and the new name.
   * @param request {CopyRequest} - The request object.
   * @returns {Promise<StatusResponse>} - The response object.
   */
  async copy(request) {
    await post(this.fetch, `${this.config.host}/api/copy`, { ...request }, {
      headers: this.config.headers
    });
    return { status: "success" };
  }
  /**
   * Lists the models on the server.
   * @returns {Promise<ListResponse>} - The response object.
   * @throws {Error} - If the response body is missing.
   */
  async list() {
    const response = await get(this.fetch, `${this.config.host}/api/tags`, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Shows the metadata of a model. The request object should contain the name of the model.
   * @param request {ShowRequest} - The request object.
   * @returns {Promise<ShowResponse>} - The response object.
   */
  async show(request) {
    const response = await post(this.fetch, `${this.config.host}/api/show`, {
      ...request
    }, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Embeds text input into vectors.
   * @param request {EmbedRequest} - The request object.
   * @returns {Promise<EmbedResponse>} - The response object.
   */
  async embed(request) {
    const response = await post(this.fetch, `${this.config.host}/api/embed`, {
      ...request
    }, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Embeds a text prompt into a vector.
   * @param request {EmbeddingsRequest} - The request object.
   * @returns {Promise<EmbeddingsResponse>} - The response object.
   */
  async embeddings(request) {
    const response = await post(this.fetch, `${this.config.host}/api/embeddings`, {
      ...request
    }, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Lists the running models on the server
   * @returns {Promise<ListResponse>} - The response object.
   * @throws {Error} - If the response body is missing.
   */
  async ps() {
    const response = await get(this.fetch, `${this.config.host}/api/ps`, {
      headers: this.config.headers
    });
    return await response.json();
  }
};
var browser = new Ollama$1();

// node_modules/ollama/dist/index.mjs
var import_whatwg_fetch2 = __toESM(require_fetch_umd(), 1);
var Ollama2 = class extends Ollama$1 {
  async encodeImage(image) {
    if (typeof image !== "string") {
      return Buffer.from(image).toString("base64");
    }
    try {
      if (import_node_fs.default.existsSync(image)) {
        const fileBuffer = await import_node_fs.promises.readFile((0, import_node_path.resolve)(image));
        return Buffer.from(fileBuffer).toString("base64");
      }
    } catch {
    }
    return image;
  }
  /**
   * checks if a file exists
   * @param path {string} - The path to the file
   * @private @internal
   * @returns {Promise<boolean>} - Whether the file exists or not
   */
  async fileExists(path2) {
    try {
      await import_node_fs.promises.access(path2);
      return true;
    } catch {
      return false;
    }
  }
  async create(request) {
    if (request.from && await this.fileExists((0, import_node_path.resolve)(request.from))) {
      throw Error("Creating with a local path is not currently supported from ollama-js");
    }
    if (request.stream) {
      return super.create(request);
    } else {
      return super.create(request);
    }
  }
};
var index = new Ollama2();

// src/tools/index.ts
var fs2 = __toESM(require("fs"));
var path = __toESM(require("path"));
var import_child_process = require("child_process");
function readFile(filePath, startLine, endLine) {
  try {
    if (!fs2.existsSync(filePath)) {
      return { success: false, output: "", error: `File not found: ${filePath}` };
    }
    let content = fs2.readFileSync(filePath, "utf8");
    if (startLine !== void 0 && endLine !== void 0) {
      const lines = content.split("\n");
      content = lines.slice(startLine - 1, endLine).join("\n");
    }
    return { success: true, output: content };
  } catch (e) {
    return { success: false, output: "", error: e.message };
  }
}
function writeFile(filePath, content) {
  try {
    fs2.mkdirSync(path.dirname(filePath), { recursive: true });
    fs2.writeFileSync(filePath, content, "utf8");
    return { success: true, output: `Written: ${filePath}` };
  } catch (e) {
    return { success: false, output: "", error: e.message };
  }
}
function applyDiff(filePath, diff) {
  try {
    if (!fs2.existsSync(filePath)) {
      return { success: false, output: "", error: `File not found: ${filePath}` };
    }
    const lines = fs2.readFileSync(filePath, "utf8").split("\n");
    const diffLines = diff.split("\n");
    const result = [...lines];
    let fileLineIdx = 0;
    for (let i = 0; i < diffLines.length; i++) {
      const dl = diffLines[i];
      const hunkMatch = dl.match(/^@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@/);
      if (hunkMatch) {
        fileLineIdx = parseInt(hunkMatch[2]) - 1;
        continue;
      }
      if (dl.startsWith("---") || dl.startsWith("+++")) continue;
      if (dl.startsWith("+")) {
        result.splice(fileLineIdx, 0, dl.slice(1));
        fileLineIdx++;
      } else if (dl.startsWith("-")) {
        if (fileLineIdx < result.length) {
          result.splice(fileLineIdx, 1);
        }
      } else if (dl.startsWith(" ")) {
        fileLineIdx++;
      }
    }
    fs2.writeFileSync(filePath, result.join("\n"), "utf8");
    return { success: true, output: `Diff applied to ${filePath}` };
  } catch (e) {
    return { success: false, output: "", error: `Diff failed: ${e.message}` };
  }
}
function listFiles(dirPath, extensions) {
  try {
    if (!fs2.existsSync(dirPath)) {
      return { success: false, output: "", error: `Directory not found: ${dirPath}` };
    }
    const files = [];
    const walk = (dir, depth = 0) => {
      if (depth > 4) return;
      const entries = fs2.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!["node_modules", ".git", ".next", "dist", "out", "__pycache__"].includes(entry.name)) {
            walk(fullPath, depth + 1);
          }
        } else {
          if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      }
    };
    walk(dirPath);
    return { success: true, output: files.join("\n") };
  } catch (e) {
    return { success: false, output: "", error: e.message };
  }
}
function runCommand(cmd, cwd) {
  try {
    const output = (0, import_child_process.execSync)(cmd, {
      cwd: cwd || process.cwd(),
      encoding: "utf8",
      timeout: 15e3,
      stdio: ["pipe", "pipe", "pipe"]
    });
    return { success: true, output: output.trim() };
  } catch (e) {
    const errOutput = (e.stdout || "") + (e.stderr || "") || e.message;
    return { success: false, output: errOutput.trim(), error: errOutput.trim() };
  }
}
function searchInFiles(query, dirPath, fileExtensions) {
  try {
    const files = listFiles(dirPath, fileExtensions || [".ts", ".tsx", ".js", ".jsx", ".py"]);
    if (!files.success) return files;
    const results = [];
    const queryLower = query.toLowerCase();
    for (const filePath of files.output.split("\n").filter(Boolean)) {
      try {
        const content = fs2.readFileSync(filePath, "utf8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          if (line.toLowerCase().includes(queryLower)) {
            results.push(`${filePath}:${idx + 1}: ${line.trim()}`);
          }
        });
      } catch (_) {
      }
    }
    if (results.length === 0) {
      return { success: true, output: `No results found for: ${query}` };
    }
    return { success: true, output: results.slice(0, 30).join("\n") };
  } catch (e) {
    return { success: false, output: "", error: e.message };
  }
}
var TOOL_DEFINITIONS = `
Available tools (output ONLY as JSON):

1. read_file(path, startLine?, endLine?)
   - Read a file, optionally a line range
   - Example: {"tool":"read_file","args":{"path":"/src/index.ts","startLine":1,"endLine":50}}

2. write_file(path, content)
   - Write full content to a file (creates if not exists)
   - Example: {"tool":"write_file","args":{"path":"/src/index.ts","content":"..."}}

3. apply_diff(path, diff)
   - Apply unified diff to a file
   - Example: {"tool":"apply_diff","args":{"path":"/src/index.ts","diff":"@@ -5,3 +5,4 @@\\n context\\n-old line\\n+new line\\n context"}}

4. list_files(path, extensions?)
   - List files in directory
   - Example: {"tool":"list_files","args":{"path":"/src","extensions":[".ts",".tsx"]}}

5. run_command(cmd, cwd?)
   - Run a shell command (lint, test, build)
   - Example: {"tool":"run_command","args":{"cmd":"npx eslint src/index.ts --max-warnings 0","cwd":"/workspace"}}

6. search_in_files(query, path, extensions?)
   - Search for text across files
   - Example: {"tool":"search_in_files","args":{"query":"handlePayment","path":"/src"}}

7. done(summary)
   - Mark task complete
   - Example: {"tool":"done","args":{"summary":"Added input validation to handleLogin function"}}
`;
function executeTool(toolName, args) {
  switch (toolName) {
    case "read_file":
      return readFile(args.path, args.startLine, args.endLine);
    case "write_file":
      return writeFile(args.path, args.content);
    case "apply_diff":
      return applyDiff(args.path, args.diff);
    case "list_files":
      return listFiles(args.path, args.extensions);
    case "run_command":
      return runCommand(args.cmd, args.cwd);
    case "search_in_files":
      return searchInFiles(args.query, args.path, args.extensions);
    case "done":
      return { success: true, output: args.summary || "Task complete" };
    default:
      return { success: false, output: "", error: `Unknown tool: ${toolName}` };
  }
}

// src/agent/loop.ts
function buildSystemPrompt(workspacePath) {
  return `You are Agni \u2014 an expert agentic code editor running locally via Ollama.
Workspace: ${workspacePath}

RULES:
1. Always respond with ONLY a single valid JSON object \u2014 no markdown, no explanation outside JSON
2. Think step by step before acting
3. For files under 100 lines ALWAYS use write_file with the COMPLETE corrected content \u2014 never use apply_diff on small files
4. After editing a file, ALWAYS run_command to lint/typecheck it
5. If lint/typecheck fails, fix the error and retry (you will be given up to ${3} attempts)
6. When the task is fully done, call the "done" tool

RESPONSE FORMAT (strict JSON, one tool per response):
{
  "thought": "reasoning about what to do next",
  "tool": "tool_name",
  "args": { ...tool arguments... }
}

${TOOL_DEFINITIONS}

DIFF FORMAT for apply_diff:
@@ -lineStart,count +lineStart,count @@
 unchanged context line
-removed line
+added line
 unchanged context line`;
}
function parseLLMResponse(raw) {
  try {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const jsonStr = cleaned.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);
    if (!parsed.tool) return null;
    return {
      thought: parsed.thought || "",
      tool: parsed.tool,
      args: parsed.args || {}
    };
  } catch (_) {
    return null;
  }
}
async function runAgent(instruction, config, onStep, onToken) {
  const ollama = new Ollama2({ host: config.ollamaUrl });
  const messages = [
    { role: "system", content: buildSystemPrompt(config.workspacePath) },
    { role: "user", content: instruction }
  ];
  let retries = 0;
  let lastError = "";
  let finalSummary = "";
  onStep({ state: "PLAN" });
  for (let iteration = 0; iteration < 15; iteration++) {
    if (lastError) {
      messages.push({
        role: "user",
        content: `The previous action failed or produced errors:
${lastError}

Please fix this and try again. Respond with JSON only.`
      });
      lastError = "";
      retries++;
      if (retries >= config.maxRetries) {
        onStep({ state: "ERROR", error: "Max retries reached. Could not complete task." });
        return "Max retries reached. Task incomplete.";
      }
      onStep({ state: "CORRECT" });
    }
    onStep({ state: "EXECUTE" });
    let rawResponse = "";
    try {
      const stream = await ollama.chat({
        model: config.model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
        options: {
          temperature: 0.1,
          // Low temp for deterministic code editing
          num_predict: 2048
        }
      });
      for await (const chunk of stream) {
        const token = chunk.message?.content || "";
        rawResponse += token;
        onToken(token);
      }
    } catch (e) {
      onStep({ state: "ERROR", error: `Ollama error: ${e.message}` });
      return `Ollama connection error: ${e.message}`;
    }
    const parsed = parseLLMResponse(rawResponse);
    if (!parsed) {
      lastError = `Could not parse JSON from response. Raw response was:
${rawResponse.slice(0, 300)}

Respond with ONLY valid JSON in the format specified.`;
      continue;
    }
    messages.push({ role: "assistant", content: rawResponse });
    onStep({
      state: "EXECUTE",
      thought: parsed.thought,
      toolName: parsed.tool,
      toolArgs: parsed.args
    });
    if (parsed.tool === "done") {
      finalSummary = parsed.args?.summary || "Task completed.";
      onStep({ state: "DONE" });
      return finalSummary;
    }
    const result = executeTool(parsed.tool, parsed.args);
    onStep({
      state: result.success ? "VERIFY" : "CORRECT",
      toolName: parsed.tool,
      toolResult: result.output,
      error: result.error
    });
    const resultMsg = result.success ? `Tool result (${parsed.tool}):
${result.output || "Success (no output)"}` : `Tool FAILED (${parsed.tool}):
${result.error || "Unknown error"}`;
    messages.push({ role: "user", content: resultMsg });
    if (!result.success && ["apply_diff", "write_file", "run_command"].includes(parsed.tool)) {
      lastError = `${parsed.tool} failed: ${result.error}`;
    }
    if (parsed.tool === "run_command" && !result.success && result.output) {
      const hasCodeErrors = result.output.includes("error") || result.output.includes("Error") || result.output.includes("\u2716");
      if (hasCodeErrors) {
        lastError = `Lint/build errors found:
${result.output}

Fix these errors in the file.`;
      }
    }
  }
  onStep({ state: "ERROR", error: "Max iterations reached" });
  return "Agent reached max iterations without completing task.";
}
async function checkOllama(url) {
  try {
    const ollama = new Ollama2({ host: url });
    const list = await ollama.list();
    const models = list.models.map((m) => m.name);
    return { ok: true, models };
  } catch (_) {
    return { ok: false, models: [] };
  }
}

// src/ui/chatPanel.ts
var AgniChatPanel = class _AgniChatPanel {
  constructor(panel, extensionUri) {
    this._disposables = [];
    this._panel = panel;
    this._panel.webview.html = this._getHtml();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case "runAgent":
          await this._handleAgentRun(msg.instruction);
          break;
        case "checkOllama":
          await this._handleOllamaCheck();
          break;
        case "insertAtCursor":
          this._insertAtCursor(msg.code);
          break;
      }
    }, null, this._disposables);
    setTimeout(() => this._handleOllamaCheck(), 500);
  }
  static createOrShow(extensionUri) {
    const column = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
    if (_AgniChatPanel.currentPanel) {
      _AgniChatPanel.currentPanel._panel.reveal(column);
      return;
    }
    const panel = vscode.window.createWebviewPanel(
      "agniChat",
      "\u{1F525} Agni IDE",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri]
      }
    );
    _AgniChatPanel.currentPanel = new _AgniChatPanel(panel, extensionUri);
  }
  async _handleOllamaCheck() {
    const config = vscode.workspace.getConfiguration("agni");
    const url = config.get("ollamaUrl") || "http://localhost:11434";
    const result = await checkOllama(url);
    this._panel.webview.postMessage({
      type: "ollamaStatus",
      ok: result.ok,
      models: result.models
    });
  }
  async _handleAgentRun(instruction) {
    const config = vscode.workspace.getConfiguration("agni");
    const ollamaUrl = config.get("ollamaUrl") || "http://localhost:11434";
    const model = config.get("model") || "qwen2.5-coder:7b";
    const maxRetries = config.get("maxRetries") || 3;
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || process.cwd();
    const editor = vscode.window.activeTextEditor;
    let contextInstruction = instruction;
    if (editor) {
      const filePath = editor.document.uri.fsPath;
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      const cursorLine = selection.active.line + 1;
      if (selectedText) {
        contextInstruction = `File: ${filePath}
Selected code (lines around ${cursorLine}):
\`\`\`
${selectedText}
\`\`\`

Task: ${instruction}`;
      } else {
        contextInstruction = `File: ${filePath} (cursor at line ${cursorLine})

Task: ${instruction}`;
      }
    }
    this._panel.webview.postMessage({ type: "agentStart", model });
    try {
      const summary = await runAgent(
        contextInstruction,
        { ollamaUrl, model, maxRetries, workspacePath },
        (step) => {
          this._panel.webview.postMessage({ type: "agentStep", step });
        },
        (token) => {
          this._panel.webview.postMessage({ type: "agentToken", token });
        }
      );
      this._panel.webview.postMessage({ type: "agentDone", summary });
    } catch (e) {
      this._panel.webview.postMessage({ type: "agentError", error: e.message });
    }
  }
  _insertAtCursor(code) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      editor.edit((editBuilder) => {
        editBuilder.replace(editor.selection, code);
      });
    }
  }
  _getHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Agni IDE</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  #header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--vscode-panel-border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #header h1 { font-size: 16px; font-weight: 600; }
  #status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #666; flex-shrink: 0;
  }
  #status-dot.ok { background: #4ade80; }
  #status-dot.error { background: #f87171; }
  #model-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 12px;
    background: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    margin-left: auto;
  }
  #messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .msg { display: flex; flex-direction: column; gap: 4px; }
  .msg-user .bubble {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border-radius: 12px 12px 2px 12px;
    padding: 8px 12px;
    align-self: flex-end;
    max-width: 85%;
    font-size: 13px;
  }
  .msg-agent .bubble {
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-panel-border);
    border-radius: 2px 12px 12px 12px;
    padding: 8px 12px;
    align-self: flex-start;
    max-width: 95%;
    font-size: 13px;
  }
  .step-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 0;
    font-size: 12px;
    color: var(--vscode-descriptionForeground);
  }
  .step-icon { font-size: 14px; flex-shrink: 0; }
  .step-detail { font-family: 'Courier New', monospace; font-size: 11px; opacity: 0.8; white-space: pre-wrap; word-break: break-all; }
  .thought { font-style: italic; opacity: 0.75; font-size: 12px; margin-bottom: 4px; }
  .token-stream {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    opacity: 0.6;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 80px;
    overflow: hidden;
  }
  .done-badge {
    background: #14532d; color: #4ade80;
    border-radius: 6px; padding: 6px 12px;
    font-size: 13px; font-weight: 500;
  }
  .error-badge {
    background: #450a0a; color: #f87171;
    border-radius: 6px; padding: 6px 12px;
    font-size: 13px;
  }
  #input-area {
    padding: 12px;
    border-top: 1px solid var(--vscode-panel-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  #input-row { display: flex; gap: 8px; }
  #instruction {
    flex: 1;
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    color: var(--vscode-input-foreground);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
    resize: none;
    min-height: 60px;
    outline: none;
  }
  #instruction:focus { border-color: var(--vscode-focusBorder); }
  #send-btn {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    cursor: pointer;
    align-self: flex-end;
    font-weight: 600;
    min-width: 60px;
  }
  #send-btn:hover { background: var(--vscode-button-hoverBackground); }
  #send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .hint { font-size: 11px; color: var(--vscode-descriptionForeground); }
  #ollama-warning {
    background: #451a03;
    border: 1px solid #92400e;
    color: #fbbf24;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    display: none;
  }
  .spinner {
    display: inline-block;
    width: 12px; height: 12px;
    border: 2px solid var(--vscode-descriptionForeground);
    border-top-color: var(--vscode-button-background);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  pre { white-space: pre-wrap; word-break: break-all; }
</style>
</head>
<body>
<div id="header">
  <span style="font-size:18px">\u{1F525}</span>
  <h1>Agni IDE</h1>
  <div id="status-dot" title="Ollama status"></div>
  <span id="model-badge">checking...</span>
</div>

<div id="ollama-warning">
  Ollama not found at <strong>localhost:11434</strong>. Run: <code>ollama serve</code> \u2014 then reload.
</div>

<div id="messages">
  <div class="msg msg-agent">
    <div class="bubble">
      <strong>Agni</strong> is ready.<br>
      Open a file, select some code, and tell me what to do.<br><br>
      <span style="opacity:0.7; font-size:12px">Examples:<br>
      \u2022 "Add input validation to this function"<br>
      \u2022 "Refactor this to use async/await"<br>
      \u2022 "Add error handling and TypeScript types"<br>
      \u2022 "Write unit tests for this code"</span>
    </div>
  </div>
</div>

<div id="input-area">
  <div id="input-row">
    <textarea id="instruction" placeholder="Tell Agni what to do...&#10;(Ctrl+Enter to send)" rows="3"></textarea>
    <button id="send-btn">Send</button>
  </div>
  <span class="hint">Ctrl+Enter to send \u2022 Works on selected code or full file</span>
</div>

<script>
  const vscode = acquireVsCodeApi();
  const messagesEl = document.getElementById('messages');
  const instructionEl = document.getElementById('instruction');
  const sendBtn = document.getElementById('send-btn');
  const statusDot = document.getElementById('status-dot');
  const modelBadge = document.getElementById('model-badge');
  const ollamaWarning = document.getElementById('ollama-warning');

  let running = false;
  let currentAgentBubble = null;
  let currentTokenEl = null;
  let currentModel = 'qwen2.5-coder:7b';

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = 'msg msg-' + role;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = content;
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function stateIcon(state) {
    const icons = {
      PLAN: '\u{1F9E0}', EXECUTE: '\u26A1', VERIFY: '\u{1F50D}',
      CORRECT: '\u{1F527}', DONE: '\u2705', ERROR: '\u274C', IDLE: '\u{1F4A4}'
    };
    return icons[state] || '\u2022';
  }

  function addStep(bubble, step) {
    const row = document.createElement('div');
    row.className = 'step-row';

    let html = '<span class="step-icon">' + stateIcon(step.state) + '</span><div>';

    if (step.state === 'PLAN') {
      html += '<strong>Planning...</strong>';
    } else if (step.state === 'EXECUTE' && step.toolName) {
      html += '<strong>' + step.toolName + '</strong>';
      if (step.thought) {
        html += '<div class="thought">' + escHtml(step.thought.slice(0, 120)) + (step.thought.length > 120 ? '...' : '') + '</div>';
      }
      if (step.toolArgs) {
        const argsStr = JSON.stringify(step.toolArgs, null, 2);
        html += '<div class="step-detail">' + escHtml(argsStr.slice(0, 200)) + (argsStr.length > 200 ? '...' : '') + '</div>';
      }
    } else if (step.state === 'VERIFY' && step.toolResult) {
      html += '<strong>Result:</strong> <span class="step-detail">' + escHtml(step.toolResult.slice(0, 150)) + '</span>';
    } else if (step.state === 'CORRECT') {
      html += '<strong>Self-correcting...</strong>';
      if (step.error) {
        html += '<div class="step-detail" style="color:#f87171">' + escHtml(step.error.slice(0, 150)) + '</div>';
      }
    } else if (step.state === 'DONE') {
      bubble.appendChild(document.createElement('br'));
      const badge = document.createElement('div');
      badge.className = 'done-badge';
      badge.textContent = '\u2705 Done';
      bubble.appendChild(badge);
      return;
    } else if (step.state === 'ERROR') {
      const badge = document.createElement('div');
      badge.className = 'error-badge';
      badge.textContent = '\u274C ' + (step.error || 'Error');
      bubble.appendChild(badge);
      return;
    }

    html += '</div>';
    row.innerHTML = html;
    bubble.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  window.addEventListener('message', event => {
    const msg = event.data;

    if (msg.type === 'ollamaStatus') {
      if (msg.ok) {
        statusDot.className = 'ok';
        statusDot.title = 'Ollama connected';
        ollamaWarning.style.display = 'none';
        if (msg.models.length > 0) {
          currentModel = msg.models[0];
          modelBadge.textContent = currentModel;
        }
      } else {
        statusDot.className = 'error';
        statusDot.title = 'Ollama not connected';
        ollamaWarning.style.display = 'block';
        modelBadge.textContent = 'offline';
      }
    }

    else if (msg.type === 'agentStart') {
      currentModel = msg.model;
      modelBadge.textContent = msg.model + ' \u2022 running';
      currentAgentBubble = addMessage('agent', '<strong>Agni</strong> (thinking...)<br>');
      currentTokenEl = document.createElement('div');
      currentTokenEl.className = 'token-stream';
      currentAgentBubble.appendChild(currentTokenEl);
    }

    else if (msg.type === 'agentToken') {
      if (currentTokenEl) {
        currentTokenEl.textContent += msg.token;
        // Keep only last 200 chars visible
        if (currentTokenEl.textContent.length > 200) {
          currentTokenEl.textContent = '...' + currentTokenEl.textContent.slice(-200);
        }
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }

    else if (msg.type === 'agentStep') {
      if (currentAgentBubble) {
        if (currentTokenEl) {
          currentTokenEl.textContent = '';
        }
        addStep(currentAgentBubble, msg.step);
      }
    }

    else if (msg.type === 'agentDone') {
      modelBadge.textContent = currentModel;
      setRunning(false);
    }

    else if (msg.type === 'agentError') {
      if (currentAgentBubble) {
        const badge = document.createElement('div');
        badge.className = 'error-badge';
        badge.textContent = '\u274C ' + msg.error;
        currentAgentBubble.appendChild(badge);
      }
      modelBadge.textContent = currentModel;
      setRunning(false);
    }
  });

  function setRunning(val) {
    running = val;
    sendBtn.disabled = val;
    sendBtn.textContent = val ? '...' : 'Send';
    instructionEl.disabled = val;
  }

  async function send() {
    const instruction = instructionEl.value.trim();
    if (!instruction || running) return;

    addMessage('user', '<div class="bubble">' + escHtml(instruction) + '</div>');
    instructionEl.value = '';
    setRunning(true);

    vscode.postMessage({ type: 'runAgent', instruction });
  }

  sendBtn.addEventListener('click', send);
  instructionEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); send(); }
  });

  // Check Ollama status
  vscode.postMessage({ type: 'checkOllama' });
</script>
</body>
</html>`;
  }
  dispose() {
    _AgniChatPanel.currentPanel = void 0;
    this._panel.dispose();
    while (this._disposables.length) {
      const d = this._disposables.pop();
      if (d) d.dispose();
    }
  }
};

// src/extension.ts
function activate(context) {
  console.log("\u{1F525} Agni IDE activated");
  context.subscriptions.push(
    vscode2.commands.registerCommand("agni.openChat", () => {
      AgniChatPanel.createOrShow(context.extensionUri);
    })
  );
  context.subscriptions.push(
    vscode2.commands.registerCommand("agni.runAgent", async () => {
      const editor = vscode2.window.activeTextEditor;
      if (!editor) {
        vscode2.window.showErrorMessage("Agni: Open a file first");
        return;
      }
      const instruction = await vscode2.window.showInputBox({
        prompt: "What should Agni do?",
        placeHolder: "e.g. Add input validation, Refactor to async/await, Add TypeScript types..."
      });
      if (!instruction) return;
      const config2 = vscode2.workspace.getConfiguration("agni");
      const ollamaUrl2 = config2.get("ollamaUrl") || "http://localhost:11434";
      const model = config2.get("model") || "qwen2.5-coder:7b";
      const maxRetries = config2.get("maxRetries") || 3;
      const workspacePath = vscode2.workspace.workspaceFolders?.[0]?.uri?.fsPath || process.cwd();
      const filePath = editor.document.uri.fsPath;
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      const cursorLine = selection.active.line + 1;
      let contextInstruction = "";
      if (selectedText) {
        contextInstruction = `File: ${filePath}
Selected code (lines around ${cursorLine}):
\`\`\`
${selectedText}
\`\`\`

Task: ${instruction}`;
      } else {
        contextInstruction = `File: ${filePath} (cursor at line ${cursorLine})

Task: ${instruction}`;
      }
      await vscode2.window.withProgress(
        { location: vscode2.ProgressLocation.Notification, title: "\u{1F525} Agni thinking...", cancellable: false },
        async (progress) => {
          progress.report({ message: `Using ${model}` });
          const summary = await runAgent(
            contextInstruction,
            { ollamaUrl: ollamaUrl2, model, maxRetries, workspacePath },
            (step) => {
              if (step.state === "VERIFY") {
                progress.report({ message: `Verifying...` });
              } else if (step.state === "CORRECT") {
                progress.report({ message: `Self-correcting...` });
              } else if (step.toolName) {
                progress.report({ message: step.toolName });
              }
            },
            (_token) => {
            }
          );
          vscode2.window.showInformationMessage(`\u2705 Agni: ${summary}`);
        }
      );
    })
  );
  context.subscriptions.push(
    vscode2.commands.registerCommand("agni.indexWorkspace", async () => {
      vscode2.window.showInformationMessage("\u{1F525} Agni: Workspace indexing coming in v0.2!");
    })
  );
  const statusBar = vscode2.window.createStatusBarItem(vscode2.StatusBarAlignment.Right, 100);
  statusBar.command = "agni.openChat";
  statusBar.text = "\u{1F525} Agni";
  statusBar.tooltip = "Open Agni IDE Chat (Ctrl+Shift+A)";
  statusBar.show();
  context.subscriptions.push(statusBar);
  const config = vscode2.workspace.getConfiguration("agni");
  const ollamaUrl = config.get("ollamaUrl") || "http://localhost:11434";
  checkOllama(ollamaUrl).then(({ ok, models }) => {
    if (ok) {
      const model = models[0] || "unknown";
      statusBar.text = `\u{1F525} Agni (${model})`;
      statusBar.tooltip = `Agni IDE \u2014 Ollama connected: ${models.join(", ")}`;
    } else {
      statusBar.text = "\u{1F525} Agni (offline)";
      statusBar.tooltip = "Agni IDE \u2014 Ollama not running. Run: ollama serve";
      vscode2.window.showWarningMessage(
        "\u{1F525} Agni IDE: Ollama not found. Run `ollama serve` to start.",
        "Dismiss"
      );
    }
  });
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
