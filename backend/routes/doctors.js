const express = require('express');
const Doctor = require('../models/Doctor');
const router = express.Router();


//add doctor
router.post('/add-doctor', async (req,res) => {
    try{
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).send(doctor);
    }catch(error){
        res.status(400).send(error);
    }
});


//list doctors with filters
router.get('/list-doctors', async(req,res) => {
    const { page = 1, limit = 10, ...filters } = req.query;

    const query = {};
    if(filters.availability) query.availability = filters.availability;
    if(filters.consultationType) query.consultationType = filters.consultationType;
    if(filters.minExperience) query.experience = { $gte: filters.minExperience }

    try{
        const doctors = await Doctor.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.send({
            total: await Doctor.countDocuments(query),
            page: parseInt(page),
            limit: parseInt(limit),
            doctors
        });
    }catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;