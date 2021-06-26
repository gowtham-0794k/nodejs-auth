# API Authentication using NodeJs

This is an Authentication API using JWT's that you can plug inside your current project or you can start with a new one. Email & Password is used for authentication.

The API based on Node.js, Express & MongoDB, following the **MVC pattern** i.e. Model ~~View~~ Controller.

**MongoDB** is used for storing Users in Database.

---

## To start setting up the project

Step 1: Clone the repo

```bash
git clone https://github.com/gowtham-0794k/spak.git
```

Step 2: cd into the cloned repo and run:

```bash
npm install
```

Step 3: Put your credentials in the .env file.

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false
DB_NAME=spak_db
ACCESS_TOKEN_SECRET=spak12345
```

Step 4: Start the API by

```bash
npm start
```

Step 10 (Optional): Change the expiration time of Access Token the **`./helpers/jwt_helper.js`** file.

## Author

- [**Gowtham Kumar B V**]
