const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TodoModel = require('./models/Todo');
const UserModel = require('./models/User'); 
const { expressjwt: expressJwt } = require("express-jwt");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'truptpatel'; 

mongoose.connect('mongodb+srv://trupt:trupt@room-link.ksuuo87.mongodb.net/task?retryWrites=true&w=majority&appName=room-link',
    console.log('MongoDB connected')
)

app.listen(5000,
    console.log('Server listening on port: 5000')
)
const requireAuth = expressJwt({ secret: JWT_SECRET, algorithms: ['HS256'] });

app.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body); 
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  UserModel.create({ username, password: hashedPassword })
    .then(user => res.json({ message: 'User created successfully', user }))
    .catch(err => res.status(500).json({ error: 'User creation failed', err }));
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await UserModel.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
      .then(result => res.json(result))
      .catch(err => console.log(err));
   
});

app.get('/get',(req,res)=>{
  TodoModel.find()
  .then(result=> res.json(result))
  .catch(err=>console.log(err));
});
  
app.put('/edit/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndUpdate(id,{done:true},{new:true})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.put('/update/:id',(req,res)=>{
  const{id} = req.params;
  const{task} = req.body;
  TodoModel.findByIdAndUpdate(id,{task:task})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.delete('/delete/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndDelete({_id:id})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 }); 

module.exports=app;
