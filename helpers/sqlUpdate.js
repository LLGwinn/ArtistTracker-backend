const { BadRequestError } = require("../errors");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * param jsToSql {Object} maps js-style data fields to database column names,
 *   like { city: "base_city", venueCity: "venue_city" }
 *
 * Returns {Object} {sqlSetCols, dataToUpdate}
 *
 * Example {city: 'Houston', venueCity: 'Dallas'} =>
 *   { setCols: '"base_city"=$1, "venue_city"=$2',
 *     values: ['Houston', 'Dallas'] }
 */

function sqlForUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForUpdate };
