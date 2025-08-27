const { pool } = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret_key } = require("../middleware/authMiddleware");

// User Registration
exports.registerUser = async (req, res) => {
  const { email, password, fullName } = req.body;
  
  try {
    // Determine role based on email domain
    const role = email.endsWith('@docsecure.com') ? 'Administrator' : 'Citizen';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into users table
    const [result] = await pool.query(
      "INSERT INTO users (Email, Password, FullName, Role) VALUES (?, ?, ?, ?)", 
      [email, hashedPassword, fullName, role]
    );
    
    const userID = result.insertId;
    
    // Insert into appropriate child table based on role
    if (role === 'Administrator') {
      await pool.query("INSERT INTO administrators (UserID) VALUES (?)", [userID]);
    } else {
      await pool.query("INSERT INTO citizens (UserID) VALUES (?)", [userID]);
    }
    
    res.status(201).json({ 
      message: "User registered successfully", 
      role: role 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE Email = ?", [email]);
    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user[0].Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userID: user[0].UserID, role: user[0].Role }, secret_key);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  

exports.getUserInfo = async (req, res) => {
  
  const userID = req.user.userID; // Get userID from the token

  try {
    const [user] = await pool.query("SELECT UserID, Email, Role FROM users WHERE UserID = ?", [userID]);
    if (user.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    
    // Format the user object to ensure proper JSON
    const formattedUser = {
      UserID: user[0].UserID,
      Email: user[0].Email,
      Role: user[0].Role
    };
    
    res.json({ user: formattedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
