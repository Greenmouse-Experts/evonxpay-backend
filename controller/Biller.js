const Flutterwave = require('flutterwave-node-v3');
const request = require('request');
var axios = require('axios');
const { random, nanoid } = require('nanoid');

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.getBillers = async (req, res, next) => {
    try {
        const payload = {
            data_bundle: 1
        }
        const bills = await flw.Bills.fetch_bills_Cat(payload);
        if (bills) {
            return res.status(200).json({
                data: bills
            });
        }
    } catch (error) {
        console.log(error)
    }
}

exports.validateBill = async (req, res, next) => {
    console.log(req.body.customer);
    try {
        const payload = {
            item_code: req.body.item_code,
            code: req.body.code,
            customer: req.body.customer,
          };
          const response = await flw.Bills.validate(payload);
          if (response) {
            return res.status(200).json({
                data: response
            });
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getDataBundle = async(req, res) => {
    try {
        const options = {
            url: 'https://api.flutterwave.com/v3/bill-categories?data_bundle=1',
            method: "GET",
            headers: {
                Authorization: 'Bearer FLWSECK_TEST-070b9f437a5ffe039bdb1dcb4d9b62d6-X'
            },
        }
        request(options, (err, response, body) => {
			if (err) {
				res.json({
					error: err
				})
			}else {
				res.status(200)
				.send({
					response,
                    body: JSON.parse(body)
				})
			}
		})
    } catch (error) {
        console.log(error)
    }
}


exports.createBill = (req, res) => {
    var config = {
        'method': 'POST',
         'url': `https://api.flutterwave.com/v3/bills`,
         'headers': {
           'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
           'Content-Type': 'application/json'
         },
           data: {
           country: 'NG',
           customer: req.body.customer,
           amount: req.body.amount,
           recurrence: 'ONCE',
           type: req.body.type,
           reference: nanoid(10),
           biller_name: req.body.biller_name
        }
    };

    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data.data));
        res.status(200)
        .send({
            body: response.data.data
        })
    })
    .catch(function (error) {
        console.log(error.response.data);
        res.status(200)
        .send({
            error: error.response.data
        })
    });

}

exports.validateBVN = async(req, res, next) => {
    try {
        const payload = {"bvn": "123456789010"};
        const response = await flw.Misc.bvn(payload);
        res.status(200)
        .send({
            body: response
        })
    } catch (error) {
        
    }
    
}