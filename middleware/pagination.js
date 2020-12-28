
module.exports = (model) => {
  return async (req, res, next)=>{
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      const startIndex = (page - 1) * limit;
      const  endIndex = page * limit;

      const results = {};

      if(endIndex < model.countDocuments().exec()){
          results.next = {
              page : page + 1,
              limit: limit
          }
      }

      if(startIndex > 0){
        results.previous = {
            page : page - 1,
            limit: limit
        }
      }

      results.results = await model.find().skip(startIndex).limit(limit)
      res.paginatedResults = results;
      next();
  }
}