import psycopg2

conn = psycopg2.connect("dbname=users_database_xz8x user=users_database_xz8x_user")

cur = conn.cursor()

cur.execute("CREATE TABLE userdata()")
