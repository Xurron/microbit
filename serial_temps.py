import serial_obstacle
from time import sleep
import threading
from tkinter import *
import mysql.connector

serialdata = []
data = True

# Connection à la base de données

mydb = mysql.connector.connect(
  host="localhost",
  user="xurron",
  password="xurron",
  database="serial"
)

class SensorThread(threading.Thread):
    def run(self):
        while True:
            mycursor = mydb.cursor()
            mycursor.execute("SELECT `Temps` FROM `log` WHERE 1")
            myresult = mycursor.fetchall()
            for x in myresult:
                print(x)
            serialdata.append("Temps : %d" % x)
            sleep(1)

class Gui(object):
    def __init__(self):
        self.root = Tk()
        self.lbl = Label(self.root, text="")
        self.updateGUI()
        self.readSensor()

    def run(self):
        self.lbl.pack()
        self.lbl.after(1, self.updateGUI)
        self.root.mainloop()

    def updateGUI(self):
        msg = " "
        self.lbl["text"] = msg
        self.root.update()
        self.lbl.after(1000, self.updateGUI)

    def readSensor(self):
        self.lbl["text"] = serialdata[-1]
        self.root.update()
        self.root.after(1, self.readSensor)

if __name__ == "__main__":
    SensorThread().start()
    Gui().run()