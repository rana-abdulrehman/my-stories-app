const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const notificationRoutes = require('./routes/notifications');
const User = require('./models/User');
const Notification = require('./models/Notification');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const frontendBuildPath = path.join(__dirname, '..', '', 'build');
app.use(express.static(frontendBuildPath));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const adminUser = await User.findOne({ email: 'admin@admin.com' });
  if (!adminUser) {
    const newAdminUser = new User({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin',
    });
    await newAdminUser.save();
    console.log('Admin user created');
  }
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('markNotificationAsRead', async (data) => {
    try {
      await Notification.findByIdAndUpdate(data.notificationId, { read: true });
      const notifications = await Notification.find({ userId: data.userId }).sort('-createdAt');
      const unreadCount = notifications.filter((n) => !n.read).length;

      
      io.emit('updateNotificationCount', { count: unreadCount });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
