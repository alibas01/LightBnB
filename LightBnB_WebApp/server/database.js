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
  return pool.query(`
  SELECT id, name, email, password
  FROM users
  WHERE email = $1;
    `, [`${email}`])
  .then(user => {
    if(!user.rows) {
      return null;
    } else {
      return user.rows[0];
    }
  })
  .catch(err => console.error('query error', err.stack));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT id, name, email, password
  FROM users
  WHERE id = $1;
    `, [`${id}`])
  .then(user => {
    if(!user.rows) {
      return null;
    } else {
      return user.rows[0];
    }
  })
  .catch(err => console.error('query error', err.stack));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
    INSERT INTO users (
    name, email, password) 
    VALUES (
    $1, $2, $3)
    RETURNING *;
    `, [`${user.name}`, `${user.email}`, `${user.password}`])
  .then(user => user.rows[0])
  .catch(err => console.error('query error', err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.  property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
`, [`${guest_id}`, `${limit}`])
.then(user => user.rows)
.catch(err => console.error('query error', err.stack));
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
    // 1
    const queryParams = [];
    // 2
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  
    // 3
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    }
    if (options.owner_id) {
      queryParams.push(options.owner_id);
      queryString += `AND owner_id LIKE $${queryParams.length} `;
    }
    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night/100);
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    }
    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night/100);
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    }
    if (options.minimum_rating) {
      queryParams.push(Number(options.minimum_rating));
      queryString += `AND rating >= $${queryParams.length} `;
    }
  
    // 4
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  
    // 5
    console.log(queryString, queryParams);
  
    // 6
    return pool.query(queryString, queryParams)
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
