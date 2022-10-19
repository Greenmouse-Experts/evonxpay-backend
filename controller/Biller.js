const Flutterwave = require('flutterwave-node-v3');

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