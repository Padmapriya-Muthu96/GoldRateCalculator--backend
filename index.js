const express=require('express');
const axios=require('axios');
const cors=require('cors')

const api_key='deeccd04c33f06f85a65c6dc80c0281a';

const app=express();
const PORT=3000;
app.use(cors());
app.use(express.json());



//calculate Gold rate by unit, quantity, karat, country

    app.post('/calculate-gold-rate', async (req, res) => {
        const { quantity, unit, karat, country} = req.body;
  try {
    const response = await axios.get('https://api.metalpriceapi.com/v1/latest', {
      params: {
        api_key: 'deeccd04c33f06f85a65c6dc80c0281a',
        base: country,
        currencies: 'EUR,XAU,XAG',
      },
    });

    console.log(response.data);
    // res.json(response.data.rates);

    //calculating gold rate for 1 unit

    
    const goldOunceRate =1/( response.data.rates.XAU); // 1 ounce
    const goldGramRate = goldOunceRate / 31.10; // 1 gram
    const goldKgRate = goldGramRate*1000;  // 1 Kg
    const goldPennyRate = goldGramRate* 1.5552;  // 1 penny
    const goldGrainRate = goldGramRate*  0.0648;  // 1 grain
    const goldPounderGram = goldGramRate* 453.5924;  // 1 pound
    const goldBahtrGram = goldGramRate* 15.2441;  // 1 bhat
    const goldTolaGram = goldGramRate* 11.6638;   // 1 tola
    

    const unitType={
        ounce:goldOunceRate,
        Gram:goldGramRate,
        Kg:goldKgRate,
        Penny:goldPennyRate,
        Grain:goldGrainRate,
        Pounder:goldPounderGram,
        Bahtr:goldBahtrGram,
        Tola:goldTolaGram

    }

  //calculating gold purity
    
const karatType={
     '24k': 0.999,
     '23k': 0.958,
     '22k': 0.916,
     '21k': 0.875,
     '20k': 0.833,
     '19k': 0.792,
     '18k': 0.750,
     '17k': 0.708,
     '16k': 0.667,
     '15k': 0.625,
     '14k': 0.585,
     '13k': 0.542,
     '12k': 0.500,
     '11k': 0.458,
     '10k': 0.417,
     '9k': 0.375,
     '8k': 0.333,
     '7k': 0.292,
     '6k': 0.250

    }


   //calculating total price of gold

    const GoldPrice=unitType[unit]*karatType[karat];
    const totalGoldPrice=quantity*GoldPrice;
    const totalAmount=totalGoldPrice.toFixed(2)
    res.json(`Total Amount of ${quantity} ${unit} ${karat} Gold is ${totalAmount} `);
    console.log(totalAmount);
  } catch (error) {
    console.error('Error fetching metal prices:', error.message);
    res.status(500).json({ error: 'Error fetching metal prices' });
  }
});

//Getting Gold rate History

app.post('/Gold-History', async(req,res)=>{
  const{fromDate, endDate, countrys}=req.body;

try{
const response= await axios.get(`https://api.metalpriceapi.com/v1/timeframe?api_key=${api_key}&start_date=${fromDate}&end_date=${endDate}&base=${countrys}&currencies=XAU`)
 

  console.log(response.data.rates);
  const historyData = response.data.rates;

  const formattedHistory = Object.keys(historyData).map(date => {
    // const goldGramRate = historyData[date].XAU / 31.10;
    const goldOuncesRate = 1/(historyData[date].XAU) ;
    const goldGramRate = goldOuncesRate / 31.10 ;
    const goldGramsRate = goldGramRate.toFixed(2);
    return `${date} Gold Rate per Gram is ${goldGramsRate} ${countrys}`;
  });

  console.log(formattedHistory);
  res.json(formattedHistory);
}
catch(error){
  console.error('Error fetching Gold History:', error.message);
    res.status(500).json({ error: 'Error fetching Gold History' });
}

})

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
