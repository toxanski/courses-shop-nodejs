const {Router} = require('express');
const router = Router();

router.get('/', (request, response) => {
  response.render('index', {
    title: 'Главная страница',
    isHome: true // для проверки на ктивный класс с пом. if
  });
});

module.exports = router;