# Installation Instructions

1. From the terminal, navigate into `client` directory.
2. Run `npm install`
3. Run `npm run start` which will now fire off the front-end server.
4. From a new terminal, navigate to the `server` directory
5. Create a file called `.env` and add the following values (replace any for you local configuration necessary): 
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/live_chat_app
SECRET_KEY=kitty_kat
PORT=5000
USER=postgres
PASSWORD=postgres
```
6. Create a python virtual environment 
7. Install libraries by running `pip install -r requirements.txt`
8. To start the server run the command `python -m routes.main`