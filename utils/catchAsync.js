module.exports = func => { // pass in func 
    return (req, res, next) => { //return function that calls func and then.catch (try and catch)
        func(req, res, next).catch(err => next(err)); // pass err to next error handler
    }
}
