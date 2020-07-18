const express = require('express');
const child_process = require('child_process');

const {password,port} = require('./config');
const app = express();

function auth(pwd){return pwd === password}

app.get('/notification',(req,res)=>{
	let {pwd,context,command} = req.query;
	res.set('content-type','application/json');
	if(!auth(pwd)){
		res.send(JSON.stringify({code:1,msg:'auth failed'}));
		return;
	}
	child_process.spawn('termux-notification',['-c',context,'--action',command]);
	res.send(JSON.stringify({code:0}));
	console.log(`notification context:${context} action:${action}`);
});
app.get('/battery',(req,res)=>{
	res.set('content-type','application/json');
	if(!auth(req.query.pwd)){
		res.send(JSON.stringify({code:1,msg:'auth failed'}));
		return;
	}
	let i = child_process.spawn('termux-battery-status');
	i.stdout.once('data',data=>{res.send(data)});
});
app.get('/speak',(req,res)=>{
	let {pwd,text} = req.query;
	if(!auth(pwd)){
		res.send(JSON.stringify({code:1,msg:'auth failed'}));
	}
	child_process.spawn('termux-tts-speak',[text]);
	res.send(JSON.stringify({code:0}));
});

app.listen(port,()=>{console.log(`Port:${port}`)});
