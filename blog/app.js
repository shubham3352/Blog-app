var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require('method-override');

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://shubham:03092001s@ds159184.mlab.com:59184/blog_app");
app.use(express.static("public"));

var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date , default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

//Routes

//Index
app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blog){
		if(err)
		{
			console.log(err);
		} else{
			res.render("index",{blogs:blog});
		}
	});
});

//New 

app.get("/blogs/new",function(req,res){
	res.render("new");
});

//Create

app.post("/blogs",function(req,res){
	var title=req.body.title;
	var image=req.body.image;
	var bodys=req.body.desc;
	var data={title:title,image:image, body:bodys};
	Blog.create(data,function(error,data){
		if(error){
			console.log(error);
		} else{
			res.redirect("/blogs");
		}
	});
});

//Show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id ,function(err,blog){
		if(err){
			console.log(err);
		}else{
			res.render("show",{blog:blog});
		}
	});
});

//Edit Route

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id ,function(err,blog){
		if(err){
			console.log(err);
		}else{
			res.render("edit",{blog:blog});
		}
	})
})

//Update Route

app.put("/blogs/:id",function(req,res){
	var title=req.body.title;
	var image=req.body.image;
	var bodys=req.body.desc;
	var data={title:title,image:image, body:bodys};
	Blog.findByIdAndUpdate(req.params.id, data ,function(err,found){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs/"+ req.params.id);
		}
	});
	
});

//Delete Route

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id , function(err){
			if(err){
				res.redirect("/blogs/" + req.params.id);
			}
			else{
				res.redirect("/blogs/");
			}
	});
});


app.listen(3000,function(){
	console.log("Blog Server Started!!!");
});