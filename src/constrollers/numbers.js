const numbers = (app) => ({

    check: (req, res) => {

        if (msg_error) res.status(401).json({ "code": 401, "status": "error", "message": msg_error });
        if (!msg_error && !err) res.status(200).json({ "code": 200, "status": "success", "data": participante })

    }

})

export default numbers;