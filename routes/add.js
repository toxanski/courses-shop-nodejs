const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, (request, response) => {
  response.status(200);
  response.render('add', {
    title: 'Добавить курс',
    isCourses: true
  });
});

router.post('/', auth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user._id //req.user - тоже допустимо
  });

  try {
    await course.save();
    res.redirect('/courses');

  } catch (error) {
    console.log(error);
  }

  
});

module.exports = router;