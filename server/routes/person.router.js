const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */


router.get('/profile', (req, res) => {
    // if(req.isAuthenticated()){
        const query = `SELECT *
                        FROM  "person"
                        JOIN "user_profile"
                        ON "person"."id" = "user_profile"."user_id";`;
        pool.query(query).then((results) => {
            res.send(results.rows); 
        }).catch((error) => {
            console.log('Error getting user profile data', error);
            res.sendStatus(500);
        });
    // } else {
    //     res.sendStatus(403);
    // }
});


/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;