const db = require('../db')

const login = (req, callback) => {
    let sql = `SELECT * FROM admin_wa WHERE username = '${req.body.username}' AND password = '${req.body.password}'`
    let hasil

    console.log('query login :: ', sql)
    
    db.pool.query(sql, (err, result) => {
        hasil = result
        
        if (err) {
            console.log('errornya', err.message)
            req.session.destroy()
            return callback({
                status: false,
                message: err.message
            })
        } else {
            console.log('hasil login ', hasil[0].username)
            if (hasil[0].username) {
                // req.session.userId = hasil[0].id
                // req.session.username = hasil[0].username
                // req.session.save()
                
                return callback({
                    status: true,
                    message: 'berhasil login',
                    data: {
                        id: hasil[0].id,
                        username: hasil[0].username
                    }
                })
            } else {
                req.session.destroy()
                return callback({
                    status: false,
                    message: 'data username atau password tidak di temukan',
                    data: null
                })
            }
        }
    })
    
}

const update_status_login = (id, callback) => {
    let sql = `UPDATE admin_wa SET status_login = 1 WHERE id = '${id}'`
    db.pool.query(sql, (err, result) => {
        return callback(result[0])
    })
}

const get_login = () => {

}

module.exports = {
    login,
    get_login
}