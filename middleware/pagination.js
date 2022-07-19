
/* module.exports = (model) => {
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
} */

const specialPagination = (model, page, limit ) => {


  const totalPages = Math.ceil(model.length / limit);


   let first = {}, second= {}, third = {};


   if(totalPages === 1){ 
      first = {
        value:1,
        current:"paginateCurrent"
      }
    }

   if(totalPages === 2) {
    first={value:1}; 
    second={value : 2}
     if(page === 1){
      first['current'] ="paginateCurrent"
     }else{second['current'] = "paginateCurrent"}
    } 

   if(totalPages === 3){
 
    first={value:1}; 
    second={value : 2}
    third={value : 3}

      if(page === 1){
        first['current'] ="paginateCurrent"
      }else if(page === 2){
        second['current'] = "paginateCurrent"
      }else{
        third['current'] = "paginateCurrent";
      }
  
  }

  if( page === 1 &&  totalPages > 3){
    first={value:1}; 
    second={value : 2}
    third={value : 3}
    first["current"] ="paginateCurrent"
  }

  if(page === 2 && totalPages > 3){
    first={value:1}; 
    second={value : 2}
    third={value : 3}
    second["current"] ="paginateCurrent"
  }

  if( page === 3 && totalPages > 3){
    first={value:1}; 
    second={value : 2}
    third={value : 3}
    third["current"] ="paginateCurrent"
  }

  let counter = 1;

  if(page > 3){
    for(let i = page; i > 0; i--){
      if(counter ===1) third ={ value:i, current: "paginateCurrent"}
      if(counter ===2) second ={ value:i}
      if(counter ===3){
         first={ value:i}
         break;
      }

      counter++
    }
  }


  const startIndex = (page - 1) * limit;
  const  endIndex = page * limit;

  const results = {};

  if(endIndex < model.length){
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

  results.first = first;
  results.second = second;
  results.third = third;
  results.totalPages =  totalPages;
  results.results = model.slice(startIndex, endIndex);
     return results;

}

module.exports.Pagination = specialPagination;