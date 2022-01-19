const Category = require('../models/category');
const Bank = require('../models/bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/feature');
const Activity = require('../models/activity');
const Booking = require('../models/booking');
const Member = require('../models/member');
const Users = require('../models/users');
const bcrypt = require('bcryptjs') 
const fs = require('fs-extra');
const path = require('path');


module.exports = {

    viewSigin: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}

            if(req.session.user == null || req.session.user == undefined){
                res.render('index', {
                    alert,
                    title: "Staycation | Login"
                })
            } else {
                res.redirect('/admin/dashboard')
            }
            
        } catch (error) {
            res.redirect('/admin/signin')
        }
    },

    actionSignin: async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await Users.findOne({username: username})

            // jika belom login
            if (!user) {
                req.flash('alertMessage', 'User yang anda masukkan tidak ada')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/signin')
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password)
            // password failed
            if(!isPasswordMatch){
                req.flash('alertMessage', 'Password yang anda masukkan salah')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/signin')
            }

            req.session.user = {
                id: user.id,
                username: user.username
            }

            console.log("session:", req.session.user)

            // jika password true
            res.redirect('/admin/dashboard')
        } catch (error) {
            res.redirect('/admin/signin')
        }
    },

    actionLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/admin/signin')
    },

    viewDashboard: async (req, res) => {
        try {
            const booking = await Booking.find();
            const item = await Item.find();
            const member = await Member.find();
            res.render("admin/dashboard/view_dashboard", {
                title: "Staycation | Dashboard",
                user: req.session.user,
                booking,
                item,
                member
            })
        } catch (error) {
            res.redirect('/admin/dashboard')
        }
    }, 
    viewCategory: async (req, res) => {
        const category = await Category.find()
        const  alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')

        const alert = {message: alertMessage, status: alertStatus}
        res.render("admin/category/view_category", {
            category, 
            alert, 
            title: "Staycation | Category",
            user: req.session.user
        })
    },
    addCategory: async (req, res) => {
        try {
            const {name} = req.body
            await Category.create({name})

            req.flash('alertMessage', 'Success Add Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },
    editCategory: async (req, res) => {
        try {
            const {id, name} = req.body
            const category = await Category.findOne({_id: id})
            category.name = name
            await category.save();

            req.flash('alertMessage', 'Success Update Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }

    },
    deleteCategory: async (req, res) => {
        try {
            const {id} = req.params
            const category = await Category.findOne({_id: id})
            await category.remove()
            
            req.flash('alertMessage', 'Success Delete Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },

    viewBank: async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const bank = await Bank.find()
            const alert = {message: alertMessage, status: alertStatus}
            res.render("admin/bank/view_bank", {
                title: "Staycation | Bank", 
                alert,
                bank,
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    addBank: async (req, res) => {
        try {
            const {name, nomorRekening, nameBank} = req.body
            await Bank.create({
                name,
                nomorRekening,
                nameBank,
                imageUrl: `images/${req.file.filename}`
            });

            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');

            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    editBank: async (req, res) => {
        try {
            const {id, name, nameBank, nomorRekening} = req.body
            const bank = await Bank.findOne({_id: id})

            // logic jika ingin tidak update image
            if(req.file === undefined){
                bank.name = name
                bank.nameBank = nameBank
                bank.nomorRekening = nomorRekening
                // save data
                await bank.save()
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');

                // redirect
                res.redirect('/admin/bank')
            } else {
                // jika ingin update image
                await fs.unlink(path.join(`public/${bank.imageUrl}`))
                bank.name = name
                bank.nameBank = nameBank
                bank.nomorRekening = nomorRekening
                bank.imageUrl = `images/${req.file.filename}`
                // save data
                await bank.save()
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');

                // redirect
                res.redirect('/admin/bank')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    deleteBank: async (req, res) => {
        try {
            const {id} = req.params
            const bank = await Bank.findOne({_id: id})
            await fs.unlink(path.join(`public/${bank.imageUrl}`))
            await bank.remove();
            req.flash('alertMessage', 'Success Update Bank');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },

    viewItem: async (req, res) => {
        try {
            const item = await Item.find()
            .populate({path: 'imageId', select: 'id imageUrl'})
            .populate({path: 'categoryId', select: 'id name'})

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}
            const category = await Category.find()
            res.render("admin/item/view_item", {
                title: "Staycation | Item",
                category,
                alert,
                item,
                action: 'view',
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    addItem: async (req, res) => {
        try {
            const {categoryId, title, price, city, about} = req.body;
            if(req.files.length > 0) {
                const category = await Category.findOne({_id: categoryId});
                const newItem = {
                    categoryId: category._id,
                    title,
                    description: about,
                    price,
                    city
                }

                const item = await Item.create(newItem)
                category.itemId.push({_id: item._id})
                await category.save();
                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({imageUrl: `images/${req.files[i].filename}`})
                    item.imageId.push({_id: imageSave._id})
                    
                    await item.save();
                }
            }
            req.flash('alertMessage', 'Success Update Item');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/item')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },

    showImageItem: async (req, res) => {
        try {
            const {id} = req.params
            const item = await Item.findOne({_id: id})
            .populate({path: 'imageId', select: 'id imageUrl'})
            
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}

            res.render("admin/item/view_item", {
                title: 'Staycation | Show image item',
                alert,
                item,
                action: 'show-image',
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },

    showEditItem: async (req, res) => {

        try {
            const {id} = req.params
            const category = await Category.find()
            const item = await Item.findOne({_id: id})
            .populate({path: 'imageId', select: 'id imageUrl'})
            .populate({path: 'categoryId', select: 'id name'})

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}
            res.render('admin/item/view_item', {
                title: 'Staycation | Edit Item',
                alert,
                category,
                item,
                action: 'edit',
                user: req.session.user
            })
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
            res.redirect('/admin/item')
        }
    },

    editItem: async (req, res) => {
        try {
            const {id} = req.params;
            const {categoryId, title, price, city, about} = req.body;
            const item = await Item.findOne({_id: id})
            .populate({path: 'imageId', select: 'id imageUrl'})
            .populate({path: 'categoryId', select: 'id name'})

            if(req.files.length > 0){
                // update sama images
                for (let i = 0; i < item.imageId.length; i++) {
                    const updateImage = await Image.findOne({_id: item.imageId[i]._id})
                    await fs.unlink(path.join(`public/${updateImage.imageUrl}`))
                    updateImage.imageUrl = `images/${req.files[i].filename}`
                    await updateImage.save()
                }
                item.title = title;
                item.price = price;
                item.city = city;
                item.categoryId = categoryId;
                item.description = about;
                await item.save()
                
                req.flash('alertMessage', 'Success Update Item');
                req.flash('alertStatus', 'success')
                res.redirect('/admin/item')
            }else {
                // update tanpa images
                item.title = title;
                item.price = price;
                item.city = city;
                item.categoryId = categoryId;
                item.description = about;
                await item.save()
                req.flash('alertMessage', 'Success Update Item');
                req.flash('alertStatus', 'success')
                res.redirect('/admin/item')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },

    deleteItem: async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id: id}).populate('imageId')
            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({_id: item.imageId[i]._id})
                .then((image) => {
                    fs.unlink(path.join(`public/${image.imageUrl}`))
                    image.remove();
                })
                .catch((error) => {
                    console.log(error);
                    req.flash('alertMessage', `${error.message}`)
                    req.flash('alertStatus', 'danger')
                    res.redirect('/admin/item')
                })  
            }
            await item.remove()
            req.flash('alertMessage', 'Success Delete Item');
            req.flash('alertStatus', 'success')
            res.redirect('/admin/item')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    
    viewDetailItems: async (req, res) => {
        const {itemId} = req.params;
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}

            const feature = await Feature.find({itemId: itemId})
            const activity = await Activity.find({itemId: itemId})

            res.render('admin/item/detail_item/view_detail_item', {
                title: 'Staycation | Detail Item',
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },

    addFeature: async (req, res) => {
        const {name, qty, itemId} = req.body
        try {
            if(!req.file){
                req.flash('alertMessage', 'Image Not Found');
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl: `images/${req.file.filename}`
            })
            const item = await Item.findOne({_id: itemId})
            item.featureId.push({_id: feature._id})
            await item.save()

            req.flash('alertMessage', 'Success add Feature');
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },

    editFeature: async (req, res) => {
        const {name, qty, id, itemId} = req.body;
        try {
            const feature = await Feature.findOne({_id: id})
            if(req.file == undefined){
                // update tanpa image
                feature.name = name;
                feature.qty = qty;
                await feature.save();

                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }else {
                // update beserta image
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
                feature.name = name;
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`;
                await feature.save();
                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },

    deleteFeature: async (req, res) => {
        const {id, itemId} = req.params;
        try {
            const feature = await Feature.findOne({_id: id})
            const item  = await Item.findOne({_id: itemId}).populate('featureId')

            for (let i = 0; i < item.featureId.length; i++) {
                if(item.featureId[i]._id.toString() === feature._id.toString()){
                    // delete
                    item.featureId.pull({_id: feature._id})
                    await item.save()
                }
            }
            // delete image
            await fs.unlink(path.join(`public/${feature.imageUrl}`))
            await feature.remove()

            req.flash('alertMessage', 'Success Delete Feature');
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },

    addActivity: async (req, res) => {
        const {itemId, name, type} = req.body;
        try {
            if(!req.file){
                req.flash('alertMessage', 'Image Not Found');
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }

            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `/images/${req.file.filename}`
            })

            const item = await Item.findOne({_id: itemId})
            await item.activityId.push({_id: activity._id})
            await item.save();

            req.flash('alertMessage', 'Success add Activity');
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },

    editActivity: async (req, res) => {
        const {id, name, type, itemId} = req.body
        try {
            const activity = await Activity.findOne({_id: id})
            if(req.file == undefined){
                // tidak update image
                activity.name = name;
                activity.type = type;
                await activity.save();

                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }else {
                // update image
                await fs.unlink(path.join(`public/${activity.imageUrl}`))
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `/images/${req.file.filename}`;
                await activity.save();

                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },

    deleteActivity: async (req, res) => {
        const {id, itemId} = req.params;
        try {
            const activity = await Activity.findOne({_id: id})
            const item = await Item.findOne({_id: itemId}).populate('activityId')

            for (let i = 0; i < item.activityId.length; i++) {
                if(item.activityId[i]._id.toString() === activity._id.toString()){
                    item.activityId.pull({_id: activity._id})
                    await item.save();
                }
            }

            await fs.unlink(path.join(`public/${activity.imageUrl}`))
            await activity.remove()

            req.flash('alertMessage', 'Success Delete Activity');
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },

    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find()
            .populate('memberId')
            .populate('bankId')
            console.log(booking)
            res.render("admin/booking/view_booking", {
                title: "Staycation | Booking",
                user: req.session.user,
                booking
            })
        } catch (error) {
            res.redirect('/admin/booking')
        }
    },

    showDeatailBooking: async (req, res) => {
        const {id} = req.params
        try {
            const booking = await Booking.findOne({_id: id})
            .populate('memberId')
            .populate('bankId')

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}

            res.render('admin/booking/show_detail_booking', {
                booking,
                title: 'Staycation | Detail Booking',
                user: req.session.user,
                alert
            })
        } catch (error) {
            res.redirect('/admin/booking')
        }
    },

    actionConfirmation: async (req, res) => {
        const {id} = req.params
        try {
            const booking = await Booking.findOne({_id: id})
            // ubah status
            booking.payments.status = 'Accept';
            // simpan status yang baru ke dalam collection db
            booking.save()
            req.flash('alertMessage', 'Success Confirmation Pembayaran')
            req.flash('alertStatus', 'success')

            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    },

    actionReject: async (req, res) => {
        const {id} = req.params
        try {
            const booking = await Booking.findOne({_id: id})
            booking.payments.status = 'Reject';
            booking.save();
            req.flash('alertMessage', 'Success Reject Pembayaran')
            req.flash('alertStatus', 'success')

            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    }
}