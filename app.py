# Use AJAX for requesting in JavaScript
# Use javascript to read textbox to a url redirect
# Go though the FLASK tutorial to set up sqlalchemy database
# Apparently there is something called metadata
# Very useful: https://stackoverflow.com/questions/33678175/what-is-the-difference-between-session-and-db-session-in-sqlalchemy 
# Join feature needs a lot of work, need to get rid of /join, and use html/js to call /<id> directly
# HIII this is me testing if git works
# This is testing if GIT changes stuff from macbook
# Testing push from pc

from flask import Flask, render_template, url_for, request, redirect, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, Table, create_engine
from sqlalchemy.orm import declarative_base, relationship
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from datetime import datetime 
import json
import webbrowser
import sys, os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SECRET_KEY'] = "bd6fee817230f43dbbadce4f"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #to supress warning

Bootstrap(app)

# engine = create_engine("mysql://user:pw@host/db", pool_pre_ping=True)

db = SQLAlchemy(app)
# db.create_all()
# print("hiboy", type(db.session)) 
# Just testing

if os.path.exists('test.db'):
  os.remove('test.db')
  




class Board(db.Model):
    # __tablename__ = "game"
    id = db.Column(db.Integer, primary_key=True)
    tile0 = db.Column(db.String, unique=False, nullable=True)
    tile1 = db.Column(db.String, unique=False, nullable=True)
    tile2 = db.Column(db.String, unique=False, nullable=True)
    tile3 = db.Column(db.String, unique=False, nullable=True)
    tile4 = db.Column(db.String, unique=False, nullable=True)
    tile5 = db.Column(db.String, unique=False, nullable=True)
    tile6 = db.Column(db.String, unique=False, nullable=True)
    tile7 = db.Column(db.String, unique=False, nullable=True)
    tile8 = db.Column(db.String, unique=False, nullable=True)

    move = relationship("Move", backref="boards", lazy='dynamic')

    def __repr__(self):
        return '<Board %r' % (self.id)

class Player(db.Model):
    # __tablename__ = "player"
    id = db.Column(db.Integer, primary_key=True)
    side = db.Column(db.String, unique=True, nullable=False) #Unique might be false
    # game_id = db.Column(db.Integer, ForeignKey("game.id"))
    
    move = relationship("Move", backref="players", lazy='dynamic')

    def __repr__(self):
        return '<Player %r, side %r' % (self.id, self.side)

class Move(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("player.id"))
    board_id = db.Column(db.Integer, db.ForeignKey("board.id"))
    tile = db.Column(db.Integer, index=True, nullable=False)

    def __repr__(self):
        return 'id: %r' % (self.id)

db.create_all()


class joinForm(FlaskForm):
    join_id = StringField('Enter your game ID', validators=[DataRequired()])
    submit = SubmitField('Submit')

@app.route('/', methods=["Post", "Get"])
def index():
    form = joinForm()
    if form.validate_on_submit():
        return redirect(url_for("game", id=form.join_id.data,side="o"))

    return render_template('index.html', form=form) #make index.html

# @app.route('/join')
# def join():
#     return render_template("test.html")
#     print("attempting to join")
#     try:
#         game_id = request.form['game_id']
#         print(game_id)
#         print(Game.query.all(),file=sys.stdout)
#         # return redirect(url_for("game", id=1,side="0")) # Fix this
#     except Exception as e:
#         print(e)
#         return "There was an issue joining your game."
#         # add click here to try again
    


@app.route('/game/<int:id>/<side>') # 
def game(id, side): 
    # check if id in database, then do stuff

    return render_template('game.html',id=id, side=side)

@app.route('/create')
def create_game():
    # db.create_all()
    # db.session.commit()
    howdy = Board(tile0="", tile1="", tile2="", tile3="", tile4="", tile5="", tile6="", tile7="", tile8="")
    db.session.add(howdy)
    try:
        db.session.commit() # This line has issues, says column doesn't exist
        print("hi")
        print(howdy.id)
        return redirect(url_for("game", id=howdy.id,side="x"))
    except Exception as e:
        print(e)
        db.session.rollback()
        return "There was an issue creating your game."
        # add click here to try again


#join by either typing in url, or text form, and redirect using js

@app.route('/receive_cord', methods = ["POST"])
def receive_cord():
    content = request.json
    print("hello")
    print(content)
    print(o, x)
    # Update Database here:
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 





if __name__ == "__main__":
    app.run()

