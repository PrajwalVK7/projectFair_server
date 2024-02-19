
const projects = require('../Models/projectSchema')


// add project
exports.addProject = async (req, res) => {
    console.log("Inside add project");
    console.log("getting user id in controller");
    const userId = req.payload;
    console.log(userId)
    const projectImage = req.file.filename;
    console.log(projectImage)

    const { title, language, github, website, overview } = req.body;
    try {
        console.log('inside project checking');
        const existingProject = await projects.findOne({ github: github });
        if (existingProject) {
            res.status(406).json("Project already exists, upload a new one")

        } else {
            const newProject = new projects({
                title: title,
                language: language,
                github: github,
                website: website,
                overview: overview,
                projectImage: projectImage,
                userId: userId

            })
            await newProject.save();
            res.status(200).json(newProject)
            console.log(newProject)
        }

    }
    catch (err) {
        console.log(err);
        res.status(401).json(`Project Uploading Failed Due To : ${err}`)
    }


}

exports.getHomeProjects = async (req, res) => {
    try {
        const homeProject = await projects.find().limit(3)
        res.status(200).json(homeProject)
    }
    catch (err) {
        res.status(401).json("Failed Fetching Projects In Home Screen Due to ", err)
    }
}

exports.getAllProjects = async (req, res) => {
    try {
        const searchKey = req.query.search;
        // console.log(searchKey)
        const query = {
            language: {
                // create a regular expression
                //option 'i' is for avoiding case sensitive
                $regex: searchKey, $options: 'i'
            }
        }
        const allProject = await projects.find(query)
        res.status(200).json(allProject)
    }
    catch (err) {
        res.status(401).json("Request failed Due to ", err)
    }
}

exports.getUserProject = async (req, res) => {
    const userId = req.payload;

    try {
        const userProjects = await projects.find({ userId: userId })
        res.status(200).json(userProjects)
    }
    catch (err) {
        res.status(401).json("Request failed Due to ", err)

    }
}

exports.editProject = async(req,res)=>{
    console.log("Inside edit")
    const {id} = req.params;
    // console.log(id);
    const userId = req.payload;
    const {title,language,github,website,overview,projectImage } = req.body
    const uploadProjectImage = req.file?req.file.filename:projectImage

    try{
        const updateProject = await projects.findByIdAndUpdate({_id:id},{
            title:title,
            language:language,
            github:github,
            website:website,
            overview:overview,
            projectImage:uploadProjectImage
        },
        {
            new:true
        })
await updateProject.save()
res.status(200).json("Project Updated Successfully");
    }
    catch(err){
        res.status(401).json("Request Failed due to :",err)
    }

}

exports.deleteProect = async(req,res)=>{
    const {id} = req.params;

    try{
        const deleteProject = await projects.findByIdAndDelete(id);
        if(deleteProject){
            res.status(200).json("Project deleted")
        }
        else{
            res.status(406).json("Failed")
        }

    }
    catch(err){
        res.status(401).json("Request Failed due to :",err)

    }
}