# Use AJAX for requesting in JavaScript
# Use javascript to read textbox to a url redirect
# Go though the FLASK tutorial to set up sqlalchemy database
# Apparently there is something called metadata
# Very useful: https://stackoverflow.com/questions/33678175/what-is-the-difference-between-session-and-db-session-in-sqlalchemy 
# Join feature needs a lot of work, need to get rid of /join, and use html/js to call /<id> directly


from flask import Flask, render_template, url_for, request, redirect, make_response
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime 
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)
# db.create_all()
print("hiboy", type(db.session)) 
# Just testing


class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    o = db.Column(db.Integer, default=0)
    x = db.Column(db.Integer, default=40)

    def __repr__(self):
        return '<Game %r, x= %s, o=%s>' % (self.id, self.x, self.o)

@app.route('/')
def index():
    return render_template('index.html') #make index.html

@app.route('/join')
def join():
    try:
        game_id = request.form['game_id']
        print(game_id)
        return redirect(f"/game/{game_id}") # Fix this
    except:
        return "There was an issue joining your game."


@app.route('/game/<int:id>') # 
def game(id): 
    # check if id in database, then do stuff

    return render_template('game.html',id=id)



@app.route('/create')
def create_game():
    # create database row, init game, generate id, get id, 
    new_game = Game()
    try:
        db.create_all() # This fixed it
        db.session.add(new_game)
        db.session.commit()
        print("hi")
        print(new_game.id)
        return redirect(f"/game/{new_game.id}")
    except Exception as e:
        print(e)
        return "There was an issue creating your game."
        # add click here to try again
    

#join by either typing in url, or text form, and redirect using js

@app.route('/receive_cord', methods = ["POST"])
def receive_cord():
    content = request.json
    print("hello")
    print(content)
    o = content["o"]
    x = content["x"]
    print(o, x)
    # Update Database here:
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 





if __name__ == "__main__":
    app.run()

