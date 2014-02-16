// Generated by CoffeeScript 1.7.1
(function() {
  var ST_LIST_COOKIE, ST_LIST_DEFAULT, TRENDS_INTERVAL, app, config, debug, express, fetch_sts, info, lib, st_list_cleanup, warn, _ref, _ref1;

  config = require('./lib/config');

  lib = require('./lib');

  TRENDS_INTERVAL = 60 * 60 * 1000;

  _ref = require('./lib/logger'), debug = _ref.debug, info = _ref.info, warn = _ref.warn;

  _ref1 = require('./app'), st_list_cleanup = _ref1.st_list_cleanup, fetch_sts = _ref1.fetch_sts;

  express = require('express');

  app = express();

  app.configure(function() {
    app.set("views", __dirname);
    app.set("view engine", 'jade');
    app.enable("trust proxy");
    app.use(express.favicon());
    app.use(express.compress());
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(app.router);
    if (config.env === "development") {
      app.use('/inc', express["static"](__dirname + "/inc"));
      app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
      app.locals.pretty = true;
      return app.locals.cache = false;
    } else {
      app.use('/inc', express["static"](__dirname + "/inc", {
        maxAge: 1 * 24 * 3600 * 1000
      }));
      app.use(express.errorHandler());
      app.locals.pretty = false;
      return app.locals.cache = true;
    }
  });

  ST_LIST_COOKIE = "st_list";

  ST_LIST_DEFAULT = ["uiii", "poml", "olha", "olha2"];

  app.get('/', function(req, res) {
    var st_list;
    st_list = st_list_cleanup(req.cookies[ST_LIST_COOKIE]);
    if (!st_list.length) {
      st_list = ST_LIST_DEFAULT;
      res.cookie(ST_LIST_COOKIE, st_list, {
        expires: new Date("2101-01-01"),
        httponly: false
      });
    }
    return fetch_sts(st_list, function(data) {
      return res.render("app/main", {
        title: "Погода в Иркутске и области",
        sts_data: data,
        format_t: function(last, trends) {
          var cls, sign, t, tr, tts, _ref2;
          if (last.t == null) {
            return "";
          }
          t = Math.round(last.t);
          _ref2 = t > 0 ? ["pos", "+"] : t < 0 ? ["neg", "-"] : ["zer", ""], cls = _ref2[0], sign = _ref2[1];
          if (t < 0) {
            t = -t;
          }
          tr = " &nbsp;";
          if (trends != null ? trends.t : void 0) {
            tts = new Date(trends.ts).getTime();
            if (tts > lib.now() - TRENDS_INTERVAL) {
              if (trends.t.last >= trends.t.avg + 1) {
                tr = "&uarr;";
              }
              if (trends.t.last <= trends.t.avg - 1) {
                tr = "&darr;";
              }
            }
          }
          return (" <span class='" + cls + "'>" + sign + "<i>" + t + "</i></span>&deg;") + ("<span class='arr " + cls + "'>" + tr + "</span>");
        }
      });
    });
  });

  app.get('/st_list', function(req, res) {
    return res.json({
      err: "nimp"
    });
  });

  app.get('/st_data', function(req, res) {
    return res.json({
      err: "nimp"
    });
  });

  app.get('/st_graph', function(req, res) {
    return res.json({
      err: "nimp"
    });
  });

  info("Listen - " + config.server.host + ":" + config.server.port);

  app.listen(config.server.port, config.server.host);

  lib.watch_file(__filename);

}).call(this);
