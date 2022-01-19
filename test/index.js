const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const fs = require('fs')


chai.use(chaiHttp)

describe('API ENDPOINT TESTING', () => {
    it('Get Landing Page', (done) => {
        chai.request(app).get('/api/v1/member/landing-page').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            // testing hero
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('hero')
            expect(res.body.hero).to.have.all.keys('treveler', 'treasure', 'city')
            // testing mostpicked
            expect(res.body).to.have.property('mostPicked')
            expect(res.body.mostPicked).to.have.an('array')
            // testing category
            expect(res.body).to.have.property('category')
            expect(res.body.category).to.have.an('array')
            // testing testimonial
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('object')
            done()
        })
    })

    it('Get Detail Page', (done) => {
        chai.request(app).get('/api/v1/member/detail-page/5e96cbe292b97300fc902222').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            // testing 
            expect(res.body).to.have.property('title')
            expect(res.body).to.have.property('price')
            expect(res.body).to.have.property('country')
            expect(res.body).to.have.property('city')
            expect(res.body).to.have.property('unit')
            expect(res.body).to.have.property('sumBooking')
            expect(res.body).to.have.property('isPopular')
            expect(res.body).to.have.property('description')
            // testing image
            expect(res.body).to.have.property('imageId')
            expect(res.body.imageId).to.have.an('array')
            // testing feature
            expect(res.body).to.have.property('featureId')
            expect(res.body.featureId).to.have.an('array')
            // testing activity
            expect(res.body).to.have.property('activityId')
            expect(res.body.activityId).to.have.an('array')
            expect(res.body).to.have.property('__v')
            // testing bank 
            expect(res.body).to.have.property('bank')
            expect(res.body.bank).to.have.an('array')
            // teting testimonial
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('object')
            done()
        })
    })

    it('Post Booking Page', (done) => {
        const image = __dirname + '/buktiBayar.jpeg';
        const dataSample = {
            image,
            idItem: '5e96cbe292b97300fc902222',
            duration: 8,
            bookingStartDate: '1-18-2022',
            bookingEndDate: '1-28-2022',
            firstName: 'Annisa',
            lastName: 'Azizah',
            email: 'annisa10@gmail.com',
            phoneNumber: '083563353',
            accountHolder: 'annisa',
            bankFrom: 'BRI'
        }
        chai.request(app).post('/api/v1/member/booking-page')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('idItem', dataSample.idItem)
        .field('duration', dataSample.duration)
        .field('bookingStartDate', dataSample.bookingStartDate)
        .field('bookingEndDate', dataSample.bookingEndDate)
        .field('firstName', dataSample.firstName)
        .field('lastName', dataSample.lastName)
        .field('email', dataSample.email)
        .field('phoneNumber', dataSample.phoneNumber)
        .field('accountHolder', dataSample.accountHolder)
        .field('bankFrom', dataSample.bankFrom)
        // attach file => melampirkan file
        .attach('image', fs.readFileSync(dataSample.image), 'buktiBayar.jpeg')
        .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(201)
            expect(res.body).to.be.an('object')
            // testing message
            expect(res.body).to.have.property('message')
            // testing menggunkan equal yaitu melakukan persamaan message === "success booking"
            expect(res.body.message).to.equal('Success Booking')
            // testing booking
            expect(res.body).to.have.property('booking')
            expect(res.body.booking).to.have.all.keys(
                'bookingStartDate', 'bookingEndDate', 'invoice', 
                'itemId', 'total', 'memberId', 'payments', '_id', '__v' 
            )
            // testing itemId dan payments yg type object yg mempunya all keys atau banyak key di setiap object
            expect(res.body.booking.itemId).to.have.all.keys('_id', 'title', 'price', 'duration')
            expect(res.body.booking.payments).to.have.all.keys('proofPayment', 'bankFrom', 'accountHolder', 'status')
            done()
        })
    })
})