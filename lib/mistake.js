class Definer {
/** general errors */    
static general_err1 = "att: something went wrong!";
static general_err2 = "att: there is no data with those params!";
static general_err3 = "att: file upload error!";

    // member auth related
static auth_err1 = "att: mongodb validation is failed";
static auth_err2 = "att: jwt token creation error"
static auth_err3 = "att: no member with that mb_nick";
static auth_err4 = "att: your credentials do not match";
static auth_err5 = "att: you are not authenticated";

// car related errors
static car_err1 = "att: car adding is failed!";

// order related errors
static order_err1 = "att: order creation is failed!";
static order_err2 = "att: order item creation is failed!";
static order_err3 = "att: no order with that param exists!";

// articles related errors
static article_err1 = "att: author member for articles not provided"
static article_err2 = "att: no article found for that member"
static article_err3 = "att: no articles found for that target"
}



module.exports = Definer