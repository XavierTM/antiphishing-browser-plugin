
const { Domain } = require('./db');


function status_500(err, res) {
    res.sendStatus(500);
    console.log(err);
}


async function getBlacklist(req, res) {

    try {
        const domains = await Domain.findAll();
        res.send(domains);
    } catch (err) {
        status_500(err, res);
    }
}

async function addBlacklist(req, res) {

    try {

        const { domain: domainText } = req.body;
        
        const domain = await Domain.findOne({ where: { domain: domainText }});

        if (!domain) {
            await Domain.create({ domain: domainText })
        } else {
            domain.count++;
            await domain.save();
        }

        res.send();

    } catch (err) {
        status_500(err, res);
    }
}



module.exports = {
    addBlacklist,
    getBlacklist
}