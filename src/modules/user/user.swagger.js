/**
 * @swagger
 * tags:
 *  - name: User
 *    description: User modules and routes
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     SendOTP:
 *       type: object
 *       required:
 *         - mobile
 *       properties:
 *         mobile:
 *           type: string
 */
/**
 * @swagger
 * /user/whoami:
 *   get:
 *     summary: Get user porfile
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: success
 */
