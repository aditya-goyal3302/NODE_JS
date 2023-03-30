const http = require("http");

const server = http.createServer((req,res)=>{
    var url = req.url;
    var method = req.method;
    if(url ==='/'){
        res.write('<body><h1> Welcome to My Node.js Server</h1><br><br><form action = "/create-user" method = "POST"> UserName: <input type="text"/ name="username"><br> <button type="submit" > Show Users </button></form></body>');
        res.end();
    }
    if(url === '/create-user' && method === 'POST'){
        const body = [];
        req.on('data',chunk=>{
            body.push(chunk);
        });
        req.on('end',function(){
            const parsedbody = Buffer.concat(body).toString();
            const mess = parsedbody.split('=')[1];
            console.log(mess);
            
        });
        //res.setHeader('Content-Type','text/html');
        res.statusCode = 302;
        res.setHeader('Location','/users');
        return res.end();
    }
    if(url === '/users'){
        res.write("<body>"+
        "<ul><li>aditya</li><li>deepak</li><li>gaurav</li></ul>"+
        "</body>");
        res.end();
    }
});

server.listen(3000);
