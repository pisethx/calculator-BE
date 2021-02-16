const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const randomizerValidation = require('../../validations/randomizer.validation')
const randomizerController = require('../../controllers/randomizer.controller')

const router = express.Router()

router.route('/').post(auth(), validate(randomizerValidation.createRandomizer), randomizerController.createRandomizer)
router.route('/me').get(auth(), randomizerController.getRandomizersByUser)
router.route('/me/export').get(auth(), randomizerController.exportRandomizersByUser)
router.route('/:randomizerId').delete(auth(), randomizerController.deleteRandomizerById)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Randomizer
 *   description: Randomize Stuff
 */

/**
 * @swagger
 * path:
 *  /randomizer:
 *    post:
 *      summary: Randomize stuff
 *      tags: [Randomizer]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Randomizer'
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Randomizer'
 */

/**
 * @swagger
 * path:
 *  /randomizer/me:
 *    get:
 *      summary: get user's randomizer history
 *      tags: [Randomizer]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK, results of randomizer history for current user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Randomizer'
 */

/**
 * @swagger
 * path:
 *  /randomizer/me/export:
 *    get:
 *      summary: export user's randomizer history as xlsx
 *      tags: [Randomizer]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK
 */

/**
 * @swagger
 * path:
 *  /randomizer/{id}:
 *    delete:
 *      summary: delete user's randomizer, get randomizerId from /v1/randomizer/me
 *      tags: [Randomizer]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Randomizer id
 *      responses:
 *        "200":
 *          description: OK, randomizer deleted (no content)
 */
