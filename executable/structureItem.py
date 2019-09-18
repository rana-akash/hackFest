
class structureItem:
    def __init__(self,methodSignature,isPassed):
        self.methodSignature=methodSignature
        self.isPassed=isPassed

    def getsignature(self):
        return self.methodSignature
    
    def getPassed(self):
        return self.isPassed
    
    #def getData(self):
    #   return self.__

