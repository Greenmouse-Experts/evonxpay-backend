//const User = require('../model/user')
// const Picture = require('../model/profilepic')
const cloudinary = require('../util/cloudinary');
const User = require('../model/user');


exports.uploadPicture = async(req, res) => {
    
    try {
       
        var user = await User.findOne({ where: {
            id: req.user.id
        }});
        
        if(user.img_url){
            if(req.file){
                await cloudinary.cloudinary.uploader.destroy(user.img_id) 
                const result = await cloudinary.cloudinary.uploader.upload(req.file.path, {folder: "ProfileImage"});
                await User.update({
                    img_id: result.public_id,
                    img_url: result.secure_url
                }, {
                    where:{
                        id: user.id
                    }
                })

            }else{
                res.json({
                    status: false,
                    message: "No image added"
                })
            }
          
        } else{
            if(req.file){
                const result = await cloudinary.cloudinary.uploader.upload(req.file.path, {folder: "ProfileImage"});
                await User.update({
                    img_id: result.public_id,
                    img_url: result.secure_url
                }, {
                    where:{
                        id: user.id
                    }
                })
            }else{
                res.json({
                    status: false,
                    message: "No image added"
                })
            }       
        
        }
        var userout = await User.findOne({
            where:{
                id: user.id
            },
            attributes: {exclude:["password"]}
        })
        //delete userout.password;
        res.status(201).json({
            status: true,
            message: "Profile picture uploaded",
            data: userout
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An error occured",
             error: error
         })
    }
}

// exports.getPicture = async(req, res) => {
//     try {
//         const picture = await Picture.findOne({ where: {
//             userid: req.user.id
//         }})
//         res.status(200).json({
//             status: true,
//             data: {   
//                 content_id: picture.content_id,
//                 img_url: picture.secure_url
//             }
//         });
//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({
//              status: false,
//              message: "An error occured",
//              error: error
//          })
//     }
// }

exports.deletePicture = async(req, res) => {
    try {
        const user = await User.findOne({ where: {
            id: req.user.id
        }})
        if(user.img_id){
            await cloudinary.cloudinary.uploader.destroy(user.img_id);
            await Picture.update({
                img_id: null,
                img_url: null
            }, {where: {id: req.user.id}})
            res.status(200).json({
                status: true,
                message: "Deleted successfully"
            })
        }else{
            res.json({
                status: false,
                message: "No profile image found"
            })
        }
       
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An error occured",
             error: error
         })
    }
};



