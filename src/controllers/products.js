exports.createProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    console.log('request: ', req.body);
    res.json(
        {
            message: 'Create Product Success!!!',
            data: {
                id: 1,
                name: name,
                price: price
            }
        }
    );
    next();
}

exports.getAllProducts = (req, res, next) => {
    res.json(
        {
            message: "Get All Product Success",
            data: {
                id: 1,
                name: 'Es Doger',
                price: 6000
            }
        }
    );
    next();
}