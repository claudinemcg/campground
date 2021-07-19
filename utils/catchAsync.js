module.exports = func => {   // accepts function 
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}