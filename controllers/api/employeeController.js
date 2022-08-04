exports.test = (req, res) => {
    return res.json({
        msg: 'success'
    })
};

exports.user = (req, res) => {
    return res.json({
        msg: 'success',
        name: req.query.name
    })
};