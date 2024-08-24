import psycopg2
from psycopg2 import Error

try:
    conn = psycopg2.connect(
        host="dpg-cqmn9c5svqrc73fd29ng-a",
        dbname="users_database_xz8x",
        user="users_database_xz8x_user",
        password="otApHYv9tr6smNmsMYaTjza9qD9sFEVT",
        port="postgresql://users_database_xz8x_user:otApHYv9tr6smNmsMYaTjza9qD9sFEVT@dpg-cqmn9c5svqrc73fd29ng-a.ohio-postgres.render.com/users_database_xz8x",
    )

    cur = conn.cursor()

    cur.execute(
        """SELECT userdata FROM information_schema.tables WHERE table_schema = 'public'"""
    )
    for table in cur.fetchall():
        print(table)

    cur.execute(
        """SELECT messages FROM information_schema.tables WHERE table_schema = 'public'"""
    )
    for table in cur.fetchall():
        print(table)

except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)
finally:
    if conn:
        conn.commit()
        cur.close()
        conn.close()
        print("PostgreSQL connection is closed")
