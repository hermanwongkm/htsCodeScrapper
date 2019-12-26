import sys
import csv
import json
import pprint
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
# filepath= "./database/record/mined/file.csv" 
stop_words = nltk.corpus.stopwords.words('english')
custom_stop_words = ['<' , '>' , ',' , ':' , '(' , ')' ,'[',']', ';','/i','</i>','<i>', '\'s']
stop_words.extend(custom_stop_words)
stop_words.remove('other')

def loadTable(filepath):
    with open(filepath, newline='') as csvfile:
        table = list(csv.reader(csvfile))
    table = [x + [""] + [""] + [""] + [""] for x in table] # expand by one column
    table[0][-1] = "Keywords" #add keyword header 12
    table[0][-2] = "Parent" #add keyword header 11
    table[0][-3] = "Children" #add keyword header 10
    table[0][-4] = "key" #added unique identifier for ant design 9 
    # table[0][0] = "HTS Number" #fix corrupted column field
    return table

def modify(table):
    print("[2][Python Child Script] Modifying Table ...")
    final_list = []
    # 1.0 Populate the parent column
    ancestor = ""
    print("[2.0][Python Child Script] Adding enhancement to keywords, creating required columns.")
    for i in range(1,len(table)):
        chem_flag = False
        # 1.1 For isolating focus keywords
        new_word_tokens = []
        word_tokens = word_tokenize(table[i][2])
        for word in word_tokens:
            word = word.lower()
            new_word_tokens.append(word)
            splits = word.split('-')
            if len(splits) >=2:
                for split in splits:
                    if split.isdigit():
                        chem_flag = True
            #check if item is chemical 
            if chem_flag == False:
                new_word_tokens += splits
            
        # 1.2 removing stop words
        word_tokens = [w.lower() for w in new_word_tokens if not w in stop_words]
        # 1.3 Using word Lematizer on words
        lemantized = [lemmatizer.lemmatize(w) for w in word_tokens]
        lemantized_a =[lemmatizer.lemmatize(w,'a') for w in word_tokens]
        lemantized_v =[lemmatizer.lemmatize(w,'v') for w in word_tokens]
        lemantized_n =[lemmatizer.lemmatize(w,'n') for w in word_tokens]
        # 1.4 Using TextBlob library to add Singular and Plural
        blob = TextBlob(' '.join(str(i) for i in word_tokens))
        singulars = [word.singularize() for word in blob.words]
        plurals = [word.pluralize() for word in blob.words]
        # Assigning back to table column
        table[i][12] = list(set().union(word_tokens,lemantized,lemantized_a,lemantized_v,lemantized_n,singulars,plurals))

        # 2. For filling in the parent hts code for empty children
        if(table[i][0]==""):
            table[i][0] = parent
        else: parent = table[i][0]
        # 3. Inserting a key column
        table[i][9] = i #added unique identifier for ant design
        if table[i][1] == "0":
            ancestor = table[i][0]
            table[i][12].append(table[i][0].split(".")[0])  # add its own HTS code as keyword.
        else:
            table[i][11] = ancestor
            table[i][12].append(table[i][11].split(".")[0]) # add its parent's HTS code as keyword.
    return table

# parents=True will also create any necessary parent directories, 
# and exist_ok=True won't raise an error if the directory already exists, don't have to explicitly check that separately.

# Algorithm for parent child relationship
def parentChildRelation(table):
    print("[2.1][Python Child Script] Applying changes for parent-child relationship")
    first_group = False
    row_num = 0
    skip_first = True
    for row in table:
        row_num += 1
        if skip_first == True:
            skip_first = False
            continue
        if skip_first == False:# Make sure row us data
            indent = int(row[1])
            if indent == 0:
                ancestors = [row]  #creates a ancestor array
                row[10] = [] #initialised my child column
            else:
                parent_indent = indent - 1
                while parent_indent >= 0:
                    try:
                        ancestors[parent_indent][10].append((row))
                        break
                    except IndexError:
                        parent_indent -= 1  # search one more level up
                        
                ancestors = ancestors[:indent]  # remove the previous ancestor at the same indent
                ancestors.append(row)
                row[10] = []

    # with open('table1.json', 'w') as fout:
    #     print(json.dumps(table), file=fout)
    for row in table:
        if row[10] == []:
            row[10] = None
    return table

def dfToRecords(table):
    df = pd.DataFrame(table)
    output_csv = 'modified.csv'
    output_json = 'modified.json'
    output_dir = Path('database/record/modified')
    output_dir.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_dir / output_csv)
    df.to_json(output_dir / output_json, orient='records')
    return "[2.3][Python Child Script] Sucessfully saved the modified CSV and JSON."

def main():
    table = loadTable(filepath)
    modifiedTable = modify(table)
    childTable = parentChildRelation(modifiedTable)
    dfToRecords(childTable)
    sys.stdout.flush()


main()