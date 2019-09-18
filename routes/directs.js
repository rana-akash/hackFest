var express = require('express');
var router = express.Router();
var pythonshell = require('python-shell');
var fs=require('fs');
var qpInfo = [
    {
        'QpName':"PF-Assgn-1",
        'test1' : 'add(a,b)',
        'test2' : 'add(a,b)',
        'test3' : 'sub(a,b)',
        'test4' : 'sub(a,b)',
        'test5' : 'mult(a,b)',
        'test6' : 'mult(a,b)',
        'test7' : 'div(a,b)',
        'test8' : 'div(a,b)'
    }
]

const asyncHandler = fn =>(req,res,next)=>
    Promise
        .resolve(fn(req,res,next))
        .catch(next)

function execute(data,userId,hashTag,callback){
    var regex=/^\w+[-]\w+[-]\d+/
    
    if(!hashTag.match(regex)){
        return callback(false);//res.send(JSON.stringify(false))
    }
    var fileName=hashTag.replace(/[0-9]/g,'').replace(/[-]/g,'')+hashTag.match(/\d+/);
    var index=hashTag.indexOf('-');
    var testFileName="test"+hashTag.substr(0,index)+hashTag.match(/\d+/)+'.py';
    fs.writeFile('./executable/'+userId+fileName+'.py', data, function(err, data) {
        if (err) return callback(false);//res.send(JSON.stringify(false));
        else{ 
            console.log("Successfully Written to File.");
            fs.readFile('./executable/'+testFileName,function(err,data){
                if(err) return callback(false);//res.send(JSON.stringify(false));
                else {
                    console.log('inside');
                    console.log(fileName)
                    var testData=String(data).replace(new RegExp(fileName,'g'),userId+fileName);
                    fs.writeFile('./executable/'+userId+testFileName, testData, function(err, data) {
                        if (err) return callback(false);//res.send(JSON.stringify(false));
                        else {
                            console.log("Successfully Written to File.");
                            var options = {
                                mode: 'text',
                                pythonPath: '/usr/local/bin/python3',
                                pythonOptions: ['-u'],
                                scriptPath: '/Users/rana/Downloads/nodejs-docs-hello-world-master/executable'
                            };
                            pythonshell.PythonShell.run(userId+testFileName,options, function (err, data) {
                                if (err) return callback(false);//throw err;
                                //res.setHeader('Content-Type', 'application/json');
                                    //res.send(data[0]);
                                    return callback(data[0]);
                                });
                        }
                    });
                }
            });
        }
    });
}


router.post('/execute',asyncHandler((req,res,next)=>{
    var jsonData = req.body;
    res.setHeader('Content-Type', 'application/json');
    var data = req.body.Code;
    var userId=req.body.UserId.replace('.','_');
    var hashTag=req.body.QpName;
    execute(data,userId,hashTag,function(result){
        if(result){
            var result1 = JSON.parse(result)
            result1['HashTag'] = jsonData.QpName;
            insertCode(res.db,jsonData,result1).then(result =>{
                if(result){
                    //res.send(true)
                    getCorrectCode(res.db,jsonData,result1).then(correctArr=>{
                        //console.log('hh'+correctArr)
                        res.send(correctArr);
                    });
                }else{
                    res.send(JSON.stringify(false));
                }
            });
        }else{
            console.log('err')
            res.send(JSON.stringify(false))
        }
    });
    
    
}));

async function getCorrectCode(dbpass,data,jsonD){
    try{
        //console.log(jsonD)
        let db = await dbpass;
        var toReturn = [];
        var failed = [];
        jsonD.logicalVer.forEach(function(obj){
            if(!obj.isPassed){
                failed.push(obj.testCaseName)
            }
        });
        //Verification 100%
        if(failed.length == 0){
            return null;
        }
        else{
            //console.log('hh')
            for(let test of failed){
                let result = await getTestMap(db,test,data.QpName);
                if(result){
                    for(let obj of result){
                        toReturn.push(obj)
                    }
                }
                // getTestMap(db,test,data.QpName).then(function(result){
                //     //console.log(result)
                //     if(result){
                //         for(let obj of result){
                //             toReturn.push(obj)
                //         }
                //         //console.log(toReturn)
                //     }
                //     // toReturn.concat(result)
                //     // console.log(toReturn)
                //     //console.log(test+JSON.stringify(result))
                // });
            }//console.log(toReturn)
            // getTestMap(db,'test2',data.QpName).then(function(result){
            //     //console.log(result.length)
            //     for(let obj of result){
            //         toReturn.push(obj)
            //     }
            //     //toReturn.concat(result)
            //     //console.log(test+JSON.stringify(result))
            // });
            // console.log(toReturn)
        }
        // for(var obj in jsonD.logicalVer){
        //     console.log(obj)
        // }

        // var failed = [];
        // Reflect.ownKeys(data.LogicalTest).forEach(function(key){
        //     if(!data.LogicalTest[key])
        //         failed.push(key)
        // });
        // console.log(failed)
        // 
        jsonD['suggestion'] = toReturn;
        return jsonD
    }catch(err){
        console.log('inside Catch : '+err);
        return null;
    }
}

async function getTestMap(db,testName,QpName){
    try{
        var toReturn = []
        var sig = qpInfo[0][testName];
        const CodeRepo = db.collection('CodeRepo');
        const docs = await CodeRepo.find({['LogicalTest.'+testName]:true,QpName:QpName}).toArray();
        //console.log(docs.length)
        if(docs.length==0)
            return null;
        var count = 0;
        for( let doc of docs){
            const last = await CodeRepo.findOne({$query:{
                UserId:doc.UserId,
                ['LogicalTest.'+testName]:false,
                QpName:QpName,TimeStamp:{$lt:doc.TimeStamp} 
            },$orderby:{TimeStamp:1}});
            if(last){
                 var string = last.Code;
                var n = string.indexOf(sig);
                var searchindex=n+string.substr(n).indexOf('def')
                var snipp='def '+string.substr(n,searchindex-n1)
                var string1= doc.Code;
                var n1 = string1.indexOf(sig);
                var searchindex1=n1+string1.substr(n1).indexOf('def')
                var snipp1='def '+string1.substr(n1,searchindex1-n1)
                console.log(snipp)
                toReturn.push({
                    "methodSignature" : sig,
                    "testCaseName" : testName,
                    "suggestionId" : ++count,
                    "lastNotVerified" : snipp,
                    "lastNotVerifiedTimeStamp" : last.TimeStamp,
                    "firstVerified": snipp1,
                    "firstVerifiedTimeStamp":doc.TimeStamp
                });
            }
        }
       return toReturn;
        
    }catch(err){
        console.log(err)
        return null;
    }
}

async function insertCode(dbpass,data,jsonD){
    try{
        let db = await dbpass;
        var StructureTest = {}
        jsonD.structuralVer.forEach(function(obj){
            StructureTest[obj.methodSignature] = obj.isPassed;
        })
        var LogicalTest = {}
        jsonD.logicalVer.forEach(function(obj){
            LogicalTest[obj.testCaseName] = obj.isPassed;
        });
        var toPush = {
            UserId : data.UserId,
            QpName :data.QpName,
            Code: data.Code,
            LogicalTest : LogicalTest,
            StructureTest : StructureTest,
            TimeStamp : new Date()
        }
        //console.log(toPush)
        const CodeRepo = db.collection('CodeRepo');
        let r = await CodeRepo.insertOne(toPush);
        if(r.insertedCount == 1){
            return true;
        }
        return true;
    }catch(err){
        console.log('inside Catch :'+err);
        return null;
    }
}



module.exports = router;