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

router.get('/getPath', (req, res) => {
    console.log('in get avatar');
    userId = req.user.id;
    if (req.isAuthenticated()) {
        const getAvatarQuery = 
        `SELECT "user_profile"."avatar", "avatars"."image_path"
        FROM "user_profile"
        JOIN "avatars"
        ON "user_profile"."avatar" = "avatars"."name"
        WHERE "user_profile"."user_id" =$1;`;
        pool.query(getAvatarQuery, [userId])
            .then((results) => {
                res.send(results.rows);
                console.log('successful get avatar', results.rows)
            }).catch((error) => {
                console.log('Error getting avatar', error);
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

router.put('/avatar/:id', (req, res) => {
    const userId = req.user.id;
    const avatar = req.body;
    console.log('update avatar to: ', req.body);
    const privacyQuery = `UPDATE user_profile 
                            SET avatar=$1
                            WHERE user_id=$2;`;
    pool.query(privacyQuery, [avatar.avatar, userId])
        .then((result) => {
            console.log('update result: ', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error updating avatar setting: ', error);
            res.sendStatus(500);
        })
});

router.delete('/delete/:id', (req, res) => {

    const id = req.params.id;
    console.log('id to delete: ', id);
    const deleteQuery = `DELETE FROM person
                         WHERE id=$1;`;
    pool.query(deleteQuery, [id])
        .then((result) => {
            console.log('delete result: ', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('error deleting a user', error);
            res.sendStatus(500);
        });
});


// router.delete('/:id', function(req, res) {
//     const id = req.params.id;
//     console.log('id to delete: ', id);

//     // Prepared statement for delete
//     const queryText = 'DELETE FROM jokes WHERE id=$1;';
//     pool.query(queryText, [id],)
//         .then((result) => { 
//             console.log('query results: ', result);
//             res.sendStatus(200);
//         })
//         // error handling
//         .catch((err) => {
//             console.log('error making delete query:', err);
//             res.sendStatus(500);
//         });

// });


/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;