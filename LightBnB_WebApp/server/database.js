const { Pool } = require('pg');

const pool = new Pool({
  user: 'alibas01',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
pool.connect((err) => {
  if(err) throw new Error(err);
  console.log('LightBnB database connected...!')
})



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
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  INSERT INTO properties (
    title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
    VALUES (
      `;
      
      if (property.title) {
        queryParams.push(`${property.title}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.description) {
        queryParams.push(`${property.description}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.owner_id) {
        queryParams.push(Number(property.owner_id));
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(0);
        queryString += `$${queryParams.length}, `;
      }
      if (property.cover_photo_url) {
        queryParams.push(`${property.cover_photo_url}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.thumbnail_photo_url) {
        queryParams.push(`${property.thumbnail_photo_url}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.cost_per_night) {
        queryParams.push(property.cost_per_night);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(0);
        queryString += `$${queryParams.length}, `;
      }
      if (property.paking_spaces) {
        queryParams.push(property.paking_spaces);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(0);
        queryString += `$${queryParams.length}, `;
      }
      if (property.number_of_bathrooms) {
        queryParams.push(Number(property.number_of_bathrooms));
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(0);
        queryString += `$${queryParams.length}, `;
      }
      if (property.number_of_bedrooms) {
        queryParams.push(Number(property.number_of_bedrooms));
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(0);
        queryString += `$${queryParams.length}, `;
      }
      queryString += `true, `
      if (property.province) {
        queryParams.push(`${property.province}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.city) {
        queryParams.push(`${property.city}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.country) {
        queryParams.push(`${property.country}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.street) {
        queryParams.push(`${property.street}`);
        queryString += `$${queryParams.length}, `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length}, `;
      }
      if (property.post_code) {
        queryParams.push(`${property.post_code}`);
        queryString += `$${queryParams.length} `;
      } else {
        queryParams.push(' ');
        queryString += `$${queryParams.length} `;
      }

  // 4
  queryString += `)
  RETURNING *;
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
.then(data => data.rows)
.catch(err => console.error('query error', err.stack));
}
exports.addProperty = addProperty;
