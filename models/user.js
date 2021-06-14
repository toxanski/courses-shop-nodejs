const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Course' // должно совпадать с названием модели курсов
        }
      }
    ]
  }
});

//добавление товара
userSchema.methods.addToCart = function(course) {
  const clonedItems = [...this.cart.items];
  const index = clonedItems.findIndex((kurs) => {
    return kurs.courseId.toString() === course._id.toString(); 
  });

  if (index >= 0) {
    clonedItems[index].count++;
  } else {
    clonedItems.push({
      count: 1,
      courseId: course._id
    });
  }

  const newCart = {
    items: clonedItems
  };
  this.cart = newCart;
  // this.cart = {items}
  // this.cart = {items: clonedItems}; items - подразумевается clonedItems, короткая запись двух верх. строчек
  return this.save();
}

userSchema.methods.removeFromCart = function(id) {
  let clonedItems = [...this.cart.items];
  const index = clonedItems.findIndex(kurs => kurs.courseId.toString() === id.toString());
  // console.log("clone", clonedItems);

  if (clonedItems[index].count === 1) {
    clonedItems = clonedItems.filter(kurs => kurs.courseId.toString() !== id.toString());
    //удаляю с помощью .filter();
  } else {
    clonedItems[index].count--;
  }
  this.cart = {items: clonedItems};
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = {items: []};
  return this.save();
}


module.exports = model('User', userSchema);