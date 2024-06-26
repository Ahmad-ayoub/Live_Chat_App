"""Add group_id column to messages table

Revision ID: 52fc49033d3d
Revises: 
Create Date: 2024-05-01 06:18:37.263071

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "52fc49033d3d"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("messages", schema=None) as batch_op:
        op.add_column(
            "messages",
            sa.Column(
                "group_id",
                sa.String(20),
                nullable=False,
            ),
        )

    with op.batch_alter_table("userdata", schema=None) as batch_op:
        batch_op.alter_column(
            "name",
            existing_type=sa.VARCHAR(length=80),
            type_=sa.String(length=100),
            nullable=True,
        )
        batch_op.alter_column(
            "email",
            existing_type=sa.VARCHAR(length=120),
            type_=sa.String(length=100),
            existing_nullable=False,
        )
        batch_op.alter_column(
            "username",
            existing_type=sa.VARCHAR(length=80),
            type_=sa.String(length=100),
            existing_nullable=False,
        )
        batch_op.alter_column(
            "password",
            existing_type=sa.VARCHAR(length=120),
            type_=sa.String(length=200),
            existing_nullable=False,
        )
        batch_op.alter_column("birthdate", existing_type=sa.DATE(), nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("userdata", schema=None) as batch_op:
        batch_op.alter_column("birthdate", existing_type=sa.DATE(), nullable=False)
        batch_op.alter_column(
            "password",
            existing_type=sa.String(length=200),
            type_=sa.VARCHAR(length=120),
            existing_nullable=False,
        )
        batch_op.alter_column(
            "username",
            existing_type=sa.String(length=100),
            type_=sa.VARCHAR(length=80),
            existing_nullable=False,
        )
        batch_op.alter_column(
            "email",
            existing_type=sa.String(length=100),
            type_=sa.VARCHAR(length=120),
            existing_nullable=False,
        )
        batch_op.alter_column(
            "name",
            existing_type=sa.String(length=100),
            type_=sa.VARCHAR(length=80),
            nullable=False,
        )

    with op.batch_alter_table("messages", schema=None) as batch_op:
        batch_op.drop_column("group_id")

    # ### end Alembic commands ###
