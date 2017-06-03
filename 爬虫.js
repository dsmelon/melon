var cheerio=require("cheerio");
var http=require("http");
var req=http.get("https://juejin.im/",(res)=>{
	var body="";
	res.on("data",chunk=>{
		bady+=chunk;
	})
	res.on("end",()=>{
		console.log(body);
	})
});