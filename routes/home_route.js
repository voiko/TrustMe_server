    const express = require('express')
    const router = express.Router()


    router.get('/', (req, res, next) => {
        let jsonResponse = {
            "handsetCards": [{
                    imageName: 'blockchain',
                    title: 'Blockchain-based smart contract',
                    cols: 2,
                    rows: 1
                },
                {
                    imageName: 'contract',
                    title: 'A smart contract allows for secure payment',
                    cols: 2,
                    rows: 1
                },
                {
                    imageName: 'Transction',
                    title: 'Make a transfer quickly and safely',
                    cols: 2,
                    rows: 1
                },
                {
                    imageName: 'bitcoin',
                    title: 'Making a payment using Bitcoin currencies',
                    cols: 2,
                    rows: 1
                }
            ],
            "webCards": [{
                    imageName: 'blockchain',
                    title: 'Blockchain-based smart contract',
                    cols: 1,
                    rows: 1
                },
                {
                    imageName: 'contract',
                    title: 'A smart contract allows for secure payment',
                    cols: 1,
                    rows: 1
                },
                {
                    imageName: 'Transction',
                    title: 'Make a transfer quickly and safely',
                    cols: 1,
                    rows: 1
                },
                {
                    imageName: 'bitcoin',
                    title: 'Making a payment using Bitcoin currencies',
                    cols: 1,
                    rows: 1
                }
            ]
        }
        res.status(200).json(jsonResponse)
    });


    module.exports = router