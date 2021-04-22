const {Router} = require('express');
const router = Router();

router.get('/', (request, response) => {
  response.render('courses', {
    title: 'Курсы',
    isAdd: true
  });
});

module.exports = router;