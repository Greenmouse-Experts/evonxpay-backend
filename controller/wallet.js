require("dotenv").config();
const paystack = require("paystack")(process.env.PAYSTACK_SECRET);
const User = require("../model/user")
const Transaction = require("../model/transaction");

exports.addToWallet = async(req, res, next)=>{
    const {amount} = req.body
    try {
        await User.findOne({
            where:{
                id: req.user.id
            }
        }).then(async(user) =>{
            if(user){
                paystack.transaction.initialize({
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
            }).catch(err => console.error(err));
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
                paystack.transaction.verify(ref)
                .then(async(transaction) => {
                    console.log(transaction);

                    if(!transaction){
                        res.json({
                            status: false,
                            message: `Transaction on the reference no: ${ref} not found`
                        })
                    }

                    var trnx = new Transaction({
                        userId: transaction.data.metadata.userId,
                        ref_no: ref,
                        status: transaction.data.status,
                        type: transaction.data.metadata.type,
                        price: `${transaction.data.currency} ${transaction.data.amount / 100}`,
                        description: transaction.data.metadata.description,
                    })

                    var savetrnx = await trnx.save();
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
                   
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    } catch (error) {
        console.log(error);
        next(error);
    }
}