const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

async function list(movie_id) {
  const theaters = db("theaters")
    .join(
      "movies_theaters",
      "movies_theaters.theater_id",
      "theaters.theater_id"
    );

  if (movie_id) {
    return theaters
      .select("theaters.*", "movies_theaters.movie_id", "movies_theaters.is_showing")
      .where({ "movies_theaters.movie_id": movie_id })
      .then((rows) =>
        rows.map((theater) => ({
          ...theater,
          is_showing: Boolean(theater.is_showing),
        }))
      );
  }

  return theaters
    .join("movies", "movies.movie_id", "movies_theaters.movie_id")
    .then(reduceMovies);
}

module.exports = {
  list,
};
