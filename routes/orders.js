const {Router} = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({'user.userId': req.user._id})
    .populate('user.userId');

    // const orders23 = orders.map(order => {
    //   return {
    //     ...order.toJSON(),
    //     price: order.courses.reduce((total, course) => {
    //       return total += course.count * course.course.price;
    //     }, 0)
    //   }
    // });

    // console.log('мой объект orders', orders23);

    res.render('orders', {
      title: 'Заказы',
      isOrder: true,
      orders: orders.map(order => {
        return {
          ...order.toJSON(),
          price: order.courses.reduce((total, course) => {
            return total += course.count * course.course.price;
          }, 0)
        }
      })
    });

  } catch (error) {
    console.log(error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

    const courses = user.cart.items.map(i => ({
      count: i.count,
      course: {...i.courseId._doc}
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      courses //аналогично -> сourses: courses
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');

  } catch (error) {
    console.log(error)
  }
});

module.exports = router;