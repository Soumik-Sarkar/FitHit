const Gym = require('../models/gym');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder= mbxGeocoding({accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    if (req.query.search) {
        const searchQuery = new RegExp(escapeRegExp(req.query.search), 'gi');
        Gym.find({ title: searchQuery }, (err, foundGyms) => {
          if (err) {
            console.error(err);
            return res.redirect('/gyms');
          }
          if (foundGyms < 1) {
            req.flash('error', 'No Fitness Centre could be found using the search term provided.');
            return res.redirect('/gyms');
          }
          res.render('gyms/index', { gyms: foundGyms});
        });
      } else {
        const gyms = await Gym.find({});
        res.render('gyms/index', { gyms })
      }
}

module.exports.renderNewForm = (req, res) => {
    res.render('gyms/new');
}

module.exports.createGym =async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.gym.location,
        limit: 1
    }).send();
    const gym = new Gym(req.body.gym);
    gym.geometry = geoData.body.features[0].geometry;
    gym.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.author = req.user._id;
    await gym.save();
    req.flash('success','Successfully Made A New Fitness Centre')
    res.redirect(`/gyms/${gym._id}`)
}
module.exports.showGym = async (req, res,) => {
    const gym = await Gym.findById(req.params.id).populate({path: 'reviews' , populate :{path: 'author'}}).populate('author');
    if(!gym){
        req.flash('error','Cannot Find The Fitness Centre');
        return res.redirect('/gyms');
    }
    res.render('gyms/show', { gym });
}

module.exports.renderEditForm = async (req, res) => {
    const gym = await Gym.findById(req.params.id)
    if(!gym){
        req.flash('error','Cannot Find The Fitness Centre');
        return res.redirect('/gyms');
    }
    res.render('gyms/edit', { gym });
}

module.exports.updateGym = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.images.push(...imgs);
    await gym.save();
    console.log(req.body.deleteImages)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
          await  cloudinary.uploader.destroy(filename);
        }
        await gym.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} }}})
    }
    req.flash('success','Successfully Updated The Fitness Centre')
    res.redirect(`/gyms/${gym._id}`)
}

module.exports.deleteGym = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    if(gym.images.length){
        gym.images.forEach(async(img) =>{
          await  cloudinary.uploader.destroy(img.filename);
        })
    }
    await Gym.findByIdAndDelete(id);
    res.redirect('/gyms');
}

function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }