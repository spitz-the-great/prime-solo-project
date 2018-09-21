const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */

router.get('/profile', (req, res) => {
    console.log('in get profile');
    if (req.isAuthenticated()) {
        const query = `SELECT *
                        FROM  "person"
                        JOIN "user_profile"
                        ON "person"."id" = "user_profile"."user_id"
                        WHERE "person"."id" = ${req.user.id};`;
        pool.query(query).then((results) => {
            res.send(results.rows);
            // can set index of rows on this if expecting just one set
            console.log('successful get profile')
        }).catch((error) => {
            console.log('Error getting user profile data', error);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

router.get('/search/:name', (req, res) => {
    // const searchName = req.body;
    const searchName = req.params.name;
    console.log(req.body, searchName);
    if (req.isAuthenticated()) {
        const searchQuery = `SELECT "person"."username"
                            FROM "person"
                            JOIN "user_profile"
                            ON "person"."id" = "user_profile"."user_id"
                            WHERE "person"."username" =$1
                            ;`;

        pool.query(searchQuery, [searchName])
            .then((results) => {
                res.send(results.rows);
                console.log('successful user search', results.rows)
            }).catch((error) => {
                console.log('Error getting user search data', error);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(403);
    }
});

router.put('/privacy/:id', (req, res) => {
    const userId = req.user.id;
    const setting = req.body;
    console.log('update privacy setting to: ', req.body);
    const privacyQuery = `UPDATE user_profile 
                            SET privacy_setting=$1
                            WHERE user_id=$2;`;
    pool.query(privacyQuery, [setting.setting, userId])
        .then((result) => {
            console.log('update result: ', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error updating privacy setting: ', error);
            res.sendStatus(500);
        })
});


/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;