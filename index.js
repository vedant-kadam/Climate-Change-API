const PORT = process.env.PORT || 8000;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express()

const articles = []

const newspapers = [
    {
        name:'theTimes',
        address : 'https://www.thetimes.co.uk/environment/climate-change',
        base : ''
    },
    {
        name:'gurdian',
        address : 'https://www.theguardian.com/environment/climate-crisis',
        base:''
    },
    {
        name:'telegraph',
        address : 'https://www.telegraph.co.uk/climate-change',
        base:'https"//www.telegraph.co.uk'
    }
   
]

newspapers.forEach( (newspaper) =>{

    axios.get(newspaper.address).then((response) => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")',html).each(function()
        {
            const title = $(this).text();
            const url = $(this).attr('href')

            articles.push({
                title,
                url : newspaper.base + url,
                source: newspaper.name
            })
        })

    }).catch((err) => {
        console.log("Error while loading Data")
    });
})

app.get(('/'),(req,res)=>{res.json('Yello')})
// req : Request<P,ResBody,ReqBody,ReqQuery,Locals>,res : Response<ResBody,Locals>

app.get(('/news'),(req,res)=>{
   
    res.json(articles)
})

app.get('/news/:newspaperId' , (req,res)=>{
    const newspapaerID  = req.params.newspaperId

  const newspaperAdd =   newspapers.filter(newspaper => newspaper.name == newspapaerID)[0].address
 const newspaperBase=  newspapers.filter(newspaper=> newspaper.name == newspapaerID)[0].base
   console.log(newspaperAdd)
    axios.get(newspaperAdd).then(response =>{
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")',html).each(
            
            function()
            {
            const title = $(this).text
            const url = $(this).attr('href')

            specificArticles.push({
                title,
                url : newspaperBase + url,
                source : newspapaerID
            })
            }
        )

        res.json(specificArticles);
    }).catch(err =>console.log('erroe while loaing data'))

})

app.listen(PORT , ()=>{
    console.log(`server is running on PORT : ${PORT}`);
})