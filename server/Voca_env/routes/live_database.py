import psycopg2

conn = psycopg2.connect("dbname=users_database_xz8x user=users_database_xz8x_user")

cur = conn.cursor()

cur.execute(
    "CREATE TABLE userdata(id integer PRIMARY KEY, name str, email str, username str, password str, birthdate date);"
)
cur.execute(
    "CREATE TABLE messages(id integer PRIMARY KEY, user_id integer, text text, timestamp datetime, group_room_number str, user );"
)
