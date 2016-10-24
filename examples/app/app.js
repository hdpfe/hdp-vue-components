webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(1);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _vueRouter = __webpack_require__(3);
	
	var _vueRouter2 = _interopRequireDefault(_vueRouter);
	
	var _routes = __webpack_require__(4);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _hdpVueComponents = __webpack_require__(11);
	
	var _hdpVueComponents2 = _interopRequireDefault(_hdpVueComponents);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.config.debug = true;
	
	_vue2.default.use(_hdpVueComponents2.default.components);
	_vue2.default.use(_vueRouter2.default);
	
	var router = new _vueRouter2.default();
	
	var App = _vue2.default.extend({});
	
	router.map(_routes2.default);
	
	router.start(App, '#app-main');

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * vue-router v0.7.13
	 * (c) 2016 Evan You
	 * Released under the MIT License.
	 */
	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  global.VueRouter = factory();
	}(this, function () { 'use strict';
	
	  var babelHelpers = {};
	
	  babelHelpers.classCallCheck = function (instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };
	  function Target(path, matcher, delegate) {
	    this.path = path;
	    this.matcher = matcher;
	    this.delegate = delegate;
	  }
	
	  Target.prototype = {
	    to: function to(target, callback) {
	      var delegate = this.delegate;
	
	      if (delegate && delegate.willAddRoute) {
	        target = delegate.willAddRoute(this.matcher.target, target);
	      }
	
	      this.matcher.add(this.path, target);
	
	      if (callback) {
	        if (callback.length === 0) {
	          throw new Error("You must have an argument in the function passed to `to`");
	        }
	        this.matcher.addChild(this.path, target, callback, this.delegate);
	      }
	      return this;
	    }
	  };
	
	  function Matcher(target) {
	    this.routes = {};
	    this.children = {};
	    this.target = target;
	  }
	
	  Matcher.prototype = {
	    add: function add(path, handler) {
	      this.routes[path] = handler;
	    },
	
	    addChild: function addChild(path, target, callback, delegate) {
	      var matcher = new Matcher(target);
	      this.children[path] = matcher;
	
	      var match = generateMatch(path, matcher, delegate);
	
	      if (delegate && delegate.contextEntered) {
	        delegate.contextEntered(target, match);
	      }
	
	      callback(match);
	    }
	  };
	
	  function generateMatch(startingPath, matcher, delegate) {
	    return function (path, nestedCallback) {
	      var fullPath = startingPath + path;
	
	      if (nestedCallback) {
	        nestedCallback(generateMatch(fullPath, matcher, delegate));
	      } else {
	        return new Target(startingPath + path, matcher, delegate);
	      }
	    };
	  }
	
	  function addRoute(routeArray, path, handler) {
	    var len = 0;
	    for (var i = 0, l = routeArray.length; i < l; i++) {
	      len += routeArray[i].path.length;
	    }
	
	    path = path.substr(len);
	    var route = { path: path, handler: handler };
	    routeArray.push(route);
	  }
	
	  function eachRoute(baseRoute, matcher, callback, binding) {
	    var routes = matcher.routes;
	
	    for (var path in routes) {
	      if (routes.hasOwnProperty(path)) {
	        var routeArray = baseRoute.slice();
	        addRoute(routeArray, path, routes[path]);
	
	        if (matcher.children[path]) {
	          eachRoute(routeArray, matcher.children[path], callback, binding);
	        } else {
	          callback.call(binding, routeArray);
	        }
	      }
	    }
	  }
	
	  function map (callback, addRouteCallback) {
	    var matcher = new Matcher();
	
	    callback(generateMatch("", matcher, this.delegate));
	
	    eachRoute([], matcher, function (route) {
	      if (addRouteCallback) {
	        addRouteCallback(this, route);
	      } else {
	        this.add(route);
	      }
	    }, this);
	  }
	
	  var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
	
	  var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
	
	  var noWarning = false;
	  function warn(msg) {
	    if (!noWarning && typeof console !== 'undefined') {
	      console.error('[vue-router] ' + msg);
	    }
	  }
	
	  function tryDecode(uri, asComponent) {
	    try {
	      return asComponent ? decodeURIComponent(uri) : decodeURI(uri);
	    } catch (e) {
	      warn('malformed URI' + (asComponent ? ' component: ' : ': ') + uri);
	    }
	  }
	
	  function isArray(test) {
	    return Object.prototype.toString.call(test) === "[object Array]";
	  }
	
	  // A Segment represents a segment in the original route description.
	  // Each Segment type provides an `eachChar` and `regex` method.
	  //
	  // The `eachChar` method invokes the callback with one or more character
	  // specifications. A character specification consumes one or more input
	  // characters.
	  //
	  // The `regex` method returns a regex fragment for the segment. If the
	  // segment is a dynamic of star segment, the regex fragment also includes
	  // a capture.
	  //
	  // A character specification contains:
	  //
	  // * `validChars`: a String with a list of all valid characters, or
	  // * `invalidChars`: a String with a list of all invalid characters
	  // * `repeat`: true if the character specification can repeat
	
	  function StaticSegment(string) {
	    this.string = string;
	  }
	  StaticSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      var string = this.string,
	          ch;
	
	      for (var i = 0, l = string.length; i < l; i++) {
	        ch = string.charAt(i);
	        callback({ validChars: ch });
	      }
	    },
	
	    regex: function regex() {
	      return this.string.replace(escapeRegex, '\\$1');
	    },
	
	    generate: function generate() {
	      return this.string;
	    }
	  };
	
	  function DynamicSegment(name) {
	    this.name = name;
	  }
	  DynamicSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      callback({ invalidChars: "/", repeat: true });
	    },
	
	    regex: function regex() {
	      return "([^/]+)";
	    },
	
	    generate: function generate(params) {
	      var val = params[this.name];
	      return val == null ? ":" + this.name : val;
	    }
	  };
	
	  function StarSegment(name) {
	    this.name = name;
	  }
	  StarSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      callback({ invalidChars: "", repeat: true });
	    },
	
	    regex: function regex() {
	      return "(.+)";
	    },
	
	    generate: function generate(params) {
	      var val = params[this.name];
	      return val == null ? ":" + this.name : val;
	    }
	  };
	
	  function EpsilonSegment() {}
	  EpsilonSegment.prototype = {
	    eachChar: function eachChar() {},
	    regex: function regex() {
	      return "";
	    },
	    generate: function generate() {
	      return "";
	    }
	  };
	
	  function parse(route, names, specificity) {
	    // normalize route as not starting with a "/". Recognition will
	    // also normalize.
	    if (route.charAt(0) === "/") {
	      route = route.substr(1);
	    }
	
	    var segments = route.split("/"),
	        results = [];
	
	    // A routes has specificity determined by the order that its different segments
	    // appear in. This system mirrors how the magnitude of numbers written as strings
	    // works.
	    // Consider a number written as: "abc". An example would be "200". Any other number written
	    // "xyz" will be smaller than "abc" so long as `a > z`. For instance, "199" is smaller
	    // then "200", even though "y" and "z" (which are both 9) are larger than "0" (the value
	    // of (`b` and `c`). This is because the leading symbol, "2", is larger than the other
	    // leading symbol, "1".
	    // The rule is that symbols to the left carry more weight than symbols to the right
	    // when a number is written out as a string. In the above strings, the leading digit
	    // represents how many 100's are in the number, and it carries more weight than the middle
	    // number which represents how many 10's are in the number.
	    // This system of number magnitude works well for route specificity, too. A route written as
	    // `a/b/c` will be more specific than `x/y/z` as long as `a` is more specific than
	    // `x`, irrespective of the other parts.
	    // Because of this similarity, we assign each type of segment a number value written as a
	    // string. We can find the specificity of compound routes by concatenating these strings
	    // together, from left to right. After we have looped through all of the segments,
	    // we convert the string to a number.
	    specificity.val = '';
	
	    for (var i = 0, l = segments.length; i < l; i++) {
	      var segment = segments[i],
	          match;
	
	      if (match = segment.match(/^:([^\/]+)$/)) {
	        results.push(new DynamicSegment(match[1]));
	        names.push(match[1]);
	        specificity.val += '3';
	      } else if (match = segment.match(/^\*([^\/]+)$/)) {
	        results.push(new StarSegment(match[1]));
	        specificity.val += '2';
	        names.push(match[1]);
	      } else if (segment === "") {
	        results.push(new EpsilonSegment());
	        specificity.val += '1';
	      } else {
	        results.push(new StaticSegment(segment));
	        specificity.val += '4';
	      }
	    }
	
	    specificity.val = +specificity.val;
	
	    return results;
	  }
	
	  // A State has a character specification and (`charSpec`) and a list of possible
	  // subsequent states (`nextStates`).
	  //
	  // If a State is an accepting state, it will also have several additional
	  // properties:
	  //
	  // * `regex`: A regular expression that is used to extract parameters from paths
	  //   that reached this accepting state.
	  // * `handlers`: Information on how to convert the list of captures into calls
	  //   to registered handlers with the specified parameters
	  // * `types`: How many static, dynamic or star segments in this route. Used to
	  //   decide which route to use if multiple registered routes match a path.
	  //
	  // Currently, State is implemented naively by looping over `nextStates` and
	  // comparing a character specification against a character. A more efficient
	  // implementation would use a hash of keys pointing at one or more next states.
	
	  function State(charSpec) {
	    this.charSpec = charSpec;
	    this.nextStates = [];
	  }
	
	  State.prototype = {
	    get: function get(charSpec) {
	      var nextStates = this.nextStates;
	
	      for (var i = 0, l = nextStates.length; i < l; i++) {
	        var child = nextStates[i];
	
	        var isEqual = child.charSpec.validChars === charSpec.validChars;
	        isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;
	
	        if (isEqual) {
	          return child;
	        }
	      }
	    },
	
	    put: function put(charSpec) {
	      var state;
	
	      // If the character specification already exists in a child of the current
	      // state, just return that state.
	      if (state = this.get(charSpec)) {
	        return state;
	      }
	
	      // Make a new state for the character spec
	      state = new State(charSpec);
	
	      // Insert the new state as a child of the current state
	      this.nextStates.push(state);
	
	      // If this character specification repeats, insert the new state as a child
	      // of itself. Note that this will not trigger an infinite loop because each
	      // transition during recognition consumes a character.
	      if (charSpec.repeat) {
	        state.nextStates.push(state);
	      }
	
	      // Return the new state
	      return state;
	    },
	
	    // Find a list of child states matching the next character
	    match: function match(ch) {
	      // DEBUG "Processing `" + ch + "`:"
	      var nextStates = this.nextStates,
	          child,
	          charSpec,
	          chars;
	
	      // DEBUG "  " + debugState(this)
	      var returned = [];
	
	      for (var i = 0, l = nextStates.length; i < l; i++) {
	        child = nextStates[i];
	
	        charSpec = child.charSpec;
	
	        if (typeof (chars = charSpec.validChars) !== 'undefined') {
	          if (chars.indexOf(ch) !== -1) {
	            returned.push(child);
	          }
	        } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
	          if (chars.indexOf(ch) === -1) {
	            returned.push(child);
	          }
	        }
	      }
	
	      return returned;
	    }
	
	    /** IF DEBUG
	    , debug: function() {
	      var charSpec = this.charSpec,
	          debug = "[",
	          chars = charSpec.validChars || charSpec.invalidChars;
	       if (charSpec.invalidChars) { debug += "^"; }
	      debug += chars;
	      debug += "]";
	       if (charSpec.repeat) { debug += "+"; }
	       return debug;
	    }
	    END IF **/
	  };
	
	  /** IF DEBUG
	  function debug(log) {
	    console.log(log);
	  }
	
	  function debugState(state) {
	    return state.nextStates.map(function(n) {
	      if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
	      return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
	    }).join(", ")
	  }
	  END IF **/
	
	  // Sort the routes by specificity
	  function sortSolutions(states) {
	    return states.sort(function (a, b) {
	      return b.specificity.val - a.specificity.val;
	    });
	  }
	
	  function recognizeChar(states, ch) {
	    var nextStates = [];
	
	    for (var i = 0, l = states.length; i < l; i++) {
	      var state = states[i];
	
	      nextStates = nextStates.concat(state.match(ch));
	    }
	
	    return nextStates;
	  }
	
	  var oCreate = Object.create || function (proto) {
	    function F() {}
	    F.prototype = proto;
	    return new F();
	  };
	
	  function RecognizeResults(queryParams) {
	    this.queryParams = queryParams || {};
	  }
	  RecognizeResults.prototype = oCreate({
	    splice: Array.prototype.splice,
	    slice: Array.prototype.slice,
	    push: Array.prototype.push,
	    length: 0,
	    queryParams: null
	  });
	
	  function findHandler(state, path, queryParams) {
	    var handlers = state.handlers,
	        regex = state.regex;
	    var captures = path.match(regex),
	        currentCapture = 1;
	    var result = new RecognizeResults(queryParams);
	
	    for (var i = 0, l = handlers.length; i < l; i++) {
	      var handler = handlers[i],
	          names = handler.names,
	          params = {};
	
	      for (var j = 0, m = names.length; j < m; j++) {
	        params[names[j]] = captures[currentCapture++];
	      }
	
	      result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
	    }
	
	    return result;
	  }
	
	  function addSegment(currentState, segment) {
	    segment.eachChar(function (ch) {
	      var state;
	
	      currentState = currentState.put(ch);
	    });
	
	    return currentState;
	  }
	
	  function decodeQueryParamPart(part) {
	    // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
	    part = part.replace(/\+/gm, '%20');
	    return tryDecode(part, true);
	  }
	
	  // The main interface
	
	  var RouteRecognizer = function RouteRecognizer() {
	    this.rootState = new State();
	    this.names = {};
	  };
	
	  RouteRecognizer.prototype = {
	    add: function add(routes, options) {
	      var currentState = this.rootState,
	          regex = "^",
	          specificity = {},
	          handlers = [],
	          allSegments = [],
	          name;
	
	      var isEmpty = true;
	
	      for (var i = 0, l = routes.length; i < l; i++) {
	        var route = routes[i],
	            names = [];
	
	        var segments = parse(route.path, names, specificity);
	
	        allSegments = allSegments.concat(segments);
	
	        for (var j = 0, m = segments.length; j < m; j++) {
	          var segment = segments[j];
	
	          if (segment instanceof EpsilonSegment) {
	            continue;
	          }
	
	          isEmpty = false;
	
	          // Add a "/" for the new segment
	          currentState = currentState.put({ validChars: "/" });
	          regex += "/";
	
	          // Add a representation of the segment to the NFA and regex
	          currentState = addSegment(currentState, segment);
	          regex += segment.regex();
	        }
	
	        var handler = { handler: route.handler, names: names };
	        handlers.push(handler);
	      }
	
	      if (isEmpty) {
	        currentState = currentState.put({ validChars: "/" });
	        regex += "/";
	      }
	
	      currentState.handlers = handlers;
	      currentState.regex = new RegExp(regex + "$");
	      currentState.specificity = specificity;
	
	      if (name = options && options.as) {
	        this.names[name] = {
	          segments: allSegments,
	          handlers: handlers
	        };
	      }
	    },
	
	    handlersFor: function handlersFor(name) {
	      var route = this.names[name],
	          result = [];
	      if (!route) {
	        throw new Error("There is no route named " + name);
	      }
	
	      for (var i = 0, l = route.handlers.length; i < l; i++) {
	        result.push(route.handlers[i]);
	      }
	
	      return result;
	    },
	
	    hasRoute: function hasRoute(name) {
	      return !!this.names[name];
	    },
	
	    generate: function generate(name, params) {
	      var route = this.names[name],
	          output = "";
	      if (!route) {
	        throw new Error("There is no route named " + name);
	      }
	
	      var segments = route.segments;
	
	      for (var i = 0, l = segments.length; i < l; i++) {
	        var segment = segments[i];
	
	        if (segment instanceof EpsilonSegment) {
	          continue;
	        }
	
	        output += "/";
	        output += segment.generate(params);
	      }
	
	      if (output.charAt(0) !== '/') {
	        output = '/' + output;
	      }
	
	      if (params && params.queryParams) {
	        output += this.generateQueryString(params.queryParams);
	      }
	
	      return output;
	    },
	
	    generateQueryString: function generateQueryString(params) {
	      var pairs = [];
	      var keys = [];
	      for (var key in params) {
	        if (params.hasOwnProperty(key)) {
	          keys.push(key);
	        }
	      }
	      keys.sort();
	      for (var i = 0, len = keys.length; i < len; i++) {
	        key = keys[i];
	        var value = params[key];
	        if (value == null) {
	          continue;
	        }
	        var pair = encodeURIComponent(key);
	        if (isArray(value)) {
	          for (var j = 0, l = value.length; j < l; j++) {
	            var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
	            pairs.push(arrayPair);
	          }
	        } else {
	          pair += "=" + encodeURIComponent(value);
	          pairs.push(pair);
	        }
	      }
	
	      if (pairs.length === 0) {
	        return '';
	      }
	
	      return "?" + pairs.join("&");
	    },
	
	    parseQueryString: function parseQueryString(queryString) {
	      var pairs = queryString.split("&"),
	          queryParams = {};
	      for (var i = 0; i < pairs.length; i++) {
	        var pair = pairs[i].split('='),
	            key = decodeQueryParamPart(pair[0]),
	            keyLength = key.length,
	            isArray = false,
	            value;
	        if (pair.length === 1) {
	          value = 'true';
	        } else {
	          //Handle arrays
	          if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
	            isArray = true;
	            key = key.slice(0, keyLength - 2);
	            if (!queryParams[key]) {
	              queryParams[key] = [];
	            }
	          }
	          value = pair[1] ? decodeQueryParamPart(pair[1]) : '';
	        }
	        if (isArray) {
	          queryParams[key].push(value);
	        } else {
	          queryParams[key] = value;
	        }
	      }
	      return queryParams;
	    },
	
	    recognize: function recognize(path, silent) {
	      noWarning = silent;
	      var states = [this.rootState],
	          pathLen,
	          i,
	          l,
	          queryStart,
	          queryParams = {},
	          isSlashDropped = false;
	
	      queryStart = path.indexOf('?');
	      if (queryStart !== -1) {
	        var queryString = path.substr(queryStart + 1, path.length);
	        path = path.substr(0, queryStart);
	        if (queryString) {
	          queryParams = this.parseQueryString(queryString);
	        }
	      }
	
	      path = tryDecode(path);
	      if (!path) return;
	
	      // DEBUG GROUP path
	
	      if (path.charAt(0) !== "/") {
	        path = "/" + path;
	      }
	
	      pathLen = path.length;
	      if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
	        path = path.substr(0, pathLen - 1);
	        isSlashDropped = true;
	      }
	
	      for (i = 0, l = path.length; i < l; i++) {
	        states = recognizeChar(states, path.charAt(i));
	        if (!states.length) {
	          break;
	        }
	      }
	
	      // END DEBUG GROUP
	
	      var solutions = [];
	      for (i = 0, l = states.length; i < l; i++) {
	        if (states[i].handlers) {
	          solutions.push(states[i]);
	        }
	      }
	
	      states = sortSolutions(solutions);
	
	      var state = solutions[0];
	
	      if (state && state.handlers) {
	        // if a trailing slash was dropped and a star segment is the last segment
	        // specified, put the trailing slash back
	        if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
	          path = path + "/";
	        }
	        return findHandler(state, path, queryParams);
	      }
	    }
	  };
	
	  RouteRecognizer.prototype.map = map;
	
	  var genQuery = RouteRecognizer.prototype.generateQueryString;
	
	  // export default for holding the Vue reference
	  var exports$1 = {};
	  /**
	   * Warn stuff.
	   *
	   * @param {String} msg
	   */
	
	  function warn$1(msg) {
	    /* istanbul ignore next */
	    if (typeof console !== 'undefined') {
	      console.error('[vue-router] ' + msg);
	    }
	  }
	
	  /**
	   * Resolve a relative path.
	   *
	   * @param {String} base
	   * @param {String} relative
	   * @param {Boolean} append
	   * @return {String}
	   */
	
	  function resolvePath(base, relative, append) {
	    var query = base.match(/(\?.*)$/);
	    if (query) {
	      query = query[1];
	      base = base.slice(0, -query.length);
	    }
	    // a query!
	    if (relative.charAt(0) === '?') {
	      return base + relative;
	    }
	    var stack = base.split('/');
	    // remove trailing segment if:
	    // - not appending
	    // - appending to trailing slash (last segment is empty)
	    if (!append || !stack[stack.length - 1]) {
	      stack.pop();
	    }
	    // resolve relative path
	    var segments = relative.replace(/^\//, '').split('/');
	    for (var i = 0; i < segments.length; i++) {
	      var segment = segments[i];
	      if (segment === '.') {
	        continue;
	      } else if (segment === '..') {
	        stack.pop();
	      } else {
	        stack.push(segment);
	      }
	    }
	    // ensure leading slash
	    if (stack[0] !== '') {
	      stack.unshift('');
	    }
	    return stack.join('/');
	  }
	
	  /**
	   * Forgiving check for a promise
	   *
	   * @param {Object} p
	   * @return {Boolean}
	   */
	
	  function isPromise(p) {
	    return p && typeof p.then === 'function';
	  }
	
	  /**
	   * Retrive a route config field from a component instance
	   * OR a component contructor.
	   *
	   * @param {Function|Vue} component
	   * @param {String} name
	   * @return {*}
	   */
	
	  function getRouteConfig(component, name) {
	    var options = component && (component.$options || component.options);
	    return options && options.route && options.route[name];
	  }
	
	  /**
	   * Resolve an async component factory. Have to do a dirty
	   * mock here because of Vue core's internal API depends on
	   * an ID check.
	   *
	   * @param {Object} handler
	   * @param {Function} cb
	   */
	
	  var resolver = undefined;
	
	  function resolveAsyncComponent(handler, cb) {
	    if (!resolver) {
	      resolver = {
	        resolve: exports$1.Vue.prototype._resolveComponent,
	        $options: {
	          components: {
	            _: handler.component
	          }
	        }
	      };
	    } else {
	      resolver.$options.components._ = handler.component;
	    }
	    resolver.resolve('_', function (Component) {
	      handler.component = Component;
	      cb(Component);
	    });
	  }
	
	  /**
	   * Map the dynamic segments in a path to params.
	   *
	   * @param {String} path
	   * @param {Object} params
	   * @param {Object} query
	   */
	
	  function mapParams(path, params, query) {
	    if (params === undefined) params = {};
	
	    path = path.replace(/:([^\/]+)/g, function (_, key) {
	      var val = params[key];
	      /* istanbul ignore if */
	      if (!val) {
	        warn$1('param "' + key + '" not found when generating ' + 'path for "' + path + '" with params ' + JSON.stringify(params));
	      }
	      return val || '';
	    });
	    if (query) {
	      path += genQuery(query);
	    }
	    return path;
	  }
	
	  var hashRE = /#.*$/;
	
	  var HTML5History = (function () {
	    function HTML5History(_ref) {
	      var root = _ref.root;
	      var onChange = _ref.onChange;
	      babelHelpers.classCallCheck(this, HTML5History);
	
	      if (root && root !== '/') {
	        // make sure there's the starting slash
	        if (root.charAt(0) !== '/') {
	          root = '/' + root;
	        }
	        // remove trailing slash
	        this.root = root.replace(/\/$/, '');
	        this.rootRE = new RegExp('^\\' + this.root);
	      } else {
	        this.root = null;
	      }
	      this.onChange = onChange;
	      // check base tag
	      var baseEl = document.querySelector('base');
	      this.base = baseEl && baseEl.getAttribute('href');
	    }
	
	    HTML5History.prototype.start = function start() {
	      var _this = this;
	
	      this.listener = function (e) {
	        var url = location.pathname + location.search;
	        if (_this.root) {
	          url = url.replace(_this.rootRE, '');
	        }
	        _this.onChange(url, e && e.state, location.hash);
	      };
	      window.addEventListener('popstate', this.listener);
	      this.listener();
	    };
	
	    HTML5History.prototype.stop = function stop() {
	      window.removeEventListener('popstate', this.listener);
	    };
	
	    HTML5History.prototype.go = function go(path, replace, append) {
	      var url = this.formatPath(path, append);
	      if (replace) {
	        history.replaceState({}, '', url);
	      } else {
	        // record scroll position by replacing current state
	        history.replaceState({
	          pos: {
	            x: window.pageXOffset,
	            y: window.pageYOffset
	          }
	        }, '', location.href);
	        // then push new state
	        history.pushState({}, '', url);
	      }
	      var hashMatch = path.match(hashRE);
	      var hash = hashMatch && hashMatch[0];
	      path = url
	      // strip hash so it doesn't mess up params
	      .replace(hashRE, '')
	      // remove root before matching
	      .replace(this.rootRE, '');
	      this.onChange(path, null, hash);
	    };
	
	    HTML5History.prototype.formatPath = function formatPath(path, append) {
	      return path.charAt(0) === '/'
	      // absolute path
	      ? this.root ? this.root + '/' + path.replace(/^\//, '') : path : resolvePath(this.base || location.pathname, path, append);
	    };
	
	    return HTML5History;
	  })();
	
	  var HashHistory = (function () {
	    function HashHistory(_ref) {
	      var hashbang = _ref.hashbang;
	      var onChange = _ref.onChange;
	      babelHelpers.classCallCheck(this, HashHistory);
	
	      this.hashbang = hashbang;
	      this.onChange = onChange;
	    }
	
	    HashHistory.prototype.start = function start() {
	      var self = this;
	      this.listener = function () {
	        var path = location.hash;
	        var raw = path.replace(/^#!?/, '');
	        // always
	        if (raw.charAt(0) !== '/') {
	          raw = '/' + raw;
	        }
	        var formattedPath = self.formatPath(raw);
	        if (formattedPath !== path) {
	          location.replace(formattedPath);
	          return;
	        }
	        // determine query
	        // note it's possible to have queries in both the actual URL
	        // and the hash fragment itself.
	        var query = location.search && path.indexOf('?') > -1 ? '&' + location.search.slice(1) : location.search;
	        self.onChange(path.replace(/^#!?/, '') + query);
	      };
	      window.addEventListener('hashchange', this.listener);
	      this.listener();
	    };
	
	    HashHistory.prototype.stop = function stop() {
	      window.removeEventListener('hashchange', this.listener);
	    };
	
	    HashHistory.prototype.go = function go(path, replace, append) {
	      path = this.formatPath(path, append);
	      if (replace) {
	        location.replace(path);
	      } else {
	        location.hash = path;
	      }
	    };
	
	    HashHistory.prototype.formatPath = function formatPath(path, append) {
	      var isAbsoloute = path.charAt(0) === '/';
	      var prefix = '#' + (this.hashbang ? '!' : '');
	      return isAbsoloute ? prefix + path : prefix + resolvePath(location.hash.replace(/^#!?/, ''), path, append);
	    };
	
	    return HashHistory;
	  })();
	
	  var AbstractHistory = (function () {
	    function AbstractHistory(_ref) {
	      var onChange = _ref.onChange;
	      babelHelpers.classCallCheck(this, AbstractHistory);
	
	      this.onChange = onChange;
	      this.currentPath = '/';
	    }
	
	    AbstractHistory.prototype.start = function start() {
	      this.onChange('/');
	    };
	
	    AbstractHistory.prototype.stop = function stop() {
	      // noop
	    };
	
	    AbstractHistory.prototype.go = function go(path, replace, append) {
	      path = this.currentPath = this.formatPath(path, append);
	      this.onChange(path);
	    };
	
	    AbstractHistory.prototype.formatPath = function formatPath(path, append) {
	      return path.charAt(0) === '/' ? path : resolvePath(this.currentPath, path, append);
	    };
	
	    return AbstractHistory;
	  })();
	
	  /**
	   * Determine the reusability of an existing router view.
	   *
	   * @param {Directive} view
	   * @param {Object} handler
	   * @param {Transition} transition
	   */
	
	  function canReuse(view, handler, transition) {
	    var component = view.childVM;
	    if (!component || !handler) {
	      return false;
	    }
	    // important: check view.Component here because it may
	    // have been changed in activate hook
	    if (view.Component !== handler.component) {
	      return false;
	    }
	    var canReuseFn = getRouteConfig(component, 'canReuse');
	    return typeof canReuseFn === 'boolean' ? canReuseFn : canReuseFn ? canReuseFn.call(component, {
	      to: transition.to,
	      from: transition.from
	    }) : true; // defaults to true
	  }
	
	  /**
	   * Check if a component can deactivate.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   * @param {Function} next
	   */
	
	  function canDeactivate(view, transition, next) {
	    var fromComponent = view.childVM;
	    var hook = getRouteConfig(fromComponent, 'canDeactivate');
	    if (!hook) {
	      next();
	    } else {
	      transition.callHook(hook, fromComponent, next, {
	        expectBoolean: true
	      });
	    }
	  }
	
	  /**
	   * Check if a component can activate.
	   *
	   * @param {Object} handler
	   * @param {Transition} transition
	   * @param {Function} next
	   */
	
	  function canActivate(handler, transition, next) {
	    resolveAsyncComponent(handler, function (Component) {
	      // have to check due to async-ness
	      if (transition.aborted) {
	        return;
	      }
	      // determine if this component can be activated
	      var hook = getRouteConfig(Component, 'canActivate');
	      if (!hook) {
	        next();
	      } else {
	        transition.callHook(hook, null, next, {
	          expectBoolean: true
	        });
	      }
	    });
	  }
	
	  /**
	   * Call deactivate hooks for existing router-views.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   * @param {Function} next
	   */
	
	  function deactivate(view, transition, next) {
	    var component = view.childVM;
	    var hook = getRouteConfig(component, 'deactivate');
	    if (!hook) {
	      next();
	    } else {
	      transition.callHooks(hook, component, next);
	    }
	  }
	
	  /**
	   * Activate / switch component for a router-view.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   * @param {Number} depth
	   * @param {Function} [cb]
	   */
	
	  function activate(view, transition, depth, cb, reuse) {
	    var handler = transition.activateQueue[depth];
	    if (!handler) {
	      saveChildView(view);
	      if (view._bound) {
	        view.setComponent(null);
	      }
	      cb && cb();
	      return;
	    }
	
	    var Component = view.Component = handler.component;
	    var activateHook = getRouteConfig(Component, 'activate');
	    var dataHook = getRouteConfig(Component, 'data');
	    var waitForData = getRouteConfig(Component, 'waitForData');
	
	    view.depth = depth;
	    view.activated = false;
	
	    var component = undefined;
	    var loading = !!(dataHook && !waitForData);
	
	    // "reuse" is a flag passed down when the parent view is
	    // either reused via keep-alive or as a child of a kept-alive view.
	    // of course we can only reuse if the current kept-alive instance
	    // is of the correct type.
	    reuse = reuse && view.childVM && view.childVM.constructor === Component;
	
	    if (reuse) {
	      // just reuse
	      component = view.childVM;
	      component.$loadingRouteData = loading;
	    } else {
	      saveChildView(view);
	
	      // unbuild current component. this step also destroys
	      // and removes all nested child views.
	      view.unbuild(true);
	
	      // build the new component. this will also create the
	      // direct child view of the current one. it will register
	      // itself as view.childView.
	      component = view.build({
	        _meta: {
	          $loadingRouteData: loading
	        },
	        created: function created() {
	          this._routerView = view;
	        }
	      });
	
	      // handle keep-alive.
	      // when a kept-alive child vm is restored, we need to
	      // add its cached child views into the router's view list,
	      // and also properly update current view's child view.
	      if (view.keepAlive) {
	        component.$loadingRouteData = loading;
	        var cachedChildView = component._keepAliveRouterView;
	        if (cachedChildView) {
	          view.childView = cachedChildView;
	          component._keepAliveRouterView = null;
	        }
	      }
	    }
	
	    // cleanup the component in case the transition is aborted
	    // before the component is ever inserted.
	    var cleanup = function cleanup() {
	      component.$destroy();
	    };
	
	    // actually insert the component and trigger transition
	    var insert = function insert() {
	      if (reuse) {
	        cb && cb();
	        return;
	      }
	      var router = transition.router;
	      if (router._rendered || router._transitionOnLoad) {
	        view.transition(component);
	      } else {
	        // no transition on first render, manual transition
	        /* istanbul ignore if */
	        if (view.setCurrent) {
	          // 0.12 compat
	          view.setCurrent(component);
	        } else {
	          // 1.0
	          view.childVM = component;
	        }
	        component.$before(view.anchor, null, false);
	      }
	      cb && cb();
	    };
	
	    var afterData = function afterData() {
	      // activate the child view
	      if (view.childView) {
	        activate(view.childView, transition, depth + 1, null, reuse || view.keepAlive);
	      }
	      insert();
	    };
	
	    // called after activation hook is resolved
	    var afterActivate = function afterActivate() {
	      view.activated = true;
	      if (dataHook && waitForData) {
	        // wait until data loaded to insert
	        loadData(component, transition, dataHook, afterData, cleanup);
	      } else {
	        // load data and insert at the same time
	        if (dataHook) {
	          loadData(component, transition, dataHook);
	        }
	        afterData();
	      }
	    };
	
	    if (activateHook) {
	      transition.callHooks(activateHook, component, afterActivate, {
	        cleanup: cleanup,
	        postActivate: true
	      });
	    } else {
	      afterActivate();
	    }
	  }
	
	  /**
	   * Reuse a view, just reload data if necessary.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   */
	
	  function reuse(view, transition) {
	    var component = view.childVM;
	    var dataHook = getRouteConfig(component, 'data');
	    if (dataHook) {
	      loadData(component, transition, dataHook);
	    }
	  }
	
	  /**
	   * Asynchronously load and apply data to component.
	   *
	   * @param {Vue} component
	   * @param {Transition} transition
	   * @param {Function} hook
	   * @param {Function} cb
	   * @param {Function} cleanup
	   */
	
	  function loadData(component, transition, hook, cb, cleanup) {
	    component.$loadingRouteData = true;
	    transition.callHooks(hook, component, function () {
	      component.$loadingRouteData = false;
	      component.$emit('route-data-loaded', component);
	      cb && cb();
	    }, {
	      cleanup: cleanup,
	      postActivate: true,
	      processData: function processData(data) {
	        // handle promise sugar syntax
	        var promises = [];
	        if (isPlainObject(data)) {
	          Object.keys(data).forEach(function (key) {
	            var val = data[key];
	            if (isPromise(val)) {
	              promises.push(val.then(function (resolvedVal) {
	                component.$set(key, resolvedVal);
	              }));
	            } else {
	              component.$set(key, val);
	            }
	          });
	        }
	        if (promises.length) {
	          return promises[0].constructor.all(promises);
	        }
	      }
	    });
	  }
	
	  /**
	   * Save the child view for a kept-alive view so that
	   * we can restore it when it is switched back to.
	   *
	   * @param {Directive} view
	   */
	
	  function saveChildView(view) {
	    if (view.keepAlive && view.childVM && view.childView) {
	      view.childVM._keepAliveRouterView = view.childView;
	    }
	    view.childView = null;
	  }
	
	  /**
	   * Check plain object.
	   *
	   * @param {*} val
	   */
	
	  function isPlainObject(val) {
	    return Object.prototype.toString.call(val) === '[object Object]';
	  }
	
	  /**
	   * A RouteTransition object manages the pipeline of a
	   * router-view switching process. This is also the object
	   * passed into user route hooks.
	   *
	   * @param {Router} router
	   * @param {Route} to
	   * @param {Route} from
	   */
	
	  var RouteTransition = (function () {
	    function RouteTransition(router, to, from) {
	      babelHelpers.classCallCheck(this, RouteTransition);
	
	      this.router = router;
	      this.to = to;
	      this.from = from;
	      this.next = null;
	      this.aborted = false;
	      this.done = false;
	    }
	
	    /**
	     * Abort current transition and return to previous location.
	     */
	
	    RouteTransition.prototype.abort = function abort() {
	      if (!this.aborted) {
	        this.aborted = true;
	        // if the root path throws an error during validation
	        // on initial load, it gets caught in an infinite loop.
	        var abortingOnLoad = !this.from.path && this.to.path === '/';
	        if (!abortingOnLoad) {
	          this.router.replace(this.from.path || '/');
	        }
	      }
	    };
	
	    /**
	     * Abort current transition and redirect to a new location.
	     *
	     * @param {String} path
	     */
	
	    RouteTransition.prototype.redirect = function redirect(path) {
	      if (!this.aborted) {
	        this.aborted = true;
	        if (typeof path === 'string') {
	          path = mapParams(path, this.to.params, this.to.query);
	        } else {
	          path.params = path.params || this.to.params;
	          path.query = path.query || this.to.query;
	        }
	        this.router.replace(path);
	      }
	    };
	
	    /**
	     * A router view transition's pipeline can be described as
	     * follows, assuming we are transitioning from an existing
	     * <router-view> chain [Component A, Component B] to a new
	     * chain [Component A, Component C]:
	     *
	     *  A    A
	     *  | => |
	     *  B    C
	     *
	     * 1. Reusablity phase:
	     *   -> canReuse(A, A)
	     *   -> canReuse(B, C)
	     *   -> determine new queues:
	     *      - deactivation: [B]
	     *      - activation: [C]
	     *
	     * 2. Validation phase:
	     *   -> canDeactivate(B)
	     *   -> canActivate(C)
	     *
	     * 3. Activation phase:
	     *   -> deactivate(B)
	     *   -> activate(C)
	     *
	     * Each of these steps can be asynchronous, and any
	     * step can potentially abort the transition.
	     *
	     * @param {Function} cb
	     */
	
	    RouteTransition.prototype.start = function start(cb) {
	      var transition = this;
	
	      // determine the queue of views to deactivate
	      var deactivateQueue = [];
	      var view = this.router._rootView;
	      while (view) {
	        deactivateQueue.unshift(view);
	        view = view.childView;
	      }
	      var reverseDeactivateQueue = deactivateQueue.slice().reverse();
	
	      // determine the queue of route handlers to activate
	      var activateQueue = this.activateQueue = toArray(this.to.matched).map(function (match) {
	        return match.handler;
	      });
	
	      // 1. Reusability phase
	      var i = undefined,
	          reuseQueue = undefined;
	      for (i = 0; i < reverseDeactivateQueue.length; i++) {
	        if (!canReuse(reverseDeactivateQueue[i], activateQueue[i], transition)) {
	          break;
	        }
	      }
	      if (i > 0) {
	        reuseQueue = reverseDeactivateQueue.slice(0, i);
	        deactivateQueue = reverseDeactivateQueue.slice(i).reverse();
	        activateQueue = activateQueue.slice(i);
	      }
	
	      // 2. Validation phase
	      transition.runQueue(deactivateQueue, canDeactivate, function () {
	        transition.runQueue(activateQueue, canActivate, function () {
	          transition.runQueue(deactivateQueue, deactivate, function () {
	            // 3. Activation phase
	
	            // Update router current route
	            transition.router._onTransitionValidated(transition);
	
	            // trigger reuse for all reused views
	            reuseQueue && reuseQueue.forEach(function (view) {
	              return reuse(view, transition);
	            });
	
	            // the root of the chain that needs to be replaced
	            // is the top-most non-reusable view.
	            if (deactivateQueue.length) {
	              var _view = deactivateQueue[deactivateQueue.length - 1];
	              var depth = reuseQueue ? reuseQueue.length : 0;
	              activate(_view, transition, depth, cb);
	            } else {
	              cb();
	            }
	          });
	        });
	      });
	    };
	
	    /**
	     * Asynchronously and sequentially apply a function to a
	     * queue.
	     *
	     * @param {Array} queue
	     * @param {Function} fn
	     * @param {Function} cb
	     */
	
	    RouteTransition.prototype.runQueue = function runQueue(queue, fn, cb) {
	      var transition = this;
	      step(0);
	      function step(index) {
	        if (index >= queue.length) {
	          cb();
	        } else {
	          fn(queue[index], transition, function () {
	            step(index + 1);
	          });
	        }
	      }
	    };
	
	    /**
	     * Call a user provided route transition hook and handle
	     * the response (e.g. if the user returns a promise).
	     *
	     * If the user neither expects an argument nor returns a
	     * promise, the hook is assumed to be synchronous.
	     *
	     * @param {Function} hook
	     * @param {*} [context]
	     * @param {Function} [cb]
	     * @param {Object} [options]
	     *                 - {Boolean} expectBoolean
	     *                 - {Boolean} postActive
	     *                 - {Function} processData
	     *                 - {Function} cleanup
	     */
	
	    RouteTransition.prototype.callHook = function callHook(hook, context, cb) {
	      var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
	      var _ref$expectBoolean = _ref.expectBoolean;
	      var expectBoolean = _ref$expectBoolean === undefined ? false : _ref$expectBoolean;
	      var _ref$postActivate = _ref.postActivate;
	      var postActivate = _ref$postActivate === undefined ? false : _ref$postActivate;
	      var processData = _ref.processData;
	      var cleanup = _ref.cleanup;
	
	      var transition = this;
	      var nextCalled = false;
	
	      // abort the transition
	      var abort = function abort() {
	        cleanup && cleanup();
	        transition.abort();
	      };
	
	      // handle errors
	      var onError = function onError(err) {
	        postActivate ? next() : abort();
	        if (err && !transition.router._suppress) {
	          warn$1('Uncaught error during transition: ');
	          throw err instanceof Error ? err : new Error(err);
	        }
	      };
	
	      // since promise swallows errors, we have to
	      // throw it in the next tick...
	      var onPromiseError = function onPromiseError(err) {
	        try {
	          onError(err);
	        } catch (e) {
	          setTimeout(function () {
	            throw e;
	          }, 0);
	        }
	      };
	
	      // advance the transition to the next step
	      var next = function next() {
	        if (nextCalled) {
	          warn$1('transition.next() should be called only once.');
	          return;
	        }
	        nextCalled = true;
	        if (transition.aborted) {
	          cleanup && cleanup();
	          return;
	        }
	        cb && cb();
	      };
	
	      var nextWithBoolean = function nextWithBoolean(res) {
	        if (typeof res === 'boolean') {
	          res ? next() : abort();
	        } else if (isPromise(res)) {
	          res.then(function (ok) {
	            ok ? next() : abort();
	          }, onPromiseError);
	        } else if (!hook.length) {
	          next();
	        }
	      };
	
	      var nextWithData = function nextWithData(data) {
	        var res = undefined;
	        try {
	          res = processData(data);
	        } catch (err) {
	          return onError(err);
	        }
	        if (isPromise(res)) {
	          res.then(next, onPromiseError);
	        } else {
	          next();
	        }
	      };
	
	      // expose a clone of the transition object, so that each
	      // hook gets a clean copy and prevent the user from
	      // messing with the internals.
	      var exposed = {
	        to: transition.to,
	        from: transition.from,
	        abort: abort,
	        next: processData ? nextWithData : next,
	        redirect: function redirect() {
	          transition.redirect.apply(transition, arguments);
	        }
	      };
	
	      // actually call the hook
	      var res = undefined;
	      try {
	        res = hook.call(context, exposed);
	      } catch (err) {
	        return onError(err);
	      }
	
	      if (expectBoolean) {
	        // boolean hooks
	        nextWithBoolean(res);
	      } else if (isPromise(res)) {
	        // promise
	        if (processData) {
	          res.then(nextWithData, onPromiseError);
	        } else {
	          res.then(next, onPromiseError);
	        }
	      } else if (processData && isPlainOjbect(res)) {
	        // data promise sugar
	        nextWithData(res);
	      } else if (!hook.length) {
	        next();
	      }
	    };
	
	    /**
	     * Call a single hook or an array of async hooks in series.
	     *
	     * @param {Array} hooks
	     * @param {*} context
	     * @param {Function} cb
	     * @param {Object} [options]
	     */
	
	    RouteTransition.prototype.callHooks = function callHooks(hooks, context, cb, options) {
	      var _this = this;
	
	      if (Array.isArray(hooks)) {
	        this.runQueue(hooks, function (hook, _, next) {
	          if (!_this.aborted) {
	            _this.callHook(hook, context, next, options);
	          }
	        }, cb);
	      } else {
	        this.callHook(hooks, context, cb, options);
	      }
	    };
	
	    return RouteTransition;
	  })();
	
	  function isPlainOjbect(val) {
	    return Object.prototype.toString.call(val) === '[object Object]';
	  }
	
	  function toArray(val) {
	    return val ? Array.prototype.slice.call(val) : [];
	  }
	
	  var internalKeysRE = /^(component|subRoutes|fullPath)$/;
	
	  /**
	   * Route Context Object
	   *
	   * @param {String} path
	   * @param {Router} router
	   */
	
	  var Route = function Route(path, router) {
	    var _this = this;
	
	    babelHelpers.classCallCheck(this, Route);
	
	    var matched = router._recognizer.recognize(path);
	    if (matched) {
	      // copy all custom fields from route configs
	      [].forEach.call(matched, function (match) {
	        for (var key in match.handler) {
	          if (!internalKeysRE.test(key)) {
	            _this[key] = match.handler[key];
	          }
	        }
	      });
	      // set query and params
	      this.query = matched.queryParams;
	      this.params = [].reduce.call(matched, function (prev, cur) {
	        if (cur.params) {
	          for (var key in cur.params) {
	            prev[key] = cur.params[key];
	          }
	        }
	        return prev;
	      }, {});
	    }
	    // expose path and router
	    this.path = path;
	    // for internal use
	    this.matched = matched || router._notFoundHandler;
	    // internal reference to router
	    Object.defineProperty(this, 'router', {
	      enumerable: false,
	      value: router
	    });
	    // Important: freeze self to prevent observation
	    Object.freeze(this);
	  };
	
	  function applyOverride (Vue) {
	    var _Vue$util = Vue.util;
	    var extend = _Vue$util.extend;
	    var isArray = _Vue$util.isArray;
	    var defineReactive = _Vue$util.defineReactive;
	
	    // override Vue's init and destroy process to keep track of router instances
	    var init = Vue.prototype._init;
	    Vue.prototype._init = function (options) {
	      options = options || {};
	      var root = options._parent || options.parent || this;
	      var router = root.$router;
	      var route = root.$route;
	      if (router) {
	        // expose router
	        this.$router = router;
	        router._children.push(this);
	        /* istanbul ignore if */
	        if (this._defineMeta) {
	          // 0.12
	          this._defineMeta('$route', route);
	        } else {
	          // 1.0
	          defineReactive(this, '$route', route);
	        }
	      }
	      init.call(this, options);
	    };
	
	    var destroy = Vue.prototype._destroy;
	    Vue.prototype._destroy = function () {
	      if (!this._isBeingDestroyed && this.$router) {
	        this.$router._children.$remove(this);
	      }
	      destroy.apply(this, arguments);
	    };
	
	    // 1.0 only: enable route mixins
	    var strats = Vue.config.optionMergeStrategies;
	    var hooksToMergeRE = /^(data|activate|deactivate)$/;
	
	    if (strats) {
	      strats.route = function (parentVal, childVal) {
	        if (!childVal) return parentVal;
	        if (!parentVal) return childVal;
	        var ret = {};
	        extend(ret, parentVal);
	        for (var key in childVal) {
	          var a = ret[key];
	          var b = childVal[key];
	          // for data, activate and deactivate, we need to merge them into
	          // arrays similar to lifecycle hooks.
	          if (a && hooksToMergeRE.test(key)) {
	            ret[key] = (isArray(a) ? a : [a]).concat(b);
	          } else {
	            ret[key] = b;
	          }
	        }
	        return ret;
	      };
	    }
	  }
	
	  function View (Vue) {
	
	    var _ = Vue.util;
	    var componentDef =
	    // 0.12
	    Vue.directive('_component') ||
	    // 1.0
	    Vue.internalDirectives.component;
	    // <router-view> extends the internal component directive
	    var viewDef = _.extend({}, componentDef);
	
	    // with some overrides
	    _.extend(viewDef, {
	
	      _isRouterView: true,
	
	      bind: function bind() {
	        var route = this.vm.$route;
	        /* istanbul ignore if */
	        if (!route) {
	          warn$1('<router-view> can only be used inside a ' + 'router-enabled app.');
	          return;
	        }
	        // force dynamic directive so v-component doesn't
	        // attempt to build right now
	        this._isDynamicLiteral = true;
	        // finally, init by delegating to v-component
	        componentDef.bind.call(this);
	
	        // locate the parent view
	        var parentView = undefined;
	        var parent = this.vm;
	        while (parent) {
	          if (parent._routerView) {
	            parentView = parent._routerView;
	            break;
	          }
	          parent = parent.$parent;
	        }
	        if (parentView) {
	          // register self as a child of the parent view,
	          // instead of activating now. This is so that the
	          // child's activate hook is called after the
	          // parent's has resolved.
	          this.parentView = parentView;
	          parentView.childView = this;
	        } else {
	          // this is the root view!
	          var router = route.router;
	          router._rootView = this;
	        }
	
	        // handle late-rendered view
	        // two possibilities:
	        // 1. root view rendered after transition has been
	        //    validated;
	        // 2. child view rendered after parent view has been
	        //    activated.
	        var transition = route.router._currentTransition;
	        if (!parentView && transition.done || parentView && parentView.activated) {
	          var depth = parentView ? parentView.depth + 1 : 0;
	          activate(this, transition, depth);
	        }
	      },
	
	      unbind: function unbind() {
	        if (this.parentView) {
	          this.parentView.childView = null;
	        }
	        componentDef.unbind.call(this);
	      }
	    });
	
	    Vue.elementDirective('router-view', viewDef);
	  }
	
	  var trailingSlashRE = /\/$/;
	  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
	  var queryStringRE = /\?.*$/;
	
	  // install v-link, which provides navigation support for
	  // HTML5 history mode
	  function Link (Vue) {
	    var _Vue$util = Vue.util;
	    var _bind = _Vue$util.bind;
	    var isObject = _Vue$util.isObject;
	    var addClass = _Vue$util.addClass;
	    var removeClass = _Vue$util.removeClass;
	
	    var onPriority = Vue.directive('on').priority;
	    var LINK_UPDATE = '__vue-router-link-update__';
	
	    var activeId = 0;
	
	    Vue.directive('link-active', {
	      priority: 9999,
	      bind: function bind() {
	        var _this = this;
	
	        var id = String(activeId++);
	        // collect v-links contained within this element.
	        // we need do this here before the parent-child relationship
	        // gets messed up by terminal directives (if, for, components)
	        var childLinks = this.el.querySelectorAll('[v-link]');
	        for (var i = 0, l = childLinks.length; i < l; i++) {
	          var link = childLinks[i];
	          var existingId = link.getAttribute(LINK_UPDATE);
	          var value = existingId ? existingId + ',' + id : id;
	          // leave a mark on the link element which can be persisted
	          // through fragment clones.
	          link.setAttribute(LINK_UPDATE, value);
	        }
	        this.vm.$on(LINK_UPDATE, this.cb = function (link, path) {
	          if (link.activeIds.indexOf(id) > -1) {
	            link.updateClasses(path, _this.el);
	          }
	        });
	      },
	      unbind: function unbind() {
	        this.vm.$off(LINK_UPDATE, this.cb);
	      }
	    });
	
	    Vue.directive('link', {
	      priority: onPriority - 2,
	
	      bind: function bind() {
	        var vm = this.vm;
	        /* istanbul ignore if */
	        if (!vm.$route) {
	          warn$1('v-link can only be used inside a router-enabled app.');
	          return;
	        }
	        this.router = vm.$route.router;
	        // update things when the route changes
	        this.unwatch = vm.$watch('$route', _bind(this.onRouteUpdate, this));
	        // check v-link-active ids
	        var activeIds = this.el.getAttribute(LINK_UPDATE);
	        if (activeIds) {
	          this.el.removeAttribute(LINK_UPDATE);
	          this.activeIds = activeIds.split(',');
	        }
	        // no need to handle click if link expects to be opened
	        // in a new window/tab.
	        /* istanbul ignore if */
	        if (this.el.tagName === 'A' && this.el.getAttribute('target') === '_blank') {
	          return;
	        }
	        // handle click
	        this.handler = _bind(this.onClick, this);
	        this.el.addEventListener('click', this.handler);
	      },
	
	      update: function update(target) {
	        this.target = target;
	        if (isObject(target)) {
	          this.append = target.append;
	          this.exact = target.exact;
	          this.prevActiveClass = this.activeClass;
	          this.activeClass = target.activeClass;
	        }
	        this.onRouteUpdate(this.vm.$route);
	      },
	
	      onClick: function onClick(e) {
	        // don't redirect with control keys
	        /* istanbul ignore if */
	        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
	        // don't redirect when preventDefault called
	        /* istanbul ignore if */
	        if (e.defaultPrevented) return;
	        // don't redirect on right click
	        /* istanbul ignore if */
	        if (e.button !== 0) return;
	
	        var target = this.target;
	        if (target) {
	          // v-link with expression, just go
	          e.preventDefault();
	          this.router.go(target);
	        } else {
	          // no expression, delegate for an <a> inside
	          var el = e.target;
	          while (el.tagName !== 'A' && el !== this.el) {
	            el = el.parentNode;
	          }
	          if (el.tagName === 'A' && sameOrigin(el)) {
	            e.preventDefault();
	            var path = el.pathname;
	            if (this.router.history.root) {
	              path = path.replace(this.router.history.rootRE, '');
	            }
	            this.router.go({
	              path: path,
	              replace: target && target.replace,
	              append: target && target.append
	            });
	          }
	        }
	      },
	
	      onRouteUpdate: function onRouteUpdate(route) {
	        // router.stringifyPath is dependent on current route
	        // and needs to be called again whenver route changes.
	        var newPath = this.router.stringifyPath(this.target);
	        if (this.path !== newPath) {
	          this.path = newPath;
	          this.updateActiveMatch();
	          this.updateHref();
	        }
	        if (this.activeIds) {
	          this.vm.$emit(LINK_UPDATE, this, route.path);
	        } else {
	          this.updateClasses(route.path, this.el);
	        }
	      },
	
	      updateActiveMatch: function updateActiveMatch() {
	        this.activeRE = this.path && !this.exact ? new RegExp('^' + this.path.replace(/\/$/, '').replace(queryStringRE, '').replace(regexEscapeRE, '\\$&') + '(\\/|$)') : null;
	      },
	
	      updateHref: function updateHref() {
	        if (this.el.tagName !== 'A') {
	          return;
	        }
	        var path = this.path;
	        var router = this.router;
	        var isAbsolute = path.charAt(0) === '/';
	        // do not format non-hash relative paths
	        var href = path && (router.mode === 'hash' || isAbsolute) ? router.history.formatPath(path, this.append) : path;
	        if (href) {
	          this.el.href = href;
	        } else {
	          this.el.removeAttribute('href');
	        }
	      },
	
	      updateClasses: function updateClasses(path, el) {
	        var activeClass = this.activeClass || this.router._linkActiveClass;
	        // clear old class
	        if (this.prevActiveClass && this.prevActiveClass !== activeClass) {
	          toggleClasses(el, this.prevActiveClass, removeClass);
	        }
	        // remove query string before matching
	        var dest = this.path.replace(queryStringRE, '');
	        path = path.replace(queryStringRE, '');
	        // add new class
	        if (this.exact) {
	          if (dest === path ||
	          // also allow additional trailing slash
	          dest.charAt(dest.length - 1) !== '/' && dest === path.replace(trailingSlashRE, '')) {
	            toggleClasses(el, activeClass, addClass);
	          } else {
	            toggleClasses(el, activeClass, removeClass);
	          }
	        } else {
	          if (this.activeRE && this.activeRE.test(path)) {
	            toggleClasses(el, activeClass, addClass);
	          } else {
	            toggleClasses(el, activeClass, removeClass);
	          }
	        }
	      },
	
	      unbind: function unbind() {
	        this.el.removeEventListener('click', this.handler);
	        this.unwatch && this.unwatch();
	      }
	    });
	
	    function sameOrigin(link) {
	      return link.protocol === location.protocol && link.hostname === location.hostname && link.port === location.port;
	    }
	
	    // this function is copied from v-bind:class implementation until
	    // we properly expose it...
	    function toggleClasses(el, key, fn) {
	      key = key.trim();
	      if (key.indexOf(' ') === -1) {
	        fn(el, key);
	        return;
	      }
	      var keys = key.split(/\s+/);
	      for (var i = 0, l = keys.length; i < l; i++) {
	        fn(el, keys[i]);
	      }
	    }
	  }
	
	  var historyBackends = {
	    abstract: AbstractHistory,
	    hash: HashHistory,
	    html5: HTML5History
	  };
	
	  // late bind during install
	  var Vue = undefined;
	
	  /**
	   * Router constructor
	   *
	   * @param {Object} [options]
	   */
	
	  var Router = (function () {
	    function Router() {
	      var _this = this;
	
	      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	      var _ref$hashbang = _ref.hashbang;
	      var hashbang = _ref$hashbang === undefined ? true : _ref$hashbang;
	      var _ref$abstract = _ref.abstract;
	      var abstract = _ref$abstract === undefined ? false : _ref$abstract;
	      var _ref$history = _ref.history;
	      var history = _ref$history === undefined ? false : _ref$history;
	      var _ref$saveScrollPosition = _ref.saveScrollPosition;
	      var saveScrollPosition = _ref$saveScrollPosition === undefined ? false : _ref$saveScrollPosition;
	      var _ref$transitionOnLoad = _ref.transitionOnLoad;
	      var transitionOnLoad = _ref$transitionOnLoad === undefined ? false : _ref$transitionOnLoad;
	      var _ref$suppressTransitionError = _ref.suppressTransitionError;
	      var suppressTransitionError = _ref$suppressTransitionError === undefined ? false : _ref$suppressTransitionError;
	      var _ref$root = _ref.root;
	      var root = _ref$root === undefined ? null : _ref$root;
	      var _ref$linkActiveClass = _ref.linkActiveClass;
	      var linkActiveClass = _ref$linkActiveClass === undefined ? 'v-link-active' : _ref$linkActiveClass;
	      babelHelpers.classCallCheck(this, Router);
	
	      /* istanbul ignore if */
	      if (!Router.installed) {
	        throw new Error('Please install the Router with Vue.use() before ' + 'creating an instance.');
	      }
	
	      // Vue instances
	      this.app = null;
	      this._children = [];
	
	      // route recognizer
	      this._recognizer = new RouteRecognizer();
	      this._guardRecognizer = new RouteRecognizer();
	
	      // state
	      this._started = false;
	      this._startCb = null;
	      this._currentRoute = {};
	      this._currentTransition = null;
	      this._previousTransition = null;
	      this._notFoundHandler = null;
	      this._notFoundRedirect = null;
	      this._beforeEachHooks = [];
	      this._afterEachHooks = [];
	
	      // trigger transition on initial render?
	      this._rendered = false;
	      this._transitionOnLoad = transitionOnLoad;
	
	      // history mode
	      this._root = root;
	      this._abstract = abstract;
	      this._hashbang = hashbang;
	
	      // check if HTML5 history is available
	      var hasPushState = typeof window !== 'undefined' && window.history && window.history.pushState;
	      this._history = history && hasPushState;
	      this._historyFallback = history && !hasPushState;
	
	      // create history object
	      var inBrowser = Vue.util.inBrowser;
	      this.mode = !inBrowser || this._abstract ? 'abstract' : this._history ? 'html5' : 'hash';
	
	      var History = historyBackends[this.mode];
	      this.history = new History({
	        root: root,
	        hashbang: this._hashbang,
	        onChange: function onChange(path, state, anchor) {
	          _this._match(path, state, anchor);
	        }
	      });
	
	      // other options
	      this._saveScrollPosition = saveScrollPosition;
	      this._linkActiveClass = linkActiveClass;
	      this._suppress = suppressTransitionError;
	    }
	
	    /**
	     * Allow directly passing components to a route
	     * definition.
	     *
	     * @param {String} path
	     * @param {Object} handler
	     */
	
	    // API ===================================================
	
	    /**
	    * Register a map of top-level paths.
	    *
	    * @param {Object} map
	    */
	
	    Router.prototype.map = function map(_map) {
	      for (var route in _map) {
	        this.on(route, _map[route]);
	      }
	      return this;
	    };
	
	    /**
	     * Register a single root-level path
	     *
	     * @param {String} rootPath
	     * @param {Object} handler
	     *                 - {String} component
	     *                 - {Object} [subRoutes]
	     *                 - {Boolean} [forceRefresh]
	     *                 - {Function} [before]
	     *                 - {Function} [after]
	     */
	
	    Router.prototype.on = function on(rootPath, handler) {
	      if (rootPath === '*') {
	        this._notFound(handler);
	      } else {
	        this._addRoute(rootPath, handler, []);
	      }
	      return this;
	    };
	
	    /**
	     * Set redirects.
	     *
	     * @param {Object} map
	     */
	
	    Router.prototype.redirect = function redirect(map) {
	      for (var path in map) {
	        this._addRedirect(path, map[path]);
	      }
	      return this;
	    };
	
	    /**
	     * Set aliases.
	     *
	     * @param {Object} map
	     */
	
	    Router.prototype.alias = function alias(map) {
	      for (var path in map) {
	        this._addAlias(path, map[path]);
	      }
	      return this;
	    };
	
	    /**
	     * Set global before hook.
	     *
	     * @param {Function} fn
	     */
	
	    Router.prototype.beforeEach = function beforeEach(fn) {
	      this._beforeEachHooks.push(fn);
	      return this;
	    };
	
	    /**
	     * Set global after hook.
	     *
	     * @param {Function} fn
	     */
	
	    Router.prototype.afterEach = function afterEach(fn) {
	      this._afterEachHooks.push(fn);
	      return this;
	    };
	
	    /**
	     * Navigate to a given path.
	     * The path can be an object describing a named path in
	     * the format of { name: '...', params: {}, query: {}}
	     * The path is assumed to be already decoded, and will
	     * be resolved against root (if provided)
	     *
	     * @param {String|Object} path
	     * @param {Boolean} [replace]
	     */
	
	    Router.prototype.go = function go(path) {
	      var replace = false;
	      var append = false;
	      if (Vue.util.isObject(path)) {
	        replace = path.replace;
	        append = path.append;
	      }
	      path = this.stringifyPath(path);
	      if (path) {
	        this.history.go(path, replace, append);
	      }
	    };
	
	    /**
	     * Short hand for replacing current path
	     *
	     * @param {String} path
	     */
	
	    Router.prototype.replace = function replace(path) {
	      if (typeof path === 'string') {
	        path = { path: path };
	      }
	      path.replace = true;
	      this.go(path);
	    };
	
	    /**
	     * Start the router.
	     *
	     * @param {VueConstructor} App
	     * @param {String|Element} container
	     * @param {Function} [cb]
	     */
	
	    Router.prototype.start = function start(App, container, cb) {
	      /* istanbul ignore if */
	      if (this._started) {
	        warn$1('already started.');
	        return;
	      }
	      this._started = true;
	      this._startCb = cb;
	      if (!this.app) {
	        /* istanbul ignore if */
	        if (!App || !container) {
	          throw new Error('Must start vue-router with a component and a ' + 'root container.');
	        }
	        /* istanbul ignore if */
	        if (App instanceof Vue) {
	          throw new Error('Must start vue-router with a component, not a ' + 'Vue instance.');
	        }
	        this._appContainer = container;
	        var Ctor = this._appConstructor = typeof App === 'function' ? App : Vue.extend(App);
	        // give it a name for better debugging
	        Ctor.options.name = Ctor.options.name || 'RouterApp';
	      }
	
	      // handle history fallback in browsers that do not
	      // support HTML5 history API
	      if (this._historyFallback) {
	        var _location = window.location;
	        var _history = new HTML5History({ root: this._root });
	        var path = _history.root ? _location.pathname.replace(_history.rootRE, '') : _location.pathname;
	        if (path && path !== '/') {
	          _location.assign((_history.root || '') + '/' + this.history.formatPath(path) + _location.search);
	          return;
	        }
	      }
	
	      this.history.start();
	    };
	
	    /**
	     * Stop listening to route changes.
	     */
	
	    Router.prototype.stop = function stop() {
	      this.history.stop();
	      this._started = false;
	    };
	
	    /**
	     * Normalize named route object / string paths into
	     * a string.
	     *
	     * @param {Object|String|Number} path
	     * @return {String}
	     */
	
	    Router.prototype.stringifyPath = function stringifyPath(path) {
	      var generatedPath = '';
	      if (path && typeof path === 'object') {
	        if (path.name) {
	          var extend = Vue.util.extend;
	          var currentParams = this._currentTransition && this._currentTransition.to.params;
	          var targetParams = path.params || {};
	          var params = currentParams ? extend(extend({}, currentParams), targetParams) : targetParams;
	          generatedPath = encodeURI(this._recognizer.generate(path.name, params));
	        } else if (path.path) {
	          generatedPath = encodeURI(path.path);
	        }
	        if (path.query) {
	          // note: the generated query string is pre-URL-encoded by the recognizer
	          var query = this._recognizer.generateQueryString(path.query);
	          if (generatedPath.indexOf('?') > -1) {
	            generatedPath += '&' + query.slice(1);
	          } else {
	            generatedPath += query;
	          }
	        }
	      } else {
	        generatedPath = encodeURI(path ? path + '' : '');
	      }
	      return generatedPath;
	    };
	
	    // Internal methods ======================================
	
	    /**
	    * Add a route containing a list of segments to the internal
	    * route recognizer. Will be called recursively to add all
	    * possible sub-routes.
	    *
	    * @param {String} path
	    * @param {Object} handler
	    * @param {Array} segments
	    */
	
	    Router.prototype._addRoute = function _addRoute(path, handler, segments) {
	      guardComponent(path, handler);
	      handler.path = path;
	      handler.fullPath = (segments.reduce(function (path, segment) {
	        return path + segment.path;
	      }, '') + path).replace('//', '/');
	      segments.push({
	        path: path,
	        handler: handler
	      });
	      this._recognizer.add(segments, {
	        as: handler.name
	      });
	      // add sub routes
	      if (handler.subRoutes) {
	        for (var subPath in handler.subRoutes) {
	          // recursively walk all sub routes
	          this._addRoute(subPath, handler.subRoutes[subPath],
	          // pass a copy in recursion to avoid mutating
	          // across branches
	          segments.slice());
	        }
	      }
	    };
	
	    /**
	     * Set the notFound route handler.
	     *
	     * @param {Object} handler
	     */
	
	    Router.prototype._notFound = function _notFound(handler) {
	      guardComponent('*', handler);
	      this._notFoundHandler = [{ handler: handler }];
	    };
	
	    /**
	     * Add a redirect record.
	     *
	     * @param {String} path
	     * @param {String} redirectPath
	     */
	
	    Router.prototype._addRedirect = function _addRedirect(path, redirectPath) {
	      if (path === '*') {
	        this._notFoundRedirect = redirectPath;
	      } else {
	        this._addGuard(path, redirectPath, this.replace);
	      }
	    };
	
	    /**
	     * Add an alias record.
	     *
	     * @param {String} path
	     * @param {String} aliasPath
	     */
	
	    Router.prototype._addAlias = function _addAlias(path, aliasPath) {
	      this._addGuard(path, aliasPath, this._match);
	    };
	
	    /**
	     * Add a path guard.
	     *
	     * @param {String} path
	     * @param {String} mappedPath
	     * @param {Function} handler
	     */
	
	    Router.prototype._addGuard = function _addGuard(path, mappedPath, _handler) {
	      var _this2 = this;
	
	      this._guardRecognizer.add([{
	        path: path,
	        handler: function handler(match, query) {
	          var realPath = mapParams(mappedPath, match.params, query);
	          _handler.call(_this2, realPath);
	        }
	      }]);
	    };
	
	    /**
	     * Check if a path matches any redirect records.
	     *
	     * @param {String} path
	     * @return {Boolean} - if true, will skip normal match.
	     */
	
	    Router.prototype._checkGuard = function _checkGuard(path) {
	      var matched = this._guardRecognizer.recognize(path, true);
	      if (matched) {
	        matched[0].handler(matched[0], matched.queryParams);
	        return true;
	      } else if (this._notFoundRedirect) {
	        matched = this._recognizer.recognize(path);
	        if (!matched) {
	          this.replace(this._notFoundRedirect);
	          return true;
	        }
	      }
	    };
	
	    /**
	     * Match a URL path and set the route context on vm,
	     * triggering view updates.
	     *
	     * @param {String} path
	     * @param {Object} [state]
	     * @param {String} [anchor]
	     */
	
	    Router.prototype._match = function _match(path, state, anchor) {
	      var _this3 = this;
	
	      if (this._checkGuard(path)) {
	        return;
	      }
	
	      var currentRoute = this._currentRoute;
	      var currentTransition = this._currentTransition;
	
	      if (currentTransition) {
	        if (currentTransition.to.path === path) {
	          // do nothing if we have an active transition going to the same path
	          return;
	        } else if (currentRoute.path === path) {
	          // We are going to the same path, but we also have an ongoing but
	          // not-yet-validated transition. Abort that transition and reset to
	          // prev transition.
	          currentTransition.aborted = true;
	          this._currentTransition = this._prevTransition;
	          return;
	        } else {
	          // going to a totally different path. abort ongoing transition.
	          currentTransition.aborted = true;
	        }
	      }
	
	      // construct new route and transition context
	      var route = new Route(path, this);
	      var transition = new RouteTransition(this, route, currentRoute);
	
	      // current transition is updated right now.
	      // however, current route will only be updated after the transition has
	      // been validated.
	      this._prevTransition = currentTransition;
	      this._currentTransition = transition;
	
	      if (!this.app) {
	        (function () {
	          // initial render
	          var router = _this3;
	          _this3.app = new _this3._appConstructor({
	            el: _this3._appContainer,
	            created: function created() {
	              this.$router = router;
	            },
	            _meta: {
	              $route: route
	            }
	          });
	        })();
	      }
	
	      // check global before hook
	      var beforeHooks = this._beforeEachHooks;
	      var startTransition = function startTransition() {
	        transition.start(function () {
	          _this3._postTransition(route, state, anchor);
	        });
	      };
	
	      if (beforeHooks.length) {
	        transition.runQueue(beforeHooks, function (hook, _, next) {
	          if (transition === _this3._currentTransition) {
	            transition.callHook(hook, null, next, {
	              expectBoolean: true
	            });
	          }
	        }, startTransition);
	      } else {
	        startTransition();
	      }
	
	      if (!this._rendered && this._startCb) {
	        this._startCb.call(null);
	      }
	
	      // HACK:
	      // set rendered to true after the transition start, so
	      // that components that are acitvated synchronously know
	      // whether it is the initial render.
	      this._rendered = true;
	    };
	
	    /**
	     * Set current to the new transition.
	     * This is called by the transition object when the
	     * validation of a route has succeeded.
	     *
	     * @param {Transition} transition
	     */
	
	    Router.prototype._onTransitionValidated = function _onTransitionValidated(transition) {
	      // set current route
	      var route = this._currentRoute = transition.to;
	      // update route context for all children
	      if (this.app.$route !== route) {
	        this.app.$route = route;
	        this._children.forEach(function (child) {
	          child.$route = route;
	        });
	      }
	      // call global after hook
	      if (this._afterEachHooks.length) {
	        this._afterEachHooks.forEach(function (hook) {
	          return hook.call(null, {
	            to: transition.to,
	            from: transition.from
	          });
	        });
	      }
	      this._currentTransition.done = true;
	    };
	
	    /**
	     * Handle stuff after the transition.
	     *
	     * @param {Route} route
	     * @param {Object} [state]
	     * @param {String} [anchor]
	     */
	
	    Router.prototype._postTransition = function _postTransition(route, state, anchor) {
	      // handle scroll positions
	      // saved scroll positions take priority
	      // then we check if the path has an anchor
	      var pos = state && state.pos;
	      if (pos && this._saveScrollPosition) {
	        Vue.nextTick(function () {
	          window.scrollTo(pos.x, pos.y);
	        });
	      } else if (anchor) {
	        Vue.nextTick(function () {
	          var el = document.getElementById(anchor.slice(1));
	          if (el) {
	            window.scrollTo(window.scrollX, el.offsetTop);
	          }
	        });
	      }
	    };
	
	    return Router;
	  })();
	
	  function guardComponent(path, handler) {
	    var comp = handler.component;
	    if (Vue.util.isPlainObject(comp)) {
	      comp = handler.component = Vue.extend(comp);
	    }
	    /* istanbul ignore if */
	    if (typeof comp !== 'function') {
	      handler.component = null;
	      warn$1('invalid component for route "' + path + '".');
	    }
	  }
	
	  /* Installation */
	
	  Router.installed = false;
	
	  /**
	   * Installation interface.
	   * Install the necessary directives.
	   */
	
	  Router.install = function (externalVue) {
	    /* istanbul ignore if */
	    if (Router.installed) {
	      warn$1('already installed.');
	      return;
	    }
	    Vue = externalVue;
	    applyOverride(Vue);
	    View(Vue);
	    Link(Vue);
	    exports$1.Vue = Vue;
	    Router.installed = true;
	  };
	
	  // auto install
	  /* istanbul ignore if */
	  if (typeof window !== 'undefined' && window.Vue) {
	    window.Vue.use(Router);
	  }
	
	  return Router;
	
	}));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "/": {
	        component: __webpack_require__(5)
	    },
	    "/paginations": {
	        component: __webpack_require__(6)
	    },
	    "/modals": {
	        component: __webpack_require__(9)
	    },
	    "/typaheads": {
	        component: __webpack_require__(114)
	    },
	    "/taginputs": {
	        component: __webpack_require__(119)
	    },
	    "/datetimepickers": {
	        component: __webpack_require__(122)
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(7)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] examples-dev\\src\\views\\paginations.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(8)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-0cdc4bc4/paginations.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	
	  methods: {
	    createLink: function createLink(p) {
	      return '/pagination?page=' + p;
	    }
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "\n\n<div>\n    \n    <div>\n        <hdp-pagination :pagesize=\"6\" :total=\"10\" :cur=\"1\" :link=\"createLink\"></hdp-pagination>\n    </div>\n\n    <div>\n        <hdp-pagination :pagesize=\"6\" :total=\"200\" :cur=\"1\"></hdp-pagination>\n    </div>\n\n</div>\n\n";

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(10)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] examples-dev\\src\\views\\modals.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(113)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-414bcaf1/modals.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _hdpVueComponents = __webpack_require__(11);
	
	var _hdpVueComponents2 = _interopRequireDefault(_hdpVueComponents);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = {
	
	    data: function data() {
	        return {
	            showModal: false,
	            showAlert: false,
	            showConfirm: false,
	            showDialog: false,
	            alertMsg: {
	                title: 'alert',
	                content: 'alert content'
	            },
	            confirmMsg: {
	                title: 'confirm',
	                content: 'alert content',
	                cancelText: false
	            },
	            dialogMsg: {
	                title: 'finish your message',
	                confirmText: '提交'
	            },
	            username: 'hdp'
	        };
	    },
	
	    methods: {
	        clickAlert: function clickAlert() {
	            this.showAlert = true;
	            this.alertMsg.title = this.alertMsg.title + 1;
	        },
	        clickAlertOK: function clickAlertOK() {
	            this.showAlert = false;
	        },
	        clickConfirm: function clickConfirm() {
	            this.showConfirm = true;
	            this.confirmMsg.title = this.alertMsg.title + 1;
	        },
	        clickConfirmOK: function clickConfirmOK() {
	            console.log('yeah');
	            this.showConfirm = false;
	        },
	        clickConfirmCancel: function clickConfirmCancel() {
	            console.log('no');
	            this.showConfirm = false;
	        },
	        clickDialog: function clickDialog() {
	            this.showDialog = true;
	        },
	        clickDialogOK: function clickDialogOK() {
	            this.showDialog = false;
	            console.log('submit name:' + this.username);
	        },
	        clickDialogCancel: function clickDialogCancel() {
	            this.showDialog = false;
	            console.log('cancel');
	        }
	    }
	
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _assign = __webpack_require__(12);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var pagination = __webpack_require__(49);
	var modal = __webpack_require__(52);
	var alert = __webpack_require__(59);
	var confirm = __webpack_require__(62);
	var dialog = __webpack_require__(65);
	var typeAheadInterface = __webpack_require__(68);
	var typeAheadText = __webpack_require__(72);
	var typeAheadObject = __webpack_require__(75);
	var taginput = __webpack_require__(78);
	var dateTimePicker = __webpack_require__(83);
	var dateTimeInput = __webpack_require__(110);
	
	var components = {
	    hdpPagination: pagination,
	    hdpModal: modal,
	    hdpAlert: alert,
	    hdpConfirm: confirm,
	    hdpDialog: dialog,
	    hdpTaText: typeAheadText,
	    hdpTaObject: typeAheadObject,
	    hdpTaginput: taginput,
	    hdpDateTimePicker: dateTimePicker,
	    hdpDateTimeInput: dateTimeInput
	};
	
	module.exports = (0, _assign2.default)({
	    components: function install(Vue) {
	        for (var name in components) {
	            Vue.component(name, components[name]);
	        }
	    }
	}, components);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(13), __esModule: true };

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(14);
	module.exports = __webpack_require__(17).Object.assign;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(15);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(30)});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(16)
	  , core      = __webpack_require__(17)
	  , ctx       = __webpack_require__(18)
	  , hide      = __webpack_require__(20)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 16 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 17 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(19);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(21)
	  , createDesc = __webpack_require__(29);
	module.exports = __webpack_require__(25) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(22)
	  , IE8_DOM_DEFINE = __webpack_require__(24)
	  , toPrimitive    = __webpack_require__(28)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(25) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(23);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(25) && !__webpack_require__(26)(function(){
	  return Object.defineProperty(__webpack_require__(27)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(26)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(23)
	  , document = __webpack_require__(16).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(23);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(31)
	  , gOPS     = __webpack_require__(46)
	  , pIE      = __webpack_require__(47)
	  , toObject = __webpack_require__(48)
	  , IObject  = __webpack_require__(35)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(26)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(32)
	  , enumBugKeys = __webpack_require__(45);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(33)
	  , toIObject    = __webpack_require__(34)
	  , arrayIndexOf = __webpack_require__(38)(false)
	  , IE_PROTO     = __webpack_require__(42)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(35)
	  , defined = __webpack_require__(37);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(36);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(34)
	  , toLength  = __webpack_require__(39)
	  , toIndex   = __webpack_require__(41);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(40)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(40)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(43)('keys')
	  , uid    = __webpack_require__(44);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(16)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 46 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 47 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(37);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(50)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\pagination\\pagination.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(51)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-7048c1c4/pagination.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	
	    props: {
	        'cur': Number,
	        'total': Number,
	        'pagesize': {
	            type: Number,
	            default: 20
	        },
	        'pageLink': {
	            type: Function,
	            default: undefined
	        }
	    },
	    data: function data() {
	        return {};
	    },
	    computed: {
	        indexs: function indexs() {
	            var left = 1;
	            var arr = [];
	            var pagenum = Math.ceil(this.total / this.pagesize);
	            var right = pagenum;
	            if (pagenum >= 11) {
	                if (this.cur > 5 && this.cur < pagenum - 4) {
	                    left = this.cur - 5;
	                    right = this.cur + 4;
	                } else {
	                    if (this.cur <= 5) {
	                        left = 1;
	                        right = 10;
	                    } else {
	                        right = pagenum;
	                        left = pagenum - 9;
	                    }
	                }
	            }
	            while (left <= right) {
	                arr.push(left);
	                left++;
	            }
	            if (arr[0] != 1) {
	                arr.unshift('首页');
	            }
	            if (right != pagenum) {
	                arr.push('尾页');
	            }
	            return arr;
	        },
	        pagenum: function pagenum() {
	            return Math.ceil(this.total / this.pagesize);
	        }
	    },
	    methods: {
	        btnClick: function btnClick(data) {
	            if (data === '首页') {
	                this.cur = 1;
	            } else if (data === '尾页') {
	                this.cur = Math.ceil(this.total / this.pagesize);
	            } else if (data != this.cur) {
	                this.cur = data;
	            }
	        }
	    }
	
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = "\n<ul class=\"am-pagination\">\n    <li v-if=\"cur!=1\">\n        <a v-if=\"!pageLink\" v-on:click=\"cur--\">上一页</a>\n        <a v-else v-link=\"pageLink(cur - 1)\">上一页</a>\n    </li>\n    <li v-for=\"index in indexs\"  v-bind:class=\"{ 'am-active': cur == index}\">\n        <a v-if=\"!pageLink\" v-on:click=\"btnClick(index)\">{{ index }}</a>\n        <a v-else v-link=\"pageLink(cur)\">{{ index }}</a>\n    </li>\n    <li v-if=\"cur!=pagenum\">\n        <a v-if=\"!pageLink\" v-on:click=\"cur++\">下一页</a>\n        <a v-else v-link=\"pageLink(cur + 1)\">上一页</a>\n    </li>\n    <li class=\"am-pagination-total\"><span>总数：<i>{{total}}</i></span></li>\n</ul>\n";

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(53)
	__vue_script__ = __webpack_require__(57)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\modal\\modal.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(58)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-0d524b80/modal.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(54);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(56)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./modal.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./modal.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(55)();
	// imports
	
	
	// module
	exports.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.am-modal, .am-dimmer {\n    display: block;\n}\n\n", "", {"version":3,"sources":["/./src/modal/modal.vue?22ef3aca"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;AAkBA;IACA,eAAA;CACA","file":"modal.vue","sourcesContent":["<template>\n    \n    <div>\n        <div class=\"am-modal am-modal-active\" :class=\"className\" tabindex=\"-1\" v-show=\"show\">\n            <div class=\"am-modal-dialog\">\n                <slot name=\"header\"></slot>\n                <slot name=\"body\"></slot>\n                <slot name=\"footer\"></slot>\n            </div>\n        </div>\n\n        <div class=\"am-dimmer\" v-bind:class=\"{'am-active': show}\" v-show=\"show\" v-on:click=\"close\" transition=\"modal-fade\"></div>\n    </div>\n    \n</template>\n\n<style>\n\n.am-modal, .am-dimmer {\n    display: block;\n}\n\n</style>\n\n<script>\n\nexport default {\n    props: {\n        show: {\n            type: Boolean,\n            default: false\n        },\n        closeViaDimmer: { // 是否通过点击遮罩层关闭模态框，默认为true\n            type: Boolean,\n            default: true\n        },\n        className: {\n            type: String,\n            default: \"am-modal-lg\"\n        }\n    },\n\n    transitions: {\n        \"modal-fade\": {\n            beforeEnter(el) {},\n            enter (el) {},\n            afterEnter(el) {},\n            enterCancelled(el) {},\n            beforeLeave(el) {},\n            leave(el) {},\n            afterLeave(el) {},\n            leaveCancelled(el) {}\n        }\n    },\n\n    methods: {\n        close() {\n            if (this.closeViaDimmer) {\n                this.show = false;\n            }\n        }\n    }\n};\n\n</script>\n"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 55 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if (media) {
			styleElement.setAttribute("media", media);
		}
	
		if (sourceMap) {
			// https://developer.chrome.com/devtools/docs/javascript-debugging
			// this makes source maps inside style tags work properly in Chrome
			css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 57 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    props: {
	        show: {
	            type: Boolean,
	            default: false
	        },
	        closeViaDimmer: {
	            type: Boolean,
	            default: true
	        },
	        className: {
	            type: String,
	            default: "am-modal-lg"
	        }
	    },
	
	    transitions: {
	        "modal-fade": {
	            beforeEnter: function beforeEnter(el) {},
	            enter: function enter(el) {},
	            afterEnter: function afterEnter(el) {},
	            enterCancelled: function enterCancelled(el) {},
	            beforeLeave: function beforeLeave(el) {},
	            leave: function leave(el) {},
	            afterLeave: function afterLeave(el) {},
	            leaveCancelled: function leaveCancelled(el) {}
	        }
	    },
	
	    methods: {
	        close: function close() {
	            if (this.closeViaDimmer) {
	                this.show = false;
	            }
	        }
	    }
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = "\n\n<div>\n    <div class=\"am-modal am-modal-active\" :class=\"className\" tabindex=\"-1\" v-show=\"show\">\n        <div class=\"am-modal-dialog\">\n            <slot name=\"header\"></slot>\n            <slot name=\"body\"></slot>\n            <slot name=\"footer\"></slot>\n        </div>\n    </div>\n\n    <div class=\"am-dimmer\" v-bind:class=\"{'am-active': show}\" v-show=\"show\" v-on:click=\"close\" transition=\"modal-fade\"></div>\n</div>\n\n";

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(60)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\modal\\alert.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(61)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-20d7796f/alert.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _modal = __webpack_require__(52);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	
	    props: {
	        msg: {
	            type: Object,
	            default: function _default() {
	                return {
	                    title: '',
	                    content: ''
	                };
	            }
	        },
	        show: {
	            type: Boolean,
	            default: false,
	            twoWay: true
	        },
	        className: {
	            type: String,
	            default: "am-modal-lg"
	        }
	    },
	
	    components: {
	        modal: _modal2.default
	    },
	
	    methods: {
	        ok: function ok() {
	            this.$emit('alert.ok');
	        }
	    }
	
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = "\n\n<modal :show.sync=\"show\" :class-name=\"className\" :close-via-dimmer=\"false\">\n    <div class=\"am-modal-hd\" slot=\"header\" v-if=\"title !== ''\">{{ msg.title }}</div>\n    <div class=\"am-modal-bd\" slot=\"body\">\n        {{{ msg.content }}}\n    </div>\n    <div class=\"am-modal-footer\" slot=\"footer\">\n        <span class=\"am-modal-btn\" v-on:click=\"ok\">确定</span>\n    </div>\n</modal>\n\n";

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(63)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\modal\\confirm.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(64)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-5636dbda/confirm.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _modal = __webpack_require__(52);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	
	    props: {
	        msg: {
	            type: Object,
	            default: function _default() {
	                return {
	                    title: '',
	                    content: '',
	                    confirmText: '',
	                    cancelText: ''
	                };
	            }
	        },
	        show: {
	            type: Boolean,
	            default: false,
	            twoWay: true
	        },
	        className: {
	            type: String,
	            default: "am-modal-lg"
	        }
	    },
	
	    components: {
	        modal: _modal2.default
	    },
	
	    methods: {
	        ok: function ok() {
	            this.$emit('confirm.ok');
	        },
	        cancel: function cancel() {
	            this.$emit('confirm.cancel');
	        }
	    }
	
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = "\n\n<modal :show.sync=\"show\" :class-name=\"className\" :close-via-dimmer=\"false\">\n    <div class=\"am-modal-hd\" slot=\"header\" v-if=\"title !== ''\">{{ msg.title }}</div>\n    <div class=\"am-modal-bd\" slot=\"body\">\n        {{{ msg.content }}}\n    </div>\n    <div class=\"am-modal-footer\" slot=\"footer\">\n        <span class=\"am-modal-btn\" v-if=\"msg.cancelText !== false\" v-on:click=\"cancel\">{{ msg.cancelText || '取消' }}</span>\n        <span class=\"am-modal-btn\" v-on:click=\"ok\">{{ msg.confirmText || '确定' }}</span>\n    </div>\n</modal>\n\n";

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(66)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\modal\\dialog.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(67)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-37b6efc5/dialog.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _modal = __webpack_require__(52);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	
	    props: {
	        msg: {
	            type: Object,
	            default: function _default() {
	                return {
	                    title: '',
	                    confirmText: '',
	                    cancelText: ''
	                };
	            }
	        },
	        show: {
	            type: Boolean,
	            default: false,
	            twoWay: true
	        },
	        className: {
	            type: String,
	            default: "am-modal-lg"
	        }
	    },
	
	    components: {
	        modal: _modal2.default
	    },
	
	    methods: {
	        ok: function ok() {
	            this.$emit('dialog.ok');
	        },
	        cancel: function cancel() {
	            this.$emit('dialog.cancel');
	        }
	    }
	
	};

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = "\n\n<modal :show.sync=\"show\" :class-name=\"className\" :close-via-dimmer=\"false\">\n    <div class=\"am-modal-hd\" slot=\"header\" v-if=\"title !== ''\">{{ msg.title }}</div>\n    <div class=\"am-modal-bd\" slot=\"body\">\n        <slot></slot>\n    </div>\n    <div class=\"am-modal-footer\" slot=\"footer\">\n        <span class=\"am-modal-btn\" v-if=\"msg.cancelText !== false\" v-on:click=\"cancel\">{{ msg.cancelText || '取消' }}</span>\n        <span class=\"am-modal-btn\" v-on:click=\"ok\">{{ msg.confirmText || '确定' }}</span>\n    </div>\n</modal>\n\n";

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(69)
	__vue_script__ = __webpack_require__(71)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\typeahead\\typeAheadInterface.vue: named exports in *.vue files are ignored.")}
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-c16b3816/typeAheadInterface.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(70);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(56)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./typeAheadInterface.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./typeAheadInterface.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(55)();
	// imports
	
	
	// module
	exports.push([module.id, "\n\n.hdp-dropdown {\n    position: relative;\n    display: inline-block;\n}\n.hdp-dropdown input {\n    width: 100%;\n}\n.hdp-dropdown .am-icon-fw {\n    position: absolute;\n    right: 8px;\n    top: 4px;\n}\n.hdp-dropdown-typeahead {\n    position: absolute;\n    display: block;\n    width: 100%;\n    max-height: 200px;\n    padding: 0;\n    margin: 0;\n    overflow-y: auto;\n    text-align: left;\n    background-color: #fff;\n    z-index: 1000;\n}\n.hdp-dropdown-typeahead li {\n    padding: 0 4px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    line-height: 20px;\n}\n.hdp-dropdown-typeahead .active {\n    background-color: #ddd;\n}\n.hdp-dropdown-typeahead li:hover {\n    background-color: #ddd;    \n}\n.hdp-dropdown-text {\n    color: #757575;\n   \n}\n.hdp-dropdown-desc {\n    float: right;\n    font-size: 12px;\n}\n", "", {"version":3,"sources":["/./src/typeahead/typeAheadInterface.vue?e43be53e"],"names":[],"mappings":";;AAEA;IACA,mBAAA;IACA,sBAAA;CACA;AACA;IACA,YAAA;CACA;AACA;IACA,mBAAA;IACA,WAAA;IACA,SAAA;CACA;AACA;IACA,mBAAA;IACA,eAAA;IACA,YAAA;IACA,kBAAA;IACA,WAAA;IACA,UAAA;IACA,iBAAA;IACA,iBAAA;IACA,uBAAA;IACA,cAAA;CACA;AACA;IACA,eAAA;IACA,iBAAA;IACA,wBAAA;IACA,oBAAA;IACA,kBAAA;CACA;AACA;IACA,uBAAA;CACA;AACA;IACA,uBAAA;CACA;AACA;IACA,eAAA;;CAEA;AACA;IACA,aAAA;IACA,gBAAA;CACA","file":"typeAheadInterface.vue","sourcesContent":["<style>\r\n\r\n    .hdp-dropdown {\r\n        position: relative;\r\n        display: inline-block;\r\n    }\r\n    .hdp-dropdown input {\r\n        width: 100%;\r\n    }\r\n    .hdp-dropdown .am-icon-fw {\r\n        position: absolute;\r\n        right: 8px;\r\n        top: 4px;\r\n    }\r\n    .hdp-dropdown-typeahead {\r\n        position: absolute;\r\n        display: block;\r\n        width: 100%;\r\n        max-height: 200px;\r\n        padding: 0;\r\n        margin: 0;\r\n        overflow-y: auto;\r\n        text-align: left;\r\n        background-color: #fff;\r\n        z-index: 1000;\r\n    }\r\n    .hdp-dropdown-typeahead li {\r\n        padding: 0 4px;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n        white-space: nowrap;\r\n        line-height: 20px;\r\n    }\r\n    .hdp-dropdown-typeahead .active {\r\n        background-color: #ddd;\r\n    }\r\n    .hdp-dropdown-typeahead li:hover {\r\n        background-color: #ddd;    \r\n    }\r\n    .hdp-dropdown-text {\r\n        color: #757575;\r\n       \r\n    }\r\n    .hdp-dropdown-desc {\r\n        float: right;\r\n        font-size: 12px;\r\n    }\r\n</style>\r\n\r\n<script>\r\n    export default {\r\n        data () {\r\n            return {\r\n                items: [],\r\n                current: -1,\r\n                loading: false\r\n            }\r\n        },\r\n\r\n        computed: {\r\n            hasItems () {\r\n                return this.items.length > 0\r\n            }\r\n        },\r\n\r\n        ready () {\r\n\r\n        },\r\n\r\n        methods: {\r\n            update () {\r\n                this.timeout && clearTimeout(this.timeout);\r\n                this.timeout = setTimeout(() => {\r\n\r\n                    this.listItem();\r\n\r\n                }, 100);\r\n            },\r\n\r\n            reset () {\r\n                this.items = []\r\n                this.loading = false\r\n            },\r\n\r\n            setActive (index) {\r\n                this.current = index\r\n            },\r\n\r\n            activeClass (index) {\r\n                return {\r\n                    active: this.current === index\r\n                }\r\n            },\r\n\r\n            /**\r\n             * 触发选中\r\n             */\r\n            hit () {\r\n                let text = this.inputData[this.config.textName];\r\n                if (this.current !== -1 && this.items[this.current]) {\r\n                    // 找到列表中的值，选中列表项\r\n                    this.onHit(this.items[this.current])\r\n                }\r\n            },\r\n\r\n            up () {\r\n                if (this.current > 0) {\r\n                    this.current--\r\n                } else if (this.current === -1) {\r\n                    this.current = this.items.length - 1\r\n                } else {\r\n                    this.current = -1\r\n                }\r\n            },\r\n\r\n            down () {\r\n                if (this.current < this.items.length - 1) {\r\n                    this.current++\r\n                } else {\r\n                    this.current = -1\r\n                }\r\n            },\r\n\r\n            onHit (item) {\r\n                // 选中某个项\r\n            },\r\n\r\n            listItem () {\r\n                // 列出下拉列表\r\n\r\n            }\r\n        }\r\n    }\r\n\r\n</script>"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 71 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    data: function data() {
	        return {
	            items: [],
	            current: -1,
	            loading: false
	        };
	    },
	
	
	    computed: {
	        hasItems: function hasItems() {
	            return this.items.length > 0;
	        }
	    },
	
	    ready: function ready() {},
	
	
	    methods: {
	        update: function update() {
	            var _this = this;
	
	            this.timeout && clearTimeout(this.timeout);
	            this.timeout = setTimeout(function () {
	
	                _this.listItem();
	            }, 100);
	        },
	        reset: function reset() {
	            this.items = [];
	            this.loading = false;
	        },
	        setActive: function setActive(index) {
	            this.current = index;
	        },
	        activeClass: function activeClass(index) {
	            return {
	                active: this.current === index
	            };
	        },
	        hit: function hit() {
	            var text = this.inputData[this.config.textName];
	            if (this.current !== -1 && this.items[this.current]) {
	                this.onHit(this.items[this.current]);
	            }
	        },
	        up: function up() {
	            if (this.current > 0) {
	                this.current--;
	            } else if (this.current === -1) {
	                this.current = this.items.length - 1;
	            } else {
	                this.current = -1;
	            }
	        },
	        down: function down() {
	            if (this.current < this.items.length - 1) {
	                this.current++;
	            } else {
	                this.current = -1;
	            }
	        },
	        onHit: function onHit(item) {},
	        listItem: function listItem() {}
	    }
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(73)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\typeahead\\typeAhead_text.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(74)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-19ef2568/typeAhead_text.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeAheadInterface = __webpack_require__(68);
	
	var _typeAheadInterface2 = _interopRequireDefault(_typeAheadInterface);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    extends: _typeAheadInterface2.default,
	
	    props: {
	        config: {
	            type: Object,
	            default: function _default() {
	                return {
	                    placeholder: '',
	
	                    limit: 20,
	
	                    listFun: undefined,
	
	                    alwaysHit: false
	                };
	            }
	        },
	        inputData: {
	            type: String,
	            default: '',
	            twoWay: true
	        },
	        dropdownData: {
	            type: Array,
	            default: function _default() {
	                return [];
	            }
	        }
	    },
	
	    computed: {
	        hasItems: function hasItems() {
	            return this.items.length > 0;
	        }
	    },
	
	    ready: function ready() {},
	
	
	    methods: {
	        listItem: function listItem() {
	
	            if (this.config.listFun) {
	                this.config.listFun.call(this);
	                return;
	            }
	
	            var text = this.inputData;
	            var result = [];
	            var length = 0;
	
	            for (var i = 0, max = this.dropdownData.length; i < max; i++) {
	                if (this.dropdownData[i].indexOf(text) >= 0) {
	                    result.push(this.dropdownData[i]);
	                    length++;
	                }
	                if (this.config.limit && length >= this.config.limit) {
	                    break;
	                }
	            }
	
	            this.items = result;
	            this.current = -1;
	        },
	        listAll: function listAll() {
	            if (this.config.listFun) {
	                this.config.listFun.call(this);
	                return;
	            }
	            this.items = this.dropdownData;
	        },
	        hit: function hit() {
	            var text = this.inputData;
	            if (this.current !== -1 && this.items[this.current]) {
	                this.onHit(this.items[this.current]);
	            } else if (this.config.alwaysHit && String(text).trim() !== '') {
	                this.onHit(text);
	            } else {
	                this.inputData = '';
	                this.items = [];
	            }
	        },
	        onHit: function onHit(item) {
	            this.inputData = item;
	            this.items = [];
	            this.$emit('typeahead.hit', {
	                text: item
	            });
	        },
	        backspace: function backspace() {
	            if (this.inputData === '') {
	                this.$emit('typeahead.backspace');
	            }
	        }
	    }
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"hdp-dropdown\">\n    <!-- optional indicators -->\n    <i class=\"am-icon-fw am-icon-spinner am-icon-pulse\" v-if=\"loading\"></i>\n    <!--<b class=\"fa fa-caret-down\"></b>-->\n\n    <!-- the input field -->\n    <input type=\"text\"\n            placeholder=\"{{config.placeholder}}\"\n             autocomplete=\"off\"\n             v-model=\"inputData\"\n             @keydown.down=\"down\"\n             @keydown.up=\"up\"\n             @blur=\"reset\"\n             @keydown.enter=\"hit\"\n             @input=\"update\"\n             @keydown.delete=\"backspace\"\n             @click=\"listAll\"/>\n\n    <!-- the list -->\n    <ul v-show=\"hasItems\" class=\"dropdown-menu hdp-dropdown-typeahead\">\n        <li v-for=\"item in items\" :class=\"activeClass($index)\" @mousedown=\"hit\" @mousemove=\"setActive($index)\">\n            <span v-text=\"item\" class=\"hdp-dropdown-text\"></span>\n        </li>\n    </ul>\n</div>\n";

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(76)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\typeahead\\typeAhead_object.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(77)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-6ae5adba/typeAhead_object.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeAheadInterface = __webpack_require__(68);
	
	var _typeAheadInterface2 = _interopRequireDefault(_typeAheadInterface);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    extends: _typeAheadInterface2.default,
	
	    props: {
	        config: {
	            type: Object,
	            default: function _default() {
	                return {
	                    placeholder: '',
	
	                    limit: 20,
	
	                    textName: 'text',
	
	                    idName: 'id',
	
	                    listFun: undefined
	                };
	            },
	            coerce: function coerce(config) {
	                if (!config.textName) {
	                    config.textName = 'text';
	                }
	                if (!config.idName) {
	                    config.idName = 'id';
	                }
	                return config;
	            }
	        },
	        inputData: {
	            type: Object,
	            default: function _default() {
	                return {
	                    text: '',
	                    id: ''
	                };
	            }
	        },
	
	        dropdownData: {
	            type: Array,
	            default: function _default() {
	                return [];
	            }
	        }
	    },
	
	    methods: {
	        onHit: function onHit(item) {
	            this.inputData[this.config.idName] = item.id;
	            this.inputData[this.config.textName] = item.text;
	            this.items = [];
	            this.$emit('typeahead.hit', {
	                id: item.id,
	                text: item.text
	            });
	        },
	        listAll: function listAll() {
	            if (this.config.listFun) {
	                this.config.listFun.call(this);
	                return;
	            }
	            this.items = this.dropdownData;
	        },
	        listItem: function listItem() {
	
	            if (this.config.listFun) {
	                this.config.listFun.call(this);
	                return;
	            }
	
	            var text = this.inputData[this.config.textName];
	            var result = [];
	            var length = 0;
	
	            for (var i = 0, max = this.dropdownData.length; i < max; i++) {
	                if (this.dropdownData[i].text.indexOf(text) >= 0) {
	                    result.push(this.dropdownData[i]);
	                    length++;
	                }
	                if (this.config.limit && length >= this.config.limit) {
	                    break;
	                }
	            }
	
	            this.items = result;
	        },
	        blur: function blur() {
	            if (this.inputData[this.config.textName] === '') {
	                this.inputData[this.config.idName] = '';
	                this.items = [];
	            } else {
	                this.hit();
	            }
	        }
	    }
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"hdp-dropdown\">\n    <!-- optional indicators -->\n    <i class=\"am-icon-fw am-icon-spinner am-icon-pulse\" v-if=\"loading\"></i>\n\n    <!-- the input field -->\n    <input type=\"text\"\n            placeholder=\"{{config.placeholder}}\"\n            autocomplete=\"off\"\n            v-model=\"inputData[config.textName]\"\n            @blur=\"blur\"\n            @keydown.down=\"down\"\n            @keydown.up=\"up\"\n            @keydown.enter.prevent=\"hit\"\n            @input=\"update\"\n            @click=\"listAll\"/>\n\n    <!-- the list -->\n    <ul v-show=\"hasItems\" class=\"dropdown-menu hdp-dropdown-typeahead\">\n        <li v-for=\"item in items\" :class=\"activeClass($index)\" @mousedown=\"hit\" @mousemove=\"setActive($index)\">\n            <span v-text=\"item.text\" class=\"hdp-dropdown-text\"></span>\n            <span v-if=\"item.desc\" class=\"hdp-dropdown-desc\">{{ item.desc }}</span>\n        </li>\n    </ul>\n</div>\n";

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(79)
	__vue_script__ = __webpack_require__(81)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\taginput\\taginput.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(82)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-22b16544/taginput.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(80);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(56)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./taginput.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./taginput.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(55)();
	// imports
	
	
	// module
	exports.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.tagInput-container {\n    border:1px #ccc solid;\n    padding:4px;\n    cursor:text;\n    font-size:13px;\n    width:100%;\n    text-align: left;\n}\n\n.tagInput-container input {\n    font-size:13px;\n    clear:both;\n    width:200px;\n    height:30px;\n    border:0;\n    margin-bottom:1px;\n}\n\n.tagInput-container .close {        \n    cursor: pointer;\n    font-size: 16px;\n    padding: 0 2px 0 4px;\n}\n\nli.tagInput-email {\n    float:left;\n    margin-right:2px;\n    margin-bottom:1px;\n    border:1px #BBD8FB solid;\n    padding:2px;\n    background:#F3F7FD;\n}\n\n.tagInput-close {\n    width:16px;\n    height:16px;\n    display:block;\n    float:right;\n    margin:0 3px;\n    cursor: pointer;\n}\n\n.tagInput-container .orochi-dropdown {\n    display: inline-block;\n    width: auto;\n}\n\n.tagInput-container .tag{\n    padding: 4px 4px 4px 6px;\n    background-color: #0e90d2;\n    color: #fff;\n    margin-right: 4px;\n}\n\n.tagInput-container .orochi-dropdown-typeahead {\n    left: -5px;\n}\n", "", {"version":3,"sources":["/./src/taginput/taginput.vue?558df45c"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;AAqBA;IACA,sBAAA;IACA,YAAA;IACA,YAAA;IACA,eAAA;IACA,WAAA;IACA,iBAAA;CACA;;AAEA;IACA,eAAA;IACA,WAAA;IACA,YAAA;IACA,YAAA;IACA,SAAA;IACA,kBAAA;CACA;;AAEA;IACA,gBAAA;IACA,gBAAA;IACA,qBAAA;CACA;;AAEA;IACA,WAAA;IACA,iBAAA;IACA,kBAAA;IACA,yBAAA;IACA,YAAA;IACA,mBAAA;CACA;;AAEA;IACA,WAAA;IACA,YAAA;IACA,cAAA;IACA,YAAA;IACA,aAAA;IACA,gBAAA;CACA;;AAEA;IACA,sBAAA;IACA,YAAA;CACA;;AAEA;IACA,yBAAA;IACA,0BAAA;IACA,YAAA;IACA,kBAAA;CACA;;AAEA;IACA,WAAA;CACA","file":"taginput.vue","sourcesContent":["<template>\n    <div class=\"tagInput-container tags\" @click=\"focus\">\n        <span v-for=\"item in showList\" class=\"tag\">{{item}}<i class=\"close\" @click=\"deleteItem($index)\">×</i></span>\n        <type-ahead-text\n                v-if=\"typeAhead === 'text'\"\n                :input-data.sync=\"textInput\"\n                :config=\"config\"\n                :dropdown-data=\"dropdownData\"\n                v-ref:typeahead>\n        </type-ahead-text>\n        <type-ahead-object\n                v-if=\"typeAhead === 'object'\"\n                :input-data.sync=\"objectInput\"\n                :dropdown-data=\"dropdownData\"\n                :config=\"config\"\n                v-ref:typeahead>\n        </type-ahead-object>\n    </div>\n</template>\n\n<style>\n    .tagInput-container {\n        border:1px #ccc solid;\n        padding:4px;\n        cursor:text;\n        font-size:13px;\n        width:100%;\n        text-align: left;\n    }\n\n    .tagInput-container input {\n        font-size:13px;\n        clear:both;\n        width:200px;\n        height:30px;\n        border:0;\n        margin-bottom:1px;\n    }\n\n    .tagInput-container .close {        \n        cursor: pointer;\n        font-size: 16px;\n        padding: 0 2px 0 4px;\n    }\n\n    li.tagInput-email {\n        float:left;\n        margin-right:2px;\n        margin-bottom:1px;\n        border:1px #BBD8FB solid;\n        padding:2px;\n        background:#F3F7FD;\n    }\n\n    .tagInput-close {\n        width:16px;\n        height:16px;\n        display:block;\n        float:right;\n        margin:0 3px;\n        cursor: pointer;\n    }\n\n    .tagInput-container .orochi-dropdown {\n        display: inline-block;\n        width: auto;\n    }\n\n    .tagInput-container .tag{\n        padding: 4px 4px 4px 6px;\n        background-color: #0e90d2;\n        color: #fff;\n        margin-right: 4px;\n    }\n\n    .tagInput-container .orochi-dropdown-typeahead {\n        left: -5px;\n    }\n</style>\n \n<script>\n    import TypeAheadText from '../typeahead/typeAhead_text.vue';\n    import TypeAheadObject from '../typeahead/typeAhead_object.vue';\n\n    export default {\n\n        data () {\n            return {\n                textInput: '',\n                objectInput: {\n                    id: '',\n                    text: ''\n                },\n                showList: []\n            }\n        },\n\n        components: {\n            TypeAheadText,\n            TypeAheadObject\n        },\n\n        /**\n         * inputList    必选，输入列表\n         * typeAhead    默认text,下拉组件类型\n         * config       可选，传给下拉组件的config\n         * dropdownData 可选，下拉组件的下拉数据，参照下拉组件的参数\n         */\n        props:{\n            typeAhead: {\n                type: String,\n                default: 'text'\n            },\n            config: {\n                type: Object,\n                default () {\n                    return {\n                        // 传入input的id属性名\n                        idName: 'id',\n                        // 传入input的值属性名\n                        textName: 'text',\n                        alwaysHit: true\n                    }\n                }\n            },\n            inputList: {\n                type: Array,\n                twoWay: true,\n                default () {\n                    return []\n                }\n            },\n            dropdownData: {\n                type: Array,\n                default () {\n                    return []\n                }\n            }\n        },\n\n        computed: {},\n\n        ready () {\n            this.$refs.typeahead.$on('typeahead.hit', (data) => {\n                if (this.showList.indexOf(data.text) < 0) {\n                    let input = {\n                        text: data.text,\n                        object: {\n                            id: data.id,\n                            text: data.text\n                        }\n                    }[this.typeAhead];\n                    this.inputList.push(input);\n                    this.showList.push(data.text);\n                    // typeahead.hit事件触发时已经对textInput进行赋值\n                    setTimeout(() => {\n                        this.textInput = '';\n                    });\n                    this.objectInput.text = '';\n                }\n            });\n            this.$refs.typeahead.$on('typeahead.backspace', () => {\n                this.inputList.pop();\n                this.showList.pop();\n            });\n        },\n\n        methods: {\n            focus () {\n                this.$el.querySelector('input').focus();\n            },\n            deleteItem (index) {\n                this.inputList.splice(index, 1);\n                this.showList.splice(index, 1);\n            }\n        }\n\n    }\n\n</script> \n\n"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeAhead_text = __webpack_require__(72);
	
	var _typeAhead_text2 = _interopRequireDefault(_typeAhead_text);
	
	var _typeAhead_object = __webpack_require__(75);
	
	var _typeAhead_object2 = _interopRequireDefault(_typeAhead_object);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    data: function data() {
	        return {
	            textInput: '',
	            objectInput: {
	                id: '',
	                text: ''
	            },
	            showList: []
	        };
	    },
	
	
	    components: {
	        TypeAheadText: _typeAhead_text2.default,
	        TypeAheadObject: _typeAhead_object2.default
	    },
	
	    props: {
	        typeAhead: {
	            type: String,
	            default: 'text'
	        },
	        config: {
	            type: Object,
	            default: function _default() {
	                return {
	                    idName: 'id',
	
	                    textName: 'text',
	                    alwaysHit: true
	                };
	            }
	        },
	        inputList: {
	            type: Array,
	            twoWay: true,
	            default: function _default() {
	                return [];
	            }
	        },
	        dropdownData: {
	            type: Array,
	            default: function _default() {
	                return [];
	            }
	        }
	    },
	
	    computed: {},
	
	    ready: function ready() {
	        var _this = this;
	
	        this.$refs.typeahead.$on('typeahead.hit', function (data) {
	            if (_this.showList.indexOf(data.text) < 0) {
	                var input = {
	                    text: data.text,
	                    object: {
	                        id: data.id,
	                        text: data.text
	                    }
	                }[_this.typeAhead];
	                _this.inputList.push(input);
	                _this.showList.push(data.text);
	
	                setTimeout(function () {
	                    _this.textInput = '';
	                });
	                _this.objectInput.text = '';
	            }
	        });
	        this.$refs.typeahead.$on('typeahead.backspace', function () {
	            _this.inputList.pop();
	            _this.showList.pop();
	        });
	    },
	
	
	    methods: {
	        focus: function focus() {
	            this.$el.querySelector('input').focus();
	        },
	        deleteItem: function deleteItem(index) {
	            this.inputList.splice(index, 1);
	            this.showList.splice(index, 1);
	        }
	    }
	
	};

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"tagInput-container tags\" @click=\"focus\">\n    <span v-for=\"item in showList\" class=\"tag\">{{item}}<i class=\"close\" @click=\"deleteItem($index)\">×</i></span>\n    <type-ahead-text\n            v-if=\"typeAhead === 'text'\"\n            :input-data.sync=\"textInput\"\n            :config=\"config\"\n            :dropdown-data=\"dropdownData\"\n            v-ref:typeahead>\n    </type-ahead-text>\n    <type-ahead-object\n            v-if=\"typeAhead === 'object'\"\n            :input-data.sync=\"objectInput\"\n            :dropdown-data=\"dropdownData\"\n            :config=\"config\"\n            v-ref:typeahead>\n    </type-ahead-object>\n</div>\n";

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(84)
	__vue_script__ = __webpack_require__(86)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\datetimepicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(109)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-dbe69f84/datetimepicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(85);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(56)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./datetimepicker.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./datetimepicker.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(55)();
	// imports
	
	
	// module
	exports.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.am-datepicker {\n    display: block;\n}\n\n", "", {"version":3,"sources":["/./src/datetimepicker/datetimepicker.vue?6369e16c"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;AAsBA;IACA,eAAA;CACA","file":"datetimepicker.vue","sourcesContent":["<template>\n\n<div class=\"am-datepicker\">\n    <div class=\"am-datepicker-caret\" v-if=\"caretDisplayed\"></div>\n    <div class=\"am-datepicker-date\" v-if=\"showDatePicker\" v-show=\"show.date\">\n        <date-picker v-bind:selected-date.sync=\"dateTime\">\n    </div>\n    <div class=\"am-datepicker-time\" v-if=\"showTimePicker\" v-show=\"show.time\">\n        <time-picker v-bind:selected-date.sync=\"dateTime\" v-on:viewchange=\"handleViewChange\">\n    </div>\n    <div class=\"am-datepicker-toggle\" v-if=\"showDatePicker&&showTimePicker\" v-show=\"show.date\" v-on:click=\"handleToggleTime\">\n        <i class=\"am-icon-fw am-icon-clock-o\"></i>\n    </div>\n    <div class=\"am-datepicker-toggle\" v-if=\"showDatePicker&&showTimePicker\" v-show=\"show.time\" v-on:click=\"handleToggleDate\">\n        <i class=\"am-icon-fw am-icon-calendar\"></i>\n    </div>\n</div>\n\n</template>\n\n<style>\n\n.am-datepicker {\n    display: block;\n}\n\n</style>\n\n<script>\n\nimport datePicker from './datepicker.vue';\nimport timePicker from './timepicker.vue';\n\nexport default {\n\n    components: {\n        datePicker,\n        timePicker\n    },\n\n    props: {\n        dateTime: {\n            type: Date,\n            twoWay: true,\n            default() {\n                return new Date();\n            }\n        },\n        showTimePicker: {\n            type: Boolean,\n            default: true\n        },\n        showDatePicker: {\n            type: Boolean,\n            default: true\n        },\n        caretDisplayed: {\n            type: Boolean,\n            default: false\n        },\n        format: {\n            type: String,\n            default: 'YYYY-MM-DD HH:mm'\n        },\n        amStyle: {\n            type: String,\n            default: '',\n            validator(style) {\n                return /success|danger|warning|/.test(style);\n            }\n        },\n        minDate: {\n            type: String,\n            default: ''\n        },\n        maxDate: {\n            type: String,\n            default: ''\n        }\n    },\n\n    compiled() {\n        this.show.date = this.showDatePicker;\n        this.show.time = !this.showDatePicker && this.showTimePicker;\n    },\n\n    data() {\n        return {\n            show: {\n                date: true,\n                time: false\n            }\n        };\n    },\n\n    methods: {\n\n        handleToggleTime() {\n            this.show.date = false,\n            this.show.time = true;\n        },\n\n        handleToggleDate() {\n            this.show.date = true,\n            this.show.time = false;\n        },\n\n        handleViewChange(show) {\n            this.show.date = show.date && this.showDatePicker;\n            this.show.time = show.time || !this.showDatePicker && this.showTimePicker;\n        }\n    }\n\n};\n\n</script>\n"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _datepicker = __webpack_require__(87);
	
	var _datepicker2 = _interopRequireDefault(_datepicker);
	
	var _timepicker = __webpack_require__(100);
	
	var _timepicker2 = _interopRequireDefault(_timepicker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	
	    components: {
	        datePicker: _datepicker2.default,
	        timePicker: _timepicker2.default
	    },
	
	    props: {
	        dateTime: {
	            type: Date,
	            twoWay: true,
	            default: function _default() {
	                return new Date();
	            }
	        },
	        showTimePicker: {
	            type: Boolean,
	            default: true
	        },
	        showDatePicker: {
	            type: Boolean,
	            default: true
	        },
	        caretDisplayed: {
	            type: Boolean,
	            default: false
	        },
	        format: {
	            type: String,
	            default: 'YYYY-MM-DD HH:mm'
	        },
	        amStyle: {
	            type: String,
	            default: '',
	            validator: function validator(style) {
	                return (/success|danger|warning|/.test(style)
	                );
	            }
	        },
	        minDate: {
	            type: String,
	            default: ''
	        },
	        maxDate: {
	            type: String,
	            default: ''
	        }
	    },
	
	    compiled: function compiled() {
	        this.show.date = this.showDatePicker;
	        this.show.time = !this.showDatePicker && this.showTimePicker;
	    },
	    data: function data() {
	        return {
	            show: {
	                date: true,
	                time: false
	            }
	        };
	    },
	
	
	    methods: {
	        handleToggleTime: function handleToggleTime() {
	            this.show.date = false, this.show.time = true;
	        },
	        handleToggleDate: function handleToggleDate() {
	            this.show.date = true, this.show.time = false;
	        },
	        handleViewChange: function handleViewChange(show) {
	            this.show.date = show.date && this.showDatePicker;
	            this.show.time = show.time || !this.showDatePicker && this.showTimePicker;
	        }
	    }
	
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(88)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\datepicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(99)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-a96f919e/datepicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _dayspicker = __webpack_require__(89);
	
	var _dayspicker2 = _interopRequireDefault(_dayspicker);
	
	var _monthspicker = __webpack_require__(93);
	
	var _monthspicker2 = _interopRequireDefault(_monthspicker);
	
	var _yearspicker = __webpack_require__(96);
	
	var _yearspicker2 = _interopRequireDefault(_yearspicker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    props: {
	        selectedDate: {
	            type: Date,
	            twoWay: true,
	            required: true
	        }
	    },
	
	    components: {
	        daysPicker: _dayspicker2.default,
	        monthsPicker: _monthspicker2.default,
	        yearsPicker: _yearspicker2.default
	    },
	
	    data: function data() {
	        var viewDate = new Date(this.selectedDate.valueOf());
	        return {
	            show: {
	                days: true,
	                months: false,
	                years: false
	            },
	            viewDate: viewDate
	        };
	    },
	
	
	    methods: {
	        changshow: function changshow(data) {
	            this.show = data;
	        }
	    },
	
	    events: {
	        "view-change": function viewChange(show) {
	            this.show = show;
	        }
	    }
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(90)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\dayspicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(92)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-137b8ecc/dayspicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _index = __webpack_require__(91);
	
	exports.default = {
	
	    props: {
	        selectedDate: {
	            type: Date,
	            twoWay: true,
	            required: true
	        },
	        viewDate: {
	            type: Date,
	            twoWay: true,
	            required: true
	        },
	        weekStart: {
	            type: Number,
	            default: 7
	        }
	    },
	
	    data: function data() {
	        return {
	            weeks: [7, 1, 2, 3, 4, 5, 6]
	        };
	    },
	
	
	    computed: {
	        days: function days() {
	
	            var days = [];
	
	            var weekStart = 7;
	
	            var weekEnd = (weekStart + 6) % 7;
	
	            var d = this.viewDate;
	            var year = d.getFullYear();
	            var month = d.getMonth();
	            var selectedDate = this.selectedDate;
	
	            var currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0, 0).valueOf();
	
	            var prevMonth = new Date(year, month - 1, 28, 0, 0, 0, 0);
	            var day = _index.dateUtils.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
	
	            prevMonth.setDate(day);
	            prevMonth.setDate(day - (prevMonth.getDay() - weekStart + 7) % 7);
	
	            var nextMonth = new Date(prevMonth);
	
	            nextMonth.setDate(nextMonth.getDate() + 42);
	            nextMonth = nextMonth.valueOf();
	
	            var cells = [],
	                prevY,
	                prevM;
	
	            while (prevMonth.valueOf() < nextMonth) {
	
	                prevY = prevMonth.getFullYear();
	                prevM = prevMonth.getMonth();
	
	                var day = {
	                    show: prevMonth.getDate(),
	                    isActive: false,
	                    isOld: false,
	                    isNew: false
	                };
	
	                if (prevM < month && prevY === year || prevY < year) {
	                    day.isOld = true;
	                } else if (prevM > month && prevY === year || prevY > year) {
	                    day.isNew = true;
	                }
	
	                if (prevMonth.valueOf() === currentDate) {
	                    day.isActive = true;
	                }
	
	                cells.push(day);
	
	                if (prevMonth.getDay() === weekEnd) {
	                    days.push(cells);
	                    cells = [];
	                }
	
	                prevMonth.setDate(prevMonth.getDate() + 1);
	            }
	
	            return days;
	        }
	    },
	
	    filters: {
	        locale: function locale(num) {
	            return {
	                1: '一',
	                2: '二',
	                3: '三',
	                4: '四',
	                5: '五',
	                6: '六',
	                7: '日'
	            }[num];
	        },
	        localMonth: function localMonth(num) {
	            return {
	                0: '一月',
	                1: '二月',
	                2: '三月',
	                3: '四月',
	                4: '五月',
	                5: '六月',
	                6: '七月',
	                7: '八月',
	                8: '九月',
	                9: '十月',
	                10: '十一月',
	                11: '十二月'
	            }[num];
	        }
	    },
	
	    methods: {
	        prevMonth: function prevMonth() {
	            var viewDate = this.viewDate;
	            var newDate = new Date(viewDate.valueOf());
	            newDate.setMonth(viewDate.getMonth() - 1);
	            this.viewDate = newDate;
	        },
	        showMonths: function showMonths() {
	            this.$emit('picker.viewchange', {
	                days: false,
	                months: true,
	                years: false
	            });
	        },
	        nextMonth: function nextMonth() {
	            var viewDate = this.viewDate;
	            var newDate = new Date(viewDate.valueOf());
	            newDate.setMonth(viewDate.getMonth() + 1);
	            this.viewDate = newDate;
	        },
	        setSelectedDate: function setSelectedDate(day) {
	            if (day.isDisabled) {
	                return false;
	            }
	
	            var viewDate = new Date(this.viewDate.valueOf());
	            if (day.isNew) {
	                viewDate.setMonth(viewDate.getMonth() + 1);
	            } else if (day.isOld) {
	                viewDate.setMonth(viewDate.getMonth() - 1);
	            }
	            viewDate.setDate(day.show);
	            this.viewDate = viewDate;
	            this.selectedDate = new Date(viewDate.valueOf());
	        }
	    }
	};

/***/ },
/* 91 */
/***/ function(module, exports) {

	'use strict';
	
	exports.repaintTrigger = function (el) {
	    return el.offsetHeight;
	};
	
	exports.noop = function () {
	    return null;
	};
	
	exports.dateUtils = {
	    isLeapYear: function isLeapYear(year) {
	        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
	    },
	
	    getDaysInMonth: function getDaysInMonth(year, month) {
	        return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	    },
	
	    getLocale: function getLocale(locale) {
	        if (!locale) {
	            locale = navigator.language && navigator.language.split('-');
	            locale[1] = locale[1].toUpperCase();
	            locale = locale.join('_');
	        }
	
	        return locales[locale] || locales['en_US'];
	    }
	};

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker-days\">\n    <table class=\"am-datepicker-table\">\n        <thead>\n        <tr class=\"am-datepicker-header\">\n            <th class=\"am-datepicker-prev\" v-on:click=\"prevMonth\">\n                <i class=\"am-datepicker-prev-icon\"></i>\n            </th>\n            <th class=\"am-datepicker-switch\" colspan=\"5\" v-on:click=\"showMonths\">\n                <div class=\"am-datepicker-select\">\n                    {{ viewDate.getFullYear() }} 年 {{ viewDate.getMonth() | localMonth }}\n                </div>\n            </th>\n            <th class=\"am-datepicker-next\" v-on:click=\"nextMonth\">\n                <i class=\"am-datepicker-next-icon\"></i>\n            </th>\n        </tr>\n        <tr>\n            <th class=\"am-datepicker-dow\" v-for=\"day in weeks\">{{ day | locale }}</th>\n        </tr>\n        </thead>\n        <tbody>\n            <tr v-for=\"row in days\">\n                <td class=\"am-datepicker-day\" v-for=\"day in row\"\n                v-bind:class=\"{\n                    'am-disabled': day.isDisabled,\n                    'am-active': day.isActive,\n                    'am-datepicker-old': day.isOld,\n                    'am-datepicker-new': day.isNew\n                }\"\n                v-on:click=\"setSelectedDate(day)\">{{ day.show }}</td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n\n";

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(94)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\monthspicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(95)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-6eba5ff6/monthspicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 94 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	
	    props: {
	        selectedDate: {
	            twoWay: true,
	            required: true
	        },
	        viewDate: {
	            twoWay: true,
	            required: true
	        }
	    },
	
	    methods: {
	        prevYear: function prevYear() {
	            var viewDate = this.viewDate;
	            var newDate = new Date(viewDate.valueOf());
	            newDate.setFullYear(viewDate.getFullYear() - 1);
	            this.viewDate = newDate;
	        },
	        showYears: function showYears() {
	            this.$emit('picker.viewchange', {
	                days: false,
	                months: false,
	                years: true
	            });
	        },
	        nextYear: function nextYear() {
	            var viewDate = this.viewDate;
	            var newDate = new Date(viewDate.valueOf());
	            newDate.setFullYear(viewDate.getFullYear() + 1);
	            this.viewDate = newDate;
	        },
	        setViewMonth: function setViewMonth(month) {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setMonth(month.show);
	            this.viewDate = newDate;
	            this.$emit('picker.viewchange', {
	                days: true,
	                months: false,
	                years: false
	            });
	        }
	    },
	
	    computed: {
	        months: function months() {
	            var month = this.selectedDate.getMonth();
	            var year = this.selectedDate.getFullYear();
	            var months = [];
	
	            var prevMonth = new Date(year, month);
	
	            for (var i = 0; i < 12; ++i) {
	                var month = {
	                    show: i,
	                    isActive: false
	                };
	
	                if (this.viewDate.getFullYear() === year && i === month) {
	                    month.isActive = true;
	                }
	
	                months.push(month);
	            }
	
	            return months;
	        }
	    },
	
	    filters: {
	        localMonth: function localMonth(num) {
	            return {
	                0: '一月',
	                1: '二月',
	                2: '三月',
	                3: '四月',
	                4: '五月',
	                5: '六月',
	                6: '七月',
	                7: '八月',
	                8: '九月',
	                9: '十月',
	                10: '十一月',
	                11: '十二月'
	            }[num];
	        }
	    }
	
	};

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker-months\">\n    <table class=\"am-datepicker-table\">\n        <thead>\n        <tr class=\"am-datepicker-header\">\n            <th class=\"am-datepicker-prev\" v-on:click=\"prevYear\">\n                <i class=\"am-datepicker-prev-icon\"></i>\n            </th>\n            <th class=\"am-datepicker-switch\" colspan=\"5\" v-on:click=\"showYears\">\n                <div class=\"am-datepicker-select\">\n                    {{ viewDate.getFullYear() }} 年\n                </div>\n            </th>\n            <th class=\"am-datepicker-next\" v-on:click=\"nextYear\">\n                <i class=\"am-datepicker-next-icon\"></i>\n            </th>\n        </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td colspan=\"7\">\n                    <span class=\"am-datepicker-month\" v-for=\"month in months\" v-bind:class=\"{'am-active': month.isActive}\" v-on:click=\"setViewMonth(month)\">\n                        {{ month.show | localMonth }}\n                    </span>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n\n";

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(97)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\yearspicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(98)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-2696c73f/yearspicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 97 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	
	    props: {
	        selectedDate: {
	            twoWay: true,
	            required: true
	        },
	        viewDate: {
	            twoWay: true,
	            required: true
	        }
	    },
	
	    computed: {
	        years: function years() {
	
	            var years = [];
	            var i = -1;
	            var year = parseInt(this.viewDate.getFullYear() / 10, 10) * 10;
	
	            year--;
	
	            while (i < 11) {
	
	                var _year = {
	                    show: year,
	                    isOld: false,
	                    isNew: false,
	                    isActive: false
	                };
	
	                if (i === -1) {
	                    _year.isOld = true;
	                } else if (i === 10) {
	                    _year.isNew = true;
	                }
	
	                if (this.selectedDate.getFullYear() === year) {
	                    _year.isActive = true;
	                }
	
	                years.push(_year);
	
	                year++;
	                i++;
	            }
	
	            return years;
	        },
	        showYear: function showYear() {
	            var year = parseInt(this.viewDate.getFullYear() / 10, 10) * 10;
	            var addYear = year + 9;
	            return year + '-' + addYear;
	        }
	    },
	
	    methods: {
	        prevDecade: function prevDecade() {
	            var viewDate = this.viewDate;
	            var newDate = new Date(viewDate.valueOf());
	            newDate.setFullYear(viewDate.getFullYear() - 10);
	            this.viewDate = newDate;
	        },
	        nextDecade: function nextDecade() {
	            var viewDate = this.viewDate;
	            var newDate = new Date(viewDate.valueOf());
	            newDate.setFullYear(viewDate.getFullYear() + 10);
	            this.viewDate = newDate;
	        },
	        setViewYear: function setViewYear(year) {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setFullYear(year.show);
	            this.viewDate = newDate;
	            this.$emit('picker.viewchange', {
	                days: false,
	                months: true,
	                years: false
	            });
	        }
	    }
	
	};

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker-years\">\n    <table class=\"am-datepicker-table\">\n        <thead>\n        <tr class=\"am-datepicker-header\">\n            <th class=\"am-datepicker-prev\" v-on:click=\"prevDecade\">\n                <i class=\"am-datepicker-prev-icon\"></i>\n            </th>\n            <th class=\"am-datepicker-switch\" colspan=\"5\">\n                <div class=\"am-datepicker-select\">\n                    {{ showYear }}\n                </div>\n            </th>\n            <th class=\"am-datepicker-next\" v-on:click=\"nextDecade\">\n                <i class=\"am-datepicker-next-icon\"></i>\n            </th>\n        </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td colspan=\"7\">\n                    <span class=\"am-datepicker-year\" v-for=\"year in years\" v-bind:class=\"{'am-datepicker-old': year.isOld, 'am-datepicker-new': year.isNew, 'am-active': year.isActive}\" v-on:click=\"setViewYear(year)\">\n                        {{ year.show }}\n                    </span>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n\n";

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker-body\">\n    <days-picker\n            v-bind:selected-date.sync=\"selectedDate\"\n            v-bind:view-date.sync=\"viewDate\"\n            v-show=\"show.days\"\n            @picker.viewchange=\"changshow\">\n    </days-picker>\n    <months-picker\n            v-bind:selected-date.sync=\"selectedDate\"\n            v-bind:view-date.sync=\"viewDate\"\n            v-show=\"show.months\"\n            @picker.viewchange=\"changshow\">\n        </months-picker>\n    <years-picker\n            v-bind:selected-date.sync=\"selectedDate\"\n            v-bind:view-date.sync=\"viewDate\"\n            v-show=\"show.years\"\n            @picker.viewchange=\"changshow\">\n    </years-picker>\n</div>\n\n";

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(101)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\timepicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(108)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-07617f90/timepicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	     value: true
	});
	
	var _minutespicker = __webpack_require__(102);
	
	var _minutespicker2 = _interopRequireDefault(_minutespicker);
	
	var _hourspicker = __webpack_require__(105);
	
	var _hourspicker2 = _interopRequireDefault(_hourspicker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	
	     props: {
	          selectedDate: {
	               type: Date,
	               twoWay: true,
	               required: true
	          }
	     },
	
	     data: function data() {
	          var viewDate = new Date(this.selectedDate.valueOf());
	          return {
	               show: {
	                    wrapper: true,
	                    hours: false,
	                    minutes: false
	               },
	               viewDate: viewDate
	          };
	     },
	
	
	     computed: {
	          time: function time() {
	               var hour = this.viewDate.getHours();
	               var minute = this.viewDate.getMinutes();
	               if (minute < 10) {
	                    minute = '0' + minute;
	               }
	               if (hour < 10) {
	                    hour = '0' + hour;
	               }
	               return {
	                    hour: hour,
	                    minute: minute
	               };
	          },
	          dateShow: function dateShow() {
	               var viewDate = this.viewDate;
	               var year = viewDate.getFullYear();
	               var month = viewDate.getMonth() + 1;
	               if (month < 10) {
	                    month = '0' + month;
	               }
	               var date = viewDate.getDate();
	               if (date < 10) {
	                    date = '0' + date;
	               }
	               return year + '-' + month + '-' + date;
	          }
	     },
	
	     components: {
	          minutesPicker: _minutespicker2.default,
	          hoursPicker: _hourspicker2.default
	     },
	
	     methods: {
	          showHours: function showHours() {
	               this.show = {
	                    wrapper: false,
	                    hours: true,
	                    minutes: false
	               };
	          },
	          showMinutes: function showMinutes() {
	               this.show = {
	                    wrapper: false,
	                    hours: false,
	                    minutes: true
	               };
	          },
	          prevMinute: function prevMinute() {
	               var newDate = new Date(this.viewDate.valueOf());
	               newDate.setMinutes(newDate.getMinutes() - 1);
	               this.viewDate = newDate;
	               this.selectedDate = new Date(newDate.valueOf());
	          },
	          nextMinute: function nextMinute() {
	               var newDate = new Date(this.viewDate.valueOf());
	               newDate.setMinutes(newDate.getMinutes() + 1);
	               this.viewDate = newDate;
	               this.selectedDate = new Date(newDate.valueOf());
	          },
	          showDate: function showDate() {
	               this.$emit('picker.viewchange', {
	                    date: true,
	                    time: false
	               });
	          },
	          changshow: function changshow(data) {
	               this.show = data;
	          }
	     },
	
	     events: {
	          "view-change": function viewChange(show) {
	               this.show = show;
	          }
	     }
	
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(103)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\minutespicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(104)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-d4f26f70/minutespicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 103 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	
	    props: {
	        selectedDate: {
	            twoWay: true,
	            required: true
	        },
	        viewDate: {
	            twoWay: true,
	            required: true
	        }
	    },
	
	    computed: {
	        showText: function showText() {
	            var hour = this.viewDate.getHours();
	            var minute = this.viewDate.getMinutes();
	            if (minute < 10) {
	                minute = '0' + minute;
	            }
	            if (hour < 10) {
	                hour = '0' + hour;
	            }
	            return {
	                hour: hour,
	                minute: minute
	            };
	        },
	        minutes: function minutes() {
	            var minute = this.selectedDate.getMinutes();
	            var hour = this.selectedDate.getHours();
	            var minutes = [];
	            for (var i = 0; i < 60; ++i) {
	                var _minute = {
	                    hour: hour,
	                    show: i,
	                    isActive: false
	                };
	                if (i === minute) {
	                    _minute.isActive = true;
	                }
	                if (i % 5 === 0) {
	                    minutes.push(_minute);
	                }
	            }
	            return minutes;
	        }
	    },
	
	    methods: {
	        prevMinute: function prevMinute() {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setMinutes(newDate.getMinutes() - 1);
	            this.viewDate = newDate;
	            this.selectedDate = new Date(newDate.valueOf());
	        },
	        nextMinute: function nextMinute() {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setMinutes(newDate.getMinutes() + 1);
	            this.viewDate = newDate;
	            this.selectedDate = new Date(newDate.valueOf());
	        },
	        setSelectedMinute: function setSelectedMinute(minute) {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setMinutes(minute.hour);
	            newDate.setMinutes(minute.show);
	            this.viewDate = newDate;
	            this.selectedDate = new Date(newDate.valueOf());
	            this.$emit('picker.viewchange', {
	                wrapper: true,
	                hours: false,
	                minutes: false
	            });
	        }
	    }
	
	};

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker-minutes\">\n    <table class=\"am-datepicker-table\">\n        <thead>\n        <tr class=\"am-datepicker-header\">\n            <th class=\"am-datepicker-prev\" v-on:click=\"prevMinute\">\n                <i class=\"am-datepicker-prev-icon\"></i>\n            </th>\n            <th class=\"am-datepicker-switch\" colspan=\"5\">\n                <div class=\"am-datepicker-select\">{{ showText.hour + ':' + showText.minute }}</div>\n            </th>\n            <th class=\"am-datepicker-next\" v-on:click=\"nextMinute\">\n                <i class=\"am-datepicker-next-icon\"></i>\n            </th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr>\n            <td colspan=\"7\">\n                <span class=\"am-datepicker-minute\" v-for=\"m in minutes\" v-on:click=\"setSelectedMinute(m)\" v-text=\"m.show < 10 ? m.hour + ':0' + m.show : m.hour + ':' + m.show\"></span>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n\n";

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(106)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\hourspicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(107)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-b829c990/hourspicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 106 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	
	    props: {
	        selectedDate: {
	            twoWay: true,
	            required: true
	        },
	        viewDate: {
	            twoWay: true,
	            required: true
	        }
	    },
	
	    computed: {
	        showText: function showText() {
	            var hour = this.viewDate.getHours();
	            var minute = this.viewDate.getMinutes();
	            if (minute < 10) {
	                minute = '0' + minute;
	            }
	            if (hour < 10) {
	                hour = '0' + hour;
	            }
	            return {
	                hour: hour,
	                minute: minute
	            };
	        },
	        hours: function hours() {
	            var hour = this.selectedDate.getHours();
	            var hours = [];
	            for (var i = 0; i < 24; ++i) {
	                var _hour = {
	                    show: i,
	                    isActive: false
	                };
	                if (i === hour) {
	                    _hour.isActive = true;
	                }
	                hours.push(_hour);
	            }
	            return hours;
	        }
	    },
	
	    methods: {
	        prevHour: function prevHour() {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setHours(newDate.getHours() - 1);
	            this.viewDate = newDate;
	            this.selectedDate = new Date(newDate.valueOf());
	        },
	        nextHour: function nextHour() {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setHours(newDate.getHours() + 1);
	            this.viewDate = newDate;
	            this.selectedDate = new Date(newDate.valueOf());
	        },
	        setSelectedHour: function setSelectedHour(hour) {
	            var newDate = new Date(this.viewDate.valueOf());
	            newDate.setHours(hour.show);
	            this.viewDate = newDate;
	            this.selectedDate = new Date(newDate.valueOf());
	            this.$emit('picker.viewchange', {
	                wrapper: true,
	                hours: false,
	                minutes: false
	            });
	        }
	    }
	
	};

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker-hours\">\n    <table class=\"am-datepicker-table\">\n        <thead>\n        <tr class=\"am-datepicker-header\">\n            <th class=\"am-datepicker-prev\" v-on:click=\"prevHour\">\n                <i class=\"am-datepicker-prev-icon\"></i>\n            </th>\n            <th class=\"am-datepicker-switch\" colspan=\"5\">\n                <div class=\"am-datepicker-select\">{{ showText.hour + ':' + showText.minute }}</div>\n            </th>\n            <th class=\"am-datepicker-next\" v-on:click=\"nextHour\">\n                <i class=\"am-datepicker-next-icon\"></i>\n            </th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr>\n            <td colspan=\"7\">\n                <span class=\"am-datepicker-hour\" v-for=\"h in hours\" v-bind:class=\"{'am-active': h.isActive}\" v-on:click=\"setSelectedHour(h)\" v-text=\"h.show < 10 ? '0' + h.show + ':00' : h.show + ':00'\"></span>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n\n";

/***/ },
/* 108 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker-body\">\n     <div class=\"am-datepicker-time-wrapper\" v-show=\"show.wrapper\">\n          <table class=\"am-datepicker-table\">\n               <thead>\n               <tr class=\"am-datepicker-header\">\n                    <th class=\"am-datepicker-prev\" v-on:click=\"prevMinute\">\n                         <i class=\"am-datepicker-prev-icon\"></i>\n                    </th>\n                    <th class=\"am-datepicker-switch\" colspan=\"5\" v-on:click=\"showDate\">\n                         <div class=\"am-datepicker-select\">{{ dateShow }}</div>\n                    </th>\n                    <th class=\"am-datepicker-next\" v-on:click=\"nextMinute\">\n                         <i class=\"am-datepicker-next-icon\"></i>\n                    </th>\n               </tr>\n               </thead>\n               <tbody>\n               <tr>\n                    <td colspan=\"7\">\n                         <div class=\"am-datepicker-time-box\">\n                              <strong v-on:click=\"showHours\">{{ time.hour }}</strong><em>:</em><strong v-on:click=\"showMinutes\">{{ time.minute }}</strong>\n                         </div>\n                    </td>\n               </tr>\n               </tbody>\n          </table>\n     </div>\n     <hours-picker\n            v-bind:selected-date.sync=\"selectedDate\"\n            v-bind:view-date.sync=\"viewDate\"\n            v-show=\"show.hours\"\n            @picker.viewchange=\"changshow\">\n      </hours-picker>\n     <minutes-picker\n            v-bind:selected-date.sync=\"selectedDate\"\n            v-bind:view-date.sync=\"viewDate\"\n            v-show=\"show.minutes\"\n            @picker.viewchange=\"changshow\">\n      </minutes-picker>\n</div>\n\n";

/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-datepicker\">\n    <div class=\"am-datepicker-caret\" v-if=\"caretDisplayed\"></div>\n    <div class=\"am-datepicker-date\" v-if=\"showDatePicker\" v-show=\"show.date\">\n        <date-picker v-bind:selected-date.sync=\"dateTime\">\n    </div>\n    <div class=\"am-datepicker-time\" v-if=\"showTimePicker\" v-show=\"show.time\">\n        <time-picker v-bind:selected-date.sync=\"dateTime\" v-on:viewchange=\"handleViewChange\">\n    </div>\n    <div class=\"am-datepicker-toggle\" v-if=\"showDatePicker&&showTimePicker\" v-show=\"show.date\" v-on:click=\"handleToggleTime\">\n        <i class=\"am-icon-fw am-icon-clock-o\"></i>\n    </div>\n    <div class=\"am-datepicker-toggle\" v-if=\"showDatePicker&&showTimePicker\" v-show=\"show.time\" v-on:click=\"handleToggleDate\">\n        <i class=\"am-icon-fw am-icon-calendar\"></i>\n    </div>\n</div>\n\n";

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(111)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\datetimepicker\\datetimeinput.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(112)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-6d1f464a/datetimeinput.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _datetimepicker = __webpack_require__(83);
	
	var _datetimepicker2 = _interopRequireDefault(_datetimepicker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	
	    props: {
	        dateTime: {
	            type: String,
	            twoWay: true,
	            required: true
	        },
	        dateOnly: {
	            type: Boolean,
	            default: false
	        },
	        timeOnly: {
	            type: Boolean,
	            default: false
	        }
	    },
	
	    components: {
	        dateTimePicker: _datetimepicker2.default
	    },
	
	    data: function data() {
	        var dateTimeDate = new Date(this.dateTime);
	        return {
	            show: false,
	            pos: {
	                "top": '',
	                "left": '',
	                "position": 'absolute',
	                "z-index": 1120
	            },
	            dateTimeDate: dateTimeDate
	        };
	    },
	
	
	    watch: {
	        dateTimeDate: function dateTimeDate(date) {
	            this.dateTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
	            this.show = false;
	        }
	    },
	
	    methods: {
	        handleClick: function handleClick() {
	            var posObj = this.$els.posObj;
	            this.pos.top = posObj.offsetTop + posObj.offsetHeight + 'px';
	            this.pos.left = posObj.offsetLeft + 'px';
	            this.show = true;
	        }
	    }
	
	};

/***/ },
/* 112 */
/***/ function(module, exports) {

	module.exports = "\n\n<div class=\"am-form-group\" v-el:pos-obj>\n    <input type=\"text\" class=\"am-form-field\" v-model=\"dateTime\" v-on:click=\"handleClick\">\n</div>\n<date-time-picker v-if=\"show\" caret-displayed v-bind:style=\"pos\"\n    v-bind:date-time.sync=\"dateTimeDate\"\n    v-bind:show-date-picker=\"!timeOnly\"\n    v-bind:show-time-picker=\"!dateOnly\">\n</date-time-picker>\n\n";

/***/ },
/* 113 */
/***/ function(module, exports) {

	module.exports = "\n\n<div>\n    <button class=\"am-btn am-btn-default\" type=\"button\" v-on:click=\"showModal=true\">open modal</button>\n    &nbsp;&nbsp;\n    <button class=\"am-btn am-btn-primary\" type=\"button\" v-on:click=\"clickAlert\">open alert</button>\n    &nbsp;&nbsp;\n    <button class=\"am-btn am-btn-secondary\" type=\"button\" v-on:click=\"clickConfirm\">open confirm</button>\n    &nbsp;&nbsp;\n    <button class=\"am-btn am-btn-success\" type=\"button\" v-on:click=\"clickDialog\">open dialog</button>\n    &nbsp;&nbsp;\n\n</div>\n\n<hdp-modal :show.sync=\"showModal\">\n    <div class=\"am-modal-hd\" slot=\"header\">modal header</div>\n    <div class=\"am-modal-bd\" slot=\"body\">hello</div>\n</hdp-modal>\n\n<hdp-alert :show.sync=\"showAlert\" class-name=\"am-modal-sm\" :msg=\"alertMsg\" @alert.ok=\"clickAlertOK\"></hdp-alert>\n\n<hdp-confirm :show.sync=\"showConfirm\" class-name=\"am-modal-sm\" :msg=\"confirmMsg\" @confirm.ok=\"clickConfirmOK\" @confirm.cancel=\"clickConfirmCancel\"></hdp-confirm>\n\n<hdp-dialog :show.sync=\"showDialog\" :msg=\"dialogMsg\" @dialog.cancel=\"clickDialogCancel\" @dialog.ok=\"clickDialogOK\">\n    <label for=\"\">username</label>\n    <input type=\"text\" v-model=\"username\">\n</hdp-dialog>\n\n\n";

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(115)
	__vue_script__ = __webpack_require__(117)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] examples-dev\\src\\views\\typeAheads.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(118)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-74c0d5b7/typeAheads.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(116);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(56)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js!./../../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./typeAheads.vue", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js!./../../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./typeAheads.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(55)();
	// imports
	
	
	// module
	exports.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.hdp-dropdown-typeahead {\n    border: solid 1px #ccc\n}\n", "", {"version":3,"sources":["/./examples-dev/src/views/typeAheads.vue?cca167c4"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAwCA;IACA,sBAAA;CACA","file":"typeAheads.vue","sourcesContent":["<template>\n    <div class=\"am-form\">\n\n        <label for=\"\">普通下拉文本</label><br>\n        <hdp-ta-text :input-data.sync=\"textInput\" :dropdown-data=\"listData\"></hdp-ta-text><span>{{textInput}}</span>\n        \n        \n        <br><br>\n\n        <label for=\"\">自定义下拉文本列表</label><br>\n        <hdp-ta-text :input-data.sync=\"textInput2\" :config=\"textConfig\"></hdp-ta-text><span>{{textInput2}}</span>\n\n        <br><br>\n\n        <label for=\"\">普通下拉对象列表</label><br>\n        <hdp-ta-object\n            :input-data.sync=\"objectInput\"\n            :config=\"objectConfig\"\n            :dropdown-data=\"listObject\">\n        </hdp-ta-object>\n        <span>id:{{objectInput.id}},name:{{objectInput.name}}</span>\n\n        <br><br>\n\n        <label for=\"\">自定义(ajax)下拉对象列表</label><br>\n        <hdp-ta-object\n            :input-data.sync=\"objectInput2\"\n            :config=\"object2Config\">\n        </hdp-ta-object>\n        <span>id:{{objectInput2.id}},name:{{objectInput2.name}}</span>\n    \n    </div>\n\n    <br><br>\n\n    <p>本着单一职责的原则，本来还想把ajax下拉也做成一个组件，但ajax库比较多样，就不做了</p>\n\n</template>\n\n<style>\n    .hdp-dropdown-typeahead {\n        border: solid 1px #ccc\n    }\n</style>\n\n<script>\n\nimport hdpVueComponents from 'hdp-vue-components';\n\nmodule.exports = {\n\n    data: function() {\n        return {\n            textInput: '',\n            listData: ['abc','addd','asdgasd','asdfasge','gwesdf'],\n            textInput2: '',\n            textConfig: {\n                // 邮件下拉\n                listFun: function() {\n                    let data = [\"@hudongpai.com\", \"@qq.com\", \"@163.com\", \"@outlook.com\", \"@gmail.com\", \"@hotmail.com\"];\n                    let value = this.inputData;\n                    let index = value.indexOf('@');\n                    let host = '';\n                    if (index > -1) {\n                        host = value.slice(index);\n                        value = value.slice(0, index);\n                    }\n                    for (var i = data.length - 1; i >= 0; i--) {\n                        data[i] = value + data[i];\n                    }\n                    this.items = this.config.limit ? data.slice(0, this.config.limit)\n                        : data\n                    this.current = -1\n                },\n                alwaysHit: true\n            },\n            objectInput: {\n                id: '',\n                name: ''\n            },\n            objectConfig: {\n                textName: 'name',    // 传入input的值属性名\n                idName: 'id'         // 传入input的id属性名\n            },\n            // listObject数组元素必须有id与text属性\n            listObject: [\n                {\n                    id: 1,\n                    text: 'joey',\n                    desc: 'a sb'\n                },{\n                    id: 2,\n                    text: 'tom',\n                    desc: 'a man'\n                },{\n                    id: 3,\n                    text: 'jame'\n                }\n            ],\n            objectInput2: {\n                id: '',\n                name: ''\n            },\n            object2Config: {\n                textName: 'name',\n                idName: 'id',\n                listFun: function() {\n                    this.loading = true;\n                    // setTimeout当ajax啦\n                    setTimeout(() => {\n                        this.loading = false;\n                        let text = this.inputData[this.config.textName];\n                        let resultList = [{\n                            id: 1,\n                            name: '11111111'\n                        },,{\n                            id: 2,\n                            name: '1222222222'\n                        },{\n                            id: 3,\n                            name: '123333'\n                        },{\n                            id: 4,\n                            name: '1234444444'\n                        },{\n                            id: 5,\n                            name: '123455555'\n                        }];\n\n                        let items = [];\n\n                        resultList.forEach((item) => {\n                            if (item.name.indexOf(text) >= 0) {\n                                items.push({\n                                    id: item.id,\n                                    text: item.name\n                                })\n                            }\n                        })\n\n                        this.items = items\n                        this.current = -1\n\n                    },500);\n                }\n            }\n        };\n    },\n\n    ready: function() {\n        \n    },\n\n    methods: {\n        \n    }\n\n};\n\n</script>\n"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _hdpVueComponents = __webpack_require__(11);
	
	var _hdpVueComponents2 = _interopRequireDefault(_hdpVueComponents);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = {
	
	    data: function data() {
	        return {
	            textInput: '',
	            listData: ['abc', 'addd', 'asdgasd', 'asdfasge', 'gwesdf'],
	            textInput2: '',
	            textConfig: {
	                listFun: function listFun() {
	                    var data = ["@hudongpai.com", "@qq.com", "@163.com", "@outlook.com", "@gmail.com", "@hotmail.com"];
	                    var value = this.inputData;
	                    var index = value.indexOf('@');
	                    var host = '';
	                    if (index > -1) {
	                        host = value.slice(index);
	                        value = value.slice(0, index);
	                    }
	                    for (var i = data.length - 1; i >= 0; i--) {
	                        data[i] = value + data[i];
	                    }
	                    this.items = this.config.limit ? data.slice(0, this.config.limit) : data;
	                    this.current = -1;
	                },
	                alwaysHit: true
	            },
	            objectInput: {
	                id: '',
	                name: ''
	            },
	            objectConfig: {
	                textName: 'name',
	                idName: 'id' },
	
	            listObject: [{
	                id: 1,
	                text: 'joey',
	                desc: 'a sb'
	            }, {
	                id: 2,
	                text: 'tom',
	                desc: 'a man'
	            }, {
	                id: 3,
	                text: 'jame'
	            }],
	            objectInput2: {
	                id: '',
	                name: ''
	            },
	            object2Config: {
	                textName: 'name',
	                idName: 'id',
	                listFun: function listFun() {
	                    var _this = this;
	
	                    this.loading = true;
	
	                    setTimeout(function () {
	                        _this.loading = false;
	                        var text = _this.inputData[_this.config.textName];
	                        var resultList = [{
	                            id: 1,
	                            name: '11111111'
	                        },, {
	                            id: 2,
	                            name: '1222222222'
	                        }, {
	                            id: 3,
	                            name: '123333'
	                        }, {
	                            id: 4,
	                            name: '1234444444'
	                        }, {
	                            id: 5,
	                            name: '123455555'
	                        }];
	
	                        var items = [];
	
	                        resultList.forEach(function (item) {
	                            if (item.name.indexOf(text) >= 0) {
	                                items.push({
	                                    id: item.id,
	                                    text: item.name
	                                });
	                            }
	                        });
	
	                        _this.items = items;
	                        _this.current = -1;
	                    }, 500);
	                }
	            }
	        };
	    },
	
	    ready: function ready() {},
	
	    methods: {}
	
	};

/***/ },
/* 118 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"am-form\">\n\n    <label for=\"\">普通下拉文本</label><br>\n    <hdp-ta-text :input-data.sync=\"textInput\" :dropdown-data=\"listData\"></hdp-ta-text><span>{{textInput}}</span>\n    \n    \n    <br><br>\n\n    <label for=\"\">自定义下拉文本列表</label><br>\n    <hdp-ta-text :input-data.sync=\"textInput2\" :config=\"textConfig\"></hdp-ta-text><span>{{textInput2}}</span>\n\n    <br><br>\n\n    <label for=\"\">普通下拉对象列表</label><br>\n    <hdp-ta-object\n        :input-data.sync=\"objectInput\"\n        :config=\"objectConfig\"\n        :dropdown-data=\"listObject\">\n    </hdp-ta-object>\n    <span>id:{{objectInput.id}},name:{{objectInput.name}}</span>\n\n    <br><br>\n\n    <label for=\"\">自定义(ajax)下拉对象列表</label><br>\n    <hdp-ta-object\n        :input-data.sync=\"objectInput2\"\n        :config=\"object2Config\">\n    </hdp-ta-object>\n    <span>id:{{objectInput2.id}},name:{{objectInput2.name}}</span>\n\n</div>\n\n<br><br>\n\n<p>本着单一职责的原则，本来还想把ajax下拉也做成一个组件，但ajax库比较多样，就不做了</p>\n\n";

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(120)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] examples-dev\\src\\views\\taginputs.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(121)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-b1e01370/taginputs.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 120 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	
	    data: function data() {
	        return {
	            tagList: [],
	            listData: ['abc', 'addd', 'asdgasd', 'asdfasge', 'gwesdf'],
	            tagList2: [],
	            textConfig: {
	                listFun: function listFun() {
	                    var data = ["@hudongpai.com", "@qq.com", "@163.com", "@outlook.com", "@gmail.com", "@hotmail.com"];
	                    var value = this.inputData;
	                    var index = value.indexOf('@');
	                    var host = '';
	                    if (index > -1) {
	                        host = value.slice(index);
	                        value = value.slice(0, index);
	                    }
	                    for (var i = data.length - 1; i >= 0; i--) {
	                        data[i] = value + data[i];
	                    }
	                    this.items = this.config.limit ? data.slice(0, this.config.limit) : data;
	                    this.current = -1;
	                },
	                alwaysHit: true
	            },
	            tagList3: [],
	            listObject: [{
	                id: 1,
	                text: 'joey',
	                desc: 'a sb'
	            }, {
	                id: 2,
	                text: 'tom',
	                desc: 'a man'
	            }, {
	                id: 3,
	                text: 'jame'
	            }],
	            tagList4: [],
	            objectConfig: {
	                listFun: function listFun() {
	                    var _this = this;
	
	                    this.loading = true;
	
	                    setTimeout(function () {
	                        _this.loading = false;
	                        var text = _this.inputData[_this.config.textName];
	                        var resultList = [{
	                            id: 1,
	                            name: '11111111'
	                        },, {
	                            id: 2,
	                            name: '1222222222'
	                        }, {
	                            id: 3,
	                            name: '123333'
	                        }, {
	                            id: 4,
	                            name: '1234444444'
	                        }, {
	                            id: 5,
	                            name: '123455555'
	                        }];
	
	                        var items = [];
	
	                        resultList.forEach(function (item) {
	                            if (item.name.indexOf(text) >= 0) {
	                                items.push({
	                                    id: item.id,
	                                    text: item.name
	                                });
	                            }
	                        });
	
	                        _this.items = items;
	                        _this.current = -1;
	                    }, 500);
	                }
	            }
	        };
	    },
	
	    methods: {}
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = "\n\n<div>\n    <label for=\"\">文本输入</label>\n    <hdp-taginput :input-list.sync=\"tagList\" :dropdown-data=\"listData\"></hdp-taginput>\n</div>\n\n<div>\n    <label for=\"\">自定义文本输入</label>\n    <hdp-taginput :input-list.sync=\"tagList2\" :config=\"textConfig\"></hdp-taginput>\n</div>\n\n<div>\n    <label for=\"\">对象输入</label>\n    <hdp-taginput \n        type-ahead=\"object\"\n        :input-list.sync=\"tagList3\"\n        :dropdown-data=\"listObject\">\n    </hdp-taginput>\n</div>\n\n<div>\n    <label for=\"\">自定义(ajax)对象输入</label>\n    <hdp-taginput \n        type-ahead=\"object\"\n        :input-list.sync=\"tagList4\"\n        :config=\"objectConfig\">\n    </hdp-taginput>\n</div>\n\n";

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(123)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] examples-dev\\src\\views\\datetimePicker.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(124)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-4540baf4/datetimePicker.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 123 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    data: function data() {
	        return {
	            myDate1: new Date('2010-1-3 4:5:6'),
	            myDateMin1: '2010-1-1 4:5:6',
	            myDateMax1: '2010-1-20 4:5:6',
	            myDate2: '2015-12-12 13:14',
	            myDateMin2: '2015-12-1 13:14:15',
	            myDateMax2: '2015-12-30 13:14:15'
	        };
	    },
	
	
	    filters: {
	        formatDate: function formatDate(_date, format) {
	            if (isNaN(_date.getTime())) {
	                return '';
	            }
	
	            var map = {
	                "M": _date.getMonth() + 1,
	                "d": _date.getDate(),
	                "h": _date.getHours(),
	                "m": _date.getMinutes(),
	                "s": _date.getSeconds()
	            };
	
	            format = format.replace(/([yMdDhms])+/g, function (all, t) {
	                var v = map[t];
	                if (v !== undefined) {
	                    if (all.length > 1) {
	                        v = '0' + v;
	                        v = v.substr(v.length - 2);
	                    }
	                    return v;
	                } else if (t === 'y') {
	                    return (_date.getFullYear() + '').substr(4 - all.length);
	                } else if (t === 'D') {
	                    return ['日', '一', '二', '三', '四', '五', '六'][_date.getDay()];
	                }
	                return all;
	            });
	
	            return format;
	        }
	    },
	
	    methods: {
	        myDateChange1: function myDateChange1(changedDate) {
	            console.log(changedDate);
	        },
	        myDateChange2: function myDateChange2(changedDate) {
	            console.log(changedDate);
	        }
	    }
	
	};

/***/ },
/* 124 */
/***/ function(module, exports) {

	module.exports = "\n\n<grid>\n    <p>{{ myDate1 | formatDate 'yyyy年MM月dd日,星期D hh:mm' }}</p>\n    <ul class=\"am-avg-sm-1 am-avg-md-3 am-margin am-padding am-text-center admin-content-list \">\n        <li>\n            <hdp-date-time-picker v-bind:date-time.sync=\"myDate1\"></hdp-date-time-picker>\n        </li>\n        <li>\n            <hdp-date-time-picker v-bind:date-time.sync=\"myDate1\" v-bind:show-time-picker=\"false\"></hdp-date-time-picker>\n        </li>\n\n        <li>\n            <hdp-date-time-picker v-bind:date-time.sync=\"myDate1\" v-bind:show-date-picker=\"false\"></hdp-date-time-picker>\n        </li>\n    </ul>\n    \n\n\n    <hdp-date-time-input v-bind:date-time.sync=\"myDate2\"></hdp-date-time-input>\n\n\n    <hdp-date-time-input v-bind:date-time.sync=\"myDate2\" date-only></hdp-date-time-input>\n\n\n    <hdp-date-time-input v-bind:date-time.sync=\"myDate2\" time-only></hdp-date-time-input>\n    \n</grid>\n\n";

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy1kZXYvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi92dWUtcm91dGVyL2Rpc3QvdnVlLXJvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9leGFtcGxlcy1kZXYvc3JjL3JvdXRlcy5qcyIsIndlYnBhY2s6Ly8vLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL2luZGV4LnZ1ZSIsIndlYnBhY2s6Ly8vLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL3BhZ2luYXRpb25zLnZ1ZSIsIndlYnBhY2s6Ly8vcGFnaW5hdGlvbnMudnVlIiwid2VicGFjazovLy8uL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvcGFnaW5hdGlvbnMudnVlPzIzMmMiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMtZGV2L3NyYy92aWV3cy9tb2RhbHMudnVlIiwid2VicGFjazovLy9tb2RhbHMudnVlIiwid2VicGFjazovLy8uL3NyYy9tYWluLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1waWUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdpbmF0aW9uL3BhZ2luYXRpb24udnVlIiwid2VicGFjazovLy9wYWdpbmF0aW9uLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLnZ1ZT8wYjg4Iiwid2VicGFjazovLy8uL3NyYy9tb2RhbC9tb2RhbC52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGFsL21vZGFsLnZ1ZT8wNGRjIiwid2VicGFjazovLy8uL3NyYy9tb2RhbC9tb2RhbC52dWU/ODJkNiIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL34vdnVlLXN0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vL21vZGFsLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kYWwvbW9kYWwudnVlPzcyZTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGFsL2FsZXJ0LnZ1ZSIsIndlYnBhY2s6Ly8vYWxlcnQudnVlIiwid2VicGFjazovLy8uL3NyYy9tb2RhbC9hbGVydC52dWU/YmMzOCIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kYWwvY29uZmlybS52dWUiLCJ3ZWJwYWNrOi8vL2NvbmZpcm0udnVlIiwid2VicGFjazovLy8uL3NyYy9tb2RhbC9jb25maXJtLnZ1ZT84M2YwIiwid2VicGFjazovLy8uL3NyYy9tb2RhbC9kaWFsb2cudnVlIiwid2VicGFjazovLy9kaWFsb2cudnVlIiwid2VicGFjazovLy8uL3NyYy9tb2RhbC9kaWFsb2cudnVlPzlkNGMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVhaGVhZC90eXBlQWhlYWRJbnRlcmZhY2UudnVlIiwid2VicGFjazovLy8uL3NyYy90eXBlYWhlYWQvdHlwZUFoZWFkSW50ZXJmYWNlLnZ1ZT9kYTBkIiwid2VicGFjazovLy8uL3NyYy90eXBlYWhlYWQvdHlwZUFoZWFkSW50ZXJmYWNlLnZ1ZT80NmU0Iiwid2VicGFjazovLy90eXBlQWhlYWRJbnRlcmZhY2UudnVlIiwid2VicGFjazovLy8uL3NyYy90eXBlYWhlYWQvdHlwZUFoZWFkX3RleHQudnVlIiwid2VicGFjazovLy90eXBlQWhlYWRfdGV4dC52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVhaGVhZC90eXBlQWhlYWRfdGV4dC52dWU/YzA1NCIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZWFoZWFkL3R5cGVBaGVhZF9vYmplY3QudnVlIiwid2VicGFjazovLy90eXBlQWhlYWRfb2JqZWN0LnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZWFoZWFkL3R5cGVBaGVhZF9vYmplY3QudnVlPzU0NmIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RhZ2lucHV0L3RhZ2lucHV0LnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvdGFnaW5wdXQvdGFnaW5wdXQudnVlPzUxMWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RhZ2lucHV0L3RhZ2lucHV0LnZ1ZT8yYzM4Iiwid2VicGFjazovLy90YWdpbnB1dC52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RhZ2lucHV0L3RhZ2lucHV0LnZ1ZT85NDQ3Iiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLnZ1ZT82OGRkIiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci52dWU/MWUwOCIsIndlYnBhY2s6Ly8vZGF0ZXRpbWVwaWNrZXIudnVlIiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci9kYXRlcGlja2VyLnZ1ZSIsIndlYnBhY2s6Ly8vZGF0ZXBpY2tlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL2RheXNwaWNrZXIudnVlIiwid2VicGFjazovLy9kYXlzcGlja2VyLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL2RheXNwaWNrZXIudnVlP2RkYzAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL21vbnRoc3BpY2tlci52dWUiLCJ3ZWJwYWNrOi8vL21vbnRoc3BpY2tlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL21vbnRoc3BpY2tlci52dWU/NWJmYiIsIndlYnBhY2s6Ly8vLi9zcmMvZGF0ZXRpbWVwaWNrZXIveWVhcnNwaWNrZXIudnVlIiwid2VicGFjazovLy95ZWFyc3BpY2tlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL3llYXJzcGlja2VyLnZ1ZT8wNTZiIiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci9kYXRlcGlja2VyLnZ1ZT8yOTBkIiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci90aW1lcGlja2VyLnZ1ZSIsIndlYnBhY2s6Ly8vdGltZXBpY2tlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL21pbnV0ZXNwaWNrZXIudnVlIiwid2VicGFjazovLy9taW51dGVzcGlja2VyLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvZGF0ZXRpbWVwaWNrZXIvbWludXRlc3BpY2tlci52dWU/MTk0ZSIsIndlYnBhY2s6Ly8vLi9zcmMvZGF0ZXRpbWVwaWNrZXIvaG91cnNwaWNrZXIudnVlIiwid2VicGFjazovLy9ob3Vyc3BpY2tlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGV0aW1lcGlja2VyL2hvdXJzcGlja2VyLnZ1ZT8xNmNkIiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci90aW1lcGlja2VyLnZ1ZT8xZjliIiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci52dWU/MTZkZiIsIndlYnBhY2s6Ly8vLi9zcmMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVpbnB1dC52dWUiLCJ3ZWJwYWNrOi8vL2RhdGV0aW1laW5wdXQudnVlIiwid2VicGFjazovLy8uL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZWlucHV0LnZ1ZT83YTA1Iiwid2VicGFjazovLy8uL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvbW9kYWxzLnZ1ZT85N2ZiIiwid2VicGFjazovLy8uL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvdHlwZUFoZWFkcy52dWUiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMtZGV2L3NyYy92aWV3cy90eXBlQWhlYWRzLnZ1ZT9jOWMyIiwid2VicGFjazovLy8uL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvdHlwZUFoZWFkcy52dWU/ZTkwZCIsIndlYnBhY2s6Ly8vdHlwZUFoZWFkcy52dWUiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMtZGV2L3NyYy92aWV3cy90eXBlQWhlYWRzLnZ1ZT9jNGViIiwid2VicGFjazovLy8uL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvdGFnaW5wdXRzLnZ1ZSIsIndlYnBhY2s6Ly8vdGFnaW5wdXRzLnZ1ZSIsIndlYnBhY2s6Ly8vLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL3RhZ2lucHV0cy52dWU/ZWQ1MyIsIndlYnBhY2s6Ly8vLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL2RhdGV0aW1lUGlja2VyLnZ1ZSIsIndlYnBhY2s6Ly8vZGF0ZXRpbWVQaWNrZXIudnVlIiwid2VicGFjazovLy8uL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvZGF0ZXRpbWVQaWNrZXIudnVlP2UwYzQiXSwibmFtZXMiOlsiY29uZmlnIiwiZGVidWciLCJ1c2UiLCJjb21wb25lbnRzIiwicm91dGVyIiwiQXBwIiwiZXh0ZW5kIiwibWFwIiwic3RhcnQiLCJjb21wb25lbnQiLCJyZXF1aXJlIiwicGFnaW5hdGlvbiIsIm1vZGFsIiwiYWxlcnQiLCJjb25maXJtIiwiZGlhbG9nIiwidHlwZUFoZWFkSW50ZXJmYWNlIiwidHlwZUFoZWFkVGV4dCIsInR5cGVBaGVhZE9iamVjdCIsInRhZ2lucHV0IiwiZGF0ZVRpbWVQaWNrZXIiLCJkYXRlVGltZUlucHV0IiwiaGRwUGFnaW5hdGlvbiIsImhkcE1vZGFsIiwiaGRwQWxlcnQiLCJoZHBDb25maXJtIiwiaGRwRGlhbG9nIiwiaGRwVGFUZXh0IiwiaGRwVGFPYmplY3QiLCJoZHBUYWdpbnB1dCIsImhkcERhdGVUaW1lUGlja2VyIiwiaGRwRGF0ZVRpbWVJbnB1dCIsIm1vZHVsZSIsImV4cG9ydHMiLCJpbnN0YWxsIiwiVnVlIiwibmFtZSIsInJlcGFpbnRUcmlnZ2VyIiwiZWwiLCJvZmZzZXRIZWlnaHQiLCJub29wIiwiZGF0ZVV0aWxzIiwiaXNMZWFwWWVhciIsInllYXIiLCJnZXREYXlzSW5Nb250aCIsIm1vbnRoIiwiZ2V0TG9jYWxlIiwibG9jYWxlIiwibmF2aWdhdG9yIiwibGFuZ3VhZ2UiLCJzcGxpdCIsInRvVXBwZXJDYXNlIiwiam9pbiIsImxvY2FsZXMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxlQUFJQSxNQUFKLENBQVdDLEtBQVgsR0FBbUIsSUFBbkI7O0FBRUEsZUFBSUMsR0FBSixDQUFRLDJCQUFpQkMsVUFBekI7QUFDQSxlQUFJRCxHQUFKOztBQUVBLEtBQUlFLFNBQVMseUJBQWI7O0FBRUEsS0FBSUMsTUFBTSxjQUFJQyxNQUFKLENBQVcsRUFBWCxDQUFWOztBQUVBRixRQUFPRyxHQUFQOztBQUVBSCxRQUFPSSxLQUFQLENBQWFILEdBQWIsRUFBa0IsV0FBbEIsRTs7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyxvQkFBb0I7O0FBRXJCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTBDLE9BQU87QUFDakQ7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2Qjs7QUFFN0I7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBaUM7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBOEMsT0FBTztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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dUNBQ0E7MENBRUE7d0JBQ0E7QUFHQTtBQXpDQTtBQXhDQTtBQW1GQTs7Y0FHQTtBQXhGQSxHOzs7Ozs7QUNwQ0EsOHNCOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFIQUFvSDtBQUNwSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkM7QUFDN0MsRUFBQztBQUNELGFBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxFQUFDLEk7Ozs7Ozs7Ozs7OzsyQkNPRDs7K0JBRUE7eUJBQ0E7eUJBQ0E7c0JBQ0E7eUJBQ0E7eUJBRUE7QUFQQTtBQVNBOzs7O3dEQU1BO3lDQUNBO3dCQUNBO0FBRUE7Ozt5Q0FFQTs0QkFDQTs0QkFDQTs0QkFDQTs0QkFHQTtBQVBBOzt3RUFRQTs2QkFDQTtzQ0FDQTt5Q0FDQTttQ0FDQTtpREFDQTtBQUNBOzRCQUNBO3VDQUNBO3NFQUNBO3VDQUNBO3NFQUNBO0FBQ0E7d0JBQ0E7QUFFQTs7b0JBQ0E7QUFHQTtBQXJDQTs7OzREQXVDQTt5QkFDQTtBQUVBOzREQUNBO3lCQUNBO0FBR0E7QUFUQTs7QUFsREEsRzs7Ozs7O0FDbkNBLHdDQUF1QyxnREFBZ0QsMjFCIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndnVlLXJvdXRlcic7XG5pbXBvcnQgcm91dGVzIGZyb20gJy4vcm91dGVzJztcbmltcG9ydCBoZHBWdWVDb21wb25lbnRzIGZyb20gJ2hkcC12dWUtY29tcG9uZW50cyc7XG5cblZ1ZS5jb25maWcuZGVidWcgPSB0cnVlO1xuXG5WdWUudXNlKGhkcFZ1ZUNvbXBvbmVudHMuY29tcG9uZW50cyk7XG5WdWUudXNlKFZ1ZVJvdXRlcik7XG5cbnZhciByb3V0ZXIgPSBuZXcgVnVlUm91dGVyKCk7XG5cbnZhciBBcHAgPSBWdWUuZXh0ZW5kKHt9KTtcblxucm91dGVyLm1hcChyb3V0ZXMpO1xuXG5yb3V0ZXIuc3RhcnQoQXBwLCAnI2FwcC1tYWluJyk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzLWRldi9zcmMvbWFpbi5qc1xuICoqLyIsIi8qIVxuICogdnVlLXJvdXRlciB2MC43LjEzXG4gKiAoYykgMjAxNiBFdmFuIFlvdVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIGdsb2JhbC5WdWVSb3V0ZXIgPSBmYWN0b3J5KCk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBiYWJlbEhlbHBlcnMgPSB7fTtcblxuICBiYWJlbEhlbHBlcnMuY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBUYXJnZXQocGF0aCwgbWF0Y2hlciwgZGVsZWdhdGUpIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMubWF0Y2hlciA9IG1hdGNoZXI7XG4gICAgdGhpcy5kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICB9XG5cbiAgVGFyZ2V0LnByb3RvdHlwZSA9IHtcbiAgICB0bzogZnVuY3Rpb24gdG8odGFyZ2V0LCBjYWxsYmFjaykge1xuICAgICAgdmFyIGRlbGVnYXRlID0gdGhpcy5kZWxlZ2F0ZTtcblxuICAgICAgaWYgKGRlbGVnYXRlICYmIGRlbGVnYXRlLndpbGxBZGRSb3V0ZSkge1xuICAgICAgICB0YXJnZXQgPSBkZWxlZ2F0ZS53aWxsQWRkUm91dGUodGhpcy5tYXRjaGVyLnRhcmdldCwgdGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tYXRjaGVyLmFkZCh0aGlzLnBhdGgsIHRhcmdldCk7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBpZiAoY2FsbGJhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgaGF2ZSBhbiBhcmd1bWVudCBpbiB0aGUgZnVuY3Rpb24gcGFzc2VkIHRvIGB0b2BcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXRjaGVyLmFkZENoaWxkKHRoaXMucGF0aCwgdGFyZ2V0LCBjYWxsYmFjaywgdGhpcy5kZWxlZ2F0ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gTWF0Y2hlcih0YXJnZXQpIHtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIHRoaXMuY2hpbGRyZW4gPSB7fTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIE1hdGNoZXIucHJvdG90eXBlID0ge1xuICAgIGFkZDogZnVuY3Rpb24gYWRkKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIHRoaXMucm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICB9LFxuXG4gICAgYWRkQ2hpbGQ6IGZ1bmN0aW9uIGFkZENoaWxkKHBhdGgsIHRhcmdldCwgY2FsbGJhY2ssIGRlbGVnYXRlKSB7XG4gICAgICB2YXIgbWF0Y2hlciA9IG5ldyBNYXRjaGVyKHRhcmdldCk7XG4gICAgICB0aGlzLmNoaWxkcmVuW3BhdGhdID0gbWF0Y2hlcjtcblxuICAgICAgdmFyIG1hdGNoID0gZ2VuZXJhdGVNYXRjaChwYXRoLCBtYXRjaGVyLCBkZWxlZ2F0ZSk7XG5cbiAgICAgIGlmIChkZWxlZ2F0ZSAmJiBkZWxlZ2F0ZS5jb250ZXh0RW50ZXJlZCkge1xuICAgICAgICBkZWxlZ2F0ZS5jb250ZXh0RW50ZXJlZCh0YXJnZXQsIG1hdGNoKTtcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sobWF0Y2gpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZU1hdGNoKHN0YXJ0aW5nUGF0aCwgbWF0Y2hlciwgZGVsZWdhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHBhdGgsIG5lc3RlZENhbGxiYWNrKSB7XG4gICAgICB2YXIgZnVsbFBhdGggPSBzdGFydGluZ1BhdGggKyBwYXRoO1xuXG4gICAgICBpZiAobmVzdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgbmVzdGVkQ2FsbGJhY2soZ2VuZXJhdGVNYXRjaChmdWxsUGF0aCwgbWF0Y2hlciwgZGVsZWdhdGUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgVGFyZ2V0KHN0YXJ0aW5nUGF0aCArIHBhdGgsIG1hdGNoZXIsIGRlbGVnYXRlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkUm91dGUocm91dGVBcnJheSwgcGF0aCwgaGFuZGxlcikge1xuICAgIHZhciBsZW4gPSAwO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcm91dGVBcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxlbiArPSByb3V0ZUFycmF5W2ldLnBhdGgubGVuZ3RoO1xuICAgIH1cblxuICAgIHBhdGggPSBwYXRoLnN1YnN0cihsZW4pO1xuICAgIHZhciByb3V0ZSA9IHsgcGF0aDogcGF0aCwgaGFuZGxlcjogaGFuZGxlciB9O1xuICAgIHJvdXRlQXJyYXkucHVzaChyb3V0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBlYWNoUm91dGUoYmFzZVJvdXRlLCBtYXRjaGVyLCBjYWxsYmFjaywgYmluZGluZykge1xuICAgIHZhciByb3V0ZXMgPSBtYXRjaGVyLnJvdXRlcztcblxuICAgIGZvciAodmFyIHBhdGggaW4gcm91dGVzKSB7XG4gICAgICBpZiAocm91dGVzLmhhc093blByb3BlcnR5KHBhdGgpKSB7XG4gICAgICAgIHZhciByb3V0ZUFycmF5ID0gYmFzZVJvdXRlLnNsaWNlKCk7XG4gICAgICAgIGFkZFJvdXRlKHJvdXRlQXJyYXksIHBhdGgsIHJvdXRlc1twYXRoXSk7XG5cbiAgICAgICAgaWYgKG1hdGNoZXIuY2hpbGRyZW5bcGF0aF0pIHtcbiAgICAgICAgICBlYWNoUm91dGUocm91dGVBcnJheSwgbWF0Y2hlci5jaGlsZHJlbltwYXRoXSwgY2FsbGJhY2ssIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoYmluZGluZywgcm91dGVBcnJheSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYXAgKGNhbGxiYWNrLCBhZGRSb3V0ZUNhbGxiYWNrKSB7XG4gICAgdmFyIG1hdGNoZXIgPSBuZXcgTWF0Y2hlcigpO1xuXG4gICAgY2FsbGJhY2soZ2VuZXJhdGVNYXRjaChcIlwiLCBtYXRjaGVyLCB0aGlzLmRlbGVnYXRlKSk7XG5cbiAgICBlYWNoUm91dGUoW10sIG1hdGNoZXIsIGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgaWYgKGFkZFJvdXRlQ2FsbGJhY2spIHtcbiAgICAgICAgYWRkUm91dGVDYWxsYmFjayh0aGlzLCByb3V0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZChyb3V0ZSk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH1cblxuICB2YXIgc3BlY2lhbHMgPSBbJy8nLCAnLicsICcqJywgJysnLCAnPycsICd8JywgJygnLCAnKScsICdbJywgJ10nLCAneycsICd9JywgJ1xcXFwnXTtcblxuICB2YXIgZXNjYXBlUmVnZXggPSBuZXcgUmVnRXhwKCcoXFxcXCcgKyBzcGVjaWFscy5qb2luKCd8XFxcXCcpICsgJyknLCAnZycpO1xuXG4gIHZhciBub1dhcm5pbmcgPSBmYWxzZTtcbiAgZnVuY3Rpb24gd2Fybihtc2cpIHtcbiAgICBpZiAoIW5vV2FybmluZyAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1t2dWUtcm91dGVyXSAnICsgbXNnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0cnlEZWNvZGUodXJpLCBhc0NvbXBvbmVudCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXNDb21wb25lbnQgPyBkZWNvZGVVUklDb21wb25lbnQodXJpKSA6IGRlY29kZVVSSSh1cmkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHdhcm4oJ21hbGZvcm1lZCBVUkknICsgKGFzQ29tcG9uZW50ID8gJyBjb21wb25lbnQ6ICcgOiAnOiAnKSArIHVyaSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNBcnJheSh0ZXN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0ZXN0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICB9XG5cbiAgLy8gQSBTZWdtZW50IHJlcHJlc2VudHMgYSBzZWdtZW50IGluIHRoZSBvcmlnaW5hbCByb3V0ZSBkZXNjcmlwdGlvbi5cbiAgLy8gRWFjaCBTZWdtZW50IHR5cGUgcHJvdmlkZXMgYW4gYGVhY2hDaGFyYCBhbmQgYHJlZ2V4YCBtZXRob2QuXG4gIC8vXG4gIC8vIFRoZSBgZWFjaENoYXJgIG1ldGhvZCBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIG9uZSBvciBtb3JlIGNoYXJhY3RlclxuICAvLyBzcGVjaWZpY2F0aW9ucy4gQSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBjb25zdW1lcyBvbmUgb3IgbW9yZSBpbnB1dFxuICAvLyBjaGFyYWN0ZXJzLlxuICAvL1xuICAvLyBUaGUgYHJlZ2V4YCBtZXRob2QgcmV0dXJucyBhIHJlZ2V4IGZyYWdtZW50IGZvciB0aGUgc2VnbWVudC4gSWYgdGhlXG4gIC8vIHNlZ21lbnQgaXMgYSBkeW5hbWljIG9mIHN0YXIgc2VnbWVudCwgdGhlIHJlZ2V4IGZyYWdtZW50IGFsc28gaW5jbHVkZXNcbiAgLy8gYSBjYXB0dXJlLlxuICAvL1xuICAvLyBBIGNoYXJhY3RlciBzcGVjaWZpY2F0aW9uIGNvbnRhaW5zOlxuICAvL1xuICAvLyAqIGB2YWxpZENoYXJzYDogYSBTdHJpbmcgd2l0aCBhIGxpc3Qgb2YgYWxsIHZhbGlkIGNoYXJhY3RlcnMsIG9yXG4gIC8vICogYGludmFsaWRDaGFyc2A6IGEgU3RyaW5nIHdpdGggYSBsaXN0IG9mIGFsbCBpbnZhbGlkIGNoYXJhY3RlcnNcbiAgLy8gKiBgcmVwZWF0YDogdHJ1ZSBpZiB0aGUgY2hhcmFjdGVyIHNwZWNpZmljYXRpb24gY2FuIHJlcGVhdFxuXG4gIGZ1bmN0aW9uIFN0YXRpY1NlZ21lbnQoc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gIH1cbiAgU3RhdGljU2VnbWVudC5wcm90b3R5cGUgPSB7XG4gICAgZWFjaENoYXI6IGZ1bmN0aW9uIGVhY2hDaGFyKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgc3RyaW5nID0gdGhpcy5zdHJpbmcsXG4gICAgICAgICAgY2g7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3RyaW5nLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjaCA9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgIGNhbGxiYWNrKHsgdmFsaWRDaGFyczogY2ggfSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlZ2V4OiBmdW5jdGlvbiByZWdleCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZy5yZXBsYWNlKGVzY2FwZVJlZ2V4LCAnXFxcXCQxJyk7XG4gICAgfSxcblxuICAgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZztcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gRHluYW1pY1NlZ21lbnQobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cbiAgRHluYW1pY1NlZ21lbnQucHJvdG90eXBlID0ge1xuICAgIGVhY2hDaGFyOiBmdW5jdGlvbiBlYWNoQ2hhcihjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soeyBpbnZhbGlkQ2hhcnM6IFwiL1wiLCByZXBlYXQ6IHRydWUgfSk7XG4gICAgfSxcblxuICAgIHJlZ2V4OiBmdW5jdGlvbiByZWdleCgpIHtcbiAgICAgIHJldHVybiBcIihbXi9dKylcIjtcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGU6IGZ1bmN0aW9uIGdlbmVyYXRlKHBhcmFtcykge1xuICAgICAgdmFyIHZhbCA9IHBhcmFtc1t0aGlzLm5hbWVdO1xuICAgICAgcmV0dXJuIHZhbCA9PSBudWxsID8gXCI6XCIgKyB0aGlzLm5hbWUgOiB2YWw7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIFN0YXJTZWdtZW50KG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG4gIFN0YXJTZWdtZW50LnByb3RvdHlwZSA9IHtcbiAgICBlYWNoQ2hhcjogZnVuY3Rpb24gZWFjaENoYXIoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHsgaW52YWxpZENoYXJzOiBcIlwiLCByZXBlYXQ6IHRydWUgfSk7XG4gICAgfSxcblxuICAgIHJlZ2V4OiBmdW5jdGlvbiByZWdleCgpIHtcbiAgICAgIHJldHVybiBcIiguKylcIjtcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGU6IGZ1bmN0aW9uIGdlbmVyYXRlKHBhcmFtcykge1xuICAgICAgdmFyIHZhbCA9IHBhcmFtc1t0aGlzLm5hbWVdO1xuICAgICAgcmV0dXJuIHZhbCA9PSBudWxsID8gXCI6XCIgKyB0aGlzLm5hbWUgOiB2YWw7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIEVwc2lsb25TZWdtZW50KCkge31cbiAgRXBzaWxvblNlZ21lbnQucHJvdG90eXBlID0ge1xuICAgIGVhY2hDaGFyOiBmdW5jdGlvbiBlYWNoQ2hhcigpIHt9LFxuICAgIHJlZ2V4OiBmdW5jdGlvbiByZWdleCgpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH0sXG4gICAgZ2VuZXJhdGU6IGZ1bmN0aW9uIGdlbmVyYXRlKCkge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHBhcnNlKHJvdXRlLCBuYW1lcywgc3BlY2lmaWNpdHkpIHtcbiAgICAvLyBub3JtYWxpemUgcm91dGUgYXMgbm90IHN0YXJ0aW5nIHdpdGggYSBcIi9cIi4gUmVjb2duaXRpb24gd2lsbFxuICAgIC8vIGFsc28gbm9ybWFsaXplLlxuICAgIGlmIChyb3V0ZS5jaGFyQXQoMCkgPT09IFwiL1wiKSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICB2YXIgc2VnbWVudHMgPSByb3V0ZS5zcGxpdChcIi9cIiksXG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgIC8vIEEgcm91dGVzIGhhcyBzcGVjaWZpY2l0eSBkZXRlcm1pbmVkIGJ5IHRoZSBvcmRlciB0aGF0IGl0cyBkaWZmZXJlbnQgc2VnbWVudHNcbiAgICAvLyBhcHBlYXIgaW4uIFRoaXMgc3lzdGVtIG1pcnJvcnMgaG93IHRoZSBtYWduaXR1ZGUgb2YgbnVtYmVycyB3cml0dGVuIGFzIHN0cmluZ3NcbiAgICAvLyB3b3Jrcy5cbiAgICAvLyBDb25zaWRlciBhIG51bWJlciB3cml0dGVuIGFzOiBcImFiY1wiLiBBbiBleGFtcGxlIHdvdWxkIGJlIFwiMjAwXCIuIEFueSBvdGhlciBudW1iZXIgd3JpdHRlblxuICAgIC8vIFwieHl6XCIgd2lsbCBiZSBzbWFsbGVyIHRoYW4gXCJhYmNcIiBzbyBsb25nIGFzIGBhID4gemAuIEZvciBpbnN0YW5jZSwgXCIxOTlcIiBpcyBzbWFsbGVyXG4gICAgLy8gdGhlbiBcIjIwMFwiLCBldmVuIHRob3VnaCBcInlcIiBhbmQgXCJ6XCIgKHdoaWNoIGFyZSBib3RoIDkpIGFyZSBsYXJnZXIgdGhhbiBcIjBcIiAodGhlIHZhbHVlXG4gICAgLy8gb2YgKGBiYCBhbmQgYGNgKS4gVGhpcyBpcyBiZWNhdXNlIHRoZSBsZWFkaW5nIHN5bWJvbCwgXCIyXCIsIGlzIGxhcmdlciB0aGFuIHRoZSBvdGhlclxuICAgIC8vIGxlYWRpbmcgc3ltYm9sLCBcIjFcIi5cbiAgICAvLyBUaGUgcnVsZSBpcyB0aGF0IHN5bWJvbHMgdG8gdGhlIGxlZnQgY2FycnkgbW9yZSB3ZWlnaHQgdGhhbiBzeW1ib2xzIHRvIHRoZSByaWdodFxuICAgIC8vIHdoZW4gYSBudW1iZXIgaXMgd3JpdHRlbiBvdXQgYXMgYSBzdHJpbmcuIEluIHRoZSBhYm92ZSBzdHJpbmdzLCB0aGUgbGVhZGluZyBkaWdpdFxuICAgIC8vIHJlcHJlc2VudHMgaG93IG1hbnkgMTAwJ3MgYXJlIGluIHRoZSBudW1iZXIsIGFuZCBpdCBjYXJyaWVzIG1vcmUgd2VpZ2h0IHRoYW4gdGhlIG1pZGRsZVxuICAgIC8vIG51bWJlciB3aGljaCByZXByZXNlbnRzIGhvdyBtYW55IDEwJ3MgYXJlIGluIHRoZSBudW1iZXIuXG4gICAgLy8gVGhpcyBzeXN0ZW0gb2YgbnVtYmVyIG1hZ25pdHVkZSB3b3JrcyB3ZWxsIGZvciByb3V0ZSBzcGVjaWZpY2l0eSwgdG9vLiBBIHJvdXRlIHdyaXR0ZW4gYXNcbiAgICAvLyBgYS9iL2NgIHdpbGwgYmUgbW9yZSBzcGVjaWZpYyB0aGFuIGB4L3kvemAgYXMgbG9uZyBhcyBgYWAgaXMgbW9yZSBzcGVjaWZpYyB0aGFuXG4gICAgLy8gYHhgLCBpcnJlc3BlY3RpdmUgb2YgdGhlIG90aGVyIHBhcnRzLlxuICAgIC8vIEJlY2F1c2Ugb2YgdGhpcyBzaW1pbGFyaXR5LCB3ZSBhc3NpZ24gZWFjaCB0eXBlIG9mIHNlZ21lbnQgYSBudW1iZXIgdmFsdWUgd3JpdHRlbiBhcyBhXG4gICAgLy8gc3RyaW5nLiBXZSBjYW4gZmluZCB0aGUgc3BlY2lmaWNpdHkgb2YgY29tcG91bmQgcm91dGVzIGJ5IGNvbmNhdGVuYXRpbmcgdGhlc2Ugc3RyaW5nc1xuICAgIC8vIHRvZ2V0aGVyLCBmcm9tIGxlZnQgdG8gcmlnaHQuIEFmdGVyIHdlIGhhdmUgbG9vcGVkIHRocm91Z2ggYWxsIG9mIHRoZSBzZWdtZW50cyxcbiAgICAvLyB3ZSBjb252ZXJ0IHRoZSBzdHJpbmcgdG8gYSBudW1iZXIuXG4gICAgc3BlY2lmaWNpdHkudmFsID0gJyc7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1tpXSxcbiAgICAgICAgICBtYXRjaDtcblxuICAgICAgaWYgKG1hdGNoID0gc2VnbWVudC5tYXRjaCgvXjooW15cXC9dKykkLykpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBEeW5hbWljU2VnbWVudChtYXRjaFsxXSkpO1xuICAgICAgICBuYW1lcy5wdXNoKG1hdGNoWzFdKTtcbiAgICAgICAgc3BlY2lmaWNpdHkudmFsICs9ICczJztcbiAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBzZWdtZW50Lm1hdGNoKC9eXFwqKFteXFwvXSspJC8pKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChuZXcgU3RhclNlZ21lbnQobWF0Y2hbMV0pKTtcbiAgICAgICAgc3BlY2lmaWNpdHkudmFsICs9ICcyJztcbiAgICAgICAgbmFtZXMucHVzaChtYXRjaFsxXSk7XG4gICAgICB9IGVsc2UgaWYgKHNlZ21lbnQgPT09IFwiXCIpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBFcHNpbG9uU2VnbWVudCgpKTtcbiAgICAgICAgc3BlY2lmaWNpdHkudmFsICs9ICcxJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChuZXcgU3RhdGljU2VnbWVudChzZWdtZW50KSk7XG4gICAgICAgIHNwZWNpZmljaXR5LnZhbCArPSAnNCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3BlY2lmaWNpdHkudmFsID0gK3NwZWNpZmljaXR5LnZhbDtcblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLy8gQSBTdGF0ZSBoYXMgYSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBhbmQgKGBjaGFyU3BlY2ApIGFuZCBhIGxpc3Qgb2YgcG9zc2libGVcbiAgLy8gc3Vic2VxdWVudCBzdGF0ZXMgKGBuZXh0U3RhdGVzYCkuXG4gIC8vXG4gIC8vIElmIGEgU3RhdGUgaXMgYW4gYWNjZXB0aW5nIHN0YXRlLCBpdCB3aWxsIGFsc28gaGF2ZSBzZXZlcmFsIGFkZGl0aW9uYWxcbiAgLy8gcHJvcGVydGllczpcbiAgLy9cbiAgLy8gKiBgcmVnZXhgOiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IGlzIHVzZWQgdG8gZXh0cmFjdCBwYXJhbWV0ZXJzIGZyb20gcGF0aHNcbiAgLy8gICB0aGF0IHJlYWNoZWQgdGhpcyBhY2NlcHRpbmcgc3RhdGUuXG4gIC8vICogYGhhbmRsZXJzYDogSW5mb3JtYXRpb24gb24gaG93IHRvIGNvbnZlcnQgdGhlIGxpc3Qgb2YgY2FwdHVyZXMgaW50byBjYWxsc1xuICAvLyAgIHRvIHJlZ2lzdGVyZWQgaGFuZGxlcnMgd2l0aCB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlcnNcbiAgLy8gKiBgdHlwZXNgOiBIb3cgbWFueSBzdGF0aWMsIGR5bmFtaWMgb3Igc3RhciBzZWdtZW50cyBpbiB0aGlzIHJvdXRlLiBVc2VkIHRvXG4gIC8vICAgZGVjaWRlIHdoaWNoIHJvdXRlIHRvIHVzZSBpZiBtdWx0aXBsZSByZWdpc3RlcmVkIHJvdXRlcyBtYXRjaCBhIHBhdGguXG4gIC8vXG4gIC8vIEN1cnJlbnRseSwgU3RhdGUgaXMgaW1wbGVtZW50ZWQgbmFpdmVseSBieSBsb29waW5nIG92ZXIgYG5leHRTdGF0ZXNgIGFuZFxuICAvLyBjb21wYXJpbmcgYSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBhZ2FpbnN0IGEgY2hhcmFjdGVyLiBBIG1vcmUgZWZmaWNpZW50XG4gIC8vIGltcGxlbWVudGF0aW9uIHdvdWxkIHVzZSBhIGhhc2ggb2Yga2V5cyBwb2ludGluZyBhdCBvbmUgb3IgbW9yZSBuZXh0IHN0YXRlcy5cblxuICBmdW5jdGlvbiBTdGF0ZShjaGFyU3BlYykge1xuICAgIHRoaXMuY2hhclNwZWMgPSBjaGFyU3BlYztcbiAgICB0aGlzLm5leHRTdGF0ZXMgPSBbXTtcbiAgfVxuXG4gIFN0YXRlLnByb3RvdHlwZSA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldChjaGFyU3BlYykge1xuICAgICAgdmFyIG5leHRTdGF0ZXMgPSB0aGlzLm5leHRTdGF0ZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbmV4dFN0YXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gbmV4dFN0YXRlc1tpXTtcblxuICAgICAgICB2YXIgaXNFcXVhbCA9IGNoaWxkLmNoYXJTcGVjLnZhbGlkQ2hhcnMgPT09IGNoYXJTcGVjLnZhbGlkQ2hhcnM7XG4gICAgICAgIGlzRXF1YWwgPSBpc0VxdWFsICYmIGNoaWxkLmNoYXJTcGVjLmludmFsaWRDaGFycyA9PT0gY2hhclNwZWMuaW52YWxpZENoYXJzO1xuXG4gICAgICAgIGlmIChpc0VxdWFsKSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHB1dDogZnVuY3Rpb24gcHV0KGNoYXJTcGVjKSB7XG4gICAgICB2YXIgc3RhdGU7XG5cbiAgICAgIC8vIElmIHRoZSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBhbHJlYWR5IGV4aXN0cyBpbiBhIGNoaWxkIG9mIHRoZSBjdXJyZW50XG4gICAgICAvLyBzdGF0ZSwganVzdCByZXR1cm4gdGhhdCBzdGF0ZS5cbiAgICAgIGlmIChzdGF0ZSA9IHRoaXMuZ2V0KGNoYXJTcGVjKSkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgYSBuZXcgc3RhdGUgZm9yIHRoZSBjaGFyYWN0ZXIgc3BlY1xuICAgICAgc3RhdGUgPSBuZXcgU3RhdGUoY2hhclNwZWMpO1xuXG4gICAgICAvLyBJbnNlcnQgdGhlIG5ldyBzdGF0ZSBhcyBhIGNoaWxkIG9mIHRoZSBjdXJyZW50IHN0YXRlXG4gICAgICB0aGlzLm5leHRTdGF0ZXMucHVzaChzdGF0ZSk7XG5cbiAgICAgIC8vIElmIHRoaXMgY2hhcmFjdGVyIHNwZWNpZmljYXRpb24gcmVwZWF0cywgaW5zZXJ0IHRoZSBuZXcgc3RhdGUgYXMgYSBjaGlsZFxuICAgICAgLy8gb2YgaXRzZWxmLiBOb3RlIHRoYXQgdGhpcyB3aWxsIG5vdCB0cmlnZ2VyIGFuIGluZmluaXRlIGxvb3AgYmVjYXVzZSBlYWNoXG4gICAgICAvLyB0cmFuc2l0aW9uIGR1cmluZyByZWNvZ25pdGlvbiBjb25zdW1lcyBhIGNoYXJhY3Rlci5cbiAgICAgIGlmIChjaGFyU3BlYy5yZXBlYXQpIHtcbiAgICAgICAgc3RhdGUubmV4dFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmV0dXJuIHRoZSBuZXcgc3RhdGVcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9LFxuXG4gICAgLy8gRmluZCBhIGxpc3Qgb2YgY2hpbGQgc3RhdGVzIG1hdGNoaW5nIHRoZSBuZXh0IGNoYXJhY3RlclxuICAgIG1hdGNoOiBmdW5jdGlvbiBtYXRjaChjaCkge1xuICAgICAgLy8gREVCVUcgXCJQcm9jZXNzaW5nIGBcIiArIGNoICsgXCJgOlwiXG4gICAgICB2YXIgbmV4dFN0YXRlcyA9IHRoaXMubmV4dFN0YXRlcyxcbiAgICAgICAgICBjaGlsZCxcbiAgICAgICAgICBjaGFyU3BlYyxcbiAgICAgICAgICBjaGFycztcblxuICAgICAgLy8gREVCVUcgXCIgIFwiICsgZGVidWdTdGF0ZSh0aGlzKVxuICAgICAgdmFyIHJldHVybmVkID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbmV4dFN0YXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY2hpbGQgPSBuZXh0U3RhdGVzW2ldO1xuXG4gICAgICAgIGNoYXJTcGVjID0gY2hpbGQuY2hhclNwZWM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoY2hhcnMgPSBjaGFyU3BlYy52YWxpZENoYXJzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBpZiAoY2hhcnMuaW5kZXhPZihjaCkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm5lZC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIChjaGFycyA9IGNoYXJTcGVjLmludmFsaWRDaGFycykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaWYgKGNoYXJzLmluZGV4T2YoY2gpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuZWQucHVzaChjaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXR1cm5lZDtcbiAgICB9XG5cbiAgICAvKiogSUYgREVCVUdcbiAgICAsIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjaGFyU3BlYyA9IHRoaXMuY2hhclNwZWMsXG4gICAgICAgICAgZGVidWcgPSBcIltcIixcbiAgICAgICAgICBjaGFycyA9IGNoYXJTcGVjLnZhbGlkQ2hhcnMgfHwgY2hhclNwZWMuaW52YWxpZENoYXJzO1xuICAgICAgIGlmIChjaGFyU3BlYy5pbnZhbGlkQ2hhcnMpIHsgZGVidWcgKz0gXCJeXCI7IH1cbiAgICAgIGRlYnVnICs9IGNoYXJzO1xuICAgICAgZGVidWcgKz0gXCJdXCI7XG4gICAgICAgaWYgKGNoYXJTcGVjLnJlcGVhdCkgeyBkZWJ1ZyArPSBcIitcIjsgfVxuICAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9XG4gICAgRU5EIElGICoqL1xuICB9O1xuXG4gIC8qKiBJRiBERUJVR1xuICBmdW5jdGlvbiBkZWJ1Zyhsb2cpIHtcbiAgICBjb25zb2xlLmxvZyhsb2cpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVidWdTdGF0ZShzdGF0ZSkge1xuICAgIHJldHVybiBzdGF0ZS5uZXh0U3RhdGVzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICBpZiAobi5uZXh0U3RhdGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gXCIoIFwiICsgbi5kZWJ1ZygpICsgXCIgW2FjY2VwdGluZ10gKVwiOyB9XG4gICAgICByZXR1cm4gXCIoIFwiICsgbi5kZWJ1ZygpICsgXCIgPHRoZW4+IFwiICsgbi5uZXh0U3RhdGVzLm1hcChmdW5jdGlvbihzKSB7IHJldHVybiBzLmRlYnVnKCkgfSkuam9pbihcIiBvciBcIikgKyBcIiApXCI7XG4gICAgfSkuam9pbihcIiwgXCIpXG4gIH1cbiAgRU5EIElGICoqL1xuXG4gIC8vIFNvcnQgdGhlIHJvdXRlcyBieSBzcGVjaWZpY2l0eVxuICBmdW5jdGlvbiBzb3J0U29sdXRpb25zKHN0YXRlcykge1xuICAgIHJldHVybiBzdGF0ZXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGIuc3BlY2lmaWNpdHkudmFsIC0gYS5zcGVjaWZpY2l0eS52YWw7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWNvZ25pemVDaGFyKHN0YXRlcywgY2gpIHtcbiAgICB2YXIgbmV4dFN0YXRlcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbaV07XG5cbiAgICAgIG5leHRTdGF0ZXMgPSBuZXh0U3RhdGVzLmNvbmNhdChzdGF0ZS5tYXRjaChjaCkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0U3RhdGVzO1xuICB9XG5cbiAgdmFyIG9DcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIChwcm90bykge1xuICAgIGZ1bmN0aW9uIEYoKSB7fVxuICAgIEYucHJvdG90eXBlID0gcHJvdG87XG4gICAgcmV0dXJuIG5ldyBGKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gUmVjb2duaXplUmVzdWx0cyhxdWVyeVBhcmFtcykge1xuICAgIHRoaXMucXVlcnlQYXJhbXMgPSBxdWVyeVBhcmFtcyB8fCB7fTtcbiAgfVxuICBSZWNvZ25pemVSZXN1bHRzLnByb3RvdHlwZSA9IG9DcmVhdGUoe1xuICAgIHNwbGljZTogQXJyYXkucHJvdG90eXBlLnNwbGljZSxcbiAgICBzbGljZTogQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIHB1c2g6IEFycmF5LnByb3RvdHlwZS5wdXNoLFxuICAgIGxlbmd0aDogMCxcbiAgICBxdWVyeVBhcmFtczogbnVsbFxuICB9KTtcblxuICBmdW5jdGlvbiBmaW5kSGFuZGxlcihzdGF0ZSwgcGF0aCwgcXVlcnlQYXJhbXMpIHtcbiAgICB2YXIgaGFuZGxlcnMgPSBzdGF0ZS5oYW5kbGVycyxcbiAgICAgICAgcmVnZXggPSBzdGF0ZS5yZWdleDtcbiAgICB2YXIgY2FwdHVyZXMgPSBwYXRoLm1hdGNoKHJlZ2V4KSxcbiAgICAgICAgY3VycmVudENhcHR1cmUgPSAxO1xuICAgIHZhciByZXN1bHQgPSBuZXcgUmVjb2duaXplUmVzdWx0cyhxdWVyeVBhcmFtcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGhhbmRsZXIgPSBoYW5kbGVyc1tpXSxcbiAgICAgICAgICBuYW1lcyA9IGhhbmRsZXIubmFtZXMsXG4gICAgICAgICAgcGFyYW1zID0ge307XG5cbiAgICAgIGZvciAodmFyIGogPSAwLCBtID0gbmFtZXMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgICAgIHBhcmFtc1tuYW1lc1tqXV0gPSBjYXB0dXJlc1tjdXJyZW50Q2FwdHVyZSsrXTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnB1c2goeyBoYW5kbGVyOiBoYW5kbGVyLmhhbmRsZXIsIHBhcmFtczogcGFyYW1zLCBpc0R5bmFtaWM6ICEhbmFtZXMubGVuZ3RoIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRTZWdtZW50KGN1cnJlbnRTdGF0ZSwgc2VnbWVudCkge1xuICAgIHNlZ21lbnQuZWFjaENoYXIoZnVuY3Rpb24gKGNoKSB7XG4gICAgICB2YXIgc3RhdGU7XG5cbiAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnRTdGF0ZS5wdXQoY2gpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZVF1ZXJ5UGFyYW1QYXJ0KHBhcnQpIHtcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNDAxL2ludGVyYWN0L2Zvcm1zLmh0bWwjaC0xNy4xMy40LjFcbiAgICBwYXJ0ID0gcGFydC5yZXBsYWNlKC9cXCsvZ20sICclMjAnKTtcbiAgICByZXR1cm4gdHJ5RGVjb2RlKHBhcnQsIHRydWUpO1xuICB9XG5cbiAgLy8gVGhlIG1haW4gaW50ZXJmYWNlXG5cbiAgdmFyIFJvdXRlUmVjb2duaXplciA9IGZ1bmN0aW9uIFJvdXRlUmVjb2duaXplcigpIHtcbiAgICB0aGlzLnJvb3RTdGF0ZSA9IG5ldyBTdGF0ZSgpO1xuICAgIHRoaXMubmFtZXMgPSB7fTtcbiAgfTtcblxuICBSb3V0ZVJlY29nbml6ZXIucHJvdG90eXBlID0ge1xuICAgIGFkZDogZnVuY3Rpb24gYWRkKHJvdXRlcywgb3B0aW9ucykge1xuICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9IHRoaXMucm9vdFN0YXRlLFxuICAgICAgICAgIHJlZ2V4ID0gXCJeXCIsXG4gICAgICAgICAgc3BlY2lmaWNpdHkgPSB7fSxcbiAgICAgICAgICBoYW5kbGVycyA9IFtdLFxuICAgICAgICAgIGFsbFNlZ21lbnRzID0gW10sXG4gICAgICAgICAgbmFtZTtcblxuICAgICAgdmFyIGlzRW1wdHkgPSB0cnVlO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJvdXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIHJvdXRlID0gcm91dGVzW2ldLFxuICAgICAgICAgICAgbmFtZXMgPSBbXTtcblxuICAgICAgICB2YXIgc2VnbWVudHMgPSBwYXJzZShyb3V0ZS5wYXRoLCBuYW1lcywgc3BlY2lmaWNpdHkpO1xuXG4gICAgICAgIGFsbFNlZ21lbnRzID0gYWxsU2VnbWVudHMuY29uY2F0KHNlZ21lbnRzKTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMCwgbSA9IHNlZ21lbnRzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgICAgICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbal07XG5cbiAgICAgICAgICBpZiAoc2VnbWVudCBpbnN0YW5jZW9mIEVwc2lsb25TZWdtZW50KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XG5cbiAgICAgICAgICAvLyBBZGQgYSBcIi9cIiBmb3IgdGhlIG5ldyBzZWdtZW50XG4gICAgICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFN0YXRlLnB1dCh7IHZhbGlkQ2hhcnM6IFwiL1wiIH0pO1xuICAgICAgICAgIHJlZ2V4ICs9IFwiL1wiO1xuXG4gICAgICAgICAgLy8gQWRkIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNlZ21lbnQgdG8gdGhlIE5GQSBhbmQgcmVnZXhcbiAgICAgICAgICBjdXJyZW50U3RhdGUgPSBhZGRTZWdtZW50KGN1cnJlbnRTdGF0ZSwgc2VnbWVudCk7XG4gICAgICAgICAgcmVnZXggKz0gc2VnbWVudC5yZWdleCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXIgPSB7IGhhbmRsZXI6IHJvdXRlLmhhbmRsZXIsIG5hbWVzOiBuYW1lcyB9O1xuICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFbXB0eSkge1xuICAgICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50U3RhdGUucHV0KHsgdmFsaWRDaGFyczogXCIvXCIgfSk7XG4gICAgICAgIHJlZ2V4ICs9IFwiL1wiO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50U3RhdGUuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICAgIGN1cnJlbnRTdGF0ZS5yZWdleCA9IG5ldyBSZWdFeHAocmVnZXggKyBcIiRcIik7XG4gICAgICBjdXJyZW50U3RhdGUuc3BlY2lmaWNpdHkgPSBzcGVjaWZpY2l0eTtcblxuICAgICAgaWYgKG5hbWUgPSBvcHRpb25zICYmIG9wdGlvbnMuYXMpIHtcbiAgICAgICAgdGhpcy5uYW1lc1tuYW1lXSA9IHtcbiAgICAgICAgICBzZWdtZW50czogYWxsU2VnbWVudHMsXG4gICAgICAgICAgaGFuZGxlcnM6IGhhbmRsZXJzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZXJzRm9yOiBmdW5jdGlvbiBoYW5kbGVyc0ZvcihuYW1lKSB7XG4gICAgICB2YXIgcm91dGUgPSB0aGlzLm5hbWVzW25hbWVdLFxuICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgaWYgKCFyb3V0ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBpcyBubyByb3V0ZSBuYW1lZCBcIiArIG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJvdXRlLmhhbmRsZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICByZXN1bHQucHVzaChyb3V0ZS5oYW5kbGVyc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGhhc1JvdXRlOiBmdW5jdGlvbiBoYXNSb3V0ZShuYW1lKSB7XG4gICAgICByZXR1cm4gISF0aGlzLm5hbWVzW25hbWVdO1xuICAgIH0sXG5cbiAgICBnZW5lcmF0ZTogZnVuY3Rpb24gZ2VuZXJhdGUobmFtZSwgcGFyYW1zKSB7XG4gICAgICB2YXIgcm91dGUgPSB0aGlzLm5hbWVzW25hbWVdLFxuICAgICAgICAgIG91dHB1dCA9IFwiXCI7XG4gICAgICBpZiAoIXJvdXRlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHJvdXRlIG5hbWVkIFwiICsgbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWdtZW50cyA9IHJvdXRlLnNlZ21lbnRzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW2ldO1xuXG4gICAgICAgIGlmIChzZWdtZW50IGluc3RhbmNlb2YgRXBzaWxvblNlZ21lbnQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dHB1dCArPSBcIi9cIjtcbiAgICAgICAgb3V0cHV0ICs9IHNlZ21lbnQuZ2VuZXJhdGUocGFyYW1zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG91dHB1dC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgICBvdXRwdXQgPSAnLycgKyBvdXRwdXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLnF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgIG91dHB1dCArPSB0aGlzLmdlbmVyYXRlUXVlcnlTdHJpbmcocGFyYW1zLnF1ZXJ5UGFyYW1zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGVRdWVyeVN0cmluZzogZnVuY3Rpb24gZ2VuZXJhdGVRdWVyeVN0cmluZyhwYXJhbXMpIHtcbiAgICAgIHZhciBwYWlycyA9IFtdO1xuICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGtleXMuc29ydCgpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1zW2tleV07XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhaXIgPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KTtcbiAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBhcnJheVBhaXIgPSBrZXkgKyAnW10nICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlW2pdKTtcbiAgICAgICAgICAgIHBhaXJzLnB1c2goYXJyYXlQYWlyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFpciArPSBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgICAgICAgcGFpcnMucHVzaChwYWlyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFpcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwiP1wiICsgcGFpcnMuam9pbihcIiZcIik7XG4gICAgfSxcblxuICAgIHBhcnNlUXVlcnlTdHJpbmc6IGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmcpIHtcbiAgICAgIHZhciBwYWlycyA9IHF1ZXJ5U3RyaW5nLnNwbGl0KFwiJlwiKSxcbiAgICAgICAgICBxdWVyeVBhcmFtcyA9IHt9O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGFpciA9IHBhaXJzW2ldLnNwbGl0KCc9JyksXG4gICAgICAgICAgICBrZXkgPSBkZWNvZGVRdWVyeVBhcmFtUGFydChwYWlyWzBdKSxcbiAgICAgICAgICAgIGtleUxlbmd0aCA9IGtleS5sZW5ndGgsXG4gICAgICAgICAgICBpc0FycmF5ID0gZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgaWYgKHBhaXIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFsdWUgPSAndHJ1ZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9IYW5kbGUgYXJyYXlzXG4gICAgICAgICAgaWYgKGtleUxlbmd0aCA+IDIgJiYga2V5LnNsaWNlKGtleUxlbmd0aCAtIDIpID09PSAnW10nKSB7XG4gICAgICAgICAgICBpc0FycmF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGtleSA9IGtleS5zbGljZSgwLCBrZXlMZW5ndGggLSAyKTtcbiAgICAgICAgICAgIGlmICghcXVlcnlQYXJhbXNba2V5XSkge1xuICAgICAgICAgICAgICBxdWVyeVBhcmFtc1trZXldID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gcGFpclsxXSA/IGRlY29kZVF1ZXJ5UGFyYW1QYXJ0KHBhaXJbMV0pIDogJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgICAgICBxdWVyeVBhcmFtc1trZXldLnB1c2godmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHF1ZXJ5UGFyYW1zW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHF1ZXJ5UGFyYW1zO1xuICAgIH0sXG5cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uIHJlY29nbml6ZShwYXRoLCBzaWxlbnQpIHtcbiAgICAgIG5vV2FybmluZyA9IHNpbGVudDtcbiAgICAgIHZhciBzdGF0ZXMgPSBbdGhpcy5yb290U3RhdGVdLFxuICAgICAgICAgIHBhdGhMZW4sXG4gICAgICAgICAgaSxcbiAgICAgICAgICBsLFxuICAgICAgICAgIHF1ZXJ5U3RhcnQsXG4gICAgICAgICAgcXVlcnlQYXJhbXMgPSB7fSxcbiAgICAgICAgICBpc1NsYXNoRHJvcHBlZCA9IGZhbHNlO1xuXG4gICAgICBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKCc/Jyk7XG4gICAgICBpZiAocXVlcnlTdGFydCAhPT0gLTEpIHtcbiAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gcGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKTtcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHF1ZXJ5U3RhcnQpO1xuICAgICAgICBpZiAocXVlcnlTdHJpbmcpIHtcbiAgICAgICAgICBxdWVyeVBhcmFtcyA9IHRoaXMucGFyc2VRdWVyeVN0cmluZyhxdWVyeVN0cmluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcGF0aCA9IHRyeURlY29kZShwYXRoKTtcbiAgICAgIGlmICghcGF0aCkgcmV0dXJuO1xuXG4gICAgICAvLyBERUJVRyBHUk9VUCBwYXRoXG5cbiAgICAgIGlmIChwYXRoLmNoYXJBdCgwKSAhPT0gXCIvXCIpIHtcbiAgICAgICAgcGF0aCA9IFwiL1wiICsgcGF0aDtcbiAgICAgIH1cblxuICAgICAgcGF0aExlbiA9IHBhdGgubGVuZ3RoO1xuICAgICAgaWYgKHBhdGhMZW4gPiAxICYmIHBhdGguY2hhckF0KHBhdGhMZW4gLSAxKSA9PT0gXCIvXCIpIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGhMZW4gLSAxKTtcbiAgICAgICAgaXNTbGFzaERyb3BwZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgc3RhdGVzID0gcmVjb2duaXplQ2hhcihzdGF0ZXMsIHBhdGguY2hhckF0KGkpKTtcbiAgICAgICAgaWYgKCFzdGF0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRU5EIERFQlVHIEdST1VQXG5cbiAgICAgIHZhciBzb2x1dGlvbnMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChzdGF0ZXNbaV0uaGFuZGxlcnMpIHtcbiAgICAgICAgICBzb2x1dGlvbnMucHVzaChzdGF0ZXNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0YXRlcyA9IHNvcnRTb2x1dGlvbnMoc29sdXRpb25zKTtcblxuICAgICAgdmFyIHN0YXRlID0gc29sdXRpb25zWzBdO1xuXG4gICAgICBpZiAoc3RhdGUgJiYgc3RhdGUuaGFuZGxlcnMpIHtcbiAgICAgICAgLy8gaWYgYSB0cmFpbGluZyBzbGFzaCB3YXMgZHJvcHBlZCBhbmQgYSBzdGFyIHNlZ21lbnQgaXMgdGhlIGxhc3Qgc2VnbWVudFxuICAgICAgICAvLyBzcGVjaWZpZWQsIHB1dCB0aGUgdHJhaWxpbmcgc2xhc2ggYmFja1xuICAgICAgICBpZiAoaXNTbGFzaERyb3BwZWQgJiYgc3RhdGUucmVnZXguc291cmNlLnNsaWNlKC01KSA9PT0gXCIoLispJFwiKSB7XG4gICAgICAgICAgcGF0aCA9IHBhdGggKyBcIi9cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmluZEhhbmRsZXIoc3RhdGUsIHBhdGgsIHF1ZXJ5UGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUm91dGVSZWNvZ25pemVyLnByb3RvdHlwZS5tYXAgPSBtYXA7XG5cbiAgdmFyIGdlblF1ZXJ5ID0gUm91dGVSZWNvZ25pemVyLnByb3RvdHlwZS5nZW5lcmF0ZVF1ZXJ5U3RyaW5nO1xuXG4gIC8vIGV4cG9ydCBkZWZhdWx0IGZvciBob2xkaW5nIHRoZSBWdWUgcmVmZXJlbmNlXG4gIHZhciBleHBvcnRzJDEgPSB7fTtcbiAgLyoqXG4gICAqIFdhcm4gc3R1ZmYuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAgICovXG5cbiAgZnVuY3Rpb24gd2FybiQxKG1zZykge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcignW3Z1ZS1yb3V0ZXJdICcgKyBtc2cpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIGEgcmVsYXRpdmUgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGJhc2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlbGF0aXZlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwZW5kXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZnVuY3Rpb24gcmVzb2x2ZVBhdGgoYmFzZSwgcmVsYXRpdmUsIGFwcGVuZCkge1xuICAgIHZhciBxdWVyeSA9IGJhc2UubWF0Y2goLyhcXD8uKikkLyk7XG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICBxdWVyeSA9IHF1ZXJ5WzFdO1xuICAgICAgYmFzZSA9IGJhc2Uuc2xpY2UoMCwgLXF1ZXJ5Lmxlbmd0aCk7XG4gICAgfVxuICAgIC8vIGEgcXVlcnkhXG4gICAgaWYgKHJlbGF0aXZlLmNoYXJBdCgwKSA9PT0gJz8nKSB7XG4gICAgICByZXR1cm4gYmFzZSArIHJlbGF0aXZlO1xuICAgIH1cbiAgICB2YXIgc3RhY2sgPSBiYXNlLnNwbGl0KCcvJyk7XG4gICAgLy8gcmVtb3ZlIHRyYWlsaW5nIHNlZ21lbnQgaWY6XG4gICAgLy8gLSBub3QgYXBwZW5kaW5nXG4gICAgLy8gLSBhcHBlbmRpbmcgdG8gdHJhaWxpbmcgc2xhc2ggKGxhc3Qgc2VnbWVudCBpcyBlbXB0eSlcbiAgICBpZiAoIWFwcGVuZCB8fCAhc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0pIHtcbiAgICAgIHN0YWNrLnBvcCgpO1xuICAgIH1cbiAgICAvLyByZXNvbHZlIHJlbGF0aXZlIHBhdGhcbiAgICB2YXIgc2VnbWVudHMgPSByZWxhdGl2ZS5yZXBsYWNlKC9eXFwvLywgJycpLnNwbGl0KCcvJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1tpXTtcbiAgICAgIGlmIChzZWdtZW50ID09PSAnLicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2UgaWYgKHNlZ21lbnQgPT09ICcuLicpIHtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFjay5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBlbnN1cmUgbGVhZGluZyBzbGFzaFxuICAgIGlmIChzdGFja1swXSAhPT0gJycpIHtcbiAgICAgIHN0YWNrLnVuc2hpZnQoJycpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhY2suam9pbignLycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcmdpdmluZyBjaGVjayBmb3IgYSBwcm9taXNlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGlzUHJvbWlzZShwKSB7XG4gICAgcmV0dXJuIHAgJiYgdHlwZW9mIHAudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaXZlIGEgcm91dGUgY29uZmlnIGZpZWxkIGZyb20gYSBjb21wb25lbnQgaW5zdGFuY2VcbiAgICogT1IgYSBjb21wb25lbnQgY29udHJ1Y3Rvci5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbnxWdWV9IGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRSb3V0ZUNvbmZpZyhjb21wb25lbnQsIG5hbWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGNvbXBvbmVudCAmJiAoY29tcG9uZW50LiRvcHRpb25zIHx8IGNvbXBvbmVudC5vcHRpb25zKTtcbiAgICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLnJvdXRlICYmIG9wdGlvbnMucm91dGVbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSBhbiBhc3luYyBjb21wb25lbnQgZmFjdG9yeS4gSGF2ZSB0byBkbyBhIGRpcnR5XG4gICAqIG1vY2sgaGVyZSBiZWNhdXNlIG9mIFZ1ZSBjb3JlJ3MgaW50ZXJuYWwgQVBJIGRlcGVuZHMgb25cbiAgICogYW4gSUQgY2hlY2suXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gICAqL1xuXG4gIHZhciByZXNvbHZlciA9IHVuZGVmaW5lZDtcblxuICBmdW5jdGlvbiByZXNvbHZlQXN5bmNDb21wb25lbnQoaGFuZGxlciwgY2IpIHtcbiAgICBpZiAoIXJlc29sdmVyKSB7XG4gICAgICByZXNvbHZlciA9IHtcbiAgICAgICAgcmVzb2x2ZTogZXhwb3J0cyQxLlZ1ZS5wcm90b3R5cGUuX3Jlc29sdmVDb21wb25lbnQsXG4gICAgICAgICRvcHRpb25zOiB7XG4gICAgICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAgICAgXzogaGFuZGxlci5jb21wb25lbnRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmVyLiRvcHRpb25zLmNvbXBvbmVudHMuXyA9IGhhbmRsZXIuY29tcG9uZW50O1xuICAgIH1cbiAgICByZXNvbHZlci5yZXNvbHZlKCdfJywgZnVuY3Rpb24gKENvbXBvbmVudCkge1xuICAgICAgaGFuZGxlci5jb21wb25lbnQgPSBDb21wb25lbnQ7XG4gICAgICBjYihDb21wb25lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcCB0aGUgZHluYW1pYyBzZWdtZW50cyBpbiBhIHBhdGggdG8gcGFyYW1zLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVxuICAgKi9cblxuICBmdW5jdGlvbiBtYXBQYXJhbXMocGF0aCwgcGFyYW1zLCBxdWVyeSkge1xuICAgIGlmIChwYXJhbXMgPT09IHVuZGVmaW5lZCkgcGFyYW1zID0ge307XG5cbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC86KFteXFwvXSspL2csIGZ1bmN0aW9uIChfLCBrZXkpIHtcbiAgICAgIHZhciB2YWwgPSBwYXJhbXNba2V5XTtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgd2FybiQxKCdwYXJhbSBcIicgKyBrZXkgKyAnXCIgbm90IGZvdW5kIHdoZW4gZ2VuZXJhdGluZyAnICsgJ3BhdGggZm9yIFwiJyArIHBhdGggKyAnXCIgd2l0aCBwYXJhbXMgJyArIEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbCB8fCAnJztcbiAgICB9KTtcbiAgICBpZiAocXVlcnkpIHtcbiAgICAgIHBhdGggKz0gZ2VuUXVlcnkocXVlcnkpO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuXG4gIHZhciBoYXNoUkUgPSAvIy4qJC87XG5cbiAgdmFyIEhUTUw1SGlzdG9yeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSFRNTDVIaXN0b3J5KF9yZWYpIHtcbiAgICAgIHZhciByb290ID0gX3JlZi5yb290O1xuICAgICAgdmFyIG9uQ2hhbmdlID0gX3JlZi5vbkNoYW5nZTtcbiAgICAgIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MNUhpc3RvcnkpO1xuXG4gICAgICBpZiAocm9vdCAmJiByb290ICE9PSAnLycpIHtcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZXJlJ3MgdGhlIHN0YXJ0aW5nIHNsYXNoXG4gICAgICAgIGlmIChyb290LmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICAgICAgcm9vdCA9ICcvJyArIHJvb3Q7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVtb3ZlIHRyYWlsaW5nIHNsYXNoXG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3QucmVwbGFjZSgvXFwvJC8sICcnKTtcbiAgICAgICAgdGhpcy5yb290UkUgPSBuZXcgUmVnRXhwKCdeXFxcXCcgKyB0aGlzLnJvb3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgICAgIC8vIGNoZWNrIGJhc2UgdGFnXG4gICAgICB2YXIgYmFzZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYmFzZScpO1xuICAgICAgdGhpcy5iYXNlID0gYmFzZUVsICYmIGJhc2VFbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICB9XG5cbiAgICBIVE1MNUhpc3RvcnkucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgICAgICBpZiAoX3RoaXMucm9vdCkge1xuICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKF90aGlzLnJvb3RSRSwgJycpO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLm9uQ2hhbmdlKHVybCwgZSAmJiBlLnN0YXRlLCBsb2NhdGlvbi5oYXNoKTtcbiAgICAgIH07XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCB0aGlzLmxpc3RlbmVyKTtcbiAgICAgIHRoaXMubGlzdGVuZXIoKTtcbiAgICB9O1xuXG4gICAgSFRNTDVIaXN0b3J5LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMubGlzdGVuZXIpO1xuICAgIH07XG5cbiAgICBIVE1MNUhpc3RvcnkucHJvdG90eXBlLmdvID0gZnVuY3Rpb24gZ28ocGF0aCwgcmVwbGFjZSwgYXBwZW5kKSB7XG4gICAgICB2YXIgdXJsID0gdGhpcy5mb3JtYXRQYXRoKHBhdGgsIGFwcGVuZCk7XG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsIHVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZWNvcmQgc2Nyb2xsIHBvc2l0aW9uIGJ5IHJlcGxhY2luZyBjdXJyZW50IHN0YXRlXG4gICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHtcbiAgICAgICAgICBwb3M6IHtcbiAgICAgICAgICAgIHg6IHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHk6IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICAgIH1cbiAgICAgICAgfSwgJycsIGxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAvLyB0aGVuIHB1c2ggbmV3IHN0YXRlXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgdXJsKTtcbiAgICAgIH1cbiAgICAgIHZhciBoYXNoTWF0Y2ggPSBwYXRoLm1hdGNoKGhhc2hSRSk7XG4gICAgICB2YXIgaGFzaCA9IGhhc2hNYXRjaCAmJiBoYXNoTWF0Y2hbMF07XG4gICAgICBwYXRoID0gdXJsXG4gICAgICAvLyBzdHJpcCBoYXNoIHNvIGl0IGRvZXNuJ3QgbWVzcyB1cCBwYXJhbXNcbiAgICAgIC5yZXBsYWNlKGhhc2hSRSwgJycpXG4gICAgICAvLyByZW1vdmUgcm9vdCBiZWZvcmUgbWF0Y2hpbmdcbiAgICAgIC5yZXBsYWNlKHRoaXMucm9vdFJFLCAnJyk7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHBhdGgsIG51bGwsIGhhc2gpO1xuICAgIH07XG5cbiAgICBIVE1MNUhpc3RvcnkucHJvdG90eXBlLmZvcm1hdFBhdGggPSBmdW5jdGlvbiBmb3JtYXRQYXRoKHBhdGgsIGFwcGVuZCkge1xuICAgICAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLydcbiAgICAgIC8vIGFic29sdXRlIHBhdGhcbiAgICAgID8gdGhpcy5yb290ID8gdGhpcy5yb290ICsgJy8nICsgcGF0aC5yZXBsYWNlKC9eXFwvLywgJycpIDogcGF0aCA6IHJlc29sdmVQYXRoKHRoaXMuYmFzZSB8fCBsb2NhdGlvbi5wYXRobmFtZSwgcGF0aCwgYXBwZW5kKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEhUTUw1SGlzdG9yeTtcbiAgfSkoKTtcblxuICB2YXIgSGFzaEhpc3RvcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhhc2hIaXN0b3J5KF9yZWYpIHtcbiAgICAgIHZhciBoYXNoYmFuZyA9IF9yZWYuaGFzaGJhbmc7XG4gICAgICB2YXIgb25DaGFuZ2UgPSBfcmVmLm9uQ2hhbmdlO1xuICAgICAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrKHRoaXMsIEhhc2hIaXN0b3J5KTtcblxuICAgICAgdGhpcy5oYXNoYmFuZyA9IGhhc2hiYW5nO1xuICAgICAgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICAgIH1cblxuICAgIEhhc2hIaXN0b3J5LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhdGggPSBsb2NhdGlvbi5oYXNoO1xuICAgICAgICB2YXIgcmF3ID0gcGF0aC5yZXBsYWNlKC9eIyE/LywgJycpO1xuICAgICAgICAvLyBhbHdheXNcbiAgICAgICAgaWYgKHJhdy5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgICAgIHJhdyA9ICcvJyArIHJhdztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZm9ybWF0dGVkUGF0aCA9IHNlbGYuZm9ybWF0UGF0aChyYXcpO1xuICAgICAgICBpZiAoZm9ybWF0dGVkUGF0aCAhPT0gcGF0aCkge1xuICAgICAgICAgIGxvY2F0aW9uLnJlcGxhY2UoZm9ybWF0dGVkUGF0aCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRldGVybWluZSBxdWVyeVxuICAgICAgICAvLyBub3RlIGl0J3MgcG9zc2libGUgdG8gaGF2ZSBxdWVyaWVzIGluIGJvdGggdGhlIGFjdHVhbCBVUkxcbiAgICAgICAgLy8gYW5kIHRoZSBoYXNoIGZyYWdtZW50IGl0c2VsZi5cbiAgICAgICAgdmFyIHF1ZXJ5ID0gbG9jYXRpb24uc2VhcmNoICYmIHBhdGguaW5kZXhPZignPycpID4gLTEgPyAnJicgKyBsb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkgOiBsb2NhdGlvbi5zZWFyY2g7XG4gICAgICAgIHNlbGYub25DaGFuZ2UocGF0aC5yZXBsYWNlKC9eIyE/LywgJycpICsgcXVlcnkpO1xuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5saXN0ZW5lcik7XG4gICAgICB0aGlzLmxpc3RlbmVyKCk7XG4gICAgfTtcblxuICAgIEhhc2hIaXN0b3J5LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5saXN0ZW5lcik7XG4gICAgfTtcblxuICAgIEhhc2hIaXN0b3J5LnByb3RvdHlwZS5nbyA9IGZ1bmN0aW9uIGdvKHBhdGgsIHJlcGxhY2UsIGFwcGVuZCkge1xuICAgICAgcGF0aCA9IHRoaXMuZm9ybWF0UGF0aChwYXRoLCBhcHBlbmQpO1xuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgbG9jYXRpb24ucmVwbGFjZShwYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSBwYXRoO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBIYXNoSGlzdG9yeS5wcm90b3R5cGUuZm9ybWF0UGF0aCA9IGZ1bmN0aW9uIGZvcm1hdFBhdGgocGF0aCwgYXBwZW5kKSB7XG4gICAgICB2YXIgaXNBYnNvbG91dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICAgICAgdmFyIHByZWZpeCA9ICcjJyArICh0aGlzLmhhc2hiYW5nID8gJyEnIDogJycpO1xuICAgICAgcmV0dXJuIGlzQWJzb2xvdXRlID8gcHJlZml4ICsgcGF0aCA6IHByZWZpeCArIHJlc29sdmVQYXRoKGxvY2F0aW9uLmhhc2gucmVwbGFjZSgvXiMhPy8sICcnKSwgcGF0aCwgYXBwZW5kKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEhhc2hIaXN0b3J5O1xuICB9KSgpO1xuXG4gIHZhciBBYnN0cmFjdEhpc3RvcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFic3RyYWN0SGlzdG9yeShfcmVmKSB7XG4gICAgICB2YXIgb25DaGFuZ2UgPSBfcmVmLm9uQ2hhbmdlO1xuICAgICAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrKHRoaXMsIEFic3RyYWN0SGlzdG9yeSk7XG5cbiAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgICAgIHRoaXMuY3VycmVudFBhdGggPSAnLyc7XG4gICAgfVxuXG4gICAgQWJzdHJhY3RIaXN0b3J5LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgdGhpcy5vbkNoYW5nZSgnLycpO1xuICAgIH07XG5cbiAgICBBYnN0cmFjdEhpc3RvcnkucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgLy8gbm9vcFxuICAgIH07XG5cbiAgICBBYnN0cmFjdEhpc3RvcnkucHJvdG90eXBlLmdvID0gZnVuY3Rpb24gZ28ocGF0aCwgcmVwbGFjZSwgYXBwZW5kKSB7XG4gICAgICBwYXRoID0gdGhpcy5jdXJyZW50UGF0aCA9IHRoaXMuZm9ybWF0UGF0aChwYXRoLCBhcHBlbmQpO1xuICAgICAgdGhpcy5vbkNoYW5nZShwYXRoKTtcbiAgICB9O1xuXG4gICAgQWJzdHJhY3RIaXN0b3J5LnByb3RvdHlwZS5mb3JtYXRQYXRoID0gZnVuY3Rpb24gZm9ybWF0UGF0aChwYXRoLCBhcHBlbmQpIHtcbiAgICAgIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nID8gcGF0aCA6IHJlc29sdmVQYXRoKHRoaXMuY3VycmVudFBhdGgsIHBhdGgsIGFwcGVuZCk7XG4gICAgfTtcblxuICAgIHJldHVybiBBYnN0cmFjdEhpc3Rvcnk7XG4gIH0pKCk7XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgcmV1c2FiaWxpdHkgb2YgYW4gZXhpc3Rpbmcgcm91dGVyIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSB7RGlyZWN0aXZlfSB2aWV3XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVyXG4gICAqIEBwYXJhbSB7VHJhbnNpdGlvbn0gdHJhbnNpdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBjYW5SZXVzZSh2aWV3LCBoYW5kbGVyLCB0cmFuc2l0aW9uKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHZpZXcuY2hpbGRWTTtcbiAgICBpZiAoIWNvbXBvbmVudCB8fCAhaGFuZGxlcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBpbXBvcnRhbnQ6IGNoZWNrIHZpZXcuQ29tcG9uZW50IGhlcmUgYmVjYXVzZSBpdCBtYXlcbiAgICAvLyBoYXZlIGJlZW4gY2hhbmdlZCBpbiBhY3RpdmF0ZSBob29rXG4gICAgaWYgKHZpZXcuQ29tcG9uZW50ICE9PSBoYW5kbGVyLmNvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgY2FuUmV1c2VGbiA9IGdldFJvdXRlQ29uZmlnKGNvbXBvbmVudCwgJ2NhblJldXNlJyk7XG4gICAgcmV0dXJuIHR5cGVvZiBjYW5SZXVzZUZuID09PSAnYm9vbGVhbicgPyBjYW5SZXVzZUZuIDogY2FuUmV1c2VGbiA/IGNhblJldXNlRm4uY2FsbChjb21wb25lbnQsIHtcbiAgICAgIHRvOiB0cmFuc2l0aW9uLnRvLFxuICAgICAgZnJvbTogdHJhbnNpdGlvbi5mcm9tXG4gICAgfSkgOiB0cnVlOyAvLyBkZWZhdWx0cyB0byB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBjb21wb25lbnQgY2FuIGRlYWN0aXZhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RGlyZWN0aXZlfSB2aWV3XG4gICAqIEBwYXJhbSB7VHJhbnNpdGlvbn0gdHJhbnNpdGlvblxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNhbkRlYWN0aXZhdGUodmlldywgdHJhbnNpdGlvbiwgbmV4dCkge1xuICAgIHZhciBmcm9tQ29tcG9uZW50ID0gdmlldy5jaGlsZFZNO1xuICAgIHZhciBob29rID0gZ2V0Um91dGVDb25maWcoZnJvbUNvbXBvbmVudCwgJ2NhbkRlYWN0aXZhdGUnKTtcbiAgICBpZiAoIWhvb2spIHtcbiAgICAgIG5leHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNpdGlvbi5jYWxsSG9vayhob29rLCBmcm9tQ29tcG9uZW50LCBuZXh0LCB7XG4gICAgICAgIGV4cGVjdEJvb2xlYW46IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGNvbXBvbmVudCBjYW4gYWN0aXZhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVyXG4gICAqIEBwYXJhbSB7VHJhbnNpdGlvbn0gdHJhbnNpdGlvblxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNhbkFjdGl2YXRlKGhhbmRsZXIsIHRyYW5zaXRpb24sIG5leHQpIHtcbiAgICByZXNvbHZlQXN5bmNDb21wb25lbnQoaGFuZGxlciwgZnVuY3Rpb24gKENvbXBvbmVudCkge1xuICAgICAgLy8gaGF2ZSB0byBjaGVjayBkdWUgdG8gYXN5bmMtbmVzc1xuICAgICAgaWYgKHRyYW5zaXRpb24uYWJvcnRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBkZXRlcm1pbmUgaWYgdGhpcyBjb21wb25lbnQgY2FuIGJlIGFjdGl2YXRlZFxuICAgICAgdmFyIGhvb2sgPSBnZXRSb3V0ZUNvbmZpZyhDb21wb25lbnQsICdjYW5BY3RpdmF0ZScpO1xuICAgICAgaWYgKCFob29rKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYW5zaXRpb24uY2FsbEhvb2soaG9vaywgbnVsbCwgbmV4dCwge1xuICAgICAgICAgIGV4cGVjdEJvb2xlYW46IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBkZWFjdGl2YXRlIGhvb2tzIGZvciBleGlzdGluZyByb3V0ZXItdmlld3MuXG4gICAqXG4gICAqIEBwYXJhbSB7RGlyZWN0aXZlfSB2aWV3XG4gICAqIEBwYXJhbSB7VHJhbnNpdGlvbn0gdHJhbnNpdGlvblxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGRlYWN0aXZhdGUodmlldywgdHJhbnNpdGlvbiwgbmV4dCkge1xuICAgIHZhciBjb21wb25lbnQgPSB2aWV3LmNoaWxkVk07XG4gICAgdmFyIGhvb2sgPSBnZXRSb3V0ZUNvbmZpZyhjb21wb25lbnQsICdkZWFjdGl2YXRlJyk7XG4gICAgaWYgKCFob29rKSB7XG4gICAgICBuZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zaXRpb24uY2FsbEhvb2tzKGhvb2ssIGNvbXBvbmVudCwgbmV4dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlIC8gc3dpdGNoIGNvbXBvbmVudCBmb3IgYSByb3V0ZXItdmlldy5cbiAgICpcbiAgICogQHBhcmFtIHtEaXJlY3RpdmV9IHZpZXdcbiAgICogQHBhcmFtIHtUcmFuc2l0aW9ufSB0cmFuc2l0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkZXB0aFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGFjdGl2YXRlKHZpZXcsIHRyYW5zaXRpb24sIGRlcHRoLCBjYiwgcmV1c2UpIHtcbiAgICB2YXIgaGFuZGxlciA9IHRyYW5zaXRpb24uYWN0aXZhdGVRdWV1ZVtkZXB0aF07XG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICBzYXZlQ2hpbGRWaWV3KHZpZXcpO1xuICAgICAgaWYgKHZpZXcuX2JvdW5kKSB7XG4gICAgICAgIHZpZXcuc2V0Q29tcG9uZW50KG51bGwpO1xuICAgICAgfVxuICAgICAgY2IgJiYgY2IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgQ29tcG9uZW50ID0gdmlldy5Db21wb25lbnQgPSBoYW5kbGVyLmNvbXBvbmVudDtcbiAgICB2YXIgYWN0aXZhdGVIb29rID0gZ2V0Um91dGVDb25maWcoQ29tcG9uZW50LCAnYWN0aXZhdGUnKTtcbiAgICB2YXIgZGF0YUhvb2sgPSBnZXRSb3V0ZUNvbmZpZyhDb21wb25lbnQsICdkYXRhJyk7XG4gICAgdmFyIHdhaXRGb3JEYXRhID0gZ2V0Um91dGVDb25maWcoQ29tcG9uZW50LCAnd2FpdEZvckRhdGEnKTtcblxuICAgIHZpZXcuZGVwdGggPSBkZXB0aDtcbiAgICB2aWV3LmFjdGl2YXRlZCA9IGZhbHNlO1xuXG4gICAgdmFyIGNvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgICB2YXIgbG9hZGluZyA9ICEhKGRhdGFIb29rICYmICF3YWl0Rm9yRGF0YSk7XG5cbiAgICAvLyBcInJldXNlXCIgaXMgYSBmbGFnIHBhc3NlZCBkb3duIHdoZW4gdGhlIHBhcmVudCB2aWV3IGlzXG4gICAgLy8gZWl0aGVyIHJldXNlZCB2aWEga2VlcC1hbGl2ZSBvciBhcyBhIGNoaWxkIG9mIGEga2VwdC1hbGl2ZSB2aWV3LlxuICAgIC8vIG9mIGNvdXJzZSB3ZSBjYW4gb25seSByZXVzZSBpZiB0aGUgY3VycmVudCBrZXB0LWFsaXZlIGluc3RhbmNlXG4gICAgLy8gaXMgb2YgdGhlIGNvcnJlY3QgdHlwZS5cbiAgICByZXVzZSA9IHJldXNlICYmIHZpZXcuY2hpbGRWTSAmJiB2aWV3LmNoaWxkVk0uY29uc3RydWN0b3IgPT09IENvbXBvbmVudDtcblxuICAgIGlmIChyZXVzZSkge1xuICAgICAgLy8ganVzdCByZXVzZVxuICAgICAgY29tcG9uZW50ID0gdmlldy5jaGlsZFZNO1xuICAgICAgY29tcG9uZW50LiRsb2FkaW5nUm91dGVEYXRhID0gbG9hZGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgc2F2ZUNoaWxkVmlldyh2aWV3KTtcblxuICAgICAgLy8gdW5idWlsZCBjdXJyZW50IGNvbXBvbmVudC4gdGhpcyBzdGVwIGFsc28gZGVzdHJveXNcbiAgICAgIC8vIGFuZCByZW1vdmVzIGFsbCBuZXN0ZWQgY2hpbGQgdmlld3MuXG4gICAgICB2aWV3LnVuYnVpbGQodHJ1ZSk7XG5cbiAgICAgIC8vIGJ1aWxkIHRoZSBuZXcgY29tcG9uZW50LiB0aGlzIHdpbGwgYWxzbyBjcmVhdGUgdGhlXG4gICAgICAvLyBkaXJlY3QgY2hpbGQgdmlldyBvZiB0aGUgY3VycmVudCBvbmUuIGl0IHdpbGwgcmVnaXN0ZXJcbiAgICAgIC8vIGl0c2VsZiBhcyB2aWV3LmNoaWxkVmlldy5cbiAgICAgIGNvbXBvbmVudCA9IHZpZXcuYnVpbGQoe1xuICAgICAgICBfbWV0YToge1xuICAgICAgICAgICRsb2FkaW5nUm91dGVEYXRhOiBsb2FkaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQoKSB7XG4gICAgICAgICAgdGhpcy5fcm91dGVyVmlldyA9IHZpZXc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBoYW5kbGUga2VlcC1hbGl2ZS5cbiAgICAgIC8vIHdoZW4gYSBrZXB0LWFsaXZlIGNoaWxkIHZtIGlzIHJlc3RvcmVkLCB3ZSBuZWVkIHRvXG4gICAgICAvLyBhZGQgaXRzIGNhY2hlZCBjaGlsZCB2aWV3cyBpbnRvIHRoZSByb3V0ZXIncyB2aWV3IGxpc3QsXG4gICAgICAvLyBhbmQgYWxzbyBwcm9wZXJseSB1cGRhdGUgY3VycmVudCB2aWV3J3MgY2hpbGQgdmlldy5cbiAgICAgIGlmICh2aWV3LmtlZXBBbGl2ZSkge1xuICAgICAgICBjb21wb25lbnQuJGxvYWRpbmdSb3V0ZURhdGEgPSBsb2FkaW5nO1xuICAgICAgICB2YXIgY2FjaGVkQ2hpbGRWaWV3ID0gY29tcG9uZW50Ll9rZWVwQWxpdmVSb3V0ZXJWaWV3O1xuICAgICAgICBpZiAoY2FjaGVkQ2hpbGRWaWV3KSB7XG4gICAgICAgICAgdmlldy5jaGlsZFZpZXcgPSBjYWNoZWRDaGlsZFZpZXc7XG4gICAgICAgICAgY29tcG9uZW50Ll9rZWVwQWxpdmVSb3V0ZXJWaWV3ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNsZWFudXAgdGhlIGNvbXBvbmVudCBpbiBjYXNlIHRoZSB0cmFuc2l0aW9uIGlzIGFib3J0ZWRcbiAgICAvLyBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyBldmVyIGluc2VydGVkLlxuICAgIHZhciBjbGVhbnVwID0gZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICAgIGNvbXBvbmVudC4kZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICAvLyBhY3R1YWxseSBpbnNlcnQgdGhlIGNvbXBvbmVudCBhbmQgdHJpZ2dlciB0cmFuc2l0aW9uXG4gICAgdmFyIGluc2VydCA9IGZ1bmN0aW9uIGluc2VydCgpIHtcbiAgICAgIGlmIChyZXVzZSkge1xuICAgICAgICBjYiAmJiBjYigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgcm91dGVyID0gdHJhbnNpdGlvbi5yb3V0ZXI7XG4gICAgICBpZiAocm91dGVyLl9yZW5kZXJlZCB8fCByb3V0ZXIuX3RyYW5zaXRpb25PbkxvYWQpIHtcbiAgICAgICAgdmlldy50cmFuc2l0aW9uKGNvbXBvbmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBubyB0cmFuc2l0aW9uIG9uIGZpcnN0IHJlbmRlciwgbWFudWFsIHRyYW5zaXRpb25cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICh2aWV3LnNldEN1cnJlbnQpIHtcbiAgICAgICAgICAvLyAwLjEyIGNvbXBhdFxuICAgICAgICAgIHZpZXcuc2V0Q3VycmVudChjb21wb25lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIDEuMFxuICAgICAgICAgIHZpZXcuY2hpbGRWTSA9IGNvbXBvbmVudDtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQuJGJlZm9yZSh2aWV3LmFuY2hvciwgbnVsbCwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgY2IgJiYgY2IoKTtcbiAgICB9O1xuXG4gICAgdmFyIGFmdGVyRGF0YSA9IGZ1bmN0aW9uIGFmdGVyRGF0YSgpIHtcbiAgICAgIC8vIGFjdGl2YXRlIHRoZSBjaGlsZCB2aWV3XG4gICAgICBpZiAodmlldy5jaGlsZFZpZXcpIHtcbiAgICAgICAgYWN0aXZhdGUodmlldy5jaGlsZFZpZXcsIHRyYW5zaXRpb24sIGRlcHRoICsgMSwgbnVsbCwgcmV1c2UgfHwgdmlldy5rZWVwQWxpdmUpO1xuICAgICAgfVxuICAgICAgaW5zZXJ0KCk7XG4gICAgfTtcblxuICAgIC8vIGNhbGxlZCBhZnRlciBhY3RpdmF0aW9uIGhvb2sgaXMgcmVzb2x2ZWRcbiAgICB2YXIgYWZ0ZXJBY3RpdmF0ZSA9IGZ1bmN0aW9uIGFmdGVyQWN0aXZhdGUoKSB7XG4gICAgICB2aWV3LmFjdGl2YXRlZCA9IHRydWU7XG4gICAgICBpZiAoZGF0YUhvb2sgJiYgd2FpdEZvckRhdGEpIHtcbiAgICAgICAgLy8gd2FpdCB1bnRpbCBkYXRhIGxvYWRlZCB0byBpbnNlcnRcbiAgICAgICAgbG9hZERhdGEoY29tcG9uZW50LCB0cmFuc2l0aW9uLCBkYXRhSG9vaywgYWZ0ZXJEYXRhLCBjbGVhbnVwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGxvYWQgZGF0YSBhbmQgaW5zZXJ0IGF0IHRoZSBzYW1lIHRpbWVcbiAgICAgICAgaWYgKGRhdGFIb29rKSB7XG4gICAgICAgICAgbG9hZERhdGEoY29tcG9uZW50LCB0cmFuc2l0aW9uLCBkYXRhSG9vayk7XG4gICAgICAgIH1cbiAgICAgICAgYWZ0ZXJEYXRhKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChhY3RpdmF0ZUhvb2spIHtcbiAgICAgIHRyYW5zaXRpb24uY2FsbEhvb2tzKGFjdGl2YXRlSG9vaywgY29tcG9uZW50LCBhZnRlckFjdGl2YXRlLCB7XG4gICAgICAgIGNsZWFudXA6IGNsZWFudXAsXG4gICAgICAgIHBvc3RBY3RpdmF0ZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFmdGVyQWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV1c2UgYSB2aWV3LCBqdXN0IHJlbG9hZCBkYXRhIGlmIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHBhcmFtIHtEaXJlY3RpdmV9IHZpZXdcbiAgICogQHBhcmFtIHtUcmFuc2l0aW9ufSB0cmFuc2l0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJldXNlKHZpZXcsIHRyYW5zaXRpb24pIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdmlldy5jaGlsZFZNO1xuICAgIHZhciBkYXRhSG9vayA9IGdldFJvdXRlQ29uZmlnKGNvbXBvbmVudCwgJ2RhdGEnKTtcbiAgICBpZiAoZGF0YUhvb2spIHtcbiAgICAgIGxvYWREYXRhKGNvbXBvbmVudCwgdHJhbnNpdGlvbiwgZGF0YUhvb2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXNseSBsb2FkIGFuZCBhcHBseSBkYXRhIHRvIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge1RyYW5zaXRpb259IHRyYW5zaXRpb25cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaG9va1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbGVhbnVwXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGxvYWREYXRhKGNvbXBvbmVudCwgdHJhbnNpdGlvbiwgaG9vaywgY2IsIGNsZWFudXApIHtcbiAgICBjb21wb25lbnQuJGxvYWRpbmdSb3V0ZURhdGEgPSB0cnVlO1xuICAgIHRyYW5zaXRpb24uY2FsbEhvb2tzKGhvb2ssIGNvbXBvbmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgY29tcG9uZW50LiRsb2FkaW5nUm91dGVEYXRhID0gZmFsc2U7XG4gICAgICBjb21wb25lbnQuJGVtaXQoJ3JvdXRlLWRhdGEtbG9hZGVkJywgY29tcG9uZW50KTtcbiAgICAgIGNiICYmIGNiKCk7XG4gICAgfSwge1xuICAgICAgY2xlYW51cDogY2xlYW51cCxcbiAgICAgIHBvc3RBY3RpdmF0ZTogdHJ1ZSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmdW5jdGlvbiBwcm9jZXNzRGF0YShkYXRhKSB7XG4gICAgICAgIC8vIGhhbmRsZSBwcm9taXNlIHN1Z2FyIHN5bnRheFxuICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgaWYgKGlzUGxhaW5PYmplY3QoZGF0YSkpIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBkYXRhW2tleV07XG4gICAgICAgICAgICBpZiAoaXNQcm9taXNlKHZhbCkpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaCh2YWwudGhlbihmdW5jdGlvbiAocmVzb2x2ZWRWYWwpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuJHNldChrZXksIHJlc29sdmVkVmFsKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29tcG9uZW50LiRzZXQoa2V5LCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9taXNlcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZXNbMF0uY29uc3RydWN0b3IuYWxsKHByb21pc2VzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNoaWxkIHZpZXcgZm9yIGEga2VwdC1hbGl2ZSB2aWV3IHNvIHRoYXRcbiAgICogd2UgY2FuIHJlc3RvcmUgaXQgd2hlbiBpdCBpcyBzd2l0Y2hlZCBiYWNrIHRvLlxuICAgKlxuICAgKiBAcGFyYW0ge0RpcmVjdGl2ZX0gdmlld1xuICAgKi9cblxuICBmdW5jdGlvbiBzYXZlQ2hpbGRWaWV3KHZpZXcpIHtcbiAgICBpZiAodmlldy5rZWVwQWxpdmUgJiYgdmlldy5jaGlsZFZNICYmIHZpZXcuY2hpbGRWaWV3KSB7XG4gICAgICB2aWV3LmNoaWxkVk0uX2tlZXBBbGl2ZVJvdXRlclZpZXcgPSB2aWV3LmNoaWxkVmlldztcbiAgICB9XG4gICAgdmlldy5jaGlsZFZpZXcgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHBsYWluIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWxcbiAgICovXG5cbiAgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWwpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgUm91dGVUcmFuc2l0aW9uIG9iamVjdCBtYW5hZ2VzIHRoZSBwaXBlbGluZSBvZiBhXG4gICAqIHJvdXRlci12aWV3IHN3aXRjaGluZyBwcm9jZXNzLiBUaGlzIGlzIGFsc28gdGhlIG9iamVjdFxuICAgKiBwYXNzZWQgaW50byB1c2VyIHJvdXRlIGhvb2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge1JvdXRlcn0gcm91dGVyXG4gICAqIEBwYXJhbSB7Um91dGV9IHRvXG4gICAqIEBwYXJhbSB7Um91dGV9IGZyb21cbiAgICovXG5cbiAgdmFyIFJvdXRlVHJhbnNpdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUm91dGVUcmFuc2l0aW9uKHJvdXRlciwgdG8sIGZyb20pIHtcbiAgICAgIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayh0aGlzLCBSb3V0ZVRyYW5zaXRpb24pO1xuXG4gICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcbiAgICAgIHRoaXMudG8gPSB0bztcbiAgICAgIHRoaXMuZnJvbSA9IGZyb207XG4gICAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgICAgdGhpcy5hYm9ydGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBYm9ydCBjdXJyZW50IHRyYW5zaXRpb24gYW5kIHJldHVybiB0byBwcmV2aW91cyBsb2NhdGlvbi5cbiAgICAgKi9cblxuICAgIFJvdXRlVHJhbnNpdGlvbi5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbiBhYm9ydCgpIHtcbiAgICAgIGlmICghdGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIC8vIGlmIHRoZSByb290IHBhdGggdGhyb3dzIGFuIGVycm9yIGR1cmluZyB2YWxpZGF0aW9uXG4gICAgICAgIC8vIG9uIGluaXRpYWwgbG9hZCwgaXQgZ2V0cyBjYXVnaHQgaW4gYW4gaW5maW5pdGUgbG9vcC5cbiAgICAgICAgdmFyIGFib3J0aW5nT25Mb2FkID0gIXRoaXMuZnJvbS5wYXRoICYmIHRoaXMudG8ucGF0aCA9PT0gJy8nO1xuICAgICAgICBpZiAoIWFib3J0aW5nT25Mb2FkKSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIucmVwbGFjZSh0aGlzLmZyb20ucGF0aCB8fCAnLycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFib3J0IGN1cnJlbnQgdHJhbnNpdGlvbiBhbmQgcmVkaXJlY3QgdG8gYSBuZXcgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqL1xuXG4gICAgUm91dGVUcmFuc2l0aW9uLnByb3RvdHlwZS5yZWRpcmVjdCA9IGZ1bmN0aW9uIHJlZGlyZWN0KHBhdGgpIHtcbiAgICAgIGlmICghdGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBwYXRoID0gbWFwUGFyYW1zKHBhdGgsIHRoaXMudG8ucGFyYW1zLCB0aGlzLnRvLnF1ZXJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoLnBhcmFtcyA9IHBhdGgucGFyYW1zIHx8IHRoaXMudG8ucGFyYW1zO1xuICAgICAgICAgIHBhdGgucXVlcnkgPSBwYXRoLnF1ZXJ5IHx8IHRoaXMudG8ucXVlcnk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3V0ZXIucmVwbGFjZShwYXRoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQSByb3V0ZXIgdmlldyB0cmFuc2l0aW9uJ3MgcGlwZWxpbmUgY2FuIGJlIGRlc2NyaWJlZCBhc1xuICAgICAqIGZvbGxvd3MsIGFzc3VtaW5nIHdlIGFyZSB0cmFuc2l0aW9uaW5nIGZyb20gYW4gZXhpc3RpbmdcbiAgICAgKiA8cm91dGVyLXZpZXc+IGNoYWluIFtDb21wb25lbnQgQSwgQ29tcG9uZW50IEJdIHRvIGEgbmV3XG4gICAgICogY2hhaW4gW0NvbXBvbmVudCBBLCBDb21wb25lbnQgQ106XG4gICAgICpcbiAgICAgKiAgQSAgICBBXG4gICAgICogIHwgPT4gfFxuICAgICAqICBCICAgIENcbiAgICAgKlxuICAgICAqIDEuIFJldXNhYmxpdHkgcGhhc2U6XG4gICAgICogICAtPiBjYW5SZXVzZShBLCBBKVxuICAgICAqICAgLT4gY2FuUmV1c2UoQiwgQylcbiAgICAgKiAgIC0+IGRldGVybWluZSBuZXcgcXVldWVzOlxuICAgICAqICAgICAgLSBkZWFjdGl2YXRpb246IFtCXVxuICAgICAqICAgICAgLSBhY3RpdmF0aW9uOiBbQ11cbiAgICAgKlxuICAgICAqIDIuIFZhbGlkYXRpb24gcGhhc2U6XG4gICAgICogICAtPiBjYW5EZWFjdGl2YXRlKEIpXG4gICAgICogICAtPiBjYW5BY3RpdmF0ZShDKVxuICAgICAqXG4gICAgICogMy4gQWN0aXZhdGlvbiBwaGFzZTpcbiAgICAgKiAgIC0+IGRlYWN0aXZhdGUoQilcbiAgICAgKiAgIC0+IGFjdGl2YXRlKEMpXG4gICAgICpcbiAgICAgKiBFYWNoIG9mIHRoZXNlIHN0ZXBzIGNhbiBiZSBhc3luY2hyb25vdXMsIGFuZCBhbnlcbiAgICAgKiBzdGVwIGNhbiBwb3RlbnRpYWxseSBhYm9ydCB0aGUgdHJhbnNpdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gICAgICovXG5cbiAgICBSb3V0ZVRyYW5zaXRpb24ucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoY2IpIHtcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcztcblxuICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBxdWV1ZSBvZiB2aWV3cyB0byBkZWFjdGl2YXRlXG4gICAgICB2YXIgZGVhY3RpdmF0ZVF1ZXVlID0gW107XG4gICAgICB2YXIgdmlldyA9IHRoaXMucm91dGVyLl9yb290VmlldztcbiAgICAgIHdoaWxlICh2aWV3KSB7XG4gICAgICAgIGRlYWN0aXZhdGVRdWV1ZS51bnNoaWZ0KHZpZXcpO1xuICAgICAgICB2aWV3ID0gdmlldy5jaGlsZFZpZXc7XG4gICAgICB9XG4gICAgICB2YXIgcmV2ZXJzZURlYWN0aXZhdGVRdWV1ZSA9IGRlYWN0aXZhdGVRdWV1ZS5zbGljZSgpLnJldmVyc2UoKTtcblxuICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBxdWV1ZSBvZiByb3V0ZSBoYW5kbGVycyB0byBhY3RpdmF0ZVxuICAgICAgdmFyIGFjdGl2YXRlUXVldWUgPSB0aGlzLmFjdGl2YXRlUXVldWUgPSB0b0FycmF5KHRoaXMudG8ubWF0Y2hlZCkubWFwKGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICByZXR1cm4gbWF0Y2guaGFuZGxlcjtcbiAgICAgIH0pO1xuXG4gICAgICAvLyAxLiBSZXVzYWJpbGl0eSBwaGFzZVxuICAgICAgdmFyIGkgPSB1bmRlZmluZWQsXG4gICAgICAgICAgcmV1c2VRdWV1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCByZXZlcnNlRGVhY3RpdmF0ZVF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghY2FuUmV1c2UocmV2ZXJzZURlYWN0aXZhdGVRdWV1ZVtpXSwgYWN0aXZhdGVRdWV1ZVtpXSwgdHJhbnNpdGlvbikpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgIHJldXNlUXVldWUgPSByZXZlcnNlRGVhY3RpdmF0ZVF1ZXVlLnNsaWNlKDAsIGkpO1xuICAgICAgICBkZWFjdGl2YXRlUXVldWUgPSByZXZlcnNlRGVhY3RpdmF0ZVF1ZXVlLnNsaWNlKGkpLnJldmVyc2UoKTtcbiAgICAgICAgYWN0aXZhdGVRdWV1ZSA9IGFjdGl2YXRlUXVldWUuc2xpY2UoaSk7XG4gICAgICB9XG5cbiAgICAgIC8vIDIuIFZhbGlkYXRpb24gcGhhc2VcbiAgICAgIHRyYW5zaXRpb24ucnVuUXVldWUoZGVhY3RpdmF0ZVF1ZXVlLCBjYW5EZWFjdGl2YXRlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyYW5zaXRpb24ucnVuUXVldWUoYWN0aXZhdGVRdWV1ZSwgY2FuQWN0aXZhdGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0cmFuc2l0aW9uLnJ1blF1ZXVlKGRlYWN0aXZhdGVRdWV1ZSwgZGVhY3RpdmF0ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gMy4gQWN0aXZhdGlvbiBwaGFzZVxuXG4gICAgICAgICAgICAvLyBVcGRhdGUgcm91dGVyIGN1cnJlbnQgcm91dGVcbiAgICAgICAgICAgIHRyYW5zaXRpb24ucm91dGVyLl9vblRyYW5zaXRpb25WYWxpZGF0ZWQodHJhbnNpdGlvbik7XG5cbiAgICAgICAgICAgIC8vIHRyaWdnZXIgcmV1c2UgZm9yIGFsbCByZXVzZWQgdmlld3NcbiAgICAgICAgICAgIHJldXNlUXVldWUgJiYgcmV1c2VRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXVzZSh2aWV3LCB0cmFuc2l0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB0aGUgcm9vdCBvZiB0aGUgY2hhaW4gdGhhdCBuZWVkcyB0byBiZSByZXBsYWNlZFxuICAgICAgICAgICAgLy8gaXMgdGhlIHRvcC1tb3N0IG5vbi1yZXVzYWJsZSB2aWV3LlxuICAgICAgICAgICAgaWYgKGRlYWN0aXZhdGVRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdmFyIF92aWV3ID0gZGVhY3RpdmF0ZVF1ZXVlW2RlYWN0aXZhdGVRdWV1ZS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgdmFyIGRlcHRoID0gcmV1c2VRdWV1ZSA/IHJldXNlUXVldWUubGVuZ3RoIDogMDtcbiAgICAgICAgICAgICAgYWN0aXZhdGUoX3ZpZXcsIHRyYW5zaXRpb24sIGRlcHRoLCBjYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBc3luY2hyb25vdXNseSBhbmQgc2VxdWVudGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gdG8gYVxuICAgICAqIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gcXVldWVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gICAgICovXG5cbiAgICBSb3V0ZVRyYW5zaXRpb24ucHJvdG90eXBlLnJ1blF1ZXVlID0gZnVuY3Rpb24gcnVuUXVldWUocXVldWUsIGZuLCBjYikge1xuICAgICAgdmFyIHRyYW5zaXRpb24gPSB0aGlzO1xuICAgICAgc3RlcCgwKTtcbiAgICAgIGZ1bmN0aW9uIHN0ZXAoaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ID49IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgIGNiKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm4ocXVldWVbaW5kZXhdLCB0cmFuc2l0aW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGVwKGluZGV4ICsgMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBhIHVzZXIgcHJvdmlkZWQgcm91dGUgdHJhbnNpdGlvbiBob29rIGFuZCBoYW5kbGVcbiAgICAgKiB0aGUgcmVzcG9uc2UgKGUuZy4gaWYgdGhlIHVzZXIgcmV0dXJucyBhIHByb21pc2UpLlxuICAgICAqXG4gICAgICogSWYgdGhlIHVzZXIgbmVpdGhlciBleHBlY3RzIGFuIGFyZ3VtZW50IG5vciByZXR1cm5zIGFcbiAgICAgKiBwcm9taXNlLCB0aGUgaG9vayBpcyBhc3N1bWVkIHRvIGJlIHN5bmNocm9ub3VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaG9va1xuICAgICAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gZXhwZWN0Qm9vbGVhblxuICAgICAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBwb3N0QWN0aXZlXG4gICAgICogICAgICAgICAgICAgICAgIC0ge0Z1bmN0aW9ufSBwcm9jZXNzRGF0YVxuICAgICAqICAgICAgICAgICAgICAgICAtIHtGdW5jdGlvbn0gY2xlYW51cFxuICAgICAqL1xuXG4gICAgUm91dGVUcmFuc2l0aW9uLnByb3RvdHlwZS5jYWxsSG9vayA9IGZ1bmN0aW9uIGNhbGxIb29rKGhvb2ssIGNvbnRleHQsIGNiKSB7XG4gICAgICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMyB8fCBhcmd1bWVudHNbM10gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzNdO1xuXG4gICAgICB2YXIgX3JlZiRleHBlY3RCb29sZWFuID0gX3JlZi5leHBlY3RCb29sZWFuO1xuICAgICAgdmFyIGV4cGVjdEJvb2xlYW4gPSBfcmVmJGV4cGVjdEJvb2xlYW4gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRleHBlY3RCb29sZWFuO1xuICAgICAgdmFyIF9yZWYkcG9zdEFjdGl2YXRlID0gX3JlZi5wb3N0QWN0aXZhdGU7XG4gICAgICB2YXIgcG9zdEFjdGl2YXRlID0gX3JlZiRwb3N0QWN0aXZhdGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRwb3N0QWN0aXZhdGU7XG4gICAgICB2YXIgcHJvY2Vzc0RhdGEgPSBfcmVmLnByb2Nlc3NEYXRhO1xuICAgICAgdmFyIGNsZWFudXAgPSBfcmVmLmNsZWFudXA7XG5cbiAgICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcztcbiAgICAgIHZhciBuZXh0Q2FsbGVkID0gZmFsc2U7XG5cbiAgICAgIC8vIGFib3J0IHRoZSB0cmFuc2l0aW9uXG4gICAgICB2YXIgYWJvcnQgPSBmdW5jdGlvbiBhYm9ydCgpIHtcbiAgICAgICAgY2xlYW51cCAmJiBjbGVhbnVwKCk7XG4gICAgICAgIHRyYW5zaXRpb24uYWJvcnQoKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIGhhbmRsZSBlcnJvcnNcbiAgICAgIHZhciBvbkVycm9yID0gZnVuY3Rpb24gb25FcnJvcihlcnIpIHtcbiAgICAgICAgcG9zdEFjdGl2YXRlID8gbmV4dCgpIDogYWJvcnQoKTtcbiAgICAgICAgaWYgKGVyciAmJiAhdHJhbnNpdGlvbi5yb3V0ZXIuX3N1cHByZXNzKSB7XG4gICAgICAgICAgd2FybiQxKCdVbmNhdWdodCBlcnJvciBkdXJpbmcgdHJhbnNpdGlvbjogJyk7XG4gICAgICAgICAgdGhyb3cgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIgOiBuZXcgRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gc2luY2UgcHJvbWlzZSBzd2FsbG93cyBlcnJvcnMsIHdlIGhhdmUgdG9cbiAgICAgIC8vIHRocm93IGl0IGluIHRoZSBuZXh0IHRpY2suLi5cbiAgICAgIHZhciBvblByb21pc2VFcnJvciA9IGZ1bmN0aW9uIG9uUHJvbWlzZUVycm9yKGVycikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG9uRXJyb3IoZXJyKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gYWR2YW5jZSB0aGUgdHJhbnNpdGlvbiB0byB0aGUgbmV4dCBzdGVwXG4gICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgIGlmIChuZXh0Q2FsbGVkKSB7XG4gICAgICAgICAgd2FybiQxKCd0cmFuc2l0aW9uLm5leHQoKSBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZS4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbmV4dENhbGxlZCA9IHRydWU7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmFib3J0ZWQpIHtcbiAgICAgICAgICBjbGVhbnVwICYmIGNsZWFudXAoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2IgJiYgY2IoKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBuZXh0V2l0aEJvb2xlYW4gPSBmdW5jdGlvbiBuZXh0V2l0aEJvb2xlYW4ocmVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICByZXMgPyBuZXh0KCkgOiBhYm9ydCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUHJvbWlzZShyZXMpKSB7XG4gICAgICAgICAgcmVzLnRoZW4oZnVuY3Rpb24gKG9rKSB7XG4gICAgICAgICAgICBvayA/IG5leHQoKSA6IGFib3J0KCk7XG4gICAgICAgICAgfSwgb25Qcm9taXNlRXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKCFob29rLmxlbmd0aCkge1xuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIG5leHRXaXRoRGF0YSA9IGZ1bmN0aW9uIG5leHRXaXRoRGF0YShkYXRhKSB7XG4gICAgICAgIHZhciByZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVzID0gcHJvY2Vzc0RhdGEoZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJldHVybiBvbkVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJvbWlzZShyZXMpKSB7XG4gICAgICAgICAgcmVzLnRoZW4obmV4dCwgb25Qcm9taXNlRXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gZXhwb3NlIGEgY2xvbmUgb2YgdGhlIHRyYW5zaXRpb24gb2JqZWN0LCBzbyB0aGF0IGVhY2hcbiAgICAgIC8vIGhvb2sgZ2V0cyBhIGNsZWFuIGNvcHkgYW5kIHByZXZlbnQgdGhlIHVzZXIgZnJvbVxuICAgICAgLy8gbWVzc2luZyB3aXRoIHRoZSBpbnRlcm5hbHMuXG4gICAgICB2YXIgZXhwb3NlZCA9IHtcbiAgICAgICAgdG86IHRyYW5zaXRpb24udG8sXG4gICAgICAgIGZyb206IHRyYW5zaXRpb24uZnJvbSxcbiAgICAgICAgYWJvcnQ6IGFib3J0LFxuICAgICAgICBuZXh0OiBwcm9jZXNzRGF0YSA/IG5leHRXaXRoRGF0YSA6IG5leHQsXG4gICAgICAgIHJlZGlyZWN0OiBmdW5jdGlvbiByZWRpcmVjdCgpIHtcbiAgICAgICAgICB0cmFuc2l0aW9uLnJlZGlyZWN0LmFwcGx5KHRyYW5zaXRpb24sIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIGFjdHVhbGx5IGNhbGwgdGhlIGhvb2tcbiAgICAgIHZhciByZXMgPSB1bmRlZmluZWQ7XG4gICAgICB0cnkge1xuICAgICAgICByZXMgPSBob29rLmNhbGwoY29udGV4dCwgZXhwb3NlZCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG9uRXJyb3IoZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV4cGVjdEJvb2xlYW4pIHtcbiAgICAgICAgLy8gYm9vbGVhbiBob29rc1xuICAgICAgICBuZXh0V2l0aEJvb2xlYW4ocmVzKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNQcm9taXNlKHJlcykpIHtcbiAgICAgICAgLy8gcHJvbWlzZVxuICAgICAgICBpZiAocHJvY2Vzc0RhdGEpIHtcbiAgICAgICAgICByZXMudGhlbihuZXh0V2l0aERhdGEsIG9uUHJvbWlzZUVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXMudGhlbihuZXh0LCBvblByb21pc2VFcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzc0RhdGEgJiYgaXNQbGFpbk9qYmVjdChyZXMpKSB7XG4gICAgICAgIC8vIGRhdGEgcHJvbWlzZSBzdWdhclxuICAgICAgICBuZXh0V2l0aERhdGEocmVzKTtcbiAgICAgIH0gZWxzZSBpZiAoIWhvb2subGVuZ3RoKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBhIHNpbmdsZSBob29rIG9yIGFuIGFycmF5IG9mIGFzeW5jIGhvb2tzIGluIHNlcmllcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGhvb2tzXG4gICAgICogQHBhcmFtIHsqfSBjb250ZXh0XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAgICovXG5cbiAgICBSb3V0ZVRyYW5zaXRpb24ucHJvdG90eXBlLmNhbGxIb29rcyA9IGZ1bmN0aW9uIGNhbGxIb29rcyhob29rcywgY29udGV4dCwgY2IsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGhvb2tzKSkge1xuICAgICAgICB0aGlzLnJ1blF1ZXVlKGhvb2tzLCBmdW5jdGlvbiAoaG9vaywgXywgbmV4dCkge1xuICAgICAgICAgIGlmICghX3RoaXMuYWJvcnRlZCkge1xuICAgICAgICAgICAgX3RoaXMuY2FsbEhvb2soaG9vaywgY29udGV4dCwgbmV4dCwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBjYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNhbGxIb29rKGhvb2tzLCBjb250ZXh0LCBjYiwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBSb3V0ZVRyYW5zaXRpb247XG4gIH0pKCk7XG5cbiAgZnVuY3Rpb24gaXNQbGFpbk9qYmVjdCh2YWwpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9BcnJheSh2YWwpIHtcbiAgICByZXR1cm4gdmFsID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodmFsKSA6IFtdO1xuICB9XG5cbiAgdmFyIGludGVybmFsS2V5c1JFID0gL14oY29tcG9uZW50fHN1YlJvdXRlc3xmdWxsUGF0aCkkLztcblxuICAvKipcbiAgICogUm91dGUgQ29udGV4dCBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtSb3V0ZXJ9IHJvdXRlclxuICAgKi9cblxuICB2YXIgUm91dGUgPSBmdW5jdGlvbiBSb3V0ZShwYXRoLCByb3V0ZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrKHRoaXMsIFJvdXRlKTtcblxuICAgIHZhciBtYXRjaGVkID0gcm91dGVyLl9yZWNvZ25pemVyLnJlY29nbml6ZShwYXRoKTtcbiAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgLy8gY29weSBhbGwgY3VzdG9tIGZpZWxkcyBmcm9tIHJvdXRlIGNvbmZpZ3NcbiAgICAgIFtdLmZvckVhY2guY2FsbChtYXRjaGVkLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG1hdGNoLmhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAoIWludGVybmFsS2V5c1JFLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgX3RoaXNba2V5XSA9IG1hdGNoLmhhbmRsZXJba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gc2V0IHF1ZXJ5IGFuZCBwYXJhbXNcbiAgICAgIHRoaXMucXVlcnkgPSBtYXRjaGVkLnF1ZXJ5UGFyYW1zO1xuICAgICAgdGhpcy5wYXJhbXMgPSBbXS5yZWR1Y2UuY2FsbChtYXRjaGVkLCBmdW5jdGlvbiAocHJldiwgY3VyKSB7XG4gICAgICAgIGlmIChjdXIucGFyYW1zKSB7XG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIGN1ci5wYXJhbXMpIHtcbiAgICAgICAgICAgIHByZXZba2V5XSA9IGN1ci5wYXJhbXNba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICB9LCB7fSk7XG4gICAgfVxuICAgIC8vIGV4cG9zZSBwYXRoIGFuZCByb3V0ZXJcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIC8vIGZvciBpbnRlcm5hbCB1c2VcbiAgICB0aGlzLm1hdGNoZWQgPSBtYXRjaGVkIHx8IHJvdXRlci5fbm90Rm91bmRIYW5kbGVyO1xuICAgIC8vIGludGVybmFsIHJlZmVyZW5jZSB0byByb3V0ZXJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JvdXRlcicsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHJvdXRlclxuICAgIH0pO1xuICAgIC8vIEltcG9ydGFudDogZnJlZXplIHNlbGYgdG8gcHJldmVudCBvYnNlcnZhdGlvblxuICAgIE9iamVjdC5mcmVlemUodGhpcyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gYXBwbHlPdmVycmlkZSAoVnVlKSB7XG4gICAgdmFyIF9WdWUkdXRpbCA9IFZ1ZS51dGlsO1xuICAgIHZhciBleHRlbmQgPSBfVnVlJHV0aWwuZXh0ZW5kO1xuICAgIHZhciBpc0FycmF5ID0gX1Z1ZSR1dGlsLmlzQXJyYXk7XG4gICAgdmFyIGRlZmluZVJlYWN0aXZlID0gX1Z1ZSR1dGlsLmRlZmluZVJlYWN0aXZlO1xuXG4gICAgLy8gb3ZlcnJpZGUgVnVlJ3MgaW5pdCBhbmQgZGVzdHJveSBwcm9jZXNzIHRvIGtlZXAgdHJhY2sgb2Ygcm91dGVyIGluc3RhbmNlc1xuICAgIHZhciBpbml0ID0gVnVlLnByb3RvdHlwZS5faW5pdDtcbiAgICBWdWUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdmFyIHJvb3QgPSBvcHRpb25zLl9wYXJlbnQgfHwgb3B0aW9ucy5wYXJlbnQgfHwgdGhpcztcbiAgICAgIHZhciByb3V0ZXIgPSByb290LiRyb3V0ZXI7XG4gICAgICB2YXIgcm91dGUgPSByb290LiRyb3V0ZTtcbiAgICAgIGlmIChyb3V0ZXIpIHtcbiAgICAgICAgLy8gZXhwb3NlIHJvdXRlclxuICAgICAgICB0aGlzLiRyb3V0ZXIgPSByb3V0ZXI7XG4gICAgICAgIHJvdXRlci5fY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICh0aGlzLl9kZWZpbmVNZXRhKSB7XG4gICAgICAgICAgLy8gMC4xMlxuICAgICAgICAgIHRoaXMuX2RlZmluZU1ldGEoJyRyb3V0ZScsIHJvdXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyAxLjBcbiAgICAgICAgICBkZWZpbmVSZWFjdGl2ZSh0aGlzLCAnJHJvdXRlJywgcm91dGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpbml0LmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHZhciBkZXN0cm95ID0gVnVlLnByb3RvdHlwZS5fZGVzdHJveTtcbiAgICBWdWUucHJvdG90eXBlLl9kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLl9pc0JlaW5nRGVzdHJveWVkICYmIHRoaXMuJHJvdXRlcikge1xuICAgICAgICB0aGlzLiRyb3V0ZXIuX2NoaWxkcmVuLiRyZW1vdmUodGhpcyk7XG4gICAgICB9XG4gICAgICBkZXN0cm95LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIC8vIDEuMCBvbmx5OiBlbmFibGUgcm91dGUgbWl4aW5zXG4gICAgdmFyIHN0cmF0cyA9IFZ1ZS5jb25maWcub3B0aW9uTWVyZ2VTdHJhdGVnaWVzO1xuICAgIHZhciBob29rc1RvTWVyZ2VSRSA9IC9eKGRhdGF8YWN0aXZhdGV8ZGVhY3RpdmF0ZSkkLztcblxuICAgIGlmIChzdHJhdHMpIHtcbiAgICAgIHN0cmF0cy5yb3V0ZSA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gICAgICAgIGlmICghY2hpbGRWYWwpIHJldHVybiBwYXJlbnRWYWw7XG4gICAgICAgIGlmICghcGFyZW50VmFsKSByZXR1cm4gY2hpbGRWYWw7XG4gICAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgICAgZXh0ZW5kKHJldCwgcGFyZW50VmFsKTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGNoaWxkVmFsKSB7XG4gICAgICAgICAgdmFyIGEgPSByZXRba2V5XTtcbiAgICAgICAgICB2YXIgYiA9IGNoaWxkVmFsW2tleV07XG4gICAgICAgICAgLy8gZm9yIGRhdGEsIGFjdGl2YXRlIGFuZCBkZWFjdGl2YXRlLCB3ZSBuZWVkIHRvIG1lcmdlIHRoZW0gaW50b1xuICAgICAgICAgIC8vIGFycmF5cyBzaW1pbGFyIHRvIGxpZmVjeWNsZSBob29rcy5cbiAgICAgICAgICBpZiAoYSAmJiBob29rc1RvTWVyZ2VSRS50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgIHJldFtrZXldID0gKGlzQXJyYXkoYSkgPyBhIDogW2FdKS5jb25jYXQoYik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldFtrZXldID0gYjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gVmlldyAoVnVlKSB7XG5cbiAgICB2YXIgXyA9IFZ1ZS51dGlsO1xuICAgIHZhciBjb21wb25lbnREZWYgPVxuICAgIC8vIDAuMTJcbiAgICBWdWUuZGlyZWN0aXZlKCdfY29tcG9uZW50JykgfHxcbiAgICAvLyAxLjBcbiAgICBWdWUuaW50ZXJuYWxEaXJlY3RpdmVzLmNvbXBvbmVudDtcbiAgICAvLyA8cm91dGVyLXZpZXc+IGV4dGVuZHMgdGhlIGludGVybmFsIGNvbXBvbmVudCBkaXJlY3RpdmVcbiAgICB2YXIgdmlld0RlZiA9IF8uZXh0ZW5kKHt9LCBjb21wb25lbnREZWYpO1xuXG4gICAgLy8gd2l0aCBzb21lIG92ZXJyaWRlc1xuICAgIF8uZXh0ZW5kKHZpZXdEZWYsIHtcblxuICAgICAgX2lzUm91dGVyVmlldzogdHJ1ZSxcblxuICAgICAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICAgICAgdmFyIHJvdXRlID0gdGhpcy52bS4kcm91dGU7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoIXJvdXRlKSB7XG4gICAgICAgICAgd2FybiQxKCc8cm91dGVyLXZpZXc+IGNhbiBvbmx5IGJlIHVzZWQgaW5zaWRlIGEgJyArICdyb3V0ZXItZW5hYmxlZCBhcHAuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGZvcmNlIGR5bmFtaWMgZGlyZWN0aXZlIHNvIHYtY29tcG9uZW50IGRvZXNuJ3RcbiAgICAgICAgLy8gYXR0ZW1wdCB0byBidWlsZCByaWdodCBub3dcbiAgICAgICAgdGhpcy5faXNEeW5hbWljTGl0ZXJhbCA9IHRydWU7XG4gICAgICAgIC8vIGZpbmFsbHksIGluaXQgYnkgZGVsZWdhdGluZyB0byB2LWNvbXBvbmVudFxuICAgICAgICBjb21wb25lbnREZWYuYmluZC5jYWxsKHRoaXMpO1xuXG4gICAgICAgIC8vIGxvY2F0ZSB0aGUgcGFyZW50IHZpZXdcbiAgICAgICAgdmFyIHBhcmVudFZpZXcgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnZtO1xuICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgaWYgKHBhcmVudC5fcm91dGVyVmlldykge1xuICAgICAgICAgICAgcGFyZW50VmlldyA9IHBhcmVudC5fcm91dGVyVmlldztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50Vmlldykge1xuICAgICAgICAgIC8vIHJlZ2lzdGVyIHNlbGYgYXMgYSBjaGlsZCBvZiB0aGUgcGFyZW50IHZpZXcsXG4gICAgICAgICAgLy8gaW5zdGVhZCBvZiBhY3RpdmF0aW5nIG5vdy4gVGhpcyBpcyBzbyB0aGF0IHRoZVxuICAgICAgICAgIC8vIGNoaWxkJ3MgYWN0aXZhdGUgaG9vayBpcyBjYWxsZWQgYWZ0ZXIgdGhlXG4gICAgICAgICAgLy8gcGFyZW50J3MgaGFzIHJlc29sdmVkLlxuICAgICAgICAgIHRoaXMucGFyZW50VmlldyA9IHBhcmVudFZpZXc7XG4gICAgICAgICAgcGFyZW50Vmlldy5jaGlsZFZpZXcgPSB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHJvb3QgdmlldyFcbiAgICAgICAgICB2YXIgcm91dGVyID0gcm91dGUucm91dGVyO1xuICAgICAgICAgIHJvdXRlci5fcm9vdFZpZXcgPSB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIGxhdGUtcmVuZGVyZWQgdmlld1xuICAgICAgICAvLyB0d28gcG9zc2liaWxpdGllczpcbiAgICAgICAgLy8gMS4gcm9vdCB2aWV3IHJlbmRlcmVkIGFmdGVyIHRyYW5zaXRpb24gaGFzIGJlZW5cbiAgICAgICAgLy8gICAgdmFsaWRhdGVkO1xuICAgICAgICAvLyAyLiBjaGlsZCB2aWV3IHJlbmRlcmVkIGFmdGVyIHBhcmVudCB2aWV3IGhhcyBiZWVuXG4gICAgICAgIC8vICAgIGFjdGl2YXRlZC5cbiAgICAgICAgdmFyIHRyYW5zaXRpb24gPSByb3V0ZS5yb3V0ZXIuX2N1cnJlbnRUcmFuc2l0aW9uO1xuICAgICAgICBpZiAoIXBhcmVudFZpZXcgJiYgdHJhbnNpdGlvbi5kb25lIHx8IHBhcmVudFZpZXcgJiYgcGFyZW50Vmlldy5hY3RpdmF0ZWQpIHtcbiAgICAgICAgICB2YXIgZGVwdGggPSBwYXJlbnRWaWV3ID8gcGFyZW50Vmlldy5kZXB0aCArIDEgOiAwO1xuICAgICAgICAgIGFjdGl2YXRlKHRoaXMsIHRyYW5zaXRpb24sIGRlcHRoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudFZpZXcpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudFZpZXcuY2hpbGRWaWV3ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnREZWYudW5iaW5kLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBWdWUuZWxlbWVudERpcmVjdGl2ZSgncm91dGVyLXZpZXcnLCB2aWV3RGVmKTtcbiAgfVxuXG4gIHZhciB0cmFpbGluZ1NsYXNoUkUgPSAvXFwvJC87XG4gIHZhciByZWdleEVzY2FwZVJFID0gL1stLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZztcbiAgdmFyIHF1ZXJ5U3RyaW5nUkUgPSAvXFw/LiokLztcblxuICAvLyBpbnN0YWxsIHYtbGluaywgd2hpY2ggcHJvdmlkZXMgbmF2aWdhdGlvbiBzdXBwb3J0IGZvclxuICAvLyBIVE1MNSBoaXN0b3J5IG1vZGVcbiAgZnVuY3Rpb24gTGluayAoVnVlKSB7XG4gICAgdmFyIF9WdWUkdXRpbCA9IFZ1ZS51dGlsO1xuICAgIHZhciBfYmluZCA9IF9WdWUkdXRpbC5iaW5kO1xuICAgIHZhciBpc09iamVjdCA9IF9WdWUkdXRpbC5pc09iamVjdDtcbiAgICB2YXIgYWRkQ2xhc3MgPSBfVnVlJHV0aWwuYWRkQ2xhc3M7XG4gICAgdmFyIHJlbW92ZUNsYXNzID0gX1Z1ZSR1dGlsLnJlbW92ZUNsYXNzO1xuXG4gICAgdmFyIG9uUHJpb3JpdHkgPSBWdWUuZGlyZWN0aXZlKCdvbicpLnByaW9yaXR5O1xuICAgIHZhciBMSU5LX1VQREFURSA9ICdfX3Z1ZS1yb3V0ZXItbGluay11cGRhdGVfXyc7XG5cbiAgICB2YXIgYWN0aXZlSWQgPSAwO1xuXG4gICAgVnVlLmRpcmVjdGl2ZSgnbGluay1hY3RpdmUnLCB7XG4gICAgICBwcmlvcml0eTogOTk5OSxcbiAgICAgIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGlkID0gU3RyaW5nKGFjdGl2ZUlkKyspO1xuICAgICAgICAvLyBjb2xsZWN0IHYtbGlua3MgY29udGFpbmVkIHdpdGhpbiB0aGlzIGVsZW1lbnQuXG4gICAgICAgIC8vIHdlIG5lZWQgZG8gdGhpcyBoZXJlIGJlZm9yZSB0aGUgcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcFxuICAgICAgICAvLyBnZXRzIG1lc3NlZCB1cCBieSB0ZXJtaW5hbCBkaXJlY3RpdmVzIChpZiwgZm9yLCBjb21wb25lbnRzKVxuICAgICAgICB2YXIgY2hpbGRMaW5rcyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbCgnW3YtbGlua10nKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZExpbmtzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBsaW5rID0gY2hpbGRMaW5rc1tpXTtcbiAgICAgICAgICB2YXIgZXhpc3RpbmdJZCA9IGxpbmsuZ2V0QXR0cmlidXRlKExJTktfVVBEQVRFKTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBleGlzdGluZ0lkID8gZXhpc3RpbmdJZCArICcsJyArIGlkIDogaWQ7XG4gICAgICAgICAgLy8gbGVhdmUgYSBtYXJrIG9uIHRoZSBsaW5rIGVsZW1lbnQgd2hpY2ggY2FuIGJlIHBlcnNpc3RlZFxuICAgICAgICAgIC8vIHRocm91Z2ggZnJhZ21lbnQgY2xvbmVzLlxuICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKExJTktfVVBEQVRFLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52bS4kb24oTElOS19VUERBVEUsIHRoaXMuY2IgPSBmdW5jdGlvbiAobGluaywgcGF0aCkge1xuICAgICAgICAgIGlmIChsaW5rLmFjdGl2ZUlkcy5pbmRleE9mKGlkKSA+IC0xKSB7XG4gICAgICAgICAgICBsaW5rLnVwZGF0ZUNsYXNzZXMocGF0aCwgX3RoaXMuZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgICAgIHRoaXMudm0uJG9mZihMSU5LX1VQREFURSwgdGhpcy5jYik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBWdWUuZGlyZWN0aXZlKCdsaW5rJywge1xuICAgICAgcHJpb3JpdHk6IG9uUHJpb3JpdHkgLSAyLFxuXG4gICAgICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzLnZtO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKCF2bS4kcm91dGUpIHtcbiAgICAgICAgICB3YXJuJDEoJ3YtbGluayBjYW4gb25seSBiZSB1c2VkIGluc2lkZSBhIHJvdXRlci1lbmFibGVkIGFwcC4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3V0ZXIgPSB2bS4kcm91dGUucm91dGVyO1xuICAgICAgICAvLyB1cGRhdGUgdGhpbmdzIHdoZW4gdGhlIHJvdXRlIGNoYW5nZXNcbiAgICAgICAgdGhpcy51bndhdGNoID0gdm0uJHdhdGNoKCckcm91dGUnLCBfYmluZCh0aGlzLm9uUm91dGVVcGRhdGUsIHRoaXMpKTtcbiAgICAgICAgLy8gY2hlY2sgdi1saW5rLWFjdGl2ZSBpZHNcbiAgICAgICAgdmFyIGFjdGl2ZUlkcyA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKExJTktfVVBEQVRFKTtcbiAgICAgICAgaWYgKGFjdGl2ZUlkcykge1xuICAgICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKExJTktfVVBEQVRFKTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZUlkcyA9IGFjdGl2ZUlkcy5zcGxpdCgnLCcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gaGFuZGxlIGNsaWNrIGlmIGxpbmsgZXhwZWN0cyB0byBiZSBvcGVuZWRcbiAgICAgICAgLy8gaW4gYSBuZXcgd2luZG93L3RhYi5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICh0aGlzLmVsLnRhZ05hbWUgPT09ICdBJyAmJiB0aGlzLmVsLmdldEF0dHJpYnV0ZSgndGFyZ2V0JykgPT09ICdfYmxhbmsnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBjbGlja1xuICAgICAgICB0aGlzLmhhbmRsZXIgPSBfYmluZCh0aGlzLm9uQ2xpY2ssIHRoaXMpO1xuICAgICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVyKTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKHRhcmdldCkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZCA9IHRhcmdldC5hcHBlbmQ7XG4gICAgICAgICAgdGhpcy5leGFjdCA9IHRhcmdldC5leGFjdDtcbiAgICAgICAgICB0aGlzLnByZXZBY3RpdmVDbGFzcyA9IHRoaXMuYWN0aXZlQ2xhc3M7XG4gICAgICAgICAgdGhpcy5hY3RpdmVDbGFzcyA9IHRhcmdldC5hY3RpdmVDbGFzcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uUm91dGVVcGRhdGUodGhpcy52bS4kcm91dGUpO1xuICAgICAgfSxcblxuICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhlKSB7XG4gICAgICAgIC8vIGRvbid0IHJlZGlyZWN0IHdpdGggY29udHJvbCBrZXlzXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5KSByZXR1cm47XG4gICAgICAgIC8vIGRvbid0IHJlZGlyZWN0IHdoZW4gcHJldmVudERlZmF1bHQgY2FsbGVkXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG4gICAgICAgIC8vIGRvbid0IHJlZGlyZWN0IG9uIHJpZ2h0IGNsaWNrXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoZS5idXR0b24gIT09IDApIHJldHVybjtcblxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAvLyB2LWxpbmsgd2l0aCBleHByZXNzaW9uLCBqdXN0IGdvXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMucm91dGVyLmdvKHRhcmdldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbm8gZXhwcmVzc2lvbiwgZGVsZWdhdGUgZm9yIGFuIDxhPiBpbnNpZGVcbiAgICAgICAgICB2YXIgZWwgPSBlLnRhcmdldDtcbiAgICAgICAgICB3aGlsZSAoZWwudGFnTmFtZSAhPT0gJ0EnICYmIGVsICE9PSB0aGlzLmVsKSB7XG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlbC50YWdOYW1lID09PSAnQScgJiYgc2FtZU9yaWdpbihlbCkpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWU7XG4gICAgICAgICAgICBpZiAodGhpcy5yb3V0ZXIuaGlzdG9yeS5yb290KSB7XG4gICAgICAgICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UodGhpcy5yb3V0ZXIuaGlzdG9yeS5yb290UkUsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucm91dGVyLmdvKHtcbiAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgcmVwbGFjZTogdGFyZ2V0ICYmIHRhcmdldC5yZXBsYWNlLFxuICAgICAgICAgICAgICBhcHBlbmQ6IHRhcmdldCAmJiB0YXJnZXQuYXBwZW5kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIG9uUm91dGVVcGRhdGU6IGZ1bmN0aW9uIG9uUm91dGVVcGRhdGUocm91dGUpIHtcbiAgICAgICAgLy8gcm91dGVyLnN0cmluZ2lmeVBhdGggaXMgZGVwZW5kZW50IG9uIGN1cnJlbnQgcm91dGVcbiAgICAgICAgLy8gYW5kIG5lZWRzIHRvIGJlIGNhbGxlZCBhZ2FpbiB3aGVudmVyIHJvdXRlIGNoYW5nZXMuXG4gICAgICAgIHZhciBuZXdQYXRoID0gdGhpcy5yb3V0ZXIuc3RyaW5naWZ5UGF0aCh0aGlzLnRhcmdldCk7XG4gICAgICAgIGlmICh0aGlzLnBhdGggIT09IG5ld1BhdGgpIHtcbiAgICAgICAgICB0aGlzLnBhdGggPSBuZXdQYXRoO1xuICAgICAgICAgIHRoaXMudXBkYXRlQWN0aXZlTWF0Y2goKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUhyZWYoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hY3RpdmVJZHMpIHtcbiAgICAgICAgICB0aGlzLnZtLiRlbWl0KExJTktfVVBEQVRFLCB0aGlzLCByb3V0ZS5wYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXMocm91dGUucGF0aCwgdGhpcy5lbCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZUFjdGl2ZU1hdGNoOiBmdW5jdGlvbiB1cGRhdGVBY3RpdmVNYXRjaCgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVSRSA9IHRoaXMucGF0aCAmJiAhdGhpcy5leGFjdCA/IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5wYXRoLnJlcGxhY2UoL1xcLyQvLCAnJykucmVwbGFjZShxdWVyeVN0cmluZ1JFLCAnJykucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJykgKyAnKFxcXFwvfCQpJykgOiBudWxsO1xuICAgICAgfSxcblxuICAgICAgdXBkYXRlSHJlZjogZnVuY3Rpb24gdXBkYXRlSHJlZigpIHtcbiAgICAgICAgaWYgKHRoaXMuZWwudGFnTmFtZSAhPT0gJ0EnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXRoID0gdGhpcy5wYXRoO1xuICAgICAgICB2YXIgcm91dGVyID0gdGhpcy5yb3V0ZXI7XG4gICAgICAgIHZhciBpc0Fic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgICAgICAgLy8gZG8gbm90IGZvcm1hdCBub24taGFzaCByZWxhdGl2ZSBwYXRoc1xuICAgICAgICB2YXIgaHJlZiA9IHBhdGggJiYgKHJvdXRlci5tb2RlID09PSAnaGFzaCcgfHwgaXNBYnNvbHV0ZSkgPyByb3V0ZXIuaGlzdG9yeS5mb3JtYXRQYXRoKHBhdGgsIHRoaXMuYXBwZW5kKSA6IHBhdGg7XG4gICAgICAgIGlmIChocmVmKSB7XG4gICAgICAgICAgdGhpcy5lbC5ocmVmID0gaHJlZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSgnaHJlZicpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVDbGFzc2VzOiBmdW5jdGlvbiB1cGRhdGVDbGFzc2VzKHBhdGgsIGVsKSB7XG4gICAgICAgIHZhciBhY3RpdmVDbGFzcyA9IHRoaXMuYWN0aXZlQ2xhc3MgfHwgdGhpcy5yb3V0ZXIuX2xpbmtBY3RpdmVDbGFzcztcbiAgICAgICAgLy8gY2xlYXIgb2xkIGNsYXNzXG4gICAgICAgIGlmICh0aGlzLnByZXZBY3RpdmVDbGFzcyAmJiB0aGlzLnByZXZBY3RpdmVDbGFzcyAhPT0gYWN0aXZlQ2xhc3MpIHtcbiAgICAgICAgICB0b2dnbGVDbGFzc2VzKGVsLCB0aGlzLnByZXZBY3RpdmVDbGFzcywgcmVtb3ZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlbW92ZSBxdWVyeSBzdHJpbmcgYmVmb3JlIG1hdGNoaW5nXG4gICAgICAgIHZhciBkZXN0ID0gdGhpcy5wYXRoLnJlcGxhY2UocXVlcnlTdHJpbmdSRSwgJycpO1xuICAgICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKHF1ZXJ5U3RyaW5nUkUsICcnKTtcbiAgICAgICAgLy8gYWRkIG5ldyBjbGFzc1xuICAgICAgICBpZiAodGhpcy5leGFjdCkge1xuICAgICAgICAgIGlmIChkZXN0ID09PSBwYXRoIHx8XG4gICAgICAgICAgLy8gYWxzbyBhbGxvdyBhZGRpdGlvbmFsIHRyYWlsaW5nIHNsYXNoXG4gICAgICAgICAgZGVzdC5jaGFyQXQoZGVzdC5sZW5ndGggLSAxKSAhPT0gJy8nICYmIGRlc3QgPT09IHBhdGgucmVwbGFjZSh0cmFpbGluZ1NsYXNoUkUsICcnKSkge1xuICAgICAgICAgICAgdG9nZ2xlQ2xhc3NlcyhlbCwgYWN0aXZlQ2xhc3MsIGFkZENsYXNzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9nZ2xlQ2xhc3NlcyhlbCwgYWN0aXZlQ2xhc3MsIHJlbW92ZUNsYXNzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlUkUgJiYgdGhpcy5hY3RpdmVSRS50ZXN0KHBhdGgpKSB7XG4gICAgICAgICAgICB0b2dnbGVDbGFzc2VzKGVsLCBhY3RpdmVDbGFzcywgYWRkQ2xhc3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2dnbGVDbGFzc2VzKGVsLCBhY3RpdmVDbGFzcywgcmVtb3ZlQ2xhc3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZXIpO1xuICAgICAgICB0aGlzLnVud2F0Y2ggJiYgdGhpcy51bndhdGNoKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzYW1lT3JpZ2luKGxpbmspIHtcbiAgICAgIHJldHVybiBsaW5rLnByb3RvY29sID09PSBsb2NhdGlvbi5wcm90b2NvbCAmJiBsaW5rLmhvc3RuYW1lID09PSBsb2NhdGlvbi5ob3N0bmFtZSAmJiBsaW5rLnBvcnQgPT09IGxvY2F0aW9uLnBvcnQ7XG4gICAgfVxuXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBpcyBjb3BpZWQgZnJvbSB2LWJpbmQ6Y2xhc3MgaW1wbGVtZW50YXRpb24gdW50aWxcbiAgICAvLyB3ZSBwcm9wZXJseSBleHBvc2UgaXQuLi5cbiAgICBmdW5jdGlvbiB0b2dnbGVDbGFzc2VzKGVsLCBrZXksIGZuKSB7XG4gICAgICBrZXkgPSBrZXkudHJpbSgpO1xuICAgICAgaWYgKGtleS5pbmRleE9mKCcgJykgPT09IC0xKSB7XG4gICAgICAgIGZuKGVsLCBrZXkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIga2V5cyA9IGtleS5zcGxpdCgvXFxzKy8pO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBmbihlbCwga2V5c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGhpc3RvcnlCYWNrZW5kcyA9IHtcbiAgICBhYnN0cmFjdDogQWJzdHJhY3RIaXN0b3J5LFxuICAgIGhhc2g6IEhhc2hIaXN0b3J5LFxuICAgIGh0bWw1OiBIVE1MNUhpc3RvcnlcbiAgfTtcblxuICAvLyBsYXRlIGJpbmQgZHVyaW5nIGluc3RhbGxcbiAgdmFyIFZ1ZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUm91dGVyIGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICovXG5cbiAgdmFyIFJvdXRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUm91dGVyKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICAgICAgdmFyIF9yZWYkaGFzaGJhbmcgPSBfcmVmLmhhc2hiYW5nO1xuICAgICAgdmFyIGhhc2hiYW5nID0gX3JlZiRoYXNoYmFuZyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9yZWYkaGFzaGJhbmc7XG4gICAgICB2YXIgX3JlZiRhYnN0cmFjdCA9IF9yZWYuYWJzdHJhY3Q7XG4gICAgICB2YXIgYWJzdHJhY3QgPSBfcmVmJGFic3RyYWN0ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkYWJzdHJhY3Q7XG4gICAgICB2YXIgX3JlZiRoaXN0b3J5ID0gX3JlZi5oaXN0b3J5O1xuICAgICAgdmFyIGhpc3RvcnkgPSBfcmVmJGhpc3RvcnkgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRoaXN0b3J5O1xuICAgICAgdmFyIF9yZWYkc2F2ZVNjcm9sbFBvc2l0aW9uID0gX3JlZi5zYXZlU2Nyb2xsUG9zaXRpb247XG4gICAgICB2YXIgc2F2ZVNjcm9sbFBvc2l0aW9uID0gX3JlZiRzYXZlU2Nyb2xsUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRzYXZlU2Nyb2xsUG9zaXRpb247XG4gICAgICB2YXIgX3JlZiR0cmFuc2l0aW9uT25Mb2FkID0gX3JlZi50cmFuc2l0aW9uT25Mb2FkO1xuICAgICAgdmFyIHRyYW5zaXRpb25PbkxvYWQgPSBfcmVmJHRyYW5zaXRpb25PbkxvYWQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiR0cmFuc2l0aW9uT25Mb2FkO1xuICAgICAgdmFyIF9yZWYkc3VwcHJlc3NUcmFuc2l0aW9uRXJyb3IgPSBfcmVmLnN1cHByZXNzVHJhbnNpdGlvbkVycm9yO1xuICAgICAgdmFyIHN1cHByZXNzVHJhbnNpdGlvbkVycm9yID0gX3JlZiRzdXBwcmVzc1RyYW5zaXRpb25FcnJvciA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJHN1cHByZXNzVHJhbnNpdGlvbkVycm9yO1xuICAgICAgdmFyIF9yZWYkcm9vdCA9IF9yZWYucm9vdDtcbiAgICAgIHZhciByb290ID0gX3JlZiRyb290ID09PSB1bmRlZmluZWQgPyBudWxsIDogX3JlZiRyb290O1xuICAgICAgdmFyIF9yZWYkbGlua0FjdGl2ZUNsYXNzID0gX3JlZi5saW5rQWN0aXZlQ2xhc3M7XG4gICAgICB2YXIgbGlua0FjdGl2ZUNsYXNzID0gX3JlZiRsaW5rQWN0aXZlQ2xhc3MgPT09IHVuZGVmaW5lZCA/ICd2LWxpbmstYWN0aXZlJyA6IF9yZWYkbGlua0FjdGl2ZUNsYXNzO1xuICAgICAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrKHRoaXMsIFJvdXRlcik7XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCFSb3V0ZXIuaW5zdGFsbGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIGluc3RhbGwgdGhlIFJvdXRlciB3aXRoIFZ1ZS51c2UoKSBiZWZvcmUgJyArICdjcmVhdGluZyBhbiBpbnN0YW5jZS4nKTtcbiAgICAgIH1cblxuICAgICAgLy8gVnVlIGluc3RhbmNlc1xuICAgICAgdGhpcy5hcHAgPSBudWxsO1xuICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgICAgLy8gcm91dGUgcmVjb2duaXplclxuICAgICAgdGhpcy5fcmVjb2duaXplciA9IG5ldyBSb3V0ZVJlY29nbml6ZXIoKTtcbiAgICAgIHRoaXMuX2d1YXJkUmVjb2duaXplciA9IG5ldyBSb3V0ZVJlY29nbml6ZXIoKTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3N0YXJ0Q2IgPSBudWxsO1xuICAgICAgdGhpcy5fY3VycmVudFJvdXRlID0ge307XG4gICAgICB0aGlzLl9jdXJyZW50VHJhbnNpdGlvbiA9IG51bGw7XG4gICAgICB0aGlzLl9wcmV2aW91c1RyYW5zaXRpb24gPSBudWxsO1xuICAgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gbnVsbDtcbiAgICAgIHRoaXMuX25vdEZvdW5kUmVkaXJlY3QgPSBudWxsO1xuICAgICAgdGhpcy5fYmVmb3JlRWFjaEhvb2tzID0gW107XG4gICAgICB0aGlzLl9hZnRlckVhY2hIb29rcyA9IFtdO1xuXG4gICAgICAvLyB0cmlnZ2VyIHRyYW5zaXRpb24gb24gaW5pdGlhbCByZW5kZXI/XG4gICAgICB0aGlzLl9yZW5kZXJlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbk9uTG9hZCA9IHRyYW5zaXRpb25PbkxvYWQ7XG5cbiAgICAgIC8vIGhpc3RvcnkgbW9kZVxuICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XG4gICAgICB0aGlzLl9hYnN0cmFjdCA9IGFic3RyYWN0O1xuICAgICAgdGhpcy5faGFzaGJhbmcgPSBoYXNoYmFuZztcblxuICAgICAgLy8gY2hlY2sgaWYgSFRNTDUgaGlzdG9yeSBpcyBhdmFpbGFibGVcbiAgICAgIHZhciBoYXNQdXNoU3RhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGU7XG4gICAgICB0aGlzLl9oaXN0b3J5ID0gaGlzdG9yeSAmJiBoYXNQdXNoU3RhdGU7XG4gICAgICB0aGlzLl9oaXN0b3J5RmFsbGJhY2sgPSBoaXN0b3J5ICYmICFoYXNQdXNoU3RhdGU7XG5cbiAgICAgIC8vIGNyZWF0ZSBoaXN0b3J5IG9iamVjdFxuICAgICAgdmFyIGluQnJvd3NlciA9IFZ1ZS51dGlsLmluQnJvd3NlcjtcbiAgICAgIHRoaXMubW9kZSA9ICFpbkJyb3dzZXIgfHwgdGhpcy5fYWJzdHJhY3QgPyAnYWJzdHJhY3QnIDogdGhpcy5faGlzdG9yeSA/ICdodG1sNScgOiAnaGFzaCc7XG5cbiAgICAgIHZhciBIaXN0b3J5ID0gaGlzdG9yeUJhY2tlbmRzW3RoaXMubW9kZV07XG4gICAgICB0aGlzLmhpc3RvcnkgPSBuZXcgSGlzdG9yeSh7XG4gICAgICAgIHJvb3Q6IHJvb3QsXG4gICAgICAgIGhhc2hiYW5nOiB0aGlzLl9oYXNoYmFuZyxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIG9uQ2hhbmdlKHBhdGgsIHN0YXRlLCBhbmNob3IpIHtcbiAgICAgICAgICBfdGhpcy5fbWF0Y2gocGF0aCwgc3RhdGUsIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBvdGhlciBvcHRpb25zXG4gICAgICB0aGlzLl9zYXZlU2Nyb2xsUG9zaXRpb24gPSBzYXZlU2Nyb2xsUG9zaXRpb247XG4gICAgICB0aGlzLl9saW5rQWN0aXZlQ2xhc3MgPSBsaW5rQWN0aXZlQ2xhc3M7XG4gICAgICB0aGlzLl9zdXBwcmVzcyA9IHN1cHByZXNzVHJhbnNpdGlvbkVycm9yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsbG93IGRpcmVjdGx5IHBhc3NpbmcgY29tcG9uZW50cyB0byBhIHJvdXRlXG4gICAgICogZGVmaW5pdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJcbiAgICAgKi9cblxuICAgIC8vIEFQSSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8qKlxuICAgICogUmVnaXN0ZXIgYSBtYXAgb2YgdG9wLWxldmVsIHBhdGhzLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBtYXBcbiAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAoX21hcCkge1xuICAgICAgZm9yICh2YXIgcm91dGUgaW4gX21hcCkge1xuICAgICAgICB0aGlzLm9uKHJvdXRlLCBfbWFwW3JvdXRlXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYSBzaW5nbGUgcm9vdC1sZXZlbCBwYXRoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcm9vdFBhdGhcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlclxuICAgICAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGNvbXBvbmVudFxuICAgICAqICAgICAgICAgICAgICAgICAtIHtPYmplY3R9IFtzdWJSb3V0ZXNdXG4gICAgICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IFtmb3JjZVJlZnJlc2hdXG4gICAgICogICAgICAgICAgICAgICAgIC0ge0Z1bmN0aW9ufSBbYmVmb3JlXVxuICAgICAqICAgICAgICAgICAgICAgICAtIHtGdW5jdGlvbn0gW2FmdGVyXVxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKHJvb3RQYXRoLCBoYW5kbGVyKSB7XG4gICAgICBpZiAocm9vdFBhdGggPT09ICcqJykge1xuICAgICAgICB0aGlzLl9ub3RGb3VuZChoYW5kbGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2FkZFJvdXRlKHJvb3RQYXRoLCBoYW5kbGVyLCBbXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHJlZGlyZWN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtYXBcbiAgICAgKi9cblxuICAgIFJvdXRlci5wcm90b3R5cGUucmVkaXJlY3QgPSBmdW5jdGlvbiByZWRpcmVjdChtYXApIHtcbiAgICAgIGZvciAodmFyIHBhdGggaW4gbWFwKSB7XG4gICAgICAgIHRoaXMuX2FkZFJlZGlyZWN0KHBhdGgsIG1hcFtwYXRoXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IGFsaWFzZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWFwXG4gICAgICovXG5cbiAgICBSb3V0ZXIucHJvdG90eXBlLmFsaWFzID0gZnVuY3Rpb24gYWxpYXMobWFwKSB7XG4gICAgICBmb3IgKHZhciBwYXRoIGluIG1hcCkge1xuICAgICAgICB0aGlzLl9hZGRBbGlhcyhwYXRoLCBtYXBbcGF0aF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldCBnbG9iYWwgYmVmb3JlIGhvb2suXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5iZWZvcmVFYWNoID0gZnVuY3Rpb24gYmVmb3JlRWFjaChmbikge1xuICAgICAgdGhpcy5fYmVmb3JlRWFjaEhvb2tzLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldCBnbG9iYWwgYWZ0ZXIgaG9vay5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICovXG5cbiAgICBSb3V0ZXIucHJvdG90eXBlLmFmdGVyRWFjaCA9IGZ1bmN0aW9uIGFmdGVyRWFjaChmbikge1xuICAgICAgdGhpcy5fYWZ0ZXJFYWNoSG9va3MucHVzaChmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGUgdG8gYSBnaXZlbiBwYXRoLlxuICAgICAqIFRoZSBwYXRoIGNhbiBiZSBhbiBvYmplY3QgZGVzY3JpYmluZyBhIG5hbWVkIHBhdGggaW5cbiAgICAgKiB0aGUgZm9ybWF0IG9mIHsgbmFtZTogJy4uLicsIHBhcmFtczoge30sIHF1ZXJ5OiB7fX1cbiAgICAgKiBUaGUgcGF0aCBpcyBhc3N1bWVkIHRvIGJlIGFscmVhZHkgZGVjb2RlZCwgYW5kIHdpbGxcbiAgICAgKiBiZSByZXNvbHZlZCBhZ2FpbnN0IHJvb3QgKGlmIHByb3ZpZGVkKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBwYXRoXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcmVwbGFjZV1cbiAgICAgKi9cblxuICAgIFJvdXRlci5wcm90b3R5cGUuZ28gPSBmdW5jdGlvbiBnbyhwYXRoKSB7XG4gICAgICB2YXIgcmVwbGFjZSA9IGZhbHNlO1xuICAgICAgdmFyIGFwcGVuZCA9IGZhbHNlO1xuICAgICAgaWYgKFZ1ZS51dGlsLmlzT2JqZWN0KHBhdGgpKSB7XG4gICAgICAgIHJlcGxhY2UgPSBwYXRoLnJlcGxhY2U7XG4gICAgICAgIGFwcGVuZCA9IHBhdGguYXBwZW5kO1xuICAgICAgfVxuICAgICAgcGF0aCA9IHRoaXMuc3RyaW5naWZ5UGF0aChwYXRoKTtcbiAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgIHRoaXMuaGlzdG9yeS5nbyhwYXRoLCByZXBsYWNlLCBhcHBlbmQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTaG9ydCBoYW5kIGZvciByZXBsYWNpbmcgY3VycmVudCBwYXRoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5yZXBsYWNlID0gZnVuY3Rpb24gcmVwbGFjZShwYXRoKSB7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHBhdGggPSB7IHBhdGg6IHBhdGggfTtcbiAgICAgIH1cbiAgICAgIHBhdGgucmVwbGFjZSA9IHRydWU7XG4gICAgICB0aGlzLmdvKHBhdGgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgcm91dGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtWdWVDb25zdHJ1Y3Rvcn0gQXBwXG4gICAgICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gY29udGFpbmVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0KEFwcCwgY29udGFpbmVyLCBjYikge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAodGhpcy5fc3RhcnRlZCkge1xuICAgICAgICB3YXJuJDEoJ2FscmVhZHkgc3RhcnRlZC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fc3RhcnRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9zdGFydENiID0gY2I7XG4gICAgICBpZiAoIXRoaXMuYXBwKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoIUFwcCB8fCAhY29udGFpbmVyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHN0YXJ0IHZ1ZS1yb3V0ZXIgd2l0aCBhIGNvbXBvbmVudCBhbmQgYSAnICsgJ3Jvb3QgY29udGFpbmVyLicpO1xuICAgICAgICB9XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoQXBwIGluc3RhbmNlb2YgVnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHN0YXJ0IHZ1ZS1yb3V0ZXIgd2l0aCBhIGNvbXBvbmVudCwgbm90IGEgJyArICdWdWUgaW5zdGFuY2UuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXBwQ29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB2YXIgQ3RvciA9IHRoaXMuX2FwcENvbnN0cnVjdG9yID0gdHlwZW9mIEFwcCA9PT0gJ2Z1bmN0aW9uJyA/IEFwcCA6IFZ1ZS5leHRlbmQoQXBwKTtcbiAgICAgICAgLy8gZ2l2ZSBpdCBhIG5hbWUgZm9yIGJldHRlciBkZWJ1Z2dpbmdcbiAgICAgICAgQ3Rvci5vcHRpb25zLm5hbWUgPSBDdG9yLm9wdGlvbnMubmFtZSB8fCAnUm91dGVyQXBwJztcbiAgICAgIH1cblxuICAgICAgLy8gaGFuZGxlIGhpc3RvcnkgZmFsbGJhY2sgaW4gYnJvd3NlcnMgdGhhdCBkbyBub3RcbiAgICAgIC8vIHN1cHBvcnQgSFRNTDUgaGlzdG9yeSBBUElcbiAgICAgIGlmICh0aGlzLl9oaXN0b3J5RmFsbGJhY2spIHtcbiAgICAgICAgdmFyIF9sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgdmFyIF9oaXN0b3J5ID0gbmV3IEhUTUw1SGlzdG9yeSh7IHJvb3Q6IHRoaXMuX3Jvb3QgfSk7XG4gICAgICAgIHZhciBwYXRoID0gX2hpc3Rvcnkucm9vdCA/IF9sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKF9oaXN0b3J5LnJvb3RSRSwgJycpIDogX2xvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICBpZiAocGF0aCAmJiBwYXRoICE9PSAnLycpIHtcbiAgICAgICAgICBfbG9jYXRpb24uYXNzaWduKChfaGlzdG9yeS5yb290IHx8ICcnKSArICcvJyArIHRoaXMuaGlzdG9yeS5mb3JtYXRQYXRoKHBhdGgpICsgX2xvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlzdG9yeS5zdGFydCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGxpc3RlbmluZyB0byByb3V0ZSBjaGFuZ2VzLlxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5zdG9wKCk7XG4gICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZSBuYW1lZCByb3V0ZSBvYmplY3QgLyBzdHJpbmcgcGF0aHMgaW50b1xuICAgICAqIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfE51bWJlcn0gcGF0aFxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cblxuICAgIFJvdXRlci5wcm90b3R5cGUuc3RyaW5naWZ5UGF0aCA9IGZ1bmN0aW9uIHN0cmluZ2lmeVBhdGgocGF0aCkge1xuICAgICAgdmFyIGdlbmVyYXRlZFBhdGggPSAnJztcbiAgICAgIGlmIChwYXRoICYmIHR5cGVvZiBwYXRoID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAocGF0aC5uYW1lKSB7XG4gICAgICAgICAgdmFyIGV4dGVuZCA9IFZ1ZS51dGlsLmV4dGVuZDtcbiAgICAgICAgICB2YXIgY3VycmVudFBhcmFtcyA9IHRoaXMuX2N1cnJlbnRUcmFuc2l0aW9uICYmIHRoaXMuX2N1cnJlbnRUcmFuc2l0aW9uLnRvLnBhcmFtcztcbiAgICAgICAgICB2YXIgdGFyZ2V0UGFyYW1zID0gcGF0aC5wYXJhbXMgfHwge307XG4gICAgICAgICAgdmFyIHBhcmFtcyA9IGN1cnJlbnRQYXJhbXMgPyBleHRlbmQoZXh0ZW5kKHt9LCBjdXJyZW50UGFyYW1zKSwgdGFyZ2V0UGFyYW1zKSA6IHRhcmdldFBhcmFtcztcbiAgICAgICAgICBnZW5lcmF0ZWRQYXRoID0gZW5jb2RlVVJJKHRoaXMuX3JlY29nbml6ZXIuZ2VuZXJhdGUocGF0aC5uYW1lLCBwYXJhbXMpKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXRoLnBhdGgpIHtcbiAgICAgICAgICBnZW5lcmF0ZWRQYXRoID0gZW5jb2RlVVJJKHBhdGgucGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGgucXVlcnkpIHtcbiAgICAgICAgICAvLyBub3RlOiB0aGUgZ2VuZXJhdGVkIHF1ZXJ5IHN0cmluZyBpcyBwcmUtVVJMLWVuY29kZWQgYnkgdGhlIHJlY29nbml6ZXJcbiAgICAgICAgICB2YXIgcXVlcnkgPSB0aGlzLl9yZWNvZ25pemVyLmdlbmVyYXRlUXVlcnlTdHJpbmcocGF0aC5xdWVyeSk7XG4gICAgICAgICAgaWYgKGdlbmVyYXRlZFBhdGguaW5kZXhPZignPycpID4gLTEpIHtcbiAgICAgICAgICAgIGdlbmVyYXRlZFBhdGggKz0gJyYnICsgcXVlcnkuc2xpY2UoMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdlbmVyYXRlZFBhdGggKz0gcXVlcnk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZW5lcmF0ZWRQYXRoID0gZW5jb2RlVVJJKHBhdGggPyBwYXRoICsgJycgOiAnJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2VuZXJhdGVkUGF0aDtcbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWwgbWV0aG9kcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLyoqXG4gICAgKiBBZGQgYSByb3V0ZSBjb250YWluaW5nIGEgbGlzdCBvZiBzZWdtZW50cyB0byB0aGUgaW50ZXJuYWxcbiAgICAqIHJvdXRlIHJlY29nbml6ZXIuIFdpbGwgYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5IHRvIGFkZCBhbGxcbiAgICAqIHBvc3NpYmxlIHN1Yi1yb3V0ZXMuXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVyXG4gICAgKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50c1xuICAgICovXG5cbiAgICBSb3V0ZXIucHJvdG90eXBlLl9hZGRSb3V0ZSA9IGZ1bmN0aW9uIF9hZGRSb3V0ZShwYXRoLCBoYW5kbGVyLCBzZWdtZW50cykge1xuICAgICAgZ3VhcmRDb21wb25lbnQocGF0aCwgaGFuZGxlcik7XG4gICAgICBoYW5kbGVyLnBhdGggPSBwYXRoO1xuICAgICAgaGFuZGxlci5mdWxsUGF0aCA9IChzZWdtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKHBhdGgsIHNlZ21lbnQpIHtcbiAgICAgICAgcmV0dXJuIHBhdGggKyBzZWdtZW50LnBhdGg7XG4gICAgICB9LCAnJykgKyBwYXRoKS5yZXBsYWNlKCcvLycsICcvJyk7XG4gICAgICBzZWdtZW50cy5wdXNoKHtcbiAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgaGFuZGxlcjogaGFuZGxlclxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZWNvZ25pemVyLmFkZChzZWdtZW50cywge1xuICAgICAgICBhczogaGFuZGxlci5uYW1lXG4gICAgICB9KTtcbiAgICAgIC8vIGFkZCBzdWIgcm91dGVzXG4gICAgICBpZiAoaGFuZGxlci5zdWJSb3V0ZXMpIHtcbiAgICAgICAgZm9yICh2YXIgc3ViUGF0aCBpbiBoYW5kbGVyLnN1YlJvdXRlcykge1xuICAgICAgICAgIC8vIHJlY3Vyc2l2ZWx5IHdhbGsgYWxsIHN1YiByb3V0ZXNcbiAgICAgICAgICB0aGlzLl9hZGRSb3V0ZShzdWJQYXRoLCBoYW5kbGVyLnN1YlJvdXRlc1tzdWJQYXRoXSxcbiAgICAgICAgICAvLyBwYXNzIGEgY29weSBpbiByZWN1cnNpb24gdG8gYXZvaWQgbXV0YXRpbmdcbiAgICAgICAgICAvLyBhY3Jvc3MgYnJhbmNoZXNcbiAgICAgICAgICBzZWdtZW50cy5zbGljZSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIG5vdEZvdW5kIHJvdXRlIGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlclxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5fbm90Rm91bmQgPSBmdW5jdGlvbiBfbm90Rm91bmQoaGFuZGxlcikge1xuICAgICAgZ3VhcmRDb21wb25lbnQoJyonLCBoYW5kbGVyKTtcbiAgICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IFt7IGhhbmRsZXI6IGhhbmRsZXIgfV07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHJlZGlyZWN0IHJlY29yZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHJlZGlyZWN0UGF0aFxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5fYWRkUmVkaXJlY3QgPSBmdW5jdGlvbiBfYWRkUmVkaXJlY3QocGF0aCwgcmVkaXJlY3RQYXRoKSB7XG4gICAgICBpZiAocGF0aCA9PT0gJyonKSB7XG4gICAgICAgIHRoaXMuX25vdEZvdW5kUmVkaXJlY3QgPSByZWRpcmVjdFBhdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hZGRHdWFyZChwYXRoLCByZWRpcmVjdFBhdGgsIHRoaXMucmVwbGFjZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBhbGlhcyByZWNvcmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhbGlhc1BhdGhcbiAgICAgKi9cblxuICAgIFJvdXRlci5wcm90b3R5cGUuX2FkZEFsaWFzID0gZnVuY3Rpb24gX2FkZEFsaWFzKHBhdGgsIGFsaWFzUGF0aCkge1xuICAgICAgdGhpcy5fYWRkR3VhcmQocGF0aCwgYWxpYXNQYXRoLCB0aGlzLl9tYXRjaCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHBhdGggZ3VhcmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtYXBwZWRQYXRoXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICAgICAqL1xuXG4gICAgUm91dGVyLnByb3RvdHlwZS5fYWRkR3VhcmQgPSBmdW5jdGlvbiBfYWRkR3VhcmQocGF0aCwgbWFwcGVkUGF0aCwgX2hhbmRsZXIpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB0aGlzLl9ndWFyZFJlY29nbml6ZXIuYWRkKFt7XG4gICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIGhhbmRsZXIobWF0Y2gsIHF1ZXJ5KSB7XG4gICAgICAgICAgdmFyIHJlYWxQYXRoID0gbWFwUGFyYW1zKG1hcHBlZFBhdGgsIG1hdGNoLnBhcmFtcywgcXVlcnkpO1xuICAgICAgICAgIF9oYW5kbGVyLmNhbGwoX3RoaXMyLCByZWFsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1dKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYSBwYXRoIG1hdGNoZXMgYW55IHJlZGlyZWN0IHJlY29yZHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IC0gaWYgdHJ1ZSwgd2lsbCBza2lwIG5vcm1hbCBtYXRjaC5cbiAgICAgKi9cblxuICAgIFJvdXRlci5wcm90b3R5cGUuX2NoZWNrR3VhcmQgPSBmdW5jdGlvbiBfY2hlY2tHdWFyZChwYXRoKSB7XG4gICAgICB2YXIgbWF0Y2hlZCA9IHRoaXMuX2d1YXJkUmVjb2duaXplci5yZWNvZ25pemUocGF0aCwgdHJ1ZSk7XG4gICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICBtYXRjaGVkWzBdLmhhbmRsZXIobWF0Y2hlZFswXSwgbWF0Y2hlZC5xdWVyeVBhcmFtcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ub3RGb3VuZFJlZGlyZWN0KSB7XG4gICAgICAgIG1hdGNoZWQgPSB0aGlzLl9yZWNvZ25pemVyLnJlY29nbml6ZShwYXRoKTtcbiAgICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgICAgdGhpcy5yZXBsYWNlKHRoaXMuX25vdEZvdW5kUmVkaXJlY3QpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1hdGNoIGEgVVJMIHBhdGggYW5kIHNldCB0aGUgcm91dGUgY29udGV4dCBvbiB2bSxcbiAgICAgKiB0cmlnZ2VyaW5nIHZpZXcgdXBkYXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtzdGF0ZV1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2FuY2hvcl1cbiAgICAgKi9cblxuICAgIFJvdXRlci5wcm90b3R5cGUuX21hdGNoID0gZnVuY3Rpb24gX21hdGNoKHBhdGgsIHN0YXRlLCBhbmNob3IpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5fY2hlY2tHdWFyZChwYXRoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50Um91dGUgPSB0aGlzLl9jdXJyZW50Um91dGU7XG4gICAgICB2YXIgY3VycmVudFRyYW5zaXRpb24gPSB0aGlzLl9jdXJyZW50VHJhbnNpdGlvbjtcblxuICAgICAgaWYgKGN1cnJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICAgIGlmIChjdXJyZW50VHJhbnNpdGlvbi50by5wYXRoID09PSBwYXRoKSB7XG4gICAgICAgICAgLy8gZG8gbm90aGluZyBpZiB3ZSBoYXZlIGFuIGFjdGl2ZSB0cmFuc2l0aW9uIGdvaW5nIHRvIHRoZSBzYW1lIHBhdGhcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFJvdXRlLnBhdGggPT09IHBhdGgpIHtcbiAgICAgICAgICAvLyBXZSBhcmUgZ29pbmcgdG8gdGhlIHNhbWUgcGF0aCwgYnV0IHdlIGFsc28gaGF2ZSBhbiBvbmdvaW5nIGJ1dFxuICAgICAgICAgIC8vIG5vdC15ZXQtdmFsaWRhdGVkIHRyYW5zaXRpb24uIEFib3J0IHRoYXQgdHJhbnNpdGlvbiBhbmQgcmVzZXQgdG9cbiAgICAgICAgICAvLyBwcmV2IHRyYW5zaXRpb24uXG4gICAgICAgICAgY3VycmVudFRyYW5zaXRpb24uYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fY3VycmVudFRyYW5zaXRpb24gPSB0aGlzLl9wcmV2VHJhbnNpdGlvbjtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ29pbmcgdG8gYSB0b3RhbGx5IGRpZmZlcmVudCBwYXRoLiBhYm9ydCBvbmdvaW5nIHRyYW5zaXRpb24uXG4gICAgICAgICAgY3VycmVudFRyYW5zaXRpb24uYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY29uc3RydWN0IG5ldyByb3V0ZSBhbmQgdHJhbnNpdGlvbiBjb250ZXh0XG4gICAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUocGF0aCwgdGhpcyk7XG4gICAgICB2YXIgdHJhbnNpdGlvbiA9IG5ldyBSb3V0ZVRyYW5zaXRpb24odGhpcywgcm91dGUsIGN1cnJlbnRSb3V0ZSk7XG5cbiAgICAgIC8vIGN1cnJlbnQgdHJhbnNpdGlvbiBpcyB1cGRhdGVkIHJpZ2h0IG5vdy5cbiAgICAgIC8vIGhvd2V2ZXIsIGN1cnJlbnQgcm91dGUgd2lsbCBvbmx5IGJlIHVwZGF0ZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb24gaGFzXG4gICAgICAvLyBiZWVuIHZhbGlkYXRlZC5cbiAgICAgIHRoaXMuX3ByZXZUcmFuc2l0aW9uID0gY3VycmVudFRyYW5zaXRpb247XG4gICAgICB0aGlzLl9jdXJyZW50VHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XG5cbiAgICAgIGlmICghdGhpcy5hcHApIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBpbml0aWFsIHJlbmRlclxuICAgICAgICAgIHZhciByb3V0ZXIgPSBfdGhpczM7XG4gICAgICAgICAgX3RoaXMzLmFwcCA9IG5ldyBfdGhpczMuX2FwcENvbnN0cnVjdG9yKHtcbiAgICAgICAgICAgIGVsOiBfdGhpczMuX2FwcENvbnRhaW5lcixcbiAgICAgICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQoKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHJvdXRlciA9IHJvdXRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfbWV0YToge1xuICAgICAgICAgICAgICAkcm91dGU6IHJvdXRlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIGdsb2JhbCBiZWZvcmUgaG9va1xuICAgICAgdmFyIGJlZm9yZUhvb2tzID0gdGhpcy5fYmVmb3JlRWFjaEhvb2tzO1xuICAgICAgdmFyIHN0YXJ0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uIHN0YXJ0VHJhbnNpdGlvbigpIHtcbiAgICAgICAgdHJhbnNpdGlvbi5zdGFydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMzLl9wb3N0VHJhbnNpdGlvbihyb3V0ZSwgc3RhdGUsIGFuY2hvcik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgaWYgKGJlZm9yZUhvb2tzLmxlbmd0aCkge1xuICAgICAgICB0cmFuc2l0aW9uLnJ1blF1ZXVlKGJlZm9yZUhvb2tzLCBmdW5jdGlvbiAoaG9vaywgXywgbmV4dCkge1xuICAgICAgICAgIGlmICh0cmFuc2l0aW9uID09PSBfdGhpczMuX2N1cnJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uLmNhbGxIb29rKGhvb2ssIG51bGwsIG5leHQsIHtcbiAgICAgICAgICAgICAgZXhwZWN0Qm9vbGVhbjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBzdGFydFRyYW5zaXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnRUcmFuc2l0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fcmVuZGVyZWQgJiYgdGhpcy5fc3RhcnRDYikge1xuICAgICAgICB0aGlzLl9zdGFydENiLmNhbGwobnVsbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEhBQ0s6XG4gICAgICAvLyBzZXQgcmVuZGVyZWQgdG8gdHJ1ZSBhZnRlciB0aGUgdHJhbnNpdGlvbiBzdGFydCwgc29cbiAgICAgIC8vIHRoYXQgY29tcG9uZW50cyB0aGF0IGFyZSBhY2l0dmF0ZWQgc3luY2hyb25vdXNseSBrbm93XG4gICAgICAvLyB3aGV0aGVyIGl0IGlzIHRoZSBpbml0aWFsIHJlbmRlci5cbiAgICAgIHRoaXMuX3JlbmRlcmVkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IGN1cnJlbnQgdG8gdGhlIG5ldyB0cmFuc2l0aW9uLlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIGJ5IHRoZSB0cmFuc2l0aW9uIG9iamVjdCB3aGVuIHRoZVxuICAgICAqIHZhbGlkYXRpb24gb2YgYSByb3V0ZSBoYXMgc3VjY2VlZGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUcmFuc2l0aW9ufSB0cmFuc2l0aW9uXG4gICAgICovXG5cbiAgICBSb3V0ZXIucHJvdG90eXBlLl9vblRyYW5zaXRpb25WYWxpZGF0ZWQgPSBmdW5jdGlvbiBfb25UcmFuc2l0aW9uVmFsaWRhdGVkKHRyYW5zaXRpb24pIHtcbiAgICAgIC8vIHNldCBjdXJyZW50IHJvdXRlXG4gICAgICB2YXIgcm91dGUgPSB0aGlzLl9jdXJyZW50Um91dGUgPSB0cmFuc2l0aW9uLnRvO1xuICAgICAgLy8gdXBkYXRlIHJvdXRlIGNvbnRleHQgZm9yIGFsbCBjaGlsZHJlblxuICAgICAgaWYgKHRoaXMuYXBwLiRyb3V0ZSAhPT0gcm91dGUpIHtcbiAgICAgICAgdGhpcy5hcHAuJHJvdXRlID0gcm91dGU7XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgY2hpbGQuJHJvdXRlID0gcm91dGU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gY2FsbCBnbG9iYWwgYWZ0ZXIgaG9va1xuICAgICAgaWYgKHRoaXMuX2FmdGVyRWFjaEhvb2tzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9hZnRlckVhY2hIb29rcy5mb3JFYWNoKGZ1bmN0aW9uIChob29rKSB7XG4gICAgICAgICAgcmV0dXJuIGhvb2suY2FsbChudWxsLCB7XG4gICAgICAgICAgICB0bzogdHJhbnNpdGlvbi50byxcbiAgICAgICAgICAgIGZyb206IHRyYW5zaXRpb24uZnJvbVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2N1cnJlbnRUcmFuc2l0aW9uLmRvbmUgPSB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgc3R1ZmYgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JvdXRlfSByb3V0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhdGVdXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFthbmNob3JdXG4gICAgICovXG5cbiAgICBSb3V0ZXIucHJvdG90eXBlLl9wb3N0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uIF9wb3N0VHJhbnNpdGlvbihyb3V0ZSwgc3RhdGUsIGFuY2hvcikge1xuICAgICAgLy8gaGFuZGxlIHNjcm9sbCBwb3NpdGlvbnNcbiAgICAgIC8vIHNhdmVkIHNjcm9sbCBwb3NpdGlvbnMgdGFrZSBwcmlvcml0eVxuICAgICAgLy8gdGhlbiB3ZSBjaGVjayBpZiB0aGUgcGF0aCBoYXMgYW4gYW5jaG9yXG4gICAgICB2YXIgcG9zID0gc3RhdGUgJiYgc3RhdGUucG9zO1xuICAgICAgaWYgKHBvcyAmJiB0aGlzLl9zYXZlU2Nyb2xsUG9zaXRpb24pIHtcbiAgICAgICAgVnVlLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8ocG9zLngsIHBvcy55KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGFuY2hvcikge1xuICAgICAgICBWdWUubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFuY2hvci5zbGljZSgxKSk7XG4gICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8od2luZG93LnNjcm9sbFgsIGVsLm9mZnNldFRvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFJvdXRlcjtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiBndWFyZENvbXBvbmVudChwYXRoLCBoYW5kbGVyKSB7XG4gICAgdmFyIGNvbXAgPSBoYW5kbGVyLmNvbXBvbmVudDtcbiAgICBpZiAoVnVlLnV0aWwuaXNQbGFpbk9iamVjdChjb21wKSkge1xuICAgICAgY29tcCA9IGhhbmRsZXIuY29tcG9uZW50ID0gVnVlLmV4dGVuZChjb21wKTtcbiAgICB9XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKHR5cGVvZiBjb21wICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBoYW5kbGVyLmNvbXBvbmVudCA9IG51bGw7XG4gICAgICB3YXJuJDEoJ2ludmFsaWQgY29tcG9uZW50IGZvciByb3V0ZSBcIicgKyBwYXRoICsgJ1wiLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qIEluc3RhbGxhdGlvbiAqL1xuXG4gIFJvdXRlci5pbnN0YWxsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5zdGFsbGF0aW9uIGludGVyZmFjZS5cbiAgICogSW5zdGFsbCB0aGUgbmVjZXNzYXJ5IGRpcmVjdGl2ZXMuXG4gICAqL1xuXG4gIFJvdXRlci5pbnN0YWxsID0gZnVuY3Rpb24gKGV4dGVybmFsVnVlKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKFJvdXRlci5pbnN0YWxsZWQpIHtcbiAgICAgIHdhcm4kMSgnYWxyZWFkeSBpbnN0YWxsZWQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFZ1ZSA9IGV4dGVybmFsVnVlO1xuICAgIGFwcGx5T3ZlcnJpZGUoVnVlKTtcbiAgICBWaWV3KFZ1ZSk7XG4gICAgTGluayhWdWUpO1xuICAgIGV4cG9ydHMkMS5WdWUgPSBWdWU7XG4gICAgUm91dGVyLmluc3RhbGxlZCA9IHRydWU7XG4gIH07XG5cbiAgLy8gYXV0byBpbnN0YWxsXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZ1ZSkge1xuICAgIHdpbmRvdy5WdWUudXNlKFJvdXRlcik7XG4gIH1cblxuICByZXR1cm4gUm91dGVyO1xuXG59KSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLXJvdXRlci9kaXN0L3Z1ZS1yb3V0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgXCIvXCI6IHtcbiAgICAgICAgY29tcG9uZW50OiByZXF1aXJlKCd2aWV3cy9pbmRleC52dWUnKVxuICAgIH0sXG4gICAgXCIvcGFnaW5hdGlvbnNcIjoge1xuICAgICAgICBjb21wb25lbnQ6IHJlcXVpcmUoJ3ZpZXdzL3BhZ2luYXRpb25zLnZ1ZScpXG4gICAgfSxcbiAgICBcIi9tb2RhbHNcIjoge1xuICAgICAgICBjb21wb25lbnQ6IHJlcXVpcmUoJ3ZpZXdzL21vZGFscy52dWUnKVxuICAgIH0sXG4gICAgXCIvdHlwYWhlYWRzXCI6IHtcbiAgICAgICAgY29tcG9uZW50OiByZXF1aXJlKCd2aWV3cy90eXBlQWhlYWRzLnZ1ZScpXG4gICAgfSxcbiAgICBcIi90YWdpbnB1dHNcIjoge1xuICAgICAgICBjb21wb25lbnQ6IHJlcXVpcmUoJ3ZpZXdzL3RhZ2lucHV0cy52dWUnKVxuICAgIH0sXG4gICAgXCIvZGF0ZXRpbWVwaWNrZXJzXCI6IHtcbiAgICAgICAgY29tcG9uZW50OiByZXF1aXJlKCd2aWV3cy9kYXRldGltZVBpY2tlci52dWUnKVxuICAgIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzLWRldi9zcmMvcm91dGVzLmpzXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvaW5kZXgudnVlXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxuX192dWVfc2NyaXB0X18gPSByZXF1aXJlKFwiISFiYWJlbC1sb2FkZXI/cHJlc2V0c1tdPWVzMjAxNSZwbHVnaW5zW109dHJhbnNmb3JtLXJ1bnRpbWUmY29tbWVudHM9ZmFsc2UhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL3BhZ2luYXRpb25zLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBleGFtcGxlcy1kZXZcXFxcc3JjXFxcXHZpZXdzXFxcXHBhZ2luYXRpb25zLnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5fX3Z1ZV90ZW1wbGF0ZV9fID0gcmVxdWlyZShcIiEhdnVlLWh0bWw/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9wYWdpbmF0aW9ucy52dWVcIilcbm1vZHVsZS5leHBvcnRzID0gX192dWVfc2NyaXB0X18gfHwge31cbmlmIChtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLmRlZmF1bHRcbnZhciBfX3Z1ZV9vcHRpb25zX18gPSB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwiZnVuY3Rpb25cIiA/IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zIHx8IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zID0ge30pKSA6IG1vZHVsZS5leHBvcnRzXG5pZiAoX192dWVfdGVtcGxhdGVfXykge1xuX192dWVfb3B0aW9uc19fLnRlbXBsYXRlID0gX192dWVfdGVtcGxhdGVfX1xufVxuaWYgKCFfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQpIF9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCA9IHt9XG5PYmplY3Qua2V5cyhfX3Z1ZV9zdHlsZXNfXykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG52YXIgbW9kdWxlID0gX192dWVfc3R5bGVzX19ba2V5XVxuX192dWVfb3B0aW9uc19fLmNvbXB1dGVkW2tleV0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtb2R1bGUgfVxufSlcbmlmIChtb2R1bGUuaG90KSB7KGZ1bmN0aW9uICgpIHsgIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgdmFyIGhvdEFQSSA9IHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIilcbiAgaG90QVBJLmluc3RhbGwocmVxdWlyZShcInZ1ZVwiKSwgZmFsc2UpXG4gIGlmICghaG90QVBJLmNvbXBhdGlibGUpIHJldHVyblxuICB2YXIgaWQgPSBcIl92LTBjZGM0YmM0L3BhZ2luYXRpb25zLnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvcGFnaW5hdGlvbnMudnVlXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48ZGl2PlxuICAgIFxuICAgIDxkaXY+XG4gICAgICAgIDxoZHAtcGFnaW5hdGlvbiA6cGFnZXNpemU9XCI2XCIgOnRvdGFsPVwiMTBcIiA6Y3VyPVwiMVwiIDpsaW5rPVwiY3JlYXRlTGlua1wiPjwvaGRwLXBhZ2luYXRpb24+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2PlxuICAgICAgICA8aGRwLXBhZ2luYXRpb24gOnBhZ2VzaXplPVwiNlwiIDp0b3RhbD1cIjIwMFwiIDpjdXI9XCIxXCI+PC9oZHAtcGFnaW5hdGlvbj5cbiAgICA8L2Rpdj5cblxuPC9kaXY+XG5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG1ldGhvZHM6IHtcbiAgICBjcmVhdGVMaW5rOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gJy9wYWdpbmF0aW9uP3BhZ2U9JyArIHA7XG4gICAgfVxuICB9XG59O1xuXG48L3NjcmlwdD5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHBhZ2luYXRpb25zLnZ1ZT9kZmE1ZjllY1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG5cXG48ZGl2PlxcbiAgICBcXG4gICAgPGRpdj5cXG4gICAgICAgIDxoZHAtcGFnaW5hdGlvbiA6cGFnZXNpemU9XFxcIjZcXFwiIDp0b3RhbD1cXFwiMTBcXFwiIDpjdXI9XFxcIjFcXFwiIDpsaW5rPVxcXCJjcmVhdGVMaW5rXFxcIj48L2hkcC1wYWdpbmF0aW9uPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdj5cXG4gICAgICAgIDxoZHAtcGFnaW5hdGlvbiA6cGFnZXNpemU9XFxcIjZcXFwiIDp0b3RhbD1cXFwiMjAwXFxcIiA6Y3VyPVxcXCIxXFxcIj48L2hkcC1wYWdpbmF0aW9uPlxcbiAgICA8L2Rpdj5cXG5cXG48L2Rpdj5cXG5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtaHRtbC1sb2FkZXI/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vZXhhbXBsZXMtZGV2L3NyYy92aWV3cy9wYWdpbmF0aW9ucy52dWVcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5fX3Z1ZV9zY3JpcHRfXyA9IHJlcXVpcmUoXCIhIWJhYmVsLWxvYWRlcj9wcmVzZXRzW109ZXMyMDE1JnBsdWdpbnNbXT10cmFuc2Zvcm0tcnVudGltZSZjb21tZW50cz1mYWxzZSEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXNjcmlwdCZpbmRleD0wIS4vbW9kYWxzLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBleGFtcGxlcy1kZXZcXFxcc3JjXFxcXHZpZXdzXFxcXG1vZGFscy52dWU6IG5hbWVkIGV4cG9ydHMgaW4gKi52dWUgZmlsZXMgYXJlIGlnbm9yZWQuXCIpfVxuX192dWVfdGVtcGxhdGVfXyA9IHJlcXVpcmUoXCIhIXZ1ZS1odG1sP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vbW9kYWxzLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtNDE0YmNhZjEvbW9kYWxzLnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvbW9kYWxzLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIjx0ZW1wbGF0ZT5cblxuPGRpdj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYW0tYnRuIGFtLWJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIHYtb246Y2xpY2s9XCJzaG93TW9kYWw9dHJ1ZVwiPm9wZW4gbW9kYWw8L2J1dHRvbj5cbiAgICAmbmJzcDsmbmJzcDtcbiAgICA8YnV0dG9uIGNsYXNzPVwiYW0tYnRuIGFtLWJ0bi1wcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIHYtb246Y2xpY2s9XCJjbGlja0FsZXJ0XCI+b3BlbiBhbGVydDwvYnV0dG9uPlxuICAgICZuYnNwOyZuYnNwO1xuICAgIDxidXR0b24gY2xhc3M9XCJhbS1idG4gYW0tYnRuLXNlY29uZGFyeVwiIHR5cGU9XCJidXR0b25cIiB2LW9uOmNsaWNrPVwiY2xpY2tDb25maXJtXCI+b3BlbiBjb25maXJtPC9idXR0b24+XG4gICAgJm5ic3A7Jm5ic3A7XG4gICAgPGJ1dHRvbiBjbGFzcz1cImFtLWJ0biBhbS1idG4tc3VjY2Vzc1wiIHR5cGU9XCJidXR0b25cIiB2LW9uOmNsaWNrPVwiY2xpY2tEaWFsb2dcIj5vcGVuIGRpYWxvZzwvYnV0dG9uPlxuICAgICZuYnNwOyZuYnNwO1xuXG48L2Rpdj5cblxuPGhkcC1tb2RhbCA6c2hvdy5zeW5jPVwic2hvd01vZGFsXCI+XG4gICAgPGRpdiBjbGFzcz1cImFtLW1vZGFsLWhkXCIgc2xvdD1cImhlYWRlclwiPm1vZGFsIGhlYWRlcjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbS1tb2RhbC1iZFwiIHNsb3Q9XCJib2R5XCI+aGVsbG88L2Rpdj5cbjwvaGRwLW1vZGFsPlxuXG48aGRwLWFsZXJ0IDpzaG93LnN5bmM9XCJzaG93QWxlcnRcIiBjbGFzcy1uYW1lPVwiYW0tbW9kYWwtc21cIiA6bXNnPVwiYWxlcnRNc2dcIiBAYWxlcnQub2s9XCJjbGlja0FsZXJ0T0tcIj48L2hkcC1hbGVydD5cblxuPGhkcC1jb25maXJtIDpzaG93LnN5bmM9XCJzaG93Q29uZmlybVwiIGNsYXNzLW5hbWU9XCJhbS1tb2RhbC1zbVwiIDptc2c9XCJjb25maXJtTXNnXCIgQGNvbmZpcm0ub2s9XCJjbGlja0NvbmZpcm1PS1wiIEBjb25maXJtLmNhbmNlbD1cImNsaWNrQ29uZmlybUNhbmNlbFwiPjwvaGRwLWNvbmZpcm0+XG5cbjxoZHAtZGlhbG9nIDpzaG93LnN5bmM9XCJzaG93RGlhbG9nXCIgOm1zZz1cImRpYWxvZ01zZ1wiIEBkaWFsb2cuY2FuY2VsPVwiY2xpY2tEaWFsb2dDYW5jZWxcIiBAZGlhbG9nLm9rPVwiY2xpY2tEaWFsb2dPS1wiPlxuICAgIDxsYWJlbCBmb3I9XCJcIj51c2VybmFtZTwvbGFiZWw+XG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdi1tb2RlbD1cInVzZXJuYW1lXCI+XG48L2hkcC1kaWFsb2c+XG5cblxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuaW1wb3J0IGhkcFZ1ZUNvbXBvbmVudHMgZnJvbSAnaGRwLXZ1ZS1jb21wb25lbnRzJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNob3dNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICBzaG93QWxlcnQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0NvbmZpcm06IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0RpYWxvZzogZmFsc2UsXG4gICAgICAgICAgICBhbGVydE1zZzoge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnYWxlcnQnLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdhbGVydCBjb250ZW50J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbmZpcm1Nc2c6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ2NvbmZpcm0nLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdhbGVydCBjb250ZW50JyxcbiAgICAgICAgICAgICAgICBjYW5jZWxUZXh0OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpYWxvZ01zZzoge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnZmluaXNoIHlvdXIgbWVzc2FnZScsXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICfmj5DkuqQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXNlcm5hbWU6ICdoZHAnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2xpY2tBbGVydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dBbGVydCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmFsZXJ0TXNnLnRpdGxlID0gdGhpcy5hbGVydE1zZy50aXRsZSArIDE7XG4gICAgICAgIH0sXG4gICAgICAgIGNsaWNrQWxlcnRPSzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dBbGVydCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBjbGlja0NvbmZpcm06IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93Q29uZmlybSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1Nc2cudGl0bGUgPSB0aGlzLmFsZXJ0TXNnLnRpdGxlICsgMTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2tDb25maXJtT0s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3llYWgnKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0NvbmZpcm0gPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2tDb25maXJtQ2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubycpO1xuICAgICAgICAgICAgdGhpcy5zaG93Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBjbGlja0RpYWxvZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dEaWFsb2cgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBjbGlja0RpYWxvZ09LOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0RpYWxvZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Ym1pdCBuYW1lOicgKyB0aGlzLnVzZXJuYW1lKVxuICAgICAgICB9LFxuICAgICAgICBjbGlja0RpYWxvZ0NhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dEaWFsb2cgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW5jZWwnKVxuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG48L3NjcmlwdD5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIG1vZGFscy52dWU/NjgxYzdmZTdcbiAqKi8iLCJ2YXIgcGFnaW5hdGlvbiA9IHJlcXVpcmUoJy4vcGFnaW5hdGlvbi9wYWdpbmF0aW9uLnZ1ZScpO1xudmFyIG1vZGFsID0gcmVxdWlyZSgnLi9tb2RhbC9tb2RhbC52dWUnKTtcbnZhciBhbGVydCA9IHJlcXVpcmUoJy4vbW9kYWwvYWxlcnQudnVlJyk7XG52YXIgY29uZmlybSA9IHJlcXVpcmUoJy4vbW9kYWwvY29uZmlybS52dWUnKTtcbnZhciBkaWFsb2cgPSByZXF1aXJlKCcuL21vZGFsL2RpYWxvZy52dWUnKTtcbnZhciB0eXBlQWhlYWRJbnRlcmZhY2UgPSByZXF1aXJlKCcuL3R5cGVhaGVhZC90eXBlQWhlYWRJbnRlcmZhY2UudnVlJyk7XG52YXIgdHlwZUFoZWFkVGV4dCA9IHJlcXVpcmUoJy4vdHlwZWFoZWFkL3R5cGVBaGVhZF90ZXh0LnZ1ZScpO1xudmFyIHR5cGVBaGVhZE9iamVjdCA9IHJlcXVpcmUoJy4vdHlwZWFoZWFkL3R5cGVBaGVhZF9vYmplY3QudnVlJyk7XG52YXIgdGFnaW5wdXQgPSByZXF1aXJlKCcuL3RhZ2lucHV0L3RhZ2lucHV0LnZ1ZScpO1xudmFyIGRhdGVUaW1lUGlja2VyID0gcmVxdWlyZSgnLi9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci52dWUnKTtcbnZhciBkYXRlVGltZUlucHV0ICA9IHJlcXVpcmUoJy4vZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVpbnB1dC52dWUnKTtcblxudmFyIGNvbXBvbmVudHMgPSB7XG4gICAgaGRwUGFnaW5hdGlvbjogcGFnaW5hdGlvbixcbiAgICBoZHBNb2RhbDogbW9kYWwsXG4gICAgaGRwQWxlcnQ6IGFsZXJ0LFxuICAgIGhkcENvbmZpcm06IGNvbmZpcm0sXG4gICAgaGRwRGlhbG9nOiBkaWFsb2csXG4gICAgaGRwVGFUZXh0OiB0eXBlQWhlYWRUZXh0LFxuICAgIGhkcFRhT2JqZWN0OiB0eXBlQWhlYWRPYmplY3QsXG4gICAgaGRwVGFnaW5wdXQ6IHRhZ2lucHV0LFxuICAgIGhkcERhdGVUaW1lUGlja2VyOiBkYXRlVGltZVBpY2tlcixcbiAgICBoZHBEYXRlVGltZUlucHV0OiBkYXRlVGltZUlucHV0XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgIGNvbXBvbmVudHM6IGZ1bmN0aW9uIGluc3RhbGwoVnVlKSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gY29tcG9uZW50cykge1xuICAgICAgICAgICAgVnVlLmNvbXBvbmVudChuYW1lLCBjb21wb25lbnRzW25hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cbn0sY29tcG9uZW50cyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbWFpbi5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJyl9KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDI2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSAyN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanNcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgJGFzc2lnbiAgPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICB2YXIgQSA9IHt9XG4gICAgLCBCID0ge31cbiAgICAsIFMgPSBTeW1ib2woKVxuICAgICwgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGspeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUICAgICA9IHRvT2JqZWN0KHRhcmdldClcbiAgICAsIGFMZW4gID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgaW5kZXggPSAxXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mXG4gICAgLCBpc0VudW0gICAgID0gcElFLmY7XG4gIHdoaWxlKGFMZW4gPiBpbmRleCl7XG4gICAgdmFyIFMgICAgICA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKVxuICAgICAgLCBrZXlzICAgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGogICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGxlbmd0aCA+IGopaWYoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSlUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qc1xuICoqIG1vZHVsZSBpZCA9IDMwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanNcbiAqKiBtb2R1bGUgaWQgPSAzMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qc1xuICoqIG1vZHVsZSBpZCA9IDMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzXG4gKiogbW9kdWxlIGlkID0gMzNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanNcbiAqKiBtb2R1bGUgaWQgPSAzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanNcbiAqKiBtb2R1bGUgaWQgPSAzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzXG4gKiogbW9kdWxlIGlkID0gMzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qc1xuICoqIG1vZHVsZSBpZCA9IDM3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanNcbiAqKiBtb2R1bGUgaWQgPSAzOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gNDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gNDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzXG4gKiogbW9kdWxlIGlkID0gNDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qc1xuICoqIG1vZHVsZSBpZCA9IDQzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzXG4gKiogbW9kdWxlIGlkID0gNDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzXG4gKiogbW9kdWxlIGlkID0gNDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzXG4gKiogbW9kdWxlIGlkID0gNDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtcGllLmpzXG4gKiogbW9kdWxlIGlkID0gNDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzXG4gKiogbW9kdWxlIGlkID0gNDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBfX3Z1ZV9zY3JpcHRfXywgX192dWVfdGVtcGxhdGVfX1xudmFyIF9fdnVlX3N0eWxlc19fID0ge31cbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9wYWdpbmF0aW9uLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxccGFnaW5hdGlvblxcXFxwYWdpbmF0aW9uLnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5fX3Z1ZV90ZW1wbGF0ZV9fID0gcmVxdWlyZShcIiEhdnVlLWh0bWw/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9wYWdpbmF0aW9uLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtNzA0OGMxYzQvcGFnaW5hdGlvbi52dWVcIlxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoaWQsIG1vZHVsZS5leHBvcnRzKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS51cGRhdGUoaWQsIG1vZHVsZS5leHBvcnRzLCBfX3Z1ZV90ZW1wbGF0ZV9fKVxuICB9XG59KSgpfVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDQ5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCI8dGVtcGxhdGU+XG4gICAgPHVsIGNsYXNzPVwiYW0tcGFnaW5hdGlvblwiPlxuICAgICAgICA8bGkgdi1pZj1cImN1ciE9MVwiPlxuICAgICAgICAgICAgPGEgdi1pZj1cIiFwYWdlTGlua1wiIHYtb246Y2xpY2s9XCJjdXItLVwiPuS4iuS4gOmhtTwvYT5cbiAgICAgICAgICAgIDxhIHYtZWxzZSB2LWxpbms9XCJwYWdlTGluayhjdXIgLSAxKVwiPuS4iuS4gOmhtTwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIHYtZm9yPVwiaW5kZXggaW4gaW5kZXhzXCIgIHYtYmluZDpjbGFzcz1cInsgJ2FtLWFjdGl2ZSc6IGN1ciA9PSBpbmRleH1cIj5cbiAgICAgICAgICAgIDxhIHYtaWY9XCIhcGFnZUxpbmtcIiB2LW9uOmNsaWNrPVwiYnRuQ2xpY2soaW5kZXgpXCI+e3sgaW5kZXggfX08L2E+XG4gICAgICAgICAgICA8YSB2LWVsc2Ugdi1saW5rPVwicGFnZUxpbmsoY3VyKVwiPnt7IGluZGV4IH19PC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgICA8bGkgdi1pZj1cImN1ciE9cGFnZW51bVwiPlxuICAgICAgICAgICAgPGEgdi1pZj1cIiFwYWdlTGlua1wiIHYtb246Y2xpY2s9XCJjdXIrK1wiPuS4i+S4gOmhtTwvYT5cbiAgICAgICAgICAgIDxhIHYtZWxzZSB2LWxpbms9XCJwYWdlTGluayhjdXIgKyAxKVwiPuS4iuS4gOmhtTwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiYW0tcGFnaW5hdGlvbi10b3RhbFwiPjxzcGFuPuaAu+aVsO+8mjxpPnt7dG90YWx9fTwvaT48L3NwYW4+PC9saT5cbiAgICA8L3VsPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgICBleHBvcnQgZGVmYXVsdCB7XG5cbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICdjdXInOiBOdW1iZXIsXG4gICAgICAgICAgICAndG90YWwnOiBOdW1iZXIsXG4gICAgICAgICAgICAncGFnZXNpemUnOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3BhZ2VMaW5rJzoge1xuICAgICAgICAgICAgICAgIHR5cGU6IEZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7fVxuICAgICAgICB9LFxuICAgICAgICBjb21wdXRlZDoge1xuICAgICAgICAgICAgaW5kZXhzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gMVxuICAgICAgICAgICAgICAgIGxldCBhcnIgPSBbXVxuICAgICAgICAgICAgICAgIGxldCBwYWdlbnVtID0gTWF0aC5jZWlsKHRoaXMudG90YWwvdGhpcy5wYWdlc2l6ZSlcbiAgICAgICAgICAgICAgICBsZXQgcmlnaHQgPSBwYWdlbnVtXG4gICAgICAgICAgICAgICAgaWYocGFnZW51bT49IDExKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jdXIgPiA1ICYmIHRoaXMuY3VyIDwgcGFnZW51bS00KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSB0aGlzLmN1ciAtIDVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5jdXIgKyA0XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5jdXI8PTUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSBwYWdlbnVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA9IHBhZ2VudW0gLTlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIHdoaWxlIChsZWZ0IDw9IHJpZ2h0KXtcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2gobGVmdClcbiAgICAgICAgICAgICAgICAgICAgbGVmdCArK1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGlmIChhcnJbMF0gIT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBhcnIudW5zaGlmdCgn6aaW6aG1JylcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBpZiAocmlnaHQgIT0gcGFnZW51bSkge1xuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCgn5bC+6aG1JykgIFxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIHJldHVybiBhcnJcbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIHBhZ2VudW06IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMudG90YWwvdGhpcy5wYWdlc2l6ZSk7XG4gICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBidG5DbGljazogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09ICfpppbpobUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VyID0gMVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSA9PT0gJ+WwvumhtScpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXIgPSBNYXRoLmNlaWwodGhpcy50b3RhbC90aGlzLnBhZ2VzaXplKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YSAhPSB0aGlzLmN1cil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VyID0gZGF0YSBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbjwvc2NyaXB0PlxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHBhZ2luYXRpb24udnVlPzE1ODViNWRlXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcbjx1bCBjbGFzcz1cXFwiYW0tcGFnaW5hdGlvblxcXCI+XFxuICAgIDxsaSB2LWlmPVxcXCJjdXIhPTFcXFwiPlxcbiAgICAgICAgPGEgdi1pZj1cXFwiIXBhZ2VMaW5rXFxcIiB2LW9uOmNsaWNrPVxcXCJjdXItLVxcXCI+5LiK5LiA6aG1PC9hPlxcbiAgICAgICAgPGEgdi1lbHNlIHYtbGluaz1cXFwicGFnZUxpbmsoY3VyIC0gMSlcXFwiPuS4iuS4gOmhtTwvYT5cXG4gICAgPC9saT5cXG4gICAgPGxpIHYtZm9yPVxcXCJpbmRleCBpbiBpbmRleHNcXFwiICB2LWJpbmQ6Y2xhc3M9XFxcInsgJ2FtLWFjdGl2ZSc6IGN1ciA9PSBpbmRleH1cXFwiPlxcbiAgICAgICAgPGEgdi1pZj1cXFwiIXBhZ2VMaW5rXFxcIiB2LW9uOmNsaWNrPVxcXCJidG5DbGljayhpbmRleClcXFwiPnt7IGluZGV4IH19PC9hPlxcbiAgICAgICAgPGEgdi1lbHNlIHYtbGluaz1cXFwicGFnZUxpbmsoY3VyKVxcXCI+e3sgaW5kZXggfX08L2E+XFxuICAgIDwvbGk+XFxuICAgIDxsaSB2LWlmPVxcXCJjdXIhPXBhZ2VudW1cXFwiPlxcbiAgICAgICAgPGEgdi1pZj1cXFwiIXBhZ2VMaW5rXFxcIiB2LW9uOmNsaWNrPVxcXCJjdXIrK1xcXCI+5LiL5LiA6aG1PC9hPlxcbiAgICAgICAgPGEgdi1lbHNlIHYtbGluaz1cXFwicGFnZUxpbmsoY3VyICsgMSlcXFwiPuS4iuS4gOmhtTwvYT5cXG4gICAgPC9saT5cXG4gICAgPGxpIGNsYXNzPVxcXCJhbS1wYWdpbmF0aW9uLXRvdGFsXFxcIj48c3Bhbj7mgLvmlbDvvJo8aT57e3RvdGFsfX08L2k+PC9zcGFuPjwvbGk+XFxuPC91bD5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtaHRtbC1sb2FkZXI/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL3BhZ2luYXRpb24vcGFnaW5hdGlvbi52dWVcbiAqKiBtb2R1bGUgaWQgPSA1MVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxucmVxdWlyZShcIiEhdnVlLXN0eWxlLWxvYWRlciFjc3MtbG9hZGVyP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi9tb2RhbC52dWVcIilcbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9tb2RhbC52dWVcIilcbmlmIChfX3Z1ZV9zY3JpcHRfXyAmJlxuICAgIF9fdnVlX3NjcmlwdF9fLl9fZXNNb2R1bGUgJiZcbiAgICBPYmplY3Qua2V5cyhfX3Z1ZV9zY3JpcHRfXykubGVuZ3RoID4gMSkge1xuICBjb25zb2xlLndhcm4oXCJbdnVlLWxvYWRlcl0gc3JjXFxcXG1vZGFsXFxcXG1vZGFsLnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5fX3Z1ZV90ZW1wbGF0ZV9fID0gcmVxdWlyZShcIiEhdnVlLWh0bWw/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9tb2RhbC52dWVcIilcbm1vZHVsZS5leHBvcnRzID0gX192dWVfc2NyaXB0X18gfHwge31cbmlmIChtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLmRlZmF1bHRcbnZhciBfX3Z1ZV9vcHRpb25zX18gPSB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwiZnVuY3Rpb25cIiA/IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zIHx8IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zID0ge30pKSA6IG1vZHVsZS5leHBvcnRzXG5pZiAoX192dWVfdGVtcGxhdGVfXykge1xuX192dWVfb3B0aW9uc19fLnRlbXBsYXRlID0gX192dWVfdGVtcGxhdGVfX1xufVxuaWYgKCFfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQpIF9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCA9IHt9XG5PYmplY3Qua2V5cyhfX3Z1ZV9zdHlsZXNfXykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG52YXIgbW9kdWxlID0gX192dWVfc3R5bGVzX19ba2V5XVxuX192dWVfb3B0aW9uc19fLmNvbXB1dGVkW2tleV0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtb2R1bGUgfVxufSlcbmlmIChtb2R1bGUuaG90KSB7KGZ1bmN0aW9uICgpIHsgIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgdmFyIGhvdEFQSSA9IHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIilcbiAgaG90QVBJLmluc3RhbGwocmVxdWlyZShcInZ1ZVwiKSwgZmFsc2UpXG4gIGlmICghaG90QVBJLmNvbXBhdGlibGUpIHJldHVyblxuICB2YXIgaWQgPSBcIl92LTBkNTI0YjgwL21vZGFsLnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tb2RhbC9tb2RhbC52dWVcbiAqKiBtb2R1bGUgaWQgPSA1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL21vZGFsLnZ1ZVwiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi9tb2RhbC52dWVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL21vZGFsLnZ1ZVwiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLXN0eWxlLWxvYWRlciEuL34vY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi9zcmMvbW9kYWwvbW9kYWwudnVlXG4gKiogbW9kdWxlIGlkID0gNTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuLmFtLW1vZGFsLCAuYW0tZGltbWVyIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvbW9kYWwvbW9kYWwudnVlPzIyZWYzYWNhXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTtJQUNBLGVBQUE7Q0FDQVwiLFwiZmlsZVwiOlwibW9kYWwudnVlXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjx0ZW1wbGF0ZT5cXG4gICAgXFxuICAgIDxkaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhbS1tb2RhbCBhbS1tb2RhbC1hY3RpdmVcXFwiIDpjbGFzcz1cXFwiY2xhc3NOYW1lXFxcIiB0YWJpbmRleD1cXFwiLTFcXFwiIHYtc2hvdz1cXFwic2hvd1xcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYW0tbW9kYWwtZGlhbG9nXFxcIj5cXG4gICAgICAgICAgICAgICAgPHNsb3QgbmFtZT1cXFwiaGVhZGVyXFxcIj48L3Nsb3Q+XFxuICAgICAgICAgICAgICAgIDxzbG90IG5hbWU9XFxcImJvZHlcXFwiPjwvc2xvdD5cXG4gICAgICAgICAgICAgICAgPHNsb3QgbmFtZT1cXFwiZm9vdGVyXFxcIj48L3Nsb3Q+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImFtLWRpbW1lclxcXCIgdi1iaW5kOmNsYXNzPVxcXCJ7J2FtLWFjdGl2ZSc6IHNob3d9XFxcIiB2LXNob3c9XFxcInNob3dcXFwiIHYtb246Y2xpY2s9XFxcImNsb3NlXFxcIiB0cmFuc2l0aW9uPVxcXCJtb2RhbC1mYWRlXFxcIj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIFxcbjwvdGVtcGxhdGU+XFxuXFxuPHN0eWxlPlxcblxcbi5hbS1tb2RhbCwgLmFtLWRpbW1lciB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG48L3N0eWxlPlxcblxcbjxzY3JpcHQ+XFxuXFxuZXhwb3J0IGRlZmF1bHQge1xcbiAgICBwcm9wczoge1xcbiAgICAgICAgc2hvdzoge1xcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcXG4gICAgICAgIH0sXFxuICAgICAgICBjbG9zZVZpYURpbW1lcjogeyAvLyDmmK/lkKbpgJrov4fngrnlh7vpga7nvanlsYLlhbPpl63mqKHmgIHmoYbvvIzpu5jorqTkuLp0cnVlXFxuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXFxuICAgICAgICB9LFxcbiAgICAgICAgY2xhc3NOYW1lOiB7XFxuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFxcXCJhbS1tb2RhbC1sZ1xcXCJcXG4gICAgICAgIH1cXG4gICAgfSxcXG5cXG4gICAgdHJhbnNpdGlvbnM6IHtcXG4gICAgICAgIFxcXCJtb2RhbC1mYWRlXFxcIjoge1xcbiAgICAgICAgICAgIGJlZm9yZUVudGVyKGVsKSB7fSxcXG4gICAgICAgICAgICBlbnRlciAoZWwpIHt9LFxcbiAgICAgICAgICAgIGFmdGVyRW50ZXIoZWwpIHt9LFxcbiAgICAgICAgICAgIGVudGVyQ2FuY2VsbGVkKGVsKSB7fSxcXG4gICAgICAgICAgICBiZWZvcmVMZWF2ZShlbCkge30sXFxuICAgICAgICAgICAgbGVhdmUoZWwpIHt9LFxcbiAgICAgICAgICAgIGFmdGVyTGVhdmUoZWwpIHt9LFxcbiAgICAgICAgICAgIGxlYXZlQ2FuY2VsbGVkKGVsKSB7fVxcbiAgICAgICAgfVxcbiAgICB9LFxcblxcbiAgICBtZXRob2RzOiB7XFxuICAgICAgICBjbG9zZSgpIHtcXG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZVZpYURpbW1lcikge1xcbiAgICAgICAgICAgICAgICB0aGlzLnNob3cgPSBmYWxzZTtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgIH1cXG59O1xcblxcbjwvc2NyaXB0PlxcblwiXSxcInNvdXJjZVJvb3RcIjpcIndlYnBhY2s6Ly9cIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi9zcmMvbW9kYWwvbW9kYWwudnVlXG4gKiogbW9kdWxlIGlkID0gNTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGxpc3QgPSBbXTtcclxuXHJcblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpc1tpXTtcclxuXHRcdFx0aWYoaXRlbVsyXSkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xyXG5cdH07XHJcblxyXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XHJcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xyXG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcclxuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xyXG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXHJcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XHJcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcclxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcclxuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cclxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcclxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcclxuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcclxuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHJldHVybiBsaXN0O1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDU1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xuXHR9KSxcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XG5cdH0pLFxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2Vcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuXHRcdGlmKG5ld09iaikge1xuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHRpZiAobWVkaWEpIHtcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZGV2dG9vbHMvZG9jcy9qYXZhc2NyaXB0LWRlYnVnZ2luZ1xuXHRcdC8vIHRoaXMgbWFrZXMgc291cmNlIG1hcHMgaW5zaWRlIHN0eWxlIHRhZ3Mgd29yayBwcm9wZXJseSBpbiBDaHJvbWVcblx0XHRjc3MgKz0gJ1xcbi8qIyBzb3VyY2VVUkw9JyArIHNvdXJjZU1hcC5zb3VyY2VzWzBdICsgJyAqLyc7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4gKiogbW9kdWxlIGlkID0gNTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIjx0ZW1wbGF0ZT5cbiAgICBcbiAgICA8ZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW0tbW9kYWwgYW0tbW9kYWwtYWN0aXZlXCIgOmNsYXNzPVwiY2xhc3NOYW1lXCIgdGFiaW5kZXg9XCItMVwiIHYtc2hvdz1cInNob3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbS1tb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgICAgICAgICA8c2xvdCBuYW1lPVwiaGVhZGVyXCI+PC9zbG90PlxuICAgICAgICAgICAgICAgIDxzbG90IG5hbWU9XCJib2R5XCI+PC9zbG90PlxuICAgICAgICAgICAgICAgIDxzbG90IG5hbWU9XCJmb290ZXJcIj48L3Nsb3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFtLWRpbW1lclwiIHYtYmluZDpjbGFzcz1cInsnYW0tYWN0aXZlJzogc2hvd31cIiB2LXNob3c9XCJzaG93XCIgdi1vbjpjbGljaz1cImNsb3NlXCIgdHJhbnNpdGlvbj1cIm1vZGFsLWZhZGVcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBcbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cblxuLmFtLW1vZGFsLCAuYW0tZGltbWVyIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cblxuPC9zdHlsZT5cblxuPHNjcmlwdD5cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHByb3BzOiB7XG4gICAgICAgIHNob3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBjbG9zZVZpYURpbW1lcjogeyAvLyDmmK/lkKbpgJrov4fngrnlh7vpga7nvanlsYLlhbPpl63mqKHmgIHmoYbvvIzpu5jorqTkuLp0cnVlXG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiYW0tbW9kYWwtbGdcIlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRyYW5zaXRpb25zOiB7XG4gICAgICAgIFwibW9kYWwtZmFkZVwiOiB7XG4gICAgICAgICAgICBiZWZvcmVFbnRlcihlbCkge30sXG4gICAgICAgICAgICBlbnRlciAoZWwpIHt9LFxuICAgICAgICAgICAgYWZ0ZXJFbnRlcihlbCkge30sXG4gICAgICAgICAgICBlbnRlckNhbmNlbGxlZChlbCkge30sXG4gICAgICAgICAgICBiZWZvcmVMZWF2ZShlbCkge30sXG4gICAgICAgICAgICBsZWF2ZShlbCkge30sXG4gICAgICAgICAgICBhZnRlckxlYXZlKGVsKSB7fSxcbiAgICAgICAgICAgIGxlYXZlQ2FuY2VsbGVkKGVsKSB7fVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgY2xvc2UoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZVZpYURpbW1lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuPC9zY3JpcHQ+XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBtb2RhbC52dWU/MjJlZjNhY2FcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuXFxuPGRpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYW0tbW9kYWwgYW0tbW9kYWwtYWN0aXZlXFxcIiA6Y2xhc3M9XFxcImNsYXNzTmFtZVxcXCIgdGFiaW5kZXg9XFxcIi0xXFxcIiB2LXNob3c9XFxcInNob3dcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYW0tbW9kYWwtZGlhbG9nXFxcIj5cXG4gICAgICAgICAgICA8c2xvdCBuYW1lPVxcXCJoZWFkZXJcXFwiPjwvc2xvdD5cXG4gICAgICAgICAgICA8c2xvdCBuYW1lPVxcXCJib2R5XFxcIj48L3Nsb3Q+XFxuICAgICAgICAgICAgPHNsb3QgbmFtZT1cXFwiZm9vdGVyXFxcIj48L3Nsb3Q+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcImFtLWRpbW1lclxcXCIgdi1iaW5kOmNsYXNzPVxcXCJ7J2FtLWFjdGl2ZSc6IHNob3d9XFxcIiB2LXNob3c9XFxcInNob3dcXFwiIHYtb246Y2xpY2s9XFxcImNsb3NlXFxcIiB0cmFuc2l0aW9uPVxcXCJtb2RhbC1mYWRlXFxcIj48L2Rpdj5cXG48L2Rpdj5cXG5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtaHRtbC1sb2FkZXI/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL21vZGFsL21vZGFsLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDU4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5fX3Z1ZV9zY3JpcHRfXyA9IHJlcXVpcmUoXCIhIWJhYmVsLWxvYWRlcj9wcmVzZXRzW109ZXMyMDE1JnBsdWdpbnNbXT10cmFuc2Zvcm0tcnVudGltZSZjb21tZW50cz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXNjcmlwdCZpbmRleD0wIS4vYWxlcnQudnVlXCIpXG5pZiAoX192dWVfc2NyaXB0X18gJiZcbiAgICBfX3Z1ZV9zY3JpcHRfXy5fX2VzTW9kdWxlICYmXG4gICAgT2JqZWN0LmtleXMoX192dWVfc2NyaXB0X18pLmxlbmd0aCA+IDEpIHtcbiAgY29uc29sZS53YXJuKFwiW3Z1ZS1sb2FkZXJdIHNyY1xcXFxtb2RhbFxcXFxhbGVydC52dWU6IG5hbWVkIGV4cG9ydHMgaW4gKi52dWUgZmlsZXMgYXJlIGlnbm9yZWQuXCIpfVxuX192dWVfdGVtcGxhdGVfXyA9IHJlcXVpcmUoXCIhIXZ1ZS1odG1sP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vYWxlcnQudnVlXCIpXG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi0yMGQ3Nzk2Zi9hbGVydC52dWVcIlxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoaWQsIG1vZHVsZS5leHBvcnRzKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS51cGRhdGUoaWQsIG1vZHVsZS5leHBvcnRzLCBfX3Z1ZV90ZW1wbGF0ZV9fKVxuICB9XG59KSgpfVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbW9kYWwvYWxlcnQudnVlXG4gKiogbW9kdWxlIGlkID0gNTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIjx0ZW1wbGF0ZT5cblxuPG1vZGFsIDpzaG93LnN5bmM9XCJzaG93XCIgOmNsYXNzLW5hbWU9XCJjbGFzc05hbWVcIiA6Y2xvc2UtdmlhLWRpbW1lcj1cImZhbHNlXCI+XG4gICAgPGRpdiBjbGFzcz1cImFtLW1vZGFsLWhkXCIgc2xvdD1cImhlYWRlclwiIHYtaWY9XCJ0aXRsZSAhPT0gJydcIj57eyBtc2cudGl0bGUgfX08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYW0tbW9kYWwtYmRcIiBzbG90PVwiYm9keVwiPlxuICAgICAgICB7e3sgbXNnLmNvbnRlbnQgfX19XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImFtLW1vZGFsLWZvb3RlclwiIHNsb3Q9XCJmb290ZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJhbS1tb2RhbC1idG5cIiB2LW9uOmNsaWNrPVwib2tcIj7noa7lrpo8L3NwYW4+XG4gICAgPC9kaXY+XG48L21vZGFsPlxuXG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuXG5pbXBvcnQgbW9kYWwgZnJvbSAnLi9tb2RhbC52dWUnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgICBwcm9wczoge1xuICAgICAgICBtc2c6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNob3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHR3b1dheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiYW0tbW9kYWwtbGdcIlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgbW9kYWxcbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgICBvaygpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2FsZXJ0Lm9rJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbjwvc2NyaXB0PlxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogYWxlcnQudnVlPzVhYjE5MTYxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcblxcbjxtb2RhbCA6c2hvdy5zeW5jPVxcXCJzaG93XFxcIiA6Y2xhc3MtbmFtZT1cXFwiY2xhc3NOYW1lXFxcIiA6Y2xvc2UtdmlhLWRpbW1lcj1cXFwiZmFsc2VcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1tb2RhbC1oZFxcXCIgc2xvdD1cXFwiaGVhZGVyXFxcIiB2LWlmPVxcXCJ0aXRsZSAhPT0gJydcXFwiPnt7IG1zZy50aXRsZSB9fTwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1tb2RhbC1iZFxcXCIgc2xvdD1cXFwiYm9keVxcXCI+XFxuICAgICAgICB7e3sgbXNnLmNvbnRlbnQgfX19XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1tb2RhbC1mb290ZXJcXFwiIHNsb3Q9XFxcImZvb3RlclxcXCI+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwiYW0tbW9kYWwtYnRuXFxcIiB2LW9uOmNsaWNrPVxcXCJva1xcXCI+56Gu5a6aPC9zcGFuPlxcbiAgICA8L2Rpdj5cXG48L21vZGFsPlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9zcmMvbW9kYWwvYWxlcnQudnVlXG4gKiogbW9kdWxlIGlkID0gNjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBfX3Z1ZV9zY3JpcHRfXywgX192dWVfdGVtcGxhdGVfX1xudmFyIF9fdnVlX3N0eWxlc19fID0ge31cbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9jb25maXJtLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxcbW9kYWxcXFxcY29uZmlybS52dWU6IG5hbWVkIGV4cG9ydHMgaW4gKi52dWUgZmlsZXMgYXJlIGlnbm9yZWQuXCIpfVxuX192dWVfdGVtcGxhdGVfXyA9IHJlcXVpcmUoXCIhIXZ1ZS1odG1sP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vY29uZmlybS52dWVcIilcbm1vZHVsZS5leHBvcnRzID0gX192dWVfc2NyaXB0X18gfHwge31cbmlmIChtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLmRlZmF1bHRcbnZhciBfX3Z1ZV9vcHRpb25zX18gPSB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwiZnVuY3Rpb25cIiA/IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zIHx8IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zID0ge30pKSA6IG1vZHVsZS5leHBvcnRzXG5pZiAoX192dWVfdGVtcGxhdGVfXykge1xuX192dWVfb3B0aW9uc19fLnRlbXBsYXRlID0gX192dWVfdGVtcGxhdGVfX1xufVxuaWYgKCFfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQpIF9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCA9IHt9XG5PYmplY3Qua2V5cyhfX3Z1ZV9zdHlsZXNfXykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG52YXIgbW9kdWxlID0gX192dWVfc3R5bGVzX19ba2V5XVxuX192dWVfb3B0aW9uc19fLmNvbXB1dGVkW2tleV0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtb2R1bGUgfVxufSlcbmlmIChtb2R1bGUuaG90KSB7KGZ1bmN0aW9uICgpIHsgIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgdmFyIGhvdEFQSSA9IHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIilcbiAgaG90QVBJLmluc3RhbGwocmVxdWlyZShcInZ1ZVwiKSwgZmFsc2UpXG4gIGlmICghaG90QVBJLmNvbXBhdGlibGUpIHJldHVyblxuICB2YXIgaWQgPSBcIl92LTU2MzZkYmRhL2NvbmZpcm0udnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL21vZGFsL2NvbmZpcm0udnVlXG4gKiogbW9kdWxlIGlkID0gNjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIjx0ZW1wbGF0ZT5cblxuPG1vZGFsIDpzaG93LnN5bmM9XCJzaG93XCIgOmNsYXNzLW5hbWU9XCJjbGFzc05hbWVcIiA6Y2xvc2UtdmlhLWRpbW1lcj1cImZhbHNlXCI+XG4gICAgPGRpdiBjbGFzcz1cImFtLW1vZGFsLWhkXCIgc2xvdD1cImhlYWRlclwiIHYtaWY9XCJ0aXRsZSAhPT0gJydcIj57eyBtc2cudGl0bGUgfX08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYW0tbW9kYWwtYmRcIiBzbG90PVwiYm9keVwiPlxuICAgICAgICB7e3sgbXNnLmNvbnRlbnQgfX19XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImFtLW1vZGFsLWZvb3RlclwiIHNsb3Q9XCJmb290ZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJhbS1tb2RhbC1idG5cIiB2LWlmPVwibXNnLmNhbmNlbFRleHQgIT09IGZhbHNlXCIgdi1vbjpjbGljaz1cImNhbmNlbFwiPnt7IG1zZy5jYW5jZWxUZXh0IHx8ICflj5bmtognIH19PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImFtLW1vZGFsLWJ0blwiIHYtb246Y2xpY2s9XCJva1wiPnt7IG1zZy5jb25maXJtVGV4dCB8fCAn56Gu5a6aJyB9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbjwvbW9kYWw+XG5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5cbmltcG9ydCBtb2RhbCBmcm9tICcuL21vZGFsLnZ1ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAgIHByb3BzOiB7XG4gICAgICAgIG1zZzoge1xuICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnJyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICcnLFxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxUZXh0OiAnJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2hvdzoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgdHdvV2F5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogXCJhbS1tb2RhbC1sZ1wiXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICBtb2RhbFxuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICAgIG9rICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2NvbmZpcm0ub2snKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2NvbmZpcm0uY2FuY2VsJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbjwvc2NyaXB0PlxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogY29uZmlybS52dWU/ZDNhZWNkY2NcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuXFxuPG1vZGFsIDpzaG93LnN5bmM9XFxcInNob3dcXFwiIDpjbGFzcy1uYW1lPVxcXCJjbGFzc05hbWVcXFwiIDpjbG9zZS12aWEtZGltbWVyPVxcXCJmYWxzZVxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFtLW1vZGFsLWhkXFxcIiBzbG90PVxcXCJoZWFkZXJcXFwiIHYtaWY9XFxcInRpdGxlICE9PSAnJ1xcXCI+e3sgbXNnLnRpdGxlIH19PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFtLW1vZGFsLWJkXFxcIiBzbG90PVxcXCJib2R5XFxcIj5cXG4gICAgICAgIHt7eyBtc2cuY29udGVudCB9fX1cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFtLW1vZGFsLWZvb3RlclxcXCIgc2xvdD1cXFwiZm9vdGVyXFxcIj5cXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJhbS1tb2RhbC1idG5cXFwiIHYtaWY9XFxcIm1zZy5jYW5jZWxUZXh0ICE9PSBmYWxzZVxcXCIgdi1vbjpjbGljaz1cXFwiY2FuY2VsXFxcIj57eyBtc2cuY2FuY2VsVGV4dCB8fCAn5Y+W5raIJyB9fTwvc3Bhbj5cXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJhbS1tb2RhbC1idG5cXFwiIHYtb246Y2xpY2s9XFxcIm9rXFxcIj57eyBtc2cuY29uZmlybVRleHQgfHwgJ+ehruWumicgfX08L3NwYW4+XFxuICAgIDwvZGl2PlxcbjwvbW9kYWw+XFxuXFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLWh0bWwtbG9hZGVyP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9tb2RhbC9jb25maXJtLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDY0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5fX3Z1ZV9zY3JpcHRfXyA9IHJlcXVpcmUoXCIhIWJhYmVsLWxvYWRlcj9wcmVzZXRzW109ZXMyMDE1JnBsdWdpbnNbXT10cmFuc2Zvcm0tcnVudGltZSZjb21tZW50cz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXNjcmlwdCZpbmRleD0wIS4vZGlhbG9nLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxcbW9kYWxcXFxcZGlhbG9nLnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5fX3Z1ZV90ZW1wbGF0ZV9fID0gcmVxdWlyZShcIiEhdnVlLWh0bWw/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9kaWFsb2cudnVlXCIpXG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi0zN2I2ZWZjNS9kaWFsb2cudnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL21vZGFsL2RpYWxvZy52dWVcbiAqKiBtb2R1bGUgaWQgPSA2NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48bW9kYWwgOnNob3cuc3luYz1cInNob3dcIiA6Y2xhc3MtbmFtZT1cImNsYXNzTmFtZVwiIDpjbG9zZS12aWEtZGltbWVyPVwiZmFsc2VcIj5cbiAgICA8ZGl2IGNsYXNzPVwiYW0tbW9kYWwtaGRcIiBzbG90PVwiaGVhZGVyXCIgdi1pZj1cInRpdGxlICE9PSAnJ1wiPnt7IG1zZy50aXRsZSB9fTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbS1tb2RhbC1iZFwiIHNsb3Q9XCJib2R5XCI+XG4gICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYW0tbW9kYWwtZm9vdGVyXCIgc2xvdD1cImZvb3RlclwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImFtLW1vZGFsLWJ0blwiIHYtaWY9XCJtc2cuY2FuY2VsVGV4dCAhPT0gZmFsc2VcIiB2LW9uOmNsaWNrPVwiY2FuY2VsXCI+e3sgbXNnLmNhbmNlbFRleHQgfHwgJ+WPlua2iCcgfX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYW0tbW9kYWwtYnRuXCIgdi1vbjpjbGljaz1cIm9rXCI+e3sgbXNnLmNvbmZpcm1UZXh0IHx8ICfnoa7lrponIH19PC9zcGFuPlxuICAgIDwvZGl2PlxuPC9tb2RhbD5cblxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuaW1wb3J0IG1vZGFsIGZyb20gJy4vbW9kYWwudnVlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgcHJvcHM6IHtcbiAgICAgICAgbXNnOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1UZXh0OiAnJyxcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsVGV4dDogJydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNob3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHR3b1dheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiYW0tbW9kYWwtbGdcIlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgbW9kYWxcbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgICBvayAoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdkaWFsb2cub2snKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2RpYWxvZy5jYW5jZWwnKTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcblxuPC9zY3JpcHQ+XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBkaWFsb2cudnVlPzdkZDMzOTljXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcblxcbjxtb2RhbCA6c2hvdy5zeW5jPVxcXCJzaG93XFxcIiA6Y2xhc3MtbmFtZT1cXFwiY2xhc3NOYW1lXFxcIiA6Y2xvc2UtdmlhLWRpbW1lcj1cXFwiZmFsc2VcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1tb2RhbC1oZFxcXCIgc2xvdD1cXFwiaGVhZGVyXFxcIiB2LWlmPVxcXCJ0aXRsZSAhPT0gJydcXFwiPnt7IG1zZy50aXRsZSB9fTwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1tb2RhbC1iZFxcXCIgc2xvdD1cXFwiYm9keVxcXCI+XFxuICAgICAgICA8c2xvdD48L3Nsb3Q+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1tb2RhbC1mb290ZXJcXFwiIHNsb3Q9XFxcImZvb3RlclxcXCI+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwiYW0tbW9kYWwtYnRuXFxcIiB2LWlmPVxcXCJtc2cuY2FuY2VsVGV4dCAhPT0gZmFsc2VcXFwiIHYtb246Y2xpY2s9XFxcImNhbmNlbFxcXCI+e3sgbXNnLmNhbmNlbFRleHQgfHwgJ+WPlua2iCcgfX08L3NwYW4+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwiYW0tbW9kYWwtYnRuXFxcIiB2LW9uOmNsaWNrPVxcXCJva1xcXCI+e3sgbXNnLmNvbmZpcm1UZXh0IHx8ICfnoa7lrponIH19PC9zcGFuPlxcbiAgICA8L2Rpdj5cXG48L21vZGFsPlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9zcmMvbW9kYWwvZGlhbG9nLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDY3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5yZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3R5cGVBaGVhZEludGVyZmFjZS52dWVcIilcbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi90eXBlQWhlYWRJbnRlcmZhY2UudnVlXCIpXG5pZiAoX192dWVfc2NyaXB0X18gJiZcbiAgICBfX3Z1ZV9zY3JpcHRfXy5fX2VzTW9kdWxlICYmXG4gICAgT2JqZWN0LmtleXMoX192dWVfc2NyaXB0X18pLmxlbmd0aCA+IDEpIHtcbiAgY29uc29sZS53YXJuKFwiW3Z1ZS1sb2FkZXJdIHNyY1xcXFx0eXBlYWhlYWRcXFxcdHlwZUFoZWFkSW50ZXJmYWNlLnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi1jMTZiMzgxNi90eXBlQWhlYWRJbnRlcmZhY2UudnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3R5cGVhaGVhZC90eXBlQWhlYWRJbnRlcmZhY2UudnVlXG4gKiogbW9kdWxlIGlkID0gNjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi90eXBlQWhlYWRJbnRlcmZhY2UudnVlXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3R5cGVBaGVhZEludGVyZmFjZS52dWVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3R5cGVBaGVhZEludGVyZmFjZS52dWVcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1zdHlsZS1sb2FkZXIhLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZSZpbmRleD0wIS4vc3JjL3R5cGVhaGVhZC90eXBlQWhlYWRJbnRlcmZhY2UudnVlXG4gKiogbW9kdWxlIGlkID0gNjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuXFxuLmhkcC1kcm9wZG93biB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbn1cXG4uaGRwLWRyb3Bkb3duIGlucHV0IHtcXG4gICAgd2lkdGg6IDEwMCU7XFxufVxcbi5oZHAtZHJvcGRvd24gLmFtLWljb24tZncge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHJpZ2h0OiA4cHg7XFxuICAgIHRvcDogNHB4O1xcbn1cXG4uaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBtYXgtaGVpZ2h0OiAyMDBweDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgICB6LWluZGV4OiAxMDAwO1xcbn1cXG4uaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCBsaSB7XFxuICAgIHBhZGRpbmc6IDAgNHB4O1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gICAgbGluZS1oZWlnaHQ6IDIwcHg7XFxufVxcbi5oZHAtZHJvcGRvd24tdHlwZWFoZWFkIC5hY3RpdmUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xcbn1cXG4uaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCBsaTpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkZGQ7ICAgIFxcbn1cXG4uaGRwLWRyb3Bkb3duLXRleHQge1xcbiAgICBjb2xvcjogIzc1NzU3NTtcXG4gICBcXG59XFxuLmhkcC1kcm9wZG93bi1kZXNjIHtcXG4gICAgZmxvYXQ6IHJpZ2h0O1xcbiAgICBmb250LXNpemU6IDEycHg7XFxufVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvdHlwZWFoZWFkL3R5cGVBaGVhZEludGVyZmFjZS52dWU/ZTQzYmU1M2VcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjs7QUFFQTtJQUNBLG1CQUFBO0lBQ0Esc0JBQUE7Q0FDQTtBQUNBO0lBQ0EsWUFBQTtDQUNBO0FBQ0E7SUFDQSxtQkFBQTtJQUNBLFdBQUE7SUFDQSxTQUFBO0NBQ0E7QUFDQTtJQUNBLG1CQUFBO0lBQ0EsZUFBQTtJQUNBLFlBQUE7SUFDQSxrQkFBQTtJQUNBLFdBQUE7SUFDQSxVQUFBO0lBQ0EsaUJBQUE7SUFDQSxpQkFBQTtJQUNBLHVCQUFBO0lBQ0EsY0FBQTtDQUNBO0FBQ0E7SUFDQSxlQUFBO0lBQ0EsaUJBQUE7SUFDQSx3QkFBQTtJQUNBLG9CQUFBO0lBQ0Esa0JBQUE7Q0FDQTtBQUNBO0lBQ0EsdUJBQUE7Q0FDQTtBQUNBO0lBQ0EsdUJBQUE7Q0FDQTtBQUNBO0lBQ0EsZUFBQTs7Q0FFQTtBQUNBO0lBQ0EsYUFBQTtJQUNBLGdCQUFBO0NBQ0FcIixcImZpbGVcIjpcInR5cGVBaGVhZEludGVyZmFjZS52dWVcIixcInNvdXJjZXNDb250ZW50XCI6W1wiPHN0eWxlPlxcclxcblxcclxcbiAgICAuaGRwLWRyb3Bkb3duIHtcXHJcXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gICAgfVxcclxcbiAgICAuaGRwLWRyb3Bkb3duIGlucHV0IHtcXHJcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICB9XFxyXFxuICAgIC5oZHAtZHJvcGRvd24gLmFtLWljb24tZncge1xcclxcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgcmlnaHQ6IDhweDtcXHJcXG4gICAgICAgIHRvcDogNHB4O1xcclxcbiAgICB9XFxyXFxuICAgIC5oZHAtZHJvcGRvd24tdHlwZWFoZWFkIHtcXHJcXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICAgICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICBtYXgtaGVpZ2h0OiAyMDBweDtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcXHJcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxyXFxuICAgICAgICB6LWluZGV4OiAxMDAwO1xcclxcbiAgICB9XFxyXFxuICAgIC5oZHAtZHJvcGRvd24tdHlwZWFoZWFkIGxpIHtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDAgNHB4O1xcclxcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcclxcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXHJcXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xcclxcbiAgICB9XFxyXFxuICAgIC5oZHAtZHJvcGRvd24tdHlwZWFoZWFkIC5hY3RpdmUge1xcclxcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcXHJcXG4gICAgfVxcclxcbiAgICAuaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCBsaTpob3ZlciB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkOyAgICBcXHJcXG4gICAgfVxcclxcbiAgICAuaGRwLWRyb3Bkb3duLXRleHQge1xcclxcbiAgICAgICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgICAgIFxcclxcbiAgICB9XFxyXFxuICAgIC5oZHAtZHJvcGRvd24tZGVzYyB7XFxyXFxuICAgICAgICBmbG9hdDogcmlnaHQ7XFxyXFxuICAgICAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgIH1cXHJcXG48L3N0eWxlPlxcclxcblxcclxcbjxzY3JpcHQ+XFxyXFxuICAgIGV4cG9ydCBkZWZhdWx0IHtcXHJcXG4gICAgICAgIGRhdGEgKCkge1xcclxcbiAgICAgICAgICAgIHJldHVybiB7XFxyXFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXSxcXHJcXG4gICAgICAgICAgICAgICAgY3VycmVudDogLTEsXFxyXFxuICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfSxcXHJcXG5cXHJcXG4gICAgICAgIGNvbXB1dGVkOiB7XFxyXFxuICAgICAgICAgICAgaGFzSXRlbXMgKCkge1xcclxcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPiAwXFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfSxcXHJcXG5cXHJcXG4gICAgICAgIHJlYWR5ICgpIHtcXHJcXG5cXHJcXG4gICAgICAgIH0sXFxyXFxuXFxyXFxuICAgICAgICBtZXRob2RzOiB7XFxyXFxuICAgICAgICAgICAgdXBkYXRlICgpIHtcXHJcXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0ICYmIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xcclxcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdEl0ZW0oKTtcXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcXHJcXG4gICAgICAgICAgICB9LFxcclxcblxcclxcbiAgICAgICAgICAgIHJlc2V0ICgpIHtcXHJcXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdXFxyXFxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXFxyXFxuICAgICAgICAgICAgfSxcXHJcXG5cXHJcXG4gICAgICAgICAgICBzZXRBY3RpdmUgKGluZGV4KSB7XFxyXFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGluZGV4XFxyXFxuICAgICAgICAgICAgfSxcXHJcXG5cXHJcXG4gICAgICAgICAgICBhY3RpdmVDbGFzcyAoaW5kZXgpIHtcXHJcXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdGhpcy5jdXJyZW50ID09PSBpbmRleFxcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfSxcXHJcXG5cXHJcXG4gICAgICAgICAgICAvKipcXHJcXG4gICAgICAgICAgICAgKiDop6blj5HpgInkuK1cXHJcXG4gICAgICAgICAgICAgKi9cXHJcXG4gICAgICAgICAgICBoaXQgKCkge1xcclxcbiAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuaW5wdXREYXRhW3RoaXMuY29uZmlnLnRleHROYW1lXTtcXHJcXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudCAhPT0gLTEgJiYgdGhpcy5pdGVtc1t0aGlzLmN1cnJlbnRdKSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICAvLyDmib7liLDliJfooajkuK3nmoTlgLzvvIzpgInkuK3liJfooajpoblcXHJcXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25IaXQodGhpcy5pdGVtc1t0aGlzLmN1cnJlbnRdKVxcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfSxcXHJcXG5cXHJcXG4gICAgICAgICAgICB1cCAoKSB7XFxyXFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQgPiAwKSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQtLVxcclxcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudCA9PT0gLTEpIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMVxcclxcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xcclxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gLTFcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH0sXFxyXFxuXFxyXFxuICAgICAgICAgICAgZG93biAoKSB7XFxyXFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQgPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCsrXFxyXFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSAtMVxcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfSxcXHJcXG5cXHJcXG4gICAgICAgICAgICBvbkhpdCAoaXRlbSkge1xcclxcbiAgICAgICAgICAgICAgICAvLyDpgInkuK3mn5DkuKrpoblcXHJcXG4gICAgICAgICAgICB9LFxcclxcblxcclxcbiAgICAgICAgICAgIGxpc3RJdGVtICgpIHtcXHJcXG4gICAgICAgICAgICAgICAgLy8g5YiX5Ye65LiL5ouJ5YiX6KGoXFxyXFxuXFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxuXFxyXFxuPC9zY3JpcHQ+XCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3NyYy90eXBlYWhlYWQvdHlwZUFoZWFkSW50ZXJmYWNlLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDcwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCI8c3R5bGU+XHJcblxyXG4gICAgLmhkcC1kcm9wZG93biB7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIH1cclxuICAgIC5oZHAtZHJvcGRvd24gaW5wdXQge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgfVxyXG4gICAgLmhkcC1kcm9wZG93biAuYW0taWNvbi1mdyB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHJpZ2h0OiA4cHg7XHJcbiAgICAgICAgdG9wOiA0cHg7XHJcbiAgICB9XHJcbiAgICAuaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIG1heC1oZWlnaHQ6IDIwMHB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xyXG4gICAgICAgIHotaW5kZXg6IDEwMDA7XHJcbiAgICB9XHJcbiAgICAuaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCBsaSB7XHJcbiAgICAgICAgcGFkZGluZzogMCA0cHg7XHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xyXG4gICAgfVxyXG4gICAgLmhkcC1kcm9wZG93bi10eXBlYWhlYWQgLmFjdGl2ZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcclxuICAgIH1cclxuICAgIC5oZHAtZHJvcGRvd24tdHlwZWFoZWFkIGxpOmhvdmVyIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkOyAgICBcclxuICAgIH1cclxuICAgIC5oZHAtZHJvcGRvd24tdGV4dCB7XHJcbiAgICAgICAgY29sb3I6ICM3NTc1NzU7XHJcbiAgICAgICBcclxuICAgIH1cclxuICAgIC5oZHAtZHJvcGRvd24tZGVzYyB7XHJcbiAgICAgICAgZmxvYXQ6IHJpZ2h0O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIH1cclxuPC9zdHlsZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAgICAgZGF0YSAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtczogW10sXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiAtMSxcclxuICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjb21wdXRlZDoge1xyXG4gICAgICAgICAgICBoYXNJdGVtcyAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZWFkeSAoKSB7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAgICAgdXBkYXRlICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dCAmJiBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RJdGVtKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHJlc2V0ICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldEFjdGl2ZSAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGluZGV4XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhY3RpdmVDbGFzcyAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiB0aGlzLmN1cnJlbnQgPT09IGluZGV4XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog6Kem5Y+R6YCJ5LitXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBoaXQgKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLmlucHV0RGF0YVt0aGlzLmNvbmZpZy50ZXh0TmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50ICE9PSAtMSAmJiB0aGlzLml0ZW1zW3RoaXMuY3VycmVudF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmib7liLDliJfooajkuK3nmoTlgLzvvIzpgInkuK3liJfooajpoblcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uSGl0KHRoaXMuaXRlbXNbdGhpcy5jdXJyZW50XSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHVwICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LS1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSAtMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZG93biAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50IDwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50KytcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gLTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG9uSGl0IChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDpgInkuK3mn5DkuKrpoblcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGxpc3RJdGVtICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIOWIl+WHuuS4i+aLieWIl+ihqFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbjwvc2NyaXB0PlxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHR5cGVBaGVhZEludGVyZmFjZS52dWU/ZTQzYmU1M2VcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5fX3Z1ZV9zY3JpcHRfXyA9IHJlcXVpcmUoXCIhIWJhYmVsLWxvYWRlcj9wcmVzZXRzW109ZXMyMDE1JnBsdWdpbnNbXT10cmFuc2Zvcm0tcnVudGltZSZjb21tZW50cz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXNjcmlwdCZpbmRleD0wIS4vdHlwZUFoZWFkX3RleHQudnVlXCIpXG5pZiAoX192dWVfc2NyaXB0X18gJiZcbiAgICBfX3Z1ZV9zY3JpcHRfXy5fX2VzTW9kdWxlICYmXG4gICAgT2JqZWN0LmtleXMoX192dWVfc2NyaXB0X18pLmxlbmd0aCA+IDEpIHtcbiAgY29uc29sZS53YXJuKFwiW3Z1ZS1sb2FkZXJdIHNyY1xcXFx0eXBlYWhlYWRcXFxcdHlwZUFoZWFkX3RleHQudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3R5cGVBaGVhZF90ZXh0LnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtMTllZjI1NjgvdHlwZUFoZWFkX3RleHQudnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3R5cGVhaGVhZC90eXBlQWhlYWRfdGV4dC52dWVcbiAqKiBtb2R1bGUgaWQgPSA3MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxyXG4gICAgPGRpdiBjbGFzcz1cImhkcC1kcm9wZG93blwiPlxyXG4gICAgICAgIDwhLS0gb3B0aW9uYWwgaW5kaWNhdG9ycyAtLT5cclxuICAgICAgICA8aSBjbGFzcz1cImFtLWljb24tZncgYW0taWNvbi1zcGlubmVyIGFtLWljb24tcHVsc2VcIiB2LWlmPVwibG9hZGluZ1wiPjwvaT5cclxuICAgICAgICA8IS0tPGIgY2xhc3M9XCJmYSBmYS1jYXJldC1kb3duXCI+PC9iPi0tPlxyXG4gXHJcbiAgICAgICAgPCEtLSB0aGUgaW5wdXQgZmllbGQgLS0+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwie3tjb25maWcucGxhY2Vob2xkZXJ9fVwiXHJcbiAgICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcclxuICAgICAgICAgICAgICAgICB2LW1vZGVsPVwiaW5wdXREYXRhXCJcclxuICAgICAgICAgICAgICAgICBAa2V5ZG93bi5kb3duPVwiZG93blwiXHJcbiAgICAgICAgICAgICAgICAgQGtleWRvd24udXA9XCJ1cFwiXHJcbiAgICAgICAgICAgICAgICAgQGJsdXI9XCJyZXNldFwiXHJcbiAgICAgICAgICAgICAgICAgQGtleWRvd24uZW50ZXI9XCJoaXRcIlxyXG4gICAgICAgICAgICAgICAgIEBpbnB1dD1cInVwZGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgQGtleWRvd24uZGVsZXRlPVwiYmFja3NwYWNlXCJcclxuICAgICAgICAgICAgICAgICBAY2xpY2s9XCJsaXN0QWxsXCIvPlxyXG4gXHJcbiAgICAgICAgPCEtLSB0aGUgbGlzdCAtLT5cclxuICAgICAgICA8dWwgdi1zaG93PVwiaGFzSXRlbXNcIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgaGRwLWRyb3Bkb3duLXR5cGVhaGVhZFwiPlxyXG4gICAgICAgICAgICA8bGkgdi1mb3I9XCJpdGVtIGluIGl0ZW1zXCIgOmNsYXNzPVwiYWN0aXZlQ2xhc3MoJGluZGV4KVwiIEBtb3VzZWRvd249XCJoaXRcIiBAbW91c2Vtb3ZlPVwic2V0QWN0aXZlKCRpbmRleClcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHYtdGV4dD1cIml0ZW1cIiBjbGFzcz1cImhkcC1kcm9wZG93bi10ZXh0XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuIFxyXG5cclxuPHNjcmlwdD5cclxuICAgIGltcG9ydCBUeXBlQWhlYWQgZnJvbSAnLi90eXBlQWhlYWRJbnRlcmZhY2UudnVlJztcclxuXHJcbiAgICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAgICAgZXh0ZW5kczogVHlwZUFoZWFkLFxyXG5cclxuICAgICAgICBwcm9wczp7XHJcbiAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdCAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgbnVtYmVyIG9mIGl0ZW1zIHdoaWNoIGlzIHNob3duIGF0IHRoZSBsaXN0IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAob3B0aW9uYWwpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdDogMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeJueauiuaYvuekuuS4i+aLieWIl+ihqOaWueazlVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0RnVuOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOayoeaciemAieS4reWIl+ihqOWAvOaYr+WQpumAieS4reW9k+WJjei+k+WFpSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWx3YXlzSGl0OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaW5wdXREYXRhOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnJyxcclxuICAgICAgICAgICAgICAgIHR3b1dheTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkcm9wZG93bkRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdCAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjb21wdXRlZDoge1xyXG4gICAgICAgICAgICBoYXNJdGVtcyAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZWFkeSAoKSB7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAgICAgbGlzdEl0ZW0gKCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcubGlzdEZ1bikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmxpc3RGdW4uY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuaW5wdXREYXRhO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG1heCA9IHRoaXMuZHJvcGRvd25EYXRhLmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJvcGRvd25EYXRhW2ldLmluZGV4T2YodGV4dCkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmRyb3Bkb3duRGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcubGltaXQgJiYgbGVuZ3RoID49IHRoaXMuY29uZmlnLmxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gLTE7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGxpc3RBbGwgKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxpc3RGdW4pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5saXN0RnVuLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5kcm9wZG93bkRhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog6Kem5Y+R6YCJ5LitXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBoaXQgKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLmlucHV0RGF0YTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQgIT09IC0xICYmIHRoaXMuaXRlbXNbdGhpcy5jdXJyZW50XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaJvuWIsOWIl+ihqOS4reeahOWAvO+8jOmAieS4reWIl+ihqOmhuVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25IaXQodGhpcy5pdGVtc1t0aGlzLmN1cnJlbnRdKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5hbHdheXNIaXQgJiYgU3RyaW5nKHRleHQpLnRyaW0oKSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uSGl0KHRleHQpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXREYXRhID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgb25IaXQgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXREYXRhID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3R5cGVhaGVhZC5oaXQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBiYWNrc3BhY2UgKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXREYXRhID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3R5cGVhaGVhZC5iYWNrc3BhY2UnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbjwvc2NyaXB0PlxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHR5cGVBaGVhZF90ZXh0LnZ1ZT85OTA1NjkyMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG48ZGl2IGNsYXNzPVxcXCJoZHAtZHJvcGRvd25cXFwiPlxcbiAgICA8IS0tIG9wdGlvbmFsIGluZGljYXRvcnMgLS0+XFxuICAgIDxpIGNsYXNzPVxcXCJhbS1pY29uLWZ3IGFtLWljb24tc3Bpbm5lciBhbS1pY29uLXB1bHNlXFxcIiB2LWlmPVxcXCJsb2FkaW5nXFxcIj48L2k+XFxuICAgIDwhLS08YiBjbGFzcz1cXFwiZmEgZmEtY2FyZXQtZG93blxcXCI+PC9iPi0tPlxcblxcbiAgICA8IS0tIHRoZSBpbnB1dCBmaWVsZCAtLT5cXG4gICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiXFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcInt7Y29uZmlnLnBsYWNlaG9sZGVyfX1cXFwiXFxuICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cXFwib2ZmXFxcIlxcbiAgICAgICAgICAgICB2LW1vZGVsPVxcXCJpbnB1dERhdGFcXFwiXFxuICAgICAgICAgICAgIEBrZXlkb3duLmRvd249XFxcImRvd25cXFwiXFxuICAgICAgICAgICAgIEBrZXlkb3duLnVwPVxcXCJ1cFxcXCJcXG4gICAgICAgICAgICAgQGJsdXI9XFxcInJlc2V0XFxcIlxcbiAgICAgICAgICAgICBAa2V5ZG93bi5lbnRlcj1cXFwiaGl0XFxcIlxcbiAgICAgICAgICAgICBAaW5wdXQ9XFxcInVwZGF0ZVxcXCJcXG4gICAgICAgICAgICAgQGtleWRvd24uZGVsZXRlPVxcXCJiYWNrc3BhY2VcXFwiXFxuICAgICAgICAgICAgIEBjbGljaz1cXFwibGlzdEFsbFxcXCIvPlxcblxcbiAgICA8IS0tIHRoZSBsaXN0IC0tPlxcbiAgICA8dWwgdi1zaG93PVxcXCJoYXNJdGVtc1xcXCIgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnUgaGRwLWRyb3Bkb3duLXR5cGVhaGVhZFxcXCI+XFxuICAgICAgICA8bGkgdi1mb3I9XFxcIml0ZW0gaW4gaXRlbXNcXFwiIDpjbGFzcz1cXFwiYWN0aXZlQ2xhc3MoJGluZGV4KVxcXCIgQG1vdXNlZG93bj1cXFwiaGl0XFxcIiBAbW91c2Vtb3ZlPVxcXCJzZXRBY3RpdmUoJGluZGV4KVxcXCI+XFxuICAgICAgICAgICAgPHNwYW4gdi10ZXh0PVxcXCJpdGVtXFxcIiBjbGFzcz1cXFwiaGRwLWRyb3Bkb3duLXRleHRcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDwvbGk+XFxuICAgIDwvdWw+XFxuPC9kaXY+XFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLWh0bWwtbG9hZGVyP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy90eXBlYWhlYWQvdHlwZUFoZWFkX3RleHQudnVlXG4gKiogbW9kdWxlIGlkID0gNzRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBfX3Z1ZV9zY3JpcHRfXywgX192dWVfdGVtcGxhdGVfX1xudmFyIF9fdnVlX3N0eWxlc19fID0ge31cbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi90eXBlQWhlYWRfb2JqZWN0LnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxcdHlwZWFoZWFkXFxcXHR5cGVBaGVhZF9vYmplY3QudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3R5cGVBaGVhZF9vYmplY3QudnVlXCIpXG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi02YWU1YWRiYS90eXBlQWhlYWRfb2JqZWN0LnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy90eXBlYWhlYWQvdHlwZUFoZWFkX29iamVjdC52dWVcbiAqKiBtb2R1bGUgaWQgPSA3NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxyXG4gICAgPGRpdiBjbGFzcz1cImhkcC1kcm9wZG93blwiPlxyXG4gICAgICAgIDwhLS0gb3B0aW9uYWwgaW5kaWNhdG9ycyAtLT5cclxuICAgICAgICA8aSBjbGFzcz1cImFtLWljb24tZncgYW0taWNvbi1zcGlubmVyIGFtLWljb24tcHVsc2VcIiB2LWlmPVwibG9hZGluZ1wiPjwvaT5cclxuIFxyXG4gICAgICAgIDwhLS0gdGhlIGlucHV0IGZpZWxkIC0tPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInt7Y29uZmlnLnBsYWNlaG9sZGVyfX1cIlxyXG4gICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcclxuICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJpbnB1dERhdGFbY29uZmlnLnRleHROYW1lXVwiXHJcbiAgICAgICAgICAgICAgICBAYmx1cj1cImJsdXJcIlxyXG4gICAgICAgICAgICAgICAgQGtleWRvd24uZG93bj1cImRvd25cIlxyXG4gICAgICAgICAgICAgICAgQGtleWRvd24udXA9XCJ1cFwiXHJcbiAgICAgICAgICAgICAgICBAa2V5ZG93bi5lbnRlci5wcmV2ZW50PVwiaGl0XCJcclxuICAgICAgICAgICAgICAgIEBpbnB1dD1cInVwZGF0ZVwiXHJcbiAgICAgICAgICAgICAgICBAY2xpY2s9XCJsaXN0QWxsXCIvPlxyXG4gXHJcbiAgICAgICAgPCEtLSB0aGUgbGlzdCAtLT5cclxuICAgICAgICA8dWwgdi1zaG93PVwiaGFzSXRlbXNcIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgaGRwLWRyb3Bkb3duLXR5cGVhaGVhZFwiPlxyXG4gICAgICAgICAgICA8bGkgdi1mb3I9XCJpdGVtIGluIGl0ZW1zXCIgOmNsYXNzPVwiYWN0aXZlQ2xhc3MoJGluZGV4KVwiIEBtb3VzZWRvd249XCJoaXRcIiBAbW91c2Vtb3ZlPVwic2V0QWN0aXZlKCRpbmRleClcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHYtdGV4dD1cIml0ZW0udGV4dFwiIGNsYXNzPVwiaGRwLWRyb3Bkb3duLXRleHRcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwiaXRlbS5kZXNjXCIgY2xhc3M9XCJoZHAtZHJvcGRvd24tZGVzY1wiPnt7IGl0ZW0uZGVzYyB9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcbiBcclxuXHJcbjxzY3JpcHQ+XHJcbiAgICAgICAgaW1wb3J0IFR5cGVBaGVhZCBmcm9tICcuL3R5cGVBaGVhZEludGVyZmFjZS52dWUnO1xyXG5cclxuICAgICAgICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAgICAgICAgIGV4dGVuZHM6IFR5cGVBaGVhZCxcclxuXHJcbiAgICAgICAgICAgIHByb3BzOntcclxuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0ICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnJyxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW1pdCB0aGUgbnVtYmVyIG9mIGl0ZW1zIHdoaWNoIGlzIHNob3duIGF0IHRoZSBsaXN0IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gKG9wdGlvbmFsKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiAyMCxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDkvKDlhaVpbnB1dOeahOWAvOWxnuaAp+WQjVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dE5hbWU6ICd0ZXh0JyxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDkvKDlhaVpbnB1dOeahGlk5bGe5oCn5ZCNXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZE5hbWU6ICdpZCcsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g54m55q6K5pi+56S65LiL5ouJ5YiX6KGo5pa55rOVXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0RnVuOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29lcmNlIChjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25maWcudGV4dE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy50ZXh0TmFtZSA9ICd0ZXh0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZpZy5pZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5pZE5hbWUgPSAnaWQnOyAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGlucHV0RGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0ICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gZHJvcGRvd25EYXRh5pWw57uE5YWD57Sg5b+F6aG75pyJaWTkuI50ZXh05bGe5oCnXHJcbiAgICAgICAgICAgICAgICBkcm9wZG93bkRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0ICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbWV0aG9kczoge1xyXG5cclxuICAgICAgICAgICAgICAgIG9uSGl0IChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dERhdGFbdGhpcy5jb25maWcuaWROYW1lXSA9IGl0ZW0uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dERhdGFbdGhpcy5jb25maWcudGV4dE5hbWVdID0gaXRlbS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCd0eXBlYWhlYWQuaGl0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaXRlbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGxpc3RBbGwgKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5saXN0RnVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmxpc3RGdW4uY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLmRyb3Bkb3duRGF0YTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdEl0ZW0gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcubGlzdEZ1bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5saXN0RnVuLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLmlucHV0RGF0YVt0aGlzLmNvbmZpZy50ZXh0TmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gdGhpcy5kcm9wZG93bkRhdGEubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJvcGRvd25EYXRhW2ldLnRleHQuaW5kZXhPZih0ZXh0KSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmRyb3Bkb3duRGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcubGltaXQgJiYgbGVuZ3RoID49IHRoaXMuY29uZmlnLmxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGJsdXIgKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0RGF0YVt0aGlzLmNvbmZpZy50ZXh0TmFtZV0gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXREYXRhW3RoaXMuY29uZmlnLmlkTmFtZV0gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGl0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuPC9zY3JpcHQ+IFxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB0eXBlQWhlYWRfb2JqZWN0LnZ1ZT9iMDliNmYzOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG48ZGl2IGNsYXNzPVxcXCJoZHAtZHJvcGRvd25cXFwiPlxcbiAgICA8IS0tIG9wdGlvbmFsIGluZGljYXRvcnMgLS0+XFxuICAgIDxpIGNsYXNzPVxcXCJhbS1pY29uLWZ3IGFtLWljb24tc3Bpbm5lciBhbS1pY29uLXB1bHNlXFxcIiB2LWlmPVxcXCJsb2FkaW5nXFxcIj48L2k+XFxuXFxuICAgIDwhLS0gdGhlIGlucHV0IGZpZWxkIC0tPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCJcXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwie3tjb25maWcucGxhY2Vob2xkZXJ9fVxcXCJcXG4gICAgICAgICAgICBhdXRvY29tcGxldGU9XFxcIm9mZlxcXCJcXG4gICAgICAgICAgICB2LW1vZGVsPVxcXCJpbnB1dERhdGFbY29uZmlnLnRleHROYW1lXVxcXCJcXG4gICAgICAgICAgICBAYmx1cj1cXFwiYmx1clxcXCJcXG4gICAgICAgICAgICBAa2V5ZG93bi5kb3duPVxcXCJkb3duXFxcIlxcbiAgICAgICAgICAgIEBrZXlkb3duLnVwPVxcXCJ1cFxcXCJcXG4gICAgICAgICAgICBAa2V5ZG93bi5lbnRlci5wcmV2ZW50PVxcXCJoaXRcXFwiXFxuICAgICAgICAgICAgQGlucHV0PVxcXCJ1cGRhdGVcXFwiXFxuICAgICAgICAgICAgQGNsaWNrPVxcXCJsaXN0QWxsXFxcIi8+XFxuXFxuICAgIDwhLS0gdGhlIGxpc3QgLS0+XFxuICAgIDx1bCB2LXNob3c9XFxcImhhc0l0ZW1zXFxcIiBjbGFzcz1cXFwiZHJvcGRvd24tbWVudSBoZHAtZHJvcGRvd24tdHlwZWFoZWFkXFxcIj5cXG4gICAgICAgIDxsaSB2LWZvcj1cXFwiaXRlbSBpbiBpdGVtc1xcXCIgOmNsYXNzPVxcXCJhY3RpdmVDbGFzcygkaW5kZXgpXFxcIiBAbW91c2Vkb3duPVxcXCJoaXRcXFwiIEBtb3VzZW1vdmU9XFxcInNldEFjdGl2ZSgkaW5kZXgpXFxcIj5cXG4gICAgICAgICAgICA8c3BhbiB2LXRleHQ9XFxcIml0ZW0udGV4dFxcXCIgY2xhc3M9XFxcImhkcC1kcm9wZG93bi10ZXh0XFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gdi1pZj1cXFwiaXRlbS5kZXNjXFxcIiBjbGFzcz1cXFwiaGRwLWRyb3Bkb3duLWRlc2NcXFwiPnt7IGl0ZW0uZGVzYyB9fTwvc3Bhbj5cXG4gICAgICAgIDwvbGk+XFxuICAgIDwvdWw+XFxuPC9kaXY+XFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLWh0bWwtbG9hZGVyP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy90eXBlYWhlYWQvdHlwZUFoZWFkX29iamVjdC52dWVcbiAqKiBtb2R1bGUgaWQgPSA3N1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxucmVxdWlyZShcIiEhdnVlLXN0eWxlLWxvYWRlciFjc3MtbG9hZGVyP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi90YWdpbnB1dC52dWVcIilcbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi90YWdpbnB1dC52dWVcIilcbmlmIChfX3Z1ZV9zY3JpcHRfXyAmJlxuICAgIF9fdnVlX3NjcmlwdF9fLl9fZXNNb2R1bGUgJiZcbiAgICBPYmplY3Qua2V5cyhfX3Z1ZV9zY3JpcHRfXykubGVuZ3RoID4gMSkge1xuICBjb25zb2xlLndhcm4oXCJbdnVlLWxvYWRlcl0gc3JjXFxcXHRhZ2lucHV0XFxcXHRhZ2lucHV0LnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5fX3Z1ZV90ZW1wbGF0ZV9fID0gcmVxdWlyZShcIiEhdnVlLWh0bWw/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi90YWdpbnB1dC52dWVcIilcbm1vZHVsZS5leHBvcnRzID0gX192dWVfc2NyaXB0X18gfHwge31cbmlmIChtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLmRlZmF1bHRcbnZhciBfX3Z1ZV9vcHRpb25zX18gPSB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwiZnVuY3Rpb25cIiA/IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zIHx8IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zID0ge30pKSA6IG1vZHVsZS5leHBvcnRzXG5pZiAoX192dWVfdGVtcGxhdGVfXykge1xuX192dWVfb3B0aW9uc19fLnRlbXBsYXRlID0gX192dWVfdGVtcGxhdGVfX1xufVxuaWYgKCFfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQpIF9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCA9IHt9XG5PYmplY3Qua2V5cyhfX3Z1ZV9zdHlsZXNfXykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG52YXIgbW9kdWxlID0gX192dWVfc3R5bGVzX19ba2V5XVxuX192dWVfb3B0aW9uc19fLmNvbXB1dGVkW2tleV0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtb2R1bGUgfVxufSlcbmlmIChtb2R1bGUuaG90KSB7KGZ1bmN0aW9uICgpIHsgIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgdmFyIGhvdEFQSSA9IHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIilcbiAgaG90QVBJLmluc3RhbGwocmVxdWlyZShcInZ1ZVwiKSwgZmFsc2UpXG4gIGlmICghaG90QVBJLmNvbXBhdGlibGUpIHJldHVyblxuICB2YXIgaWQgPSBcIl92LTIyYjE2NTQ0L3RhZ2lucHV0LnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy90YWdpbnB1dC90YWdpbnB1dC52dWVcbiAqKiBtb2R1bGUgaWQgPSA3OFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3RhZ2lucHV0LnZ1ZVwiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi90YWdpbnB1dC52dWVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3RhZ2lucHV0LnZ1ZVwiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLXN0eWxlLWxvYWRlciEuL34vY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi9zcmMvdGFnaW5wdXQvdGFnaW5wdXQudnVlXG4gKiogbW9kdWxlIGlkID0gNzlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuLnRhZ0lucHV0LWNvbnRhaW5lciB7XFxuICAgIGJvcmRlcjoxcHggI2NjYyBzb2xpZDtcXG4gICAgcGFkZGluZzo0cHg7XFxuICAgIGN1cnNvcjp0ZXh0O1xcbiAgICBmb250LXNpemU6MTNweDtcXG4gICAgd2lkdGg6MTAwJTtcXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXFxuLnRhZ0lucHV0LWNvbnRhaW5lciBpbnB1dCB7XFxuICAgIGZvbnQtc2l6ZToxM3B4O1xcbiAgICBjbGVhcjpib3RoO1xcbiAgICB3aWR0aDoyMDBweDtcXG4gICAgaGVpZ2h0OjMwcHg7XFxuICAgIGJvcmRlcjowO1xcbiAgICBtYXJnaW4tYm90dG9tOjFweDtcXG59XFxuXFxuLnRhZ0lucHV0LWNvbnRhaW5lciAuY2xvc2UgeyAgICAgICAgXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgZm9udC1zaXplOiAxNnB4O1xcbiAgICBwYWRkaW5nOiAwIDJweCAwIDRweDtcXG59XFxuXFxubGkudGFnSW5wdXQtZW1haWwge1xcbiAgICBmbG9hdDpsZWZ0O1xcbiAgICBtYXJnaW4tcmlnaHQ6MnB4O1xcbiAgICBtYXJnaW4tYm90dG9tOjFweDtcXG4gICAgYm9yZGVyOjFweCAjQkJEOEZCIHNvbGlkO1xcbiAgICBwYWRkaW5nOjJweDtcXG4gICAgYmFja2dyb3VuZDojRjNGN0ZEO1xcbn1cXG5cXG4udGFnSW5wdXQtY2xvc2Uge1xcbiAgICB3aWR0aDoxNnB4O1xcbiAgICBoZWlnaHQ6MTZweDtcXG4gICAgZGlzcGxheTpibG9jaztcXG4gICAgZmxvYXQ6cmlnaHQ7XFxuICAgIG1hcmdpbjowIDNweDtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4udGFnSW5wdXQtY29udGFpbmVyIC5vcm9jaGktZHJvcGRvd24ge1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgIHdpZHRoOiBhdXRvO1xcbn1cXG5cXG4udGFnSW5wdXQtY29udGFpbmVyIC50YWd7XFxuICAgIHBhZGRpbmc6IDRweCA0cHggNHB4IDZweDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzBlOTBkMjtcXG4gICAgY29sb3I6ICNmZmY7XFxuICAgIG1hcmdpbi1yaWdodDogNHB4O1xcbn1cXG5cXG4udGFnSW5wdXQtY29udGFpbmVyIC5vcm9jaGktZHJvcGRvd24tdHlwZWFoZWFkIHtcXG4gICAgbGVmdDogLTVweDtcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi8uL3NyYy90YWdpbnB1dC90YWdpbnB1dC52dWU/NTU4ZGY0NWNcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBO0lBQ0Esc0JBQUE7SUFDQSxZQUFBO0lBQ0EsWUFBQTtJQUNBLGVBQUE7SUFDQSxXQUFBO0lBQ0EsaUJBQUE7Q0FDQTs7QUFFQTtJQUNBLGVBQUE7SUFDQSxXQUFBO0lBQ0EsWUFBQTtJQUNBLFlBQUE7SUFDQSxTQUFBO0lBQ0Esa0JBQUE7Q0FDQTs7QUFFQTtJQUNBLGdCQUFBO0lBQ0EsZ0JBQUE7SUFDQSxxQkFBQTtDQUNBOztBQUVBO0lBQ0EsV0FBQTtJQUNBLGlCQUFBO0lBQ0Esa0JBQUE7SUFDQSx5QkFBQTtJQUNBLFlBQUE7SUFDQSxtQkFBQTtDQUNBOztBQUVBO0lBQ0EsV0FBQTtJQUNBLFlBQUE7SUFDQSxjQUFBO0lBQ0EsWUFBQTtJQUNBLGFBQUE7SUFDQSxnQkFBQTtDQUNBOztBQUVBO0lBQ0Esc0JBQUE7SUFDQSxZQUFBO0NBQ0E7O0FBRUE7SUFDQSx5QkFBQTtJQUNBLDBCQUFBO0lBQ0EsWUFBQTtJQUNBLGtCQUFBO0NBQ0E7O0FBRUE7SUFDQSxXQUFBO0NBQ0FcIixcImZpbGVcIjpcInRhZ2lucHV0LnZ1ZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI8dGVtcGxhdGU+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhZ0lucHV0LWNvbnRhaW5lciB0YWdzXFxcIiBAY2xpY2s9XFxcImZvY3VzXFxcIj5cXG4gICAgICAgIDxzcGFuIHYtZm9yPVxcXCJpdGVtIGluIHNob3dMaXN0XFxcIiBjbGFzcz1cXFwidGFnXFxcIj57e2l0ZW19fTxpIGNsYXNzPVxcXCJjbG9zZVxcXCIgQGNsaWNrPVxcXCJkZWxldGVJdGVtKCRpbmRleClcXFwiPsOXPC9pPjwvc3Bhbj5cXG4gICAgICAgIDx0eXBlLWFoZWFkLXRleHRcXG4gICAgICAgICAgICAgICAgdi1pZj1cXFwidHlwZUFoZWFkID09PSAndGV4dCdcXFwiXFxuICAgICAgICAgICAgICAgIDppbnB1dC1kYXRhLnN5bmM9XFxcInRleHRJbnB1dFxcXCJcXG4gICAgICAgICAgICAgICAgOmNvbmZpZz1cXFwiY29uZmlnXFxcIlxcbiAgICAgICAgICAgICAgICA6ZHJvcGRvd24tZGF0YT1cXFwiZHJvcGRvd25EYXRhXFxcIlxcbiAgICAgICAgICAgICAgICB2LXJlZjp0eXBlYWhlYWQ+XFxuICAgICAgICA8L3R5cGUtYWhlYWQtdGV4dD5cXG4gICAgICAgIDx0eXBlLWFoZWFkLW9iamVjdFxcbiAgICAgICAgICAgICAgICB2LWlmPVxcXCJ0eXBlQWhlYWQgPT09ICdvYmplY3QnXFxcIlxcbiAgICAgICAgICAgICAgICA6aW5wdXQtZGF0YS5zeW5jPVxcXCJvYmplY3RJbnB1dFxcXCJcXG4gICAgICAgICAgICAgICAgOmRyb3Bkb3duLWRhdGE9XFxcImRyb3Bkb3duRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgOmNvbmZpZz1cXFwiY29uZmlnXFxcIlxcbiAgICAgICAgICAgICAgICB2LXJlZjp0eXBlYWhlYWQ+XFxuICAgICAgICA8L3R5cGUtYWhlYWQtb2JqZWN0PlxcbiAgICA8L2Rpdj5cXG48L3RlbXBsYXRlPlxcblxcbjxzdHlsZT5cXG4gICAgLnRhZ0lucHV0LWNvbnRhaW5lciB7XFxuICAgICAgICBib3JkZXI6MXB4ICNjY2Mgc29saWQ7XFxuICAgICAgICBwYWRkaW5nOjRweDtcXG4gICAgICAgIGN1cnNvcjp0ZXh0O1xcbiAgICAgICAgZm9udC1zaXplOjEzcHg7XFxuICAgICAgICB3aWR0aDoxMDAlO1xcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcXG4gICAgfVxcblxcbiAgICAudGFnSW5wdXQtY29udGFpbmVyIGlucHV0IHtcXG4gICAgICAgIGZvbnQtc2l6ZToxM3B4O1xcbiAgICAgICAgY2xlYXI6Ym90aDtcXG4gICAgICAgIHdpZHRoOjIwMHB4O1xcbiAgICAgICAgaGVpZ2h0OjMwcHg7XFxuICAgICAgICBib3JkZXI6MDtcXG4gICAgICAgIG1hcmdpbi1ib3R0b206MXB4O1xcbiAgICB9XFxuXFxuICAgIC50YWdJbnB1dC1jb250YWluZXIgLmNsb3NlIHsgICAgICAgIFxcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xcbiAgICAgICAgcGFkZGluZzogMCAycHggMCA0cHg7XFxuICAgIH1cXG5cXG4gICAgbGkudGFnSW5wdXQtZW1haWwge1xcbiAgICAgICAgZmxvYXQ6bGVmdDtcXG4gICAgICAgIG1hcmdpbi1yaWdodDoycHg7XFxuICAgICAgICBtYXJnaW4tYm90dG9tOjFweDtcXG4gICAgICAgIGJvcmRlcjoxcHggI0JCRDhGQiBzb2xpZDtcXG4gICAgICAgIHBhZGRpbmc6MnB4O1xcbiAgICAgICAgYmFja2dyb3VuZDojRjNGN0ZEO1xcbiAgICB9XFxuXFxuICAgIC50YWdJbnB1dC1jbG9zZSB7XFxuICAgICAgICB3aWR0aDoxNnB4O1xcbiAgICAgICAgaGVpZ2h0OjE2cHg7XFxuICAgICAgICBkaXNwbGF5OmJsb2NrO1xcbiAgICAgICAgZmxvYXQ6cmlnaHQ7XFxuICAgICAgICBtYXJnaW46MCAzcHg7XFxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgIH1cXG5cXG4gICAgLnRhZ0lucHV0LWNvbnRhaW5lciAub3JvY2hpLWRyb3Bkb3duIHtcXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgICAgIHdpZHRoOiBhdXRvO1xcbiAgICB9XFxuXFxuICAgIC50YWdJbnB1dC1jb250YWluZXIgLnRhZ3tcXG4gICAgICAgIHBhZGRpbmc6IDRweCA0cHggNHB4IDZweDtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwZTkwZDI7XFxuICAgICAgICBjb2xvcjogI2ZmZjtcXG4gICAgICAgIG1hcmdpbi1yaWdodDogNHB4O1xcbiAgICB9XFxuXFxuICAgIC50YWdJbnB1dC1jb250YWluZXIgLm9yb2NoaS1kcm9wZG93bi10eXBlYWhlYWQge1xcbiAgICAgICAgbGVmdDogLTVweDtcXG4gICAgfVxcbjwvc3R5bGU+XFxuIFxcbjxzY3JpcHQ+XFxuICAgIGltcG9ydCBUeXBlQWhlYWRUZXh0IGZyb20gJy4uL3R5cGVhaGVhZC90eXBlQWhlYWRfdGV4dC52dWUnO1xcbiAgICBpbXBvcnQgVHlwZUFoZWFkT2JqZWN0IGZyb20gJy4uL3R5cGVhaGVhZC90eXBlQWhlYWRfb2JqZWN0LnZ1ZSc7XFxuXFxuICAgIGV4cG9ydCBkZWZhdWx0IHtcXG5cXG4gICAgICAgIGRhdGEgKCkge1xcbiAgICAgICAgICAgIHJldHVybiB7XFxuICAgICAgICAgICAgICAgIHRleHRJbnB1dDogJycsXFxuICAgICAgICAgICAgICAgIG9iamVjdElucHV0OiB7XFxuICAgICAgICAgICAgICAgICAgICBpZDogJycsXFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnJ1xcbiAgICAgICAgICAgICAgICB9LFxcbiAgICAgICAgICAgICAgICBzaG93TGlzdDogW11cXG4gICAgICAgICAgICB9XFxuICAgICAgICB9LFxcblxcbiAgICAgICAgY29tcG9uZW50czoge1xcbiAgICAgICAgICAgIFR5cGVBaGVhZFRleHQsXFxuICAgICAgICAgICAgVHlwZUFoZWFkT2JqZWN0XFxuICAgICAgICB9LFxcblxcbiAgICAgICAgLyoqXFxuICAgICAgICAgKiBpbnB1dExpc3QgICAg5b+F6YCJ77yM6L6T5YWl5YiX6KGoXFxuICAgICAgICAgKiB0eXBlQWhlYWQgICAg6buY6K6kdGV4dCzkuIvmi4nnu4Tku7bnsbvlnotcXG4gICAgICAgICAqIGNvbmZpZyAgICAgICDlj6/pgInvvIzkvKDnu5nkuIvmi4nnu4Tku7bnmoRjb25maWdcXG4gICAgICAgICAqIGRyb3Bkb3duRGF0YSDlj6/pgInvvIzkuIvmi4nnu4Tku7bnmoTkuIvmi4nmlbDmja7vvIzlj4LnhafkuIvmi4nnu4Tku7bnmoTlj4LmlbBcXG4gICAgICAgICAqL1xcbiAgICAgICAgcHJvcHM6e1xcbiAgICAgICAgICAgIHR5cGVBaGVhZDoge1xcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICd0ZXh0J1xcbiAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgY29uZmlnOiB7XFxuICAgICAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcXG4gICAgICAgICAgICAgICAgZGVmYXVsdCAoKSB7XFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS8oOWFpWlucHV055qEaWTlsZ7mgKflkI1cXG4gICAgICAgICAgICAgICAgICAgICAgICBpZE5hbWU6ICdpZCcsXFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Lyg5YWlaW5wdXTnmoTlgLzlsZ7mgKflkI1cXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0TmFtZTogJ3RleHQnLFxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsd2F5c0hpdDogdHJ1ZVxcbiAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfSxcXG4gICAgICAgICAgICBpbnB1dExpc3Q6IHtcXG4gICAgICAgICAgICAgICAgdHlwZTogQXJyYXksXFxuICAgICAgICAgICAgICAgIHR3b1dheTogdHJ1ZSxcXG4gICAgICAgICAgICAgICAgZGVmYXVsdCAoKSB7XFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW11cXG4gICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgZHJvcGRvd25EYXRhOiB7XFxuICAgICAgICAgICAgICAgIHR5cGU6IEFycmF5LFxcbiAgICAgICAgICAgICAgICBkZWZhdWx0ICgpIHtcXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXVxcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfSxcXG5cXG4gICAgICAgIGNvbXB1dGVkOiB7fSxcXG5cXG4gICAgICAgIHJlYWR5ICgpIHtcXG4gICAgICAgICAgICB0aGlzLiRyZWZzLnR5cGVhaGVhZC4kb24oJ3R5cGVhaGVhZC5oaXQnLCAoZGF0YSkgPT4ge1xcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaG93TGlzdC5pbmRleE9mKGRhdGEudGV4dCkgPCAwKSB7XFxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXQgPSB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS50ZXh0LFxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDoge1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS50ZXh0XFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICAgICAgfVt0aGlzLnR5cGVBaGVhZF07XFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0TGlzdC5wdXNoKGlucHV0KTtcXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0xpc3QucHVzaChkYXRhLnRleHQpO1xcbiAgICAgICAgICAgICAgICAgICAgLy8gdHlwZWFoZWFkLmhpdOS6i+S7tuinpuWPkeaXtuW3sue7j+WvuXRleHRJbnB1dOi/m+ihjOi1i+WAvFxcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0SW5wdXQgPSAnJztcXG4gICAgICAgICAgICAgICAgICAgIH0pO1xcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3RJbnB1dC50ZXh0ID0gJyc7XFxuICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICB9KTtcXG4gICAgICAgICAgICB0aGlzLiRyZWZzLnR5cGVhaGVhZC4kb24oJ3R5cGVhaGVhZC5iYWNrc3BhY2UnLCAoKSA9PiB7XFxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRMaXN0LnBvcCgpO1xcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMaXN0LnBvcCgpO1xcbiAgICAgICAgICAgIH0pO1xcbiAgICAgICAgfSxcXG5cXG4gICAgICAgIG1ldGhvZHM6IHtcXG4gICAgICAgICAgICBmb2N1cyAoKSB7XFxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykuZm9jdXMoKTtcXG4gICAgICAgICAgICB9LFxcbiAgICAgICAgICAgIGRlbGV0ZUl0ZW0gKGluZGV4KSB7XFxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRMaXN0LnNwbGljZShpbmRleCwgMSk7XFxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9XFxuXFxuICAgIH1cXG5cXG48L3NjcmlwdD4gXFxuXFxuXCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3NyYy90YWdpbnB1dC90YWdpbnB1dC52dWVcbiAqKiBtb2R1bGUgaWQgPSA4MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuICAgIDxkaXYgY2xhc3M9XCJ0YWdJbnB1dC1jb250YWluZXIgdGFnc1wiIEBjbGljaz1cImZvY3VzXCI+XG4gICAgICAgIDxzcGFuIHYtZm9yPVwiaXRlbSBpbiBzaG93TGlzdFwiIGNsYXNzPVwidGFnXCI+e3tpdGVtfX08aSBjbGFzcz1cImNsb3NlXCIgQGNsaWNrPVwiZGVsZXRlSXRlbSgkaW5kZXgpXCI+w5c8L2k+PC9zcGFuPlxuICAgICAgICA8dHlwZS1haGVhZC10ZXh0XG4gICAgICAgICAgICAgICAgdi1pZj1cInR5cGVBaGVhZCA9PT0gJ3RleHQnXCJcbiAgICAgICAgICAgICAgICA6aW5wdXQtZGF0YS5zeW5jPVwidGV4dElucHV0XCJcbiAgICAgICAgICAgICAgICA6Y29uZmlnPVwiY29uZmlnXCJcbiAgICAgICAgICAgICAgICA6ZHJvcGRvd24tZGF0YT1cImRyb3Bkb3duRGF0YVwiXG4gICAgICAgICAgICAgICAgdi1yZWY6dHlwZWFoZWFkPlxuICAgICAgICA8L3R5cGUtYWhlYWQtdGV4dD5cbiAgICAgICAgPHR5cGUtYWhlYWQtb2JqZWN0XG4gICAgICAgICAgICAgICAgdi1pZj1cInR5cGVBaGVhZCA9PT0gJ29iamVjdCdcIlxuICAgICAgICAgICAgICAgIDppbnB1dC1kYXRhLnN5bmM9XCJvYmplY3RJbnB1dFwiXG4gICAgICAgICAgICAgICAgOmRyb3Bkb3duLWRhdGE9XCJkcm9wZG93bkRhdGFcIlxuICAgICAgICAgICAgICAgIDpjb25maWc9XCJjb25maWdcIlxuICAgICAgICAgICAgICAgIHYtcmVmOnR5cGVhaGVhZD5cbiAgICAgICAgPC90eXBlLWFoZWFkLW9iamVjdD5cbiAgICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbiAgICAudGFnSW5wdXQtY29udGFpbmVyIHtcbiAgICAgICAgYm9yZGVyOjFweCAjY2NjIHNvbGlkO1xuICAgICAgICBwYWRkaW5nOjRweDtcbiAgICAgICAgY3Vyc29yOnRleHQ7XG4gICAgICAgIGZvbnQtc2l6ZToxM3B4O1xuICAgICAgICB3aWR0aDoxMDAlO1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIH1cblxuICAgIC50YWdJbnB1dC1jb250YWluZXIgaW5wdXQge1xuICAgICAgICBmb250LXNpemU6MTNweDtcbiAgICAgICAgY2xlYXI6Ym90aDtcbiAgICAgICAgd2lkdGg6MjAwcHg7XG4gICAgICAgIGhlaWdodDozMHB4O1xuICAgICAgICBib3JkZXI6MDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbToxcHg7XG4gICAgfVxuXG4gICAgLnRhZ0lucHV0LWNvbnRhaW5lciAuY2xvc2UgeyAgICAgICAgXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBwYWRkaW5nOiAwIDJweCAwIDRweDtcbiAgICB9XG5cbiAgICBsaS50YWdJbnB1dC1lbWFpbCB7XG4gICAgICAgIGZsb2F0OmxlZnQ7XG4gICAgICAgIG1hcmdpbi1yaWdodDoycHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206MXB4O1xuICAgICAgICBib3JkZXI6MXB4ICNCQkQ4RkIgc29saWQ7XG4gICAgICAgIHBhZGRpbmc6MnB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiNGM0Y3RkQ7XG4gICAgfVxuXG4gICAgLnRhZ0lucHV0LWNsb3NlIHtcbiAgICAgICAgd2lkdGg6MTZweDtcbiAgICAgICAgaGVpZ2h0OjE2cHg7XG4gICAgICAgIGRpc3BsYXk6YmxvY2s7XG4gICAgICAgIGZsb2F0OnJpZ2h0O1xuICAgICAgICBtYXJnaW46MCAzcHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG5cbiAgICAudGFnSW5wdXQtY29udGFpbmVyIC5vcm9jaGktZHJvcGRvd24ge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cblxuICAgIC50YWdJbnB1dC1jb250YWluZXIgLnRhZ3tcbiAgICAgICAgcGFkZGluZzogNHB4IDRweCA0cHggNnB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMGU5MGQyO1xuICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiA0cHg7XG4gICAgfVxuXG4gICAgLnRhZ0lucHV0LWNvbnRhaW5lciAub3JvY2hpLWRyb3Bkb3duLXR5cGVhaGVhZCB7XG4gICAgICAgIGxlZnQ6IC01cHg7XG4gICAgfVxuPC9zdHlsZT5cbiBcbjxzY3JpcHQ+XG4gICAgaW1wb3J0IFR5cGVBaGVhZFRleHQgZnJvbSAnLi4vdHlwZWFoZWFkL3R5cGVBaGVhZF90ZXh0LnZ1ZSc7XG4gICAgaW1wb3J0IFR5cGVBaGVhZE9iamVjdCBmcm9tICcuLi90eXBlYWhlYWQvdHlwZUFoZWFkX29iamVjdC52dWUnO1xuXG4gICAgZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgICAgIGRhdGEgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXh0SW5wdXQ6ICcnLFxuICAgICAgICAgICAgICAgIG9iamVjdElucHV0OiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNob3dMaXN0OiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgICAgIFR5cGVBaGVhZFRleHQsXG4gICAgICAgICAgICBUeXBlQWhlYWRPYmplY3RcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogaW5wdXRMaXN0ICAgIOW/hemAie+8jOi+k+WFpeWIl+ihqFxuICAgICAgICAgKiB0eXBlQWhlYWQgICAg6buY6K6kdGV4dCzkuIvmi4nnu4Tku7bnsbvlnotcbiAgICAgICAgICogY29uZmlnICAgICAgIOWPr+mAie+8jOS8oOe7meS4i+aLiee7hOS7tueahGNvbmZpZ1xuICAgICAgICAgKiBkcm9wZG93bkRhdGEg5Y+v6YCJ77yM5LiL5ouJ57uE5Lu255qE5LiL5ouJ5pWw5o2u77yM5Y+C54Wn5LiL5ouJ57uE5Lu255qE5Y+C5pWwXG4gICAgICAgICAqL1xuICAgICAgICBwcm9wczp7XG4gICAgICAgICAgICB0eXBlQWhlYWQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ3RleHQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgICAgICAgICAgIGRlZmF1bHQgKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Lyg5YWlaW5wdXTnmoRpZOWxnuaAp+WQjVxuICAgICAgICAgICAgICAgICAgICAgICAgaWROYW1lOiAnaWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Lyg5YWlaW5wdXTnmoTlgLzlsZ7mgKflkI1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHROYW1lOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbHdheXNIaXQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnB1dExpc3Q6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgICAgICB0d29XYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgZGVmYXVsdCAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkcm9wZG93bkRhdGE6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0ICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXB1dGVkOiB7fSxcblxuICAgICAgICByZWFkeSAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyZWZzLnR5cGVhaGVhZC4kb24oJ3R5cGVhaGVhZC5oaXQnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3dMaXN0LmluZGV4T2YoZGF0YS50ZXh0KSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlucHV0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS50ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS50ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1bdGhpcy50eXBlQWhlYWRdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0TGlzdC5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TGlzdC5wdXNoKGRhdGEudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHR5cGVhaGVhZC5oaXTkuovku7bop6blj5Hml7blt7Lnu4/lr7l0ZXh0SW5wdXTov5vooYzotYvlgLxcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRJbnB1dCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3RJbnB1dC50ZXh0ID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLiRyZWZzLnR5cGVhaGVhZC4kb24oJ3R5cGVhaGVhZC5iYWNrc3BhY2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dExpc3QucG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TGlzdC5wb3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGZvY3VzICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRlSXRlbSAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0TGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG48L3NjcmlwdD4gXG5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHRhZ2lucHV0LnZ1ZT81NThkZjQ1Y1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG48ZGl2IGNsYXNzPVxcXCJ0YWdJbnB1dC1jb250YWluZXIgdGFnc1xcXCIgQGNsaWNrPVxcXCJmb2N1c1xcXCI+XFxuICAgIDxzcGFuIHYtZm9yPVxcXCJpdGVtIGluIHNob3dMaXN0XFxcIiBjbGFzcz1cXFwidGFnXFxcIj57e2l0ZW19fTxpIGNsYXNzPVxcXCJjbG9zZVxcXCIgQGNsaWNrPVxcXCJkZWxldGVJdGVtKCRpbmRleClcXFwiPsOXPC9pPjwvc3Bhbj5cXG4gICAgPHR5cGUtYWhlYWQtdGV4dFxcbiAgICAgICAgICAgIHYtaWY9XFxcInR5cGVBaGVhZCA9PT0gJ3RleHQnXFxcIlxcbiAgICAgICAgICAgIDppbnB1dC1kYXRhLnN5bmM9XFxcInRleHRJbnB1dFxcXCJcXG4gICAgICAgICAgICA6Y29uZmlnPVxcXCJjb25maWdcXFwiXFxuICAgICAgICAgICAgOmRyb3Bkb3duLWRhdGE9XFxcImRyb3Bkb3duRGF0YVxcXCJcXG4gICAgICAgICAgICB2LXJlZjp0eXBlYWhlYWQ+XFxuICAgIDwvdHlwZS1haGVhZC10ZXh0PlxcbiAgICA8dHlwZS1haGVhZC1vYmplY3RcXG4gICAgICAgICAgICB2LWlmPVxcXCJ0eXBlQWhlYWQgPT09ICdvYmplY3QnXFxcIlxcbiAgICAgICAgICAgIDppbnB1dC1kYXRhLnN5bmM9XFxcIm9iamVjdElucHV0XFxcIlxcbiAgICAgICAgICAgIDpkcm9wZG93bi1kYXRhPVxcXCJkcm9wZG93bkRhdGFcXFwiXFxuICAgICAgICAgICAgOmNvbmZpZz1cXFwiY29uZmlnXFxcIlxcbiAgICAgICAgICAgIHYtcmVmOnR5cGVhaGVhZD5cXG4gICAgPC90eXBlLWFoZWFkLW9iamVjdD5cXG48L2Rpdj5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtaHRtbC1sb2FkZXI/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL3RhZ2lucHV0L3RhZ2lucHV0LnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDgyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5yZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL2RhdGV0aW1lcGlja2VyLnZ1ZVwiKVxuX192dWVfc2NyaXB0X18gPSByZXF1aXJlKFwiISFiYWJlbC1sb2FkZXI/cHJlc2V0c1tdPWVzMjAxNSZwbHVnaW5zW109dHJhbnNmb3JtLXJ1bnRpbWUmY29tbWVudHM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL2RhdGV0aW1lcGlja2VyLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxcZGF0ZXRpbWVwaWNrZXJcXFxcZGF0ZXRpbWVwaWNrZXIudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL2RhdGV0aW1lcGlja2VyLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtZGJlNjlmODQvZGF0ZXRpbWVwaWNrZXIudnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDgzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZSZpbmRleD0wIS4vZGF0ZXRpbWVwaWNrZXIudnVlXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLXJld3JpdGVyLmpzIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL2RhdGV0aW1lcGlja2VyLnZ1ZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZSZpbmRleD0wIS4vZGF0ZXRpbWVwaWNrZXIudnVlXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtc3R5bGUtbG9hZGVyIS4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci52dWVcbiAqKiBtb2R1bGUgaWQgPSA4NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG4uYW0tZGF0ZXBpY2tlciB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiLy4vc3JjL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLnZ1ZT82MzY5ZTE2Y1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBO0lBQ0EsZUFBQTtDQUNBXCIsXCJmaWxlXCI6XCJkYXRldGltZXBpY2tlci52dWVcIixcInNvdXJjZXNDb250ZW50XCI6W1wiPHRlbXBsYXRlPlxcblxcbjxkaXYgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXJcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLWNhcmV0XFxcIiB2LWlmPVxcXCJjYXJldERpc3BsYXllZFxcXCI+PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItZGF0ZVxcXCIgdi1pZj1cXFwic2hvd0RhdGVQaWNrZXJcXFwiIHYtc2hvdz1cXFwic2hvdy5kYXRlXFxcIj5cXG4gICAgICAgIDxkYXRlLXBpY2tlciB2LWJpbmQ6c2VsZWN0ZWQtZGF0ZS5zeW5jPVxcXCJkYXRlVGltZVxcXCI+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRpbWVcXFwiIHYtaWY9XFxcInNob3dUaW1lUGlja2VyXFxcIiB2LXNob3c9XFxcInNob3cudGltZVxcXCI+XFxuICAgICAgICA8dGltZS1waWNrZXIgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cXFwiZGF0ZVRpbWVcXFwiIHYtb246dmlld2NoYW5nZT1cXFwiaGFuZGxlVmlld0NoYW5nZVxcXCI+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRvZ2dsZVxcXCIgdi1pZj1cXFwic2hvd0RhdGVQaWNrZXImJnNob3dUaW1lUGlja2VyXFxcIiB2LXNob3c9XFxcInNob3cuZGF0ZVxcXCIgdi1vbjpjbGljaz1cXFwiaGFuZGxlVG9nZ2xlVGltZVxcXCI+XFxuICAgICAgICA8aSBjbGFzcz1cXFwiYW0taWNvbi1mdyBhbS1pY29uLWNsb2NrLW9cXFwiPjwvaT5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItdG9nZ2xlXFxcIiB2LWlmPVxcXCJzaG93RGF0ZVBpY2tlciYmc2hvd1RpbWVQaWNrZXJcXFwiIHYtc2hvdz1cXFwic2hvdy50aW1lXFxcIiB2LW9uOmNsaWNrPVxcXCJoYW5kbGVUb2dnbGVEYXRlXFxcIj5cXG4gICAgICAgIDxpIGNsYXNzPVxcXCJhbS1pY29uLWZ3IGFtLWljb24tY2FsZW5kYXJcXFwiPjwvaT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXFxuPC90ZW1wbGF0ZT5cXG5cXG48c3R5bGU+XFxuXFxuLmFtLWRhdGVwaWNrZXIge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuPC9zdHlsZT5cXG5cXG48c2NyaXB0PlxcblxcbmltcG9ydCBkYXRlUGlja2VyIGZyb20gJy4vZGF0ZXBpY2tlci52dWUnO1xcbmltcG9ydCB0aW1lUGlja2VyIGZyb20gJy4vdGltZXBpY2tlci52dWUnO1xcblxcbmV4cG9ydCBkZWZhdWx0IHtcXG5cXG4gICAgY29tcG9uZW50czoge1xcbiAgICAgICAgZGF0ZVBpY2tlcixcXG4gICAgICAgIHRpbWVQaWNrZXJcXG4gICAgfSxcXG5cXG4gICAgcHJvcHM6IHtcXG4gICAgICAgIGRhdGVUaW1lOiB7XFxuICAgICAgICAgICAgdHlwZTogRGF0ZSxcXG4gICAgICAgICAgICB0d29XYXk6IHRydWUsXFxuICAgICAgICAgICAgZGVmYXVsdCgpIHtcXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfSxcXG4gICAgICAgIHNob3dUaW1lUGlja2VyOiB7XFxuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXFxuICAgICAgICB9LFxcbiAgICAgICAgc2hvd0RhdGVQaWNrZXI6IHtcXG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcXG4gICAgICAgIH0sXFxuICAgICAgICBjYXJldERpc3BsYXllZDoge1xcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcXG4gICAgICAgIH0sXFxuICAgICAgICBmb3JtYXQ6IHtcXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXFxuICAgICAgICAgICAgZGVmYXVsdDogJ1lZWVktTU0tREQgSEg6bW0nXFxuICAgICAgICB9LFxcbiAgICAgICAgYW1TdHlsZToge1xcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcXG4gICAgICAgICAgICB2YWxpZGF0b3Ioc3R5bGUpIHtcXG4gICAgICAgICAgICAgICAgcmV0dXJuIC9zdWNjZXNzfGRhbmdlcnx3YXJuaW5nfC8udGVzdChzdHlsZSk7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfSxcXG4gICAgICAgIG1pbkRhdGU6IHtcXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXFxuICAgICAgICAgICAgZGVmYXVsdDogJydcXG4gICAgICAgIH0sXFxuICAgICAgICBtYXhEYXRlOiB7XFxuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXFxuICAgICAgICB9XFxuICAgIH0sXFxuXFxuICAgIGNvbXBpbGVkKCkge1xcbiAgICAgICAgdGhpcy5zaG93LmRhdGUgPSB0aGlzLnNob3dEYXRlUGlja2VyO1xcbiAgICAgICAgdGhpcy5zaG93LnRpbWUgPSAhdGhpcy5zaG93RGF0ZVBpY2tlciAmJiB0aGlzLnNob3dUaW1lUGlja2VyO1xcbiAgICB9LFxcblxcbiAgICBkYXRhKCkge1xcbiAgICAgICAgcmV0dXJuIHtcXG4gICAgICAgICAgICBzaG93OiB7XFxuICAgICAgICAgICAgICAgIGRhdGU6IHRydWUsXFxuICAgICAgICAgICAgICAgIHRpbWU6IGZhbHNlXFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfTtcXG4gICAgfSxcXG5cXG4gICAgbWV0aG9kczoge1xcblxcbiAgICAgICAgaGFuZGxlVG9nZ2xlVGltZSgpIHtcXG4gICAgICAgICAgICB0aGlzLnNob3cuZGF0ZSA9IGZhbHNlLFxcbiAgICAgICAgICAgIHRoaXMuc2hvdy50aW1lID0gdHJ1ZTtcXG4gICAgICAgIH0sXFxuXFxuICAgICAgICBoYW5kbGVUb2dnbGVEYXRlKCkge1xcbiAgICAgICAgICAgIHRoaXMuc2hvdy5kYXRlID0gdHJ1ZSxcXG4gICAgICAgICAgICB0aGlzLnNob3cudGltZSA9IGZhbHNlO1xcbiAgICAgICAgfSxcXG5cXG4gICAgICAgIGhhbmRsZVZpZXdDaGFuZ2Uoc2hvdykge1xcbiAgICAgICAgICAgIHRoaXMuc2hvdy5kYXRlID0gc2hvdy5kYXRlICYmIHRoaXMuc2hvd0RhdGVQaWNrZXI7XFxuICAgICAgICAgICAgdGhpcy5zaG93LnRpbWUgPSBzaG93LnRpbWUgfHwgIXRoaXMuc2hvd0RhdGVQaWNrZXIgJiYgdGhpcy5zaG93VGltZVBpY2tlcjtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbn07XFxuXFxuPC9zY3JpcHQ+XFxuXCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGUmaW5kZXg9MCEuL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci52dWVcbiAqKiBtb2R1bGUgaWQgPSA4NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48ZGl2IGNsYXNzPVwiYW0tZGF0ZXBpY2tlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJhbS1kYXRlcGlja2VyLWNhcmV0XCIgdi1pZj1cImNhcmV0RGlzcGxheWVkXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItZGF0ZVwiIHYtaWY9XCJzaG93RGF0ZVBpY2tlclwiIHYtc2hvdz1cInNob3cuZGF0ZVwiPlxuICAgICAgICA8ZGF0ZS1waWNrZXIgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cImRhdGVUaW1lXCI+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItdGltZVwiIHYtaWY9XCJzaG93VGltZVBpY2tlclwiIHYtc2hvdz1cInNob3cudGltZVwiPlxuICAgICAgICA8dGltZS1waWNrZXIgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cImRhdGVUaW1lXCIgdi1vbjp2aWV3Y2hhbmdlPVwiaGFuZGxlVmlld0NoYW5nZVwiPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXRvZ2dsZVwiIHYtaWY9XCJzaG93RGF0ZVBpY2tlciYmc2hvd1RpbWVQaWNrZXJcIiB2LXNob3c9XCJzaG93LmRhdGVcIiB2LW9uOmNsaWNrPVwiaGFuZGxlVG9nZ2xlVGltZVwiPlxuICAgICAgICA8aSBjbGFzcz1cImFtLWljb24tZncgYW0taWNvbi1jbG9jay1vXCI+PC9pPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXRvZ2dsZVwiIHYtaWY9XCJzaG93RGF0ZVBpY2tlciYmc2hvd1RpbWVQaWNrZXJcIiB2LXNob3c9XCJzaG93LnRpbWVcIiB2LW9uOmNsaWNrPVwiaGFuZGxlVG9nZ2xlRGF0ZVwiPlxuICAgICAgICA8aSBjbGFzcz1cImFtLWljb24tZncgYW0taWNvbi1jYWxlbmRhclwiPjwvaT5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG5cbi5hbS1kYXRlcGlja2VyIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cblxuPC9zdHlsZT5cblxuPHNjcmlwdD5cblxuaW1wb3J0IGRhdGVQaWNrZXIgZnJvbSAnLi9kYXRlcGlja2VyLnZ1ZSc7XG5pbXBvcnQgdGltZVBpY2tlciBmcm9tICcuL3RpbWVwaWNrZXIudnVlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICBkYXRlUGlja2VyLFxuICAgICAgICB0aW1lUGlja2VyXG4gICAgfSxcblxuICAgIHByb3BzOiB7XG4gICAgICAgIGRhdGVUaW1lOiB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgdHdvV2F5OiB0cnVlLFxuICAgICAgICAgICAgZGVmYXVsdCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2hvd1RpbWVQaWNrZXI6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHNob3dEYXRlUGlja2VyOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBjYXJldERpc3BsYXllZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ1lZWVktTU0tREQgSEg6bW0nXG4gICAgICAgIH0sXG4gICAgICAgIGFtU3R5bGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgdmFsaWRhdG9yKHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC9zdWNjZXNzfGRhbmdlcnx3YXJuaW5nfC8udGVzdChzdHlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1pbkRhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIG1heERhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcGlsZWQoKSB7XG4gICAgICAgIHRoaXMuc2hvdy5kYXRlID0gdGhpcy5zaG93RGF0ZVBpY2tlcjtcbiAgICAgICAgdGhpcy5zaG93LnRpbWUgPSAhdGhpcy5zaG93RGF0ZVBpY2tlciAmJiB0aGlzLnNob3dUaW1lUGlja2VyO1xuICAgIH0sXG5cbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2hvdzoge1xuICAgICAgICAgICAgICAgIGRhdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdGltZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuXG4gICAgICAgIGhhbmRsZVRvZ2dsZVRpbWUoKSB7XG4gICAgICAgICAgICB0aGlzLnNob3cuZGF0ZSA9IGZhbHNlLFxuICAgICAgICAgICAgdGhpcy5zaG93LnRpbWUgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVRvZ2dsZURhdGUoKSB7XG4gICAgICAgICAgICB0aGlzLnNob3cuZGF0ZSA9IHRydWUsXG4gICAgICAgICAgICB0aGlzLnNob3cudGltZSA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVZpZXdDaGFuZ2Uoc2hvdykge1xuICAgICAgICAgICAgdGhpcy5zaG93LmRhdGUgPSBzaG93LmRhdGUgJiYgdGhpcy5zaG93RGF0ZVBpY2tlcjtcbiAgICAgICAgICAgIHRoaXMuc2hvdy50aW1lID0gc2hvdy50aW1lIHx8ICF0aGlzLnNob3dEYXRlUGlja2VyICYmIHRoaXMuc2hvd1RpbWVQaWNrZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbjwvc2NyaXB0PlxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZGF0ZXRpbWVwaWNrZXIudnVlPzYzNjllMTZjXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxuX192dWVfc2NyaXB0X18gPSByZXF1aXJlKFwiISFiYWJlbC1sb2FkZXI/cHJlc2V0c1tdPWVzMjAxNSZwbHVnaW5zW109dHJhbnNmb3JtLXJ1bnRpbWUmY29tbWVudHM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL2RhdGVwaWNrZXIudnVlXCIpXG5pZiAoX192dWVfc2NyaXB0X18gJiZcbiAgICBfX3Z1ZV9zY3JpcHRfXy5fX2VzTW9kdWxlICYmXG4gICAgT2JqZWN0LmtleXMoX192dWVfc2NyaXB0X18pLmxlbmd0aCA+IDEpIHtcbiAgY29uc29sZS53YXJuKFwiW3Z1ZS1sb2FkZXJdIHNyY1xcXFxkYXRldGltZXBpY2tlclxcXFxkYXRlcGlja2VyLnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5fX3Z1ZV90ZW1wbGF0ZV9fID0gcmVxdWlyZShcIiEhdnVlLWh0bWw/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9kYXRlcGlja2VyLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtYTk2ZjkxOWUvZGF0ZXBpY2tlci52dWVcIlxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoaWQsIG1vZHVsZS5leHBvcnRzKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS51cGRhdGUoaWQsIG1vZHVsZS5leHBvcnRzLCBfX3Z1ZV90ZW1wbGF0ZV9fKVxuICB9XG59KSgpfVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXBpY2tlci52dWVcbiAqKiBtb2R1bGUgaWQgPSA4N1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48ZGl2IGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1ib2R5XCI+XG4gICAgPGRheXMtcGlja2VyXG4gICAgICAgICAgICB2LWJpbmQ6c2VsZWN0ZWQtZGF0ZS5zeW5jPVwic2VsZWN0ZWREYXRlXCJcbiAgICAgICAgICAgIHYtYmluZDp2aWV3LWRhdGUuc3luYz1cInZpZXdEYXRlXCJcbiAgICAgICAgICAgIHYtc2hvdz1cInNob3cuZGF5c1wiXG4gICAgICAgICAgICBAcGlja2VyLnZpZXdjaGFuZ2U9XCJjaGFuZ3Nob3dcIj5cbiAgICA8L2RheXMtcGlja2VyPlxuICAgIDxtb250aHMtcGlja2VyXG4gICAgICAgICAgICB2LWJpbmQ6c2VsZWN0ZWQtZGF0ZS5zeW5jPVwic2VsZWN0ZWREYXRlXCJcbiAgICAgICAgICAgIHYtYmluZDp2aWV3LWRhdGUuc3luYz1cInZpZXdEYXRlXCJcbiAgICAgICAgICAgIHYtc2hvdz1cInNob3cubW9udGhzXCJcbiAgICAgICAgICAgIEBwaWNrZXIudmlld2NoYW5nZT1cImNoYW5nc2hvd1wiPlxuICAgICAgICA8L21vbnRocy1waWNrZXI+XG4gICAgPHllYXJzLXBpY2tlclxuICAgICAgICAgICAgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cInNlbGVjdGVkRGF0ZVwiXG4gICAgICAgICAgICB2LWJpbmQ6dmlldy1kYXRlLnN5bmM9XCJ2aWV3RGF0ZVwiXG4gICAgICAgICAgICB2LXNob3c9XCJzaG93LnllYXJzXCJcbiAgICAgICAgICAgIEBwaWNrZXIudmlld2NoYW5nZT1cImNoYW5nc2hvd1wiPlxuICAgIDwveWVhcnMtcGlja2VyPlxuPC9kaXY+XG5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5cbmltcG9ydCBkYXlzUGlja2VyIGZyb20gJy4vZGF5c3BpY2tlci52dWUnO1xuaW1wb3J0IG1vbnRoc1BpY2tlciBmcm9tICcuL21vbnRoc3BpY2tlci52dWUnO1xuaW1wb3J0IHllYXJzUGlja2VyIGZyb20gJy4veWVhcnNwaWNrZXIudnVlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHByb3BzOiB7XG4gICAgICAgIHNlbGVjdGVkRGF0ZToge1xuICAgICAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgICAgIHR3b1dheTogdHJ1ZSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICBkYXlzUGlja2VyLFxuICAgICAgICBtb250aHNQaWNrZXIsXG4gICAgICAgIHllYXJzUGlja2VyXG4gICAgfSxcblxuICAgIGRhdGEoKSB7XG4gICAgICAgIHZhciB2aWV3RGF0ZSA9IG5ldyBEYXRlKHRoaXMuc2VsZWN0ZWREYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzaG93OiB7XG4gICAgICAgICAgICAgICAgZGF5czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb250aHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHllYXJzOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZXdEYXRlOiB2aWV3RGF0ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGNoYW5nc2hvdyAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5zaG93ID0gZGF0YTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgXCJ2aWV3LWNoYW5nZVwiOiBmdW5jdGlvbihzaG93KSB7XG4gICAgICAgICAgICB0aGlzLnNob3cgPSBzaG93O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuPC9zY3JpcHQ+XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBkYXRlcGlja2VyLnZ1ZT84OThmZTIwY1xuICoqLyIsInZhciBfX3Z1ZV9zY3JpcHRfXywgX192dWVfdGVtcGxhdGVfX1xudmFyIF9fdnVlX3N0eWxlc19fID0ge31cbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9kYXlzcGlja2VyLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxcZGF0ZXRpbWVwaWNrZXJcXFxcZGF5c3BpY2tlci52dWU6IG5hbWVkIGV4cG9ydHMgaW4gKi52dWUgZmlsZXMgYXJlIGlnbm9yZWQuXCIpfVxuX192dWVfdGVtcGxhdGVfXyA9IHJlcXVpcmUoXCIhIXZ1ZS1odG1sP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vZGF5c3BpY2tlci52dWVcIilcbm1vZHVsZS5leHBvcnRzID0gX192dWVfc2NyaXB0X18gfHwge31cbmlmIChtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzLmRlZmF1bHRcbnZhciBfX3Z1ZV9vcHRpb25zX18gPSB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwiZnVuY3Rpb25cIiA/IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zIHx8IChtb2R1bGUuZXhwb3J0cy5vcHRpb25zID0ge30pKSA6IG1vZHVsZS5leHBvcnRzXG5pZiAoX192dWVfdGVtcGxhdGVfXykge1xuX192dWVfb3B0aW9uc19fLnRlbXBsYXRlID0gX192dWVfdGVtcGxhdGVfX1xufVxuaWYgKCFfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQpIF9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCA9IHt9XG5PYmplY3Qua2V5cyhfX3Z1ZV9zdHlsZXNfXykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG52YXIgbW9kdWxlID0gX192dWVfc3R5bGVzX19ba2V5XVxuX192dWVfb3B0aW9uc19fLmNvbXB1dGVkW2tleV0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtb2R1bGUgfVxufSlcbmlmIChtb2R1bGUuaG90KSB7KGZ1bmN0aW9uICgpIHsgIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgdmFyIGhvdEFQSSA9IHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIilcbiAgaG90QVBJLmluc3RhbGwocmVxdWlyZShcInZ1ZVwiKSwgZmFsc2UpXG4gIGlmICghaG90QVBJLmNvbXBhdGlibGUpIHJldHVyblxuICB2YXIgaWQgPSBcIl92LTEzN2I4ZWNjL2RheXNwaWNrZXIudnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2RhdGV0aW1lcGlja2VyL2RheXNwaWNrZXIudnVlXG4gKiogbW9kdWxlIGlkID0gODlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIjx0ZW1wbGF0ZT5cblxuPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItZGF5c1wiPlxuICAgIDx0YWJsZSBjbGFzcz1cImFtLWRhdGVwaWNrZXItdGFibGVcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICA8dHIgY2xhc3M9XCJhbS1kYXRlcGlja2VyLWhlYWRlclwiPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1wcmV2XCIgdi1vbjpjbGljaz1cInByZXZNb250aFwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1wcmV2LWljb25cIj48L2k+XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1zd2l0Y2hcIiBjb2xzcGFuPVwiNVwiIHYtb246Y2xpY2s9XCJzaG93TW9udGhzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItc2VsZWN0XCI+XG4gICAgICAgICAgICAgICAgICAgIHt7IHZpZXdEYXRlLmdldEZ1bGxZZWFyKCkgfX0g5bm0IHt7IHZpZXdEYXRlLmdldE1vbnRoKCkgfCBsb2NhbE1vbnRoIH19XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1uZXh0XCIgdi1vbjpjbGljaz1cIm5leHRNb250aFwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1uZXh0LWljb25cIj48L2k+XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGggY2xhc3M9XCJhbS1kYXRlcGlja2VyLWRvd1wiIHYtZm9yPVwiZGF5IGluIHdlZWtzXCI+e3sgZGF5IHwgbG9jYWxlIH19PC90aD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgPHRyIHYtZm9yPVwicm93IGluIGRheXNcIj5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJhbS1kYXRlcGlja2VyLWRheVwiIHYtZm9yPVwiZGF5IGluIHJvd1wiXG4gICAgICAgICAgICAgICAgdi1iaW5kOmNsYXNzPVwie1xuICAgICAgICAgICAgICAgICAgICAnYW0tZGlzYWJsZWQnOiBkYXkuaXNEaXNhYmxlZCxcbiAgICAgICAgICAgICAgICAgICAgJ2FtLWFjdGl2ZSc6IGRheS5pc0FjdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgJ2FtLWRhdGVwaWNrZXItb2xkJzogZGF5LmlzT2xkLFxuICAgICAgICAgICAgICAgICAgICAnYW0tZGF0ZXBpY2tlci1uZXcnOiBkYXkuaXNOZXdcbiAgICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgICAgICB2LW9uOmNsaWNrPVwic2V0U2VsZWN0ZWREYXRlKGRheSlcIj57eyBkYXkuc2hvdyB9fTwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG48L2Rpdj5cblxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuaW1wb3J0IHtkYXRlVXRpbHN9IGZyb20gJy4uL3V0aWxzL2luZGV4JztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgcHJvcHM6IHtcbiAgICAgICAgc2VsZWN0ZWREYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgdHdvV2F5OiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgdmlld0RhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgICAgICB0d29XYXk6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB3ZWVrU3RhcnQ6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDdcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2Vla3M6IFs3LCAxLCAyLCAzLCA0LCA1LCA2XVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgICBkYXlzKCkge1xuXG4gICAgICAgICAgICB2YXIgZGF5cyA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgd2Vla1N0YXJ0ID0gNztcblxuICAgICAgICAgICAgdmFyIHdlZWtFbmQgPSAoKHdlZWtTdGFydCArIDYpICUgNyk7XG5cbiAgICAgICAgICAgIHZhciBkID0gdGhpcy52aWV3RGF0ZTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgdmFyIG1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkRGF0ZSA9IHRoaXMuc2VsZWN0ZWREYXRlO1xuXG4gICAgICAgICAgICB2YXIgY3VycmVudERhdGUgPSBuZXcgRGF0ZShzZWxlY3RlZERhdGUuZ2V0RnVsbFllYXIoKSwgc2VsZWN0ZWREYXRlLmdldE1vbnRoKCksIHNlbGVjdGVkRGF0ZS5nZXREYXRlKCksIDAsIDAsIDAsIDApLnZhbHVlT2YoKTtcblxuICAgICAgICAgICAgdmFyIHByZXZNb250aCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgMjgsIDAsIDAsIDAsIDApO1xuICAgICAgICAgICAgdmFyIGRheSA9IGRhdGVVdGlscy5nZXREYXlzSW5Nb250aChwcmV2TW9udGguZ2V0RnVsbFllYXIoKSwgcHJldk1vbnRoLmdldE1vbnRoKCkpO1xuXG4gICAgICAgICAgICBwcmV2TW9udGguc2V0RGF0ZShkYXkpO1xuICAgICAgICAgICAgcHJldk1vbnRoLnNldERhdGUoZGF5IC0gKHByZXZNb250aC5nZXREYXkoKSAtIHdlZWtTdGFydCArIDcpICUgNyk7XG5cbiAgICAgICAgICAgIHZhciBuZXh0TW9udGggPSBuZXcgRGF0ZShwcmV2TW9udGgpO1xuXG4gICAgICAgICAgICBuZXh0TW9udGguc2V0RGF0ZShuZXh0TW9udGguZ2V0RGF0ZSgpICsgNDIpO1xuICAgICAgICAgICAgbmV4dE1vbnRoID0gbmV4dE1vbnRoLnZhbHVlT2YoKTtcblxuICAgICAgICAgICAgLy8gdmFyIG1pbkRhdGUgPSB0aGlzLnByb3BzLm1pbkRhdGU7XG4gICAgICAgICAgICAvLyB2YXIgbWF4RGF0ZSA9IHRoaXMucHJvcHMubWF4RGF0ZTtcblxuICAgICAgICAgICAgdmFyIGNlbGxzID0gW10sIHByZXZZLCBwcmV2TTtcblxuICAgICAgICAgICAgd2hpbGUgKHByZXZNb250aC52YWx1ZU9mKCkgPCBuZXh0TW9udGgpIHtcblxuICAgICAgICAgICAgICAgIHByZXZZID0gcHJldk1vbnRoLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICAgICAgcHJldk0gPSBwcmV2TW9udGguZ2V0TW9udGgoKTtcblxuICAgICAgICAgICAgICAgIHZhciBkYXkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHByZXZNb250aC5nZXREYXRlKCksXG4gICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNPbGQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpc05ldzogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKChwcmV2TSA8IG1vbnRoICYmIHByZXZZID09PSB5ZWFyKSB8fCBwcmV2WSA8IHllYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF5LmlzT2xkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChwcmV2TSA+IG1vbnRoICYmIHByZXZZID09PSB5ZWFyKSB8fCBwcmV2WSA+IHllYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF5LmlzTmV3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocHJldk1vbnRoLnZhbHVlT2YoKSA9PT0gY3VycmVudERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgY2xhc3NOYW1lIGRpc2FibGVkXG4gICAgICAgICAgICAgICAgLy8gaWYgKChtaW5EYXRlICYmIHByZXZNb250aC52YWx1ZU9mKCkgPCBtaW5EYXRlKSB8fCAobWF4RGF0ZSAmJiBwcmV2TW9udGgudmFsdWVPZigpID4gbWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAvLyB3ZWVrIGRpc2FibGVkXG4gICAgICAgICAgICAgICAgLy8gaWYgKHRoaXMucHJvcHMuZGF5c09mV2Vla0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gICBfcmVmID0gdGhpcy5wcm9wcy5kYXlzT2ZXZWVrRGlzYWJsZWQ7XG4gICAgICAgICAgICAgICAgLy8gICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgaSA9IF9yZWZbX2ldO1xuICAgICAgICAgICAgICAgIC8vICAgICBpZiAocHJldk1vbnRoLmdldERheSgpID09PSB0aGlzLnByb3BzLmRheXNPZldlZWtEaXNhYmxlZFtpXSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgY2VsbHMucHVzaChkYXkpO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIHRyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZNb250aC5nZXREYXkoKSA9PT0gd2Vla0VuZCkge1xuICAgICAgICAgICAgICAgICAgICBkYXlzLnB1c2goY2VsbHMpO1xuICAgICAgICAgICAgICAgICAgICBjZWxscyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByZXZNb250aC5zZXREYXRlKHByZXZNb250aC5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRheXM7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZmlsdGVyczoge1xuICAgICAgICBsb2NhbGUobnVtKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIDE6ICfkuIAnXG4gICAgICAgICAgICAgICAgLCAyOiAn5LqMJ1xuICAgICAgICAgICAgICAgICwgMzogJ+S4iSdcbiAgICAgICAgICAgICAgICAsIDQ6ICflm5snXG4gICAgICAgICAgICAgICAgLCA1OiAn5LqUJ1xuICAgICAgICAgICAgICAgICwgNjogJ+WFrSdcbiAgICAgICAgICAgICAgICAsIDc6ICfml6UnXG4gICAgICAgICAgICB9W251bV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9jYWxNb250aChudW0pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgMDogJ+S4gOaciCcsXG4gICAgICAgICAgICAgICAgMTogJ+S6jOaciCcsXG4gICAgICAgICAgICAgICAgMjogJ+S4ieaciCcsXG4gICAgICAgICAgICAgICAgMzogJ+Wbm+aciCcsXG4gICAgICAgICAgICAgICAgNDogJ+S6lOaciCcsXG4gICAgICAgICAgICAgICAgNTogJ+WFreaciCcsXG4gICAgICAgICAgICAgICAgNjogJ+S4g+aciCcsXG4gICAgICAgICAgICAgICAgNzogJ+WFq+aciCcsXG4gICAgICAgICAgICAgICAgODogJ+S5neaciCcsXG4gICAgICAgICAgICAgICAgOTogJ+WNgeaciCcsXG4gICAgICAgICAgICAgICAgMTA6ICfljYHkuIDmnIgnLFxuICAgICAgICAgICAgICAgIDExOiAn5Y2B5LqM5pyIJ1xuICAgICAgICAgICAgfVtudW1dO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcblxuICAgICAgICBwcmV2TW9udGgoKSB7XG4gICAgICAgICAgICB2YXIgdmlld0RhdGUgPSB0aGlzLnZpZXdEYXRlO1xuICAgICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh2aWV3RGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICAgICAgbmV3RGF0ZS5zZXRNb250aCh2aWV3RGF0ZS5nZXRNb250aCgpIC0gMSk7XG4gICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gbmV3RGF0ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93TW9udGhzKCkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgncGlja2VyLnZpZXdjaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgZGF5czogZmFsc2UsXG4gICAgICAgICAgICAgICAgbW9udGhzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHllYXJzOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dE1vbnRoKCkge1xuICAgICAgICAgICAgdmFyIHZpZXdEYXRlID0gdGhpcy52aWV3RGF0ZTtcbiAgICAgICAgICAgIHZhciBuZXdEYXRlID0gbmV3IERhdGUodmlld0RhdGUudmFsdWVPZigpKTtcbiAgICAgICAgICAgIG5ld0RhdGUuc2V0TW9udGgodmlld0RhdGUuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICAgICAgdGhpcy52aWV3RGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2VsZWN0ZWREYXRlKGRheSkge1xuICAgICAgICAgICAgaWYgKGRheS5pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmlld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBpZiAoZGF5LmlzTmV3KSB7XG4gICAgICAgICAgICAgICAgdmlld0RhdGUuc2V0TW9udGgodmlld0RhdGUuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXkuaXNPbGQpIHtcbiAgICAgICAgICAgICAgICB2aWV3RGF0ZS5zZXRNb250aCh2aWV3RGF0ZS5nZXRNb250aCgpIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aWV3RGF0ZS5zZXREYXRlKGRheS5zaG93KTtcbiAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSB2aWV3RGF0ZTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gbmV3IERhdGUodmlld0RhdGUudmFsdWVPZigpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbjwvc2NyaXB0PlxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZGF5c3BpY2tlci52dWU/MzY4ZDAwNWFcbiAqKi8iLCJleHBvcnRzLnJlcGFpbnRUcmlnZ2VyID0gZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gZWwub2Zmc2V0SGVpZ2h0O1xufTtcblxuZXhwb3J0cy5ub29wID0gZnVuY3Rpb24oKSB7IHJldHVybiBudWxsOyB9O1xuXG5leHBvcnRzLmRhdGVVdGlscyA9IHtcbiAgICBpc0xlYXBZZWFyOiBmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoKCh5ZWFyICUgNCA9PT0gMCkgJiYgKHllYXIgJSAxMDAgIT09IDApKSB8fCAoeWVhciAlIDQwMCA9PT0gMCkpO1xuICAgIH0sXG5cbiAgICBnZXREYXlzSW5Nb250aDogZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIFszMSwgKHRoaXMuaXNMZWFwWWVhcih5ZWFyKSA/IDI5IDogMjgpLFxuICAgICAgICAgICAgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdW21vbnRoXTtcbiAgICB9LFxuXG4gICAgZ2V0TG9jYWxlOiBmdW5jdGlvbihsb2NhbGUpIHtcbiAgICAgICAgaWYgKCFsb2NhbGUpIHtcbiAgICAgICAgICAgIGxvY2FsZSA9IG5hdmlnYXRvci5sYW5ndWFnZSAmJiBuYXZpZ2F0b3IubGFuZ3VhZ2Uuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGxvY2FsZVsxXSA9IGxvY2FsZVsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgbG9jYWxlID0gbG9jYWxlLmpvaW4oJ18nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGVzW2xvY2FsZV0gfHwgbG9jYWxlc1snZW5fVVMnXTtcbiAgICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdXRpbHMvaW5kZXguanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuXFxuPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1kYXlzXFxcIj5cXG4gICAgPHRhYmxlIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRhYmxlXFxcIj5cXG4gICAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0ciBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1oZWFkZXJcXFwiPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1wcmV2XFxcIiB2LW9uOmNsaWNrPVxcXCJwcmV2TW9udGhcXFwiPlxcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1wcmV2LWljb25cXFwiPjwvaT5cXG4gICAgICAgICAgICA8L3RoPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1zd2l0Y2hcXFwiIGNvbHNwYW49XFxcIjVcXFwiIHYtb246Y2xpY2s9XFxcInNob3dNb250aHNcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXNlbGVjdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICB7eyB2aWV3RGF0ZS5nZXRGdWxsWWVhcigpIH19IOW5tCB7eyB2aWV3RGF0ZS5nZXRNb250aCgpIHwgbG9jYWxNb250aCB9fVxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L3RoPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1uZXh0XFxcIiB2LW9uOmNsaWNrPVxcXCJuZXh0TW9udGhcXFwiPlxcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1uZXh0LWljb25cXFwiPjwvaT5cXG4gICAgICAgICAgICA8L3RoPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGggY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItZG93XFxcIiB2LWZvcj1cXFwiZGF5IGluIHdlZWtzXFxcIj57eyBkYXkgfCBsb2NhbGUgfX08L3RoPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDwvdGhlYWQ+XFxuICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgPHRyIHYtZm9yPVxcXCJyb3cgaW4gZGF5c1xcXCI+XFxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1kYXlcXFwiIHYtZm9yPVxcXCJkYXkgaW4gcm93XFxcIlxcbiAgICAgICAgICAgICAgICB2LWJpbmQ6Y2xhc3M9XFxcIntcXG4gICAgICAgICAgICAgICAgICAgICdhbS1kaXNhYmxlZCc6IGRheS5pc0Rpc2FibGVkLFxcbiAgICAgICAgICAgICAgICAgICAgJ2FtLWFjdGl2ZSc6IGRheS5pc0FjdGl2ZSxcXG4gICAgICAgICAgICAgICAgICAgICdhbS1kYXRlcGlja2VyLW9sZCc6IGRheS5pc09sZCxcXG4gICAgICAgICAgICAgICAgICAgICdhbS1kYXRlcGlja2VyLW5ldyc6IGRheS5pc05ld1xcbiAgICAgICAgICAgICAgICB9XFxcIlxcbiAgICAgICAgICAgICAgICB2LW9uOmNsaWNrPVxcXCJzZXRTZWxlY3RlZERhdGUoZGF5KVxcXCI+e3sgZGF5LnNob3cgfX08L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICA8L3Rib2R5PlxcbiAgICA8L3RhYmxlPlxcbjwvZGl2PlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9zcmMvZGF0ZXRpbWVwaWNrZXIvZGF5c3BpY2tlci52dWVcbiAqKiBtb2R1bGUgaWQgPSA5MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxuX192dWVfc2NyaXB0X18gPSByZXF1aXJlKFwiISFiYWJlbC1sb2FkZXI/cHJlc2V0c1tdPWVzMjAxNSZwbHVnaW5zW109dHJhbnNmb3JtLXJ1bnRpbWUmY29tbWVudHM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL21vbnRoc3BpY2tlci52dWVcIilcbmlmIChfX3Z1ZV9zY3JpcHRfXyAmJlxuICAgIF9fdnVlX3NjcmlwdF9fLl9fZXNNb2R1bGUgJiZcbiAgICBPYmplY3Qua2V5cyhfX3Z1ZV9zY3JpcHRfXykubGVuZ3RoID4gMSkge1xuICBjb25zb2xlLndhcm4oXCJbdnVlLWxvYWRlcl0gc3JjXFxcXGRhdGV0aW1lcGlja2VyXFxcXG1vbnRoc3BpY2tlci52dWU6IG5hbWVkIGV4cG9ydHMgaW4gKi52dWUgZmlsZXMgYXJlIGlnbm9yZWQuXCIpfVxuX192dWVfdGVtcGxhdGVfXyA9IHJlcXVpcmUoXCIhIXZ1ZS1odG1sP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vbW9udGhzcGlja2VyLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtNmViYTVmZjYvbW9udGhzcGlja2VyLnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9kYXRldGltZXBpY2tlci9tb250aHNwaWNrZXIudnVlXG4gKiogbW9kdWxlIGlkID0gOTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIjx0ZW1wbGF0ZT5cblxuPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItbW9udGhzXCI+XG4gICAgPHRhYmxlIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci10YWJsZVwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0ciBjbGFzcz1cImFtLWRhdGVwaWNrZXItaGVhZGVyXCI+XG4gICAgICAgICAgICA8dGggY2xhc3M9XCJhbS1kYXRlcGlja2VyLXByZXZcIiB2LW9uOmNsaWNrPVwicHJldlllYXJcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImFtLWRhdGVwaWNrZXItcHJldi1pY29uXCI+PC9pPlxuICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgIDx0aCBjbGFzcz1cImFtLWRhdGVwaWNrZXItc3dpdGNoXCIgY29sc3Bhbj1cIjVcIiB2LW9uOmNsaWNrPVwic2hvd1llYXJzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItc2VsZWN0XCI+XG4gICAgICAgICAgICAgICAgICAgIHt7IHZpZXdEYXRlLmdldEZ1bGxZZWFyKCkgfX0g5bm0XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1uZXh0XCIgdi1vbjpjbGljaz1cIm5leHRZZWFyXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJhbS1kYXRlcGlja2VyLW5leHQtaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDwvdGg+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjdcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbS1kYXRlcGlja2VyLW1vbnRoXCIgdi1mb3I9XCJtb250aCBpbiBtb250aHNcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2FtLWFjdGl2ZSc6IG1vbnRoLmlzQWN0aXZlfVwiIHYtb246Y2xpY2s9XCJzZXRWaWV3TW9udGgobW9udGgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7eyBtb250aC5zaG93IHwgbG9jYWxNb250aCB9fVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGJvZHk+XG4gICAgPC90YWJsZT5cbjwvZGl2PlxuXG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgICBwcm9wczoge1xuICAgICAgICBzZWxlY3RlZERhdGU6IHtcbiAgICAgICAgICAgIHR3b1dheTogdHJ1ZSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdEYXRlOiB7XG4gICAgICAgICAgICB0d29XYXk6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgcHJldlllYXIoKSB7XG4gICAgICAgICAgICB2YXIgdmlld0RhdGUgPSB0aGlzLnZpZXdEYXRlO1xuICAgICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh2aWV3RGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICAgICAgbmV3RGF0ZS5zZXRGdWxsWWVhcih2aWV3RGF0ZS5nZXRGdWxsWWVhcigpIC0gMSk7XG4gICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gbmV3RGF0ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93WWVhcnMoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwaWNrZXIudmlld2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBkYXlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtb250aHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHllYXJzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0WWVhcigpIHtcbiAgICAgICAgICAgIHZhciB2aWV3RGF0ZSA9IHRoaXMudmlld0RhdGU7XG4gICAgICAgICAgICB2YXIgbmV3RGF0ZSA9IG5ldyBEYXRlKHZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBuZXdEYXRlLnNldEZ1bGxZZWFyKHZpZXdEYXRlLmdldEZ1bGxZZWFyKCkgKyAxKTtcbiAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXdEYXRlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFZpZXdNb250aChtb250aCkge1xuICAgICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBuZXdEYXRlLnNldE1vbnRoKG1vbnRoLnNob3cpO1xuICAgICAgICAgICAgdGhpcy52aWV3RGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwaWNrZXIudmlld2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBkYXlzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vbnRoczogZmFsc2UsXG4gICAgICAgICAgICAgICAgeWVhcnM6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgICBtb250aHMoKSB7XG4gICAgICAgICAgICB2YXIgbW9udGggPSB0aGlzLnNlbGVjdGVkRGF0ZS5nZXRNb250aCgpO1xuICAgICAgICAgICAgdmFyIHllYXIgPSB0aGlzLnNlbGVjdGVkRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgdmFyIG1vbnRocyA9IFtdO1xuICAgICAgICAgICAgLy8gdmFyIG1pbkRhdGUgPSB0aGlzLnByb3BzLm1pbkRhdGUgJiYgZmVjaGEucGFyc2UodGhpcy5wcm9wcy5taW5EYXRlKTtcbiAgICAgICAgICAgIC8vIHZhciBtYXhEYXRlID0gdGhpcy5wcm9wcy5tYXhEYXRlICYmIGZlY2hhLnBhcnNlKHRoaXMucHJvcHMubWF4RGF0ZSk7XG4gICAgICAgICAgICB2YXIgcHJldk1vbnRoID0gbmV3IERhdGUoeWVhciwgbW9udGgpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEyOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9udGggPSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3c6IGksXG4gICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52aWV3RGF0ZS5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmIGkgPT09IG1vbnRoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbnRoLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgY2xhc3NOYW1lIGRpc2FibGVkXG4gICAgICAgICAgICAgICAgLy8gaWYgKChtaW5EYXRlICYmIHByZXZNb250aC52YWx1ZU9mKCkgPCBtaW5EYXRlKVxuICAgICAgICAgICAgICAgIC8vICAgfHwgKG1heERhdGUgJiYgcHJldk1vbnRoLnZhbHVlT2YoKSA+IG1heERhdGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gICBjbGFzc2VzW3RoaXMuc2V0Q2xhc3NOYW1lc3BhY2UoJ2Rpc2FibGVkJyldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICBtb250aHMucHVzaChtb250aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vbnRocztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBmaWx0ZXJzOiB7XG4gICAgICAgIGxvY2FsTW9udGgobnVtKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIDA6ICfkuIDmnIgnLFxuICAgICAgICAgICAgICAgIDE6ICfkuozmnIgnLFxuICAgICAgICAgICAgICAgIDI6ICfkuInmnIgnLFxuICAgICAgICAgICAgICAgIDM6ICflm5vmnIgnLFxuICAgICAgICAgICAgICAgIDQ6ICfkupTmnIgnLFxuICAgICAgICAgICAgICAgIDU6ICflha3mnIgnLFxuICAgICAgICAgICAgICAgIDY6ICfkuIPmnIgnLFxuICAgICAgICAgICAgICAgIDc6ICflhavmnIgnLFxuICAgICAgICAgICAgICAgIDg6ICfkuZ3mnIgnLFxuICAgICAgICAgICAgICAgIDk6ICfljYHmnIgnLFxuICAgICAgICAgICAgICAgIDEwOiAn5Y2B5LiA5pyIJyxcbiAgICAgICAgICAgICAgICAxMTogJ+WNgeS6jOaciCdcbiAgICAgICAgICAgIH1bbnVtXTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcblxuPC9zY3JpcHQ+XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBtb250aHNwaWNrZXIudnVlPzcxZDU2NDhhXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcblxcbjxkaXYgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItbW9udGhzXFxcIj5cXG4gICAgPHRhYmxlIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRhYmxlXFxcIj5cXG4gICAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0ciBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1oZWFkZXJcXFwiPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1wcmV2XFxcIiB2LW9uOmNsaWNrPVxcXCJwcmV2WWVhclxcXCI+XFxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXByZXYtaWNvblxcXCI+PC9pPlxcbiAgICAgICAgICAgIDwvdGg+XFxuICAgICAgICAgICAgPHRoIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXN3aXRjaFxcXCIgY29sc3Bhbj1cXFwiNVxcXCIgdi1vbjpjbGljaz1cXFwic2hvd1llYXJzXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1zZWxlY3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAge3sgdmlld0RhdGUuZ2V0RnVsbFllYXIoKSB9fSDlubRcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC90aD5cXG4gICAgICAgICAgICA8dGggY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItbmV4dFxcXCIgdi1vbjpjbGljaz1cXFwibmV4dFllYXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1uZXh0LWljb25cXFwiPjwvaT5cXG4gICAgICAgICAgICA8L3RoPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDwvdGhlYWQ+XFxuICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiN1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1tb250aFxcXCIgdi1mb3I9XFxcIm1vbnRoIGluIG1vbnRoc1xcXCIgdi1iaW5kOmNsYXNzPVxcXCJ7J2FtLWFjdGl2ZSc6IG1vbnRoLmlzQWN0aXZlfVxcXCIgdi1vbjpjbGljaz1cXFwic2V0Vmlld01vbnRoKG1vbnRoKVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAge3sgbW9udGguc2hvdyB8IGxvY2FsTW9udGggfX1cXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90Ym9keT5cXG4gICAgPC90YWJsZT5cXG48L2Rpdj5cXG5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtaHRtbC1sb2FkZXI/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL2RhdGV0aW1lcGlja2VyL21vbnRoc3BpY2tlci52dWVcbiAqKiBtb2R1bGUgaWQgPSA5NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxuX192dWVfc2NyaXB0X18gPSByZXF1aXJlKFwiISFiYWJlbC1sb2FkZXI/cHJlc2V0c1tdPWVzMjAxNSZwbHVnaW5zW109dHJhbnNmb3JtLXJ1bnRpbWUmY29tbWVudHM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL3llYXJzcGlja2VyLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxcZGF0ZXRpbWVwaWNrZXJcXFxceWVhcnNwaWNrZXIudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3llYXJzcGlja2VyLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtMjY5NmM3M2YveWVhcnNwaWNrZXIudnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2RhdGV0aW1lcGlja2VyL3llYXJzcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDk2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCI8dGVtcGxhdGU+XG5cbjxkaXYgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXllYXJzXCI+XG4gICAgPHRhYmxlIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci10YWJsZVwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0ciBjbGFzcz1cImFtLWRhdGVwaWNrZXItaGVhZGVyXCI+XG4gICAgICAgICAgICA8dGggY2xhc3M9XCJhbS1kYXRlcGlja2VyLXByZXZcIiB2LW9uOmNsaWNrPVwicHJldkRlY2FkZVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1wcmV2LWljb25cIj48L2k+XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1zd2l0Y2hcIiBjb2xzcGFuPVwiNVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgICAgICB7eyBzaG93WWVhciB9fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgIDx0aCBjbGFzcz1cImFtLWRhdGVwaWNrZXItbmV4dFwiIHYtb246Y2xpY2s9XCJuZXh0RGVjYWRlXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJhbS1kYXRlcGlja2VyLW5leHQtaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDwvdGg+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjdcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbS1kYXRlcGlja2VyLXllYXJcIiB2LWZvcj1cInllYXIgaW4geWVhcnNcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2FtLWRhdGVwaWNrZXItb2xkJzogeWVhci5pc09sZCwgJ2FtLWRhdGVwaWNrZXItbmV3JzogeWVhci5pc05ldywgJ2FtLWFjdGl2ZSc6IHllYXIuaXNBY3RpdmV9XCIgdi1vbjpjbGljaz1cInNldFZpZXdZZWFyKHllYXIpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7eyB5ZWFyLnNob3cgfX1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG48L2Rpdj5cblxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgcHJvcHM6IHtcbiAgICAgICAgc2VsZWN0ZWREYXRlOiB7XG4gICAgICAgICAgICB0d29XYXk6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB2aWV3RGF0ZToge1xuICAgICAgICAgICAgdHdvV2F5OiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgICB5ZWFycygpIHtcblxuICAgICAgICAgICAgdmFyIHllYXJzID0gW107XG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICAgICAgdmFyIHllYXIgPSBwYXJzZUludCh0aGlzLnZpZXdEYXRlLmdldEZ1bGxZZWFyKCkgLyAxMCwgMTApICogMTA7XG5cbiAgICAgICAgICAgIHllYXItLTtcblxuICAgICAgICAgICAgd2hpbGUgKGkgPCAxMSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIF95ZWFyID0ge1xuICAgICAgICAgICAgICAgICAgICBzaG93OiB5ZWFyLFxuICAgICAgICAgICAgICAgICAgICBpc09sZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV3OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBfeWVhci5pc09sZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSAxMCkge1xuICAgICAgICAgICAgICAgICAgICBfeWVhci5pc05ldyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWREYXRlLmdldEZ1bGxZZWFyKCkgPT09IHllYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgX3llYXIuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHllYXJzLnB1c2goX3llYXIpO1xuXG4gICAgICAgICAgICAgICAgeWVhcisrO1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHllYXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dZZWFyKCkge1xuICAgICAgICAgICAgdmFyIHllYXIgPSBwYXJzZUludCh0aGlzLnZpZXdEYXRlLmdldEZ1bGxZZWFyKCkgLyAxMCwgMTApICogMTA7XG4gICAgICAgICAgICB2YXIgYWRkWWVhciA9IHllYXIgKyA5O1xuICAgICAgICAgICAgcmV0dXJuIHllYXIgKyAnLScgKyBhZGRZZWFyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgcHJldkRlY2FkZSgpIHtcbiAgICAgICAgICAgIHZhciB2aWV3RGF0ZSA9IHRoaXMudmlld0RhdGU7XG4gICAgICAgICAgICB2YXIgbmV3RGF0ZSA9IG5ldyBEYXRlKHZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBuZXdEYXRlLnNldEZ1bGxZZWFyKHZpZXdEYXRlLmdldEZ1bGxZZWFyKCkgLSAxMCk7XG4gICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gbmV3RGF0ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0RGVjYWRlKCkge1xuICAgICAgICAgICAgdmFyIHZpZXdEYXRlID0gdGhpcy52aWV3RGF0ZTtcbiAgICAgICAgICAgIHZhciBuZXdEYXRlID0gbmV3IERhdGUodmlld0RhdGUudmFsdWVPZigpKTtcbiAgICAgICAgICAgIG5ld0RhdGUuc2V0RnVsbFllYXIodmlld0RhdGUuZ2V0RnVsbFllYXIoKSArIDEwKTtcbiAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXdEYXRlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFZpZXdZZWFyKHllYXIpIHtcbiAgICAgICAgICAgIHZhciBuZXdEYXRlID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICAgICAgbmV3RGF0ZS5zZXRGdWxsWWVhcih5ZWFyLnNob3cpO1xuICAgICAgICAgICAgdGhpcy52aWV3RGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwaWNrZXIudmlld2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBkYXlzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtb250aHM6IHRydWUsXG4gICAgICAgICAgICAgICAgeWVhcnM6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59O1xuXG48L3NjcmlwdD5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHllYXJzcGlja2VyLnZ1ZT8zOWFlMWExYVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG5cXG48ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXllYXJzXFxcIj5cXG4gICAgPHRhYmxlIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRhYmxlXFxcIj5cXG4gICAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0ciBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1oZWFkZXJcXFwiPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1wcmV2XFxcIiB2LW9uOmNsaWNrPVxcXCJwcmV2RGVjYWRlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItcHJldi1pY29uXFxcIj48L2k+XFxuICAgICAgICAgICAgPC90aD5cXG4gICAgICAgICAgICA8dGggY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItc3dpdGNoXFxcIiBjb2xzcGFuPVxcXCI1XFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1zZWxlY3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAge3sgc2hvd1llYXIgfX1cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC90aD5cXG4gICAgICAgICAgICA8dGggY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItbmV4dFxcXCIgdi1vbjpjbGljaz1cXFwibmV4dERlY2FkZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLW5leHQtaWNvblxcXCI+PC9pPlxcbiAgICAgICAgICAgIDwvdGg+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90aGVhZD5cXG4gICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI3XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXllYXJcXFwiIHYtZm9yPVxcXCJ5ZWFyIGluIHllYXJzXFxcIiB2LWJpbmQ6Y2xhc3M9XFxcInsnYW0tZGF0ZXBpY2tlci1vbGQnOiB5ZWFyLmlzT2xkLCAnYW0tZGF0ZXBpY2tlci1uZXcnOiB5ZWFyLmlzTmV3LCAnYW0tYWN0aXZlJzogeWVhci5pc0FjdGl2ZX1cXFwiIHYtb246Y2xpY2s9XFxcInNldFZpZXdZZWFyKHllYXIpXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICB7eyB5ZWFyLnNob3cgfX1cXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90Ym9keT5cXG4gICAgPC90YWJsZT5cXG48L2Rpdj5cXG5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtaHRtbC1sb2FkZXI/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL2RhdGV0aW1lcGlja2VyL3llYXJzcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDk4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuXFxuPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1ib2R5XFxcIj5cXG4gICAgPGRheXMtcGlja2VyXFxuICAgICAgICAgICAgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cXFwic2VsZWN0ZWREYXRlXFxcIlxcbiAgICAgICAgICAgIHYtYmluZDp2aWV3LWRhdGUuc3luYz1cXFwidmlld0RhdGVcXFwiXFxuICAgICAgICAgICAgdi1zaG93PVxcXCJzaG93LmRheXNcXFwiXFxuICAgICAgICAgICAgQHBpY2tlci52aWV3Y2hhbmdlPVxcXCJjaGFuZ3Nob3dcXFwiPlxcbiAgICA8L2RheXMtcGlja2VyPlxcbiAgICA8bW9udGhzLXBpY2tlclxcbiAgICAgICAgICAgIHYtYmluZDpzZWxlY3RlZC1kYXRlLnN5bmM9XFxcInNlbGVjdGVkRGF0ZVxcXCJcXG4gICAgICAgICAgICB2LWJpbmQ6dmlldy1kYXRlLnN5bmM9XFxcInZpZXdEYXRlXFxcIlxcbiAgICAgICAgICAgIHYtc2hvdz1cXFwic2hvdy5tb250aHNcXFwiXFxuICAgICAgICAgICAgQHBpY2tlci52aWV3Y2hhbmdlPVxcXCJjaGFuZ3Nob3dcXFwiPlxcbiAgICAgICAgPC9tb250aHMtcGlja2VyPlxcbiAgICA8eWVhcnMtcGlja2VyXFxuICAgICAgICAgICAgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cXFwic2VsZWN0ZWREYXRlXFxcIlxcbiAgICAgICAgICAgIHYtYmluZDp2aWV3LWRhdGUuc3luYz1cXFwidmlld0RhdGVcXFwiXFxuICAgICAgICAgICAgdi1zaG93PVxcXCJzaG93LnllYXJzXFxcIlxcbiAgICAgICAgICAgIEBwaWNrZXIudmlld2NoYW5nZT1cXFwiY2hhbmdzaG93XFxcIj5cXG4gICAgPC95ZWFycy1waWNrZXI+XFxuPC9kaXY+XFxuXFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLWh0bWwtbG9hZGVyP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9kYXRldGltZXBpY2tlci9kYXRlcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDk5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5fX3Z1ZV9zY3JpcHRfXyA9IHJlcXVpcmUoXCIhIWJhYmVsLWxvYWRlcj9wcmVzZXRzW109ZXMyMDE1JnBsdWdpbnNbXT10cmFuc2Zvcm0tcnVudGltZSZjb21tZW50cz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXNjcmlwdCZpbmRleD0wIS4vdGltZXBpY2tlci52dWVcIilcbmlmIChfX3Z1ZV9zY3JpcHRfXyAmJlxuICAgIF9fdnVlX3NjcmlwdF9fLl9fZXNNb2R1bGUgJiZcbiAgICBPYmplY3Qua2V5cyhfX3Z1ZV9zY3JpcHRfXykubGVuZ3RoID4gMSkge1xuICBjb25zb2xlLndhcm4oXCJbdnVlLWxvYWRlcl0gc3JjXFxcXGRhdGV0aW1lcGlja2VyXFxcXHRpbWVwaWNrZXIudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3RpbWVwaWNrZXIudnVlXCIpXG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi0wNzYxN2Y5MC90aW1lcGlja2VyLnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9kYXRldGltZXBpY2tlci90aW1lcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDEwMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48ZGl2IGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1ib2R5XCI+XG4gICAgIDxkaXYgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXRpbWUtd3JhcHBlclwiIHYtc2hvdz1cInNob3cud3JhcHBlclwiPlxuICAgICAgICAgIDx0YWJsZSBjbGFzcz1cImFtLWRhdGVwaWNrZXItdGFibGVcIj5cbiAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImFtLWRhdGVwaWNrZXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImFtLWRhdGVwaWNrZXItcHJldlwiIHYtb246Y2xpY2s9XCJwcmV2TWludXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXByZXYtaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1zd2l0Y2hcIiBjb2xzcGFuPVwiNVwiIHYtb246Y2xpY2s9XCJzaG93RGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXNlbGVjdFwiPnt7IGRhdGVTaG93IH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImFtLWRhdGVwaWNrZXItbmV4dFwiIHYtb246Y2xpY2s9XCJuZXh0TWludXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJhbS1kYXRlcGlja2VyLW5leHQtaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW0tZGF0ZXBpY2tlci10aW1lLWJveFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyB2LW9uOmNsaWNrPVwic2hvd0hvdXJzXCI+e3sgdGltZS5ob3VyIH19PC9zdHJvbmc+PGVtPjo8L2VtPjxzdHJvbmcgdi1vbjpjbGljaz1cInNob3dNaW51dGVzXCI+e3sgdGltZS5taW51dGUgfX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgIDwvdGFibGU+XG4gICAgIDwvZGl2PlxuICAgICA8aG91cnMtcGlja2VyXG4gICAgICAgICAgICB2LWJpbmQ6c2VsZWN0ZWQtZGF0ZS5zeW5jPVwic2VsZWN0ZWREYXRlXCJcbiAgICAgICAgICAgIHYtYmluZDp2aWV3LWRhdGUuc3luYz1cInZpZXdEYXRlXCJcbiAgICAgICAgICAgIHYtc2hvdz1cInNob3cuaG91cnNcIlxuICAgICAgICAgICAgQHBpY2tlci52aWV3Y2hhbmdlPVwiY2hhbmdzaG93XCI+XG4gICAgICA8L2hvdXJzLXBpY2tlcj5cbiAgICAgPG1pbnV0ZXMtcGlja2VyXG4gICAgICAgICAgICB2LWJpbmQ6c2VsZWN0ZWQtZGF0ZS5zeW5jPVwic2VsZWN0ZWREYXRlXCJcbiAgICAgICAgICAgIHYtYmluZDp2aWV3LWRhdGUuc3luYz1cInZpZXdEYXRlXCJcbiAgICAgICAgICAgIHYtc2hvdz1cInNob3cubWludXRlc1wiXG4gICAgICAgICAgICBAcGlja2VyLnZpZXdjaGFuZ2U9XCJjaGFuZ3Nob3dcIj5cbiAgICAgIDwvbWludXRlcy1waWNrZXI+XG48L2Rpdj5cblxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuaW1wb3J0IG1pbnV0ZXNQaWNrZXIgZnJvbSAnLi9taW51dGVzcGlja2VyLnZ1ZSc7XG5pbXBvcnQgaG91cnNQaWNrZXIgZnJvbSAnLi9ob3Vyc3BpY2tlci52dWUnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgICAgcHJvcHM6IHtcbiAgICAgICAgIHNlbGVjdGVkRGF0ZToge1xuICAgICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgICB0d29XYXk6IHRydWUsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgICB9XG4gICAgfSxcblxuICAgIGRhdGEoKSB7XG4gICAgICAgICB2YXIgdmlld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLnNlbGVjdGVkRGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgc2hvdzoge1xuICAgICAgICAgICAgICAgICAgIHdyYXBwZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgaG91cnM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgIG1pbnV0ZXM6IGZhbHNlXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHZpZXdEYXRlOiB2aWV3RGF0ZVxuICAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgIHRpbWUoKSB7XG4gICAgICAgICAgICAgIHZhciBob3VyID0gdGhpcy52aWV3RGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgICB2YXIgbWludXRlID0gdGhpcy52aWV3RGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgICAgICAgICAgIGlmIChtaW51dGUgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgIG1pbnV0ZSA9ICcwJyArIG1pbnV0ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaG91ciA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgaG91ciA9ICcwJyArIGhvdXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxuICAgICAgICAgICAgICAgICAgIG1pbnV0ZTogbWludXRlXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICB9LFxuICAgICAgICAgZGF0ZVNob3coKSB7XG4gICAgICAgICAgICAgIHZhciB2aWV3RGF0ZSA9IHRoaXMudmlld0RhdGU7XG4gICAgICAgICAgICAgIHZhciB5ZWFyID0gdmlld0RhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgdmFyIG1vbnRoID0gdmlld0RhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgICAgICAgIGlmIChtb250aCA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgbW9udGggPSAnMCcgKyBtb250aDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YXIgZGF0ZSA9IHZpZXdEYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgaWYgKGRhdGUgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgIGRhdGUgPSAnMCcgKyBkYXRlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAgYCR7eWVhcn0tJHttb250aH0tJHtkYXRlfWA7XG4gICAgICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgIG1pbnV0ZXNQaWNrZXIsXG4gICAgICAgICBob3Vyc1BpY2tlclxuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICAgICBzaG93SG91cnMoKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvdyA9IHtcbiAgICAgICAgICAgICAgICAgICB3cmFwcGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICBob3VyczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICBtaW51dGVzOiBmYWxzZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgfSxcblxuICAgICAgICAgc2hvd01pbnV0ZXMoKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvdyA9IHtcbiAgICAgICAgICAgICAgICAgICB3cmFwcGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICBob3VyczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgbWludXRlczogdHJ1ZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgfSxcblxuICAgICAgICAgcHJldk1pbnV0ZSgpIHtcbiAgICAgICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICAgIG5ld0RhdGUuc2V0TWludXRlcyhuZXdEYXRlLmdldE1pbnV0ZXMoKSAtIDEpO1xuICAgICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gbmV3RGF0ZTtcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSBuZXcgRGF0ZShuZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICB9LFxuXG4gICAgICAgICBuZXh0TWludXRlKCkge1xuICAgICAgICAgICAgICB2YXIgbmV3RGF0ZSA9IG5ldyBEYXRlKHRoaXMudmlld0RhdGUudmFsdWVPZigpKTtcbiAgICAgICAgICAgICAgbmV3RGF0ZS5zZXRNaW51dGVzKG5ld0RhdGUuZ2V0TWludXRlcygpICsgMSk7XG4gICAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXdEYXRlO1xuICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IG5ldyBEYXRlKG5ld0RhdGUudmFsdWVPZigpKTtcbiAgICAgICAgIH0sXG5cbiAgICAgICAgIHNob3dEYXRlKCkge1xuICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdwaWNrZXIudmlld2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgIGRhdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICB0aW1lOiBmYWxzZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgIH0sXG5cbiAgICAgICAgIGNoYW5nc2hvdyhkYXRhKSB7XG4gICAgICAgICAgICAgICB0aGlzLnNob3cgPSBkYXRhO1xuICAgICAgICAgfVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgIFwidmlldy1jaGFuZ2VcIihzaG93KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvdyA9IHNob3c7XG4gICAgICAgICB9XG4gICAgfVxuXG59O1xuXG48L3NjcmlwdD5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHRpbWVwaWNrZXIudnVlPzYyMzgzNmY1XG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxuX192dWVfc2NyaXB0X18gPSByZXF1aXJlKFwiISFiYWJlbC1sb2FkZXI/cHJlc2V0c1tdPWVzMjAxNSZwbHVnaW5zW109dHJhbnNmb3JtLXJ1bnRpbWUmY29tbWVudHM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL21pbnV0ZXNwaWNrZXIudnVlXCIpXG5pZiAoX192dWVfc2NyaXB0X18gJiZcbiAgICBfX3Z1ZV9zY3JpcHRfXy5fX2VzTW9kdWxlICYmXG4gICAgT2JqZWN0LmtleXMoX192dWVfc2NyaXB0X18pLmxlbmd0aCA+IDEpIHtcbiAgY29uc29sZS53YXJuKFwiW3Z1ZS1sb2FkZXJdIHNyY1xcXFxkYXRldGltZXBpY2tlclxcXFxtaW51dGVzcGlja2VyLnZ1ZTogbmFtZWQgZXhwb3J0cyBpbiAqLnZ1ZSBmaWxlcyBhcmUgaWdub3JlZC5cIil9XG5fX3Z1ZV90ZW1wbGF0ZV9fID0gcmVxdWlyZShcIiEhdnVlLWh0bWw/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9taW51dGVzcGlja2VyLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtZDRmMjZmNzAvbWludXRlc3BpY2tlci52dWVcIlxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoaWQsIG1vZHVsZS5leHBvcnRzKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS51cGRhdGUoaWQsIG1vZHVsZS5leHBvcnRzLCBfX3Z1ZV90ZW1wbGF0ZV9fKVxuICB9XG59KSgpfVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZGF0ZXRpbWVwaWNrZXIvbWludXRlc3BpY2tlci52dWVcbiAqKiBtb2R1bGUgaWQgPSAxMDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIjx0ZW1wbGF0ZT5cblxuPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItbWludXRlc1wiPlxuICAgIDx0YWJsZSBjbGFzcz1cImFtLWRhdGVwaWNrZXItdGFibGVcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICA8dHIgY2xhc3M9XCJhbS1kYXRlcGlja2VyLWhlYWRlclwiPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1wcmV2XCIgdi1vbjpjbGljaz1cInByZXZNaW51dGVcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImFtLWRhdGVwaWNrZXItcHJldi1pY29uXCI+PC9pPlxuICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgIDx0aCBjbGFzcz1cImFtLWRhdGVwaWNrZXItc3dpdGNoXCIgY29sc3Bhbj1cIjVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1zZWxlY3RcIj57eyBzaG93VGV4dC5ob3VyICsgJzonICsgc2hvd1RleHQubWludXRlIH19PC9kaXY+XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1uZXh0XCIgdi1vbjpjbGljaz1cIm5leHRNaW51dGVcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImFtLWRhdGVwaWNrZXItbmV4dC1pY29uXCI+PC9pPlxuICAgICAgICAgICAgPC90aD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjdcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtLWRhdGVwaWNrZXItbWludXRlXCIgdi1mb3I9XCJtIGluIG1pbnV0ZXNcIiB2LW9uOmNsaWNrPVwic2V0U2VsZWN0ZWRNaW51dGUobSlcIiB2LXRleHQ9XCJtLnNob3cgPCAxMCA/IG0uaG91ciArICc6MCcgKyBtLnNob3cgOiBtLmhvdXIgKyAnOicgKyBtLnNob3dcIj48L3NwYW4+XG4gICAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG48L2Rpdj5cblxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgcHJvcHM6IHtcbiAgICAgICAgc2VsZWN0ZWREYXRlOiB7XG4gICAgICAgICAgICB0d29XYXk6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB2aWV3RGF0ZToge1xuICAgICAgICAgICAgdHdvV2F5OiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgICBzaG93VGV4dCgpIHtcbiAgICAgICAgICAgIHZhciBob3VyID0gdGhpcy52aWV3RGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgdmFyIG1pbnV0ZSA9IHRoaXMudmlld0RhdGUuZ2V0TWludXRlcygpO1xuICAgICAgICAgICAgaWYgKG1pbnV0ZSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlID0gJzAnICsgbWludXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhvdXIgPCAxMCkge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAnMCcgKyBob3VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogbWludXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIG1pbnV0ZXMoKSB7XG4gICAgICAgICAgICB2YXIgbWludXRlID0gdGhpcy5zZWxlY3RlZERhdGUuZ2V0TWludXRlcygpO1xuICAgICAgICAgICAgdmFyIGhvdXIgPSB0aGlzLnNlbGVjdGVkRGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjA7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBfbWludXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxuICAgICAgICAgICAgICAgICAgICBzaG93OiBpLFxuICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtaW51dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX21pbnV0ZS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpICUgNSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtaW51dGVzLnB1c2goX21pbnV0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1pbnV0ZXM7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgICBwcmV2TWludXRlKCkge1xuICAgICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBuZXdEYXRlLnNldE1pbnV0ZXMobmV3RGF0ZS5nZXRNaW51dGVzKCkgLSAxKTtcbiAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXdEYXRlO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSBuZXcgRGF0ZShuZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dE1pbnV0ZSgpIHtcbiAgICAgICAgICAgIHZhciBuZXdEYXRlID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICAgICAgbmV3RGF0ZS5zZXRNaW51dGVzKG5ld0RhdGUuZ2V0TWludXRlcygpICsgMSk7XG4gICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gbmV3RGF0ZTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gbmV3IERhdGUobmV3RGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFNlbGVjdGVkTWludXRlKG1pbnV0ZSkge1xuICAgICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBuZXdEYXRlLnNldE1pbnV0ZXMobWludXRlLmhvdXIpO1xuICAgICAgICAgICAgbmV3RGF0ZS5zZXRNaW51dGVzKG1pbnV0ZS5zaG93KTtcbiAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXdEYXRlO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSBuZXcgRGF0ZShuZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdwaWNrZXIudmlld2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICB3cmFwcGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhvdXJzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtaW51dGVzOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbjwvc2NyaXB0PlxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogbWludXRlc3BpY2tlci52dWU/NDA1YjNkZjhcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuXFxuPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1taW51dGVzXFxcIj5cXG4gICAgPHRhYmxlIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRhYmxlXFxcIj5cXG4gICAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0ciBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1oZWFkZXJcXFwiPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1wcmV2XFxcIiB2LW9uOmNsaWNrPVxcXCJwcmV2TWludXRlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItcHJldi1pY29uXFxcIj48L2k+XFxuICAgICAgICAgICAgPC90aD5cXG4gICAgICAgICAgICA8dGggY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItc3dpdGNoXFxcIiBjb2xzcGFuPVxcXCI1XFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1zZWxlY3RcXFwiPnt7IHNob3dUZXh0LmhvdXIgKyAnOicgKyBzaG93VGV4dC5taW51dGUgfX08L2Rpdj5cXG4gICAgICAgICAgICA8L3RoPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1uZXh0XFxcIiB2LW9uOmNsaWNrPVxcXCJuZXh0TWludXRlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItbmV4dC1pY29uXFxcIj48L2k+XFxuICAgICAgICAgICAgPC90aD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8L3RoZWFkPlxcbiAgICAgICAgPHRib2R5PlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI3XFxcIj5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItbWludXRlXFxcIiB2LWZvcj1cXFwibSBpbiBtaW51dGVzXFxcIiB2LW9uOmNsaWNrPVxcXCJzZXRTZWxlY3RlZE1pbnV0ZShtKVxcXCIgdi10ZXh0PVxcXCJtLnNob3cgPCAxMCA/IG0uaG91ciArICc6MCcgKyBtLnNob3cgOiBtLmhvdXIgKyAnOicgKyBtLnNob3dcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDwvdGJvZHk+XFxuICAgIDwvdGFibGU+XFxuPC9kaXY+XFxuXFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLWh0bWwtbG9hZGVyP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9kYXRldGltZXBpY2tlci9taW51dGVzcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDEwNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIF9fdnVlX3NjcmlwdF9fLCBfX3Z1ZV90ZW1wbGF0ZV9fXG52YXIgX192dWVfc3R5bGVzX18gPSB7fVxuX192dWVfc2NyaXB0X18gPSByZXF1aXJlKFwiISFiYWJlbC1sb2FkZXI/cHJlc2V0c1tdPWVzMjAxNSZwbHVnaW5zW109dHJhbnNmb3JtLXJ1bnRpbWUmY29tbWVudHM9ZmFsc2UhLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL2hvdXJzcGlja2VyLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBzcmNcXFxcZGF0ZXRpbWVwaWNrZXJcXFxcaG91cnNwaWNrZXIudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL2hvdXJzcGlja2VyLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtYjgyOWM5OTAvaG91cnNwaWNrZXIudnVlXCJcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKGlkLCBtb2R1bGUuZXhwb3J0cylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkudXBkYXRlKGlkLCBtb2R1bGUuZXhwb3J0cywgX192dWVfdGVtcGxhdGVfXylcbiAgfVxufSkoKX1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2RhdGV0aW1lcGlja2VyL2hvdXJzcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDEwNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48ZGl2IGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1ob3Vyc1wiPlxuICAgIDx0YWJsZSBjbGFzcz1cImFtLWRhdGVwaWNrZXItdGFibGVcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICA8dHIgY2xhc3M9XCJhbS1kYXRlcGlja2VyLWhlYWRlclwiPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1wcmV2XCIgdi1vbjpjbGljaz1cInByZXZIb3VyXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJhbS1kYXRlcGlja2VyLXByZXYtaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICA8dGggY2xhc3M9XCJhbS1kYXRlcGlja2VyLXN3aXRjaFwiIGNvbHNwYW49XCI1XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFtLWRhdGVwaWNrZXItc2VsZWN0XCI+e3sgc2hvd1RleHQuaG91ciArICc6JyArIHNob3dUZXh0Lm1pbnV0ZSB9fTwvZGl2PlxuICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgIDx0aCBjbGFzcz1cImFtLWRhdGVwaWNrZXItbmV4dFwiIHYtb246Y2xpY2s9XCJuZXh0SG91clwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1uZXh0LWljb25cIj48L2k+XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiN1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW0tZGF0ZXBpY2tlci1ob3VyXCIgdi1mb3I9XCJoIGluIGhvdXJzXCIgdi1iaW5kOmNsYXNzPVwieydhbS1hY3RpdmUnOiBoLmlzQWN0aXZlfVwiIHYtb246Y2xpY2s9XCJzZXRTZWxlY3RlZEhvdXIoaClcIiB2LXRleHQ9XCJoLnNob3cgPCAxMCA/ICcwJyArIGguc2hvdyArICc6MDAnIDogaC5zaG93ICsgJzowMCdcIj48L3NwYW4+XG4gICAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG48L2Rpdj5cblxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgcHJvcHM6IHtcbiAgICAgICAgc2VsZWN0ZWREYXRlOiB7XG4gICAgICAgICAgICB0d29XYXk6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB2aWV3RGF0ZToge1xuICAgICAgICAgICAgdHdvV2F5OiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgICBzaG93VGV4dCgpIHtcbiAgICAgICAgICAgIHZhciBob3VyID0gdGhpcy52aWV3RGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgdmFyIG1pbnV0ZSA9IHRoaXMudmlld0RhdGUuZ2V0TWludXRlcygpO1xuICAgICAgICAgICAgaWYgKG1pbnV0ZSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlID0gJzAnICsgbWludXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhvdXIgPCAxMCkge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAnMCcgKyBob3VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBob3VyOiBob3VyLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogbWludXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGhvdXJzKCkge1xuICAgICAgICAgICAgdmFyIGhvdXIgPSB0aGlzLnNlbGVjdGVkRGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgdmFyIGhvdXJzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI0OyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2hvdXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3c6IGksXG4gICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IGhvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgX2hvdXIuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBob3Vycy5wdXNoKF9ob3VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBob3VycztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBtZXRob2RzOiB7XG4gICAgICAgIHByZXZIb3VyKCkge1xuICAgICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBuZXdEYXRlLnNldEhvdXJzKG5ld0RhdGUuZ2V0SG91cnMoKSAtIDEpO1xuICAgICAgICAgICAgdGhpcy52aWV3RGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IG5ldyBEYXRlKG5ld0RhdGUudmFsdWVPZigpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0SG91cigpIHtcbiAgICAgICAgICAgIHZhciBuZXdEYXRlID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICAgICAgbmV3RGF0ZS5zZXRIb3VycyhuZXdEYXRlLmdldEhvdXJzKCkgKyAxKTtcbiAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXdEYXRlO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSBuZXcgRGF0ZShuZXdEYXRlLnZhbHVlT2YoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2VsZWN0ZWRIb3VyKGhvdXIpIHtcbiAgICAgICAgICAgIHZhciBuZXdEYXRlID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZS52YWx1ZU9mKCkpO1xuICAgICAgICAgICAgbmV3RGF0ZS5zZXRIb3Vycyhob3VyLnNob3cpO1xuICAgICAgICAgICAgdGhpcy52aWV3RGF0ZSA9IG5ld0RhdGU7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IG5ldyBEYXRlKG5ld0RhdGUudmFsdWVPZigpKTtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3BpY2tlci52aWV3Y2hhbmdlJywge1xuICAgICAgICAgICAgICAgIHdyYXBwZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgaG91cnM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1pbnV0ZXM6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcblxuPC9zY3JpcHQ+XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBob3Vyc3BpY2tlci52dWU/N2U2NGJiNDVcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiXFxuXFxuPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1ob3Vyc1xcXCI+XFxuICAgIDx0YWJsZSBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci10YWJsZVxcXCI+XFxuICAgICAgICA8dGhlYWQ+XFxuICAgICAgICA8dHIgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItaGVhZGVyXFxcIj5cXG4gICAgICAgICAgICA8dGggY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItcHJldlxcXCIgdi1vbjpjbGljaz1cXFwicHJldkhvdXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1wcmV2LWljb25cXFwiPjwvaT5cXG4gICAgICAgICAgICA8L3RoPlxcbiAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1zd2l0Y2hcXFwiIGNvbHNwYW49XFxcIjVcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXNlbGVjdFxcXCI+e3sgc2hvd1RleHQuaG91ciArICc6JyArIHNob3dUZXh0Lm1pbnV0ZSB9fTwvZGl2PlxcbiAgICAgICAgICAgIDwvdGg+XFxuICAgICAgICAgICAgPHRoIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLW5leHRcXFwiIHYtb246Y2xpY2s9XFxcIm5leHRIb3VyXFxcIj5cXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItbmV4dC1pY29uXFxcIj48L2k+XFxuICAgICAgICAgICAgPC90aD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8L3RoZWFkPlxcbiAgICAgICAgPHRib2R5PlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI3XFxcIj5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItaG91clxcXCIgdi1mb3I9XFxcImggaW4gaG91cnNcXFwiIHYtYmluZDpjbGFzcz1cXFwieydhbS1hY3RpdmUnOiBoLmlzQWN0aXZlfVxcXCIgdi1vbjpjbGljaz1cXFwic2V0U2VsZWN0ZWRIb3VyKGgpXFxcIiB2LXRleHQ9XFxcImguc2hvdyA8IDEwID8gJzAnICsgaC5zaG93ICsgJzowMCcgOiBoLnNob3cgKyAnOjAwJ1xcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90Ym9keT5cXG4gICAgPC90YWJsZT5cXG48L2Rpdj5cXG5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi92dWUtaHRtbC1sb2FkZXI/cmVtb3ZlUmVkdW5kYW50QXR0cmlidXRlcz1mYWxzZSEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL2RhdGV0aW1lcGlja2VyL2hvdXJzcGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDEwN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcblxcbjxkaXYgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItYm9keVxcXCI+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRpbWUtd3JhcHBlclxcXCIgdi1zaG93PVxcXCJzaG93LndyYXBwZXJcXFwiPlxcbiAgICAgICAgICA8dGFibGUgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItdGFibGVcXFwiPlxcbiAgICAgICAgICAgICAgIDx0aGVhZD5cXG4gICAgICAgICAgICAgICA8dHIgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItaGVhZGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1wcmV2XFxcIiB2LW9uOmNsaWNrPVxcXCJwcmV2TWludXRlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItcHJldi1pY29uXFxcIj48L2k+XFxuICAgICAgICAgICAgICAgICAgICA8L3RoPlxcbiAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXN3aXRjaFxcXCIgY29sc3Bhbj1cXFwiNVxcXCIgdi1vbjpjbGljaz1cXFwic2hvd0RhdGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXNlbGVjdFxcXCI+e3sgZGF0ZVNob3cgfX08L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvdGg+XFxuICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XFxcImFtLWRhdGVwaWNrZXItbmV4dFxcXCIgdi1vbjpjbGljaz1cXFwibmV4dE1pbnV0ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLW5leHQtaWNvblxcXCI+PC9pPlxcbiAgICAgICAgICAgICAgICAgICAgPC90aD5cXG4gICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgIDwvdGhlYWQ+XFxuICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI3XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci10aW1lLWJveFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyB2LW9uOmNsaWNrPVxcXCJzaG93SG91cnNcXFwiPnt7IHRpbWUuaG91ciB9fTwvc3Ryb25nPjxlbT46PC9lbT48c3Ryb25nIHYtb246Y2xpY2s9XFxcInNob3dNaW51dGVzXFxcIj57eyB0aW1lLm1pbnV0ZSB9fTwvc3Ryb25nPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgPC9kaXY+XFxuICAgICA8aG91cnMtcGlja2VyXFxuICAgICAgICAgICAgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cXFwic2VsZWN0ZWREYXRlXFxcIlxcbiAgICAgICAgICAgIHYtYmluZDp2aWV3LWRhdGUuc3luYz1cXFwidmlld0RhdGVcXFwiXFxuICAgICAgICAgICAgdi1zaG93PVxcXCJzaG93LmhvdXJzXFxcIlxcbiAgICAgICAgICAgIEBwaWNrZXIudmlld2NoYW5nZT1cXFwiY2hhbmdzaG93XFxcIj5cXG4gICAgICA8L2hvdXJzLXBpY2tlcj5cXG4gICAgIDxtaW51dGVzLXBpY2tlclxcbiAgICAgICAgICAgIHYtYmluZDpzZWxlY3RlZC1kYXRlLnN5bmM9XFxcInNlbGVjdGVkRGF0ZVxcXCJcXG4gICAgICAgICAgICB2LWJpbmQ6dmlldy1kYXRlLnN5bmM9XFxcInZpZXdEYXRlXFxcIlxcbiAgICAgICAgICAgIHYtc2hvdz1cXFwic2hvdy5taW51dGVzXFxcIlxcbiAgICAgICAgICAgIEBwaWNrZXIudmlld2NoYW5nZT1cXFwiY2hhbmdzaG93XFxcIj5cXG4gICAgICA8L21pbnV0ZXMtcGlja2VyPlxcbjwvZGl2PlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9zcmMvZGF0ZXRpbWVwaWNrZXIvdGltZXBpY2tlci52dWVcbiAqKiBtb2R1bGUgaWQgPSAxMDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG5cXG48ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci1jYXJldFxcXCIgdi1pZj1cXFwiY2FyZXREaXNwbGF5ZWRcXFwiPjwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLWRhdGVcXFwiIHYtaWY9XFxcInNob3dEYXRlUGlja2VyXFxcIiB2LXNob3c9XFxcInNob3cuZGF0ZVxcXCI+XFxuICAgICAgICA8ZGF0ZS1waWNrZXIgdi1iaW5kOnNlbGVjdGVkLWRhdGUuc3luYz1cXFwiZGF0ZVRpbWVcXFwiPlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci10aW1lXFxcIiB2LWlmPVxcXCJzaG93VGltZVBpY2tlclxcXCIgdi1zaG93PVxcXCJzaG93LnRpbWVcXFwiPlxcbiAgICAgICAgPHRpbWUtcGlja2VyIHYtYmluZDpzZWxlY3RlZC1kYXRlLnN5bmM9XFxcImRhdGVUaW1lXFxcIiB2LW9uOnZpZXdjaGFuZ2U9XFxcImhhbmRsZVZpZXdDaGFuZ2VcXFwiPlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYW0tZGF0ZXBpY2tlci10b2dnbGVcXFwiIHYtaWY9XFxcInNob3dEYXRlUGlja2VyJiZzaG93VGltZVBpY2tlclxcXCIgdi1zaG93PVxcXCJzaG93LmRhdGVcXFwiIHYtb246Y2xpY2s9XFxcImhhbmRsZVRvZ2dsZVRpbWVcXFwiPlxcbiAgICAgICAgPGkgY2xhc3M9XFxcImFtLWljb24tZncgYW0taWNvbi1jbG9jay1vXFxcIj48L2k+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhbS1kYXRlcGlja2VyLXRvZ2dsZVxcXCIgdi1pZj1cXFwic2hvd0RhdGVQaWNrZXImJnNob3dUaW1lUGlja2VyXFxcIiB2LXNob3c9XFxcInNob3cudGltZVxcXCIgdi1vbjpjbGljaz1cXFwiaGFuZGxlVG9nZ2xlRGF0ZVxcXCI+XFxuICAgICAgICA8aSBjbGFzcz1cXFwiYW0taWNvbi1mdyBhbS1pY29uLWNhbGVuZGFyXFxcIj48L2k+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9zcmMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVwaWNrZXIudnVlXG4gKiogbW9kdWxlIGlkID0gMTA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5fX3Z1ZV9zY3JpcHRfXyA9IHJlcXVpcmUoXCIhIWJhYmVsLWxvYWRlcj9wcmVzZXRzW109ZXMyMDE1JnBsdWdpbnNbXT10cmFuc2Zvcm0tcnVudGltZSZjb21tZW50cz1mYWxzZSEuLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXNjcmlwdCZpbmRleD0wIS4vZGF0ZXRpbWVpbnB1dC52dWVcIilcbmlmIChfX3Z1ZV9zY3JpcHRfXyAmJlxuICAgIF9fdnVlX3NjcmlwdF9fLl9fZXNNb2R1bGUgJiZcbiAgICBPYmplY3Qua2V5cyhfX3Z1ZV9zY3JpcHRfXykubGVuZ3RoID4gMSkge1xuICBjb25zb2xlLndhcm4oXCJbdnVlLWxvYWRlcl0gc3JjXFxcXGRhdGV0aW1lcGlja2VyXFxcXGRhdGV0aW1laW5wdXQudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL2RhdGV0aW1laW5wdXQudnVlXCIpXG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi02ZDFmNDY0YS9kYXRldGltZWlucHV0LnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZWlucHV0LnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDExMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48ZGl2IGNsYXNzPVwiYW0tZm9ybS1ncm91cFwiIHYtZWw6cG9zLW9iaj5cbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImFtLWZvcm0tZmllbGRcIiB2LW1vZGVsPVwiZGF0ZVRpbWVcIiB2LW9uOmNsaWNrPVwiaGFuZGxlQ2xpY2tcIj5cbjwvZGl2PlxuPGRhdGUtdGltZS1waWNrZXIgdi1pZj1cInNob3dcIiBjYXJldC1kaXNwbGF5ZWQgdi1iaW5kOnN0eWxlPVwicG9zXCJcbiAgICB2LWJpbmQ6ZGF0ZS10aW1lLnN5bmM9XCJkYXRlVGltZURhdGVcIlxuICAgIHYtYmluZDpzaG93LWRhdGUtcGlja2VyPVwiIXRpbWVPbmx5XCJcbiAgICB2LWJpbmQ6c2hvdy10aW1lLXBpY2tlcj1cIiFkYXRlT25seVwiPlxuPC9kYXRlLXRpbWUtcGlja2VyPlxuXG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuXG5pbXBvcnQgZGF0ZVRpbWVQaWNrZXIgZnJvbSAnLi9kYXRldGltZXBpY2tlci52dWUnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgICBwcm9wczoge1xuICAgICAgICBkYXRlVGltZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdHdvV2F5OiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZGF0ZU9ubHk6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB0aW1lT25seToge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICBkYXRlVGltZVBpY2tlclxuICAgIH0sXG5cbiAgICBkYXRhKCkge1xuICAgICAgICB2YXIgZGF0ZVRpbWVEYXRlID0gbmV3IERhdGUodGhpcy5kYXRlVGltZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICAgIHBvczoge1xuICAgICAgICAgICAgICAgIFwidG9wXCI6ICcnLFxuICAgICAgICAgICAgICAgIFwibGVmdFwiOiAnJyxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uXCI6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDExMjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRlVGltZURhdGU6IGRhdGVUaW1lRGF0ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgICBkYXRlVGltZURhdGUoZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZSA9IGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHtkYXRlLmdldE1vbnRoKCkgKyAxfS0ke2RhdGUuZ2V0RGF0ZSgpfSAke2RhdGUuZ2V0SG91cnMoKX06JHtkYXRlLmdldE1pbnV0ZXMoKX1gO1xuICAgICAgICAgICAgdGhpcy5zaG93ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuXG4gICAgICAgIGhhbmRsZUNsaWNrKCkge1xuICAgICAgICAgICAgdmFyIHBvc09iaiA9IHRoaXMuJGVscy5wb3NPYmo7XG4gICAgICAgICAgICB0aGlzLnBvcy50b3AgPSBwb3NPYmoub2Zmc2V0VG9wICsgcG9zT2JqLm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICAgICAgICB0aGlzLnBvcy5sZWZ0ID0gcG9zT2JqLm9mZnNldExlZnQgKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5zaG93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcblxuPC9zY3JpcHQ+XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBkYXRldGltZWlucHV0LnZ1ZT9jZGJjNGRmNlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG5cXG48ZGl2IGNsYXNzPVxcXCJhbS1mb3JtLWdyb3VwXFxcIiB2LWVsOnBvcy1vYmo+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiYW0tZm9ybS1maWVsZFxcXCIgdi1tb2RlbD1cXFwiZGF0ZVRpbWVcXFwiIHYtb246Y2xpY2s9XFxcImhhbmRsZUNsaWNrXFxcIj5cXG48L2Rpdj5cXG48ZGF0ZS10aW1lLXBpY2tlciB2LWlmPVxcXCJzaG93XFxcIiBjYXJldC1kaXNwbGF5ZWQgdi1iaW5kOnN0eWxlPVxcXCJwb3NcXFwiXFxuICAgIHYtYmluZDpkYXRlLXRpbWUuc3luYz1cXFwiZGF0ZVRpbWVEYXRlXFxcIlxcbiAgICB2LWJpbmQ6c2hvdy1kYXRlLXBpY2tlcj1cXFwiIXRpbWVPbmx5XFxcIlxcbiAgICB2LWJpbmQ6c2hvdy10aW1lLXBpY2tlcj1cXFwiIWRhdGVPbmx5XFxcIj5cXG48L2RhdGUtdGltZS1waWNrZXI+XFxuXFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vdnVlLWh0bWwtbG9hZGVyP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi9+L3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9kYXRldGltZXBpY2tlci9kYXRldGltZWlucHV0LnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDExMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcblxcbjxkaXY+XFxuICAgIDxidXR0b24gY2xhc3M9XFxcImFtLWJ0biBhbS1idG4tZGVmYXVsdFxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiB2LW9uOmNsaWNrPVxcXCJzaG93TW9kYWw9dHJ1ZVxcXCI+b3BlbiBtb2RhbDwvYnV0dG9uPlxcbiAgICAmbmJzcDsmbmJzcDtcXG4gICAgPGJ1dHRvbiBjbGFzcz1cXFwiYW0tYnRuIGFtLWJ0bi1wcmltYXJ5XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIHYtb246Y2xpY2s9XFxcImNsaWNrQWxlcnRcXFwiPm9wZW4gYWxlcnQ8L2J1dHRvbj5cXG4gICAgJm5ic3A7Jm5ic3A7XFxuICAgIDxidXR0b24gY2xhc3M9XFxcImFtLWJ0biBhbS1idG4tc2Vjb25kYXJ5XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIHYtb246Y2xpY2s9XFxcImNsaWNrQ29uZmlybVxcXCI+b3BlbiBjb25maXJtPC9idXR0b24+XFxuICAgICZuYnNwOyZuYnNwO1xcbiAgICA8YnV0dG9uIGNsYXNzPVxcXCJhbS1idG4gYW0tYnRuLXN1Y2Nlc3NcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgdi1vbjpjbGljaz1cXFwiY2xpY2tEaWFsb2dcXFwiPm9wZW4gZGlhbG9nPC9idXR0b24+XFxuICAgICZuYnNwOyZuYnNwO1xcblxcbjwvZGl2PlxcblxcbjxoZHAtbW9kYWwgOnNob3cuc3luYz1cXFwic2hvd01vZGFsXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYW0tbW9kYWwtaGRcXFwiIHNsb3Q9XFxcImhlYWRlclxcXCI+bW9kYWwgaGVhZGVyPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFtLW1vZGFsLWJkXFxcIiBzbG90PVxcXCJib2R5XFxcIj5oZWxsbzwvZGl2PlxcbjwvaGRwLW1vZGFsPlxcblxcbjxoZHAtYWxlcnQgOnNob3cuc3luYz1cXFwic2hvd0FsZXJ0XFxcIiBjbGFzcy1uYW1lPVxcXCJhbS1tb2RhbC1zbVxcXCIgOm1zZz1cXFwiYWxlcnRNc2dcXFwiIEBhbGVydC5vaz1cXFwiY2xpY2tBbGVydE9LXFxcIj48L2hkcC1hbGVydD5cXG5cXG48aGRwLWNvbmZpcm0gOnNob3cuc3luYz1cXFwic2hvd0NvbmZpcm1cXFwiIGNsYXNzLW5hbWU9XFxcImFtLW1vZGFsLXNtXFxcIiA6bXNnPVxcXCJjb25maXJtTXNnXFxcIiBAY29uZmlybS5vaz1cXFwiY2xpY2tDb25maXJtT0tcXFwiIEBjb25maXJtLmNhbmNlbD1cXFwiY2xpY2tDb25maXJtQ2FuY2VsXFxcIj48L2hkcC1jb25maXJtPlxcblxcbjxoZHAtZGlhbG9nIDpzaG93LnN5bmM9XFxcInNob3dEaWFsb2dcXFwiIDptc2c9XFxcImRpYWxvZ01zZ1xcXCIgQGRpYWxvZy5jYW5jZWw9XFxcImNsaWNrRGlhbG9nQ2FuY2VsXFxcIiBAZGlhbG9nLm9rPVxcXCJjbGlja0RpYWxvZ09LXFxcIj5cXG4gICAgPGxhYmVsIGZvcj1cXFwiXFxcIj51c2VybmFtZTwvbGFiZWw+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJ1c2VybmFtZVxcXCI+XFxuPC9oZHAtZGlhbG9nPlxcblxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL21vZGFscy52dWVcbiAqKiBtb2R1bGUgaWQgPSAxMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBfX3Z1ZV9zY3JpcHRfXywgX192dWVfdGVtcGxhdGVfX1xudmFyIF9fdnVlX3N0eWxlc19fID0ge31cbnJlcXVpcmUoXCIhIXZ1ZS1zdHlsZS1sb2FkZXIhY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZSZpbmRleD0wIS4vdHlwZUFoZWFkcy52dWVcIilcbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi90eXBlQWhlYWRzLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBleGFtcGxlcy1kZXZcXFxcc3JjXFxcXHZpZXdzXFxcXHR5cGVBaGVhZHMudnVlOiBuYW1lZCBleHBvcnRzIGluICoudnVlIGZpbGVzIGFyZSBpZ25vcmVkLlwiKX1cbl9fdnVlX3RlbXBsYXRlX18gPSByZXF1aXJlKFwiISF2dWUtaHRtbD9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3R5cGVBaGVhZHMudnVlXCIpXG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi03NGMwZDViNy90eXBlQWhlYWRzLnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvdHlwZUFoZWFkcy52dWVcbiAqKiBtb2R1bGUgaWQgPSAxMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi90eXBlQWhlYWRzLnZ1ZVwiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlJmluZGV4PTAhLi90eXBlQWhlYWRzLnZ1ZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtcmV3cml0ZXIuanMhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZSZpbmRleD0wIS4vdHlwZUFoZWFkcy52dWVcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1zdHlsZS1sb2FkZXIhLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZSZpbmRleD0wIS4vZXhhbXBsZXMtZGV2L3NyYy92aWV3cy90eXBlQWhlYWRzLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDExNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG4uaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCB7XFxuICAgIGJvcmRlcjogc29saWQgMXB4ICNjY2NcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi8uL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvdHlwZUFoZWFkcy52dWU/Y2NhMTY3YzRcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQTtJQUNBLHNCQUFBO0NBQ0FcIixcImZpbGVcIjpcInR5cGVBaGVhZHMudnVlXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjx0ZW1wbGF0ZT5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYW0tZm9ybVxcXCI+XFxuXFxuICAgICAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuaZrumAmuS4i+aLieaWh+acrDwvbGFiZWw+PGJyPlxcbiAgICAgICAgPGhkcC10YS10ZXh0IDppbnB1dC1kYXRhLnN5bmM9XFxcInRleHRJbnB1dFxcXCIgOmRyb3Bkb3duLWRhdGE9XFxcImxpc3REYXRhXFxcIj48L2hkcC10YS10ZXh0PjxzcGFuPnt7dGV4dElucHV0fX08L3NwYW4+XFxuICAgICAgICBcXG4gICAgICAgIFxcbiAgICAgICAgPGJyPjxicj5cXG5cXG4gICAgICAgIDxsYWJlbCBmb3I9XFxcIlxcXCI+6Ieq5a6a5LmJ5LiL5ouJ5paH5pys5YiX6KGoPC9sYWJlbD48YnI+XFxuICAgICAgICA8aGRwLXRhLXRleHQgOmlucHV0LWRhdGEuc3luYz1cXFwidGV4dElucHV0MlxcXCIgOmNvbmZpZz1cXFwidGV4dENvbmZpZ1xcXCI+PC9oZHAtdGEtdGV4dD48c3Bhbj57e3RleHRJbnB1dDJ9fTwvc3Bhbj5cXG5cXG4gICAgICAgIDxicj48YnI+XFxuXFxuICAgICAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuaZrumAmuS4i+aLieWvueixoeWIl+ihqDwvbGFiZWw+PGJyPlxcbiAgICAgICAgPGhkcC10YS1vYmplY3RcXG4gICAgICAgICAgICA6aW5wdXQtZGF0YS5zeW5jPVxcXCJvYmplY3RJbnB1dFxcXCJcXG4gICAgICAgICAgICA6Y29uZmlnPVxcXCJvYmplY3RDb25maWdcXFwiXFxuICAgICAgICAgICAgOmRyb3Bkb3duLWRhdGE9XFxcImxpc3RPYmplY3RcXFwiPlxcbiAgICAgICAgPC9oZHAtdGEtb2JqZWN0PlxcbiAgICAgICAgPHNwYW4+aWQ6e3tvYmplY3RJbnB1dC5pZH19LG5hbWU6e3tvYmplY3RJbnB1dC5uYW1lfX08L3NwYW4+XFxuXFxuICAgICAgICA8YnI+PGJyPlxcblxcbiAgICAgICAgPGxhYmVsIGZvcj1cXFwiXFxcIj7oh6rlrprkuYkoYWpheCnkuIvmi4nlr7nosaHliJfooag8L2xhYmVsPjxicj5cXG4gICAgICAgIDxoZHAtdGEtb2JqZWN0XFxuICAgICAgICAgICAgOmlucHV0LWRhdGEuc3luYz1cXFwib2JqZWN0SW5wdXQyXFxcIlxcbiAgICAgICAgICAgIDpjb25maWc9XFxcIm9iamVjdDJDb25maWdcXFwiPlxcbiAgICAgICAgPC9oZHAtdGEtb2JqZWN0PlxcbiAgICAgICAgPHNwYW4+aWQ6e3tvYmplY3RJbnB1dDIuaWR9fSxuYW1lOnt7b2JqZWN0SW5wdXQyLm5hbWV9fTwvc3Bhbj5cXG4gICAgXFxuICAgIDwvZGl2PlxcblxcbiAgICA8YnI+PGJyPlxcblxcbiAgICA8cD7mnKznnYDljZXkuIDogYzotKPnmoTljp/liJnvvIzmnKzmnaXov5jmg7PmiophamF45LiL5ouJ5Lmf5YGa5oiQ5LiA5Liq57uE5Lu277yM5L2GYWpheOW6k+avlOi+g+Wkmuagt++8jOWwseS4jeWBmuS6hjwvcD5cXG5cXG48L3RlbXBsYXRlPlxcblxcbjxzdHlsZT5cXG4gICAgLmhkcC1kcm9wZG93bi10eXBlYWhlYWQge1xcbiAgICAgICAgYm9yZGVyOiBzb2xpZCAxcHggI2NjY1xcbiAgICB9XFxuPC9zdHlsZT5cXG5cXG48c2NyaXB0PlxcblxcbmltcG9ydCBoZHBWdWVDb21wb25lbnRzIGZyb20gJ2hkcC12dWUtY29tcG9uZW50cyc7XFxuXFxubW9kdWxlLmV4cG9ydHMgPSB7XFxuXFxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xcbiAgICAgICAgcmV0dXJuIHtcXG4gICAgICAgICAgICB0ZXh0SW5wdXQ6ICcnLFxcbiAgICAgICAgICAgIGxpc3REYXRhOiBbJ2FiYycsJ2FkZGQnLCdhc2RnYXNkJywnYXNkZmFzZ2UnLCdnd2VzZGYnXSxcXG4gICAgICAgICAgICB0ZXh0SW5wdXQyOiAnJyxcXG4gICAgICAgICAgICB0ZXh0Q29uZmlnOiB7XFxuICAgICAgICAgICAgICAgIC8vIOmCruS7tuS4i+aLiVxcbiAgICAgICAgICAgICAgICBsaXN0RnVuOiBmdW5jdGlvbigpIHtcXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gW1xcXCJAaHVkb25ncGFpLmNvbVxcXCIsIFxcXCJAcXEuY29tXFxcIiwgXFxcIkAxNjMuY29tXFxcIiwgXFxcIkBvdXRsb29rLmNvbVxcXCIsIFxcXCJAZ21haWwuY29tXFxcIiwgXFxcIkBob3RtYWlsLmNvbVxcXCJdO1xcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5pbnB1dERhdGE7XFxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB2YWx1ZS5pbmRleE9mKCdAJyk7XFxuICAgICAgICAgICAgICAgICAgICBsZXQgaG9zdCA9ICcnO1xcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBob3N0ID0gdmFsdWUuc2xpY2UoaW5kZXgpO1xcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgaW5kZXgpO1xcbiAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldID0gdmFsdWUgKyBkYXRhW2ldO1xcbiAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuY29uZmlnLmxpbWl0ID8gZGF0YS5zbGljZSgwLCB0aGlzLmNvbmZpZy5saW1pdClcXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGRhdGFcXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IC0xXFxuICAgICAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgICAgIGFsd2F5c0hpdDogdHJ1ZVxcbiAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgb2JqZWN0SW5wdXQ6IHtcXG4gICAgICAgICAgICAgICAgaWQ6ICcnLFxcbiAgICAgICAgICAgICAgICBuYW1lOiAnJ1xcbiAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgb2JqZWN0Q29uZmlnOiB7XFxuICAgICAgICAgICAgICAgIHRleHROYW1lOiAnbmFtZScsICAgIC8vIOS8oOWFpWlucHV055qE5YC85bGe5oCn5ZCNXFxuICAgICAgICAgICAgICAgIGlkTmFtZTogJ2lkJyAgICAgICAgIC8vIOS8oOWFpWlucHV055qEaWTlsZ7mgKflkI1cXG4gICAgICAgICAgICB9LFxcbiAgICAgICAgICAgIC8vIGxpc3RPYmplY3TmlbDnu4TlhYPntKDlv4XpobvmnIlpZOS4jnRleHTlsZ7mgKdcXG4gICAgICAgICAgICBsaXN0T2JqZWN0OiBbXFxuICAgICAgICAgICAgICAgIHtcXG4gICAgICAgICAgICAgICAgICAgIGlkOiAxLFxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2pvZXknLFxcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2Egc2InXFxuICAgICAgICAgICAgICAgIH0se1xcbiAgICAgICAgICAgICAgICAgICAgaWQ6IDIsXFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAndG9tJyxcXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhIG1hbidcXG4gICAgICAgICAgICAgICAgfSx7XFxuICAgICAgICAgICAgICAgICAgICBpZDogMyxcXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdqYW1lJ1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgXSxcXG4gICAgICAgICAgICBvYmplY3RJbnB1dDI6IHtcXG4gICAgICAgICAgICAgICAgaWQ6ICcnLFxcbiAgICAgICAgICAgICAgICBuYW1lOiAnJ1xcbiAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgb2JqZWN0MkNvbmZpZzoge1xcbiAgICAgICAgICAgICAgICB0ZXh0TmFtZTogJ25hbWUnLFxcbiAgICAgICAgICAgICAgICBpZE5hbWU6ICdpZCcsXFxuICAgICAgICAgICAgICAgIGxpc3RGdW46IGZ1bmN0aW9uKCkge1xcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXTlvZNhamF45ZWmXFxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuaW5wdXREYXRhW3RoaXMuY29uZmlnLnRleHROYW1lXTtcXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0TGlzdCA9IFt7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAxLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTExMTExMTEnXFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwse1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogMixcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJzEyMjIyMjIyMjInXFxuICAgICAgICAgICAgICAgICAgICAgICAgfSx7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAzLFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTIzMzMzJ1xcbiAgICAgICAgICAgICAgICAgICAgICAgIH0se1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogNCxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJzEyMzQ0NDQ0NDQnXFxuICAgICAgICAgICAgICAgICAgICAgICAgfSx7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiA1LFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTIzNDU1NTU1J1xcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dO1xcblxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtcyA9IFtdO1xcblxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdExpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5uYW1lLmluZGV4T2YodGV4dCkgPj0gMCkge1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbS5uYW1lXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcXG5cXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1zID0gaXRlbXNcXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSAtMVxcblxcbiAgICAgICAgICAgICAgICAgICAgfSw1MDApO1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfTtcXG4gICAgfSxcXG5cXG4gICAgcmVhZHk6IGZ1bmN0aW9uKCkge1xcbiAgICAgICAgXFxuICAgIH0sXFxuXFxuICAgIG1ldGhvZHM6IHtcXG4gICAgICAgIFxcbiAgICB9XFxuXFxufTtcXG5cXG48L3NjcmlwdD5cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJ3ZWJwYWNrOi8vXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi92dWUtbG9hZGVyL2xpYi9zdHlsZS1yZXdyaXRlci5qcyEuL34vdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZSZpbmRleD0wIS4vZXhhbXBsZXMtZGV2L3NyYy92aWV3cy90eXBlQWhlYWRzLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDExNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuICAgIDxkaXYgY2xhc3M9XCJhbS1mb3JtXCI+XG5cbiAgICAgICAgPGxhYmVsIGZvcj1cIlwiPuaZrumAmuS4i+aLieaWh+acrDwvbGFiZWw+PGJyPlxuICAgICAgICA8aGRwLXRhLXRleHQgOmlucHV0LWRhdGEuc3luYz1cInRleHRJbnB1dFwiIDpkcm9wZG93bi1kYXRhPVwibGlzdERhdGFcIj48L2hkcC10YS10ZXh0PjxzcGFuPnt7dGV4dElucHV0fX08L3NwYW4+XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPGJyPjxicj5cblxuICAgICAgICA8bGFiZWwgZm9yPVwiXCI+6Ieq5a6a5LmJ5LiL5ouJ5paH5pys5YiX6KGoPC9sYWJlbD48YnI+XG4gICAgICAgIDxoZHAtdGEtdGV4dCA6aW5wdXQtZGF0YS5zeW5jPVwidGV4dElucHV0MlwiIDpjb25maWc9XCJ0ZXh0Q29uZmlnXCI+PC9oZHAtdGEtdGV4dD48c3Bhbj57e3RleHRJbnB1dDJ9fTwvc3Bhbj5cblxuICAgICAgICA8YnI+PGJyPlxuXG4gICAgICAgIDxsYWJlbCBmb3I9XCJcIj7mma7pgJrkuIvmi4nlr7nosaHliJfooag8L2xhYmVsPjxicj5cbiAgICAgICAgPGhkcC10YS1vYmplY3RcbiAgICAgICAgICAgIDppbnB1dC1kYXRhLnN5bmM9XCJvYmplY3RJbnB1dFwiXG4gICAgICAgICAgICA6Y29uZmlnPVwib2JqZWN0Q29uZmlnXCJcbiAgICAgICAgICAgIDpkcm9wZG93bi1kYXRhPVwibGlzdE9iamVjdFwiPlxuICAgICAgICA8L2hkcC10YS1vYmplY3Q+XG4gICAgICAgIDxzcGFuPmlkOnt7b2JqZWN0SW5wdXQuaWR9fSxuYW1lOnt7b2JqZWN0SW5wdXQubmFtZX19PC9zcGFuPlxuXG4gICAgICAgIDxicj48YnI+XG5cbiAgICAgICAgPGxhYmVsIGZvcj1cIlwiPuiHquWumuS5iShhamF4KeS4i+aLieWvueixoeWIl+ihqDwvbGFiZWw+PGJyPlxuICAgICAgICA8aGRwLXRhLW9iamVjdFxuICAgICAgICAgICAgOmlucHV0LWRhdGEuc3luYz1cIm9iamVjdElucHV0MlwiXG4gICAgICAgICAgICA6Y29uZmlnPVwib2JqZWN0MkNvbmZpZ1wiPlxuICAgICAgICA8L2hkcC10YS1vYmplY3Q+XG4gICAgICAgIDxzcGFuPmlkOnt7b2JqZWN0SW5wdXQyLmlkfX0sbmFtZTp7e29iamVjdElucHV0Mi5uYW1lfX08L3NwYW4+XG4gICAgXG4gICAgPC9kaXY+XG5cbiAgICA8YnI+PGJyPlxuXG4gICAgPHA+5pys552A5Y2V5LiA6IGM6LSj55qE5Y6f5YiZ77yM5pys5p2l6L+Y5oOz5oqKYWpheOS4i+aLieS5n+WBmuaIkOS4gOS4que7hOS7tu+8jOS9hmFqYXjlupPmr5TovoPlpJrmoLfvvIzlsLHkuI3lgZrkuoY8L3A+XG5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbiAgICAuaGRwLWRyb3Bkb3duLXR5cGVhaGVhZCB7XG4gICAgICAgIGJvcmRlcjogc29saWQgMXB4ICNjY2NcbiAgICB9XG48L3N0eWxlPlxuXG48c2NyaXB0PlxuXG5pbXBvcnQgaGRwVnVlQ29tcG9uZW50cyBmcm9tICdoZHAtdnVlLWNvbXBvbmVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGV4dElucHV0OiAnJyxcbiAgICAgICAgICAgIGxpc3REYXRhOiBbJ2FiYycsJ2FkZGQnLCdhc2RnYXNkJywnYXNkZmFzZ2UnLCdnd2VzZGYnXSxcbiAgICAgICAgICAgIHRleHRJbnB1dDI6ICcnLFxuICAgICAgICAgICAgdGV4dENvbmZpZzoge1xuICAgICAgICAgICAgICAgIC8vIOmCruS7tuS4i+aLiVxuICAgICAgICAgICAgICAgIGxpc3RGdW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IFtcIkBodWRvbmdwYWkuY29tXCIsIFwiQHFxLmNvbVwiLCBcIkAxNjMuY29tXCIsIFwiQG91dGxvb2suY29tXCIsIFwiQGdtYWlsLmNvbVwiLCBcIkBob3RtYWlsLmNvbVwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5pbnB1dERhdGE7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHZhbHVlLmluZGV4T2YoJ0AnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvc3QgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvc3QgPSB2YWx1ZS5zbGljZShpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZGF0YS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXSA9IHZhbHVlICsgZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5jb25maWcubGltaXQgPyBkYXRhLnNsaWNlKDAsIHRoaXMuY29uZmlnLmxpbWl0KVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IC0xXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbHdheXNIaXQ6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvYmplY3RJbnB1dDoge1xuICAgICAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9iamVjdENvbmZpZzoge1xuICAgICAgICAgICAgICAgIHRleHROYW1lOiAnbmFtZScsICAgIC8vIOS8oOWFpWlucHV055qE5YC85bGe5oCn5ZCNXG4gICAgICAgICAgICAgICAgaWROYW1lOiAnaWQnICAgICAgICAgLy8g5Lyg5YWlaW5wdXTnmoRpZOWxnuaAp+WQjVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIGxpc3RPYmplY3TmlbDnu4TlhYPntKDlv4XpobvmnIlpZOS4jnRleHTlsZ7mgKdcbiAgICAgICAgICAgIGxpc3RPYmplY3Q6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnam9leScsXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhIHNiJ1xuICAgICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgICAgICBpZDogMixcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ3RvbScsXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhIG1hbidcbiAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdqYW1lJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBvYmplY3RJbnB1dDI6IHtcbiAgICAgICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICAgICAgbmFtZTogJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvYmplY3QyQ29uZmlnOiB7XG4gICAgICAgICAgICAgICAgdGV4dE5hbWU6ICduYW1lJyxcbiAgICAgICAgICAgICAgICBpZE5hbWU6ICdpZCcsXG4gICAgICAgICAgICAgICAgbGlzdEZ1bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXTlvZNhamF45ZWmXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuaW5wdXREYXRhW3RoaXMuY29uZmlnLnRleHROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHRMaXN0ID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTExMTExMTEnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCx7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJzEyMjIyMjIyMjInXG4gICAgICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTIzMzMzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IDQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJzEyMzQ0NDQ0NDQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTIzNDU1NTU1J1xuICAgICAgICAgICAgICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5uYW1lLmluZGV4T2YodGV4dCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IGl0ZW1zXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSAtMVxuXG4gICAgICAgICAgICAgICAgICAgIH0sNTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgXG4gICAgfVxuXG59O1xuXG48L3NjcmlwdD5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHR5cGVBaGVhZHMudnVlP2NjYTE2N2M0XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcbjxkaXYgY2xhc3M9XFxcImFtLWZvcm1cXFwiPlxcblxcbiAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuaZrumAmuS4i+aLieaWh+acrDwvbGFiZWw+PGJyPlxcbiAgICA8aGRwLXRhLXRleHQgOmlucHV0LWRhdGEuc3luYz1cXFwidGV4dElucHV0XFxcIiA6ZHJvcGRvd24tZGF0YT1cXFwibGlzdERhdGFcXFwiPjwvaGRwLXRhLXRleHQ+PHNwYW4+e3t0ZXh0SW5wdXR9fTwvc3Bhbj5cXG4gICAgXFxuICAgIFxcbiAgICA8YnI+PGJyPlxcblxcbiAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuiHquWumuS5ieS4i+aLieaWh+acrOWIl+ihqDwvbGFiZWw+PGJyPlxcbiAgICA8aGRwLXRhLXRleHQgOmlucHV0LWRhdGEuc3luYz1cXFwidGV4dElucHV0MlxcXCIgOmNvbmZpZz1cXFwidGV4dENvbmZpZ1xcXCI+PC9oZHAtdGEtdGV4dD48c3Bhbj57e3RleHRJbnB1dDJ9fTwvc3Bhbj5cXG5cXG4gICAgPGJyPjxicj5cXG5cXG4gICAgPGxhYmVsIGZvcj1cXFwiXFxcIj7mma7pgJrkuIvmi4nlr7nosaHliJfooag8L2xhYmVsPjxicj5cXG4gICAgPGhkcC10YS1vYmplY3RcXG4gICAgICAgIDppbnB1dC1kYXRhLnN5bmM9XFxcIm9iamVjdElucHV0XFxcIlxcbiAgICAgICAgOmNvbmZpZz1cXFwib2JqZWN0Q29uZmlnXFxcIlxcbiAgICAgICAgOmRyb3Bkb3duLWRhdGE9XFxcImxpc3RPYmplY3RcXFwiPlxcbiAgICA8L2hkcC10YS1vYmplY3Q+XFxuICAgIDxzcGFuPmlkOnt7b2JqZWN0SW5wdXQuaWR9fSxuYW1lOnt7b2JqZWN0SW5wdXQubmFtZX19PC9zcGFuPlxcblxcbiAgICA8YnI+PGJyPlxcblxcbiAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuiHquWumuS5iShhamF4KeS4i+aLieWvueixoeWIl+ihqDwvbGFiZWw+PGJyPlxcbiAgICA8aGRwLXRhLW9iamVjdFxcbiAgICAgICAgOmlucHV0LWRhdGEuc3luYz1cXFwib2JqZWN0SW5wdXQyXFxcIlxcbiAgICAgICAgOmNvbmZpZz1cXFwib2JqZWN0MkNvbmZpZ1xcXCI+XFxuICAgIDwvaGRwLXRhLW9iamVjdD5cXG4gICAgPHNwYW4+aWQ6e3tvYmplY3RJbnB1dDIuaWR9fSxuYW1lOnt7b2JqZWN0SW5wdXQyLm5hbWV9fTwvc3Bhbj5cXG5cXG48L2Rpdj5cXG5cXG48YnI+PGJyPlxcblxcbjxwPuacrOedgOWNleS4gOiBjOi0o+eahOWOn+WIme+8jOacrOadpei/mOaDs+aKimFqYXjkuIvmi4nkuZ/lgZrmiJDkuIDkuKrnu4Tku7bvvIzkvYZhamF45bqT5q+U6L6D5aSa5qC377yM5bCx5LiN5YGa5LqGPC9wPlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL3R5cGVBaGVhZHMudnVlXG4gKiogbW9kdWxlIGlkID0gMTE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgX192dWVfc2NyaXB0X18sIF9fdnVlX3RlbXBsYXRlX19cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IHt9XG5fX3Z1ZV9zY3JpcHRfXyA9IHJlcXVpcmUoXCIhIWJhYmVsLWxvYWRlcj9wcmVzZXRzW109ZXMyMDE1JnBsdWdpbnNbXT10cmFuc2Zvcm0tcnVudGltZSZjb21tZW50cz1mYWxzZSEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXNjcmlwdCZpbmRleD0wIS4vdGFnaW5wdXRzLnZ1ZVwiKVxuaWYgKF9fdnVlX3NjcmlwdF9fICYmXG4gICAgX192dWVfc2NyaXB0X18uX19lc01vZHVsZSAmJlxuICAgIE9iamVjdC5rZXlzKF9fdnVlX3NjcmlwdF9fKS5sZW5ndGggPiAxKSB7XG4gIGNvbnNvbGUud2FybihcIlt2dWUtbG9hZGVyXSBleGFtcGxlcy1kZXZcXFxcc3JjXFxcXHZpZXdzXFxcXHRhZ2lucHV0cy52dWU6IG5hbWVkIGV4cG9ydHMgaW4gKi52dWUgZmlsZXMgYXJlIGlnbm9yZWQuXCIpfVxuX192dWVfdGVtcGxhdGVfXyA9IHJlcXVpcmUoXCIhIXZ1ZS1odG1sP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vdGFnaW5wdXRzLnZ1ZVwiKVxubW9kdWxlLmV4cG9ydHMgPSBfX3Z1ZV9zY3JpcHRfXyB8fCB7fVxuaWYgKG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdFxudmFyIF9fdnVlX29wdGlvbnNfXyA9IHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJmdW5jdGlvblwiID8gKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgfHwgKG1vZHVsZS5leHBvcnRzLm9wdGlvbnMgPSB7fSkpIDogbW9kdWxlLmV4cG9ydHNcbmlmIChfX3Z1ZV90ZW1wbGF0ZV9fKSB7XG5fX3Z1ZV9vcHRpb25zX18udGVtcGxhdGUgPSBfX3Z1ZV90ZW1wbGF0ZV9fXG59XG5pZiAoIV9fdnVlX29wdGlvbnNfXy5jb21wdXRlZCkgX192dWVfb3B0aW9uc19fLmNvbXB1dGVkID0ge31cbk9iamVjdC5rZXlzKF9fdnVlX3N0eWxlc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbnZhciBtb2R1bGUgPSBfX3Z1ZV9zdHlsZXNfX1trZXldXG5fX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWRba2V5XSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1vZHVsZSB9XG59KVxuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkgeyAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIHZhciBpZCA9IFwiX3YtYjFlMDEzNzAvdGFnaW5wdXRzLnZ1ZVwiXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChpZCwgbW9kdWxlLmV4cG9ydHMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnVwZGF0ZShpZCwgbW9kdWxlLmV4cG9ydHMsIF9fdnVlX3RlbXBsYXRlX18pXG4gIH1cbn0pKCl9XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4YW1wbGVzLWRldi9zcmMvdmlld3MvdGFnaW5wdXRzLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDExOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG4gICAgPGRpdj5cbiAgICAgICAgPGxhYmVsIGZvcj1cIlwiPuaWh+acrOi+k+WFpTwvbGFiZWw+XG4gICAgICAgIDxoZHAtdGFnaW5wdXQgOmlucHV0LWxpc3Quc3luYz1cInRhZ0xpc3RcIiA6ZHJvcGRvd24tZGF0YT1cImxpc3REYXRhXCI+PC9oZHAtdGFnaW5wdXQ+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2PlxuICAgICAgICA8bGFiZWwgZm9yPVwiXCI+6Ieq5a6a5LmJ5paH5pys6L6T5YWlPC9sYWJlbD5cbiAgICAgICAgPGhkcC10YWdpbnB1dCA6aW5wdXQtbGlzdC5zeW5jPVwidGFnTGlzdDJcIiA6Y29uZmlnPVwidGV4dENvbmZpZ1wiPjwvaGRwLXRhZ2lucHV0PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdj5cbiAgICAgICAgPGxhYmVsIGZvcj1cIlwiPuWvueixoei+k+WFpTwvbGFiZWw+XG4gICAgICAgIDxoZHAtdGFnaW5wdXQgXG4gICAgICAgICAgICB0eXBlLWFoZWFkPVwib2JqZWN0XCJcbiAgICAgICAgICAgIDppbnB1dC1saXN0LnN5bmM9XCJ0YWdMaXN0M1wiXG4gICAgICAgICAgICA6ZHJvcGRvd24tZGF0YT1cImxpc3RPYmplY3RcIj5cbiAgICAgICAgPC9oZHAtdGFnaW5wdXQ+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2PlxuICAgICAgICA8bGFiZWwgZm9yPVwiXCI+6Ieq5a6a5LmJKGFqYXgp5a+56LGh6L6T5YWlPC9sYWJlbD5cbiAgICAgICAgPGhkcC10YWdpbnB1dCBcbiAgICAgICAgICAgIHR5cGUtYWhlYWQ9XCJvYmplY3RcIlxuICAgICAgICAgICAgOmlucHV0LWxpc3Quc3luYz1cInRhZ0xpc3Q0XCJcbiAgICAgICAgICAgIDpjb25maWc9XCJvYmplY3RDb25maWdcIj5cbiAgICAgICAgPC9oZHAtdGFnaW5wdXQ+XG4gICAgPC9kaXY+XG5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFnTGlzdDogW10sXG4gICAgICAgICAgICAgICAgbGlzdERhdGE6IFsnYWJjJywnYWRkZCcsJ2FzZGdhc2QnLCdhc2RmYXNnZScsJ2d3ZXNkZiddLFxuICAgICAgICAgICAgICAgIHRhZ0xpc3QyOiBbXSxcbiAgICAgICAgICAgICAgICB0ZXh0Q29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmCruS7tuS4i+aLiVxuICAgICAgICAgICAgICAgICAgICBsaXN0RnVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gW1wiQGh1ZG9uZ3BhaS5jb21cIiwgXCJAcXEuY29tXCIsIFwiQDE2My5jb21cIiwgXCJAb3V0bG9vay5jb21cIiwgXCJAZ21haWwuY29tXCIsIFwiQGhvdG1haWwuY29tXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5pbnB1dERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB2YWx1ZS5pbmRleE9mKCdAJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaG9zdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0ID0gdmFsdWUuc2xpY2UoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldID0gdmFsdWUgKyBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuY29uZmlnLmxpbWl0ID8gZGF0YS5zbGljZSgwLCB0aGlzLmNvbmZpZy5saW1pdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IC0xXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFsd2F5c0hpdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGFnTGlzdDM6IFtdLFxuICAgICAgICAgICAgICAgIGxpc3RPYmplY3Q6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnam9leScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjOiAnYSBzYidcbiAgICAgICAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICd0b20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2EgbWFuJ1xuICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ2phbWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHRhZ0xpc3Q0OiBbXSxcbiAgICAgICAgICAgICAgICBvYmplY3RDb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdEZ1bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dOW9k2FqYXjllaZcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gdGhpcy5pbnB1dERhdGFbdGhpcy5jb25maWcudGV4dE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHRMaXN0ID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICcxMTExMTExMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCx7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTIyMjIyMjIyMidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICcxMjMzMzMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnMTIzNDQ0NDQ0NCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICcxMjM0NTU1NTUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdExpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5uYW1lLmluZGV4T2YodGV4dCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBpdGVtc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IC0xXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sNTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG5cbjwvc2NyaXB0PlxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogdGFnaW5wdXRzLnZ1ZT81MWFkMTdhOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG5cXG48ZGl2PlxcbiAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuaWh+acrOi+k+WFpTwvbGFiZWw+XFxuICAgIDxoZHAtdGFnaW5wdXQgOmlucHV0LWxpc3Quc3luYz1cXFwidGFnTGlzdFxcXCIgOmRyb3Bkb3duLWRhdGE9XFxcImxpc3REYXRhXFxcIj48L2hkcC10YWdpbnB1dD5cXG48L2Rpdj5cXG5cXG48ZGl2PlxcbiAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuiHquWumuS5ieaWh+acrOi+k+WFpTwvbGFiZWw+XFxuICAgIDxoZHAtdGFnaW5wdXQgOmlucHV0LWxpc3Quc3luYz1cXFwidGFnTGlzdDJcXFwiIDpjb25maWc9XFxcInRleHRDb25maWdcXFwiPjwvaGRwLXRhZ2lucHV0PlxcbjwvZGl2PlxcblxcbjxkaXY+XFxuICAgIDxsYWJlbCBmb3I9XFxcIlxcXCI+5a+56LGh6L6T5YWlPC9sYWJlbD5cXG4gICAgPGhkcC10YWdpbnB1dCBcXG4gICAgICAgIHR5cGUtYWhlYWQ9XFxcIm9iamVjdFxcXCJcXG4gICAgICAgIDppbnB1dC1saXN0LnN5bmM9XFxcInRhZ0xpc3QzXFxcIlxcbiAgICAgICAgOmRyb3Bkb3duLWRhdGE9XFxcImxpc3RPYmplY3RcXFwiPlxcbiAgICA8L2hkcC10YWdpbnB1dD5cXG48L2Rpdj5cXG5cXG48ZGl2PlxcbiAgICA8bGFiZWwgZm9yPVxcXCJcXFwiPuiHquWumuS5iShhamF4KeWvueixoei+k+WFpTwvbGFiZWw+XFxuICAgIDxoZHAtdGFnaW5wdXQgXFxuICAgICAgICB0eXBlLWFoZWFkPVxcXCJvYmplY3RcXFwiXFxuICAgICAgICA6aW5wdXQtbGlzdC5zeW5jPVxcXCJ0YWdMaXN0NFxcXCJcXG4gICAgICAgIDpjb25maWc9XFxcIm9iamVjdENvbmZpZ1xcXCI+XFxuICAgIDwvaGRwLXRhZ2lucHV0PlxcbjwvZGl2PlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL3RhZ2lucHV0cy52dWVcbiAqKiBtb2R1bGUgaWQgPSAxMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBfX3Z1ZV9zY3JpcHRfXywgX192dWVfdGVtcGxhdGVfX1xudmFyIF9fdnVlX3N0eWxlc19fID0ge31cbl9fdnVlX3NjcmlwdF9fID0gcmVxdWlyZShcIiEhYmFiZWwtbG9hZGVyP3ByZXNldHNbXT1lczIwMTUmcGx1Z2luc1tdPXRyYW5zZm9ybS1ydW50aW1lJmNvbW1lbnRzPWZhbHNlIS4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9kYXRldGltZVBpY2tlci52dWVcIilcbmlmIChfX3Z1ZV9zY3JpcHRfXyAmJlxuICAgIF9fdnVlX3NjcmlwdF9fLl9fZXNNb2R1bGUgJiZcbiAgICBPYmplY3Qua2V5cyhfX3Z1ZV9zY3JpcHRfXykubGVuZ3RoID4gMSkge1xuICBjb25zb2xlLndhcm4oXCJbdnVlLWxvYWRlcl0gZXhhbXBsZXMtZGV2XFxcXHNyY1xcXFx2aWV3c1xcXFxkYXRldGltZVBpY2tlci52dWU6IG5hbWVkIGV4cG9ydHMgaW4gKi52dWUgZmlsZXMgYXJlIGlnbm9yZWQuXCIpfVxuX192dWVfdGVtcGxhdGVfXyA9IHJlcXVpcmUoXCIhIXZ1ZS1odG1sP3JlbW92ZVJlZHVuZGFudEF0dHJpYnV0ZXM9ZmFsc2UhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vZGF0ZXRpbWVQaWNrZXIudnVlXCIpXG5tb2R1bGUuZXhwb3J0cyA9IF9fdnVlX3NjcmlwdF9fIHx8IHt9XG5pZiAobW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0XG52YXIgX192dWVfb3B0aW9uc19fID0gdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCIgPyAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyB8fCAobW9kdWxlLmV4cG9ydHMub3B0aW9ucyA9IHt9KSkgOiBtb2R1bGUuZXhwb3J0c1xuaWYgKF9fdnVlX3RlbXBsYXRlX18pIHtcbl9fdnVlX29wdGlvbnNfXy50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX19cbn1cbmlmICghX192dWVfb3B0aW9uc19fLmNvbXB1dGVkKSBfX3Z1ZV9vcHRpb25zX18uY29tcHV0ZWQgPSB7fVxuT2JqZWN0LmtleXMoX192dWVfc3R5bGVzX18pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xudmFyIG1vZHVsZSA9IF9fdnVlX3N0eWxlc19fW2tleV1cbl9fdnVlX29wdGlvbnNfXy5jb21wdXRlZFtrZXldID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbW9kdWxlIH1cbn0pXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7ICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgdmFyIGlkID0gXCJfdi00NTQwYmFmNC9kYXRldGltZVBpY2tlci52dWVcIlxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoaWQsIG1vZHVsZS5leHBvcnRzKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS51cGRhdGUoaWQsIG1vZHVsZS5leHBvcnRzLCBfX3Z1ZV90ZW1wbGF0ZV9fKVxuICB9XG59KSgpfVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL2RhdGV0aW1lUGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDEyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiPHRlbXBsYXRlPlxuXG48Z3JpZD5cbiAgICA8cD57eyBteURhdGUxIHwgZm9ybWF0RGF0ZSAneXl5eeW5tE1N5pyIZGTml6Us5pif5pyfRCBoaDptbScgfX08L3A+XG4gICAgPHVsIGNsYXNzPVwiYW0tYXZnLXNtLTEgYW0tYXZnLW1kLTMgYW0tbWFyZ2luIGFtLXBhZGRpbmcgYW0tdGV4dC1jZW50ZXIgYWRtaW4tY29udGVudC1saXN0IFwiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgICA8aGRwLWRhdGUtdGltZS1waWNrZXIgdi1iaW5kOmRhdGUtdGltZS5zeW5jPVwibXlEYXRlMVwiPjwvaGRwLWRhdGUtdGltZS1waWNrZXI+XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxoZHAtZGF0ZS10aW1lLXBpY2tlciB2LWJpbmQ6ZGF0ZS10aW1lLnN5bmM9XCJteURhdGUxXCIgdi1iaW5kOnNob3ctdGltZS1waWNrZXI9XCJmYWxzZVwiPjwvaGRwLWRhdGUtdGltZS1waWNrZXI+XG4gICAgICAgIDwvbGk+XG5cbiAgICAgICAgPGxpPlxuICAgICAgICAgICAgPGhkcC1kYXRlLXRpbWUtcGlja2VyIHYtYmluZDpkYXRlLXRpbWUuc3luYz1cIm15RGF0ZTFcIiB2LWJpbmQ6c2hvdy1kYXRlLXBpY2tlcj1cImZhbHNlXCI+PC9oZHAtZGF0ZS10aW1lLXBpY2tlcj5cbiAgICAgICAgPC9saT5cbiAgICA8L3VsPlxuICAgIFxuXG5cbiAgICA8aGRwLWRhdGUtdGltZS1pbnB1dCB2LWJpbmQ6ZGF0ZS10aW1lLnN5bmM9XCJteURhdGUyXCI+PC9oZHAtZGF0ZS10aW1lLWlucHV0PlxuXG5cbiAgICA8aGRwLWRhdGUtdGltZS1pbnB1dCB2LWJpbmQ6ZGF0ZS10aW1lLnN5bmM9XCJteURhdGUyXCIgZGF0ZS1vbmx5PjwvaGRwLWRhdGUtdGltZS1pbnB1dD5cblxuXG4gICAgPGhkcC1kYXRlLXRpbWUtaW5wdXQgdi1iaW5kOmRhdGUtdGltZS5zeW5jPVwibXlEYXRlMlwiIHRpbWUtb25seT48L2hkcC1kYXRlLXRpbWUtaW5wdXQ+XG4gICAgXG48L2dyaWQ+XG5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBteURhdGUxOiBuZXcgRGF0ZSgnMjAxMC0xLTMgNDo1OjYnKSxcbiAgICAgICAgICAgIG15RGF0ZU1pbjE6ICcyMDEwLTEtMSA0OjU6NicsXG4gICAgICAgICAgICBteURhdGVNYXgxOiAnMjAxMC0xLTIwIDQ6NTo2JyxcbiAgICAgICAgICAgIG15RGF0ZTI6ICcyMDE1LTEyLTEyIDEzOjE0JyxcbiAgICAgICAgICAgIG15RGF0ZU1pbjI6ICcyMDE1LTEyLTEgMTM6MTQ6MTUnLFxuICAgICAgICAgICAgbXlEYXRlTWF4MjogJzIwMTUtMTItMzAgMTM6MTQ6MTUnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZpbHRlcnM6IHtcbiAgICAgICAgZm9ybWF0RGF0ZShfZGF0ZSwgZm9ybWF0KSB7XG4gICAgICAgICAgICAvLyBpZiAodHlwZW9mIGRhdGUgIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkYXRlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gICByZXR1cm4gX2RhdGU7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyB2YXIgX2RhdGUgPSBuZXcgRGF0ZShfZGF0ZSk7XG4gICAgICAgICAgICBpZiAoaXNOYU4oX2RhdGUuZ2V0VGltZSgpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1hcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJNXCI6IF9kYXRlLmdldE1vbnRoKCkgKyAxXG4gICAgICAgICAgICAgICAgLCBcImRcIjogX2RhdGUuZ2V0RGF0ZSgpXG4gICAgICAgICAgICAgICAgLCBcImhcIjogX2RhdGUuZ2V0SG91cnMoKVxuICAgICAgICAgICAgICAgICwgXCJtXCI6IF9kYXRlLmdldE1pbnV0ZXMoKVxuICAgICAgICAgICAgICAgICwgXCJzXCI6IF9kYXRlLmdldFNlY29uZHMoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoLyhbeU1kRGhtc10pKy9nLCBmdW5jdGlvbihhbGwsIHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdiA9IG1hcFt0XTtcbiAgICAgICAgICAgICAgICBpZih2ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBpZihhbGwubGVuZ3RoID4gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gJzAnICsgdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB2LnN1YnN0cih2Lmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChfZGF0ZS5nZXRGdWxsWWVhcigpICsgJycpLnN1YnN0cig0IC0gYWxsLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsn5pelJywgJ+S4gCcsICfkuownLCAn5LiJJywgJ+WbmycsICfkupQnLCAn5YWtJ11bX2RhdGUuZ2V0RGF5KCldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgICBteURhdGVDaGFuZ2UxKGNoYW5nZWREYXRlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFuZ2VkRGF0ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbXlEYXRlQ2hhbmdlMihjaGFuZ2VkRGF0ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbmdlZERhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG48L3NjcmlwdD5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIGRhdGV0aW1lUGlja2VyLnZ1ZT81ZTU3ZDU4OVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG5cXG48Z3JpZD5cXG4gICAgPHA+e3sgbXlEYXRlMSB8IGZvcm1hdERhdGUgJ3l5eXnlubRNTeaciGRk5pelLOaYn+acn0QgaGg6bW0nIH19PC9wPlxcbiAgICA8dWwgY2xhc3M9XFxcImFtLWF2Zy1zbS0xIGFtLWF2Zy1tZC0zIGFtLW1hcmdpbiBhbS1wYWRkaW5nIGFtLXRleHQtY2VudGVyIGFkbWluLWNvbnRlbnQtbGlzdCBcXFwiPlxcbiAgICAgICAgPGxpPlxcbiAgICAgICAgICAgIDxoZHAtZGF0ZS10aW1lLXBpY2tlciB2LWJpbmQ6ZGF0ZS10aW1lLnN5bmM9XFxcIm15RGF0ZTFcXFwiPjwvaGRwLWRhdGUtdGltZS1waWNrZXI+XFxuICAgICAgICA8L2xpPlxcbiAgICAgICAgPGxpPlxcbiAgICAgICAgICAgIDxoZHAtZGF0ZS10aW1lLXBpY2tlciB2LWJpbmQ6ZGF0ZS10aW1lLnN5bmM9XFxcIm15RGF0ZTFcXFwiIHYtYmluZDpzaG93LXRpbWUtcGlja2VyPVxcXCJmYWxzZVxcXCI+PC9oZHAtZGF0ZS10aW1lLXBpY2tlcj5cXG4gICAgICAgIDwvbGk+XFxuXFxuICAgICAgICA8bGk+XFxuICAgICAgICAgICAgPGhkcC1kYXRlLXRpbWUtcGlja2VyIHYtYmluZDpkYXRlLXRpbWUuc3luYz1cXFwibXlEYXRlMVxcXCIgdi1iaW5kOnNob3ctZGF0ZS1waWNrZXI9XFxcImZhbHNlXFxcIj48L2hkcC1kYXRlLXRpbWUtcGlja2VyPlxcbiAgICAgICAgPC9saT5cXG4gICAgPC91bD5cXG4gICAgXFxuXFxuXFxuICAgIDxoZHAtZGF0ZS10aW1lLWlucHV0IHYtYmluZDpkYXRlLXRpbWUuc3luYz1cXFwibXlEYXRlMlxcXCI+PC9oZHAtZGF0ZS10aW1lLWlucHV0PlxcblxcblxcbiAgICA8aGRwLWRhdGUtdGltZS1pbnB1dCB2LWJpbmQ6ZGF0ZS10aW1lLnN5bmM9XFxcIm15RGF0ZTJcXFwiIGRhdGUtb25seT48L2hkcC1kYXRlLXRpbWUtaW5wdXQ+XFxuXFxuXFxuICAgIDxoZHAtZGF0ZS10aW1lLWlucHV0IHYtYmluZDpkYXRlLXRpbWUuc3luYz1cXFwibXlEYXRlMlxcXCIgdGltZS1vbmx5PjwvaGRwLWRhdGUtdGltZS1pbnB1dD5cXG4gICAgXFxuPC9ncmlkPlxcblxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Z1ZS1odG1sLWxvYWRlcj9yZW1vdmVSZWR1bmRhbnRBdHRyaWJ1dGVzPWZhbHNlIS4vfi92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9leGFtcGxlcy1kZXYvc3JjL3ZpZXdzL2RhdGV0aW1lUGlja2VyLnZ1ZVxuICoqIG1vZHVsZSBpZCA9IDEyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==