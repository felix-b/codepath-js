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
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.CodePath=e():t.CodePath=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=25)}([function(t,e,n){"use strict";function r(t){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n])}Object.defineProperty(e,"__esModule",{value:!0});var o=n(17);e.BinaryCarrier=o.default;var i=n(18);e.Tags=i;var u=n(9),a=n(14);e.Reference=a.default;var c=n(3);e.Span=c.default;var s=n(11);e.SpanContext=s.default;var f=n(10);e.Tracer=f.Tracer;var p=n(19);e.MockTracer=p.MockTracer,r(n(22)),r(n(13)),r(n(12)),u.initialize()},function(t,e){t.exports=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}},function(t,e){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(9),o=function(){function t(){}return t.prototype.context=function(){return this._context()},t.prototype.tracer=function(){return this._tracer()},t.prototype.setOperationName=function(t){return this._setOperationName(t),this},t.prototype.setBaggageItem=function(t,e){return this._setBaggageItem(t,e),this},t.prototype.getBaggageItem=function(t){return this._getBaggageItem(t)},t.prototype.setTag=function(t,e){var n;return this._addTags(((n={})[t]=e,n)),this},t.prototype.addTags=function(t){return this._addTags(t),this},t.prototype.log=function(t,e){return this._log(t,e),this},t.prototype.logEvent=function(t,e){return this._log({event:t,payload:e})},t.prototype.finish=function(t){this._finish(t)},t.prototype._context=function(){return r.spanContext},t.prototype._tracer=function(){return r.tracer},t.prototype._setOperationName=function(t){},t.prototype._setBaggageItem=function(t,e){},t.prototype._getBaggageItem=function(t){},t.prototype._addTags=function(t){},t.prototype._log=function(t,e){},t.prototype._finish=function(t){},t}();e.Span=o,e.default=o},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}t.exports=function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}},function(t,e,n){var r=n(23),o=n(2);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?o(t):e}},function(t,e){function n(e){return t.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(e)}t.exports=n},function(t,e,n){var r=n(24);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(3),o=n(11),i=n(10);e.tracer=null,e.spanContext=null,e.span=null,e.initialize=function(){e.tracer=new i.default,e.span=new r.default,e.spanContext=new o.default}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(12),o=n(9),i=n(3),u=function(){function t(){}return t.prototype.startSpan=function(t,e){if(void 0===e&&(e={}),e.childOf){var n=r.childOf(e.childOf);e.references?e.references.push(n):e.references=[n],delete e.childOf}return this._startSpan(t,e)},t.prototype.inject=function(t,e,n){return t instanceof i.default&&(t=t.context()),this._inject(t,e,n)},t.prototype.extract=function(t,e){return this._extract(t,e)},t.prototype._startSpan=function(t,e){return o.span},t.prototype._inject=function(t,e,n){},t.prototype._extract=function(t,e){return o.spanContext},t}();e.Tracer=u,e.default=u},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(){}return t.prototype.toTraceId=function(){return""},t.prototype.toSpanId=function(){return""},t}();e.SpanContext=r,e.default=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(13),o=n(14),i=n(3);e.childOf=function(t){return t instanceof i.default&&(t=t.context()),new o.default(r.REFERENCE_CHILD_OF,t)},e.followsFrom=function(t){return t instanceof i.default&&(t=t.context()),new o.default(r.REFERENCE_FOLLOWS_FROM,t)}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.FORMAT_BINARY="binary",e.FORMAT_TEXT_MAP="text_map",e.FORMAT_HTTP_HEADERS="http_headers",e.REFERENCE_CHILD_OF="child_of",e.REFERENCE_FOLLOWS_FROM="follows_from"},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(3),o=function(){function t(t,e){this._type=t,this._referencedContext=e instanceof r.default?e.context():e}return t.prototype.type=function(){return this._type},t.prototype.referencedContext=function(){return this._referencedContext},t}();e.default=o},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(e){var n=t.call(this)||this;return n._span=e,n}return o(e,t),e.prototype.span=function(){return this._span},e}(n(0).SpanContext);e.MockContext=i,e.default=i},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=n(0),u=n(15),a=function(t){function e(e){var n=t.call(this)||this;return n._mockTracer=e,n._uuid=n._generateUUID(),n._startMs=Date.now(),n._finishMs=0,n._operationName="",n._tags={},n._logs=[],n}return o(e,t),e.prototype._context=function(){return new u.default(this)},e.prototype._setOperationName=function(t){this._operationName=t},e.prototype._addTags=function(t){for(var e=0,n=Object.keys(t);e<n.length;e++){var r=n[e];this._tags[r]=t[r]}},e.prototype._log=function(t,e){this._logs.push({fields:t,timestamp:e})},e.prototype._finish=function(t){this._finishMs=t||Date.now()},e.prototype.uuid=function(){return this._uuid},e.prototype.operationName=function(){return this._operationName},e.prototype.durationMs=function(){return this._finishMs-this._startMs},e.prototype.tags=function(){return this._tags},e.prototype.tracer=function(){return this._mockTracer},e.prototype._generateUUID=function(){return""+("00000000"+Math.abs(4294967295*Math.random()|0).toString(16)).substr(-8)+("00000000"+Math.abs(4294967295*Math.random()|0).toString(16)).substr(-8)},e.prototype.addReference=function(t){},e.prototype.debug=function(){var t={uuid:this._uuid,operation:this._operationName,millis:[this._finishMs-this._startMs,this._startMs,this._finishMs]};return Object.keys(this._tags).length&&(t.tags=this._tags),t},e}(i.Span);e.MockSpan=a,e.default=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(t){this.buffer=t};e.default=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SPAN_KIND="span.kind",e.SPAN_KIND_RPC_CLIENT="client",e.SPAN_KIND_RPC_SERVER="server",e.SPAN_KIND_MESSAGING_PRODUCER="producer",e.SPAN_KIND_MESSAGING_CONSUMER="consumer",e.ERROR="error",e.COMPONENT="component",e.SAMPLING_PRIORITY="sampling.priority",e.PEER_SERVICE="peer.service",e.PEER_HOSTNAME="peer.hostname",e.PEER_ADDRESS="peer.address",e.PEER_HOST_IPV4="peer.ipv4",e.PEER_HOST_IPV6="peer.ipv6",e.PEER_PORT="peer.port",e.HTTP_URL="http.url",e.HTTP_METHOD="http.method",e.HTTP_STATUS_CODE="http.status_code",e.MESSAGE_BUS_DESTINATION="message_bus.destination",e.DB_INSTANCE="db.instance",e.DB_STATEMENT="db.statement",e.DB_TYPE="db.type",e.DB_USER="db.user"},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(15);e.MockContext=r.default;var o=n(16);e.MockSpan=o.default;var i=n(20);e.MockTracer=i.default},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=n(0),u=n(21),a=n(16),c=function(t){function e(){var e=t.call(this)||this;return e._spans=[],e}return o(e,t),e.prototype._startSpan=function(t,e){var n=this._allocSpan();if(n.setOperationName(t),this._spans.push(n),e.references)for(var r=0,o=e.references;r<o.length;r++){var i=o[r];n.addReference(i)}return n._startStack=(new Error).stack,n},e.prototype._inject=function(t,e,n){throw new Error("NOT YET IMPLEMENTED")},e.prototype._extract=function(t,e){throw new Error("NOT YET IMPLEMENTED")},e.prototype._allocSpan=function(){return new a.default(this)},e.prototype.clear=function(){this._spans=[]},e.prototype.report=function(){return new u.default(this._spans)},e}(i.Tracer);e.MockTracer=c,e.default=c},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t){var e=this;this.spans=t,this.spansByUUID={},this.spansByTag={},this.debugSpans=[],this.unfinishedSpans=[],t.forEach(function(t){0===t._finishMs&&e.unfinishedSpans.push(t),e.spansByUUID[t.uuid()]=t,e.debugSpans.push(t.debug());var n=t.tags();Object.keys(n).forEach(function(r){var o=n[r];e.spansByTag[r]=e.spansByTag[r]||{},e.spansByTag[r][o]=e.spansByTag[r][o]||[],e.spansByTag[r][o].push(t)})})}return t.prototype.firstSpanWithTagValue=function(t,e){var n=this.spansByTag[t];if(!n)return null;var r=n[e];return r?r[0]:null},t}();e.MockReport=r,e.default=r},function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=n(10),u=new i.default,a=null,c=new(function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.startSpan=function(){var t=a||u;return t.startSpan.apply(t,arguments)},e.prototype.inject=function(){var t=a||u;return t.inject.apply(t,arguments)},e.prototype.extract=function(){var t=a||u;return t.extract.apply(t,arguments)},e}(i.default));e.initGlobalTracer=function(t){a=t},e.globalTracer=function(){return c}},function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(e){return"function"==typeof Symbol&&"symbol"===n(Symbol.iterator)?t.exports=r=function(t){return n(t)}:t.exports=r=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)},r(e)}t.exports=r},function(t,e){function n(e,r){return t.exports=n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},n(e,r)}t.exports=n},function(t,e,n){"use strict";n.r(e);var r=n(1),o=n.n(r),i=n(0),u=n(4),a=n.n(u),c=n(5),s=n.n(c),f=n(6),p=n.n(f),d=n(7),l=n.n(d),v=n(2),_=n.n(v),h=n(8),g=n.n(h);function y(t,e,n){return new S(t,e,n)}var S=function(t){function e(t,n,r){var i;return a()(this,e),i=p()(this,l()(e).call(this)),o()(_()(i),"_traceId",void 0),o()(_()(i),"_clock",void 0),o()(_()(i),"_scopeManager",void 0),o()(_()(i),"_stream",void 0),o()(_()(i),"_nextSpanId",void 0),i._traceId=t,i._nextSpanId=1,i._clock=r.clock,i._scopeManager=r.scopeManager,i._stream=n,n.writeStartTracer(r.clock.now(),t),i}return g()(e,t),s()(e,[{key:"_startSpan",value:function(t,e){return new b(this,this._clock,this._stream,this._nextSpanId++,t,e)}},{key:"_inject",value:function(t,e,n){}},{key:"_extract",value:function(t,e){return new O("","")}},{key:"getTraceId",value:function(){return this._traceId}},{key:"getCurrentTime",value:function(){return this._clock.now()}}]),e}(i.Tracer),b=function(t){function e(t,n,r,u,c,s){var f;a()(this,e),f=p()(this,l()(e).call(this)),o()(_()(f),"_tracer",void 0),o()(_()(f),"_clock",void 0),o()(_()(f),"_stream",void 0),o()(_()(f),"_selfContext",void 0);var d=t.getTraceId();f._tracer=t,f._clock=n,f._stream=r,f._selfContext=new O(d,u);var v=s&&s.startTime||n.now(),h=function(t){var e=void 0,n=void 0;return t&&t.references&&t.references.forEach(function(t){switch(t.type()){case i.REFERENCE_CHILD_OF:e=t.referencedContext();break;case i.REFERENCE_FOLLOWS_FROM:n=t.referencedContext()}}),{childOf:e,followsFrom:n}}(s),g=h.childOf,y=h.followsFrom;return r.writeStartSpan(v,d,u,c,{childOf:E(g),followsFrom:E(y)},s.tags),f}return g()(e,t),s()(e,[{key:"_context",value:function(){return this._selfContext}},{key:"_tracer",value:function(){return this._tracer}},{key:"_setOperationName",value:function(t){throw new Error("Not supported: setOperationName")}},{key:"_setBaggageItem",value:function(t,e){throw new Error("Not supported: setBaggageItem")}},{key:"_getBaggageItem",value:function(t){}},{key:"_addTags",value:function(t){var e=E(this._selfContext),n=e.traceId,r=e.spanId;this._stream.writeSpanTags(this._clock.now(),n,r,t)}},{key:"_log",value:function(t,e){var n=e||this._clock.now(),r=E(this._selfContext),o=r.traceId,i=r.spanId;this._stream.writeLog(n,o,i,t.$id,t)}},{key:"_finish",value:function(t){var e=t||this._clock.now(),n=E(this._selfContext),r=n.traceId,o=n.spanId;this._stream.writeEndSpan(e,r,o)}}]),e}(i.Span),O=function(t){function e(t,n){var r;return a()(this,e),r=p()(this,l()(e).call(this)),o()(_()(r),"_traceId",void 0),o()(_()(r),"_spanId",void 0),r._traceId=t,r._spanId=n,r}return g()(e,t),s()(e,[{key:"toTraceId",value:function(){return this._traceId}},{key:"toSpanId",value:function(){return this._spanId}}]),e}(i.SpanContext);function E(t){if(t)return{traceId:t.toTraceId(),spanId:t.toSpanId()}}function T(t){var e=t.traceId,n=t.spanId;return new O(e,n)}function I(t){var e=[],n=!t||!!t.enabled;return{writeStartTracer:function(t,r,o){n&&e.push({time:t,token:"StartTracer",traceId:r,tags:o||{}})},writeStartSpan:function(t,r,o,i,u,a){if(n){var c=u.childOf,s=u.followsFrom;e.push({time:t,token:"StartSpan",traceId:r,spanId:o,childOf:c,followsFrom:s,messageId:i,tags:a||{}})}},writeEndSpan:function(t,r,o,i){n&&e.push({time:t,token:"EndSpan",traceId:r,spanId:o,tags:i||{}})},writeLog:function(t,r,o,i,u){n&&e.push({time:t,token:"Log",traceId:r,spanId:o,messageId:i,tags:u||{}})},writeSpanTags:function(t,r,o,i){n&&e.push({time:t,token:"SpanTags",traceId:r,spanId:o,tags:i||{}})},enable:function(t){n=void 0===t||!!t},peekEntries:function(){return e},takeEntries:function(){var t=e;return e=[],t}}}var m=P();function x(t){var e=m.clone(),n="function"==typeof t?t():t,r=m,o=new Promise(function(t,e){n.then(function(e){m=r,t(e)}).catch(function(t){m=r,e(t)})});return m=e,o}function w(){return{getActiveTracer:function(){return m.getActiveTracer()},getActiveSpan:function(){return m.getActiveSpan()},setActiveTracer:function(t){m.setActiveTracer(t)},setActiveSpan:function(t){m.setActiveSpan(t)}}}function C(){m=P()}function P(t){var e=t?t.getActiveTracer():void 0,n=t?t.getActiveSpan():void 0,r={getActiveTracer:function(){return e},getActiveSpan:function(){return n},setActiveTracer:function(t){e=t},setActiveSpan:function(t){n=t},clone:function(){return P(r)}};return r}function N(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function M(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?N(n,!0).forEach(function(e){o()(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):N(n).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var k={debug:0,event:1,warning:2,error:3,critical:4},j=function(){return{now:function(){return(new Date).getTime()}}},R=function(t,e){return y("webuser".concat(e.clock.now()),t,e)};function A(t){var e=t&&t.clock||j(),n=t&&t.scopeManager||w(),r=t&&t.tracerFactory||R,o=t&&t.outputStream||I(t?t.stream:void 0),u={},a=function(t){var e=n.getActiveSpan();if(e)e.log(t);else{var r=activeTracer.startSpan("unknown-root");r.log(t),r.finish()}},c=function(t,o,a,c){var s=function(){var t=n.getActiveTracer();if(t)return t;var o=r({clock:e,scopeManager:n,tracerFactory:r});return n.setActiveTracer(o),o}(),f=function(t){if(t)return t;var e=n.getActiveSpan();return e?e.context():void 0}(a),p={references:f&&[new i.Reference(c,f)],tags:o},d=s.startSpan(t,p);n.setActiveSpan(d);var l=d.context().toSpanId();return u[l]={span:d,options:p},d};n.setActiveTracer(r(o,{clock:e,scopeManager:n,tracerFactory:r}));var s={logDebug:function(t,e){a(M({$id:t,level:k.debug},e))},logEvent:function(t,e){a(M({$id:t,level:k.event},e))},logWarning:function(t,e){a(M({$id:t,level:k.warning},e))},logError:function(t,e){a(M({$id:t,level:k.error},e))},logCritical:function(t,e){a(M({$id:t,level:k.critical},e))},spanChild:function(t,e,n){return c(t,e,n,i.REFERENCE_CHILD_OF)},spanFollower:function(t,e,n){return c(t,e,n,i.REFERENCE_FOLLOWS_FROM)},finishSpan:function(t){var e=n.getActiveSpan();if(!e)throw new Error("Current scope has no active span");e.finish(),e.doesNotifyTracerOnFinish||s.notifySpanFinished(e)},notifySpanFinished:function(t){var e=t.context(),r=e.toSpanId(),o=e.toTraceId(),i=u[r];if(!i)throw new Error("Trace span not found: id [".concat(r,"]"));var a=i.options.references&&i.options.references[0].referencedContext();if(a&&a.toTraceId()===o){var c=u[a.toSpanId()];c&&n.setActiveSpan(c.span)}else n.setActiveSpan(void 0);delete u[r]}};return{input:s,output:o}}function F(){var t,e,n=(t={},e=function(e){var n=t[e];if(n)return n;var r,o=(r={},{getSpanNode:function(t){return r[t]},setSpanNode:function(t,e){r[t]=e}});return t[e]=o,o},{getSpanNode:function(t,n){return e(t).getSpanNode(n)},setSpanNode:function(t,n,r){return e(t).setSpanNode(n,r)}}),r=D(),o=1,i=void 0,u=function(t){var e=t.traceId,i=t.spanId,u=function(t){var e=function(t){return"StartSpan"===t.token?t.childOf||t.followsFrom:t}(t);if(e){var o=n.getSpanNode(e.traceId,e.spanId);if(o)return o;console.warn("CODEPATH.MODEL>","Span node not found",e)}return r}(t),a=B(o++,u,t);return L(a,u),"StartSpan"===t.token&&n.setSpanNode(e,i,a),a};return{getRootNode:function(){return r},getNodesFlat:function(){return H(r)},publish:function(t){var e=t.filter(function(t){return"EndSpan"!==t.token&&"StartTracer"!==t.token}).map(u);i&&i(e)},subscribe:function(t){i=t},unsubscribe:function(t){i===t&&(i=void 0)},clearAllRows:function(){}}}function D(){return{id:0,entry:void 0,parent:void 0,depth:-1,firstChild:void 0,lastChild:void 0,prevSibling:void 0,nextSibling:void 0}}function B(t,e,n){return{id:t,entry:n,parent:e,depth:e.depth+1,firstChild:void 0,lastChild:void 0,prevSibling:void 0,nextSibling:void 0}}function L(t,e){e.lastChild?(t.prevSibling=e.lastChild,e.lastChild.nextSibling=t):e.firstChild=t,e.lastChild=t}function H(t){if(!t)return[];var e=[];return function t(n){for(var r=n.firstChild;r;r=r.nextSibling)e.push(r),t(r)}(t),e}function U(t,e){var n=void 0,r={},o=function(){var n=t.getRootNode(),o={id:0,entry:void 0,parent:void 0,depth:-1,firstChild:void 0,lastChild:void 0,prevSibling:void 0,nextSibling:void 0};return r[o.id]=o,function t(n,r){var o=function(t){return i(n,t,r)};var u=!n.parent;var a=!u&&e(n);var c=a?o(!0):void 0;for(var s=n.firstChild;s;s=s.nextSibling)t(s,function(){return c||(c=u?r():o(!1)),c})}(n,function(){return o}),o}();return t.subscribe(function(t){var o=t.filter(e),u=[];o.forEach(function(t){var e=i(t,!0,function(){return function t(e){if(!e.parent)return;var n=r[e.parent.id];if(n)return n;return i(e.parent,!1,function(){return t(e.parent)})}(t)});u.push(e)}),n&&n(u)}),{getRootNode:function(){return o},getNodesFlat:function(){return H(o)},subscribe:function(t){n=t},unsubscribe:function(t){n===t&&(n=void 0)}};function i(t,e,n){var o=n(),i=B(t.id,o,t.entry);return r[i.id]=i,L(i,o),i.matched=e,i}}function V(t,e){var n={},r=1,o={toggle:function(t){return n[t].toggle()},expand:function(t){n[t].expand()},collapse:function(t){n[t].collapse()},getIsExpanded:function(t){return n[t].getIsExpanded()},getIsVisible:function(t){return n[t].getIsVisible()},replaceModel:function(t){e.unsubscribe(c),e=t,i()},clearAll:function(){var o;n={},r=1,o=e.getRootNode(),n[o.id]=function(e){var n=0,o=function(){};return{getNode:function(){return e},getParent:o,getPrevSibling:o,getNextSibling:o,getFirstChild:o,getIsExpanded:function(){return!0},getIsVisible:function(){return!0},getSubTreeHeight:function(){return n},updateSubTreeHeight:function(t){n+=t},getIndexVersion:function(){return r},findAbsoluteIndex:function(){return-1},toggle:o,expand:o,collapse:o,showSubNodes:function(e){u(e),t.insertNodes(n,e),n+=e.length}}}(),t.clearAll()},onNodeSelected:function(e){t.onNodeSelected(e)}};return t.attachController(o),i(),o;function i(){o.clearAll(),c(e.getNodesFlat()),e.subscribe(c)}function u(t){var e=!0,r=!1,o=void 0;try{for(var i,u=t[Symbol.iterator]();!(e=(i=u.next()).done);e=!0){var c=i.value,s=a(c);n[c.id]=s}}catch(t){r=!0,o=t}finally{try{e||null==u.return||u.return()}finally{if(r)throw o}}}function a(e){var o=!1,i=0,a=void 0,c=r,s=function(){return n[e.parent.id]},f=function(){return e.prevSibling?n[e.prevSibling.id]:void 0},p=function(){return o},d=function(){var t=s();return t.getIsVisible()&&t.getIsExpanded()},l=function(t){i+=t,c=r,s().updateSubTreeHeight(t)},v=function(){if(!a||c!==r){for(var t=0,e=f();e;e=e.getPrevSibling())t+=1+e.getSubTreeHeight();var n=s().findAbsoluteIndex();a=n+t+1,c=r}return a},_=function(n){if(d()&&p()){var o=v();u(n),t.insertNodes(o+i+1,n),r++,l(+n.length),t.updateNode(o,e)}},h=function(){if(!o&&e.firstChild){for(var t=[],n=e.firstChild;n;n=n.nextSibling)t.push(n);o=!0,_(t)}},g=function(){o=!1,function(){if(d()&&0!==i){var n=v();t.removeNodes(n+1,i),r++,l(-i),t.updateNode(n,e)}}()};return{getNode:function(){return e},getParent:s,getPrevSibling:f,getNextSibling:function(){return e.nextSibling?n[e.nextSibling.id]:void 0},getFirstChild:function(){return e.firstChild?n[e.firstChild.id]:void 0},getIsExpanded:p,getIsVisible:d,getSubTreeHeight:function(){return i},updateSubTreeHeight:l,getIndexVersion:function(){return r},findAbsoluteIndex:v,toggle:function(){return o?g():h(),{isExpanded:o}},expand:h,collapse:g,showSubNodes:_}}function c(t){for(var e=void 0,r=0;r<t.length;r++)e&&e.parentId===t[r].parent.id||o(r);function o(n){i(n),e={parentId:t[n].parent.id,startIndex:n}}function i(r){if(e&&e.startIndex<r){var o=n[e.parentId];if(o){var i=t.slice(e.startIndex,r);o.showSubNodes(i)}}}i(t.length)}}function G(t,e){var n=document.createElement("tbody");t.appendChild(n);var r=void 0,o=void 0,i=function(t){return"string"==typeof t?document.createTextNode(t):t},u=function(t,n,o,u,a){e[o].renderCell(t,r,n).filter(function(t){return!!t}).map(i).forEach(function(t){return a.appendChild(t)})};return{attachController:function(t){r=t},updateNode:function(t,r){for(var o=n.rows[t],i=0;i<e.length;i++){var a=o.cells[i];a.innerHTML="",u(r,t,i,0,a)}},insertNodes:function(t,r){for(var i=function(i){var a=t+i,c=n.insertRow(t+i);c.onclick=function(){o&&o(r[i])};for(var s=0;s<e.length;s++){var f=c.insertCell(s);u(r[i],a,s,0,f)}},a=0;a<r.length;a++)i(a)},removeNodes:function(t,e){for(var r=e-1;r>=0;r--)n.deleteRow(t+r)},clearAll:function(){var e=document.createElement("tbody");t.replaceChild(e,n),n=e,o&&o(void 0)},onNodeSelected:function(t){o=t}}}n.d(e,"createCodePath",function(){return A}),n.d(e,"createDefaultScopeManager",function(){return w}),n.d(e,"trace",function(){return x}),n.d(e,"getCurrentScope",function(){}),n.d(e,"resetCurrentScope",function(){return C}),n.d(e,"createCodePathStream",function(){return I}),n.d(e,"createCodePathTracer",function(){return y}),n.d(e,"contextToPlain",function(){return E}),n.d(e,"plainToContext",function(){return T}),n.d(e,"createCodePathModel",function(){return F}),n.d(e,"createCodePathSearchModel",function(){return U}),n.d(e,"createTreeGridController",function(){return V}),n.d(e,"createTreeGridView",function(){return G})}])});
//# sourceMappingURL=index.js.map