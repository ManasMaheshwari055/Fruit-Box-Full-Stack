const express = require("express"); // requiring express package
const router = express.Router();
const db = require("./routes/database"); // requiring database which is in database.js file
const path = require("path"); // requiring path for static files (static files are resources like images, CSS, and JS that don't change)
const session = require('express-session'); // requiring session to store info across various pages; a session is created on login
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const methodOverride = require('method-override');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);


app.use(cors({

    origin: 'http://localhost:5173', // React app's address
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true // 
}));

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow your React app
        methods: ['GET', 'POST'],
        credentials: true // Allow credentials
    }
});

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

app.get('/register/vendor', (req, res) => {
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
    const { userID, userName, userEmail, userPassword, userPhoneNumber, userAddress } = req.body;

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

    const cartID = 'C' + userID;
    const TotalAmount = 0;
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

//user login
app.post('/login/user', (req, res) => {
    const { userEmail, userPassword } = req.body;

    console.log('Request Body:', req.body);
    console.log('Email entered:', userEmail);
    console.log('Password entered:', userPassword);

    // Query database to find the user by email
    db.query('SELECT * FROM user WHERE userEmail = ?', [userEmail], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'An error occurred, please try again.' });
        }

        console.log('Database results:', results);

        // If no user found with the given email
        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found. Please sign up first.' });
        }

        const user = results[0];

        // Check if the provided password matches the user's password in the database
        if (user.userPassword !== userPassword) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        // Store user details in the session after successful login
        req.session.userID = user.userID;
        req.session.userName = user.userName;
        req.session.userEmail = user.userEmail;
        req.session.userPassword = user.userPassword; // Avoid storing password in session for security reasons in real applications
        req.session.userAddress = user.userAddress;
        req.session.userPhoneNumber = user.userPhoneNumber;

        console.log('Session after login:', req.session);

        // Return success response with user details (excluding sensitive info like password)
        res.status(200).json({ user: { userID: user.userID, userName: user.userName, userEmail: user.userEmail } });
    });
});



//vendor login
app.post('/login/vendor', (req, res) => {
    const { vendorEmail, vendorPassword } = req.body;

    // Query to fetch the vendor's details based on the provided email
    db.query('SELECT * FROM Vendors WHERE vendorEmail = ?', [vendorEmail], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred, please try again.'); // Return a 500 status for server error
        }

        console.log('Database results:', results);

        // Check if a vendor was found
        if (results.length === 0) {
            return res.status(404).send('Vendor not found.'); // Return 404 if vendor doesn't exist
        }

        const vendor = results[0];

        // Directly compare the plaintext password
        if (vendor.vendorPassword !== vendorPassword) {
            return res.status(401).send('Incorrect password.'); // Return 401 if password is incorrect
        }

        // If login is successful, assign all relevant vendor details to session
        req.session.vendorID = vendor.vendorID;
        req.session.vendorName = vendor.vendorName;
        req.session.vendorEmail = vendor.vendorEmail;
        req.session.vendorAddress = vendor.vendorAddress;
        req.session.vendorPhoneNumber = vendor.vendorPhoneNumber;

        console.log('Session after login:', req.session);

        // Send a success response with vendor details
        res.status(200).json({
            message: 'Login successful',
            user: {
                vendorID: vendor.vendorID,
                vendorName: vendor.vendorName,
                vendorEmail: vendor.vendorEmail,
                vendorAddress: vendor.vendorAddress,
                vendorPhoneNumber: vendor.vendorPhoneNumber,
            }
        });
    });
});


//home route
app.get("/user/view", (req, res) => {
    res.render('homeUser', { userID: req.session.userID, userName: req.session.userName });
});

//view profile
app.get("/user/profile", (req, res) => {

    console.log("view", req.session);
    console.log(req.session.userEmail);
    console.log("VIEW", req.params);

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

    const { newUserID, formPassword, newUserName, newUserEmail, newUserAddress, newUserPhoneNumber } = req.body;

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
app.get("/vendor/view", (req, res) => {
    res.render('homeUser', { userID: req.session.userID });
});


//view profile vendor
app.get("/vendor/profile", (req, res) => {

    console.log("view", req.session);
    console.log(req.session.vendorEmail);
    console.log("VIEW", req.params);

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

app.post('/cart-items', (req, res) => {
    const { productID, quantity } = req.body;
    
    // Access userID from session
    const userID = req.session.userID;

    // Check if userID exists in session
    if (!userID) {
        return res.status(401).send('User not logged in');
    }

    // Generate cartID as 'C' + userID
    const cartID = 'C' + userID;
    console.log(cartID);

    // Query to insert cart item
    const insertQuery = 'INSERT INTO CartItems (cartID, productID, quantity) VALUES (?, ?, ?)';

    db.query(insertQuery, [cartID, productID, quantity], (err) => {
        if (err) {
            console.error('Error adding to CartItems:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Item added to cart');
    });
});

// Fetch cart items for the logged-in user
app.get('/cart-items', (req, res) => {
    const userID = req.session.userID;

    // Check if the user is logged in
    if (!userID) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Define the cartID based on the userID
    const cartID = 'C' + userID;

    // Query to fetch cart items including cartID and image URL
    const query = `
        SELECT 
            CartItems.productID, 
            CartItems.quantity, 
            product.productName AS name, 
            product.price, 
            CartItems.cartID,
            fruits_images.imageURL AS image
        FROM CartItems 
        JOIN product ON CartItems.productID = product.productID 
        JOIN fruits_images ON product.productName = fruits_images.name
        WHERE CartItems.cartID = ?`;

    db.query(query, [cartID], (err, results) => {
        if (err) {
            console.error('Error fetching cart items:', err);  // Log the error for debugging
            return res.status(500).json({ message: 'Server error' });
        }

        res.status(200).json(results);  // Send back the cart items including cartID and image
    });
});


app.delete('/cart-items', (req, res) => {
    const { cartID, productID } = req.query; // Get cartID and productID from query parameters

    // Check if cartID and productID are provided
    if (!cartID || !productID) {
        return res.status(400).json({ message: 'cartID and productID are required' });
    }

    // Query to delete the item from the CartItems table
    const query = `DELETE FROM CartItems WHERE cartID = ? AND productID = ?`;

    db.query(query, [cartID, productID], (err, results) => {
        if (err) {
            console.error('Error removing item from cart:', err); // Log the error for debugging
            return res.status(500).json({ message: 'Server error while removing item from cart' });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Item removed successfully' }); // Success response
    });
});

app.delete('/cart', (req, res) => {
    const userID = req.session.userID; // Get userID from session
    const cartID = 'C' + userID; // Define cartID based on userID

    // Check if the user is logged in
    if (!userID) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Query to delete all items from the CartItems table for the user's cartID
    const query = `DELETE FROM CartItems WHERE cartID = ?`;

    db.query(query, [cartID], (err, results) => {
        if (err) {
            console.error('Error clearing cart:', err);
            return res.status(500).json({ message: 'Server error while clearing cart' });
        }

        res.status(200).json({ message: 'Cart cleared successfully' }); // Success response
    });
});


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
//fetch from product databse 
app.get('/products', (req, res) => {
    // Assuming you have a database connection set up
    db.query('SELECT * FROM product', (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        res.json(products); // Send all products back as JSON
    });
});


app.get('/addproduct',  (req, res) => {
    const vendorID = req.session.vendorID; // Assuming vendorID is stored in the session

    if (!vendorID) {
        return res.status(401).json({ message: 'Unauthorized. Vendor not logged in.' });
    }

    // SQL query to fetch products for the logged-in vendor
    const query = 'SELECT * FROM product WHERE vendorID = ?';

   db.query(query, [vendorID], (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No products found for this vendor.' });
        }

        // Return the list of productsw
        return res.status(200).json({ message: 'Products retrieved successfully', products: results });
    });
});

app.post('/addproduct', (req, res) => {
    // Destructure the required fields from the request body
    const { vendorID, productName, price, quantity, unit } = req.body;

    // Validate input fields
    if (!vendorID || !productName || !price || !quantity || !unit) {
        return res.status(400).json({ error: 'All fields are required: vendorID, productName, price, quantity, unit.' });
    }

    // Generate a unique product ID
    const productID = uuidv4();

    console.log('Received vendorID:', vendorID);

    // Convert quantity to a number and validate it
    const newQuantity = Number(quantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a valid positive number.' });
    }

    // Query to fetch imageURL based on productName
    const imageQuery = 'SELECT imageURL FROM fruits_images WHERE name = ?';
    
    db.query(imageQuery, [productName], (err, imageResults) => {
        if (err) {
            console.error('Error fetching image URL:', err); // Log the error for debugging
            return res.status(500).json({ error: 'Error fetching image URL', details: err.message });
        }

        if (imageResults.length === 0) {
            return res.status(404).json({ error: 'Image not found for the given product name' });
        }

        const imageURL = imageResults[0].imageURL;

        // Query to check if the product already exists
        const checkQuery = 'SELECT * FROM product WHERE productName = ? AND vendorID = ?';
        
        db.query(checkQuery, [productName, vendorID], (err, results) => {
            if (err) {
                console.error('Error checking product:', err); // Log the error for debugging
                return res.status(500).json({ error: 'Error checking product', details: err.message });
            }

            if (results.length > 0) {
                const existingProduct = results[0];

                // Check if the product details are the same
                if (existingProduct.price === price && existingProduct.quantity === newQuantity) {
                    return res.status(400).json({ error: 'Product already added with the same details' });
                } else {
                    // Update existing product by adding the new quantity
                    const updatedQuantity = existingProduct.quantity + newQuantity; // Add new quantity to existing quantity
                    const updateQuery = 'UPDATE product SET price = ?, quantity = ?, imageURL = ? WHERE productName = ? AND vendorID = ?';
                    
                    db.query(updateQuery, [price, updatedQuantity, imageURL, productName, vendorID], (err, result) => {
                        if (err) {
                            console.error('Error updating product:', err); // Log the error for debugging
                            return res.status(500).json({ error: 'Error updating product', details: err.message });
                        }
                        return res.json({ message: 'Product updated successfully' });
                    });
                }
            } else {
                // Insert new product
                const insertQuery = 'INSERT INTO product (productID, vendorID, productName, price, quantity, imageURL) VALUES (?, ?, ?, ?, ?, ?)';
                db.query(insertQuery, [productID, vendorID, productName, price, newQuantity, imageURL], (err, result) => {
                    if (err) {
                        console.error('Error adding product:', err); // Log the error for debugging
                        return res.status(500).json({ error: 'Error adding product', details: err.message });
                    }
                    res.json({ message: 'Product added successfully' });
                });
            }
        });
    });
});


//io connection 
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Route to get all products
app.get('/products', (req, res) => {
    console.log("helloo");
    db.query('SELECT * FROM product', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'An error occurred while fetching products.' });
        }
        res.json(results); // Return all products in JSON format
    });
});


//get user id
app.get('/check-userid/:userId', (req, res) => {
    const userId = req.params.userId; // Get userId from URL parameters

    if (!userId) {
        return res.status(400).json({ error: 'UserID is required' });
    }

    // SQL query to check if userId exists in the database
    const query = 'SELECT COUNT(*) AS count FROM user  WHERE userID = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // If count > 0, userId exists
        const count = results[0].count;
        if (count > 0) {
            res.json({ available: false, message: 'UserID already exists!' });
        } else {
            res.json({ available: true, message: 'UserID is available' });
        }
    });
});

app.get('/check-vendorid/:vendorId', (req, res) => {
    const vendorId = req.params.vendorId; // Get userId from URL parameters

    if (!vendorId) {
        return res.status(400).json({ error: 'vendorID is required' });
    }


    // SQL query to check if userId exists in the database
    const query = 'SELECT COUNT(*) AS count FROM Vendors  WHERE vendorID = ?';

    db.query(query, [vendorId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // If count > 0, vendorId exists
        const count = results[0].count;
        if (count > 0) {
            res.json({ available: false, message: 'vendorID already exists!' });
        } else {
            res.json({ available: true, message: 'vendorID is available' });
        }
    });
});





server.listen(3001, () => {
    console.log('Server is running on port 3001');
});




// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => { // Destroy session on logout
        if (err) throw err;
        res.redirect('/'); // Redirecting to home page after session is destroyed
    });
});