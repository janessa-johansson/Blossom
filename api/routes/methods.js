get = (req, res) => {
    res.append('custom-response-header', 'yep');
    res.send('You sent a GET request and got a custom response header');
  
  }
  
  post = (req, res) => {
    response = 'You sent a POST, I will respond with a status of 201 (created) even though I did not';
    res.status(201).send(response)
  
  }
  
  put = (req, res) => {
    response = 'You sent a PUT'
    res.status(200).send(response)
  }
  
  del = (req, res) => {
    response = 'you sent a DELETE'
    res.status(204).send(response)
  }
  
  module.exports = {
    get: get,
    post: post,
    put: put,
    delete: del
  } 