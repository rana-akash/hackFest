class logicalItem:
    def __init__(self,methodSignature,testCaseName,inputValues,expected,actual,isPassed):
         self.methodSignature=methodSignature
         self.testCaseName=testCaseName
         self.inputValues=inputValues
         self.expected=expected
         self.actual=actual
         self.isPassed=isPassed
    def getSignature(self):
        return self.methodSignature
    
    def getTestCaseName(self):
        return self.testCaseName

    def getInputValues(self):
        return self.inputValues

    def getExpected(self):
        return self.expected
    def getActual(self):
        return self.actual
    
    def setActual(self,val):
        self.actual=val
    def setPassed(self,val):
        self.isPassed=val
