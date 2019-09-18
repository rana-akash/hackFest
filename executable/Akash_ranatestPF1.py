import Akash_ranaPFAssgn1
import json
#import jsonpickle
from constants import constant
from structure import structureResult
from structureItem import structureItem
from logical import logicalResult
from logicalItem import logicalItem


def dumper(obj):
    try:
        return obj.toJSON()
    except:
        return obj.__dict__

testCaseAddMethod={"test1":{"values":[5,5],"expected":10},"test2":{"values":[6,5],"expected":11}}
testCaseSubMethod={"test3":{"values":[5,5],"expected":0},"test4":{"values":[6,5],"expected":1}}
testCaseMultMethod={"test5":{"values":[5,5],"expected":25},"test6":{"values":[6,5],"expected":30}}
testCaseDivMethod={"test7":{"values":[5,5],"expected":1},"test8":{"values":[105,5],"expected":21}}

result_dict={}

structure=structureResult()
logical=logicalResult()
def testMethodAdd():
    
    # Structure Check
    try:
        Akash_ranaPFAssgn1.add(5,6)
        structureItem1=structureItem("add(a,b)",True)
    except:
        structureItem1=structureItem("add(a,b)",False)
    structure.addStructureResult(structureItem1)

    for key in testCaseAddMethod.keys():
        inputvalue=testCaseAddMethod[key][constant.values]
        expectedResult=testCaseAddMethod[key][constant.expected]
        try:
            logicVal=logicalItem("add(a,b)",key,inputvalue,expectedResult,"NA",False)
            actual=Akash_ranaPFAssgn1.add(inputvalue[0],inputvalue[1])
            #print(actual)
            if actual == expectedResult:
                logicVal.actual=actual
                logicVal.isPassed=True
            else:
                logicVal.actual=actual
        except :
            pass
        logical.addLogicalResult(logicVal)

def testMethodSub():
    
    # Structure Check
    try:
        Akash_ranaPFAssgn1.sub(5,6)
        structureItem1=structureItem("sub(a,b)",True)
    except:
        structureItem1=structureItem("sub(a,b)",False)
    structure.addStructureResult(structureItem1)

    for key in testCaseSubMethod.keys():
        inputvalue=testCaseSubMethod[key][constant.values]
        expectedResult=testCaseSubMethod[key][constant.expected]
        try:
            logicVal=logicalItem("sub(a,b)",key,inputvalue,expectedResult,"NA",False)
            actual=Akash_ranaPFAssgn1.sub(inputvalue[0],inputvalue[1])
            #print(actual)
            if actual == expectedResult:
                logicVal.actual=actual
                logicVal.isPassed=True
            else:
                logicVal.actual=actual
        except :
            pass
        logical.addLogicalResult(logicVal)

def testMethodMult():
    
    # Structure Check
    try:
        Akash_ranaPFAssgn1.mult(5,6)
        structureItem1=structureItem("mult(a,b)",True)
    except:
        structureItem1=structureItem("mult(a,b)",False)
    structure.addStructureResult(structureItem1)

    for key in testCaseMultMethod.keys():
        inputvalue=testCaseMultMethod[key][constant.values]
        expectedResult=testCaseMultMethod[key][constant.expected]
        try:
            logicVal=logicalItem("mult(a,b)",key,inputvalue,expectedResult,"NA",False)
            actual=Akash_ranaPFAssgn1.mult(inputvalue[0],inputvalue[1])
            #print(actual)
            if actual == expectedResult:
                logicVal.actual=actual
                logicVal.isPassed=True
            else:
                logicVal.actual=actual
        except :
            pass
        logical.addLogicalResult(logicVal)

def testMethodDiv():
    
    # Structure Check
    try:
        Akash_ranaPFAssgn1.div(5,6)
        structureItem1=structureItem("div(a,b)",True)
    except:
        structureItem1=structureItem("div(a,b)",False)
    structure.addStructureResult(structureItem1)

    for key in testCaseDivMethod.keys():
        inputvalue=testCaseDivMethod[key][constant.values]
        expectedResult=testCaseDivMethod[key][constant.expected]
        try:
            logicVal=logicalItem("div(a,b)",key,inputvalue,expectedResult,"NA",False)
            actual=Akash_ranaPFAssgn1.div(inputvalue[0],inputvalue[1])
            #print(actual)
            if actual == expectedResult:
                logicVal.actual=actual
                logicVal.isPassed=True
            else:
                logicVal.actual=actual
        except :
            pass
        logical.addLogicalResult(logicVal)


testMethodAdd()
testMethodSub()
testMethodMult()
testMethodDiv()
result_dict[constant.structure]=structure.getData()
result_dict[constant.logical]=logical.getData()
#print(result_dict)
print(json.dumps(result_dict, default=dumper))
#print(jsonpickle.encode(result_dict,make_refs=False))
