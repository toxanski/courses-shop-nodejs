const {Router} = require('express');
const router = Router();

router.get('/', (request, response) => {
  response.status(200);
  response.render('add', {
    title: 'Добавить курс',
    isCourses: true
  });
});

module.exports = router;