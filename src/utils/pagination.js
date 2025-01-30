const pagination = (req) =>{
    const pageNumber = parseInt(req.query.page) || 1 //the selected page number in the query
    const pageSize = parseInt(req.query.limit) || 5 //limits the number of items on a page
    const skip = (pageNumber - 1) * pageSize //skips the first X items on the first page if other pages was selected
    
    return { pageNumber, pageSize, skip }
}

export default pagination