"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var request = require('supertest');

var faker = require('faker');

var httpStatus = require('http-status');

var _require = require('@nastyox/rando.js'),
    rando = _require.rando;

var app = require('../../src/app');

var setupTestDB = require('../utils/setupTestDB');

var _require2 = require('../../src/models'),
    User = _require2.User,
    Randomizer = _require2.Randomizer;

var _require3 = require('../fixtures/user.fixture'),
    userOne = _require3.userOne,
    admin = _require3.admin,
    insertUsers = _require3.insertUsers;

var _require4 = require('../fixtures/randomizer.fixture'),
    randomizerIndividual = _require4.randomizerIndividual,
    randomizerGroup = _require4.randomizerGroup,
    insertRandomizers = _require4.insertRandomizers;

var _require5 = require('../fixtures/token.fixture'),
    userOneAccessToken = _require5.userOneAccessToken,
    adminAccessToken = _require5.adminAccessToken;

var _require6 = require('../../src/config/randomizer'),
    randomizerTypes = _require6.randomizerTypes;

var _require7 = require('../../src/services/randomizer.service'),
    randomizeGroup = _require7.randomizeGroup,
    randomizeIndividual = _require7.randomizeIndividual;

setupTestDB();

var randomizerOne = _objectSpread({}, randomizerIndividual, {
  result: randomizeIndividual(randomizerIndividual.dataset)
});

var randomizerTwo = _objectSpread({}, randomizerGroup, {
  result: randomizeGroup(randomizerGroup.dataset, randomizerGroup.quantity)
});

var testRandomizer = function testRandomizer(randomizerBody) {
  var res, dbRandomizer, maxNumberOfItemsPerGroup;
  return regeneratorRuntime.async(function testRandomizer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(insertUsers([userOne]));

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(request(app).post('/v1/randomizer').set('Authorization', "Bearer ".concat(userOneAccessToken)).send(randomizerBody).expect(httpStatus.CREATED));

        case 4:
          res = _context.sent;
          expect(res.body.user).toEqual({
            createdAt: expect.anything(),
            id: expect.anything(),
            name: userOne.name,
            email: userOne.email,
            role: userOne.role
          });
          _context.next = 8;
          return regeneratorRuntime.awrap(Randomizer.findById(res.body.id));

        case 8:
          dbRandomizer = _context.sent;
          expect(dbRandomizer).toBeDefined();
          expect(dbRandomizer.dataset.length).toEqual(randomizerBody.dataset.length);
          expect(res.body.id).toEqual(expect.anything());
          expect(res.body.dataset).toEqual(randomizerBody.dataset);
          expect(res.body.type).toEqual(randomizerBody.type);
          expect(res.body.saved).toEqual(false);

          if (res.body.type === randomizerTypes.GROUP) {
            maxNumberOfItemsPerGroup = Math.ceil(randomizerBody.dataset.length / randomizerBody.quantity);
            expect(res.body.result.length).toBe(randomizerBody.quantity);
            if (res.body.result.length > 1) expect(res.body.result[0].length).toBe(maxNumberOfItemsPerGroup);
            expect(res.body.result[res.body.result.length - 1].length).toBeLessThanOrEqual(maxNumberOfItemsPerGroup);
          }

          if (res.body.type === randomizerTypes.CUSTOM) {
            expect(randomizerBody.quantity).toBeLessThanOrEqual(randomizerBody.dataset.length);
            expect(res.body.result.length).toBe(randomizerBody.quantity);
          }

          if (res.body.type === randomizerTypes.INDIVIDUAL) expect(res.body.dataset).toContain(res.body.result);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
};

describe('Randomizer routes', function () {
  describe('GET v1/randomizer/me', function () {
    test('should return 200 with empty data when randomizer not save', function _callee() {
      var res;
      return regeneratorRuntime.async(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context2.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne, randomizerTwo], userOne));

            case 4:
              _context2.next = 6;
              return regeneratorRuntime.awrap(request(app).get('/v1/randomizer/me').set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.OK));

            case 6:
              res = _context2.sent;
              expect(res.body.results.length).toEqual(0);
              _context2.next = 10;
              return regeneratorRuntime.awrap(request(app).get('/v1/randomizer/me/export').set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.OK));

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    test('should return 200 when randomizer exists and can be exported', function _callee2() {
      var res;
      return regeneratorRuntime.async(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context3.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne, randomizerTwo], userOne, true));

            case 4:
              _context3.next = 6;
              return regeneratorRuntime.awrap(request(app).get('/v1/randomizer/me').set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.OK));

            case 6:
              res = _context3.sent;
              expect(res.body.results.length).toEqual(2);
              _context3.next = 10;
              return regeneratorRuntime.awrap(request(app).get('/v1/randomizer/me/export').set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.OK));

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    test('should return 200 with empty result', function _callee3() {
      var res;
      return regeneratorRuntime.async(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context4.next = 4;
              return regeneratorRuntime.awrap(request(app).get('/v1/randomizer/me').set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.OK));

            case 4:
              res = _context4.sent;
              expect(res.body.results.length).toEqual(0);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    test('should throw 401 unauthorized error if not authenticated', function _callee4() {
      return regeneratorRuntime.async(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(request(app).get('/v1/randomizer/me').send().expect(httpStatus.UNAUTHORIZED));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
  describe('POST v1/randomizer', function () {
    var randomizerBodyCustom, randomizerBodyIndividual, randomizerBodyGroup;
    beforeEach(function () {
      var dataset = new Array(50).fill(null).map(function (e) {
        return faker.name.findName();
      });
      randomizerBodyGroup = {
        type: randomizerTypes.GROUP,
        dataset: dataset,
        quantity: rando(1, dataset.length)
      };
      randomizerBodyIndividual = {
        type: randomizerTypes.INDIVIDUAL,
        dataset: dataset
      };
      randomizerBodyCustom = {
        type: randomizerTypes.CUSTOM,
        dataset: dataset,
        quantity: rando(1, dataset.length)
      };
    });
    test('should return 200 for individual randomizer if data is ok', function _callee5() {
      return regeneratorRuntime.async(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(testRandomizer(randomizerBodyIndividual));

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      });
    });
    test('should return 200 for group randomizer if data is ok', function _callee6() {
      return regeneratorRuntime.async(function _callee6$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(testRandomizer(randomizerBodyGroup));

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
    test('should return 200 for custom randomizer if data is ok', function _callee7() {
      return regeneratorRuntime.async(function _callee7$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(testRandomizer(randomizerBodyCustom));

            case 2:
            case "end":
              return _context8.stop();
          }
        }
      });
    });
    test('should throw 401 unauthorized error if not authenticated', function _callee8() {
      return regeneratorRuntime.async(function _callee8$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(request(app).post('/v1/randomizer').send(randomizerBodyGroup).expect(httpStatus.UNAUTHORIZED));

            case 2:
            case "end":
              return _context9.stop();
          }
        }
      });
    });
    test('should throw 400 bad request for wrong quantity', function _callee9() {
      return regeneratorRuntime.async(function _callee9$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context10.next = 4;
              return regeneratorRuntime.awrap(request(app).post('/v1/randomizer').set('Authorization', "Bearer ".concat(userOneAccessToken)).send(_objectSpread({}, randomizerBodyGroup, {
                quantity: randomizerBodyGroup.dataset.length + 1
              })).expect(httpStatus.BAD_REQUEST));

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
    test('should throw 400 bad request for wrong type', function _callee10() {
      return regeneratorRuntime.async(function _callee10$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context11.next = 4;
              return regeneratorRuntime.awrap(request(app).post('/v1/randomizer').set('Authorization', "Bearer ".concat(userOneAccessToken)).send(_objectSpread({}, randomizerBodyCustom, {
                type: faker.name.findName()
              })).expect(httpStatus.BAD_REQUEST));

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      });
    });
    test('should throw 400 bad request for empty dataset', function _callee11() {
      return regeneratorRuntime.async(function _callee11$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context12.next = 4;
              return regeneratorRuntime.awrap(request(app).post('/v1/randomizer').set('Authorization', "Bearer ".concat(userOneAccessToken)).send(_objectSpread({}, randomizerBodyIndividual, {
                dataset: []
              })).expect(httpStatus.BAD_REQUEST));

            case 4:
            case "end":
              return _context12.stop();
          }
        }
      });
    });
  });
  describe('PATCH v1/randomizer/randomizerId', function () {
    test('should throw 404 not found if randomizerId does not exist', function _callee12() {
      return regeneratorRuntime.async(function _callee12$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context13.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne], userOne));

            case 4:
              _context13.next = 6;
              return regeneratorRuntime.awrap(request(app).patch("/v1/randomizer/".concat(randomizerTwo._id)).set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.NOT_FOUND));

            case 6:
            case "end":
              return _context13.stop();
          }
        }
      });
    });
    test("should throw 401 unauthorized error if try to save others' randomizers", function _callee13() {
      return regeneratorRuntime.async(function _callee13$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context14.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne], admin));

            case 4:
              _context14.next = 6;
              return regeneratorRuntime.awrap(request(app).patch("/v1/randomizer/".concat(randomizerOne._id)).set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.UNAUTHORIZED));

            case 6:
            case "end":
              return _context14.stop();
          }
        }
      });
    });
    test('should return 200 and randomizer object when saved', function _callee14() {
      var res, dbRandomizer;
      return regeneratorRuntime.async(function _callee14$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context15.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne], userOne));

            case 4:
              _context15.next = 6;
              return regeneratorRuntime.awrap(request(app).patch("/v1/randomizer/".concat(randomizerOne._id)).set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.OK));

            case 6:
              res = _context15.sent;
              expect(res.body.saved).toBe(true);
              _context15.next = 10;
              return regeneratorRuntime.awrap(Randomizer.findById(res.body.id));

            case 10:
              dbRandomizer = _context15.sent;
              expect(dbRandomizer).toBeDefined();
              expect(dbRandomizer.saved).toBe(true);

            case 13:
            case "end":
              return _context15.stop();
          }
        }
      });
    });
  });
  describe('DELETE v1/randomizer/:randomizerId', function () {
    test('should throw 404 not found error if try to non existing randomizer', function _callee15() {
      return regeneratorRuntime.async(function _callee15$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context16.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne], userOne));

            case 4:
              _context16.next = 6;
              return regeneratorRuntime.awrap(request(app).delete("/v1/randomizer/".concat(randomizerTwo._id)).set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.NOT_FOUND));

            case 6:
            case "end":
              return _context16.stop();
          }
        }
      });
    });
    test("should throw 401 unauthorized error if try to delete others' randomizers", function _callee16() {
      return regeneratorRuntime.async(function _callee16$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context17.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne], admin));

            case 4:
              _context17.next = 6;
              return regeneratorRuntime.awrap(request(app).delete("/v1/randomizer/".concat(randomizerOne._id)).set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.UNAUTHORIZED));

            case 6:
            case "end":
              return _context17.stop();
          }
        }
      });
    });
    test('should return 200 when delete own randomizer', function _callee17() {
      return regeneratorRuntime.async(function _callee17$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return regeneratorRuntime.awrap(insertUsers([userOne]));

            case 2:
              _context18.next = 4;
              return regeneratorRuntime.awrap(insertRandomizers([randomizerOne], userOne));

            case 4:
              _context18.next = 6;
              return regeneratorRuntime.awrap(request(app).delete("/v1/randomizer/".concat(randomizerOne._id)).set('Authorization', "Bearer ".concat(userOneAccessToken)).send().expect(httpStatus.OK));

            case 6:
            case "end":
              return _context18.stop();
          }
        }
      });
    });
  });
});