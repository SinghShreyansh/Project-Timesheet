exports.test = (req, res) => {
    return res.status(201).json({
        msg: 'success',
        statusCode : 201,
        for : "all",
    })
};

exports.test1 = (req, res) => {
    return res.status(201).json({
        msg: 'success',
        statusCode : 201,
        for : "alluser",
    })
};