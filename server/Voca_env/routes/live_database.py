import psycopg2

conn = psycopg2.connect(
    "host=live_chat_app_database",
    dbname="users_database_xz8x",
    user="users_database_xz8x_user",
    password="otApHYv9tr6smNmsMYaTjza9qD9sFEVT",
    port="postgresql://users_database_xz8x_user:otApHYv9tr6smNmsMYaTjza9qD9sFEVT@dpg-cqmn9c5svqrc73fd29ng-a/users_database_xz8x",
)

cur = conn.cursor()

cur.execute(
    """CREATE TABLE IF NOT EXISTS userdata (
            id integer primary key, name varchar, email varchar, username varchar, password varchar, birthdate date
            )

 """
)

cur.execute(
    """ CREATE TABLE IF NOT EXISTS messages(
            id integer primary key, user_id integer , text text, timestamp date, group_room_number varchar, user
            )


"""
)


conn.commit()

cur.close()
conn.close()
