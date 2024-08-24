import psycopg2

# conn = psycopg2.connect(
#     host="dpg-cqmn9c5svqrc73fd29ng-a",
#     dbname="users_database_xz8x",
#     user="users_database_xz8x_user",
#     password="otApHYv9tr6smNmsMYaTjza9qD9sFEVT",
#     port="postgresql://users_database_xz8x_user:otApHYv9tr6smNmsMYaTjza9qD9sFEVT@dpg-cqmn9c5svqrc73fd29ng-a.ohio-postgres.render.com/users_database_xz8x",
# )


def connect_to_database():

    database_url = "postgresql://users_database_xz8x_user:otApHYv9tr6smNmsMYaTjza9qD9sFEVT@dpg-cqmn9c5svqrc73fd29ng-a.ohio-postgres.render.com/users_database_xz8x"
    user = "users_database_xz8x_user"
    password = "otApHYv9tr6smNmsMYaTjza9qD9sFEVT"

    connection = psycopg2.connect(database_url, user=user, password=password)
    return connection


def close_connection(connection):
    """Closes a psycopg2 connection.

    Args:
        connection: A psycopg2 connection object.
    """

    connection.close()
