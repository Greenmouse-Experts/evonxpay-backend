require("dotenv").config();
//const paystack = require("paystack")(process.env.PAYSTACK_SECRET);
const Flutterwave = require('flutterwave-node-v3');
const User = require("../model/user")
const Transaction = require("../model/transaction");
const { nanoid } = require("nanoid");
var axios = require('axios');

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.addToWallet = async(req, res, next)=>{
    const {amount} = req.body
    try {
        await User.findOne({
            where:{
                id: req.user.id
            }
        }).then(async(user) =>{
            if(user){
                /* paystack.transaction.initialize({
                name: `Funding Wallet with ${amount}`,
                amount: amount * 100,
                email: req.user.email,
                callback_url: `${process.env.BASE_URL}/api/pay/verify`,
                channels: ['card', 'bank', 'ussd', 'bank_transfer'],
                transaction_charge: 35000,
                metadata:{
                    user_id: req.user.id,
                    type: "wallet",
                    description: `Funding Wallet with ${amount}`,
                }
            }).then(async( transaction) =>{
                console.log(transaction)
                res.json({
                    transaction: transaction
                })
            }).catch(err => console.error(err)); */
            const new_amount = parseInt(amount)+10
            console.log(new_amount);
            axios.post("https://api.flutterwave.com/v3/payments", {
                        tx_ref: nanoid(12),
                        amount: `${new_amount}`,
                        currency: "NGN",
                        redirect_url: `${process.env.BASE_URL}/api/pay/verify`,
                        meta: {
                            consumer_id: req.user.id,
                            consumer_mac: "wallet",
                            description: `Funding Wallet with ${amount}`
                        },
                        customer: {
                            email: req.user.email,
                            phonenumber: req.user.phone_no,
                            name: req.user.firstname+' '+req.user.lastname,
                        },
                        customizations: {
                            title: `Funding Wallet with ${amount}`,
                            logo: "https://evonxpay.vercel.app/favicon.png"
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
                            'Content-Type': 'application/json'
                        },
                    }
                    ).then(async( response) =>{
                        console.log(response.data.data)
                        res.json({
                            transaction: response.data.data
                        })
                    }).catch(err => console.error(err)); 
                /* if (response) {
                    console.log(response)
                } */
            }else{
                res.json({
                    status: false,
                    message: "Please log in"
                })
            }
            
        })
        
    } catch (error) {
        console.log(error),
        next(error)
    }
}

exports.verify = async(req, res, next)=>{
    //console.log(req.query.trxref)
    const ref = req.query.trxref;
    try {
        await Transaction.findOne({
            where:{
                ref_no: ref
            }
        }).then(async(trn)=>{
            if(trn){
                res.json({
                    status: false,
                    message: "Payment Already Verified"
                })
            }else{
                //const transactionDetails = await Transaction.find({ref: req.query.tx_ref});
                const response = await flw.Transaction.verify({id: req.query.reference});
                console.log(response.data)
                if (
                    response.data.status === "successful"
                    && response.data.currency === "NGN") {
                    // Success! Confirm the customer's payment
                    console.log(response.data)
                    var trnx = new Transaction({
                        userId: response.data.meta.consumer_id,
                        ref_no: response.data.tx_ref,
                        status: response.data.status,
                        type: response.data.meta.consumer_mac,
                        price: `${response.data.currency} ${response.data.amount - 10}`,
                        description: response.data.meta.description,
                    })

                    var savetrnx = await trnx.save();
                    console.log(savetrnx)
                    if(savetrnx){
                         await User.findOne({
                        where:{
                            id: savetrnx.userId
                        }
                    }).then(async(user)=>{
                        if(user){
                            if(savetrnx.type === 'wallet'){
                                var new_balance = user.balance + (response.data.amount - 10)

                                await User.update({
                                    balance: new_balance
                                }, {
                                    where:{
                                        id: user.id
                                    }
                                }).catch(err => console.log(err))
                            }
                        }else{
                            res.json({
                                status: false,
                                message: "User not found"
                            })
                        }
                    }).catch(err => console.log(err))
                    }

                    res.json({
                        status: true,
                        message: `Payment ${response.message}`,
                        transaction: savetrnx
                    })
                } else {
                    // Inform the customer their payment was unsuccessful
                }
               /*  paystack.transaction.verify(ref)
                .then(async(transaction) => {
                    console.log(transaction);

                    if(!transaction){
                        res.json({
                            status: false,
                            message: `Transaction on the reference no: ${ref} not found`
                        })
                    }

                    var trnx = new Transaction({
                        userId: transaction.data.metadata.user_id,
                        ref_no: ref,
                        status: transaction.data.status,
                        type: transaction.data.metadata.type,
                        price: `${transaction.data.currency} ${transaction.data.amount / 100}`,
                        description: transaction.data.metadata.description,
                    })

                    var savetrnx = await trnx.save();
                    console.log(savetrnx)
                    if(savetrnx){
                         await User.findOne({
                        where:{
                            id: savetrnx.userId
                        }
                    }).then(async(user)=>{
                        if(user){
                            if(savetrnx.type === 'wallet'){
                                var new_balance = user.balance + (transaction.data.amount / 100)

                                await User.update({
                                    balance: new_balance
                                }, {
                                    where:{
                                        id: user.id
                                    }
                                }).catch(err => console.log(err))
                            }
                        }else{
                            res.json({
                                status: false,
                                message: "User not found"
                            })
                        }
                    }).catch(err => console.log(err))
                    }

                    res.json({
                        status: true,
                        message: `Payment ${transaction.message}`,
                        transaction: savetrnx
                    })
                   
                }).catch(err => console.log(err)) */
            }
        }).catch(err => console.log(err))
    } catch (error) {
        console.log(error);
        next(error);
    }
}