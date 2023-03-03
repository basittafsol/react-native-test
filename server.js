const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { data, user } = require('./data');

// Start express app
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to REACT NATIVE TEST',
    data,
  });
});

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req?.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (
    token ==
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmU5NTk1OTg1NGU5MmNjNjJiZTk4NyIsImlhdCI6MTY3NzYyODk1MSwiZXhwIjoxNjg1NDA0OTUxfQ.dqibc2_uBJriLhJ7pse_XlxwrmUbFVP4i9zvgIja5HE'
  )
    return next();

  return res.status(400).json({
    status: 'fail',
    message: 'You are not logged in! Please log in to get access.',
  });
};

// ROUTES HERE
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log({ email, password });

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password!',
    });
  }

  if (email != 'native_test@gmail.com' || password != '12345678') {
    return res.status(400).json({
      status: 'fail',
      message: 'Incorrect email or password!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

app.get('/data', protect, (req, res) => {
  res.status(200).json({ data });
});

app.all('*', (req, res, next) => {
  return res.status(400).json({
    status: 400,
    message: `Can't find '${req.originalUrl}' on this server!`,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
