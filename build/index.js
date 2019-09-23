/*!
 * 
 *   codepath v0.1.0
 *   https://github.com/felix-b/codepath-js
 * 
 *   Copyright (c) Felix Berman (https://github.com/felix-b)
 * 
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CodePath"] = factory();
	else
		root["CodePath"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inherits.js":
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");

var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ "./node_modules/opentracing/lib/binary_carrier.js":
/*!********************************************************!*\
  !*** ./node_modules/opentracing/lib/binary_carrier.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convenience class to use as a binary carrier.
 *
 * Any valid Object with a field named `buffer` may be used as a binary carrier;
 * this class is only one such type of object that can be used.
 */
var BinaryCarrier = /** @class */ (function () {
    function BinaryCarrier(buffer) {
        this.buffer = buffer;
    }
    return BinaryCarrier;
}());
exports.default = BinaryCarrier;
//# sourceMappingURL=binary_carrier.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/constants.js":
/*!***************************************************!*\
  !*** ./node_modules/opentracing/lib/constants.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The FORMAT_BINARY format represents SpanContexts in an opaque binary
 * carrier.
 *
 * Tracer.inject() will set the buffer field to an Array-like (Array,
 * ArrayBuffer, or TypedBuffer) object containing the injected binary data.
 * Any valid Object can be used as long as the buffer field of the object
 * can be set.
 *
 * Tracer.extract() will look for `carrier.buffer`, and that field is
 * expected to be an Array-like object (Array, ArrayBuffer, or
 * TypedBuffer).
 */
exports.FORMAT_BINARY = 'binary';
/**
 * The FORMAT_TEXT_MAP format represents SpanContexts using a
 * string->string map (backed by a Javascript Object) as a carrier.
 *
 * NOTE: Unlike FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP places no restrictions
 * on the characters used in either the keys or the values of the map
 * entries.
 *
 * The FORMAT_TEXT_MAP carrier map may contain unrelated data (e.g.,
 * arbitrary gRPC metadata); as such, the Tracer implementation should use
 * a prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_TEXT_MAP = 'text_map';
/**
 * The FORMAT_HTTP_HEADERS format represents SpanContexts using a
 * character-restricted string->string map (backed by a Javascript Object)
 * as a carrier.
 *
 * Keys and values in the FORMAT_HTTP_HEADERS carrier must be suitable for
 * use as HTTP headers (without modification or further escaping). That is,
 * the keys have a greatly restricted character set, casing for the keys
 * may not be preserved by various intermediaries, and the values should be
 * URL-escaped.
 *
 * The FORMAT_HTTP_HEADERS carrier map may contain unrelated data (e.g.,
 * arbitrary HTTP headers); as such, the Tracer implementation should use a
 * prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_HTTP_HEADERS = 'http_headers';
/**
 * A Span may be the "child of" a parent Span. In a “child of” reference,
 * the parent Span depends on the child Span in some capacity.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_CHILD_OF = 'child_of';
/**
 * Some parent Spans do not depend in any way on the result of their child
 * Spans. In these cases, we say merely that the child Span “follows from”
 * the parent Span in a causal sense.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_FOLLOWS_FROM = 'follows_from';
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/ext/tags.js":
/*!**************************************************!*\
  !*** ./node_modules/opentracing/lib/ext/tags.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/** SPAN_KIND hints at relationship between spans, e.g. client/server */
exports.SPAN_KIND = 'span.kind';
/** Marks a span representing the client-side of an RPC or other remote call */
exports.SPAN_KIND_RPC_CLIENT = 'client';
/** Marks a span representing the server-side of an RPC or other remote call */
exports.SPAN_KIND_RPC_SERVER = 'server';
/** Marks a span representing the producing-side within a messaging system or other remote call */
exports.SPAN_KIND_MESSAGING_PRODUCER = 'producer';
/** Marks a span representing the consuming-side within a messaging system or other remote call */
exports.SPAN_KIND_MESSAGING_CONSUMER = 'consumer';
/**
 * ERROR (boolean) true if and only if the application considers the operation
 * represented by the Span to have failed
 */
exports.ERROR = 'error';
/**
 * COMPONENT (string) ia s low-cardinality identifier of the module, library,
 * or package that is generating a span.
 */
exports.COMPONENT = 'component';
/**
 * SAMPLING_PRIORITY (number) determines the priority of sampling this Span.
 * If greater than 0, a hint to the Tracer to do its best to capture the trace.
 * If 0, a hint to the trace to not-capture the trace. If absent, the Tracer
 * should use its default sampling mechanism.
 */
exports.SAMPLING_PRIORITY = 'sampling.priority';
// ---------------------------------------------------------------------------
// PEER_* tags can be emitted by either client-side of server-side to describe
// the other side/service in a peer-to-peer communications, like an RPC call.
// ---------------------------------------------------------------------------
/**
 * PEER_SERVICE (string) Remote service name (for some unspecified
 * definition of "service"). E.g., "elasticsearch", "a_custom_microservice", "memcache"
 */
exports.PEER_SERVICE = 'peer.service';
/** PEER_HOSTNAME (string) Remote hostname. E.g., "opentracing.io", "internal.dns.name" */
exports.PEER_HOSTNAME = 'peer.hostname';
/**
 * PEER_ADDRESS (string) Remote "address", suitable for use in a
 * networking client library. This may be a "ip:port", a bare
 * "hostname", a FQDN, or even a JDBC substring like "mysql://prod-db:3306"
 */
exports.PEER_ADDRESS = 'peer.address';
/**
 * PEER_HOST_IPV4 (number) Remote IPv4 address as a .-separated tuple.
 * E.g., "127.0.0.1"
 */
exports.PEER_HOST_IPV4 = 'peer.ipv4';
// PEER_HOST_IPV6 (string) Remote IPv6 address as a string of
// colon-separated 4-char hex tuples. E.g., "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
exports.PEER_HOST_IPV6 = 'peer.ipv6';
// PEER_PORT (number) Remote port. E.g., 80
exports.PEER_PORT = 'peer.port';
// ---------------------------------------------------------------------------
// HTTP tags
// ---------------------------------------------------------------------------
/**
 * HTTP_URL (string) URL of the request being handled in this segment of the
 * trace, in standard URI format. E.g., "https://domain.net/path/to?resource=here"
 */
exports.HTTP_URL = 'http.url';
/**
 * HTTP_METHOD (string) HTTP method of the request for the associated Span. E.g.,
 * "GET", "POST"
 */
exports.HTTP_METHOD = 'http.method';
/**
 * HTTP_STATUS_CODE (number) HTTP response status code for the associated Span.
 * E.g., 200, 503, 404
 */
exports.HTTP_STATUS_CODE = 'http.status_code';
// -------------------------------------------------------------------------
// Messaging tags
// -------------------------------------------------------------------------
/**
 * MESSAGE_BUS_DESTINATION (string) An address at which messages can be exchanged.
 * E.g. A Kafka record has an associated "topic name" that can be extracted
 * by the instrumented producer or consumer and stored using this tag.
 */
exports.MESSAGE_BUS_DESTINATION = 'message_bus.destination';
// --------------------------------------------------------------------------
// Database tags
// --------------------------------------------------------------------------
/**
 * DB_INSTANCE (string) Database instance name. E.g., In java, if the
 * jdbc.url="jdbc:mysql://127.0.0.1:3306/customers", the instance name is "customers".
 */
exports.DB_INSTANCE = 'db.instance';
/**
 * DB_STATEMENT (string) A database statement for the given database type.
 * E.g., for db.type="SQL", "SELECT * FROM wuser_table";
 * for db.type="redis", "SET mykey 'WuValue'".
 */
exports.DB_STATEMENT = 'db.statement';
/**
 * DB_TYPE (string) Database type. For any SQL database, "sql". For others,
 * the lower-case database category, e.g. "cassandra", "hbase", or "redis".
 */
exports.DB_TYPE = 'db.type';
/**
 * DB_USER (string) Username for accessing database. E.g., "readonly_user"
 * or "reporting_user"
 */
exports.DB_USER = 'db.user';
//# sourceMappingURL=tags.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/functions.js":
/*!***************************************************!*\
  !*** ./node_modules/opentracing/lib/functions.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Constants = __webpack_require__(/*! ./constants */ "./node_modules/opentracing/lib/constants.js");
var reference_1 = __webpack_require__(/*! ./reference */ "./node_modules/opentracing/lib/reference.js");
var span_1 = __webpack_require__(/*! ./span */ "./node_modules/opentracing/lib/span.js");
/**
 * Return a new REFERENCE_CHILD_OF reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
 */
function childOf(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_CHILD_OF, spanContext);
}
exports.childOf = childOf;
/**
 * Return a new REFERENCE_FOLLOWS_FROM reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
 */
function followsFrom(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
}
exports.followsFrom = followsFrom;
//# sourceMappingURL=functions.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/global_tracer.js":
/*!*******************************************************!*\
  !*** ./node_modules/opentracing/lib/global_tracer.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tracer_1 = __webpack_require__(/*! ./tracer */ "./node_modules/opentracing/lib/tracer.js");
var noopTracer = new tracer_1.default();
var _globalTracer = null;
// Allows direct importing/requiring of the global tracer:
//
// let globalTracer = require('opentracing/global');
//      OR
// import globalTracer from 'opentracing/global';
//
// Acts a bridge to the global tracer that can be safely called before the
// global tracer is initialized. The purpose of the delegation is to avoid the
// sometimes nearly intractible initialization order problems that can arise in
// applications with a complex set of dependencies, while also avoiding the
// case where
var GlobalTracerDelegate = /** @class */ (function (_super) {
    __extends(GlobalTracerDelegate, _super);
    function GlobalTracerDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalTracerDelegate.prototype.startSpan = function () {
        var tracer = _globalTracer || noopTracer;
        return tracer.startSpan.apply(tracer, arguments);
    };
    GlobalTracerDelegate.prototype.inject = function () {
        var tracer = _globalTracer || noopTracer;
        return tracer.inject.apply(tracer, arguments);
    };
    GlobalTracerDelegate.prototype.extract = function () {
        var tracer = _globalTracer || noopTracer;
        return tracer.extract.apply(tracer, arguments);
    };
    return GlobalTracerDelegate;
}(tracer_1.default));
var globalTracerDelegate = new GlobalTracerDelegate();
/**
 * Set the global Tracer.
 *
 * The behavior is undefined if this function is called more than once.
 *
 * @param {Tracer} tracer - the Tracer implementation
 */
function initGlobalTracer(tracer) {
    _globalTracer = tracer;
}
exports.initGlobalTracer = initGlobalTracer;
/**
 * Returns the global tracer.
 */
function globalTracer() {
    // Return the delegate.  Since the global tracer is largely a convenience
    // (the user can always create their own tracers), the delegate is used to
    // give the added convenience of not needing to worry about initialization
    // order.
    return globalTracerDelegate;
}
exports.globalTracer = globalTracer;
//# sourceMappingURL=global_tracer.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/index.js":
/*!***********************************************!*\
  !*** ./node_modules/opentracing/lib/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var binary_carrier_1 = __webpack_require__(/*! ./binary_carrier */ "./node_modules/opentracing/lib/binary_carrier.js");
exports.BinaryCarrier = binary_carrier_1.default;
var Tags = __webpack_require__(/*! ./ext/tags */ "./node_modules/opentracing/lib/ext/tags.js");
exports.Tags = Tags;
var Noop = __webpack_require__(/*! ./noop */ "./node_modules/opentracing/lib/noop.js");
var reference_1 = __webpack_require__(/*! ./reference */ "./node_modules/opentracing/lib/reference.js");
exports.Reference = reference_1.default;
var span_1 = __webpack_require__(/*! ./span */ "./node_modules/opentracing/lib/span.js");
exports.Span = span_1.default;
var span_context_1 = __webpack_require__(/*! ./span_context */ "./node_modules/opentracing/lib/span_context.js");
exports.SpanContext = span_context_1.default;
var tracer_1 = __webpack_require__(/*! ./tracer */ "./node_modules/opentracing/lib/tracer.js");
exports.Tracer = tracer_1.Tracer;
var mock_tracer_1 = __webpack_require__(/*! ./mock_tracer */ "./node_modules/opentracing/lib/mock_tracer/index.js");
exports.MockTracer = mock_tracer_1.MockTracer;
__export(__webpack_require__(/*! ./global_tracer */ "./node_modules/opentracing/lib/global_tracer.js"));
__export(__webpack_require__(/*! ./constants */ "./node_modules/opentracing/lib/constants.js"));
__export(__webpack_require__(/*! ./functions */ "./node_modules/opentracing/lib/functions.js"));
// Initialize the noops last to avoid a dependecy cycle between the classes.
Noop.initialize();
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/mock_tracer/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/opentracing/lib/mock_tracer/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mock_context_1 = __webpack_require__(/*! ./mock_context */ "./node_modules/opentracing/lib/mock_tracer/mock_context.js");
exports.MockContext = mock_context_1.default;
var mock_span_1 = __webpack_require__(/*! ./mock_span */ "./node_modules/opentracing/lib/mock_tracer/mock_span.js");
exports.MockSpan = mock_span_1.default;
var mock_tracer_1 = __webpack_require__(/*! ./mock_tracer */ "./node_modules/opentracing/lib/mock_tracer/mock_tracer.js");
exports.MockTracer = mock_tracer_1.default;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/mock_tracer/mock_context.js":
/*!******************************************************************!*\
  !*** ./node_modules/opentracing/lib/mock_tracer/mock_context.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var opentracing = __webpack_require__(/*! ../index */ "./node_modules/opentracing/lib/index.js");
/**
 * OpenTracing Context implementation designed for use in
 * unit tests.
 */
var MockContext = /** @class */ (function (_super) {
    __extends(MockContext, _super);
    function MockContext(span) {
        var _this = _super.call(this) || this;
        // Store a reference to the span itself since this is a mock tracer
        // intended to make debugging and unit testing easier.
        _this._span = span;
        return _this;
    }
    MockContext.prototype.span = function () {
        return this._span;
    };
    return MockContext;
}(opentracing.SpanContext));
exports.MockContext = MockContext;
exports.default = MockContext;
//# sourceMappingURL=mock_context.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/mock_tracer/mock_report.js":
/*!*****************************************************************!*\
  !*** ./node_modules/opentracing/lib/mock_tracer/mock_report.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Index a collection of reported MockSpans in a way that's easy to run unit
 * test assertions against.
 */
var MockReport = /** @class */ (function () {
    function MockReport(spans) {
        var _this = this;
        this.spans = spans;
        this.spansByUUID = {};
        this.spansByTag = {};
        this.debugSpans = [];
        this.unfinishedSpans = [];
        spans.forEach(function (span) {
            if (span._finishMs === 0) {
                _this.unfinishedSpans.push(span);
            }
            _this.spansByUUID[span.uuid()] = span;
            _this.debugSpans.push(span.debug());
            var tags = span.tags();
            Object.keys(tags).forEach(function (key) {
                var val = tags[key];
                _this.spansByTag[key] = _this.spansByTag[key] || {};
                _this.spansByTag[key][val] = _this.spansByTag[key][val] || [];
                _this.spansByTag[key][val].push(span);
            });
        });
    }
    MockReport.prototype.firstSpanWithTagValue = function (key, val) {
        var m = this.spansByTag[key];
        if (!m) {
            return null;
        }
        var n = m[val];
        if (!n) {
            return null;
        }
        return n[0];
    };
    return MockReport;
}());
exports.MockReport = MockReport;
exports.default = MockReport;
//# sourceMappingURL=mock_report.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/mock_tracer/mock_span.js":
/*!***************************************************************!*\
  !*** ./node_modules/opentracing/lib/mock_tracer/mock_span.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable import/no-extraneous-dependencies */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var opentracing = __webpack_require__(/*! ../index */ "./node_modules/opentracing/lib/index.js");
var mock_context_1 = __webpack_require__(/*! ./mock_context */ "./node_modules/opentracing/lib/mock_tracer/mock_context.js");
/**
 * OpenTracing Span implementation designed for use in unit tests.
 */
var MockSpan = /** @class */ (function (_super) {
    __extends(MockSpan, _super);
    //------------------------------------------------------------------------//
    // MockSpan-specific
    //------------------------------------------------------------------------//
    function MockSpan(tracer) {
        var _this = _super.call(this) || this;
        _this._mockTracer = tracer;
        _this._uuid = _this._generateUUID();
        _this._startMs = Date.now();
        _this._finishMs = 0;
        _this._operationName = '';
        _this._tags = {};
        _this._logs = [];
        return _this;
    }
    //------------------------------------------------------------------------//
    // OpenTracing implementation
    //------------------------------------------------------------------------//
    MockSpan.prototype._context = function () {
        return new mock_context_1.default(this);
    };
    MockSpan.prototype._setOperationName = function (name) {
        this._operationName = name;
    };
    MockSpan.prototype._addTags = function (set) {
        var keys = Object.keys(set);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            this._tags[key] = set[key];
        }
    };
    MockSpan.prototype._log = function (fields, timestamp) {
        this._logs.push({
            fields: fields,
            timestamp: timestamp
        });
    };
    MockSpan.prototype._finish = function (finishTime) {
        this._finishMs = finishTime || Date.now();
    };
    MockSpan.prototype.uuid = function () {
        return this._uuid;
    };
    MockSpan.prototype.operationName = function () {
        return this._operationName;
    };
    MockSpan.prototype.durationMs = function () {
        return this._finishMs - this._startMs;
    };
    MockSpan.prototype.tags = function () {
        return this._tags;
    };
    MockSpan.prototype.tracer = function () {
        return this._mockTracer;
    };
    MockSpan.prototype._generateUUID = function () {
        var p0 = ("00000000" + Math.abs((Math.random() * 0xFFFFFFFF) | 0).toString(16)).substr(-8);
        var p1 = ("00000000" + Math.abs((Math.random() * 0xFFFFFFFF) | 0).toString(16)).substr(-8);
        return "" + p0 + p1;
    };
    MockSpan.prototype.addReference = function (ref) {
    };
    /**
     * Returns a simplified object better for console.log()'ing.
     */
    MockSpan.prototype.debug = function () {
        var obj = {
            uuid: this._uuid,
            operation: this._operationName,
            millis: [this._finishMs - this._startMs, this._startMs, this._finishMs]
        };
        if (Object.keys(this._tags).length) {
            obj.tags = this._tags;
        }
        return obj;
    };
    return MockSpan;
}(opentracing.Span));
exports.MockSpan = MockSpan;
exports.default = MockSpan;
//# sourceMappingURL=mock_span.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/mock_tracer/mock_tracer.js":
/*!*****************************************************************!*\
  !*** ./node_modules/opentracing/lib/mock_tracer/mock_tracer.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Move mock-tracer to its own NPM package once it is complete and tested.
var opentracing = __webpack_require__(/*! ../index */ "./node_modules/opentracing/lib/index.js");
var mock_report_1 = __webpack_require__(/*! ./mock_report */ "./node_modules/opentracing/lib/mock_tracer/mock_report.js");
var mock_span_1 = __webpack_require__(/*! ./mock_span */ "./node_modules/opentracing/lib/mock_tracer/mock_span.js");
/**
 * OpenTracing Tracer implementation designed for use in unit tests.
 */
var MockTracer = /** @class */ (function (_super) {
    __extends(MockTracer, _super);
    //------------------------------------------------------------------------//
    // MockTracer-specific
    //------------------------------------------------------------------------//
    function MockTracer() {
        var _this = _super.call(this) || this;
        _this._spans = [];
        return _this;
    }
    //------------------------------------------------------------------------//
    // OpenTracing implementation
    //------------------------------------------------------------------------//
    MockTracer.prototype._startSpan = function (name, fields) {
        // _allocSpan is given it's own method so that derived classes can
        // allocate any type of object they want, but not have to duplicate
        // the other common logic in startSpan().
        var span = this._allocSpan();
        span.setOperationName(name);
        this._spans.push(span);
        if (fields.references) {
            for (var _i = 0, _a = fields.references; _i < _a.length; _i++) {
                var ref = _a[_i];
                span.addReference(ref);
            }
        }
        // Capture the stack at the time the span started
        span._startStack = new Error().stack;
        return span;
    };
    MockTracer.prototype._inject = function (span, format, carrier) {
        throw new Error('NOT YET IMPLEMENTED');
    };
    MockTracer.prototype._extract = function (format, carrier) {
        throw new Error('NOT YET IMPLEMENTED');
    };
    MockTracer.prototype._allocSpan = function () {
        return new mock_span_1.default(this);
    };
    /**
     * Discard any buffered data.
     */
    MockTracer.prototype.clear = function () {
        this._spans = [];
    };
    /**
     * Return the buffered data in a format convenient for making unit test
     * assertions.
     */
    MockTracer.prototype.report = function () {
        return new mock_report_1.default(this._spans);
    };
    return MockTracer;
}(opentracing.Tracer));
exports.MockTracer = MockTracer;
exports.default = MockTracer;
//# sourceMappingURL=mock_tracer.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/noop.js":
/*!**********************************************!*\
  !*** ./node_modules/opentracing/lib/noop.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var span_1 = __webpack_require__(/*! ./span */ "./node_modules/opentracing/lib/span.js");
var span_context_1 = __webpack_require__(/*! ./span_context */ "./node_modules/opentracing/lib/span_context.js");
var tracer_1 = __webpack_require__(/*! ./tracer */ "./node_modules/opentracing/lib/tracer.js");
exports.tracer = null;
exports.spanContext = null;
exports.span = null;
// Deferred initialization to avoid a dependency cycle where Tracer depends on
// Span which depends on the noop tracer.
function initialize() {
    exports.tracer = new tracer_1.default();
    exports.span = new span_1.default();
    exports.spanContext = new span_context_1.default();
}
exports.initialize = initialize;
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/reference.js":
/*!***************************************************!*\
  !*** ./node_modules/opentracing/lib/reference.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var span_1 = __webpack_require__(/*! ./span */ "./node_modules/opentracing/lib/span.js");
/**
 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
 *
 * See the exported childOf() and followsFrom() functions at the package level.
 */
var Reference = /** @class */ (function () {
    /**
     * Initialize a new Reference instance.
     *
     * @param {string} type - the Reference type constant (e.g.,
     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
     * @param {SpanContext} referencedContext - the SpanContext being referred
     *        to. As a convenience, a Span instance may be passed in instead
     *        (in which case its .context() is used here).
     */
    function Reference(type, referencedContext) {
        this._type = type;
        this._referencedContext = (referencedContext instanceof span_1.default ?
            referencedContext.context() :
            referencedContext);
    }
    /**
     * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
     *         REFERENCE_FOLLOWS_FROM).
     */
    Reference.prototype.type = function () {
        return this._type;
    };
    /**
     * @return {SpanContext} The SpanContext being referred to (e.g., the
     *         parent in a REFERENCE_CHILD_OF Reference).
     */
    Reference.prototype.referencedContext = function () {
        return this._referencedContext;
    };
    return Reference;
}());
exports.default = Reference;
//# sourceMappingURL=reference.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/span.js":
/*!**********************************************!*\
  !*** ./node_modules/opentracing/lib/span.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var noop = __webpack_require__(/*! ./noop */ "./node_modules/opentracing/lib/noop.js");
/**
 * Span represents a logical unit of work as part of a broader Trace. Examples
 * of span might include remote procedure calls or a in-process function calls
 * to sub-components. A Trace has a single, top-level "root" Span that in turn
 * may have zero or more child Spans, which in turn may have children.
 */
var Span = /** @class */ (function () {
    function Span() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Returns the SpanContext object associated with this Span.
     *
     * @return {SpanContext}
     */
    Span.prototype.context = function () {
        return this._context();
    };
    /**
     * Returns the Tracer object used to create this Span.
     *
     * @return {Tracer}
     */
    Span.prototype.tracer = function () {
        return this._tracer();
    };
    /**
     * Sets the string name for the logical operation this span represents.
     *
     * @param {string} name
     */
    Span.prototype.setOperationName = function (name) {
        this._setOperationName(name);
        return this;
    };
    /**
     * Sets a key:value pair on this Span that also propagates to future
     * children of the associated Span.
     *
     * setBaggageItem() enables powerful functionality given a full-stack
     * opentracing integration (e.g., arbitrary application data from a web
     * client can make it, transparently, all the way into the depths of a
     * storage system), and with it some powerful costs: use this feature with
     * care.
     *
     * IMPORTANT NOTE #1: setBaggageItem() will only propagate baggage items to
     * *future* causal descendants of the associated Span.
     *
     * IMPORTANT NOTE #2: Use this thoughtfully and with care. Every key and
     * value is copied into every local *and remote* child of the associated
     * Span, and that can add up to a lot of network and cpu overhead.
     *
     * @param {string} key
     * @param {string} value
     */
    Span.prototype.setBaggageItem = function (key, value) {
        this._setBaggageItem(key, value);
        return this;
    };
    /**
     * Returns the value for a baggage item given its key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    Span.prototype.getBaggageItem = function (key) {
        return this._getBaggageItem(key);
    };
    /**
     * Adds a single tag to the span.  See `addTags()` for details.
     *
     * @param {string} key
     * @param {any} value
     */
    Span.prototype.setTag = function (key, value) {
        var _a;
        // NOTE: the call is normalized to a call to _addTags()
        this._addTags((_a = {}, _a[key] = value, _a));
        return this;
    };
    /**
     * Adds the given key value pairs to the set of span tags.
     *
     * Multiple calls to addTags() results in the tags being the superset of
     * all calls.
     *
     * The behavior of setting the same key multiple times on the same span
     * is undefined.
     *
     * The supported type of the values is implementation-dependent.
     * Implementations are expected to safely handle all types of values but
     * may choose to ignore unrecognized / unhandle-able values (e.g. objects
     * with cyclic references, function objects).
     *
     * @return {[type]} [description]
     */
    Span.prototype.addTags = function (keyValueMap) {
        this._addTags(keyValueMap);
        return this;
    };
    /**
     * Add a log record to this Span, optionally at a user-provided timestamp.
     *
     * For example:
     *
     *     span.log({
     *         size: rpc.size(),  // numeric value
     *         URI: rpc.URI(),  // string value
     *         payload: rpc.payload(),  // Object value
     *         "keys can be arbitrary strings": rpc.foo(),
     *     });
     *
     *     span.log({
     *         "error.description": someError.description(),
     *     }, someError.timestampMillis());
     *
     * @param {object} keyValuePairs
     *        An object mapping string keys to arbitrary value types. All
     *        Tracer implementations should support bool, string, and numeric
     *        value types, and some may also support Object values.
     * @param {number} timestamp
     *        An optional parameter specifying the timestamp in milliseconds
     *        since the Unix epoch. Fractional values are allowed so that
     *        timestamps with sub-millisecond accuracy can be represented. If
     *        not specified, the implementation is expected to use its notion
     *        of the current time of the call.
     */
    Span.prototype.log = function (keyValuePairs, timestamp) {
        this._log(keyValuePairs, timestamp);
        return this;
    };
    /**
     * DEPRECATED
     */
    Span.prototype.logEvent = function (eventName, payload) {
        return this._log({ event: eventName, payload: payload });
    };
    /**
     * Sets the end timestamp and finalizes Span state.
     *
     * With the exception of calls to Span.context() (which are always allowed),
     * finish() must be the last call made to any span instance, and to do
     * otherwise leads to undefined behavior.
     *
     * @param  {number} finishTime
     *         Optional finish time in milliseconds as a Unix timestamp. Decimal
     *         values are supported for timestamps with sub-millisecond accuracy.
     *         If not specified, the current time (as defined by the
     *         implementation) will be used.
     */
    Span.prototype.finish = function (finishTime) {
        this._finish(finishTime);
        // Do not return `this`. The Span generally should not be used after it
        // is finished so chaining is not desired in this context.
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // By default returns a no-op SpanContext.
    Span.prototype._context = function () {
        return noop.spanContext;
    };
    // By default returns a no-op tracer.
    //
    // The base class could store the tracer that created it, but it does not
    // in order to ensure the no-op span implementation has zero members,
    // which allows V8 to aggressively optimize calls to such objects.
    Span.prototype._tracer = function () {
        return noop.tracer;
    };
    // By default does nothing
    Span.prototype._setOperationName = function (name) {
    };
    // By default does nothing
    Span.prototype._setBaggageItem = function (key, value) {
    };
    // By default does nothing
    Span.prototype._getBaggageItem = function (key) {
        return undefined;
    };
    // By default does nothing
    //
    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
    // will always be an associative array.
    Span.prototype._addTags = function (keyValuePairs) {
    };
    // By default does nothing
    Span.prototype._log = function (keyValuePairs, timestamp) {
    };
    // By default does nothing
    //
    // finishTime is expected to be either a number or undefined.
    Span.prototype._finish = function (finishTime) {
    };
    return Span;
}());
exports.Span = Span;
exports.default = Span;
//# sourceMappingURL=span.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/span_context.js":
/*!******************************************************!*\
  !*** ./node_modules/opentracing/lib/span_context.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * SpanContext represents Span state that must propagate to descendant Spans
 * and across process boundaries.
 *
 * SpanContext is logically divided into two pieces: the user-level "Baggage"
 * (see setBaggageItem and getBaggageItem) that propagates across Span
 * boundaries and any Tracer-implementation-specific fields that are needed to
 * identify or otherwise contextualize the associated Span instance (e.g., a
 * <trace_id, span_id, sampled> tuple).
 */
var SpanContext = /** @class */ (function () {
    function SpanContext() {
    }
    // The SpanContext is entirely implementation dependent
    /**
     * Returns a string representation of the implementation internal trace ID.
     *
     * @returns {string}
     */
    SpanContext.prototype.toTraceId = function () {
        return '';
    };
    /**
     * Returns a string representation of the implementation internal span ID.
     *
     * @returns {string}
     */
    SpanContext.prototype.toSpanId = function () {
        return '';
    };
    return SpanContext;
}());
exports.SpanContext = SpanContext;
exports.default = SpanContext;
//# sourceMappingURL=span_context.js.map

/***/ }),

/***/ "./node_modules/opentracing/lib/tracer.js":
/*!************************************************!*\
  !*** ./node_modules/opentracing/lib/tracer.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Functions = __webpack_require__(/*! ./functions */ "./node_modules/opentracing/lib/functions.js");
var Noop = __webpack_require__(/*! ./noop */ "./node_modules/opentracing/lib/noop.js");
var span_1 = __webpack_require__(/*! ./span */ "./node_modules/opentracing/lib/span.js");
/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 *
 * Note to implementators: derived classes can choose to directly implement the
 * methods in the "OpenTracing API methods" section, or optionally the subset of
 * underscore-prefixed methods to pick up the argument checking and handling
 * automatically from the base class.
 */
var Tracer = /** @class */ (function () {
    function Tracer() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Starts and returns a new Span representing a logical unit of work.
     *
     * For example:
     *
     *     // Start a new (parentless) root Span:
     *     var parent = Tracer.startSpan('DoWork');
     *
     *     // Start a new (child) Span:
     *     var child = Tracer.startSpan('load-from-db', {
     *         childOf: parent.context(),
     *     });
     *
     *     // Start a new async (FollowsFrom) Span:
     *     var child = Tracer.startSpan('async-cache-write', {
     *         references: [
     *             opentracing.followsFrom(parent.context())
     *         ],
     *     });
     *
     * @param {string} name - the name of the operation (REQUIRED).
     * @param {SpanOptions} [options] - options for the newly created span.
     * @return {Span} - a new Span object.
     */
    Tracer.prototype.startSpan = function (name, options) {
        if (options === void 0) { options = {}; }
        // Convert options.childOf to fields.references as needed.
        if (options.childOf) {
            // Convert from a Span or a SpanContext into a Reference.
            var childOf = Functions.childOf(options.childOf);
            if (options.references) {
                options.references.push(childOf);
            }
            else {
                options.references = [childOf];
            }
            delete (options.childOf);
        }
        return this._startSpan(name, options);
    };
    /**
     * Injects the given SpanContext instance for cross-process propagation
     * within `carrier`. The expected type of `carrier` depends on the value of
     * `format.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     var clientSpan = ...;
     *     ...
     *     // Inject clientSpan into a text carrier.
     *     var headersCarrier = {};
     *     Tracer.inject(clientSpan.context(), Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     // Incorporate the textCarrier into the outbound HTTP request header
     *     // map.
     *     Object.assign(outboundHTTPReq.headers, headersCarrier);
     *     // ... send the httpReq
     *
     * @param  {SpanContext} spanContext - the SpanContext to inject into the
     *         carrier object. As a convenience, a Span instance may be passed
     *         in instead (in which case its .context() is used for the
     *         inject()).
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - see the documentation for the chosen `format`
     *         for a description of the carrier object.
     */
    Tracer.prototype.inject = function (spanContext, format, carrier) {
        // Allow the user to pass a Span instead of a SpanContext
        if (spanContext instanceof span_1.default) {
            spanContext = spanContext.context();
        }
        return this._inject(spanContext, format, carrier);
    };
    /**
     * Returns a SpanContext instance extracted from `carrier` in the given
     * `format`.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     // Use the inbound HTTP request's headers as a text map carrier.
     *     var headersCarrier = inboundHTTPReq.headers;
     *     var wireCtx = Tracer.extract(Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     var serverSpan = Tracer.startSpan('...', { childOf : wireCtx });
     *
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - the type of the carrier object is determined by
     *         the format.
     * @return {SpanContext}
     *         The extracted SpanContext, or null if no such SpanContext could
     *         be found in `carrier`
     */
    Tracer.prototype.extract = function (format, carrier) {
        return this._extract(format, carrier);
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // NOTE: the input to this method is *always* an associative array. The
    // public-facing startSpan() method normalizes the arguments so that
    // all N implementations do not need to worry about variations in the call
    // signature.
    //
    // The default behavior returns a no-op span.
    Tracer.prototype._startSpan = function (name, fields) {
        return Noop.span;
    };
    // The default behavior is a no-op.
    Tracer.prototype._inject = function (spanContext, format, carrier) {
    };
    // The default behavior is to return a no-op SpanContext.
    Tracer.prototype._extract = function (format, carrier) {
        return Noop.spanContext;
    };
    return Tracer;
}());
exports.Tracer = Tracer;
exports.default = Tracer;
//# sourceMappingURL=tracer.js.map

/***/ }),

/***/ "./src/codePath.js":
/*!*************************!*\
  !*** ./src/codePath.js ***!
  \*************************/
/*! exports provided: LOG_LEVEL, createRealLowResolutionClock, noopTracerFactory, defaultTracerFactory, GlobalCodePath, createCodePath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG_LEVEL", function() { return LOG_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRealLowResolutionClock", function() { return createRealLowResolutionClock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noopTracerFactory", function() { return noopTracerFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultTracerFactory", function() { return defaultTracerFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalCodePath", function() { return GlobalCodePath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCodePath", function() { return createCodePath; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var opentracing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opentracing */ "./node_modules/opentracing/lib/index.js");
/* harmony import */ var opentracing__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(opentracing__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _codePathTracer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./codePathTracer */ "./src/codePathTracer.js");
/* harmony import */ var _codePathStream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./codePathStream */ "./src/codePathStream.js");
/* harmony import */ var _codePathScopeManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./codePathScopeManager */ "./src/codePathScopeManager.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(source, true).forEach(function (key) {_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(source).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}





var LOG_LEVEL = {
  debug: 0,
  event: 1,
  warning: 2,
  error: 3,
  critical: 4 };


var createRealLowResolutionClock = function createRealLowResolutionClock() {
  return {
    now: function now() {
      return new Date().getTime();
    } };

};

// export const createDefaultScopeManager = () => {
//   let activeTracer = undefined;
//   let activeSpan = undefined;
//   return {
//     getActiveTracer() {
//       return activeTracer;
//     },
//     getActiveSpan() {
//       return activeSpan;
//     },
//     setActiveTracer(tracer) {
//       activeTracer = tracer;
//     },
//     setActiveSpan(span) {
//       activeSpan = span;
//     }
//   };
// };

var noopTracerFactory = function noopTracerFactory() {return new opentracing__WEBPACK_IMPORTED_MODULE_1__["Tracer"]();};

var defaultTracerFactory = function defaultTracerFactory(stream, options) {return (
    Object(_codePathTracer__WEBPACK_IMPORTED_MODULE_2__["createCodePathTracer"])("webuser".concat(options.clock.now()), stream, options));};

var GlobalCodePath = {
  configure: function configure(options) {var _createCodePath =
    createCodePath(options),input = _createCodePath.input,output = _createCodePath.output;
    Object.assign(GlobalCodePath, _objectSpread({},
    input, {
      getOutputStream: function getOutputStream() {
        return output;
      } }));

  },
  getOutputStream: function getOutputStream() {
    throw new Error("GlobalCodePath was not configured");
  } };


function createCodePath(options) {
  var clock = options && options.clock || createRealLowResolutionClock();
  var scopeManager =
  options && options.scopeManager || Object(_codePathScopeManager__WEBPACK_IMPORTED_MODULE_4__["createDefaultScopeManager"])();
  var tracerFactory =
  options && options.tracerFactory || defaultTracerFactory;
  var outputStream =
  options && options.outputStream ||
  Object(_codePathStream__WEBPACK_IMPORTED_MODULE_3__["createCodePathStream"])(options ? options.stream : undefined);
  var spanEntries = {};

  var getOrCreateActiveTracer = function getOrCreateActiveTracer() {
    var existingTracer = scopeManager.getActiveTracer();
    if (existingTracer) {
      return existingTracer;
    }

    var newTracer = tracerFactory({ clock: clock, scopeManager: scopeManager, tracerFactory: tracerFactory });
    scopeManager.setActiveTracer(newTracer);
    return newTracer;
  };

  var getParentSpanContext = function getParentSpanContext(parentContext) {
    if (parentContext) {
      return parentContext;
    }
    var existingSpan = scopeManager.getActiveSpan();
    if (existingSpan) {
      return existingSpan.context();
    }
  };

  var logToActiveSpan = function logToActiveSpan(tags) {
    var existingSpan = scopeManager.getActiveSpan();
    if (existingSpan) {
      existingSpan.log(tags);
    } else {
      var tempSpan = activeTracer.startSpan("unknown-root");
      tempSpan.log(tags);
      tempSpan.finish();
    }
  };

  var startSpan = function startSpan(id, tags, parentContext, parentReferenceType) {
    var tracer = getOrCreateActiveTracer();
    var parentReferenceContext = getParentSpanContext(parentContext);
    var spanOptions = {
      references: parentReferenceContext && [
      new opentracing__WEBPACK_IMPORTED_MODULE_1__["Reference"](parentReferenceType, parentReferenceContext)],

      tags: tags };

    var childSpan = tracer.startSpan(id, spanOptions);
    scopeManager.setActiveSpan(childSpan);
    var childSpanId = childSpan.context().toSpanId();
    spanEntries[childSpanId] = {
      span: childSpan,
      options: spanOptions };

    return childSpan;
  };

  scopeManager.setActiveTracer(
  tracerFactory(outputStream, {
    clock: clock,
    scopeManager: scopeManager,
    tracerFactory: tracerFactory }));



  var thisCodePath = {
    logDebug: function logDebug(id, tags) {
      logToActiveSpan(_objectSpread({ $id: id, level: LOG_LEVEL.debug }, tags));
    },
    logEvent: function logEvent(id, tags) {
      logToActiveSpan(_objectSpread({ $id: id, level: LOG_LEVEL.event }, tags));
    },
    logWarning: function logWarning(id, tags) {
      logToActiveSpan(_objectSpread({ $id: id, level: LOG_LEVEL.warning }, tags));
    },
    logError: function logError(id, tags) {
      logToActiveSpan(_objectSpread({ $id: id, level: LOG_LEVEL.error }, tags));
    },
    logCritical: function logCritical(id, tags) {
      logToActiveSpan(_objectSpread({ $id: id, level: LOG_LEVEL.critical }, tags));
    },
    spanRoot: function spanRoot(id, tags) {
      scopeManager.setActiveSpan(undefined);
      return startSpan(id, tags);
    },
    spanChild: function spanChild(id, tags, parentContext) {
      return startSpan(id, tags, parentContext, opentracing__WEBPACK_IMPORTED_MODULE_1__["REFERENCE_CHILD_OF"]);
    },
    spanFollower: function spanFollower(id, tags, parentContext) {
      return startSpan(id, tags, parentContext, opentracing__WEBPACK_IMPORTED_MODULE_1__["REFERENCE_FOLLOWS_FROM"]);
    },
    finishSpan: function finishSpan(tags) {
      var activeSpan = scopeManager.getActiveSpan();
      if (!activeSpan) {
        throw new Error("Current scope has no active span");
      }
      activeSpan.finish();
      if (!activeSpan.doesNotifyTracerOnFinish) {
        thisCodePath.notifySpanFinished(activeSpan);
      }
    },
    notifySpanFinished: function notifySpanFinished(span) {
      var spanContext = span.context();
      var spanId = spanContext.toSpanId();
      var traceId = spanContext.toTraceId();
      var entry = spanEntries[spanId];
      if (!entry) {
        throw new Error("Trace span not found: id [".concat(spanId, "]"));
      }
      var parentContext =
      entry.options.references &&
      entry.options.references[0].referencedContext();
      if (parentContext && parentContext.toTraceId() === traceId) {
        var parentEntry = spanEntries[parentContext.toSpanId()];
        if (parentEntry) {
          scopeManager.setActiveSpan(parentEntry.span);
        }
      } else {
        scopeManager.setActiveSpan(undefined);
      }
      delete spanEntries[spanId];
    } };


  return {
    input: thisCodePath,
    output: outputStream };

}

/***/ }),

/***/ "./src/codePathModel.js":
/*!******************************!*\
  !*** ./src/codePathModel.js ***!
  \******************************/
/*! exports provided: createCodePathModel, createRootNode, createRegularNode, appendChildNodeToParent, getNodesAsFlatArray, getTopLevelNodesAsArray, walkNodesDepthFirst, walkImmediateSubNodes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCodePathModel", function() { return createCodePathModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRootNode", function() { return createRootNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRegularNode", function() { return createRegularNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appendChildNodeToParent", function() { return appendChildNodeToParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNodesAsFlatArray", function() { return getNodesAsFlatArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTopLevelNodesAsArray", function() { return getTopLevelNodesAsArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "walkNodesDepthFirst", function() { return _walkNodesDepthFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "walkImmediateSubNodes", function() { return walkImmediateSubNodes; });
/* harmony import */ var _multicastDelegate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./multicastDelegate */ "./src/multicastDelegate.js");


function createCodePathModel() {
  var traceNodeMap = createTraceNodeMap();
  var rootNode = createRootNode();
  var subscribers = Object(_multicastDelegate__WEBPACK_IMPORTED_MODULE_0__["createMulticastDelegate"])("CodePathModel.EntriesPublished");

  var nextNodeId = 1;

  var getParentContext = function getParentContext(entry) {
    if (entry.token === "StartSpan") {
      return entry.childOf || entry.followsFrom;
    } else {
      return entry;
    }
  };

  var findParentNode = function findParentNode(entry) {
    var parentContext = getParentContext(entry);
    if (parentContext) {
      var parentNode = traceNodeMap.getSpanNode(
      parentContext.traceId,
      parentContext.spanId);

      if (parentNode) {
        return parentNode;
      }
      console.warn("CODEPATH.MODEL>", "Span node not found", parentContext);
    }
    return rootNode;
  };

  var insertNode = function insertNode(entry) {var
    traceId = entry.traceId,spanId = entry.spanId;
    var parent = findParentNode(entry);
    var newNode = createRegularNode(nextNodeId++, parent, entry);

    appendChildNodeToParent(newNode, parent);
    if (entry.token === "StartSpan") {
      traceNodeMap.setSpanNode(traceId, spanId, newNode);
    }

    return newNode;
  };

  return {
    getRootNode: function getRootNode() {
      return rootNode;
    },
    getNodesFlat: function getNodesFlat() {
      return getNodesAsFlatArray(rootNode);
    },
    getTopLevelNodes: function getTopLevelNodes() {
      return getTopLevelNodesAsArray(rootNode);
    },
    walkNodesDepthFirst: function walkNodesDepthFirst(callback) {
      _walkNodesDepthFirst(rootNode, callback);
    },
    publish: function publish(entries) {
      var insertedNodes = entries.
      filter(
      function (entry) {return entry.token !== "EndSpan" && entry.token !== "StartTracer";}).

      map(insertNode);

      subscribers.invoke(insertedNodes);
    },
    subscribe: function subscribe(callback) {
      subscribers.add(callback);
    },
    unsubscribe: function unsubscribe(callback) {
      subscribers.remove(callback);
    },
    // deleteRow(id) {
    // },
    clearAllRows: function clearAllRows() {} };

}

function createRootNode() {
  return {
    id: 0,
    entry: undefined,
    parent: undefined,
    depth: -1,
    firstChild: undefined,
    lastChild: undefined,
    prevSibling: undefined,
    nextSibling: undefined };

}

function createRegularNode(id, parent, entry) {
  return {
    id: id,
    entry: entry,
    parent: parent,
    depth: parent.depth + 1,
    firstChild: undefined,
    lastChild: undefined,
    prevSibling: undefined,
    nextSibling: undefined };

}

function appendChildNodeToParent(newChild, parent) {
  if (parent.lastChild) {
    newChild.prevSibling = parent.lastChild;
    parent.lastChild.nextSibling = newChild;
  } else {
    parent.firstChild = newChild;
  }
  parent.lastChild = newChild;
}

function getNodesAsFlatArray(rootNode) {
  if (!rootNode) {
    return [];
  }
  var flatNodes = [];
  _walkNodesDepthFirst(rootNode, function (node) {return flatNodes.push(node);});
  return flatNodes;
}

function getTopLevelNodesAsArray(rootNode) {
  var topLevelNodes = [];
  walkImmediateSubNodes(rootNode, function (node) {
    topLevelNodes.push(node);
  });
  return topLevelNodes;
}

function _walkNodesDepthFirst(rootNode, callback) {
  return walkImmediateSubNodes(rootNode, function (node) {
    if (callback(node) === false) {
      return false;
    }
    if (node.firstChild) {
      if (_walkNodesDepthFirst(node, callback) === false) {
        return false;
      }
    }
  });
}

function walkImmediateSubNodes(parentNode, callback) {
  if (parentNode) {
    for (var node = parentNode.firstChild; !!node; node = node.nextSibling) {
      if (callback(node) === false) {
        return false;
      }
    }
  }
}

function createTraceNodeMap() {
  var mapByTraceId = {};

  var getOrAddTraceSpanNodeMap = function getOrAddTraceSpanNodeMap(traceId) {
    var existingMap = mapByTraceId[traceId];
    if (existingMap) {
      return existingMap;
    }

    var newMap = createSpanNodeMap();
    mapByTraceId[traceId] = newMap;
    return newMap;
  };

  return {
    getSpanNode: function getSpanNode(traceId, spanId) {
      var spanNodeMap = getOrAddTraceSpanNodeMap(traceId);
      return spanNodeMap.getSpanNode(spanId);
    },
    setSpanNode: function setSpanNode(traceId, spanId, node) {
      var spanNodeMap = getOrAddTraceSpanNodeMap(traceId);
      return spanNodeMap.setSpanNode(spanId, node);
    } };

}

function createSpanNodeMap() {
  var nodeBySpanId = {};

  return {
    getSpanNode: function getSpanNode(spanId) {
      return nodeBySpanId[spanId];
    },
    setSpanNode: function setSpanNode(spanId, node) {
      nodeBySpanId[spanId] = node;
    } };

}

/***/ }),

/***/ "./src/codePathScopeManager.js":
/*!*************************************!*\
  !*** ./src/codePathScopeManager.js ***!
  \*************************************/
/*! exports provided: trace, createDefaultScopeManager, resetCurrentScope */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trace", function() { return trace; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDefaultScopeManager", function() { return createDefaultScopeManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetCurrentScope", function() { return resetCurrentScope; });
var currentScopeManager = createInternalScopeManager();

function trace(promiseOrFunc) {
  var callerScopeManager = currentScopeManager.clone();

  var originalPromise =
  typeof promiseOrFunc === "function" ? promiseOrFunc() : promiseOrFunc;

  var saveScopeManager = currentScopeManager;
  var wrapperPromise = new Promise(function (resolve, reject) {
    originalPromise.
    then(function (value) {
      currentScopeManager = saveScopeManager;
      resolve(value);
    })["catch"](
    function (err) {
      currentScopeManager = saveScopeManager;
      reject(err);
    });
  });

  currentScopeManager = callerScopeManager;
  return wrapperPromise;
}

function createDefaultScopeManager() {
  return {
    getActiveTracer: function getActiveTracer() {
      return currentScopeManager.getActiveTracer();
    },
    getActiveSpan: function getActiveSpan() {
      return currentScopeManager.getActiveSpan();
    },
    setActiveTracer: function setActiveTracer(tracer) {
      currentScopeManager.setActiveTracer(tracer);
    },
    setActiveSpan: function setActiveSpan(span) {
      currentScopeManager.setActiveSpan(span);
    } };

}

function resetCurrentScope() {
  currentScopeManager = createInternalScopeManager();
}

function createInternalScopeManager(source) {
  var activeTracer = source ? source.getActiveTracer() : undefined;
  var activeSpan = source ? source.getActiveSpan() : undefined;
  var thisScopeManager = {
    getActiveTracer: function getActiveTracer() {
      return activeTracer;
    },
    getActiveSpan: function getActiveSpan() {
      return activeSpan;
    },
    setActiveTracer: function setActiveTracer(tracer) {
      activeTracer = tracer;
    },
    setActiveSpan: function setActiveSpan(span) {
      activeSpan = span;
    },
    clone: function clone() {
      return createInternalScopeManager(thisScopeManager);
    } };

  return thisScopeManager;
}

/***/ }),

/***/ "./src/codePathSearchModel.js":
/*!************************************!*\
  !*** ./src/codePathSearchModel.js ***!
  \************************************/
/*! exports provided: createCodePathSearchModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCodePathSearchModel", function() { return createCodePathSearchModel; });
/* harmony import */ var _codePathModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./codePathModel */ "./src/codePathModel.js");
/* harmony import */ var _multicastDelegate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multicastDelegate */ "./src/multicastDelegate.js");




function createCodePathSearchModel(sourceModel, predicate) {
  var subscribers = Object(_multicastDelegate__WEBPACK_IMPORTED_MODULE_1__["createMulticastDelegate"])(
  "CodePathSearchModel.EntriesPublished");


  var resultNodeById = {};
  var newlyCreatedResultNodes = undefined;

  var resultRootNode = performSearch();
  sourceModel.subscribe(sourceModelSubscriber);

  return {
    getRootNode: function getRootNode() {
      return resultRootNode;
    },
    getNodesFlat: function getNodesFlat() {
      return Object(_codePathModel__WEBPACK_IMPORTED_MODULE_0__["getNodesAsFlatArray"])(resultRootNode);
    },
    getTopLevelNodes: function getTopLevelNodes() {
      return Object(_codePathModel__WEBPACK_IMPORTED_MODULE_0__["getTopLevelNodesAsArray"])(resultRootNode);
    },
    getFirstMatchedNode: function getFirstMatchedNode() {
      var firstMatchedNode = undefined;
      Object(_codePathModel__WEBPACK_IMPORTED_MODULE_0__["walkNodesDepthFirst"])(resultRootNode, function (node) {
        if (node.matched) {
          firstMatchedNode = node;
          return false;
        }
      });
      return firstMatchedNode;
    },
    getNextMatchedNode: function getNextMatchedNode(matchedNode) {
      var currentNode = matchedNode;
      var finishedSubTree = false;

      while (currentNode) {
        if (!finishedSubTree && currentNode.firstChild) {
          currentNode = currentNode.firstChild;
        } else {
          finishedSubTree = false;
          if (currentNode.nextSibling) {
            currentNode = currentNode.nextSibling;
          } else {
            finishedSubTree = true;
            currentNode = currentNode.parent;
          }
        }

        if (!finishedSubTree && currentNode.matched) {
          return currentNode;
        }
      }
    },
    subscribe: function subscribe(callback) {
      subscribers.add(callback);
    },
    unsubscribe: function unsubscribe(callback) {
      subscribers.remove(callback);
    },
    unsubscribeFromSource: function unsubscribeFromSource() {
      sourceModel.unsubscribe(sourceModelSubscriber);
    } };


  function performSearch() {
    var sourceRootNode = sourceModel.getRootNode();
    var resultRootNode = Object(_codePathModel__WEBPACK_IMPORTED_MODULE_0__["createRootNode"])();
    resultNodeById[resultRootNode.id] = resultRootNode;

    depthFirstSearchSubTree(sourceRootNode, function () {return resultRootNode;});

    return resultRootNode;
  }

  function depthFirstSearchSubTree(node, getResultParentNode) {
    var createThisResultNode = function createThisResultNode(matched) {
      return createResultNode(node, matched, getResultParentNode);
    };

    var isRootNode = !node.parent;
    var thisNodeMatched = !isRootNode && predicate(node);
    var thisResultNode = thisNodeMatched ?
    createThisResultNode(true) :
    undefined;

    for (
    var subNode = node.firstChild;
    !!subNode;
    subNode = subNode.nextSibling)
    {
      depthFirstSearchSubTree(subNode, function () {
        if (!thisResultNode) {
          thisResultNode = isRootNode ?
          getResultParentNode() :
          createThisResultNode(false);
        }
        return thisResultNode;
      });
    }
  }

  function createResultNode(sourceNode, matched, getResultParentNode) {
    var resultParentNode = getResultParentNode();
    var resultNode = Object(_codePathModel__WEBPACK_IMPORTED_MODULE_0__["createRegularNode"])(
    sourceNode.id,
    resultParentNode,
    sourceNode.entry);

    resultNodeById[resultNode.id] = resultNode;
    if (newlyCreatedResultNodes) {
      newlyCreatedResultNodes.push(resultNode);
    }
    Object(_codePathModel__WEBPACK_IMPORTED_MODULE_0__["appendChildNodeToParent"])(resultNode, resultParentNode);
    resultNode.matched = matched;
    return resultNode;
  }

  function getOrCreateResultParentNode(sourceChildNode) {
    if (!sourceChildNode.parent) {
      return;
    }
    var existingParent = resultNodeById[sourceChildNode.parent.id];
    if (existingParent) {
      return existingParent;
    }
    return createResultNode(sourceChildNode.parent, false, function () {return (
        getOrCreateResultParentNode(sourceChildNode.parent));});

  }

  function sourceModelSubscriber(insertedNodes) {
    newlyCreatedResultNodes = [];
    var matchingNodes = insertedNodes.filter(predicate);

    matchingNodes.forEach(function (sourceNode) {
      var getParentNode = function getParentNode() {
        return getOrCreateResultParentNode(sourceNode);
      };
      createResultNode(sourceNode, true, getParentNode);
    });

    if (newlyCreatedResultNodes.length > 0) {
      subscribers.invoke(newlyCreatedResultNodes);
    }
    newlyCreatedResultNodes = undefined;
  }
}

/***/ }),

/***/ "./src/codePathStream.js":
/*!*******************************!*\
  !*** ./src/codePathStream.js ***!
  \*******************************/
/*! exports provided: createCodePathStream */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCodePathStream", function() { return createCodePathStream; });
/* harmony import */ var opentracing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing */ "./node_modules/opentracing/lib/index.js");
/* harmony import */ var opentracing__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(opentracing__WEBPACK_IMPORTED_MODULE_0__);


function createCodePathStream(options) {
  var entries = [];
  var isEnabled = options ? !!options.enabled : true;

  return {
    writeStartTracer: function writeStartTracer(time, traceId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time: time,
        token: "StartTracer",
        traceId: traceId,
        tags: tags || {} });

    },
    writeStartSpan: function writeStartSpan(time, traceId, spanId, messageId, references, tags) {
      if (!isEnabled) {
        return;
      }var
      childOf = references.childOf,followsFrom = references.followsFrom;
      entries.push({
        time: time,
        token: "StartSpan",
        traceId: traceId,
        spanId: spanId,
        childOf: childOf,
        followsFrom: followsFrom,
        messageId: messageId,
        tags: tags || {} });

    },
    writeEndSpan: function writeEndSpan(time, traceId, spanId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time: time,
        token: "EndSpan",
        traceId: traceId,
        spanId: spanId,
        tags: tags || {} });

    },
    writeLog: function writeLog(time, traceId, spanId, messageId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time: time,
        token: "Log",
        traceId: traceId,
        spanId: spanId,
        messageId: messageId,
        tags: tags || {} });

    },
    writeSpanTags: function writeSpanTags(time, traceId, spanId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time: time,
        token: "SpanTags",
        traceId: traceId,
        spanId: spanId,
        tags: tags || {} });

    },
    enable: function enable(value) {
      var effectiveValue = typeof value === "undefined" ? true : !!value;
      isEnabled = effectiveValue;
    },
    peekEntries: function peekEntries() {
      return entries;
    },
    takeEntries: function takeEntries() {
      var copyOfEntries = entries;
      entries = [];
      return copyOfEntries;
    } };

}

/***/ }),

/***/ "./src/codePathTracer.js":
/*!*******************************!*\
  !*** ./src/codePathTracer.js ***!
  \*******************************/
/*! exports provided: createCodePathTracer, contextToPlain, plainToContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCodePathTracer", function() { return createCodePathTracer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "contextToPlain", function() { return contextToPlain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "plainToContext", function() { return plainToContext; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var opentracing__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! opentracing */ "./node_modules/opentracing/lib/index.js");
/* harmony import */ var opentracing__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(opentracing__WEBPACK_IMPORTED_MODULE_7__);


function createCodePathTracer(traceId, stream, options) {
  return new CodePathTracer(traceId, stream, options);
}var

CodePathTracer = /*#__PURE__*/function (_Tracer) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(CodePathTracer, _Tracer);






  function CodePathTracer(traceId, stream, options) {var _this;_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, CodePathTracer);
    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(CodePathTracer).call(this));_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "_traceId", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "_clock", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "_scopeManager", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "_stream", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "_nextSpanId", void 0);
    _this._traceId = traceId;
    _this._nextSpanId = 1;
    _this._clock = options.clock;
    _this._scopeManager = options.scopeManager;
    _this._stream = stream;

    stream.writeStartTracer(options.clock.now(), traceId);return _this;
  }

  // NOTE: the input to this method is *always* an associative array. The
  // public-facing startSpan() method normalizes the arguments so that
  // all N implementations do not need to worry about variations in the call
  // signature.
  //
  // The default behavior returns a no-op span.
  // protected _startSpan(name: string, fields: SpanOptions): Span {
  //   return Noop.span!;
  // }
  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(CodePathTracer, [{ key: "_startSpan", value: function _startSpan(name, options) {
      return new CodePathSpan(
      this,
      this._clock,
      this._stream,
      this._nextSpanId++,
      name,
      options);

    }

    // The default behavior is a no-op.
    // protected _inject(spanContext: SpanContext, format: string, carrier: any): void {
    // }
  }, { key: "_inject", value: function _inject(spanContext, format, carrier) {}

    // The default behavior is to return a no-op SpanContext.
    // protected _extract(format: string, carrier: any): SpanContext | null {
    //   return Noop.spanContext!;
    // }
  }, { key: "_extract", value: function _extract(format, carrier) {
      return new CodePathSpanContext("", "");
    } }, { key: "getTraceId", value: function getTraceId()

    {
      return this._traceId;
    } }, { key: "getCurrentTime", value: function getCurrentTime()

    {
      return this._clock.now();
    } }]);return CodePathTracer;}(opentracing__WEBPACK_IMPORTED_MODULE_7__["Tracer"]);var


CodePathSpan = /*#__PURE__*/function (_Span) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(CodePathSpan, _Span);




  // _childOfContext;
  // _followsFromContext;
  // _operationName;
  // _startTime;
  // _endTime;
  // _baggageItems;
  // _tags;
  // _logs;

  function CodePathSpan(tracer, clock, stream, spanId, name, options) {var _this2;_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, CodePathSpan);
    _this2 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(CodePathSpan).call(this));_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this2), "_tracer", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this2), "_clock", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this2), "_stream", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this2), "_selfContext", void 0);

    var traceId = tracer.getTraceId();

    _this2._tracer = tracer;
    _this2._clock = clock;
    _this2._stream = stream;
    _this2._selfContext = new CodePathSpanContext(traceId, spanId);

    var startTime = options && options.startTime || clock.now();var _findReferences =
    findReferences(options),childOf = _findReferences.childOf,followsFrom = _findReferences.followsFrom;

    stream.writeStartSpan(
    startTime,
    traceId,
    spanId,
    name,
    {
      childOf: contextToPlain(childOf),
      followsFrom: contextToPlain(followsFrom) },

    options.tags);


    // this._operationName = name;
    // this._startTime = (options && options.startTime) || tracer.getCurrentTime();
    // this._endTime = undefined;
    // this._baggageItems = {};
    // this._tags = (options && options.tags) || {};
    // this._logs = [];
    return _this2;}

  // getData() {
  //   return {
  //     context: contextToPlain(this._selfContext),
  //     childOf: contextToPlain(this._childOfContext),
  //     followsFrom: contextToPlain(this._followsFromContext),
  //     operationName: this._operationName,
  //     startTime: this._startTime,
  //     endTime: this._endTime,
  //     baggageItems: this._baggageItems,
  //     tags: this._tags,
  //     logs: this._logs
  //   };
  // }

  // By default returns a no-op SpanContext.
  // protected _context(): SpanContext {
  //     return noop.spanContext!;
  // }
  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(CodePathSpan, [{ key: "_context", value: function _context() {
      return this._selfContext;
    }

    // By default returns a no-op tracer.
    //
    // The base class could store the tracer that created it, but it does not
    // in order to ensure the no-op span implementation has zero members,
    // which allows V8 to aggressively optimize calls to such objects.
    // protected _tracer(): Tracer {
    //     return noop.tracer!;
    // }
  }, { key: "_tracer", value: function _tracer() {
      return this._tracer;
    }

    // By default does nothing
    // protected _setOperationName(name: string): void {
    // }
  }, { key: "_setOperationName", value: function _setOperationName(name) {
      throw new Error("Not supported: setOperationName");
      //this._operationName = name;
    }

    // By default does nothing
    // protected _setBaggageItem(key: string, value: string): void {
    // }
  }, { key: "_setBaggageItem", value: function _setBaggageItem(key, value) {
      throw new Error("Not supported: setBaggageItem");
      //this._baggageItems[key] = value;
    }

    // By default does nothing
    // protected _getBaggageItem(key: string): string | undefined {
    //     return undefined;
    // }
  }, { key: "_getBaggageItem", value: function _getBaggageItem(key) {
      return undefined;
      //return this._baggageItems[key];
    }

    // By default does nothing
    //
    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
    // will always be an associative array.
    // protected _addTags(keyValuePairs: { [key: string]: any }): void {
    // }
  }, { key: "_addTags", value: function _addTags(keyValuePairs) {var _contextToPlain =
      contextToPlain(this._selfContext),traceId = _contextToPlain.traceId,spanId = _contextToPlain.spanId;
      this._stream.writeSpanTags(
      this._clock.now(),
      traceId,
      spanId,
      keyValuePairs);

      // this._tags = {
      //   ...this._tags,
      //   ...keyValuePairs
      // };
    }

    // By default does nothing
    // protected _log(keyValuePairs: { [key: string]: any }, timestamp?: number): void {
    // }
  }, { key: "_log", value: function _log(keyValuePairs, timestamp) {
      var time = timestamp || this._clock.now();var _contextToPlain2 =
      contextToPlain(this._selfContext),traceId = _contextToPlain2.traceId,spanId = _contextToPlain2.spanId;
      this._stream.writeLog(
      time,
      traceId,
      spanId,
      keyValuePairs.$id,
      keyValuePairs);

      // const logEntry = {
      //   ...(keyValuePairs || {}),
      //   $time: timestamp || this._tracer.getCurrentTime()
      // };
      // this._logs.push(logEntry);
    }

    // By default does nothing
    //
    // finishTime is expected to be either a number or undefined.
    // protected _finish(finishTime?: number): void {
    // }
  }, { key: "_finish", value: function _finish(finishTime) {
      var effectiveFinishTime = finishTime || this._clock.now();var _contextToPlain3 =
      contextToPlain(this._selfContext),traceId = _contextToPlain3.traceId,spanId = _contextToPlain3.spanId;
      this._stream.writeEndSpan(effectiveFinishTime, traceId, spanId);

      // if (this._endTime) {
      //   throw new Error("Invalid operation: span already finished");
      // }
      // this._endTime = finishTime || this._tracer.getCurrentTime();
    } }]);return CodePathSpan;}(opentracing__WEBPACK_IMPORTED_MODULE_7__["Span"]);var


CodePathSpanContext = /*#__PURE__*/function (_SpanContext) {_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(CodePathSpanContext, _SpanContext);



  function CodePathSpanContext(traceId, spanId) {var _this3;_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, CodePathSpanContext);
    _this3 = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(CodePathSpanContext).call(this));_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this3), "_traceId", void 0);_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this3), "_spanId", void 0);
    _this3._traceId = traceId;
    _this3._spanId = spanId;return _this3;
  }

  /**
     * Returns a string representation of the implementation internal trace ID.
     *
     * @returns {string}
     */_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(CodePathSpanContext, [{ key: "toTraceId", value: function toTraceId()
    {
      return this._traceId;
    }

    /**
       * Returns a string representation of the implementation internal span ID.
       *
       * @returns {string}
       */ }, { key: "toSpanId", value: function toSpanId()
    {
      return this._spanId;
    } }]);return CodePathSpanContext;}(opentracing__WEBPACK_IMPORTED_MODULE_7__["SpanContext"]);


function findReferences(options) {
  var childOf = undefined;
  var followsFrom = undefined;

  options &&
  options.references &&
  options.references.forEach(function (ref) {
    switch (ref.type()) {
      case opentracing__WEBPACK_IMPORTED_MODULE_7__["REFERENCE_CHILD_OF"]:
        childOf = ref.referencedContext();
        break;
      case opentracing__WEBPACK_IMPORTED_MODULE_7__["REFERENCE_FOLLOWS_FROM"]:
        followsFrom = ref.referencedContext();
        break;}

  });

  return {
    childOf: childOf,
    followsFrom: followsFrom };

}

function contextToPlain(context) {
  if (context) {
    return {
      traceId: context.toTraceId(),
      spanId: context.toSpanId() };

  }
}

function plainToContext(_ref) {var traceId = _ref.traceId,spanId = _ref.spanId;
  return new CodePathSpanContext(traceId, spanId);
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: createCodePath, createDefaultScopeManager, trace, getCurrentScope, resetCurrentScope, createCodePathStream, createCodePathTracer, contextToPlain, plainToContext, createCodePathModel, walkNodesDepthFirst, walkImmediateSubNodes, createCodePathSearchModel, createTreeGridController, createTreeGridView, createMulticastDelegate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _codePath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./codePath */ "./src/codePath.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createCodePath", function() { return _codePath__WEBPACK_IMPORTED_MODULE_0__["createCodePath"]; });

/* harmony import */ var _codePathScopeManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./codePathScopeManager */ "./src/codePathScopeManager.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createDefaultScopeManager", function() { return _codePathScopeManager__WEBPACK_IMPORTED_MODULE_1__["createDefaultScopeManager"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "trace", function() { return _codePathScopeManager__WEBPACK_IMPORTED_MODULE_1__["trace"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentScope", function() { return _codePathScopeManager__WEBPACK_IMPORTED_MODULE_1__["getCurrentScope"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resetCurrentScope", function() { return _codePathScopeManager__WEBPACK_IMPORTED_MODULE_1__["resetCurrentScope"]; });

/* harmony import */ var _codePathStream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./codePathStream */ "./src/codePathStream.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createCodePathStream", function() { return _codePathStream__WEBPACK_IMPORTED_MODULE_2__["createCodePathStream"]; });

/* harmony import */ var _codePathTracer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./codePathTracer */ "./src/codePathTracer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createCodePathTracer", function() { return _codePathTracer__WEBPACK_IMPORTED_MODULE_3__["createCodePathTracer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "contextToPlain", function() { return _codePathTracer__WEBPACK_IMPORTED_MODULE_3__["contextToPlain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "plainToContext", function() { return _codePathTracer__WEBPACK_IMPORTED_MODULE_3__["plainToContext"]; });

/* harmony import */ var _codePathModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./codePathModel */ "./src/codePathModel.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createCodePathModel", function() { return _codePathModel__WEBPACK_IMPORTED_MODULE_4__["createCodePathModel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "walkNodesDepthFirst", function() { return _codePathModel__WEBPACK_IMPORTED_MODULE_4__["walkNodesDepthFirst"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "walkImmediateSubNodes", function() { return _codePathModel__WEBPACK_IMPORTED_MODULE_4__["walkImmediateSubNodes"]; });

/* harmony import */ var _codePathSearchModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./codePathSearchModel */ "./src/codePathSearchModel.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createCodePathSearchModel", function() { return _codePathSearchModel__WEBPACK_IMPORTED_MODULE_5__["createCodePathSearchModel"]; });

/* harmony import */ var _treeGrid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./treeGrid */ "./src/treeGrid.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTreeGridController", function() { return _treeGrid__WEBPACK_IMPORTED_MODULE_6__["createTreeGridController"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTreeGridView", function() { return _treeGrid__WEBPACK_IMPORTED_MODULE_6__["createTreeGridView"]; });

/* harmony import */ var _multicastDelegate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./multicastDelegate */ "./src/multicastDelegate.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createMulticastDelegate", function() { return _multicastDelegate__WEBPACK_IMPORTED_MODULE_7__["createMulticastDelegate"]; });










/***/ }),

/***/ "./src/multicastDelegate.js":
/*!**********************************!*\
  !*** ./src/multicastDelegate.js ***!
  \**********************************/
/*! exports provided: createMulticastDelegate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMulticastDelegate", function() { return createMulticastDelegate; });
function createMulticastDelegate(eventName) {
  var subscribers = [];

  var delegate = {
    add: function add(subscriber) {
      delegate.remove(subscriber);
      subscribers.push(subscriber);
    },
    remove: function remove(subscriber) {
      subscribers = subscribers.filter(function (s) {return s !== subscriber;});
    },
    invoke: function invoke() {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      subscribers.forEach(function (subscriber) {
        try {
          subscriber.apply(void 0, args);
        } catch (e) {
          console.log("Event [".concat(eventName, "] invocation failed!"), e);
        }
      });
    } };


  return delegate;
}

/***/ }),

/***/ "./src/treeGrid.js":
/*!*************************!*\
  !*** ./src/treeGrid.js ***!
  \*************************/
/*! exports provided: createTreeGridController, createTreeGridView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTreeGridController", function() { return createTreeGridController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTreeGridView", function() { return createTreeGridView; });
/* harmony import */ var _multicastDelegate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./multicastDelegate */ "./src/multicastDelegate.js");


function createTreeGridController(view, model) {
  var rowById = {};
  var masterIndexVersion = 1;

  var controller = {
    getNodeById: function getNodeById(id) {
      var row = rowById[id];
      if (row) {
        return row.getNode();
      }
    },
    toggle: function toggle(id) {
      return rowById[id].toggle();
    },
    expand: function expand(id) {
      rowById[id].expand();
    },
    collapse: function collapse(id) {
      rowById[id].collapse();
    },
    selectNode: function selectNode(node) {
      controller.expandToNode(node);
      var nodeRow = rowById[node.id];
      var nodeRowIndex = nodeRow.findAbsoluteIndex();
      view.selectNode(nodeRowIndex, node);
    },
    expandToNode: function expandToNode(node) {
      if (!rowById[node.id]) {
        controller.expandToNode(node.parent);
        controller.expand(node.parent.id);
      }
    },
    getIsExpanded: function getIsExpanded(id) {
      return rowById[id].getIsExpanded();
    },
    getIsVisible: function getIsVisible(id) {
      return rowById[id].getIsVisible();
    },
    replaceModel: function replaceModel(newModel) {
      model.unsubscribe(subscriber);
      model = newModel;
      initWithCurrentModel();
    },
    clearAll: function clearAll() {
      rowById = {};
      masterIndexVersion = 1;
      initRootNode();
      view.clearAll();
    },
    onNodeSelected: function onNodeSelected(callback) {
      view.onNodeSelected(callback);
    } };


  view.attachController(controller);
  initWithCurrentModel();
  return controller;

  function initWithCurrentModel() {
    controller.clearAll();
    subscriber(model.getTopLevelNodes());
    model.subscribe(subscriber);
  }

  function createSubNodesRowControllers(subNodes) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
      for (var _iterator = subNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var node = _step.value;
        var row = createRowController(node);
        rowById[node.id] = row;
      }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  }

  function createRowController(node) {
    var isExpanded = false;
    var subTreeHeight = 0;
    var cachedAbsoluteIndex = undefined;
    var cachedIndexVersion = masterIndexVersion;

    var getNode = function getNode() {
      return node;
    };
    var getParent = function getParent() {
      return rowById[node.parent.id];
    };
    var getPrevSibling = function getPrevSibling() {
      return node.prevSibling ? rowById[node.prevSibling.id] : undefined;
    };
    var getNextSibling = function getNextSibling() {
      return node.nextSibling ? rowById[node.nextSibling.id] : undefined;
    };
    var getFirstChild = function getFirstChild() {
      return node.firstChild ? rowById[node.firstChild.id] : undefined;
    };
    var getIsExpanded = function getIsExpanded() {
      return isExpanded;
    };
    var getIsVisible = function getIsVisible() {
      var parent = getParent();
      return parent.getIsVisible() && parent.getIsExpanded();
    };
    var getSubTreeHeight = function getSubTreeHeight() {
      return subTreeHeight;
    };
    var updateSubTreeHeight = function updateSubTreeHeight(delta) {
      subTreeHeight += delta;
      cachedIndexVersion = masterIndexVersion;
      getParent().updateSubTreeHeight(delta);
    };
    var getIndexVersion = function getIndexVersion() {
      return masterIndexVersion;
    };
    var isCachedAbsoluteIndexValid = function isCachedAbsoluteIndexValid() {
      return !!cachedAbsoluteIndex && cachedIndexVersion === masterIndexVersion;
    };
    var findAbsoluteIndex = function findAbsoluteIndex() {
      if (!isCachedAbsoluteIndexValid()) {
        var indexRelativeToParent = 0;
        for (
        var sibling = getPrevSibling();
        !!sibling;
        sibling = sibling.getPrevSibling())
        {
          indexRelativeToParent += 1 + sibling.getSubTreeHeight();
        }
        var parentAbsoluteIndex = getParent().findAbsoluteIndex();
        cachedAbsoluteIndex = parentAbsoluteIndex + indexRelativeToParent + 1;
        cachedIndexVersion = masterIndexVersion;
      }
      return cachedAbsoluteIndex;
    };
    var showSubNodes = function showSubNodes(subNodes) {
      if (!getIsVisible() || !getIsExpanded()) {
        return;
      }
      var thisRowIndex = findAbsoluteIndex();
      createSubNodesRowControllers(subNodes);
      view.insertNodes(thisRowIndex + subTreeHeight + 1, subNodes);
      masterIndexVersion++;
      updateSubTreeHeight(+subNodes.length);
      view.updateNode(thisRowIndex, node);
    };
    var hideSubNodes = function hideSubNodes() {
      if (!getIsVisible() || subTreeHeight === 0) {
        return;
      }
      var thisRowIndex = findAbsoluteIndex();
      view.removeNodes(thisRowIndex + 1, subTreeHeight);
      masterIndexVersion++;
      updateSubTreeHeight(-subTreeHeight);
      view.updateNode(thisRowIndex, node);
    };
    var toggle = function toggle() {
      if (isExpanded) {
        collapse();
      } else {
        expand();
      }
      return {
        isExpanded: isExpanded };

    };
    var expand = function expand() {
      if (isExpanded || !node.firstChild) {
        return;
      }
      var subNodes = [];
      for (
      var subNode = node.firstChild;
      !!subNode;
      subNode = subNode.nextSibling)
      {
        subNodes.push(subNode);
      }
      isExpanded = true;
      showSubNodes(subNodes);
    };
    var collapse = function collapse() {
      isExpanded = false;
      hideSubNodes();
    };

    return {
      getNode: getNode,
      getParent: getParent,
      getPrevSibling: getPrevSibling,
      getNextSibling: getNextSibling,
      getFirstChild: getFirstChild,
      getIsExpanded: getIsExpanded,
      getIsVisible: getIsVisible,
      getSubTreeHeight: getSubTreeHeight,
      updateSubTreeHeight: updateSubTreeHeight,
      getIndexVersion: getIndexVersion,
      findAbsoluteIndex: findAbsoluteIndex,
      toggle: toggle,
      expand: expand,
      collapse: collapse,
      showSubNodes: showSubNodes };

  }

  function createRootNodeController(rootNode) {
    var subTreeHeight = 0;
    var noop = function noop() {};

    return {
      getNode: function getNode() {return rootNode;},
      getParent: noop,
      getPrevSibling: noop,
      getNextSibling: noop,
      getFirstChild: noop,
      getIsExpanded: function getIsExpanded() {return true;},
      getIsVisible: function getIsVisible() {return true;},
      getSubTreeHeight: function getSubTreeHeight() {return subTreeHeight;},
      updateSubTreeHeight: function updateSubTreeHeight(delta) {
        subTreeHeight += delta;
      },
      getIndexVersion: function getIndexVersion() {return masterIndexVersion;},
      findAbsoluteIndex: function findAbsoluteIndex() {return -1;},
      toggle: noop,
      expand: noop,
      collapse: noop,
      showSubNodes: function showSubNodes(subNodes) {
        createSubNodesRowControllers(subNodes);
        view.insertNodes(subTreeHeight, subNodes);
        subTreeHeight += subNodes.length;
      } };

  }

  function subscriber(insertedNodes) {
    var currentGroup = undefined;

    for (var i = 0; i < insertedNodes.length; i++) {
      var parentId = insertedNodes[i].parent.id;
      var parentRow = rowById[parentId];
      if (!currentGroup || currentGroup.parentId !== parentId) {
        beginNewGroup(i);
      }
    }

    endCurrentGroup(insertedNodes.length);

    function beginNewGroup(index) {
      endCurrentGroup(index);
      currentGroup = {
        parentId: insertedNodes[index].parent.id,
        startIndex: index };

    }

    function endCurrentGroup(index) {
      if (currentGroup && currentGroup.startIndex < index) {
        var _parentRow = rowById[currentGroup.parentId];
        if (_parentRow) {
          var nodesInGroup = insertedNodes.slice(
          currentGroup.startIndex,
          index);

          _parentRow.showSubNodes(nodesInGroup);
        }
      }
    }
  }

  function initRootNode() {
    var rootNode = model.getRootNode();
    rowById[rootNode.id] = createRootNodeController(rootNode);
  }
}

function createTreeGridView(table, columns) {
  var nodeSelectedCallbacks = Object(_multicastDelegate__WEBPACK_IMPORTED_MODULE_0__["createMulticastDelegate"])(
  "TreeGridView.NodeSelected");

  var keyPressedCallbacks = Object(_multicastDelegate__WEBPACK_IMPORTED_MODULE_0__["createMulticastDelegate"])(
  "TreeGridView.KeyPressed");


  table.onkeydown = function (e) {
    if (handleTableKeyboardEvent(e) === true) {
      e.stopPropagation();
      return false;
    }
  };

  var tbody = document.createElement("tbody");
  table.appendChild(tbody);

  var controller = undefined;
  var selectedTr = undefined;

  var stringToTextNode = function stringToTextNode(element) {
    if (typeof element === "string") {
      return document.createTextNode(element);
    }
    return element;
  };

  var renderCell = function renderCell(node, rowIndex, colIndex, tr, td) {
    var tdContents = columns[colIndex].renderCell(node, controller, rowIndex);
    tdContents.
    filter(function (htmlNode) {return !!htmlNode;}).
    map(stringToTextNode).
    forEach(function (htmlNode) {return td.appendChild(htmlNode);});
  };

  var attachController = function attachController(theController) {
    controller = theController;
  };

  var updateNode = function updateNode(index, node) {
    var tr = tbody.rows[index];
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var td = tr.cells[colIndex];
      td.innerHTML = "";
      renderCell(node, index, colIndex, tr, td);
    }
  };

  var selectNode = function selectNode(index, node) {
    if (selectedTr) {
      selectedTr.classList.remove("selected");
    }
    selectedTr = undefined;
    if (typeof index === "number" && index >= 0) {
      selectedTr = tbody.rows[index];
      selectedTr.classList.add("selected");
      nodeSelectedCallbacks.invoke(node);
      selectedTr.scrollIntoViewIfNeeded(); //TODO
    }
  };

  var insertNodes = function insertNodes(index, nodes) {var _loop = function _loop(
    i) {
      var rowIndex = index + i;
      var tr = tbody.insertRow(index + i);
      tr.setAttribute("data-nid", nodes[i].id);
      tr.onclick = function () {
        selectNode(tr.rowIndex - 1, nodes[i]);
      };
      for (var colIndex = 0; colIndex < columns.length; colIndex++) {
        var td = tr.insertCell(colIndex);
        renderCell(nodes[i], rowIndex, colIndex, tr, td);
      }};for (var i = 0; i < nodes.length; i++) {_loop(i);
    }
  };

  var removeNodes = function removeNodes(index, count) {
    if (
    selectedTr &&
    selectedTr.rowIndex - 1 >= index &&
    selectedTr.rowIndex - 1 < index + count)
    {
      selectedTr = undefined;
      nodeSelectedCallbacks.invoke(undefined);
    }
    for (var i = count - 1; i >= 0; i--) {
      tbody.deleteRow(index + i);
    }
  };

  var clearAll = function clearAll() {
    var newTbody = document.createElement("tbody");
    table.replaceChild(newTbody, tbody);
    tbody = newTbody;
    selectNode();
  };

  var onNodeSelected = function onNodeSelected(callback) {
    nodeSelectedCallbacks.add(callback);
  };

  var onKeyPressed = function onKeyPressed(callback) {
    keyPressedCallbacks.add(callback);
  };

  return {
    attachController: attachController,
    updateNode: updateNode,
    insertNodes: insertNodes,
    removeNodes: removeNodes,
    selectNode: selectNode,
    clearAll: clearAll,
    onNodeSelected: onNodeSelected,
    onKeyPressed: onKeyPressed };


  function handleTableKeyboardEvent(e) {
    if (e.ctrlKey || e.shiftKey || e.altKey) {
      return false;
    }

    if (!selectedTr) {
      if (tbody.rows.length > 0) {
        selectNode(0, getTrNode(tbody.rows[0]));
      }
      return true;
    }

    var selectedNodeId = getTrNodeId(selectedTr);

    switch (e.key) {
      case "ArrowLeft":
        if (controller.getIsExpanded(selectedNodeId)) {
          controller.collapse(selectedNodeId);
          return true;
        }
        break;
      case "ArrowRight":
        if (!controller.getIsExpanded(selectedNodeId)) {
          controller.expand(selectedNodeId);
          return true;
        }
        break;}


    var trToGo = getTrToGo(e.key);
    if (trToGo) {
      selectNode(getTrIndex(trToGo), getTrNode(trToGo));
      return true;
    }

    return false;
  }

  function getTrToGo(keyCode) {
    switch (keyCode) {
      case "ArrowUp":
        if (getTrIndex(selectedTr) > 0) {
          return tbody.rows[getTrIndex(selectedTr) - 1];
        }
        break;
      case "ArrowDown":
        if (getTrIndex(selectedTr) < tbody.rows.length - 1) {
          return tbody.rows[getTrIndex(selectedTr) + 1];
        }
        break;
      case "ArrowLeft":
        return findParentTr(selectedTr);
      case "ArrowRight":
        return findExpandableChildTr(selectedTr);}

  }

  function getTrIndex(tr) {
    return tr.sectionRowIndex;
  }

  function getTrNodeId(tr) {
    var nodeId = parseInt(tr.getAttribute("data-nid"));
    return !isNaN(nodeId) ? nodeId : undefined;
  }

  function getTrNode(tr) {
    var nodeId = getTrNodeId(tr);
    if (nodeId) {
      return controller.getNodeById(nodeId);
    }
  }

  function findParentTr(childTr) {
    var childNode = getTrNode(childTr);
    var parentNodeId = childNode.parent.id;
    if (parentNodeId) {
      for (var index = getTrIndex(childTr) - 1; index >= 0; index--) {
        var tr = tbody.rows[index];
        if (getTrNodeId(tr) === parentNodeId) {
          return tr;
        }
      }
    }
  }

  function findExpandableChildTr(parentTr) {
    var parentNode = getTrNode(parentTr);
    for (
    var index = getTrIndex(parentTr) + 1;
    index < tbody.rows.length;
    index++)
    {
      var childTr = tbody.rows[index];
      var childNode = getTrNode(childTr);
      if (childNode.parent !== parentNode) {
        break;
      }
      if (childNode.firstChild) {
        return childTr;
      }
    }
  }
}

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map