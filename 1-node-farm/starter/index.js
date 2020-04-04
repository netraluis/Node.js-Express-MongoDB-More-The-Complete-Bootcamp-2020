const fs = require('fs');
const http = require('http');
const url = require('url');


//////////////////
//FILES
// const hello = 'hello world';
// console.log(hello)


//blocking sync
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.
// Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written!');

//non blocking asyn
// fs.readFile('./txt/start.txt','utf-8',(err, data1)=>{
//     console.log(data1);
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err, data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err, data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
//                 console.log('Your file has been written 😀')
//             })
//         })
//     })
// })
// console.log('will read file 😌😀')

/////////////////////////////////////
//SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%productName%}/g, product.productName);
    output = output.replace(/{%image%}/g, product.image);
    output = output.replace(/{%price%}/g, product.price);
    output = output.replace(/{%from%}/g, product.from);
    output = output.replace(/{%nutrients%}/g, product.nutrients);
    output = output.replace(/{%quantity%}/g, product.quantity);
    output = output.replace(/{%price%}/g, product.price);
    output = output.replace(/{%description%}/g, product.description);
    output = output.replace(/{%id%}/g, product.id);

    if(!product.organic){
        output = output.replace(/{%not_organic%}/g, 'not-organic')
    }
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data)


const server = http.createServer((req,res)=>{
    console.log(req.url);
    const pathName = req.url;

    //Overview page
    if (pathName === '/' || pathName === '/overview'){
        res.writeHead(200, {'Content-type':'text/html'})

        const cardsHtml = dataObj.map(el => {
            return replaceTemplate(tempCard, el)
        }).join('');
        const output = tempOverview.replace('{%product_cards%}', cardsHtml)
        // console.log(cardsHtml);
        res.end(output);

    //Product page
    }else if(pathName === '/product'){
        res.end('This is the PRODUCT');

    //API
    }else if(pathName === '/api'){
        res.writeHead(200, {'Content-type':'application/json'})
        res.end(data);
    //Not found
    }else{
        res.writeHead(404,{
            'Content-type':'text/html', 
            'my-own-header':'hello world'
        });
        res.end('<h1>page not found!</h1>');
    }
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log('listening to request on port 8000');
})