const Camp = require('../models/camp'); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const camps = await Camp.find({});
    res.render('./camps/index', { camps });
}
module.exports.newPage = (req, res) => {
    res.render('./camps/new');
}
module.exports.showPage = async (req, res) => {// Read
    const camp = await Camp.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author'); // must populate items that are connected through id in server
    if (!camp) {
        req.flash('error', 'Could not find camp!');
        return res.redirect('/camps');
    }
    res.render('./camps/show', { camp });
}
module.exports.editPage = async (req, res) => {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'Could not find camp!');
        return res.redirect('/camps');
    }
    res.render('./camps/edit', { camp });
}
module.exports.createCamp = async (req, res, next) => { // Create 
    const geoCode = await geocoder.forwardGeocode({
        query: req.body.camp.location,
        limit: 1
    }).send()
    const camp = new Camp(req.body.camp);
    // loop over all files adding url as path and filename to add to images array on camp model
    camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    camp.geography = geoCode.body.features[0].geometry;
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', `${camp.title} has been created`);
    res.redirect(`/camps/${camp._id}`);
}
module.exports.editCamp = async (req, res) => { // Update
    const { id } = req.params;
    const camp = await Camp.findByIdAndUpdate(id, req.body.camp);
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', `${camp.title} has been updated`);
    res.redirect(`/camps/${camp._id}`);
}
module.exports.deleteCamp = async (req, res) => { 
    const camp = await Camp.findByIdAndDelete(req.params.id);
    req.flash('success', `${camp.title} has been deleted`);
    res.redirect('/camps');
}