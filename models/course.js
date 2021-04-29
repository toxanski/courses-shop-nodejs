// const uuid = require('uuid/dist/v4'); устарело
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class Course {
  constructor(title, price, img) {
    this.title = title;
    this.price = price;
    this.img = img;
    this.id = uuidv4();
  }

  toJSON() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id 
    }
  }

  async save() { // начинает 1ая
    const courses = await Course.getAll();
    courses.push(this.toJSON());

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses), // save data
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      )
    });
  }

  static getAll() { // возвр. обычный объект JS
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'courses.json'),

        'utf-8',

        (err, content) => {
          if (err) {
            reject(err); 
          } else {
            resolve(JSON.parse(content));
          }
        }
      );

    });
  }

  static async getById(id) {
    const course = await this.getAll();
    return course.find(kurs => kurs.id === id) //если мой id = id(в классе), то ретурн
  }
}

module.exports = Course;