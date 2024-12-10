/**
 * @swagger
 * tags:
 *  - name: Option
 *    description: Option modules and routes
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOption:
 *       type: object
 *       required:
 *         - title
 *         - key
 *         - type
 *         - category
 *         - required
 *       properties:
 *         title:
 *           type: string
 *         key:
 *           type: string
 *         guide:
 *           type: string
 *         required:
 *           type: boolean
 *         type:
 *           type: string
 *           enum:
 *              - number
 *              - string
 *              - boolean
 *              - array
 *         category:
 *           type: string
 *         enum:
 *           type: array
 *           items:
 *              type: string
 *
 *     UpdateOption:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         key:
 *           type: string
 *         guide:
 *           type: string
 *         required:
 *           type: boolean
 *         type:
 *           type: string
 *           enum:
 *              - number
 *              - string
 *              - boolean
 *              - array
 *         category:
 *           type: string
 *         enum:
 *           type: array
 *           items:
 *              type: string
 *
 */

/**
 * @swagger
 * /option:
 *   post:
 *     summary: Create new option for option
 *     tags:
 *       - Option
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/CreateOption'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOption'
 *     responses:
 *       201:
 *         description: created
 */
/**
 * @swagger
 * /option/{id}:
 *   put:
 *     summary: Updated Option by id
 *     tags:
 *       - Option
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to retrieve options for
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOption'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOption'
 *     responses:
 *       200:
 *         description: updated
 */
/**
 * @swagger
 * paths:
 *   /option/by-category/{categoryId}:
 *     get:
 *       summary: Get all options of category
 *       tags:
 *         - Option
 *       parameters:
 *         - in: path
 *           name: categoryId
 *           required: true
 *           description: The ID of the category to retrieve options for
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: success
 */

/**
 * @swagger
 * paths:
 *   /option/by-category-slug/{slug}:
 *     get:
 *       summary: Get all options of category
 *       tags:
 *         - Option
 *       parameters:
 *         - in: path
 *           name: slug
 *           required: true
 *           description: The ID of the category to retrieve options for
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: success
 */
/**
 * @swagger
 * paths:
 *   /option/{id}:
 *     get:
 *       summary: Get option by id
 *       tags:
 *         - Option
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the option to find that
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: success
 */
/**
 * @swagger
 * paths:
 *   /option/{id}:
 *     delete:
 *       summary: Delete option by id
 *       tags:
 *         - Option
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the option to delete that
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: deleted successfully
 */

/**
 * @swagger
 * /option:
 *      get:
 *          summary: Get all options
 *          tags:
 *              - Option
 *          responses:
 *              200:
 *                  description: success
 */
