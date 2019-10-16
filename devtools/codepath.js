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
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.CodePath=e():t.CodePath=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=29)}([function(t,e){t.exports=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}},function(t,e,n){"use strict";function r(t){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n])}Object.defineProperty(e,"__esModule",{value:!0});var o=n(19);e.BinaryCarrier=o.default;var i=n(20);e.Tags=i;var a=n(10),u=n(15);e.Reference=u.default;var c=n(3);e.Span=c.default;var s=n(12);e.SpanContext=s.default;var f=n(11);e.Tracer=f.Tracer;var d=n(21);e.MockTracer=d.MockTracer,r(n(24)),r(n(14)),r(n(13)),a.initialize()},function(t,e){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(10),o=function(){function t(){}return t.prototype.context=function(){return this._context()},t.prototype.tracer=function(){return this._tracer()},t.prototype.setOperationName=function(t){return this._setOperationName(t),this},t.prototype.setBaggageItem=function(t,e){return this._setBaggageItem(t,e),this},t.prototype.getBaggageItem=function(t){return this._getBaggageItem(t)},t.prototype.setTag=function(t,e){var n;return this._addTags(((n={})[t]=e,n)),this},t.prototype.addTags=function(t){return this._addTags(t),this},t.prototype.log=function(t,e){return this._log(t,e),this},t.prototype.logEvent=function(t,e){return this._log({event:t,payload:e})},t.prototype.finish=function(t){this._finish(t)},t.prototype._context=function(){return r.spanContext},t.prototype._tracer=function(){return r.tracer},t.prototype._setOperationName=function(t){},t.prototype._setBaggageItem=function(t,e){},t.prototype._getBaggageItem=function(t){},t.prototype._addTags=function(t){},t.prototype._log=function(t,e){},t.prototype._finish=function(t){},t}();e.Span=o,e.default=o},function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(e){return"function"==typeof Symbol&&"symbol"===n(Symbol.iterator)?t.exports=r=function(t){return n(t)}:t.exports=r=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)},r(e)}t.exports=r},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}t.exports=function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}},function(t,e,n){var r=n(4),o=n(2);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?o(t):e}},function(t,e){function n(e){return t.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(e)}t.exports=n},function(t,e,n){var r=n(25);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(3),o=n(12),i=n(11);e.tracer=null,e.spanContext=null,e.span=null,e.initialize=function(){e.tracer=new i.default,e.span=new r.default,e.spanContext=new o.default}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(13),o=n(10),i=n(3),a=function(){function t(){}return t.prototype.startSpan=function(t,e){if(void 0===e&&(e={}),e.childOf){var n=r.childOf(e.childOf);e.references?e.references.push(n):e.references=[n],delete e.childOf}return this._startSpan(t,e)},t.prototype.inject=function(t,e,n){return t instanceof i.default&&(t=t.context()),this._inject(t,e,n)},t.prototype.extract=function(t,e){return this._extract(t,e)},t.prototype._startSpan=function(t,e){return o.span},t.prototype._inject=function(t,e,n){},t.prototype._extract=function(t,e){return o.spanContext},t}();e.Tracer=a,e.default=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(){}return t.prototype.toTraceId=function(){return""},t.prototype.toSpanId=function(){return""},t}();e.SpanContext=r,e.default=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(14),o=n(15),i=n(3);e.childOf=function(t){return t instanceof i.default&&(t=t.context()),new o.default(r.REFERENCE_CHILD_OF,t)},e.followsFrom=function(t){return t instanceof i.default&&(t=t.context()),new o.default(r.REFERENCE_FOLLOWS_FROM,t)}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.FORMAT_BINARY="binary",e.FORMAT_TEXT_MAP="text_map",e.FORMAT_HTTP_HEADERS="http_headers",e.REFERENCE_CHILD_OF="child_of",e.REFERENCE_FOLLOWS_FROM="follows_from"},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(3),o=function(){function t(t,e){this._type=t,this._referencedContext=e instanceof r.default?e.context():e}return t.prototype.type=function(){return this._type},t.prototype.referencedContext=function(){return this._referencedContext},t}();e.default=o},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(e){var n=t.call(this)||this;return n._span=e,n}return o(e,t),e.prototype.span=function(){return this._span},e}(n(1).SpanContext);e.MockContext=i,e.default=i},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),a=n(16),u=function(t){function e(e){var n=t.call(this)||this;return n._mockTracer=e,n._uuid=n._generateUUID(),n._startMs=Date.now(),n._finishMs=0,n._operationName="",n._tags={},n._logs=[],n}return o(e,t),e.prototype._context=function(){return new a.default(this)},e.prototype._setOperationName=function(t){this._operationName=t},e.prototype._addTags=function(t){for(var e=0,n=Object.keys(t);e<n.length;e++){var r=n[e];this._tags[r]=t[r]}},e.prototype._log=function(t,e){this._logs.push({fields:t,timestamp:e})},e.prototype._finish=function(t){this._finishMs=t||Date.now()},e.prototype.uuid=function(){return this._uuid},e.prototype.operationName=function(){return this._operationName},e.prototype.durationMs=function(){return this._finishMs-this._startMs},e.prototype.tags=function(){return this._tags},e.prototype.tracer=function(){return this._mockTracer},e.prototype._generateUUID=function(){return""+("00000000"+Math.abs(4294967295*Math.random()|0).toString(16)).substr(-8)+("00000000"+Math.abs(4294967295*Math.random()|0).toString(16)).substr(-8)},e.prototype.addReference=function(t){},e.prototype.debug=function(){var t={uuid:this._uuid,operation:this._operationName,millis:[this._finishMs-this._startMs,this._startMs,this._finishMs]};return Object.keys(this._tags).length&&(t.tags=this._tags),t},e}(i.Span);e.MockSpan=u,e.default=u},function(t,e,n){var r=n(26),o=n(27),i=n(28);t.exports=function(t){return r(t)||o(t)||i()}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(t){this.buffer=t};e.default=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SPAN_KIND="span.kind",e.SPAN_KIND_RPC_CLIENT="client",e.SPAN_KIND_RPC_SERVER="server",e.SPAN_KIND_MESSAGING_PRODUCER="producer",e.SPAN_KIND_MESSAGING_CONSUMER="consumer",e.ERROR="error",e.COMPONENT="component",e.SAMPLING_PRIORITY="sampling.priority",e.PEER_SERVICE="peer.service",e.PEER_HOSTNAME="peer.hostname",e.PEER_ADDRESS="peer.address",e.PEER_HOST_IPV4="peer.ipv4",e.PEER_HOST_IPV6="peer.ipv6",e.PEER_PORT="peer.port",e.HTTP_URL="http.url",e.HTTP_METHOD="http.method",e.HTTP_STATUS_CODE="http.status_code",e.MESSAGE_BUS_DESTINATION="message_bus.destination",e.DB_INSTANCE="db.instance",e.DB_STATEMENT="db.statement",e.DB_TYPE="db.type",e.DB_USER="db.user"},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(16);e.MockContext=r.default;var o=n(17);e.MockSpan=o.default;var i=n(22);e.MockTracer=i.default},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),a=n(23),u=n(17),c=function(t){function e(){var e=t.call(this)||this;return e._spans=[],e}return o(e,t),e.prototype._startSpan=function(t,e){var n=this._allocSpan();if(n.setOperationName(t),this._spans.push(n),e.references)for(var r=0,o=e.references;r<o.length;r++){var i=o[r];n.addReference(i)}return n._startStack=(new Error).stack,n},e.prototype._inject=function(t,e,n){throw new Error("NOT YET IMPLEMENTED")},e.prototype._extract=function(t,e){throw new Error("NOT YET IMPLEMENTED")},e.prototype._allocSpan=function(){return new u.default(this)},e.prototype.clear=function(){this._spans=[]},e.prototype.report=function(){return new a.default(this._spans)},e}(i.Tracer);e.MockTracer=c,e.default=c},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t){var e=this;this.spans=t,this.spansByUUID={},this.spansByTag={},this.debugSpans=[],this.unfinishedSpans=[],t.forEach(function(t){0===t._finishMs&&e.unfinishedSpans.push(t),e.spansByUUID[t.uuid()]=t,e.debugSpans.push(t.debug());var n=t.tags();Object.keys(n).forEach(function(r){var o=n[r];e.spansByTag[r]=e.spansByTag[r]||{},e.spansByTag[r][o]=e.spansByTag[r][o]||[],e.spansByTag[r][o].push(t)})})}return t.prototype.firstSpanWithTagValue=function(t,e){var n=this.spansByTag[t];if(!n)return null;var r=n[e];return r?r[0]:null},t}();e.MockReport=r,e.default=r},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=n(11),a=new i.default,u=null,c=new(function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.startSpan=function(){var t=u||a;return t.startSpan.apply(t,arguments)},e.prototype.inject=function(){var t=u||a;return t.inject.apply(t,arguments)},e.prototype.extract=function(){var t=u||a;return t.extract.apply(t,arguments)},e}(i.default));e.initGlobalTracer=function(t){u=t},e.globalTracer=function(){return c}},function(t,e){function n(e,r){return t.exports=n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},n(e,r)}t.exports=n},function(t,e){t.exports=function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}},function(t,e){t.exports=function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}},function(t,e,n){"use strict";n.r(e);var r=n(0),o=n.n(r),i=n(1),a=n(5),u=n.n(a),c=n(6),s=n.n(c),f=n(7),d=n.n(f),p=n(8),l=n.n(p),v=n(2),h=n.n(v),g=n(9),y=n.n(g);function _(t,e,n){return new b(t,e,n)}var b=function(t){function e(t,n,r){var i;return u()(this,e),i=d()(this,l()(e).call(this)),o()(h()(i),"_traceId",void 0),o()(h()(i),"_clock",void 0),o()(h()(i),"_scopeManager",void 0),o()(h()(i),"_stream",void 0),o()(h()(i),"_nextSpanId",void 0),i._traceId=t,i._nextSpanId=1,i._clock=r.clock,i._scopeManager=r.scopeManager,i._stream=n,n.writeStartTracer(r.clock.now(),t),i}return y()(e,t),s()(e,[{key:"_startSpan",value:function(t,e){return new S(this,this._clock,this._stream,this._nextSpanId++,t,e)}},{key:"_inject",value:function(t,e,n){}},{key:"_extract",value:function(t,e){return new m("","")}},{key:"getTraceId",value:function(){return this._traceId}},{key:"getCurrentTime",value:function(){return this._clock.now()}}]),e}(i.Tracer),S=function(t){function e(t,n,r,a,c,s){var f;u()(this,e),f=d()(this,l()(e).call(this)),o()(h()(f),"_tracer",void 0),o()(h()(f),"_clock",void 0),o()(h()(f),"_stream",void 0),o()(h()(f),"_selfContext",void 0);var p=t.getTraceId();f._tracer=t,f._clock=n,f._stream=r,f._selfContext=new m(p,a);var v=s&&s.startTime||n.now(),g=function(t){var e=void 0,n=void 0;return t&&t.references&&t.references.forEach(function(t){switch(t.type()){case i.REFERENCE_CHILD_OF:e=t.referencedContext();break;case i.REFERENCE_FOLLOWS_FROM:n=t.referencedContext()}}),{childOf:e,followsFrom:n}}(s),y=g.childOf,_=g.followsFrom;return r.writeStartSpan(v,p,a,c,{childOf:w(y),followsFrom:w(_)},s.tags,y||_?void 0:n.epoch()),f}return y()(e,t),s()(e,[{key:"_context",value:function(){return this._selfContext}},{key:"_tracer",value:function(){return this._tracer}},{key:"_setOperationName",value:function(t){throw new Error("Not supported: setOperationName")}},{key:"_setBaggageItem",value:function(t,e){throw new Error("Not supported: setBaggageItem")}},{key:"_getBaggageItem",value:function(t){}},{key:"_addTags",value:function(t){var e=w(this._selfContext),n=e.traceId,r=e.spanId;this._stream.writeSpanTags(this._clock.now(),n,r,t)}},{key:"_log",value:function(t,e){var n=e||this._clock.now(),r=w(this._selfContext),o=r.traceId,i=r.spanId;this._stream.writeLog(n,o,i,t.$id,t)}},{key:"_finish",value:function(t){var e=t||this._clock.now(),n=w(this._selfContext),r=n.traceId,o=n.spanId;this._stream.writeEndSpan(e,r,o)}}]),e}(i.Span),m=function(t){function e(t,n){var r;return u()(this,e),r=d()(this,l()(e).call(this)),o()(h()(r),"_traceId",void 0),o()(h()(r),"_spanId",void 0),r._traceId=t,r._spanId=n,r}return y()(e,t),s()(e,[{key:"toTraceId",value:function(){return this._traceId}},{key:"toSpanId",value:function(){return this._spanId}}]),e}(i.SpanContext);function w(t){if(t)return{traceId:t.toTraceId(),spanId:t.toSpanId()}}function E(t){var e=t.traceId,n=t.spanId;return new m(e,n)}var N=n(4),T=n.n(N);function x(t){var e=[],n=!t||!!t.enabled;return{writeStartTracer:function(t,r,o){n&&e.push({time:t,token:"StartTracer",traceId:r,tags:o||{}})},writeStartSpan:function(t,r,o,i,a,u,c){if(n){var s=a.childOf,f=a.followsFrom;e.push({time:t,epoch:c,token:"StartSpan",traceId:r,spanId:o,childOf:s,followsFrom:f,messageId:i,tags:u||{}})}},writeEndSpan:function(t,r,o,i){n&&e.push({time:t,token:"EndSpan",traceId:r,spanId:o,tags:i||{}})},writeLog:function(t,r,o,i,a){n&&e.push({time:t,token:"Log",traceId:r,spanId:o,messageId:i,tags:a||{}})},writeSpanTags:function(t,r,o,i){n&&e.push({time:t,token:"SpanTags",traceId:r,spanId:o,tags:i||{}})},enable:function(t){n=void 0===t||!!t},peekEntries:function(){return e},takeEntries:function(){var t=e;return e=[],t.forEach(r),t}};function r(t){var e=new Set;if(t.tags){var n=t.tags.$meta;if(n&&n.stringify){var r=!0,o=!1,i=void 0;try{for(var a,u=n.stringify[Symbol.iterator]();!(r=(a=u.next()).done);r=!0){var c=a.value;t.tags[c]=s(t.tags[c])}}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}}}function s(t){var e=JSON.stringify(t,f);return e&&e.length>1024?e.substr(0,1024)+"...[trunc]":e}function f(t,n){if("object"===T()(n)&&null!==n){if(e.has(n))return"[circ]";e.add(n)}return n}}}var O={debug:0,event:1,warning:2,error:3,critical:4},I=k();function C(t){var e=function(t){var e=I.getActiveSpan();e&&e.log(t)},n=I.clone(),r="function"==typeof t?t():t,o=I,i=new Promise(function(t,n){r.then(function(n){I=o,e({$id:"async-then",$async:"then",level:O.debug,value:n}),t(n)}).catch(function(t){I=o,e({$id:"async-catch",$async:"catch",level:O.error,error:{message:t.message,stack:t.stack}}),n(t)})});return I=n,i}function P(){return{getActiveTracer:function(){return I.getActiveTracer()},getActiveSpan:function(){return I.getActiveSpan()},setActiveTracer:function(t){I.setActiveTracer(t)},setActiveSpan:function(t){I.setActiveSpan(t)}}}function M(){I=k()}function k(t){var e=t?t.getActiveTracer():void 0,n=t?t.getActiveSpan():void 0,r={getActiveTracer:function(){return e},getActiveSpan:function(){return n},setActiveTracer:function(t){e=t},setActiveSpan:function(t){n=t},clone:function(){return k(r)}};return r}function A(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function j(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?A(n,!0).forEach(function(e){o()(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):A(n).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var R=function(){return{now:function(){return performance.now()},epoch:function(){return(new Date).getTime()},setInterval:function(t){function e(e,n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t,e){return setInterval(t,e)}),clearInterval:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){clearInterval(t)}),setTimeout:function(t){function e(e,n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t,e){return setTimeout(t,e)}),clearTimeout:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){clearTimeout(t)})}},D=function(t,e){return _("webuser".concat(e.clock.now()),t,e)};function L(t){var e=t&&t.clock||R(),n=t&&t.scopeManager||P(),r=t&&t.tracerFactory||D,o=t&&t.outputStream||x(t?t.stream:void 0),a={},u=function(t){var e=n.getActiveSpan();if(e)e.log(t);else{var r=n.getActiveTracer().startSpan("unknown-root");r.log(t),r.finish()}},c=function(t,o,u,c){var s=function(){var t=n.getActiveTracer();if(t)return t;var o=r({clock:e,scopeManager:n,tracerFactory:r});return n.setActiveTracer(o),o}(),f=function(t){if(t)return t;var e=n.getActiveSpan();return e?e.context():void 0}(u),d={references:f&&[new i.Reference(c,f)],tags:o},p=s.startSpan(t,d);n.setActiveSpan(p);var l=p.context().toSpanId();return a[l]={span:p,options:d},p};n.setActiveTracer(r(o,{clock:e,scopeManager:n,tracerFactory:r}));var s={logDebug:function(t,e){u(j({$id:t,level:O.debug},e))},logEvent:function(t,e){u(j({$id:t,level:O.event},e))},logWarning:function(t,e){u(j({$id:t,level:O.warning},e))},logError:function(t,e){u(j({$id:t,level:O.error},e))},logCritical:function(t,e){u(j({$id:t,level:O.critical},e))},spanRoot:function(t,e){return n.setActiveSpan(void 0),c(t,e)},spanChild:function(t,e,n){return c(t,e,n,i.REFERENCE_CHILD_OF)},spanFollower:function(t,e,n){return c(t,e,n,i.REFERENCE_FOLLOWS_FROM)},finishSpan:function(t){var e=n.getActiveSpan();if(!e)throw new Error("Current scope has no active span");e.finish(),e.doesNotifyTracerOnFinish||s.notifySpanFinished(e)},notifySpanFinished:function(t){var e=t.context(),r=e.toSpanId(),o=e.toTraceId(),i=a[r];if(!i)throw new Error("Trace span not found: id [".concat(r,"]"));var u=i.options.references&&i.options.references[0].referencedContext();if(u&&u.toTraceId()===o){var c=a[u.toSpanId()];c&&n.setActiveSpan(c.span)}else n.setActiveSpan(void 0);delete a[r]}};return{input:s,output:o}}function F(t){var e=[],n={add:function(t){n.remove(t),e.push(t)},remove:function(t){e=e.filter(function(e){return e!==t})},invoke:function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];e.forEach(function(e){try{e.apply(void 0,r)}catch(e){console.log("Event [".concat(t,"] invocation failed!"),e)}})}};return n}function B(t){var e=F("CodePathModel.insertNodes"),n=F("CodePathModel.updateNodes"),r=t&&t.extractEntryMetrics?t.extractEntryMetrics:function(t){return t.metrics},i=void 0,a=void 0,u=1,c=function(){var t,e;t={},e=function(e){var n=t[e];if(n)return n;var r,o=(r={},{getSpanNode:function(t){return r[t]},setSpanNode:function(t,e){r[t]=e}});return t[e]=o,o},i={getSpanNode:function(t,n){return e(t).getSpanNode(n)},setSpanNode:function(t,n,r){return e(t).setSpanNode(n,r)}},a=H()},s=function(t,e,n){if(t.metrics)for(var r=new Set(e),i=Object.keys(t.metrics),a=function(e){i.forEach(function(n){var r=t.metrics[n];!function(t,e,n){t.metrics?t.metrics[e]?t.metrics[e]+=n:t.metrics[e]=n:t.metrics=o()({},e,n)}(e,n,r)}),r.has(e)||n.push(e)},u=t.parent;u.id>0;u=u.parent)a(u)},f=function(t,e,n){var o=t.traceId,c=t.spanId,f=function(t){var e=function(t){return"StartSpan"===t.token?t.childOf||t.followsFrom:t}(t);if(e){var n=i.getSpanNode(e.traceId,e.spanId);if(n)return n;console.warn("CODEPATH.MODEL>","Span node not found",e)}return a}(t),d=U(u++,f,t,r);W(d,f),"StartSpan"===t.token&&i.setSpanNode(o,c,d),e.push(d),s(d,e,n)},d={StartTracer:function(t,e,n){},StartSpan:f,Log:f,SpanTags:function(t,e,n){},EndSpan:function(t,e,n){var r=i.getSpanNode(t.traceId,t.spanId);r&&(r.entry.duration=t.time-r.entry.time,n.push(r))}};return c(),{getRootNode:function(){return a},getNodesFlat:function(){return V(a)},getTopLevelNodes:function(){return G(a)},walkNodesDepthFirst:function(t){$(a,t)},publish:function(t){var r=[],o=[];t.forEach(function(t){!function(t,e,n){var r=d[t.token];r?r(t,e,n):console.error("Unknown entry token [".concat(t.token,"]"))}(t,r,o)}),r.length>0&&e.invoke(r),o.length>0&&n.invoke(o)},subscribe:function(t){t.insertNodes&&e.add(t.insertNodes),t.updateNodes&&n.add(t.updateNodes)},unsubscribe:function(t){t.insertNodes&&e.remove(t.insertNodes),t.updateNodes&&n.remove(t.updateNodes)},clearAll:function(){c()},extractEntryMetrics:r}}function H(){return{id:0,entry:void 0,parent:void 0,top:void 0,depth:-1,firstChild:void 0,lastChild:void 0,prevSibling:void 0,nextSibling:void 0,metrics:void 0}}function U(t,e,n,r){var o={id:t,entry:n,parent:e,depth:e.depth+1,top:e.top,firstChild:void 0,lastChild:void 0,prevSibling:void 0,nextSibling:void 0,metrics:r?r(n):n.metrics};return o.top||(o.top=o),o}function W(t,e){e.lastChild?(t.prevSibling=e.lastChild,e.lastChild.nextSibling=t):e.firstChild=t,e.lastChild=t}function V(t){if(!t)return[];var e=[];return $(t,function(t){return e.push(t)}),e}function G(t){var e=[];return K(t,function(t){e.push(t)}),e}function $(t,e){return K(t,function(t){return!1!==e(t)&&((!t.firstChild||!1!==$(t,e))&&void 0)})}function K(t,e){if(t)for(var n=t.firstChild;n;n=n.nextSibling)if(!1===e(n))return!1}function X(t,e){for(var n=t,r=!1;n;)if(!r&&n.firstChild?n=n.firstChild:(r=!1,n.nextSibling?n=n.nextSibling:(r=!0,n=n.parent)),!r&&e(n))return n}function z(t,e){for(var n=t,r=!1;n;)if(!r&&n.lastChild?n=n.lastChild:(r=!1,n.prevSibling?n=n.prevSibling:(r=!0,n=n.parent)),!r&&e(n))return n}function Y(t,e){var n=F("CodePathSearchModel.insertNodes"),r=F("CodePathSearchModel.updateNodes"),o={},i=void 0,a=void 0,u=function(){o={},i=void 0,a=function(){var n=t.getRootNode(),r={id:0,entry:void 0,parent:void 0,top:void 0,depth:-1,firstChild:void 0,lastChild:void 0,prevSibling:void 0,nextSibling:void 0,metrics:void 0};return o[r.id]=r,function t(n,r){var o=function(t){return s(n,t,r)};var i=!n.parent;var a=!i&&e(n);var u=a?o(!0):void 0;for(var c=n.firstChild;c;c=c.nextSibling)t(c,function(){return u||(u=i?r():o(!1)),u})}(n,function(){return r}),r}()},c={insertNodes:f,updateNodes:function(t){}};return t.subscribe(c),u(),{getRootNode:function(){return a},getNodesFlat:function(){return V(a)},getTopLevelNodes:function(){return G(a)},getFirstMatchedNode:function(){var t=void 0;return $(a,function(e){if(e.matched)return t=e,!1}),t},getNextMatchedNode:function(t){return X(t,function(t){return t.matched})},getPrevMatchedNode:function(t){return z(t,function(t){return t.matched})},subscribe:function(t){t.insertNodes&&n.add(t.insertNodes),t.updateNodes&&r.add(t.updateNodes)},unsubscribe:function(t){t.insertNodes&&n.remove(t.insertNodes),t.updateNodes&&r.remove(t.updateNodes)},unsubscribeFromSource:function(){t.unsubscribe(f)},clearAll:function(){t.clearAll(),u()}};function s(e,n,r){var a=r(),u=U(e.id,a,e.entry,t.extractEntryMetrics);return o[u.id]=u,i&&i.push(u),W(u,a),u.matched=n,u}function f(t){i=[],t.filter(e).forEach(function(t){s(t,!0,function(){return function t(e){if(e.parent){var n=o[e.parent.id];return n||s(e.parent,!1,function(){return t(e.parent)})}}(t)})}),i.length>0&&n.invoke(i),i=void 0}}var J=n(18),q=n.n(J);function Q(t,e){var n={},r=1,o={insertNodes:function(t){for(var e=void 0,r=0;r<t.length;r++){var o=t[r].parent.id;n[o];e&&e.parentId===o||i(r)}function i(n){a(n),e={parentId:t[n].parent.id,startIndex:n}}function a(r){if(e&&e.startIndex<r){var o=n[e.parentId];if(o){var i=t.slice(e.startIndex,r);o.showSubNodes(i)}}}a(t.length)},updateNodes:function(e){e.forEach(function(e){var r=n[e.id];if(r){var o=r.findAbsoluteIndex();t.updateNode(o,e)}})}},i={getNodeById:function(t){var e=n[t];if(e)return e.getNode()},toggle:function(t){return n[t].toggle()},expand:function(t){n[t].expand()},collapse:function(t){n[t].collapse()},selectNode:function(e){i.expandToNode(e);var r=n[e.id].findAbsoluteIndex();t.selectNode(r,e)},expandToNode:function(t){n[t.id]||(i.expandToNode(t.parent),i.expand(t.parent.id))},getIsExpanded:function(t){var e=n[t];return!!e&&e.getIsExpanded()},getIsVisible:function(t){return!!n[t]&&n[t].getIsVisible()},replaceModel:function(t){e.unsubscribe(o),e=t,a()},clearAll:function(){e.clearAll(),i.replaceModel(e)},onNodeSelected:function(e){t.onNodeSelected(e)}};return t.attachController(i),a(),i;function a(){var i;n={},r=1,i=e.getRootNode(),n[i.id]=function(e){var n=0,o=function(){};return{getNode:function(){return e},getParent:o,getPrevSibling:o,getNextSibling:o,getFirstChild:o,getIsExpanded:function(){return!0},getIsVisible:function(){return!0},getSubTreeHeight:function(){return n},updateSubTreeHeight:function(t){n+=t},getIndexVersion:function(){return r},findAbsoluteIndex:function(){return-1},toggle:o,expand:o,collapse:o,showSubNodes:function(e){u(e),t.insertNodes(n,e),n+=e.length}}}(i),t.clearAll(),o.insertNodes(e.getTopLevelNodes()),e.subscribe(o)}function u(t){var e=!0,r=!1,o=void 0;try{for(var i,a=t[Symbol.iterator]();!(e=(i=a.next()).done);e=!0){var u=i.value,s=c(u);n[u.id]=s}}catch(t){r=!0,o=t}finally{try{e||null==a.return||a.return()}finally{if(r)throw o}}}function c(e){var o=!1,i=0,a=void 0,c=r,s=function(){return n[e.parent.id]},f=function(){return e.prevSibling?n[e.prevSibling.id]:void 0},d=function(){return o},p=function(){var t=s();return t.getIsVisible()&&t.getIsExpanded()},l=function(t){i+=t,c=r,s().updateSubTreeHeight(t)},v=function(){if(!a||c!==r){for(var t=0,e=f();e;e=e.getPrevSibling())t+=1+e.getSubTreeHeight();var n=s().findAbsoluteIndex();a=n+t+1,c=r}return a},h=function(n){if(p()&&d()){var o=v();u(n),t.insertNodes(o+i+1,n),r++,l(+n.length),t.updateNode(o,e)}},g=function(){if(!o&&e.firstChild){for(var t=[],n=e.firstChild;n;n=n.nextSibling)t.push(n);o=!0,h(t)}},y=function(){o=!1,function(){if(p()&&0!==i){var o=v(),a=t.removeNodes(o+1,i);a&&a.forEach(function(t){return delete n[t]}),r++,l(-i),t.updateNode(o,e)}}()};return{getNode:function(){return e},getParent:s,getPrevSibling:f,getNextSibling:function(){return e.nextSibling?n[e.nextSibling.id]:void 0},getFirstChild:function(){return e.firstChild?n[e.firstChild.id]:void 0},getIsExpanded:d,getIsVisible:p,getSubTreeHeight:function(){return i},updateSubTreeHeight:l,getIndexVersion:function(){return r},findAbsoluteIndex:v,toggle:function(){return o?y():g(),{isExpanded:o}},expand:g,collapse:y,showSubNodes:h}}}function Z(t,e,n){var r=F("TreeGridView.NodeSelected"),o=F("TreeGridView.KeyPressed");t.onkeydown=function(t){if(!0===function(t){if(t.ctrlKey||t.shiftKey||t.altKey)return!1;if(!u)return i.rows.length>0&&d(0,v(i.rows[0])),!0;var e=l(u);switch(t.key){case"ArrowLeft":if(a.getIsExpanded(e))return a.collapse(e),!0;break;case"ArrowRight":if(!a.getIsExpanded(e))return a.expand(e),!0}var n=function(t){switch(t){case"ArrowUp":if(p(u)>0)return i.rows[p(u)-1];break;case"ArrowDown":if(p(u)<i.rows.length-1)return i.rows[p(u)+1];break;case"ArrowLeft":return function(t){var e=v(t).parent.id;if(e)for(var n=p(t)-1;n>=0;n--){var r=i.rows[n];if(l(r)===e)return r}}(u);case"ArrowRight":return function(t){for(var e=v(t),n=p(t)+1;n<i.rows.length;n++){var r=i.rows[n],o=v(r);if(o.parent!==e)break;if(o.firstChild)return r}}(u)}}(t.key);if(n)return d(p(n),v(n)),!0;return!1}(t))return t.stopPropagation(),!1};var i=document.createElement("tbody");t.appendChild(i);var a=void 0,u=void 0,c=function(t){return"string"==typeof t?document.createTextNode(t):t},s=function(t,n,r,o,i){var u=e[r],s=u.getTdClass&&u.getTdClass(t,a,n);s&&i.classList.add(s);var f=u.renderCell(t,a,n);f&&f.filter(function(t){return!!t}).map(c).forEach(function(t){return i.appendChild(t)})},f=function(t,e,r){var o=a.getIsExpanded(e.id);if(t.className="",t.classList.add(o?"expanded":"collapsed"),t===u&&t.classList.add("selected"),n&&n.getTrClasses){var i,c=n.getTrClasses(e,r);(i=t.classList).add.apply(i,q()(c))}},d=function(t,e){u&&u.classList.remove("selected"),u=void 0,"number"==typeof t&&t>=0&&((u=i.rows[t]).classList.add("selected"),r.invoke(e),u.scrollIntoViewIfNeeded())};return{attachController:function(t){a=t},updateNode:function(t,n){var r=i.rows[t];f(r,n,t);for(var o=0;o<e.length;o++){var a=r.cells[o];a.innerHTML="",s(n,t,o,0,a)}},insertNodes:function(t,n){for(var r=function(r){var o=t+r,a=i.insertRow(t+r);a.setAttribute("data-nid",n[r].id),f(a,n[r],t+r),a.onclick=function(){d(a.rowIndex-1,n[r])};for(var u=0;u<e.length;u++){var c=a.insertCell(u);s(n[r],o,u,0,c)}},o=0;o<n.length;o++)r(o)},removeNodes:function(t,e){u&&u.rowIndex-1>=t&&u.rowIndex-1<t+e&&(u=void 0,r.invoke(void 0));for(var n=[],o=e-1;o>=0;o--){var a=i.rows[t+o];n.push(l(a)),i.deleteRow(t+o)}return n},selectNode:d,clearAll:function(){var e=document.createElement("tbody");t.replaceChild(e,i),i=e,d()},onNodeSelected:function(t){r.add(t)},onKeyPressed:function(t){o.add(t)}};function p(t){return t.sectionRowIndex}function l(t){var e=parseInt(t.getAttribute("data-nid"));return isNaN(e)?void 0:e}function v(t){var e=l(t);if(e)return a.getNodeById(e)}}function tt(t,e,n){var r=n||R(),o=void 0;return{bounce:function(){o&&r.clearTimeout(o),o=r.setTimeout(function(){o=void 0,t()},e)}}}function et(t){var e=10,n=3,r=t.gripElement,o=t.leftSideElement,i=t.rightSideElement,a=void 0,u=void 0,c=void 0;function s(t){return{mouseX:t.pageX,leftWidth:o?o.clientWidth:void 0,rightWidth:i?i.clientWidth:void 0}}function f(t){var r=s(t);if(Math.abs(r.mouseX-u.mouseX)>=n){u=r;var c=r.mouseX-a.mouseX;a.leftWidth&&c<0&&a.leftWidth+c<e&&(c=-(a.leftWidth-e)),a.rightWidth&&c>0&&a.rightWidth-c<e&&(c=a.rightWidth-e),o&&o.style.width.length>0&&(o.style.width="".concat(a.leftWidth+c,"px")),i&&i.style.width.length>0&&(i.style.width="".concat(a.rightWidth-c,"px"))}return t.stopPropagation(),!1}function d(t){return document.body.style.cursor=c,window.removeEventListener("mousemove",f,!0),window.removeEventListener("mouseup",d,!0),a=void 0,u=void 0,t.stopPropagation(),!1}r.onmousedown=function(t){return a=s(t),u=Object.assign({},a),window.addEventListener("mousemove",f,!0),window.addEventListener("mouseup",d,!0),c=document.body.style.cursor,document.body.style.cursor="ew-resize",t.stopPropagation(),!1}}var nt=void 0;function rt(t,e){return nt||(nt={component:t,isEnabled:!1,setEnabled:it(t,e)}),{log:function(){var t;nt.isEnabled&&(t=console).log.apply(t,arguments)},info:function(){var t;nt.isEnabled&&(t=console).info.apply(t,arguments)},warn:function(){var t;nt.isEnabled&&(t=console).warn.apply(t,arguments)},error:function(){var t;nt.isEnabled&&(t=console).error.apply(t,arguments)}}}function ot(t){nt?(nt.setEnabled(t),console.log("CODEPATH.DEBUG-LOG>","log switch [".concat(nt.component,"] was set to"),t)):console.log("CODEPATH.DEBUG-LOG>","log switch was not initialized")}function it(t,e){var n=function(t){return{type:"codePath/devTools/enableDebugLog",enable:!!t}},r=function(t){"object"===T()(t)&&"codePath/devTools/enableDebugLog"===t.type&&"boolean"==typeof t.enable&&ot(t.enable)};switch(t){case"page":return function(t){nt.isEnabled=!!t,window.postMessage(n(t),"*")};case"content":return window.addEventListener("message",function(t){r(t.data)}),function(t){nt.isEnabled=!!t,chrome.runtime.sendMessage(n(t))};case"background":return chrome.runtime.onMessage.addListener(function(t,e,n){r(t)}),function(t){nt.isEnabled=!!t};case"devtool":return e&&e.backgroundConnection.onMessage.addListener(function(t){r(t)}),function(t){nt.isEnabled=!!t};default:return function(t){nt.isEnabled=!!t}}}n.d(e,"createCodePath",function(){return L}),n.d(e,"createRealClock",function(){return R}),n.d(e,"createDefaultScopeManager",function(){return P}),n.d(e,"trace",function(){return C}),n.d(e,"resetCurrentScope",function(){return M}),n.d(e,"createCodePathStream",function(){return x}),n.d(e,"createCodePathTracer",function(){return _}),n.d(e,"contextToPlain",function(){return w}),n.d(e,"plainToContext",function(){return E}),n.d(e,"createCodePathModel",function(){return B}),n.d(e,"walkNodesDepthFirst",function(){return $}),n.d(e,"walkImmediateSubNodes",function(){return K}),n.d(e,"findNextMatchingNode",function(){return X}),n.d(e,"findPrevMatchingNode",function(){return z}),n.d(e,"createCodePathSearchModel",function(){return Y}),n.d(e,"createTreeGridController",function(){return Q}),n.d(e,"createTreeGridView",function(){return Z}),n.d(e,"createMulticastDelegate",function(){return F}),n.d(e,"createDebounce",function(){return tt}),n.d(e,"createResizer",function(){return et}),n.d(e,"LOG_LEVEL",function(){return O}),n.d(e,"createDebugLog",function(){return rt}),n.d(e,"enableDebugLog",function(){return ot})}])});
//# sourceMappingURL=index.js.map