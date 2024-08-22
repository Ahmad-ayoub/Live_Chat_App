import psycopg2
from psycopg2 import Error

try:
    conn = psycopg2.connect(
        host="dpg-cqmn9c5svqrc73fd29ng-a",
        dbname="users_database_xz8x",
        user="users_database_xz8x_user",
        password="otApHYv9tr6smNmsMYaTjza9qD9sFEVT",
        port="postgresql://users_database_xz8x_user:otApHYv9tr6smNmsMYaTjza9qD9sFEVT@dpg-cqmn9c5svqrc73fd29ng-a/users_database_xz8x",
    )

    cur = conn.cursor()

    print("PostgreSQL server information")
    print(conn.get_dsn_parameters(), "\n")

    cur.execute("SELECT version();")

    record = cur.fetchone()
    print("You are connected to - ", record, "\n")

    # cur.execute(
    #     """CREATE TABLE userdata (
    #             id SERIAL PRIMARY KEY, name varchar, email varchar, username varchar, password varchar, birthdate date
    #             )

    #  """
    # )

    # cur.execute(
    #     """INSERT INTO userdata (id, name, email, username, password, birthdate)
    #                 VALUES (%(int)s, %(str)s, %(str)s, %(str)s, %(str)s, %(date)s)

    #              """
    # )

    # cur.execute(
    #     """INSERT INTO messages (id, user_id, text, timestamp, group_room_number, user)
    #         VALUES (%(int)s, %(int)s, %(text)s, %(date)s, %(str)s, %(str)s)

    # """
    # )

    # cur.execute(
    #     """ CREATE TABLE messages(
    #             id integer primary key, user_id integer , text text, timestamp date, group_room_number varchar, user)

    # """
    # )

except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)
finally:
    if conn:
        conn.commit()
    cur.close()
    conn.close()
