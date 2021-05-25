const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  console.log(course);
  res.redirect('/card');
});

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = mapCartItems(user.cart);

  const cart = {
    courses, 
    price: computePrice(courses)
  }

  res.status(200).json(cart); 
});

function mapCartItems(cart) {
  return cart.items.map(kurs => ({
    ...kurs.courseId._doc,
    id: kurs.courseId.id, // убираем лишнюю мета-дату
    count: kurs.count 
  }))
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return total += course.price * course.count;
  }, 0);
}

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);

  // console.log(courses);

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses: courses,
    price: computePrice(courses)
  });
});
module.exports = router;