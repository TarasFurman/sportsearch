from app import flask_app

if __name__ == '__main__':
    app, socketio = flask_app()
    socketio.run(
        app,
        host='0.0.0.0',
        port=5000,
    )

