var jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).send({ auth: false, message: 'Token não fornecido' })
  var token = req.headers.authorization.split(' ')[1]

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Token inválido' })
    
    // Se tudo estiver correto salva no request p/ uso posterior
    req.userId = decoded.id
    next()
  })
  // if (req.originalUrl === '/user/login' || req.originalUrl === '/user/signup' || req.originalUrl.indexOf("/agendas/getAllByInterval") !== -1) {
  //   next()
  // } else {
  // }
}
