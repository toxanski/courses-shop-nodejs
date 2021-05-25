window.addEventListener('DOMContentLoaded', () => {
  const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(price);
  }
  
  document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
  });
  
  //ajax (удалить с корзины)
  const $card = document.querySelector('#card');
  if ($card) {
    $card.addEventListener('click', (event) => {
      if (event.target.classList.contains('js-remove')) {
        const id = event.target.dataset.id;
  
        fetch('/card/remove/' + id, {
          method: 'delete'
        })
        .then(res => res.json())
        .then(card => {
          console.log(card);
          if (card.courses.length) {
            const html = card.courses.map((kurs) => {
              return `
              <tr>
                <td>${kurs.title}</td>
                <td>${kurs.count}</td>
                <td>
                  <button class="btn btn-small js-remove" data-id="${kurs.id}">Удалить</button>
                </td>
              </tr>`
            }).join('');

            console.log(html);
  
            $card.querySelector('tbody').innerHTML = html;
            $card.querySelector('.price').textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = '<p>Корзина пуста!</p>'
          }
        });
      }
    });
  }
  
  
  
});