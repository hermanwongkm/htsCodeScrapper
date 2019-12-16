import sys
import csv
import numpy
import nltk
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize
import pandas as pd
from pathlib import Path

nltk.download("stopwords",quiet=True)
nltk.download('punkt', quiet=True)

filepath = sys.argv[1] # for use with nodeJS
# filepath= "./database/csv/mined/file.csv" 
stop_words = nltk.corpus.stopwords.words('english')
custom_stop_words = ['<' , '>' , ',' , ':' , '(' , ')' ,'[',']', ';','/i']
stop_words.extend(custom_stop_words)

def loadTable(filepath):
    with open(filepath, newline='') as csvfile:
        table = list(csv.reader(csvfile))
    table = [x + [""] for x in table] # expand by one column
    table[0][-1] = "Keywords" #add keyword header
    # table[0][0] = "HTS Number" #fix corrupted column field
    return table

def modify(table):
    parent = ""
    for i in range(1,len(table)):
        # 1.For isolating focus keywords
        word_tokens = word_tokenize(table[i][2])
        table[i][-1] = [w.lower() for w in word_tokens if not w in stop_words]
        # 2.For filling in the parent hts code for empty children
        if(table[i][0]==""):
            table[i][0] = parent
        else: parent = table[i][0]
    return table

# parents=True will also create any necessary parent directories, 
# and exist_ok=True won't raise an error if the directory already exists, don't have to explicitly check that separately.

def dfToCSV(table):
    df = pd.DataFrame(table)
    output_file = 'modified.csv'
    output_dir = Path('database/csv/modified')
    output_dir.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_dir / output_file)
    return "[2] Sucessfully Modified the mined csv."

def dfToJSON(table):
    df = pd.DataFrame(table)
    output_file = 'modified.json'
    output_dir = Path('database/csv/modified')
    output_dir.mkdir(parents=True, exist_ok=True)
    df.to_json(output_dir / output_file,orient='records')
    return "[2] Sucessfully Modified the mined csv."


table = loadTable(filepath)
modifiedTable = modify(table)
# print(dfToCSV(modifiedTable))
print(dfToJSON(modifiedTable))


sys.stdout.flush()
