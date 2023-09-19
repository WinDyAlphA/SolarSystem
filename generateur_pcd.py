import random
import math


#open file to write
fichier = open("PCD.pcd", "w")
#write header
fichier.write("# .PCD v.7 - Point Cloud Data file format\n")
fichier.write("VERSION .7\n")
fichier.write("FIELDS x y z\n")
fichier.write("SIZE 4 4 4\n")
fichier.write("TYPE F F F\n")
fichier.write("COUNT 1 1 1\n")
fichier.write("WIDTH 8\n")
fichier.write("HEIGHT 1\n")
fichier.write("VIEWPOINT 0 0 0 1 0 0 0\n")
fichier.write("POINTS 8\n")
fichier.write("DATA ascii\n")
#write data
#i want to make a ring of point beetwen 17 and 22, need to calculate the angle with cos and sin
for i in range(0, 10000):
    #random number between 17 and 22
    r = random.uniform(17.5, 23)
    height = random.uniform(0, 0.5)
    #random angle between 0 and 360
    angle = random.uniform(0, 360)
    #calculate x and y
    x = r * math.cos(angle)
    y = r * math.sin(angle)
    #write in file
    fichier.write(str(x) + " "+ str(height) +" "  + str(y) + " \n")

for i in range(0, 600):
    #random number between 17 and 22
    r = random.uniform(23,24)
    #random angle between 0 and 360
    angle = random.uniform(0, 360)
    #calculate x and y
    x = r * math.cos(angle)
    y = r * math.sin(angle)
    #write in file
    fichier.write(str(x) + " 0 "  + str(y) + " \n")

for i in range(0, 500):
    #random number between 17 and 22
    r = random.uniform(24,26)
    #random angle between 0 and 360
    angle = random.uniform(0, 360)
    #calculate x and y
    x = r * math.cos(angle)
    y = r * math.sin(angle)
    #write in file
    fichier.write(str(x) + " 0 "  + str(y) + " \n")

for i in range(0, 500):
    #random number between 17 and 22
    r = random.uniform(17,17.5)
    #random angle between 0 and 360
    angle = random.uniform(0, 360)
    #calculate x and y
    x = r * math.cos(angle)
    y = r * math.sin(angle)
    #write in file
    fichier.write(str(x) + " 0 "  + str(y) + " \n")