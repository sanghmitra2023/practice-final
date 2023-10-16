"""empty message

Revision ID: 2f2ca76ddb08
Revises: 
Create Date: 2023-10-14 10:10:00.640595

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2f2ca76ddb08'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('dog',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('gender', sa.String(length=250), nullable=False),
    sa.Column('age', sa.String(length=250), nullable=False),
    sa.Column('breed', sa.String(length=250), nullable=False),
    sa.Column('image', sa.String(length=250), nullable=False),
    sa.Column('info', sa.String(length=250), nullable=False),
    sa.Column('detail', sa.String(length=250), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=250), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('appointment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('dog_id', sa.Integer(), nullable=False),
    sa.Column('time', sa.DateTime(), nullable=False),
    sa.Column('user_comment', sa.String(length=250), nullable=True),
    sa.ForeignKeyConstraint(['dog_id'], ['dog.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('favorite',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('dog_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['dog_id'], ['dog.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('report',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('appointment_id', sa.Integer(), nullable=False),
    sa.Column('time', sa.DateTime(), nullable=False),
    sa.Column('user_comment', sa.String(length=250), nullable=False),
    sa.Column('picture', sa.String(length=250), nullable=True),
    sa.ForeignKeyConstraint(['appointment_id'], ['appointment.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('report')
    op.drop_table('favorite')
    op.drop_table('appointment')
    op.drop_table('user')
    op.drop_table('dog')
    # ### end Alembic commands ###
