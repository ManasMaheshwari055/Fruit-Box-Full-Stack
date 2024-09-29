const express = require("express"); // requiring express package
const db = require("./routes/database"); // requiring database which is in database.js file
const path = require("path"); // requiring path for static files (static files are resources like images, CSS, and JS that don't change)
const session = require('express-session'); // requiring session to store info across various pages; a session is created on login
const app = express();    
const bodyParser = require('body-parser');                           
const port = 3001;
const methodOverride = require('method-override');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');

app.use(cors({
    origin: 'http://localhost:5173', // React app's address
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], 
    credentials: true // 
}));

app.use(bodyParser.json());

app.use(methodOverride('_method')); // This allows you to use _method to simulate PUT and PATCH


// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serving static files from "public" directory
app.set("view engine", "ejs"); // Setting view engine to EJS for rendering HTML templates
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded form data
app.use(express.json()); // For parsing JSON data if needed

// **Setup express-session middleware**
app.use(session({
    secret: 'FruitBoxIsGreat', // Replace with a strong secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Don't create a session until something is stored
    cookie: { 
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
        
    }
}));



// Routes
app.get('/', (req, res) => {
    res.render('index'); // Rendering the index.ejs file which is our home page
});

// Register route
app.get('/register/user', (req, res) => {
    res.render('registerUser'); // Rendering the registration page
});

app.get('/register/vendor' , (req,res)=>{
    res.render("registerVendor");
})

// Login route
app.get('/login/user', (req, res) => {
    res.render('loginUser'); // Rendering the login page                       
});

app.get('/login/vendor', (req, res) => {
    res.render('loginVendor'); // Rendering the login page                       
});

// Adding new user
app.post('/register/user', (req, res) => {
    const { userID, userName, userEmail, userPassword, userPhoneNumber , userAddress} = req.body;

    if (!userID || !userName || !userEmail || !userPassword || !userPhoneNumber || !userAddress) {
        return res.send('All fields are required!');
    }
    
    // Insert the new user into the database
    db.query('INSERT INTO user (userID, userName, userEmail, userPassword, userPhoneNumber, userAddress) VALUES (?, ?, ?, ?, ?, ?)', 
[userID, userName, userEmail, userPassword, userPhoneNumber, userAddress], 
(err, result) => {
    if (err) {
        console.error('Error inserting new user:', err);
        return res.status(500).json({ message: 'An error occurred during registration.' });
    }
    res.redirect('/login/user');
});

    const cartID = uuidv4();
    const TotalAmount =0;
    // Insert cartId 



    db.query('INSERT INTO Cart (cartID, userID, TotalAmount) VALUES (?, ?, ?)', 
        [cartID, userID, TotalAmount], 
        (err, cartResult) => {
            if (err) {
                console.error('Error inserting cart:', err);
                return res.status(500).json({ message: 'An error occurred while creating the cart.' });
            }
        });
        
});




app.post('/register/vendor', (req, res) => {
    const { vendorID, vendorName, vendorPhoneNumber, vendorAddress, vendorPassword, vendorEmail } = req.body;

    if (!vendorID || !vendorName || !vendorPhoneNumber || !vendorAddress || !vendorPassword || !vendorEmail) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Insert the new vendor into the database
    db.query(
        'INSERT INTO Vendors (vendorID, vendorName, vendorPhoneNumber, vendorAddress, vendorPassword, vendorEmail) VALUES (?, ?, ?, ?, ?, ?)', 
        [vendorID, vendorName, vendorPhoneNumber, vendorAddress, vendorPassword, vendorEmail], 
        (err, result) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).json({ message: 'An error occurred during registration.' });
            }
            res.status(201).json({ message: 'Vendor registered successfully!' }); // Respond with JSON
        }
    );
});




// Handling user login
app.post('/login/user', (req, res) => {
    const { userEmail, userPassword } = req.body;

    console.log('Request Body:', req.body);
    console.log('Email entered:', userEmail);
    console.log('Password entered:', userPassword);

    db.query('SELECT * FROM user WHERE userEmail = ? AND userPassword = ?', [userEmail, userPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'An error occurred, please try again.' });
        }

        console.log('Database results:', results);

        if (results.length > 0) {
            const user = results[0];
            req.session.userID = user.userID;
            req.session.userName = user.userName;
            req.session.userEmail = user.userEmail;
            req.session.userPassword = user.userPassword;
            req.session.userAddress = user.userAddress;
            req.session.userPhoneNumber = user.userPhoneNumber;
            console.log('Session after login:', req.session);

            res.json({ user: req.session.userName }); // Return user data
        } else {
            res.status(401).json({ message: 'Incorrect email or password' });
        }
    });
});


//vendor login
app.post('/login/vendor', (req, res) => {
    const { vendorPassword, vendorEmail } = req.body;

    // Query to fetch the vendor's details based on the provided email and password
    db.query('SELECT * FROM Vendors WHERE vendorPassword = ? AND vendorEmail = ?', [vendorPassword, vendorEmail], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log database error
            return res.send('An error occurred, please try again.');
        }

        console.log('Database results:', results);  // Log the results from the database

        if (results.length > 0) {
            // If login is successful, assign all relevant vendor details to session
            const vendor = results[0];
            req.session.vendorID = vendor.vendorID;
            req.session.vendorName = vendor.vendorName;
            req.session.vendorEmail = vendor.vendorEmail;
            req.session.vendorAddress = vendor.vendorAddress;
            req.session.vendorPhoneNumber = vendor.vendorPhoneNumber;
            req.session.vendorPassword = vendor.vendorPassword;

            console.log('Session after login:', req.session); // Log session details

            // Redirect to the dashboard or another page after successful login
            res.redirect('/');
        } else {
            // If no matching vendor found, send error message
            res.send('Incorrect email or password');
        }
    });
});

//home route
app.get("/user/view" , (req,res)=>{
    res.render('homeUser', {userID:req.session.userID , userName:req.session.userName});
});

//view profile
app.get("/user/profile", (req, res) => {
    
    console.log("view",req.session);
    console.log(req.session.userEmail);
    console.log("VIEW" ,req.params);
    
    res.json({
        userID: req.session.userID,
        userName: req.session.userName,
        userEmail: req.session.userEmail,
        userAddress: req.session.userAddress,
        userPhoneNumber: req.session.userPhoneNumber,
        userPassword: req.session.userPassword
    });
});


//edit route for user
app.get('/user/edit', (req, res) => {
    if (!req.session.userID) {
        return res.redirect('/login/user'); // Redirect to login if user is not logged in
    }
    
    // Fetch user profile details from the session
    const { userID, userName, userEmail, userAddress, userPhoneNumber, userPassword } = req.session;

    res.render('edit', { userID, userName, userEmail, userAddress, userPhoneNumber, userPassword });
});

//pacth edit route for user
app.patch('/user/edit', (req, res) => {

    console.log('Received request body:', req.body);
    console.log('Session at /user/edit:', req.session);
    
    const { newUserID , formPassword, newUserName, newUserEmail, newUserAddress, newUserPhoneNumber } = req.body;
    
    if (!newUserID || !formPassword || !newUserName || !newUserEmail || !newUserAddress || !newUserPhoneNumber) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'SELECT * FROM user WHERE userID = ?';

    db.query(query, [newUserID], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'An error occurred, please try again.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = results[0];

        // Direct password comparison
        if (formPassword !== user.userPassword) {
            console.log('Password mismatch');
            return res.status(403).json({ message: 'Incorrect password.' });
        }

        const updateQuery = 'UPDATE user SET userName = ?, userEmail = ?, userAddress = ?, userPhoneNumber = ? WHERE userID = ?';
        
        db.query(updateQuery, [newUserName, newUserEmail, newUserAddress, newUserPhoneNumber, newUserID], (updateError) => {
            if (updateError) {
                console.error('Update error:', updateError);
                return res.status(500).json({ message: 'An error occurred, please try again.' });
            }

            // Update session data
            req.session.userID = newUserID;
            req.session.userName = newUserName;
            req.session.userEmail = newUserEmail;
            req.session.userAddress = newUserAddress;
            req.session.userPhoneNumber = newUserPhoneNumber;
            
            console.log('Updated session data:', req.session);
            
            // Return a success response
            res.status(200).json({ message: 'Profile updated successfully.' });
        });
    });
});



//vendor edit 
app.get("/vendor/view" , (req,res)=>{
    res.render('homeUser', {userID:req.session.userID   });
});


//view profile vendor
app.get("/vendor/profile", (req, res) => {
    
    console.log("view",req.session);
    console.log(req.session.vendorEmail);
    console.log("VIEW" ,req.params);
    
    res.json({
        vendorID: req.session.vendorID,
        vendorName: req.session.vendorName,
        vendorEmail: req.session.vendorEmail,
        vendorAddress: req.session.vendorAddress,
        vendorPhoneNumber: req.session.vendorPhoneNumber,
        vendorPassword: req.session.vendorPassword
    });
});


//edit profile vendor
app.get('/vendor/edit', (req, res) => {
    if (!req.session.userID) {
        return res.redirect('/login/vendor'); // Redirect to login if user is not logged in
    }
    
    // Fetch user profile details from the session
    const { vendorID, vendorName, vendorEmail, vendorAddress, vendorPhoneNumber, vendorPassword } = req.session;

    res.render('editVendor', { vendorID, vendorName, vendorEmail, vendorAddress, vendorPhoneNumber, vendorPassword });
});
       
//patch vendor
app.patch('/vendor/edit', (req, res) => {
    console.log('Received request body:', req.body);
    console.log('Session at /vendor/edit:', req.session);
    
    const { newVendorID, formPassword, newVendorName, newVendorEmail, newVendorAddress, newVendorPhoneNumber } = req.body;

    if (!newVendorID || !formPassword || !newVendorName || !newVendorEmail || !newVendorAddress || !newVendorPhoneNumber) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'SELECT * FROM Vendors WHERE vendorID = ?';
    
    db.query(query, [newVendorID], (error, results) => { // Use newVendorID here
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'An error occurred, please try again.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }

        const vendor = results[0];

        // Direct password comparison
        if (formPassword !== vendor.vendorPassword) {
            console.log('Password mismatch');
            return res.status(403).json({ message: 'Incorrect password.' });
        }

        const updateQuery = 'UPDATE Vendors SET vendorName = ?, vendorEmail = ?, vendorAddress = ?, vendorPhoneNumber = ? WHERE vendorID = ?';
        
        db.query(updateQuery, [newVendorName, newVendorEmail, newVendorAddress, newVendorPhoneNumber, newVendorID], (updateError) => {
            if (updateError) {
                console.error('Update error:', updateError);
                return res.status(500).json({ message: 'An error occurred, please try again.' });
            }

            // Update session data
            req.session.vendorID = newVendorID;
            req.session.vendorName = newVendorName;
            req.session.vendorEmail = newVendorEmail;
            req.session.vendorAddress = newVendorAddress;
            req.session.vendorPhoneNumber = newVendorPhoneNumber;
            
            console.log('Updated session data:', req.session);
            
            // Return a success response
            res.status(200).json({ message: 'Profile updated successfully.' });
        });
    });
});

// Route to update the total amount for the user
// Route to update the total amount for the user
app.post('/cart', (req, res) => {
    const userID = req.session.userID; // Access userID from session
    const { TotalAmount } = req.body; // Destructure TotalAmount from request body

    console.log('User ID from session:', userID); // Debugging line
    console.log('Total Amount:', TotalAmount); // Debugging line

    // Check if userID and TotalAmount are defined
    if (!userID || TotalAmount === undefined) {
        return res.status(400).json({ message: 'User ID and total amount are required.' });
    }

    // Update the total amount in the Cart table
    db.query('UPDATE Cart SET TotalAmount = ? WHERE userID = ?', [TotalAmount, userID], (err, result) => {
        if (err) {
            console.error('Error updating total amount:', err);
            return res.status(500).json({ message: 'Error updating total amount' });
        }

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no update made' });
        }

        res.status(200).json({ message: 'Total amount updated successfully' });
    });
});




// Start the server
app.listen(3001, () => {

    console.log('Server is running on port 3000');
}); 

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => { // Destroy session on logout
        if (err) throw err;
        res.redirect('/'); // Redirecting to home page after session is destroyed
    });
});
