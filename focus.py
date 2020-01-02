from textblob import TextBlob
import sys
import csv
import json
import pprint
import numpy
import nltk
import datetime
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
from pathlib import Path

# NLTK stemmer
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

# NLTK Packages. Need to download at least Once
nltk.download("stopwords", quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)

with open('config.json') as config_file:
    config = json.load(config_file)

# filepath = sys.argv[1] # for use with nodeJS
filepath = config['mined_file_path']
stop_words = nltk.corpus.stopwords.words('english')
custom_stop_words = config["custom_stop_words"]
stop_words.extend(custom_stop_words)
stop_words.append('\'s')  # Single quotes cannot be stored in config JSON
stop_words.remove('other')  # other is required, do not remove it from keywords


def loadTable(filepath):
    """
    Function read from hts.usitc CSV file and add 4 new columns \n
    :param filepath: filepath of where hts.usitc csv.
    :return: Table in nested array format, with keyword columns added. Col 9. \n
    :Side Notes: \n
    :1: Keywords column is added at the last column  \n
    :2: Parent column is added at the second last column \n
    :3: Children Column is added at the third last column \n
    :4: Key Column is added at the fourth last column. (Requirement of Ant Design tree table) \n
    """

    with open(filepath, newline='') as csvfile:
        table = list(csv.reader(csvfile))
    table = [x + [""] + [""] + [""] + [""] + [""]
             for x in table]  # expand by one column
    table[0][-1] = "Ancestry"  # add ancestry header 13
    table[0][-2] = "Keywords"  # add keyword header 12
    table[0][-3] = "Parent"  # add keyword header 11
    table[0][-4] = "Children"  # add keyword header 10
    table[0][-5] = "key"  # added unique identifier for ant design 9
    # table[0][0] = "HTS Number" #fix corrupted column field
    return table


def modify(table):
    """
    Function Populate keyword Columns with description keywords. \n
    :param table: Table is a nested array.
    :return: Table in nested array format, with keyword columns added. Col 9. \n
    :Side Notes: \n
    :1: NLTK library used to remove stopwords and add lemanization  \n
    :2: WordBlob library used to add singular and plurals. \n
    :3: Some child rows do not have HTS_codes, added its direct parent as its own HTS_code. \n
    :4: Split up hypened words to add individual as searchable keywords. (Chemical names are ignored here) \n
    """

    print("[2][Python Child Script] Modifying Table ...")
    final_list = []  # 1.0 Populate the parent column
    ancestor = ""
    print("[2.0][Python Child Script] Adding enhancement to keywords, creating required columns.")
    for i in range(1, len(table)):
        chemical_flag = False
        new_word_tokens = []  # 1.1 For isolating focus keywords
        word_tokens = word_tokenize(table[i][2])
        for word in word_tokens:
            word = word.lower()
            new_word_tokens.append(word)
            # Splitting the words that are separated by hypens as a keyword. cow-hide => cow,hide,cow-hide
            splits = word.split('-')
            if len(splits) >= 2:
                for split in splits:
                    if split.isdigit():
                        chemical_flag = True
            # If the split is likely a chemical, e.g 2-dimetyl... do not add the splits as individual keyword.
            if chemical_flag == False:
                new_word_tokens += splits
        # 1.2 removing stop words
        word_tokens = [w.lower()
                       for w in new_word_tokens if not w in stop_words]
        # 1.3 Using word Lematizer on words
        lemantized = [lemmatizer.lemmatize(w) for w in word_tokens]
        lemantized_a = [lemmatizer.lemmatize(w, 'a') for w in word_tokens]
        lemantized_v = [lemmatizer.lemmatize(w, 'v') for w in word_tokens]
        lemantized_n = [lemmatizer.lemmatize(w, 'n') for w in word_tokens]
        # 1.4 Using TextBlob library to add Singular and Plural
        blob = TextBlob(' '.join(str(i) for i in word_tokens))
        singulars = [word.singularize() for word in blob.words]
        plurals = [word.pluralize() for word in blob.words]
        # Assigning back to table column as a list set, removing possible repeats.
        table[i][12] = list(set().union(word_tokens, lemantized,
                                        lemantized_a, lemantized_v, lemantized_n, singulars, plurals))

        # 2. For filling in the parent hts code for empty children
        if(table[i][0] == ""):
            table[i][0] = parent
        else:
            parent = table[i][0]
        # 3. Inserting a key column
        table[i][9] = i  # added unique identifier for ant design
        if table[i][1] == "0":
            ancestor = table[i][0]
            # table[i][12].append(table[i][0].split(".")[0])  # add its own HTS code as keyword. #! No longer required as of 26/12/12
        else:
            table[i][11] = ancestor
            # table[i][12].append(table[i][11].split(".")[0]) # add its parent's HTS code as keyword. #! No longer required as of 26/12/12
    return table


# Algorithm for parent child relationship
def parentChildRelation(table):
    """
    Function Adds parent-child relationship based on "indent" column. \n
    :param table: Table is a nested array. \n
    :return: Table in nested array format, with parent child relationship columns added. Col 10. \n
    :Side Notes: \n
    :1: The code in this method is based on an a dynamic programming algorithm  \n
    :2: parent column now contains the whole of parent's row pioritising speed > memory.
    """

    print("[2.1][Python Child Script] Applying changes for parent-child relationship")
    first_group = False
    row_num = 0
    skip_first = True
    for row in table:
        row_num += 1
        if skip_first == True:
            skip_first = False
            continue
        if skip_first == False:  # Make sure row is data
            indent = int(row[1])
            if indent == 0:
                ancestors = [row]  # creates a ancestor array
                row[10] = []  # initialised my child column
            else:
                parent_indent = indent - 1
                while parent_indent >= 0:
                    try:
                        ancestors[parent_indent][10].append((row))
                        break
                    except IndexError:
                        parent_indent -= 1  # search one more level up
                # remove the previous ancestor at the same indent
                ancestors = ancestors[:indent]
                ancestors.append(row)
                row[10] = []
    for row in table:  # Replace empty arrays with None.
        if row[10] == []:
            row[10] = None
    return table


def ancestry(table):
    """
    Function Adds a list of the row's ancestry.\n
    :param table: Table is a nested array. \n
    :return: Table in nested array format, with parent child relationship columns added. Col 10. \n
    :Side Notes: \n
    :1: The code in this method is based on an a dynamic programming algorithm  \n
    :2: parent column now contains the whole of parent's row pioritising speed > memory.
    """

    current_index = len(table)-1  # headings is at index 0
    for row in reversed(table):  # remember get rid of header
        if current_index == 0:
            break
        indent = int(row[1])
        row[13] = []  # initialise the ancestry column with an empty list
        for i in range(current_index-1, 0, -1):
            if int(table[i][1]) < indent:
                if indent == 0:
                    print("break")
                    break
                else:
                    row[13].append(table[i][9])  # append the key to this
                    indent = int(table[i][1])
        current_index -= 1
    return table


def dfToRecords(table):
    """
    Function saves the table input to both csv and json format.\n
    :param table: Table is a nested array.
    :return: A string statement if process is completed.
    :Side Notes: \n
    :1: This method will safe both outputs under the same directory. (database/record/modified) \n
    :2: Both the filenames are "modified" + filetype.
    """

    df = pd.DataFrame(table)
    output_csv = 'modified.csv'
    output_json = 'modified.json'
    output_dir = Path(config["modified_file_path"])
    # parents = True will also create any necessary parent directories
    output_dir.mkdir(parents=True, exist_ok=True)
    # exist_ok=True won't raise an error if the directory already exists, don't have to explicitly check that separately.
    df.to_csv(output_dir / output_csv)
    df.to_json(output_dir / output_json, orient='records')
    return "[2.3][Python Child Script] Sucessfully saved the modified CSV and JSON."


def main():
    """
    Main function of python scripts \n
    Runs the following in sequence \n
    1. Load table \n
    2. Modify table with searchable keywords \n
    3. Insert parent-child relationship into table \n
    4. Saving the outcome into .csv and .json files in database/record/modified directory
    """
    # start = datetime.datetime.now()
    table = loadTable(filepath)
    modifiedTable = modify(table)
    childTable = parentChildRelation(modifiedTable)
    ancestors = ancestry(childTable)
    dfToRecords(ancestors)
    sys.stdout.flush()
    # print(datetime.datetime.now() - start)


main()
