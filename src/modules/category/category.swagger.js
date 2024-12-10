/**
 * @swagger
 * tags:
 *  - name: Category
 *    description: Category modules and routes
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategory:
 *       type: object
 *       required:
 *         - name
 *         - icon
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         icon:
 *           type: string
 *         parent:
 *           type: string
 *
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create new category
 *     tags:
 *       - Category
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       201:
 *         description: created
 */
/**
 * @swagger
 * /category:
 *      get:
 *          summary: Get all categories
 *          tags:
 *              - Category
 *          responses:
 *              200:
 *                  description: success
 */

/**
 * @swagger
 * paths:
 *   /category/{id}:
 *     delete:
 *       summary: Delete category and it's options by id
 *       tags:
 *         - Category
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the category to delete that
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: deleted successfully
 */
