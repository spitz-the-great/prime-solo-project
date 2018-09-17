const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */


router.get('/profile', (req, res) => {
    if(req.isAuthenticated()){
        const query = `SELECT *
                        FROM  "person"
                        JOIN "user_profile"
                        ON "person"."id" = "user_profile"."user_id"
                        WHERE "person"."id" = ${req.user.id}`;
        pool.query(query).then((results) => {
            res.send(results.rows); 
        }).catch((error) => {
            console.log('Error getting user profile data', error);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

router.put('/:id', function( req, res ) {
    const userId = req.user.id;
    const setting = req.body;
    console.log('update privacy setting to: ', req.body);
    const privacyQuery = `UPDATE user_profile 
                            SET privacy_setting=$1
                            WHERE user_id=$2;`;
    pool.query( privacyQuery, [setting, userId])
    .then((result) =>{
    console.log('update result: ', result)
    })
    .catch((error) => {
        console.log('error updating privacy setting: ', error);
        res.sendStatus(500);
    })
})


// router.put('/:id', function(req, res){
//     const id = req.params.id;
//     const joke = req.body;
//     console.log('joke to update: ', joke);
    
//     // Prepared statement for update - this only allows funniness to change
//     const queryText = 'UPDATE jokes SET funniness=$1 WHERE id=$2;';
//     pool.query(queryText, [joke.funniness, id])
//         .then((result) => {
//         console.log('query results: ', result);
//         res.sendStatus(200);
//         })
//         // error handling
//         .catch((err) => {
//             console.log('error making update query:', err);
//             res.sendStatus(500);
//         });
// });

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;