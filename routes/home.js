exports.index = function(req, res, next){
    console.log("hello world");
    return res.render('index', {});
};