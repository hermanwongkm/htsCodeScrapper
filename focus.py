import sys
import csv
import numpy
import nltk
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize
import pandas as pd
from pathlib import Path
# NLTK stemmer
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()
from textblob import TextBlob

nltk.download("stopwords",quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet = True)
  

filepath = sys.argv[1] # for use with nodeJS
# filepath= "./database/csv/mined/file.csv" 
stop_words = nltk.corpus.stopwords.words('english')
custom_stop_words = ['<' , '>' , ',' , ':' , '(' , ')' ,'[',']', ';','/i','</i>','<i>', '\'s']
stop_words.extend(custom_stop_words)

def loadTable(filepath):
    with open(filepath, newline='') as csvfile:
        table = list(csv.reader(csvfile))
    table = [x + [""] for x in table] # expand by one column
    table[0][-1] = "Keywords" #add keyword header
    # table[0][0] = "HTS Number" #fix corrupted column field
    return table

def modify(table):
    print("[2] Modifying Table ...")
    final_list = []
    for i in range(1,len(table)):
        # 1.For isolating focus keywords
        word_tokens = word_tokenize(table[i][2])
        # 1.1 removing stop words
        word_tokens = [w.lower() for w in word_tokens if not w in stop_words]
        # 1.2 Using word Lematizer on words
        lemantized = [lemmatizer.lemmatize(w) for w in word_tokens]
        lemantized_a =[lemmatizer.lemmatize(w,'a') for w in word_tokens]
        lemantized_v =[lemmatizer.lemmatize(w,'v') for w in word_tokens]
        lemantized_n =[lemmatizer.lemmatize(w,'n') for w in word_tokens]
        # 1.3 Using TextBlob library to add Singular and Plural
        blob = TextBlob(' '.join(str(i) for i in word_tokens))
        singulars = [word.singularize() for word in blob.words]
        plurals = [word.pluralize() for word in blob.words]
        # Assigning back to table column
        table[i][-1] = list(set().union(word_tokens,lemantized,lemantized_a,lemantized_v,lemantized_n,singulars,plurals))
        # 2.For filling in the parent hts code for empty children
        if(table[i][0]==""):
            table[i][0] = parent
        else: parent = table[i][0]
    return table

# parents=True will also create any necessary parent directories, 
# and exist_ok=True won't raise an error if the directory already exists, don't have to explicitly check that separately.

def dfToRecords(table):
    df = pd.DataFrame(table)
    output_csv = 'modified.csv'
    output_json = 'modified.json'
    output_dir = Path('database/record/modified')
    output_dir.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_dir / output_csv)
    df.to_json(output_dir / output_json, orient='records')
    return "[2.1] Sucessfully saved the modified CSV and JSON."
    
table = loadTable(filepath)
modifiedTable = modify(table)
print(dfToRecords(modifiedTable))


sys.stdout.flush()


