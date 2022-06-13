const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
// const Investment = require("../models/investmentModel");
// const Saving = require("../models/savingModel");
// const { investments } = require("./transactionController");


const handleCron = () => {
  try {
      /* User.find().then(users =>{
        users.forEach( function(user) {
          var i = 0;
          var Sum = [];
          Transaction.find({ user: user._id }).then(transactions => {
            transactions.forEach(function (transaction) {
              const today = new Date() 
              const updatedDate = new Date(transaction.updatedAt);
              const diffTime = Math.abs(today - updatedDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

              if(diffDays === 30) {
                if(transaction.type === 'deposit') {
                  if(transaction.depositType == 'Investment') {
                    Investment.find({ name: transaction.packageType }).then(investments => {
                      investments.forEach(async function (package) {
                        const returns = (parseInt(package.percentage) / 100) * parseInt(transaction.amount);
                        Sum.push(returns)
                        const trans = await Transaction.findById(transaction._id);
                        await trans.updateOne({ updatedAt: today });
                        i ++;
                        if(i === transactions.length) {
                          const userDetails = await User.findById(user._id);
                          var value = Sum.reduce((v, i) => (v + i)) + userDetails.wallet
                          await userDetails.updateOne({ wallet: value });
                          console.log('done')
                        }
                      })
                    })
                  } else if (transaction.depositType == 'Savings'){
                    Saving.find({ name: transaction.packageType }).then(savings => {
                      savings.forEach(async function (package) {
                        const returns = (parseInt(package.percentage) / 100) * parseInt(transaction.amount);
                        Sum.push(returns)
                        const trans = await Transaction.findById(transaction._id);
                        await trans.updateOne({ updatedAt: today });
                        i ++;
                        if(i === transactions.length) {
                          const userDetails = await User.findById(user._id);
                          var value = Sum.reduce((v, i) => (v + i)) + userDetails.wallet
                          await userDetails.updateOne({ wallet: value });
                          console.log('done')
                        }
                      })
                    })
                  }
                }
              }
            })
          })
        })
      }) */
      
  } catch (e) {
    console.log(e);
  }
};

module.exports = handleCron;
