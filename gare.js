"use strict";
const { IncomingMessage, ServerResponse } = require("http");

module.exports = {
  Router: require("./router"),
  jsonc: require("./jsonc"),
  static: require("./static"),
};

IncomingMessage.prototype.body = {};
IncomingMessage.prototype.params = {};
IncomingMessage.prototype.parseBody = function () {
  return new Promise((resolve) => {
    let raw = "";
    this.on("data", (chunk) => (raw += chunk.toString())).on("end", () => {
      this.body = raw;
      resolve(raw);
    });
  });
};
Object.defineProperty(IncomingMessage.prototype, "query", {
  get: function () {
    return querystring.parse(nodeurl.parse(this.url).query);
  },
});
Object.defineProperty(IncomingMessage.prototype, "ip", {
  get: function () {
    return this.connection.remoteAddress.slice(7);
  },
});
ServerResponse.prototype.status = function (status) {
  this.statusCode = status;
  return this;
};
ServerResponse.prototype.header = function (name, value) {
  this.setHeader(name, value);
  return this;
};
ServerResponse.prototype.type = function (type) {
  this.setHeader("Content-Type", type);
  return this;
};
ServerResponse.prototype.length = function (length) {
  this.setHeader("Content-Length", length);
  return this;
};
ServerResponse.prototype.text = function (data) {
  this.setHeader("Content-Type", "text/plain");
  this.end(data);
};
ServerResponse.prototype.json = function (data) {
  this.setHeader("Content-Type", "application/json");
  this.end(JSON.stringify(data));
};
ServerResponse.prototype.jsonc = function (schema, data) {
  this.setHeader("Content-Type", "application/json");
  this.end(schema(data));
};
ServerResponse.prototype.bin = function (data) {
  this.setHeader("Content-Type", "application/octet-stream");
  this.end(data);
};
ServerResponse.prototype.file = function (path) {
  nodefs.createReadStream(path).pipe(this);
};