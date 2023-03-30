const fs = require("fs");

const requestHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        //console.log(req);
        res.write('<body><h2>Enter message</h2><br> <form action="/message" method="POST"><input type="text" name ="message"/><br><button type ="submit"> SEND </button></form></body>');
        return res.end();
    }
    
    if(url === "/message" && method == "POST"){
        const body =[];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
        req.on("end",()=>{
            const parsedbody = Buffer.concat(body).toString();
            const mess = parsedbody.split('=')[1];
            console.log(mess);
            fs.writeFile('1/message.txt',mess,err=>{
                res.statusCode = 302;
                res.setHeader('Location','/');
                return res.end();
            });
        });
    }
    
    //console.log(req.url,req.method, req.headers);
    //res.setHeader('Content-Type','text/html');
    
    //res.end();
}

module.exports = requestHandler;
