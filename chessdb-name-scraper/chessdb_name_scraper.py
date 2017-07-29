# pylint: disable=missing-docstring
import os
import re
import sys
import collections
import urllib.request
import urllib.parse
import urllib.error
from bs4 import BeautifulSoup


OUT_DIRECTORY = "out"
REMOVE_DUPLICATES = True
NO_PAGES_TO_SCRAP = 3
COUNTRIES = ["pol", "ger", "cze", "ltu"]
COUNTRIES_CHESSDB_TO_ISO = {
    'ger': 'deu'
}
SEXES = ["m", "w"]
PACK_FILENAME = "names.csv"
PACK_NAME_SEPARATOR = ","
PACK_FIELD_SEPARATOR = "|"
BASE_URL = "https://chess-db.com/public/"
COUNTRY_RANKING_PATH_TEMPLATE = "execute.jsp?age=99&countries={}&sex={}&start="
URL_TEMPLATE = "{}{}".format(BASE_URL, COUNTRY_RANKING_PATH_TEMPLATE)
NAME_SELECTOR = "body > center > font > table > tr > td:nth-of-type(3) > a"


def rip_url(url):
    print("Processing {}".format(url))
    content = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(content, "lxml")
    return [element.get_text() for element in soup.select(NAME_SELECTOR)]


def get_urls(country, sex, number_of_pages):
    country_url_template = URL_TEMPLATE.format(country.upper(), sex.lower())
    start_values = [str(x * 1000) for x in range(number_of_pages)]
    return ["{}{}".format(country_url_template, start_value) for start_value in start_values]


def keep_letters_and_spaces(names):
    names = [re.sub(r"[^a-zA-Z ]+", "", name) for name in names]
    list(map(lambda s: s.strip(), names))
    return names


def scrape_for_country_and_sex(country, sex):
    print("Scraping names for: country code '{}', sex '{}'".format(country.upper(), sex.upper()))
    urls = get_urls(country, sex, NO_PAGES_TO_SCRAP)

    names = []
    for url in urls:
        names += rip_url(url)

    first_names = []
    last_names = []
    for name in names:
        split_name = name.split(", ")
        if len(split_name) == 2 and len(split_name[0]) > 1 and len(split_name[1]) > 1:
            first_names.append(split_name[1])
            last_names.append(split_name[0])

    if REMOVE_DUPLICATES:
        first_names = list(set(first_names))
        last_names = list(set(last_names))
        print("Duplicates removed")

    keep_letters_and_spaces(first_names)
    keep_letters_and_spaces(last_names)

    if not os.path.exists(OUT_DIRECTORY):
        os.makedirs(OUT_DIRECTORY)
        print("Directory '{}' created".format(OUT_DIRECTORY))

    filename_base = "{}/{}_{}".format(OUT_DIRECTORY, country.lower(), sex.lower())
    first_names_filename = "{}_first.txt".format(filename_base)
    last_names_filename = "{}_last.txt".format(filename_base)
    with open(first_names_filename, "w") as file:
        file.write("\n".join(first_names))
        print("{} written ({} lines)".format(first_names_filename, len(first_names)))
    with open(last_names_filename, "w") as file:
        file.write("\n".join(last_names))
        print("{} written ({} lines)".format(last_names_filename, len(last_names)))

    print("Finished scraping names for: country code '{}', sex '{}'\n"
          .format(country.upper(), sex.upper()))


def scrape_for_country(country):
    for sex in SEXES:
        scrape_for_country_and_sex(country, sex)


def scrape():
    for country in COUNTRIES:
        scrape_for_country(country)


def read_name_files():
    nested_dict = lambda: collections.defaultdict(nested_dict)
    data = nested_dict()

    filenames = os.listdir(OUT_DIRECTORY)
    for filename in filenames:
        file_params = filename[:-4].split("_")

        error_msg = "Unrecognized filename format for file {}. Skipping".format(filename)
        if len(file_params) != 3:
            print(error_msg)
            continue

        country = file_params[0]
        sex = file_params[1]
        kind = file_params[2]
        if (len(country) != 3) or (sex not in SEXES) or (kind not in ["first", "last"]):
            print(error_msg)
            continue

        path = "{}/{}".format(OUT_DIRECTORY, filename)
        with open(path, "r") as file:
            names = file.readlines()
        names = [name.strip() for name in names]

        data[country][sex][kind] = names

    return data


def pack_for_game():
    print("Packing CSV file...")

    data = read_name_files()

    rows = []
    for country in data:
        fields = []
        out_country_code = country if country not in COUNTRIES_CHESSDB_TO_ISO \
              else COUNTRIES_CHESSDB_TO_ISO[country]
        fields.append(out_country_code)
        fields.append(PACK_NAME_SEPARATOR.join(data[country]["m"]["first"]))
        fields.append(PACK_NAME_SEPARATOR.join(data[country]["m"]["last"]))
        fields.append(PACK_NAME_SEPARATOR.join(data[country]["w"]["first"]))
        fields.append(PACK_NAME_SEPARATOR.join(data[country]["w"]["last"]))
        rows.append(PACK_FIELD_SEPARATOR.join(fields))

    path = "{}/{}".format(OUT_DIRECTORY, PACK_FILENAME)
    with open(path, "w") as file:
        for row in rows:
            file.write("{}\n".format(row))
        print("{} written ({} lines)".format(path, len(rows)))


def main(argv=None):
    if argv is None:
        argv = sys.argv

    if len(argv) != 2:
        sys.exit("Wrong number of arguments. Exiting (B EXITING B DON'T KILL ME)")

    mode = sys.argv[1]

    if mode == "scrape":
        scrape()
    elif mode == "pack":
        pack_for_game()
    else:
        sys.exit("Unrecognized mode")


if __name__ == "__main__":
    main()
