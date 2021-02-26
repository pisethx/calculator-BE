"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var httpStatus = require('http-status');

var excel = require('node-excel-export');

var ApiError = require('../utils/ApiError');

var catchAsync = require('../utils/catchAsync');

var _require = require('../services'),
    randomizerService = _require.randomizerService,
    userService = _require.userService;

var createRandomizer = catchAsync(function _callee(req, res) {
  var randomizer;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(randomizerService.createRandomizer(_objectSpread({}, req.body, {
            user: req.user
          })));

        case 2:
          randomizer = _context.sent;
          res.status(httpStatus.CREATED).send(randomizer);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
var getRandomizersByUser = catchAsync(function _callee2(req, res) {
  var randomizers;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(randomizerService.getRandomizersByUser(req.user));

        case 2:
          randomizers = _context2.sent;
          res.status(httpStatus.OK).send({
            results: randomizers
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var saveRandomizerById = catchAsync(function _callee3(req, res) {
  var randomizer;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(randomizerService.saveRandomizerById(req.params.randomizerId, req.user));

        case 2:
          randomizer = _context3.sent;
          res.status(httpStatus.OK).send(randomizer);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
var exportRandomizersByUser = catchAsync(function _callee4(req, res) {
  var randomizers, styles, specification, report;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(randomizerService.getRandomizersByUser(req.user));

        case 2:
          randomizers = _context4.sent;
          styles = {
            headerDark: {
              fill: {
                fgColor: {
                  rgb: 'FF000000'
                }
              },
              font: {
                color: {
                  rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
              }
            }
          };
          specification = {
            id: {
              displayName: 'ID',
              // <- Here you specify the column header
              headerStyle: styles.headerDark,
              // <- Header style
              width: 200
            },
            type: {
              displayName: 'Type',
              headerStyle: styles.headerDark,
              width: 80
            },
            dataset: {
              displayName: 'Dataset',
              headerStyle: styles.headerDark,
              width: 300
            },
            result: {
              displayName: 'Result',
              headerStyle: styles.headerDark,
              width: 300
            },
            createdAt: {
              displayName: 'Created At',
              headerStyle: styles.headerDark,
              width: 300
            }
          };
          report = excel.buildExport([{
            name: 'Randomizer',
            // <- Specify sheet name (optional)
            specification: specification,
            // <- Report specification
            data: randomizers.map(function (rnd) {
              return {
                id: rnd.id,
                type: rnd.name,
                dataset: rnd.dataset.join(','),
                result: JSON.stringify(rnd.result),
                createdAt: new Date(rnd.createdAt).toLocaleString()
              };
            }) // <-- Report data

          }]);
          res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)

          res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.status(httpStatus.OK).send(report);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
});
var deleteRandomizerById = catchAsync(function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(randomizerService.deleteRandomizerById(req.params.randomizerId, req.user));

        case 2:
          res.status(httpStatus.OK).send();

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
});
module.exports = {
  createRandomizer: createRandomizer,
  getRandomizersByUser: getRandomizersByUser,
  saveRandomizerById: saveRandomizerById,
  deleteRandomizerById: deleteRandomizerById,
  exportRandomizersByUser: exportRandomizersByUser
};