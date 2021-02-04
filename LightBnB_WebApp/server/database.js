const { Pool } = require('pg');

const pool = new Pool({
  user: 'alibas01',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
pool.connect((err) => {
  if(err) throw new Error(err);
  console.log('LightBnB db connected...!')
})

// const cohort = process.argv[2];
// pool.query(`
// SELECT DISTINCT 
// teachers.name AS teacher,
// cohorts.name AS cohort
// FROM assistance_requests
// JOIN teachers 
// ON teachers.id = teacher_id
// JOIN students
// ON students.id = student_id
// JOIN cohorts
// ON cohorts.id = students.cohort_id
// WHERE cohorts.name LIKE $1;
// `, [`%${cohort}%`])
// .then(res => {
//   res.rows.forEach(teacher => {
//     console.log(`${teacher.cohort}:${teacher.teacher}`);
//   })
// })
// .catch(err => console.error('query error', err.stack));


const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return pool.query(`
    SELECT *
    FROM properties
    LIMIT $1;
    `, [`${limit}`])
  .then(data => data.rows)
  .catch(err => console.error('query error', err.stack));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;