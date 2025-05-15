// index.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');  // Import CORS package
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
function checkTaskLimit(req, res, next) {
    const { name } = req.body; // Gets the username from the request body

    if (!name) {
        return res.status(400).send('Username is required.');
    }

    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            return res.status(500).send('Server Error: Unable to read users');
        }

        let users = JSON.parse(data);
        const user = users.find(users => users.name === name);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.d.length >= 10) {
            return res.status(400).send('Task limit reached (10 tasks maximum)');
        }

        next(); // Continue to the save route
    });
}

// Sign-Up Route
app.post('/signup', (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send('Name and password are required');
    }

    // Read existing users
    fs.readFile('users.json', 'utf8', (err, data) => {
        let users = [];

        if (!err && data) {
            try {
                users = JSON.parse(data);//heh
            } catch (parseError) {
                console.error('Error parsing users.json:', parseError);
                return res.status(500).send('Server Error: Corrupted user file');
            }
        }
        const existingUser = users.find(user => user.name === name);
        if (existingUser) {
            return res.status(409).send('Username already exists');
        }


        // Add new user
        users.push({ name, password, d:[] });

        // Save updated users file
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {//heh
            if (err) {
                console.error('Error saving user:', err);
                return res.status(500).send('Server Error: Unable to save user');
            }
            res.send('User registered successfully');
        });
    });
});
app.post('/save', checkTaskLimit, (req,res)=>{
    const {task, time, name}=req.body;
    fs.readFile('users.json', 'utf8', (err, data) => {
        let users=[];
        let d=[];
        users=JSON.parse(data);
        const user=users.find(users => users.name === name);
        d=user.d;
        d.push({task,time});
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {//heh
            if (err) {
                console.error('Error saving user:', err);
                return res.status(500).send('Server Error: Unable to save user');
            }
            res.send('task saved');
        });

    })
})
app.post('/delete', (req,res)=>{
    const {task, time, name}=req.body;
    fs.readFile('users.json', 'utf8', (err, data) => {
        let users=[];
        let d=[];
        users=JSON.parse(data);
        const user=users.find(users => users.name === name);
        user.d = user.d.filter(t => t.task !== task || t.time !== time);
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Error saving user tasks:", err);
                return res.status(500).send("Server Error: Unable to save tasks.");
            }

            res.send("Task deleted successfully");
        });
    })
})
// Login Route
app.post('/login', (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send('Name and password are required');
    }

    // Read the users file
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading user data:', err);
            return res.status(500).send('Server Error: Unable to read users');
        }

        let users = [];

        if (data) {
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing users.json:', parseError);
                return res.status(500).send('Server Error: Corrupted user file');
            }
        }

        // Check if user exists
        const existingUser = users.find(user => user.name === name && user.password === password);

        if (existingUser) {
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid name or password');
        }
    });
});
app.get('/load', (req, res) => {
    const { name } = req.query;

    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading user file:", err);
            return res.status(500).send("Server Error: Unable to read users.");
        }

        let users = JSON.parse(data);
        const user = users.find(user => user.name === name);

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Send the user's task list (d)
        res.status(200).json(user.d);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

