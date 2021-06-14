const {Router} = require('express');
const User = require('../models/user');
const router = Router();
const bcrypt = require('bcryptjs');

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true
  });
});

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const candidate = await User.findOne({ email });
    
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      console.log(candidate);
      if (areSame) {
        console.log('yra');
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(error => {
          if (error) {
            throw error;
          }
          res.redirect('/');
        })
      } else {
        res.redirect('/auth/login#login');
      }
    } else {
      res.redirect('/auth/login#login');
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

//регистрация
router.post('/register', async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.redirect('/auth/login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: {items: []} 
        //ключи и значения совпадают, можно так и оставить
      });
      await user.save();
      res.redirect('/auth/login#login');
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;