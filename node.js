const fs= require('fs');
const http =require('http');
const path=require('path');
const webpack= require('webpack');
const express=require('express')
const webpackMiddleware = require('webpack-middleware');
const webpackConfig=require('./build/webpack.config')

function readFile(pathname, targetPath) {
    let resData = fs.readdirSync(pathname, { encoding: 'utf8' })
    return resData = resData.map(item => {
        let stat = fs.statSync(path.resolve(__dirname, pathname, item));
        if (stat.isDirectory()) {
            return readFile(path.resolve(__dirname, pathname, item), targetPath + item + '/')
        } else {
            return (targetPath + item).toString();
        }
    })
}

let result = readFile(path.resolve(__dirname, './public/assets/images/'), '@/assets/images/');

result = result.flat(Infinity);

result=result.filter((file,index)=>{
    if(/\.(png|jpg|jpeg|gif|svg)$/.test(file)){
        return true;
    }
})

result=result.map((file,index)=>{
    return {name:"image"+index,url:`require("${file}")`}
})

let str=`export const Resources =${JSON.stringify(result)}`;

res=str.replace(/"require/g,'require').replace(/\\/g,"").replace(/"\)"/g,'")')

fs.writeFileSync(path.resolve(__dirname,'./public/entry/base/fsresour.js'),res,{
    encoding:'utf8',
    mode:0o666,
    flag:"w"
});

const compiler=webpack(webpackConfig(),(err,stats)=>{
    if(err){
        console.log(err);
    }else{
      
    }
})  