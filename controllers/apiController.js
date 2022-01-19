const Item = require('../models/Item');
const Treasure = require('../models/activity');
const Treveler = require('../models/booking');
const Category = require('../models/category');
const Bank = require('../models/bank');
const Member = require('../models/member');
const Booking = require('../models/booking');



module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find()
            .select('_id title country city price unit imageId')
            .populate({path: 'imageId', select: '_id imageUrl'})
            .limit(5)

            // api category
            const category = await Category.find()
            .select('_id name')
            .limit(3)
            .populate({
                path: 'itemId',
                select: '_id title country city isPopular imageId',
                option: {
                    sort: {sumBooking: -1 }
                },
                perDocumentLimit: 4,
                populate: {
                    path: 'imageId',
                    select: '_id imageUrl',
                    perDocumentLimit: 1
                }
            })

            // logic untuk isPopular
            for(let i = 0; i < category.length; i++){
                for(let x = 0; x < category[i].itemId.length; x++){
                    const item = await Item.findOne({_id: category[i].itemId[x]._id})
                    item.isPopular = false;
                    await item.save();

                    // jika sumBooking nya lebih besar maka isPopular true
                    if(category[i].itemId[0] === category[i].itemId[x]){
                        //  ubah ispopular menjadi true
                        item.isPopular = true;
                        await item.save();
                    }
                }
            }

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Bilal",
                familyOccupation: "Development"
            }

            // api hero
            const treveler = await Treveler.find();
            const treasure = await Treasure.find();
            const city = await Item.find();

            res.status(200).json({
                hero: {
                    treveler: treveler.length,
                    treasure: treasure.length,
                    city: city.length,
                },
                mostPicked,
                category,
                testimonial
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Internal Server Error'})
        }
    },

    detailPage: async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id: id})
            .populate({path: 'imageId', select: '_id imageUrl'})
            .populate({path: 'activityId', select: '_id name type imageUrl'})
            .populate({path: 'featureId', select: '_id name qty imageUrl'})

            const bank = await Bank.find()

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial1.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Bilal",
                familyOccupation: "Development"
            }
            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Internal Server Error'})
        }
    },

    // api booking
    bookingPage: async (req, res) => {
        
        try {
            
            const {
                idItem,
                duration,
                bookingStartDate,
                bookingEndDate,
                firstName,
                lastName,
                email,
                phoneNumber,
                accountHolder,
                bankFrom
            } = req.body;

                // jika image nya kosong
            if(!req.file){
                res.status(404).json({message: "Image Not Found"})
            }
            
            if (
                idItem === undefined ||
                duration === undefined ||
                bookingStartDate === undefined ||
                bookingEndDate === undefined ||
                firstName === undefined ||
                lastName === undefined ||
                email === undefined ||
                phoneNumber === undefined ||
                accountHolder === undefined ||
                bankFrom === undefined) {
                    res.status(404).json({message: "Lengkapi Semua Field"});
                }

            const item = await Item.findOne({_id: idItem})

            if(!item){
                return res.status(404).json({
                    message: "Item Not Found"
                })
            } else {
                item.sumBooking += 1;
                await item.save();
            }

            // jumlah untuk harga keseluruhan
            let total = item.price * duration;
            // total * 10%
            let tax = total * 0.10;
            const invoice = Math.floor(1000000 + Math.random() * 9000000);


            // save member
            const member = await Member.create({
                firstName,
                lastName,
                email,
                phoneNumber
            })

            const newBooking = {
                invoice,
                bookingStartDate,
                bookingEndDate,
                total: total += tax,
                itemId: {
                    _id: item.id,
                    title: item.title,
                    price: item.price,
                    duration: duration
                },
                memberId: member.id,
                payments: {
                    proofPayment: `images/${req.file.filename}`,
                    bankFrom: bankFrom,
                    accountHolder: accountHolder
                }
            }

            // save booking
            const booking = await Booking.create(newBooking)

            // jika semua field data nya terisi
            res.status(201).json({message: "Success Booking", booking})
        } catch (error) {
            console.log(error);
        }
    }

}