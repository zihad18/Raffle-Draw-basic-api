const fs = require('fs/promises');
const path = require('path');
const dbpath = path.resolve('data', 'db.json');

exports.readFile = async () =>{
    const data = await fs.readFile(dbpath);
    return JSON.parse(data);
};

exports.writeFile = async (data) =>{
   await fs.writeFile(dbpath, JSON.stringify(data));
};