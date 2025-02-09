# Setting Up Locally : 

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/ShinichiShi/cron.git
cd cron
```

### 2️⃣ Install Dependencies
```sh
npm install
```
### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
MONGODB_URI=<The connection string from MongoDB Atlas>
PORT=3000
```
### 4️⃣ Start the Server
```sh
npm run start
```
For development mode:
```sh
npm run start:dev
```
## 📌 Running Tests
To run unit tests:
```sh
npm test
```
To detect open handles (fix Jest teardown issues):

```
npm test -- --detectOpenHandles
```
---