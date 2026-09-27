const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response) {
  const { movie_id } = request.params;
  const data = await service.list(movie_id);
  response.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
