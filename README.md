# 💰 Expense Tracker Dashboard

A modern and responsive web-based expense tracker that helps you visualize your income, expenses, balance trends, and spending categories.

![Dashboard Screenshot](./screenshot.png) <!-- Rename image if needed -->

---

## 📊 Features

- 📈 Income vs Expense Bar Chart
- 📉 Total Balance Graph
- 🧾 Latest Transactions with Search & Filter
- 📁 Export Transactions to Excel
- 🥧 Spending Categories Pie Chart
- 🕶️ Dark UI for modern feel

---

## 🚀 Live Demo

If hosted online, add the link here:

[🔗 View Live](https://your-live-link.com)

---

## 🛠️ Built With

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **jQuery**
- **Chart.js** (assumed for graphs — update if different)

---

## 📂 Project Structure

```bash
expense-tracker/
├── index.html
├── style.css
├── script.js
├── /assets
│   └── screenshot.png
├── README.md


## 🧑‍💻 Getting Started

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git

2. cd expense-tracker   

3. Open index.html in your browser.

## 🙋‍♂️ Author
 • Your Name 
   github link





Node.js + MongoDB

Step 1: MongoDB Atlas Setup

MongoDB Atlas pe free account bana lo: https://www.mongodb.com/cloud/atlas

Cluster create karo (Free Tier).

Database user aur password set karo.

Network access: “Allow access from anywhere” select karo (0.0.0.0/0).

Cluster ready ho jaane ke baad Connect → Connect your application.

Connection string copy karo, format kuch aisa hoga:

mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority


<username>, <password>, <dbname> replace karo apne credentials ke saath.

Step 2: Project Ready Karna

Aapka folder structure kuch aisa hona chahiye:

my-project/
├─ server.js
├─ package.json
├─ package-lock.json
├─ signup.html
├─ signin.html
├─ signup.js
├─ signin.js
└─ ...


server.js me MongoDB connect karne ke liye:

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


Yahan process.env.MONGODB_URI rakho, Railway me environment variable set karenge.

Package install karo locally:

npm init -y
npm install express mongoose body-parser cors bcrypt


package.json me start script add karo:

"scripts": {
    "start": "node server.js"
}

Step 3: GitHub Repo Banana

Project ko GitHub pe push karo:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main

Step 4: Railway pe Deploy Karna

Railway pe account banao: https://railway.app/

New Project → Deploy from GitHub select karo.

Apna GitHub repo select karo.

Railway automatically package.json aur start script detect karega.

Step 5: Environment Variable Set Karna

Railway dashboard → Project → Settings → Environment Variables

Add new variable:

Key	Value
MONGODB_URI	<your MongoDB Atlas connection string>

Save karo aur redeploy karo.

Step 6: Frontend API Call Update Karna

Signup aur signin me, localStorage wala code remove karo.

Fetch API se call karo Railway ka URL:

// Example signup
fetch('https://<your-railway-app>.up.railway.app/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password })
})
.then(res => res.json())
.then(data => alert(data.message));

// Example login
fetch('https://<your-railway-app>.up.railway.app/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
})
.then(res => res.json())
.then(data => alert(data.message));

✅ Step 7: Test

Railway URL open karo, console me check karo.

Signup → login → sab MongoDB Atlas me save ho jaayega.

Dusre computer se bhi front-end open karke direct API call ho sakta hai.